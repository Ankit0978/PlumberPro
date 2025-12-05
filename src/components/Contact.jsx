import React, { useState } from 'react';
import { addInquiry } from '../utils/db';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetLocation = () => {
        setIsLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setIsLocating(false);
                    alert('Location captured successfully!');
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsLocating(false);
                    alert('Could not get location. Please ensure location services are enabled.');
                }
            );
        } else {
            setIsLocating(false);
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addInquiry({
            ...formData,
            location
        });
        alert('Message sent successfully! An agent will contact you shortly.');
        setFormData({ name: '', phone: '', message: '' });
        setLocation(null);
    };

    return (
        <section id="contact" className="contact section">
            <div className="container">
                <h2 className="section-title">Contact Us</h2>
                <div className="contact-content">
                    <div className="contact-info">
                        <h3>Get in Touch</h3>
                        <p>For inquiries and bookings, please contact us:</p>
                        <div className="info-item">
                            <span className="icon">📞</span>
                            <p>+91 9226409730 (Akshay Dnyandev Ambore)</p>
                        </div>
                        <div className="info-item">
                            <span className="icon">✉️</span>
                            <a href="mailto:ankitjha084@gmail.com">ankitjha084@gmail.com</a>
                        </div>
                        <div className="info-item">
                            <span className="icon">📍</span>
                            <p>Serving Balewadi & Baner, Pune</p>
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <h3>Send a Message</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Your Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Describe your issue..."
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <div style={{ marginBottom: '15px' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleGetLocation}
                                disabled={isLocating || location}
                                style={{ width: '100%', fontSize: '14px', padding: '10px' }}
                            >
                                {isLocating ? 'Locating...' : location ? '📍 Location Attached' : '📍 Share Current Location'}
                            </button>
                            {location && <p style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>Location coordinates attached.</p>}
                        </div>

                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
