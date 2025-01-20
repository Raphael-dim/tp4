import React, { createContext, useState, useEffect } from "react";

// Créer le Context
export const AuthContext = createContext();

// Créer le provider qui englobe l'application
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setIsLoggedIn(true);
            setUserEmail(user.email);
        }
    }, []);

    const login = (user) => {
        setIsLoggedIn(true);
        setUserEmail(user.email);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserEmail("");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
