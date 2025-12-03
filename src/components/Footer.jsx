import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} PlumberPro. All rights reserved.</p>
                <p>Designed for Excellence.</p>
            </div>
        </footer>
    );
};

export default Footer;
