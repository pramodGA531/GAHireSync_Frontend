import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServerDownPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Detect refresh
        const navEntries = performance.getEntriesByType("navigation");
        const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

        if (isReload) {
            navigate(-1); // Go back on refresh
        }
    }, [navigate]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1 className='text-5xl mt-20'>🚧 Server Maintenance</h1>
            <p className='text-xl m-10'>We're experiencing technical issues. Please try again later.</p>
        </div>
    );
};

export default ServerDownPage;
