import React, { createContext, useEffect, useState } from "react";
import Pageloading from "./loading/Pageloading";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({
        username: " ",
        user_id: "",
        role: "",
    });
    const [hasUserLoaded, setHasUserLoaded] = useState(false);

    // const apiurl = 'https://backend.gahiresync.com';
    const apiurl = "http://192.168.0.132:8000";
    // const apiurl = "https://annabella-paterfamiliar-judgmatically.ngrok-free.dev";

    // const apiurl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const storedToken =
            localStorage.getItem("hiresynctoken") ||
            sessionStorage.getItem("hiresynctoken");
        if (storedToken) {
            setToken(storedToken);
        }

        const storedUser =
            localStorage.getItem("hireSyncUser") ||
            sessionStorage.getItem("hireSyncUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
            } catch (err) {
                console.error("Invalid user data in storage");
                setUserData({ username: "", user_id: "", role: "" });
            }
        }

        setIsLoading(false);
        setHasUserLoaded(true);
    }, []);

    const handleLogin = (token, userData = null) => {
        setToken(token);

        if (userData !== null) {
            const formattedUserData = {
                username: userData.username,
                role: userData.role,
                user_id: userData.id,
            };
            setUserData(formattedUserData);
            localStorage.setItem(
                "hireSyncUser",
                JSON.stringify(formattedUserData),
            );
        }

        localStorage.setItem("hiresynctoken", token);
    };

    const handleSessionLogin = (token, userData = null) => {
        setToken(token);

        if (userData !== null) {
            const formattedUserData = {
                username: userData.username,
                role: userData.role,
                user_id: userData.id,
            };
            setUserData(formattedUserData);
            sessionStorage.setItem(
                "hireSyncUser",
                JSON.stringify(formattedUserData),
            );
        }

        sessionStorage.setItem("hiresynctoken", token);
    };

    const handleLogout = () => {
        setToken(null);
        setUserData({ username: "", role: "", user_id: "" });
        localStorage.removeItem("hiresynctoken");
        localStorage.removeItem("hireSyncUser");
        sessionStorage.removeItem("hireSyncUser");
        sessionStorage.removeItem("hiresynctoken");
    };

    if (isLoading) {
        return <Pageloading />;
    }

    return (
        <UserContext.Provider
            value={{
                handleLogin,
                handleSessionLogin,
                handleLogout,
                token,
                apiurl,
                userData,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
