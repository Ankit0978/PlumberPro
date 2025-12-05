import React, { useState, useEffect } from 'react';
import { getInquiries } from '../utils/db';

const LeadsModal = ({ onClose }) => {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        // Initial fetch
        setLeads(getInquiries());

        // Auto-refresh every 2 seconds
        const interval = setInterval(() => {
            setLeads(getInquiries());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const downloadLeads = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(leads, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "leads_generated.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const openLocation = (loc) => {
        if (loc && loc.lat && loc.lng) {
            window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank');
        } else {
            alert('Location data not available.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content logs-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2>Leads Generated</h2>
                </div>

                <div className="logs-container">
                    {leads.length === 0 ? (
                        <p className="no-logs">No leads generated yet.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead, index) => (
                                        <tr key={index}>
                                            <td>{new Date(lead.timestamp).toLocaleDateString()}</td>
                                            <td>{lead.name}</td>
                                            <td>{lead.phone}</td>
                                            <td>{lead.message}</td>
                                            <td>
                                                <button
                                                    onClick={() => openLocation(lead.location)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '2px 8px', fontSize: '12px' }}
                                                    disabled={!lead.location}
                                                >
                                                    {lead.location ? '📍 Map' : 'N/A'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="logs-footer">
                    <button className="btn-secondary" onClick={() => setLeads(getInquiries())}>
                        Refresh
                    </button>
                    <button className="btn-secondary" onClick={downloadLeads} disabled={leads.length === 0}>
                        ⬇️ Download JSON
                    </button>
                    <button className="btn-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default LeadsModal;
