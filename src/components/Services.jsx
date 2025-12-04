import React, { useState, useEffect } from 'react';
import { getApprovedServices } from '../utils/db';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load services from DB
        const fetchServices = () => {
            const approvedServices = getApprovedServices();
            setServices(approvedServices);
        };

        fetchServices();
        // Add event listener for storage changes to update in real-time
        window.addEventListener('storage', fetchServices);
        return () => window.removeEventListener('storage', fetchServices);
    }, []);

    const handleBookClick = () => {
        navigate('/login');
    };

    return (
        <section id="services" className="services section">
            <div className="container">
                <h2 className="section-title">Our Services & Pricing</h2>
                <div className="services-grid">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="service-card"
                        >
                            <div className="service-icon">🔧</div>
                            <h3>{service.title}</h3>
                            <p className="price">₹{service.price}</p>
                            <p className="description">{service.description}</p>
                            <button className="btn-book" onClick={handleBookClick}>Login to Book</button>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                            <p>No services currently available. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Services;
