import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import {
    CalendarOutlined,
    HistoryOutlined,
    UserOutlined,
    GlobalOutlined,
    FieldTimeOutlined,
    RocketOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Button, Tag, Empty } from "antd";
import GoBack from "../../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const EventList = ({ events }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                        <HistoryOutlined className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#071C50] tracking-tighter uppercase m-0">
                            Event Registry
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            Audit logs of all scheduled recruitment activities
                        </p>
                    </div>
                </div>
                <div className="bg-indigo-600 px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                    {events.length} Scheduled
                </div>
            </div>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-indigo-400 tracking-tighter leading-none mb-1">
                                            {new Date(
                                                event.interview_time,
                                            ).toLocaleString("default", {
                                                month: "short",
                                            })}
                                        </span>
                                        <span className="text-lg font-black text-[#071C50] leading-none">
                                            {new Date(
                                                event.interview_time,
                                            ).getDate()}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#071C50]">
                                                {event.event_description}
                                            </span>
                                            <Tag className="bg-indigo-50 text-indigo-600 border-none rounded-md font-black text-[9px] uppercase px-2">
                                                Round {event.round_num}
                                            </Tag>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                                            <span className="flex items-center gap-1.5">
                                                <GlobalOutlined className="text-[8px]" />{" "}
                                                Job ID: {event.job_id}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <UserOutlined className="text-[8px]" />{" "}
                                                Recruiter: {event.recruiter_id}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FieldTimeOutlined className="text-[8px]" />{" "}
                                                {new Date(
                                                    event.interview_time,
                                                ).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end lg:self-center">
                                    <Button
                                        icon={<EditOutlined />}
                                        className="h-10 px-6 rounded-xl border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-200"
                                    >
                                        Inspect
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <Empty description={false} />
                    <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">
                        No active events in registry
                    </p>
                </div>
            )}
        </div>
    );
};

const CalendarManage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const authToken = sessionStorage.getItem("authToken");

    useEffect(() => {
        if (authToken) {
            fetchEvents();
        }
    }, [authToken]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/api/manage_interviews/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch events");
            const data = await response.json();
            if (data.success && Array.isArray(data.success)) {
                const sortedEvents = data.success.sort(
                    (a, b) =>
                        new Date(a.interview_time) - new Date(b.interview_time),
                );
                setEvents(sortedEvents);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEvents = () => {
        navigate("/create_events/");
    };

    return (
        <Main defaultSelectedKey="3">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-12">
                <div className="max-w-[1200px] mx-auto">
                    {/* Page Header */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-[#071C50] tracking-tighter uppercase mb-2">
                                Calendar Control
                            </h1>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Operational Nexus for Interview Scheduling
                            </p>
                        </div>
                        <Button
                            type="primary"
                            icon={<RocketOutlined />}
                            onClick={handleEvents}
                            className="h-16 px-10 rounded-2xl bg-[#071C50] border-none font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:scale-105 hover:bg-[#1681FF] transition-all"
                        >
                            Schedule New Shift
                        </Button>
                    </div>

                    <div className="bg-white rounded-[48px] border border-gray-100 shadow-xl overflow-hidden p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <EventList events={events} />
                    </div>

                    <div className="mt-12 text-center opacity-10 flex flex-col items-center">
                        <div className="h-0.5 w-24 bg-[#071C50] mb-4"></div>
                        <p className="text-[10px] font-black text-[#071C50] uppercase tracking-[1em]">
                            Tactical Calendar Management
                        </p>
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default CalendarManage;
