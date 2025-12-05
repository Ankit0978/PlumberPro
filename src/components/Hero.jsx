import React from 'react';

const Hero = () => {
    return (
        <section id="hero" className="hero">
            <div className="hero-content">
                <h1>Expert Plumbing Services in <span className="highlight">Balewadi & Baner</span></h1>
                <p>Professional, reliable, and affordable plumbing solutions for your home and office.</p>
                <div className="hero-buttons">
                    <a href="#contact" className="btn btn-primary">Book Now</a>
                    <a href="#services" className="btn btn-secondary">View Services</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
