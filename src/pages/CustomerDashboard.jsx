import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApprovedServices, getCustomerBookings, addBooking } from '../utils/db';
import PaymentModal from '../components/PaymentModal';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const refreshData = () => {
        if (user) {
            setServices(getApprovedServices());
            setBookings(getCustomerBookings(user.id));
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

    const handleBookService = (service) => {
        if (!window.confirm(`Do you want to book ${service.title}? We will request your location for the agent.`)) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    createBooking(service, location);
                },
                (error) => {
                    alert("Location access denied. Booking without precise location.");
                    createBooking(service, null);
                }
            );
        } else {
            createBooking(service, null);
        }
    };

    const createBooking = (service, location) => {
        addBooking({
            customerId: user.id,
            customerName: user.name,
            agentId: service.agentId,
            serviceId: service.id,
            serviceTitle: service.title,
            price: service.price,
            location: location
        });
        refreshData();
        alert('Booking Confirmed! The agent will visit your location. You pay after the work is done.');
    };

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h2>Customer Dashboard</h2>
            <p>Welcome, {user?.name}</p>

            <div style={{ marginTop: '40px' }}>
                <h3>Available Services</h3>
                <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {services.map(svc => (
                        <div key={svc.id} className="service-card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
                            <h4>{svc.title}</h4>
                            <p className="price">₹{svc.price}</p>
                            <p>{svc.description}</p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: '10px', width: '100%' }}
                                onClick={() => handleBookService(svc)}
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                    {services.length === 0 && <p>No services available at the moment.</p>}
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>My Bookings</h3>
                <table className="table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '10px' }}>Date</th>
                            <th style={{ padding: '10px' }}>Service</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{new Date(booking.timestamp).toLocaleDateString()}</td>
                                <td style={{ padding: '10px' }}>{booking.serviceTitle}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: booking.status === 'completed' ? '#d4edda' : '#f8f9fa',
                                        fontWeight: 'bold'
                                    }}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {booking.status === 'completed' && (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => setSelectedBooking(booking)}
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    {booking.status === 'paid' && <span>Paid ✅</span>}
                                    {booking.status === 'booked' && <span>Waiting for Agent</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedBooking && (
                <PaymentModal
                    booking={selectedBooking}
                    onClose={() => {
                        setSelectedBooking(null);
                        refreshData();
                    }}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;
