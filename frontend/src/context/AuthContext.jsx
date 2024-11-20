import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
            setToken(response.data.access);
            localStorage.setItem('token', response.data.access);

            const userResponse = await axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${response.data.access}` },
            });
            localStorage.setItem('user', JSON.stringify(userResponse.data));
            return true;
        } catch (error) {
            console.error('Falha no login:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
