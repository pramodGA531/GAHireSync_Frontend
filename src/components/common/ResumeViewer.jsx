import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useAuth } from "./useAuth";

const ResumeViewer = ({ resume, onPrintScreenAttempt }) => {
    const { apiurl } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === "PrintScreen" && onPrintScreenAttempt) {
                onPrintScreenAttempt();
            }
        };
        document.addEventListener("keydown", handleKeydown);
        return () => document.removeEventListener("keydown", handleKeydown);
    }, [onPrintScreenAttempt]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden", // Changed to hidden as iframe handles scrolling
                backgroundColor: "#fff",
                position: "relative",
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white z-10">
                    <Spin tip="Loading resume..." />
                </div>
            )}

            {resume ? (
                <iframe
                    src={`${apiurl}${resume}`}
                    className="w-full h-full border-none"
                    title="Resume PDF"
                    onLoad={() => setLoading(false)}
                />
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    No resume available to display.
                </div>
            )}
        </div>
    );
};

export default ResumeViewer;
