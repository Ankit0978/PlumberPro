export const STORAGE_KEY = 'plumber_txn_logs';

export const saveTransaction = (transaction) => {
    try {
        const existingLogs = getTransactions();
        const newLogs = [transaction, ...existingLogs];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
        return true;
    } catch (error) {
        console.error('Failed to save transaction log:', error);
        return false;
    }
};

export const getTransactions = () => {
    try {
        const logs = localStorage.getItem(STORAGE_KEY);
        return logs ? JSON.parse(logs) : [];
    } catch (error) {
        console.error('Failed to retrieve transaction logs:', error);
        return [];
    }
};

export const clearTransactions = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear transaction logs:', error);
        return false;
    }
};

export const downloadLogsAsCSV = () => {
    const logs = getTransactions();
    if (logs.length === 0) return;

    const headers = ['Transaction ID', 'Service', 'Amount', 'Date', 'Timestamp'];
    const csvContent = [
        headers.join(','),
        ...logs.map(log => [
            log.id,
            `"${log.service}"`, // Quote service name to handle commas
            log.amount,
            `"${log.date}"`,
            log.timestamp
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `transaction_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
