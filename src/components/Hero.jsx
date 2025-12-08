import { logAction } from '../data/trackingService';

const Hero = () => {
    return (
        <section id="hero" className="hero">
            <div className="hero-content">
                <h1>Expert Plumbing Services in <span className="highlight">Balewadi & Baner</span></h1>
                <p>Professional, reliable, and affordable plumbing solutions for your home and office.</p>
                <div className="hero-buttons">
                    <a href="#contact" className="btn btn-primary" onClick={() => logAction('book_now_hero_click')}>Book Now</a>
                    <a href="#services" className="btn btn-secondary" onClick={() => logAction('view_services_hero_click')}>View Services</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
