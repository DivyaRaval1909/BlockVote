import React, { createContext, useState, useContext, useEffect } from "react";

// The Global Context State
export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    // Automatically dismiss the toast after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const triggerError = (message) => {
        setError(message);
    };

    return (
        <ErrorContext.Provider value={{ error, triggerError, dismissError: () => setError(null) }}>
            {children}
            <ErrorToast />
        </ErrorContext.Provider>
    );
};

// The Visual Component
const ErrorToast = () => {
    const { error, dismissError } = useContext(ErrorContext);

    if (!error) return null;

    return (
        <div className="error-toast-container">
            <div className="error-toast">
                <div className="error-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div className="error-message">{error}</div>
                <button className="error-dismiss" onClick={dismissError}>
                    &times;
                </button>
            </div>
        </div>
    );
};
