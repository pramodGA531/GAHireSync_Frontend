import React from "react";
import {
    FileTextOutlined,
    TeamOutlined,
    UserAddOutlined,
    PhoneOutlined,
    OrderedListOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import jobposting from "../../../../../images/agency/summary/jobpostings.svg";

const RctrSummaryCard = ({ type, value, label }) => {
    const getCardStyles = () => {
        switch (type) {
            case "opening":
                return {
                    bgClass: "bg-[#F5F2FD] border border-[#BBA4EE]",
                    textClass: "text-[#7e22ce]",
                    icon: (
                        <img
                            src={jobposting}
                            className="text-[20px] opacity-90"
                        />
                    ),
                };
            case "positions":
                return {
                    bgClass: "bg-[#e0f2fe] border border-[#1681FF0D]",
                    textClass: "text-[#0369a1]", // Assumed blue text for contrast
                    icon: (
                        <TeamOutlined
                            className="text-[20px] opacity-90"
                            style={{ color: "#1681FF" }}
                        />
                    ),
                };
            case "candidates":
                return {
                    bgClass: "bg-[#FDF1F5] border border-[#FBE0E8]",
                    textClass: "text-[#db2777]",
                    icon: (
                        <UserAddOutlined className="text-[20px] opacity-90" />
                    ),
                };
            case "interview":
                return {
                    bgClass: "bg-[#e0f2fe] border border-[#1681FF0D]",
                    textClass: "text-[#0369a1]",
                    icon: (
                        <PhoneOutlined
                            className="text-[20px] opacity-90"
                            style={{ rotate: "90deg" }}
                        />
                    ),
                };
            case "feedback":
                return {
                    bgClass: "bg-[#EFFCFA] border border-[#BAF3EB]",
                    textClass: "text-[#0f766e]", // Teal text
                    icon: (
                        <OrderedListOutlined
                            className="text-[20px] opacity-90"
                            style={{ color: "#22CCB2" }}
                        />
                    ),
                };
            case "hired":
                return {
                    bgClass: "bg-[#F5F2FD] border border-[#BBA4EE]",
                    textClass: "text-[#7e22ce]",
                    icon: <CheckOutlined className="text-[20px] opacity-90" />,
                };
            default:
                return {
                    bgClass: "bg-[#e0f2fe] border border-[#1681FF0D]",
                    textClass: "text-[#0369a1]",
                    icon: (
                        <CheckOutlined
                            className="text-[20px] opacity-90"
                            style={{ color: "#636AE8" }}
                        />
                    ),
                };
        }
    };

    const { bgClass, textClass, icon } = getCardStyles();

    return (
        <div className={`stat-card ${bgClass} animate-fade-in`}>
            <div className={`stat-card-content ${textClass}`}>
                <div className="stat-card-header">
                    {icon}
                    <h2 className="stat-value">{value}</h2>
                </div>
                <p className="stat-label">{label}</p>
            </div>
        </div>
    );
};

export default RctrSummaryCard;
