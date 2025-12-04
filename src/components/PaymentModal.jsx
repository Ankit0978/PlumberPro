import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { addTransaction, updateBookingStatus } from '../utils/db';
import { useAuth } from '../context/AuthContext';

                        </div >
                        <p className="amount-display">Amount: ₹{amount}</p>
                        <button className="btn btn-success" onClick={handlePayment}>I have Paid</button>
                    </div >
                )}

{
    step === 2 && paymentStatus === 'success' && (
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
    )
}
            </div >
        </div >
    );
};

export default PaymentModal;
