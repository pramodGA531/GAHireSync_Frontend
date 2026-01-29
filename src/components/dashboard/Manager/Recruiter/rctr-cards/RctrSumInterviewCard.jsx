import React from "react";
import "./RctrSumInterviewCard.css";

const RctrSumInterviewCard = ({
    cand,
    interviewer,
    fromtime,
    totime,
    round,
}) => {
    // Function to calculate duration in minutes
    const getDurationInMinutes = () => {
        if (!fromtime || !totime) return "N/A"; // Handle missing values

        const from = fromtime.split(":").map(Number);
        const to = totime.split(":").map(Number);

        if (from.length < 2 || to.length < 2) return "N/A"; // Handle incorrect formats

        const fromMinutes = from[0] * 60 + from[1];
        const toMinutes = to[0] * 60 + to[1];

        const duration = toMinutes - fromMinutes;
        return duration > 0 ? duration : "N/A"; // Ensure valid duration
    };

    const duration = getDurationInMinutes(); // Compute once

    return (
        <div className="flex items-center bg-[#f9f9f9] p-[5px] rounded-[10px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] w-[300px] gap-[10px]">
            <div className="text-center mr-[10px] p-[11px]">
                <p className="text-[18px] font-bold text-[#333] m-0 p-0">
                    {fromtime.slice(0, 5) || "N/A"}
                </p>
                <p className="text-[#e91e63] text-sm static m-0 p-0">
                    {round ? `${round} Interview` : "N/A"}
                </p>
            </div>
            <div className="w-[2px] bg-[#e91e63] h-[50px] mr-[10px]"></div>
            <div className="items-center">
                <p className="font-bold text-base m-[3px] mb-[1px]">
                    {cand || "N/A"}
                </p>
                <div className="text-sm text-[#555]">
                    <p className="flex items-center gap-[5px] m-0">
                        <span>👤</span> {interviewer || "N/A"}
                    </p>
                    <p className="flex items-center gap-[5px] m-0">
                        <span>⏳</span> {duration} mins
                    </p>
                    {/* <p className="detail"><span>📍</span> Room 01</p> */}
                </div>
            </div>
        </div>
    );
};

export default RctrSumInterviewCard;
