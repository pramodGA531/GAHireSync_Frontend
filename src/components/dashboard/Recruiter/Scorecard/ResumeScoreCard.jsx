import React, { useEffect, useState, useRef } from "react";
import scoreimage from "../../../../images/agencyresumecard/scoreimg.svg";
import polygone from "../../../../images/agencyresumecard/Polygon.png";
import {
    CheckCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const ResumeScoreCard = ({ score = 0 }) => {
    const [marks, setMarks] = useState(0);
    const [qualitative, setQualitative] = useState("Scoring...");
    const intervalRef = useRef(null);

    const degreePerMark = 1.8;
    const angleInDegrees = 90 - marks * degreePerMark;
    const radius = 105;

    useEffect(() => {
        if (score >= 90) setQualitative("Excellent");
        else if (score >= 75) setQualitative("Good");
        else setQualitative("Bad");
    }, [score]);

    useEffect(() => {
        clearInterval(intervalRef.current);
        if (score === 0) {
            setMarks(0);
            return;
        }
        setMarks(0);
        intervalRef.current = setInterval(() => {
            setMarks((prevMarks) => {
                if (prevMarks >= score) {
                    clearInterval(intervalRef.current);
                    return score;
                }
                return Math.min(prevMarks + 2, score);
            });
        }, 30);
        return () => clearInterval(intervalRef.current);
    }, [score]);

    const angleInRadians = (angleInDegrees + 90) * (Math.PI / 180);
    const x = radius * Math.cos(angleInRadians);
    const y = radius * Math.sin(angleInRadians);

    const getStatusStyles = () => {
        if (score >= 90)
            return {
                icon: <CheckCircleOutlined className="text-green-500" />,
                bg: "bg-green-50",
                text: "text-green-700",
            };
        if (score >= 75)
            return {
                icon: <InfoCircleOutlined className="text-blue-500" />,
                bg: "bg-blue-50",
                text: "text-blue-700",
            };
        return {
            icon: <WarningOutlined className="text-amber-500" />,
            bg: "bg-amber-50",
            text: "text-amber-700",
        };
    };

    const status = getStatusStyles();

    return (
        <div className="bg-white p-8 rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden group">
            <div className="relative flex flex-col items-center justify-center">
                {/* Gauge Container */}
                <div className="relative w-[300px] h-[220px] flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 mt-12">
                        <span className="text-6xl font-black text-[#071C50] tracking-tighter leading-none">
                            {marks}
                        </span>
                        <div
                            className={`mt-2 px-6 py-1.5 rounded-full ${status.bg} ${status.text} flex items-center gap-2 border border-current/10 shadow-sm transition-all duration-500`}
                        >
                            {status.icon}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                {qualitative}
                            </span>
                        </div>
                    </div>

                    <img
                        src={scoreimage}
                        className="w-[260px] opacity-90 group-hover:scale-105 transition-transform duration-700"
                        alt="Score background"
                    />

                    <img
                        src={polygone}
                        className="absolute z-30 w-6 drop-shadow-lg"
                        style={{
                            left: `${138 + x}px`,
                            top: `${148 - y}px`,
                            transform: `rotate(${-angleInDegrees}deg)`,
                            transition: "all 0.1s linear",
                        }}
                        alt="Indicator"
                    />
                </div>

                <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
                        Diagnostic Intelligence Score
                    </p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#1681FF]/20 to-transparent"></div>
        </div>
    );
};

export default ResumeScoreCard;
