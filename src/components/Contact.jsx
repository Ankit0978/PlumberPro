import React from 'react';

const Contact = () => {
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
                            <a href="tel:+918318440978">+91 8318440978</a>
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
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <h3>Send a Message</h3>
                        <input type="text" placeholder="Your Name" required />
                        <input type="tel" placeholder="Your Phone Number" required />
                        <textarea placeholder="Describe your issue..." rows="5" required></textarea>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
