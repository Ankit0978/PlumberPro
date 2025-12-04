import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { addTransaction, updateBookingStatus } from '../utils/db';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ booking, service, onClose }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [amount, setAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [transactionId, setTransactionId] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const { user } = useAuth();

    // Determine the item being paid for (either a booking or a direct service)
    const item = booking || service;

    useEffect(() => {
        if (item) {
            // Extract numeric value from price string if possible, else default to empty
            const priceString = item.price ? item.price.toString() : '';
            const priceMatch = priceString.match(/(\d+)/);
            if (priceMatch) {
                setAmount(priceMatch[0]);
            } else {
                setAmount(priceString);
            }
        }
    }, [item]);

    const handlePayment = () => {
        // Simulate payment verification
        const mockTxnId = "TXN" + Math.floor(Math.random() * 1000000000);
        const date = new Date().toISOString(); // Strict UTC

        setTransactionId(mockTxnId);
        setTransactionDate(date);
        setPaymentStatus('success');

        // Log transaction to new DB
        addTransaction({
            id: mockTxnId,
            service: item.title || item.serviceTitle, // Handle both service and booking objects
            serviceId: item.id || item.serviceId,
            amount: amount,
            date: date, // UTC
            timestamp: date, // UTC
            customerId: user ? user.id : 'guest',
            customerName: user ? user.name : 'Guest',
            agentId: item.agentId || 'admin'
        });

        // Update booking status if it's a booking
        if (booking) {
            updateBookingStatus(booking.id, 'paid');
        }
    };

    if (!item) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>

                {step === 1 && (
                    <div className="modal-step">
                        <h3>Confirm Payment</h3>
                        <div className="service-summary">
                            <p><strong>Service:</strong> {item.title || item.serviceTitle}</p>
                            <p><strong>Price:</strong> {item.price.toString().includes('₹') ? item.price : `₹${item.price}`}</p>
                        </div>
                        <div className="form-group">
                            <label>Enter Amount to Pay:</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="amount-input"
                            />
                        </div>
                        <button className="btn btn-primary" onClick={() => setStep(2)}>Proceed to Pay</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="modal-step">
                        <h3>Scan to Pay</h3>
                        <div className="qr-container">
                            <QRCodeCanvas value={`upi://pay?pa=plumber@upi&pn=PlumberPro&am=${amount}&tn=${item.title || item.serviceTitle}`} size={200} />
                        </div>
                        <p className="amount-display">Amount: ₹{amount}</p>
                        <button className="btn btn-success" onClick={handlePayment}>I have Paid</button>
                    </div>
                )}

                {step === 2 && paymentStatus === 'success' && (
                    <div className="modal-step success-view">
                        <div className="success-icon">✓</div>
                        <h3>Payment Successful!</h3>
                        <p>Your payment has been processed.</p>
                        <div className="transaction-details">
                            <div className="detail-row">
                                <span>Transaction ID:</span>
                                <strong>{transactionId}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Amount Paid:</span>
                                <strong>₹{amount}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Date (UTC):</span>
                                <strong>{transactionDate}</strong>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
