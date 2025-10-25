import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
    const [user, setUser] = useState(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (!storedUserInfo) return null;
        try {
            return JSON.parse(storedUserInfo);
        } catch (error) {
            console.error("Failed to parse user info from localStorage", error);
            localStorage.removeItem('userInfo'); 
            localStorage.removeItem('authToken');
            return null;
        }
    });
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token && user) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userInfo', JSON.stringify(user));
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
        }
        setIsLoading(false);
    }, [token, user]);

    const login = (userData, jwtToken) => {
        
        const simplifiedUserData = {
            id: userData.id || userData._id, 
            name: userData.name,
            email: userData.email
        };
        setUser(simplifiedUserData);
        setToken(jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null); 
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};