import React, { useState } from 'react';
import { services } from '../data/servicesData';
import PaymentModal from './PaymentModal';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);

    return (
        <section id="services" className="services section">
            <div className="container">
                <h2 className="section-title">Our Services & Pricing</h2>
                <div className="services-grid">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="service-card"
                            onClick={() => setSelectedService(service)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="service-icon">{service.icon}</div>
                            <h3>{service.title}</h3>
                            <p className="price">{service.price}</p>
                            <p className="description">{service.description}</p>
                            <button className="btn-book">Book & Pay</button>
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
