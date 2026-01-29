import React, { createContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { token, apiurl } = useAuth();
    const [count, setCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch unread count
    const fetchCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${apiurl}/notifications/?count=true`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data?.count !== undefined) {
                setCount(data.count);
            }
        } catch (err) {
            console.error("Error fetching notification count:", err);
        }
    }, [token, apiurl]);

    // Fetch full notification list
    const fetchAllNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${apiurl}/notifications/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setNotifications(data.results || []);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
        setLoading(false);
    }, [token, apiurl]);

    // Mark notifications as seen
    const markAsSeen = async () => {
        if (!token) return;
        try {
            await fetch(`${apiurl}/notifications/mark-as-seen/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCount(0); // Reset count immediately
            fetchAllNotifications(); // Refresh full list
        } catch (err) {
            console.error("Error marking notifications as seen:", err);
        }
    };

    useEffect(() => {

        const interval = setInterval(() => {
            fetchCount();
        }, 100000); // every 100s

        return () => clearInterval(interval);
    }, [fetchCount]);

    return (
        <NotificationContext.Provider
            value={{
                count,
                notifications,
                loading,
                fetchCount,
                fetchAllNotifications,
                markAsSeen,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
