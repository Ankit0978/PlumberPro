import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TransactionLogs from './TransactionLogs';
import LeadsModal from './LeadsModal';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showLeads, setShowLeads] = useState(false);
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
                    <h1>Baner Balewadi Plumbing<span>Experts</span></h1>
                </div>
                <nav className={`nav ${isOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link></li>

                        {!user && (
                            <>
                                <li><Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link></li>
                                <li><Link to="/signup" className="nav-link" onClick={() => setIsOpen(false)}>Sign Up</Link></li>
                            </>
                        )}

                        {user && user.role === 'customer' && (
                            <li><Link to="/customer" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                        )}

                        {user && user.role === 'agent' && (
                            <li><Link to="/agent" className="nav-link" onClick={() => setIsOpen(false)}>Agent Portal</Link></li>
                        )}

                        {user && user.role === 'admin' && (
                            <>
                                <li><Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>Admin Panel</Link></li>
                                <li><button onClick={() => { navigate('/admin', { state: { activeTab: 'tracking' } }); setIsOpen(false); }} className="nav-link">Active Users</button></li>
                                <li><Link to="/signup" className="nav-link" onClick={() => setIsOpen(false)}>Register User</Link></li>
                                <li><button onClick={() => { setShowLeads(true); setIsOpen(false); }} className="nav-link">Leads Generated</button></li>
                                <li><button onClick={() => { setShowLogs(true); setIsOpen(false); }} className="nav-link">Transactions</button></li>
                            </>
                        )}

                        {user && (
                            <li><button onClick={handleLogout} className="nav-link">Logout</button></li>
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
            {showLeads && <LeadsModal onClose={() => setShowLeads(false)} />}
        </header>
    );
};

export default Header;
