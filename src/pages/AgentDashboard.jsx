import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAgentServices, getAgentBookings, addService, updateBookingStatus, getInquiries } from '../utils/db';

const InquiriesList = () => {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        setInquiries(getInquiries());
    }, []);

    const openLocation = (loc) => {
        if (loc && loc.lat && loc.lng) {
            window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
        } else {
            alert('Location data not available.');
        }
    };

    const downloadInquiries = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(inquiries, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "inquiries.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div>
            <div style={{ marginBottom: '10px', textAlign: 'right' }}>
                <button
                    onClick={downloadInquiries}
                    className="btn btn-secondary"
                    disabled={inquiries.length === 0}
                    style={{ fontSize: '14px', padding: '8px 12px' }}
                >
                    ⬇️ Download JSON
                </button>
            </div>
            <table className="table" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '10px' }}>Date</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Phone</th>
                        <th style={{ padding: '10px' }}>Message</th>
                        <th style={{ padding: '10px' }}>Location / Address</th>
                    </tr>
                </thead>
                <tbody>
                    {inquiries.map(inq => (
                        <tr key={inq.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{new Date(inq.timestamp).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>{inq.name}</td>
                            <td style={{ padding: '10px' }}>{inq.phone}</td>
                            <td style={{ padding: '10px' }}>{inq.message}</td>
                            <td style={{ padding: '10px' }}>
                                {inq.location ? (
                                    <div>
                                        <div style={{ fontSize: '0.85rem', marginBottom: '5px', maxWidth: '200px', whiteSpace: 'normal' }}>
                                            {inq.location.address || 'Coords only'}
                                        </div>
                                        <button
                                            onClick={() => openLocation(inq.location)}
                                            className="btn btn-secondary"
                                            style={{ padding: '5px 10px', fontSize: '12px' }}
                                        >
                                            📍 View Map
                                        </button>
                                    </div>
                                ) : 'No Location'}
                            </td>
                        </tr>
                    ))}
                    {inquiries.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No inquiries yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const AgentDashboard = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [newService, setNewService] = useState({ title: '', price: '', description: '' });

    const refreshData = () => {
        if (user) {
            setServices(getAgentServices(user.id));
            setBookings(getAgentBookings(user.id));
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

    const handleAddService = (e) => {
        e.preventDefault();
        addService({ ...newService, agentId: user.id });
        refreshData();
        setNewService({ title: '', price: '', description: '' });
        alert('Service added! Waiting for Admin approval.');
    };

    const handleCompleteWork = (bookingId) => {
        updateBookingStatus(bookingId, 'completed');
        refreshData();
    };

    const openLocation = (loc) => {
        if (loc && loc.lat && loc.lng) {
            window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
        } else {
            alert('Location data not available for this booking.');
        }
    };

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h2>Service Agent Dashboard</h2>
            <p>Welcome, {user?.name}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '40px' }}>
                <div>
                    <h3>Add New Service</h3>
                    <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Service Title"
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            required
                            style={{ padding: '10px' }}
                        />
                        <input
                            type="number"
                            placeholder="Price (₹)"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            required
                            style={{ padding: '10px' }}
                        />
                        <textarea
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            required
                            style={{ padding: '10px', minHeight: '100px' }}
                        />
                        <button type="submit" className="btn btn-primary">Add Service</button>
                    </form>
                </div>

                <div>
                    <h3>My Services</h3>
                    <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
                        {services.map(svc => (
                            <li key={svc.id} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '5px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong>{svc.title}</strong>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: svc.status === 'approved' ? '#d4edda' : '#fff3cd',
                                        color: svc.status === 'approved' ? '#155724' : '#856404'
                                    }}>
                                        {svc.status.toUpperCase()}
                                    </span>
                                </div>
                                <div>₹{svc.price}</div>
                                <p style={{ fontSize: '0.9em', color: '#666' }}>{svc.description}</p>
                            </li>
                        ))}
                        {services.length === 0 && <p>No services added yet.</p>}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Active Bookings</h3>
                <table className="table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Customer</th>
                            <th style={{ padding: '10px' }}>Service</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{new Date(booking.timestamp).toLocaleDateString()}</td>
                                <td style={{ padding: '10px' }}>{booking.customerName}</td>
                                <td style={{ padding: '10px' }}>{booking.serviceTitle}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{booking.status}</span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        onClick={() => openLocation(booking.location)}
                                        className="btn btn-secondary"
                                        style={{ marginRight: '10px', padding: '5px 10px', fontSize: '12px' }}
                                    >
                                        📍 View Location
                                    </button>
                                    {booking.status === 'booked' && (
                                        <button
                                            onClick={() => handleCompleteWork(booking.id)}
                                            className="btn btn-success"
                                            style={{ padding: '5px 10px', fontSize: '12px' }}
                                        >
                                            ✅ Mark Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Customer Inquiries</h3>
                <InquiriesList />
            </div>
        </div>
    );
};

export default AgentDashboard;
