import React, { useState, useEffect } from 'react';
import { getTransactions, clearTransactions, downloadLogsAsCSV } from '../utils/transactionLogger';

const TransactionLogs = ({ onClose }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Initial fetch
        setLogs(getTransactions());

        // Auto-refresh every 2 seconds to keep logs in sync
        const interval = setInterval(() => {
            setLogs(getTransactions());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleClearLogs = () => {
        if (window.confirm('Are you sure you want to clear all transaction history?')) {
            if (clearTransactions()) {
                setLogs([]);
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content logs-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>Transaction History</h2>
                </div>

                <div className="logs-container">
                    {logs.length === 0 ? (
                        <p className="no-logs">No transactions recorded yet.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Service</th>
                                        <th>Amount</th>
                                        <th>Txn ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.date}</td>
                                            <td>{log.service}</td>
                                            <td>₹{log.amount}</td>
                                            <td><code>{log.id}</code></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="logs-footer">
                    <button className="btn-secondary" onClick={() => setLogs(getTransactions())}>
                        Refresh
                    </button>
                    <button className="btn-secondary" onClick={downloadLogsAsCSV} disabled={logs.length === 0}>
                        Download CSV
                    </button>
                    <button className="btn-secondary" onClick={handleClearLogs} disabled={logs.length === 0}>
                        Clear History
                    </button>
                    <button className="btn-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionLogs;
