/**
 * Simulated Database using localStorage
 * Handles Users, Services, Transactions, and Bookings
 */

const DB_KEYS = {
    USERS: 'plumber_users',
    SERVICES: 'plumber_services',
    TRANSACTIONS: 'plumber_transactions',
    BOOKINGS: 'plumber_bookings',
    CURRENT_USER: 'plumber_current_user'
};

// Initialize DB with default data if empty
export const initDB = () => {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
        const defaultAdmin = {
            id: 'admin_1',
            name: 'Admin User',
            email: 'admin@plumber.com',
            password: 'admin', // In a real app, this would be hashed
            role: 'admin'
        };
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify([defaultAdmin]));
    }
    if (!localStorage.getItem(DB_KEYS.SERVICES)) {
        localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.TRANSACTIONS)) {
        localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify([]));
    }
};

// --- User Operations ---

export const registerUser = (user) => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    if (users.find(u => u.email === user.email)) {
        throw new Error('User already exists');
    }
    const newUser = { ...user, id: 'user_' + Date.now() };
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
};

export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    return user;
};

export const getUsers = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
};

// --- Service Operations ---

export const addService = (service) => {
    const services = JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
    const newService = {
        ...service,
        id: 'svc_' + Date.now(),
        status: 'pending' // Default status
    };
    services.push(newService);
    localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    return newService;
};

export const getServices = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
};

export const getApprovedServices = () => {
    const services = getServices();
    return services.filter(svc => svc.status === 'approved');
};

export const getAgentServices = (agentId) => {
    const services = getServices();
    return services.filter(svc => svc.agentId === agentId);
};

export const updateServiceStatus = (serviceId, status) => {
    const services = getServices();
    const index = services.findIndex(s => s.id === serviceId);
    if (index !== -1) {
        services[index].status = status;
        localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    }
};

// --- Booking Operations ---

export const addBooking = (booking) => {
    const bookings = JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
    const newBooking = {
        ...booking,
        id: 'bk_' + Date.now(),
        status: 'booked', // booked, completed, paid
        timestamp: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
};

export const getBookings = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
};

export const getAgentBookings = (agentId) => {
    const bookings = getBookings();
    return bookings.filter(b => b.agentId === agentId);
};

export const getCustomerBookings = (customerId) => {
    const bookings = getBookings();
    return bookings.filter(b => b.customerId === customerId);
};

export const updateBookingStatus = (bookingId, status) => {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings[index].status = status;
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
    }
};

// --- Transaction Operations ---

export const addTransaction = (transaction) => {
    const transactions = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
    const newTxn = {
        ...transaction,
        id: 'txn_' + Date.now(),
        timestamp: new Date().toISOString(), // Strict UTC
        status: 'success'
    };
    transactions.push(newTxn);
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTxn;
};

export const getTransactions = () => {
    return JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || '[]');
};

export const refundTransaction = (transactionId) => {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
        transactions[index].status = 'refunded';
        localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
};
