import React, { createContext, useState, useEffect, useRef } from "react";
import "../styles/globals.css";

// INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import { ErrorProvider } from "../components/ErrorToast";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark"); // 'dark' or 'light'

    useEffect(() => {
        // Toggle the global body class when theme changes
        if (theme === "light") {
            document.body.classList.add("light-mode");
        } else {
            document.body.classList.remove("light-mode");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const CustomCursor = () => {
    const cursorRef = useRef(null);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        const addHover = () => {
            if (cursorRef.current) cursorRef.current.style.width = '30px';
            if (cursorRef.current) cursorRef.current.style.height = '30px';
        };

        const removeHover = () => {
            if (cursorRef.current) cursorRef.current.style.width = '20px';
            if (cursorRef.current) cursorRef.current.style.height = '20px';
        };

        window.addEventListener('mousemove', moveCursor);

        // Add hover effects to interactable elements dynamically
        const interactables = document.querySelectorAll('a, button, input, textarea, .slider');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
            });
        };
    }); // Run on every render to bind new DOM elements

    return (
        <div className="custom-cursor" ref={cursorRef}></div>
    );
};

const MyApp = ({ Component, pageProps }) => (
    <ErrorProvider>
        <ThemeProvider>
            <VotingProvider>
                <CustomCursor />
                <div className="eth-bg">
                    <div className="eth-lines"></div>
                    <div className="eth-nodes"></div>
                </div>
                <Component {...pageProps} />
            </VotingProvider>
        </ThemeProvider>
    </ErrorProvider>
);

export default MyApp;
