import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>PlumberPro</h4>
                        <p>Expert plumbing services in Pune.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>📞 +91 9226409730 (Akshay Dnyandev Ambore)</p>
                        <p>✉️ ankitjha084@gmail.com</p>
                    </div>
                </div>
                <p className="copyright">&copy; {new Date().getFullYear()} PlumberPro. All rights reserved. (v1.1)</p>
            </div>
        </footer>
    );
};

export default Footer;
