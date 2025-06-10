import axios from "axios";
import React from "react";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            axios.get('http://localhost:8000/api/auth/user/', {
                headers: { Authorization: `Token ${storedToken}` }
            }).then(response => {
                setUser(response.data);
                setToken(storedToken);
            }).catch(() => {
                localStorage.removeItem('authToken');
            });
        }
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem('authToken', authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
