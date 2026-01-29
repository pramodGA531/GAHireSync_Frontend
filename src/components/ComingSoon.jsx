import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("2026-02-01T00:00:00").getTime(); // Set a target date

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                ),
                minutes: Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                ),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Styles for stars/nebula effects simulation
    const starsStyle = {
        backgroundImage:
            "radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0))",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
    };

    const twinklingStyle = {
        backgroundImage:
            "radial-gradient(2px 2px at 50px 100px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 100px 50px, #fff, rgba(0,0,0,0))",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
    };

    return (
        <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden bg-gradient-to-br from-[#2e1065] via-[#5b21b6] to-[#7e22ce]">
            <div
                className="absolute top-0 left-0 w-full h-full z-[1] animate-twinkle opacity-50"
                style={starsStyle}
            ></div>
            <div
                className="absolute top-0 left-0 w-full h-full z-[2] animate-move-background opacity-30"
                style={twinklingStyle}
            ></div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 max-w-[800px] w-full bg-[#5b21b6]/20 backdrop-blur-[10px] rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    COMING SOON
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-[600px] leading-relaxed opacity-90">
                    We are working hard to bring you an amazing experience. Stay
                    tuned for something incredible!
                </p>

                <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-10 w-full">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div
                            key={unit}
                            className="flex flex-col items-center min-w-[80px] md:min-w-[100px]"
                        >
                            <div className="text-4xl md:text-6xl font-bold bg-white/10 rounded-lg p-3 md:p-4 w-full backdrop-blur-sm border border-white/10 shadow-inner">
                                {value < 10 ? `0${value}` : value}
                            </div>
                            <span className="text-sm md:text-base mt-2 uppercase tracking-widest opacity-80">
                                {unit}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 bg-white text-[#5b21b6] font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                    >
                        Go Home
                    </button>
                    <button
                        className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full shadow-lg hover:bg-white/10 transition-all transform hover:scale-105"
                        onClick={() => window.location.reload()}
                    >
                        Notify Me
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
