import React, { useEffect, useState } from 'react';
import { getUsers, getTransactions, getServices, updateServiceStatus, refundTransaction } from '../utils/db';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [pendingServices, setPendingServices] = useState([]);

    const refreshData = () => {
        setUsers(getUsers());
        setTransactions(getTransactions());
        const allServices = getServices();
        setPendingServices(allServices.filter(s => s.status === 'pending'));
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleServiceAction = (id, status) => {
        updateServiceStatus(id, status);
        refreshData();
    };

    const handleRefund = (id) => {
        if (window.confirm('Are you sure you want to refund this transaction?')) {
            refundTransaction(id);
            refreshData();
        }
    };

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h2>Admin Dashboard</h2>

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
        </div>
    );
};

export default AdminDashboard;
