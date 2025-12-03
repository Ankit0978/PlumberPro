import React, { useState } from 'react';
import TransactionLogs from './TransactionLogs';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogs, setShowLogs] = useState(false);

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <h1>Plumber<span>Pro</span></h1>
                </div>
                <nav className={`nav ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li><a href="#hero" onClick={() => setIsOpen(false)}>Home</a></li>
                        <li><a href="#services" onClick={() => setIsOpen(false)}>Services</a></li>
                        <li><a href="#reviews" onClick={() => setIsOpen(false)}>Reviews</a></li>
                        <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setShowLogs(true); setIsOpen(false); }}>Transactions</a></li>
                    </ul>
                </nav>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            {showLogs && <TransactionLogs onClose={() => setShowLogs(false)} />}
        </header>
    );
};

export default Header;
