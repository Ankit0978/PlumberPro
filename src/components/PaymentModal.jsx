                                <span>Amount Paid:</span>
                                <strong>₹{amount}</strong>
                            </div >
    <div className="detail-row">
        <span>Date (UTC):</span>
        <strong>{transactionDate}</strong>
    </div>
                        </div >
    <button className="btn btn-primary" onClick={onClose}>Close</button>
                    </div >
                )}
            </div >
        </div >
    );
};

export default PaymentModal;
