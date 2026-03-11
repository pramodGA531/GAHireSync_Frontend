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
    // const apiurl = "http://localhost:8000";
    // const apiurl = 'http://192.168.0.132:8000';
    const apiurl = import.meta.env.VITE_BACKEND_URL;
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
                target_in_amount: userData.target_in_amount,
                target_in_positions: userData.target_in_positions,
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
                target_in_amount: userData.target_in_amount,
                target_in_positions: userData.target_in_positions,
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

    const updateUserData = (newUserData) => {
        const updatedData = { ...userData, ...newUserData };
        setUserData(updatedData);

        if (localStorage.getItem("hireSyncUser")) {
            localStorage.setItem("hireSyncUser", JSON.stringify(updatedData));
        }
        if (sessionStorage.getItem("hireSyncUser")) {
            sessionStorage.setItem("hireSyncUser", JSON.stringify(updatedData));
        }
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
                updateUserData,
                token,
                apiurl,
                userData,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
