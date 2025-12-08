import React, { useEffect, useState } from 'react';
import { getUsers, getTransactions, getServices, updateServiceStatus, refundTransaction } from '../utils/db';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingServices, setPendingServices] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [trackingLogs, setTrackingLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    const refreshData = () => {
        setUsers(getUsers());
        setTransactions(getTransactions());
        const allServices = getServices();
        setPendingServices(allServices.filter(s => s.status === 'pending'));
        const allBookings = JSON.parse(localStorage.getItem('plumber_bookings') || '[]');
        setPendingBookings(allBookings.filter(b => b.status === 'pending_approval'));
    };

    useEffect(() => {
        refreshData();

        // Realtime logs listener
        const q = query(collection(db, 'user_tracking_logs'), orderBy('timestamp', 'desc'), limit(100));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to date safely
                date: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toLocaleString() : 'Just now'
            }));
            setTrackingLogs(logs);
        });

        return () => unsubscribe();
    }, []);

    const handleServiceAction = (id, status) => {
        updateServiceStatus(id, status);
        refreshData();
    };

    const handleBookingAction = (id, status) => {
        const bookings = JSON.parse(localStorage.getItem('plumber_bookings') || '[]');
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index].status = status;
            localStorage.setItem('plumber_bookings', JSON.stringify(bookings));
            refreshData();
        }
    };

    const handleRefund = (id) => {
        if (window.confirm('Are you sure you want to refund this transaction?')) {
            refundTransaction(id);
            refreshData();
        }
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        try {
            const currentUsers = getUsers();
            if (currentUsers.find(u => u.email === newUser.email)) {
                alert('User already exists');
                return;
            }
            const userToAdd = { ...newUser, id: 'user_' + Date.now() };
            currentUsers.push(userToAdd);
            localStorage.setItem('plumber_users', JSON.stringify(currentUsers));
            alert('User created successfully!');
            setNewUser({ name: '', email: '', password: '', role: 'customer' });
            refreshData();
        } catch (err) {
            alert('Error creating user');
        }
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Tracking Sheet
        const wsTracking = XLSX.utils.json_to_sheet(trackingLogs.map(log => ({
            Type: log.type,
            Action: log.actionType || '-',
            Page: log.page || log.path || '-',
            Time: log.date,
            Location: log.location ? JSON.stringify(log.location) : '-',
            Details: log.details ? JSON.stringify(log.details) : '-'
        })));
        XLSX.utils.book_append_sheet(wb, wsTracking, "User Activity");

        // Users Sheet
        const wsUsers = XLSX.utils.json_to_sheet(users);
        XLSX.utils.book_append_sheet(wb, wsUsers, "Users");

        // Transactions Sheet
        const wsTrans = XLSX.utils.json_to_sheet(transactions);
        XLSX.utils.book_append_sheet(wb, wsTrans, "Transactions");

        XLSX.writeFile(wb, "PlumberPro_Data.xlsx");
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h2>Admin Dashboard</h2>

            <div className="admin-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'overview' ? '#007bff' : 'none', color: activeTab === 'overview' ? 'white' : 'black', border: 'none' }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('tracking')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === 'tracking' ? '#007bff' : 'none', color: activeTab === 'tracking' ? 'white' : 'black', border: 'none' }}
                >
                    Active Users & Tracking
                </button>
            </div>

            {activeTab === 'tracking' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3>Live User Activity</h3>
                        <button onClick={exportToExcel} className="btn btn-success" style={{ backgroundColor: '#28a745' }}>Download Excel Report</button>
                    </div>
                    <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto', border: '1px solid #ddd' }}>
                        <table className="table" style={{ width: '100%', fontSize: '14px' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                                <tr>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Action / Page</th>
                                    <th>Details</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trackingLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td>{log.date}</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: log.type === 'visit' ? '#e2e3e5' : '#cce5ff',
                                                fontSize: '12px'
                                            }}>
                                                {log.type}
                                            </span>
                                        </td>
                                        <td>{log.actionType || log.path}</td>
                                        <td>
                                            {log.details ? (
                                                <pre style={{ margin: 0, fontSize: '11px' }}>{JSON.stringify(log.details, null, 2)}</pre>
                                            ) : '-'}
                                        </td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {log.location ? JSON.stringify(log.location) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'overview' && (
                <>
                    {/* Create User Section */}
                    {/* ... (Existing sections) ... */}

                    <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>➕ Register New User</h3>
                        <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                            <input type="text" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required style={{ padding: '8px' }} />
                            <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required style={{ padding: '8px' }} />
                            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required style={{ padding: '8px' }} />
                            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ padding: '8px' }}>
                                <option value="customer">Customer</option>
                                <option value="agent">Service Agent</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="btn btn-primary" style={{ padding: '8px 15px' }}>Create</button>
                        </form>
                    </div>

                    {/* Pending Bookings Section */}
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#e2e3e5', borderRadius: '8px' }}>
                        <h3>📅 Pending Booking Approvals</h3>
                        {pendingBookings.length === 0 ? (
                            <p>No pending bookings.</p>
                        ) : (
                            <table className="table" style={{ width: '100%', marginTop: '10px', backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Service</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Customer</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingBookings.map(bk => (
                                        <tr key={bk.id}>
                                            <td style={{ padding: '10px' }}>{bk.serviceTitle}</td>
                                            <td style={{ padding: '10px' }}>{bk.customerName}</td>
                                            <td style={{ padding: '10px' }}>{bk.price}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button
                                                    className="btn btn-success"
                                                    style={{ marginRight: '10px', padding: '5px 10px', fontSize: '12px' }}
                                                    onClick={() => handleBookingAction(bk.id, 'booked')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                                    onClick={() => handleBookingAction(bk.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pending Services Section */}
                    <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                        <h3>⚠️ Pending Service Approvals</h3>
                        {pendingServices.length === 0 ? (
                            <p>No pending services.</p>
                        ) : (
                            <table className="table" style={{ width: '100%', marginTop: '10px', backgroundColor: 'white' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Service</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Agent ID</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingServices.map(svc => (
                                        <tr key={svc.id}>
                                            <td style={{ padding: '10px' }}>{svc.title}</td>
                                            <td style={{ padding: '10px' }}>{svc.agentId}</td>
                                            <td style={{ padding: '10px' }}>{svc.price}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button
                                                    className="btn btn-success"
                                                    style={{ marginRight: '10px', padding: '5px 10px', fontSize: '12px' }}
                                                    onClick={() => handleServiceAction(svc.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                                    onClick={() => handleServiceAction(svc.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3>Registered Users</h3>
                        <table className="table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>Email</th>
                                    <th style={{ padding: '10px' }}>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{user.name}</td>
                                        <td style={{ padding: '10px' }}>{user.email}</td>
                                        <td style={{ padding: '10px', textTransform: 'capitalize' }}>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3>All Transactions</h3>
                        <table className="table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Service</th>
                                    <th style={{ padding: '10px' }}>Amount</th>
                                    <th style={{ padding: '10px' }}>Date (UTC)</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(txn => (
                                    <tr key={txn.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{txn.id}</td>
                                        <td style={{ padding: '10px' }}>{txn.service}</td>
                                        <td style={{ padding: '10px' }}>₹{txn.amount}</td>
                                        <td style={{ padding: '10px' }}>{txn.timestamp}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: txn.status === 'refunded' ? '#f8d7da' : '#d4edda',
                                                color: txn.status === 'refunded' ? '#721c24' : '#155724'
                                            }}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {txn.status !== 'refunded' && (
                                                <button
                                                    onClick={() => handleRefund(txn.id)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Refund
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
