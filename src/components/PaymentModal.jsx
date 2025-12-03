import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveTransaction } from '../utils/transactionLogger';

const PaymentModal = ({ service, onClose }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success
    const [transactionId, setTransactionId] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (service) {
            // Extract numeric value from price string if possible, else default to empty
            const priceMatch = service.price.match(/₹([\d,]+)/);
            if (priceMatch) {
                setAmount(priceMatch[1].replace(/,/g, ''));
            }
        }
    }, [service]);

    if (!service) return null;

    const upiId = "ankitjha08400-2@okhdfcbank";
    // Dynamic UPI link with amount
    const upiLink = `upi://pay?pa=${upiId}&pn=Ankit%20Jha&am=${amount}&cu=INR`;

    const handlePayment = () => {
        // Simulate payment verification
        const mockTxnId = "TXN" + Math.floor(Math.random() * 1000000000);
        const date = new Date().toUTCString();

        setTransactionId(mockTxnId);
        setTransactionDate(date);
        setPaymentStatus('success');

        // Log transaction
        const newLog = {
            id: mockTxnId,
            service: service.title,
            amount: amount,
            date: date,
            timestamp: Date.now()
        };

        saveTransaction(newLog);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <div className="secure-badge">
                        <span className="shield-icon">🛡️</span> 100% Secure Payment
                    </div>
                    <h2>{paymentStatus === 'success' ? 'Payment Successful' : 'Payment Gateway'}</h2>
                </div>

                <div className="payment-details">
                    {paymentStatus === 'pending' ? (
                        <>
                            <div className="service-summary">
                                <h3>{service.title}</h3>
                                <p className="price-tag">{service.price}</p>
                            </div>

                            <div className="amount-input-section">
                                <label>Enter Amount to Pay (₹):</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="amount-input"
                                />
                            </div>

                            <div className="qr-section">
                                <div className="qr-container">
                                    <QRCodeCanvas
                                        value={upiLink}
                                        size={200}
                                        level={"H"}
                                        includeMargin={true}
                                        imageSettings={{
                                            src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
                                            x: undefined,
                                            y: undefined,
                                            height: 24,
                                            width: 24,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                                <p className="scan-text">Scan to Pay ₹{amount || '0'} with any UPI App</p>
                                <div className="upi-id-box">
                                    <span>UPI ID:</span>
                                    <code>{upiId}</code>
                                </div>
                            </div>

                            <div className="payment-actions">
                                <button className="btn-paid" onClick={handlePayment} disabled={!amount || amount <= 0}>
                                    I have Paid ₹{amount}
                                </button>
                            </div>

                            <div className="payment-methods">
                                <p>Accepted Methods:</p>
                                <div className="methods-icons">
                                    <span>GPay</span>
                                    <span>PhonePe</span>
                                    <span>Paytm</span>
                                    <span>BHIM</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="success-view">
                            <div className="success-icon">✅</div>
                            <h3>Booking Confirmed!</h3>
                            <p>Payment of <strong>₹{amount}</strong> received.</p>

                            <div className="transaction-details">
                                <div className="detail-row">
                                    <span>Service:</span>
                                    <strong>{service.title}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Date:</span>
                                    <strong>{transactionDate}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Transaction ID:</span>
                                    <code>{transactionId}</code>
                                </div>
                            </div>

                            <p className="admin-note">
                                Our team has been notified. We will contact you shortly at your registered number.
                            </p>

                            <button className="btn-primary" onClick={onClose}>Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
