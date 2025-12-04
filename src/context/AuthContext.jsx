import React, { createContext, useState, useContext, useEffect } from 'react';
import { initDB, loginUser, registerUser } from '../utils/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initDB();
        const storedUser = localStorage.getItem('plumber_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        try {
            const user = loginUser(email, password);
            setUser(user);
            localStorage.setItem('plumber_current_user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const signup = (userData) => {
        try {
            const newUser = registerUser(userData);
            setUser(newUser);
            localStorage.setItem('plumber_current_user', JSON.stringify(newUser));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('plumber_current_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
