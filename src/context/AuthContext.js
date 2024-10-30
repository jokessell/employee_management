import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        token: null,
        user: null,
        roles: [],
    });

    const countdownTimer = useRef(null);
    const inactivityTimer = useRef(null);

    // Function to set authentication state
    const setAuthData = useCallback((token) => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded JWT:', decoded);

                const userRoles = decoded.roles
                    ? decoded.roles.map(role => role.authority.replace('ROLE_', ''))
                    : [];

                setAuth({
                    token,
                    user: decoded.sub || null,
                    roles: userRoles,
                });
                localStorage.setItem('token', token);

                const expirationTime = decoded.exp * 1000 - Date.now();
                if (expirationTime > 0) {
                    setTimeout(() => {
                        setAuthData(null); // Use setAuthData to clear state and log out
                        navigate('/login');
                        alert('Session expired. Please log in again.');
                    }, expirationTime);
                } else {
                    setAuthData(null); // Use setAuthData to clear state and log out
                }
            } catch (error) {
                console.error('Error decoding JWT:', error);
                setAuthData(null); // Use setAuthData to clear state and log out
            }
        } else {
            setAuth({
                token: null,
                user: null,
                roles: [],
            });
            localStorage.removeItem('token');
        }
    }, [navigate]);

    // Start the countdown timer for logout after inactivity warning
    const startCountdownTimer = useCallback(() => {
        clearInterval(countdownTimer.current);
        let countdown = 60; // 60 seconds
        countdownTimer.current = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(countdownTimer.current);
                setAuthData(null); // Use setAuthData to clear state and log out
                navigate('/login');
                alert('You have been logged out due to inactivity.');
            } else {
                console.log(`Logging out in ${countdown} seconds...`);
                countdown -= 1;
            }
        }, 1000); // 1-second intervals
    }, [navigate, setAuthData]);

    // Start the inactivity timer to track user activity
    const startInactivityTimer = useCallback(() => {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => {
            startCountdownTimer();
        }, 4 * 60 * 1000); // 4 minutes
    }, [startCountdownTimer]);

    // On component mount, check if token exists and set timers
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthData(token);
            startInactivityTimer();
        } else {
            setAuthData(null);
        }

        // Clear timers on component unmount or when auth state changes
        return () => {
            clearTimeout(inactivityTimer.current);
            clearInterval(countdownTimer.current);
        };
    }, [auth.token, setAuthData, startInactivityTimer, startCountdownTimer]);

    return (
        <AuthContext.Provider value={{ auth, setAuthData, logout: () => setAuthData(null) }}>
            {children}
        </AuthContext.Provider>
    );
};
