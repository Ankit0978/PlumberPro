import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TransactionLogs from './TransactionLogs';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <h1>Plumber<span>Pro</span></h1>
                </div>
                <nav className={`nav ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>

                        {!user && (
                            <>
                                <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
                                <li><Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link></li>
                            </>
                        )}

                        {user && user.role === 'customer' && (
                            <li><Link to="/customer" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                        )}

                        {user && user.role === 'agent' && (
                            <li><Link to="/agent" onClick={() => setIsOpen(false)}>Agent Portal</Link></li>
                        )}

                        {user && user.role === 'admin' && (
                            <>
                                <li><Link to="/admin" onClick={() => setIsOpen(false)}>Admin Panel</Link></li>
                                <li><Link to="/signup" onClick={() => setIsOpen(false)}>Register User</Link></li>
                                <li><button onClick={() => { setShowLogs(true); setIsOpen(false); }} className="btn-link" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>Transactions</button></li>
                            </>
                        )}

                        {user && (
                            <li><button onClick={handleLogout} className="btn-link" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>Logout</button></li>
                        )}
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
