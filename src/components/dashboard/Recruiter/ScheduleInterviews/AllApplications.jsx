import React, { useState } from "react";
import ScheduledApplications from "./ScheduledApplications";
import Main from "../Layout";
import ApplicationsToSchedule from "./ApplicationsToSchedule";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const AllApplications = () => {
    const [component, setComponent] = useState("yet to schedule");

    return (
        <Main defaultSelectedKey="4">
            <div className="min-h-screen bg-[#F9FAFB]">
                {/* Navigation Header */}
                <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                    <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex flex-col md:flex-row justify-between items-center py-6 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#071C50] flex items-center justify-center text-white shadow-lg shadow-blue-50">
                                <CalendarOutlined className="text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-[#071C50] tracking-tight uppercase leading-none">
                                    Schedule Central
                                </h1>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mt-2">
                                    Managing Global Interview Orchestration
                                </p>
                            </div>
                        </div>

                        <div className="flex bg-gray-50/50 p-1.5 rounded-[20px] border border-gray-100 shadow-inner">
                            <button
                                onClick={() => setComponent("yet to schedule")}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-300 ${
                                    component === "yet to schedule"
                                        ? "bg-white text-[#1681FF] shadow-xl shadow-blue-50/50 font-black scale-[1.02]"
                                        : "text-gray-400 font-bold hover:text-[#071C50]"
                                }`}
                            >
                                <ClockCircleOutlined
                                    className={
                                        component === "yet to schedule"
                                            ? "text-[#1681FF]"
                                            : "text-gray-300"
                                    }
                                />
                                <span className="text-[10px] uppercase tracking-widest">
                                    Awaiting Setup
                                </span>
                            </button>
                            <button
                                onClick={() => setComponent("already")}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all duration-300 ${
                                    component === "already"
                                        ? "bg-[#071C50] text-white shadow-xl shadow-blue-900/10 font-black scale-[1.02]"
                                        : "text-gray-400 font-bold hover:text-[#071C50]"
                                }`}
                            >
                                <CheckCircleOutlined
                                    className={
                                        component === "already"
                                            ? "text-blue-400"
                                            : "text-gray-300"
                                    }
                                />
                                <span className="text-[10px] uppercase tracking-widest">
                                    Active Registry
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Stream */}
                <div className="animate-in fade-in duration-700">
                    {component === "yet to schedule" ? (
                        <ApplicationsToSchedule />
                    ) : (
                        <ScheduledApplications />
                    )}
                </div>

                <div className="pb-12 text-center opacity-20">
                    <p className="text-[10px] font-black text-[#071C50] uppercase tracking-[0.5em]">
                        System Orchestration Layer
                    </p>
                </div>
            </div>
        </Main>
    );
};

export default AllApplications;
