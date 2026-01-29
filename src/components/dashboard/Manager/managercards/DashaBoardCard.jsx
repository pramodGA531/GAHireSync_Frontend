import React from "react";
// import "./DashBoardCard.css";
import { useNavigate } from "react-router-dom";

const DashaBoardCard = ({ count, text, imgSrc }) => {
    const Navigate = useNavigate();

    const handleCardsRoute = () => {
        console.log("card clicked", text);

        if (text === "Interview Schedule") {
            // Navigate("/agency/");
        } else if (text === "Approval Pending") {
            Navigate("/agency/jobs");
        } else if (text === "Recrutier Allocation Pending") {
            Navigate("/agency/recruiters/");
        }
    };

    return (
        <div
            className="flex flex-col w-full shadow-[4px_4px_4px_0_rgba(0,0,0,0.05)] cursor-pointer rounded-lg border border-white p-[15px] bg-white hover:bg-slate-50 transition-colors"
            onClick={handleCardsRoute}
        >
            <div className="flex justify-between items-center p-4 mb-2">
                <div className="w-[60px] h-[60px] relative -top-5 rounded-[20px] bg-white border border-[#0827771A] flex justify-center items-center shadow-sm">
                    <h3 className="text-[#082777] text-2xl font-semibold">
                        {count}
                    </h3>
                </div>
                <div className="w-[76px] -mt-5">
                    <img src={imgSrc} alt="" className="w-full" />
                </div>
            </div>
            <h2 className="text-sm font-normal text-black opacity-50 text-left">
                {text}
            </h2>
        </div>
    );
};

export default DashaBoardCard;
