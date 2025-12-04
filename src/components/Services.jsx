import React, { useState, useEffect } from 'react';
import { getApprovedServices } from '../utils/db';
import { services as staticServices } from '../data/servicesData';
import PaymentModal from './PaymentModal';

const Services = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        // Load services from DB
        const fetchServices = () => {
            const approvedServices = getApprovedServices();
            // Combine static services with approved DB services
            // Ensure no duplicates if IDs clash (though static IDs are 1-12, DB IDs are timestamps)
            setServices([...staticServices, ...approvedServices]);
        };

        fetchServices();
        window.addEventListener('storage', fetchServices);
        return () => window.removeEventListener('storage', fetchServices);
    }, []);

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
                            <div className="service-icon">{service.icon || '🔧'}</div>
                            <h3>{service.title}</h3>
                            <p className="price">{service.price.toString().includes('₹') ? service.price : `₹${service.price}`}</p>
                            <p className="description">{service.description}</p>
                            <button
                                className="btn-book"
                                onClick={() => setSelectedService(service)}
                            >
                                Book & Pay
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {selectedService && (
                <PaymentModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </section>
    );
};

export default Services;
