import React, { useState, useEffect } from "react";
import Main from "./Layout";
import { useNavigate } from "react-router-dom";
import { Modal, message, DatePicker } from "antd";
import dayjs from "dayjs";
import { useAuth } from "../../common/useAuth";
import Pageloading from "../../common/loading/Pageloading";
const PlusIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const CalendarIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const CameraBadge = () => (
    <div className="w-[52px] h-[52px] bg-[#FF7144] rounded-[16px] flex items-center justify-center relative shadow-sm">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            <circle cx="12" cy="14" r="3"></circle>
        </svg>
    </div>
);

const DocumentBadge = () => (
    <div className="w-[52px] h-[52px] bg-[#FF7144] rounded-[16px] flex items-center justify-center relative shadow-sm">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    </div>
);

const BoxBadge = () => (
    <div className="w-[52px] h-[52px] bg-white border-2 border-gray-100 rounded-[16px] flex items-center justify-center shadow-sm">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
    </div>
);

const TimelineBubble = ({ title, time, top, left, onClick, zIndex = 10 }) => (
    <div
        style={{ top, left, zIndex }}
        onClick={onClick}
        className="absolute shadow-[0_4px_12px_rgb(0,0,0,0.06)] bg-[#ffffff] bg-opacity-10 border border-[#1681FF]/30 rounded-[12px] p-[5px] px-3 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer max-w-[200px]"
    >
        <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[10px] font-extrabold text-[#111] leading-tight block truncate w-full">
                {title}
            </span>
            <span className="text-[8px] text-gray-500 font-semibold">
                {time}
            </span>
        </div>
    </div>
);

const Interviewer = () => {
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
    const [selectedInterviewInfo, setSelectedInterviewInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const calculateLeftPosition = (timeStr) => {
        if (!timeStr) return "0%";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const totalHours = 14; // 8:00 to 22:00
        const position = ((hours - 8 + minutes / 60) / totalHours) * 100;
        return `${Math.max(0, Math.min(position, 100))}%`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const formattedDate = selectedDate
                    ? selectedDate.format("YYYY-MM-DD")
                    : "";
                const response = await fetch(
                    `${apiurl}/interviewer/new-dashboard/?date=${formattedDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                if (response.ok) {
                    setDashboardData(data);
                } else {
                    message.error(
                        data.error || "Failed to load dashboard data",
                    );
                }
            } catch (error) {
                message.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [apiurl, token, selectedDate]);

    return (
        <Main defaultSelectedKey="1">
            <>
                {loading ? (
                    <Pageloading />
                ) : (
                    <div className="w-full bg-[#f9fafb] min-h-screen font-sans">
                        <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-[22px] md:text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                        Welcome back,{" "}
                                        {dashboardData?.interviewer_name ||
                                            "Interviewer"}{" "}
                                        <span className="text-2xl">👋</span>
                                    </h1>
                                    <p className="text-sm font-medium text-gray-500">
                                        Let's find ways to scale and achieve
                                        greater success.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            setIsConcernModalOpen(true)
                                        }
                                        className="h-10 px-4 border border-gray-300 rounded-lg text-gray-700 text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                                    >
                                        <PlusIcon /> Rise concern
                                    </button>
                                    <button
                                        className="h-10 px-4 bg-[#1681FF] text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm border-t border-blue-400"
                                        onClick={() =>
                                            navigate(
                                                "/interviewer/job-calendar",
                                            )
                                        }
                                    >
                                        <CalendarIcon /> Calendar
                                    </button>
                                </div>
                            </div>

                            {/* Cards Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-gray-800">
                                            Today Interviews
                                        </span>
                                        <span className="text-[32px] font-extrabold text-gray-900 leading-none mt-1">
                                            {dashboardData?.stats?.today || "0"}
                                        </span>
                                    </div>
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="48"
                                            height="48"
                                            rx="9.6875"
                                            transform="matrix(1 0 0 -1 0 48)"
                                            fill="#F97316"
                                        />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M18.417 10.667C14.1368 10.667 10.667 14.1368 10.667 18.417V25.583C10.667 29.8632 14.1368 33.333 18.417 33.333H23V36.333H20C19.4478 36.333 19.0002 36.7809 19 37.333C19 37.8853 19.4477 38.333 20 38.333H28C28.5523 38.333 29 37.8853 29 37.333C28.9998 36.7809 28.5522 36.333 28 36.333H25V33.333H29.583C33.8632 33.333 37.333 29.8632 37.333 25.583L37.333 18.417C37.333 14.1368 33.8632 10.667 29.583 10.667L18.417 10.667ZM27.333 24C28.4376 24 29.333 24.8954 29.333 26C29.333 27.1046 28.4376 28 27.333 28H20.667C19.5624 28 18.667 27.1046 18.667 26C18.667 24.8954 19.5624 24 20.667 24L27.333 24ZM24 16C25.4728 16 26.667 17.1942 26.667 18.667C26.6668 20.1396 25.4727 21.333 24 21.333C22.5273 21.333 21.3332 20.1396 21.333 18.667C21.333 17.1942 22.5272 16 24 16Z"
                                            fill="white"
                                        />
                                    </svg>

                                    {/* <CameraBadge /> */}
                                </div>
                                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-gray-800">
                                            Assigned tasks
                                        </span>
                                        <span className="text-[32px] font-extrabold text-gray-900 leading-none mt-1">
                                            {dashboardData?.stats?.assigned <
                                                10 &&
                                            dashboardData?.stats?.assigned > 0
                                                ? `0${dashboardData?.stats?.assigned}`
                                                : dashboardData?.stats
                                                      ?.assigned || "0"}
                                        </span>
                                    </div>
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="48"
                                            height="48"
                                            rx="7.26562"
                                            transform="matrix(1 0 0 -1 0 48)"
                                            fill="#F97316"
                                        />
                                        <path
                                            d="M32.7188 26.5564V20.125C32.7188 16.9148 30.1164 14.3125 26.9062 14.3125H21.0937C17.8836 14.3125 15.2813 16.9148 15.2813 20.125L15.2812 27.875C15.2812 31.0852 17.8836 33.6875 21.0937 33.6875H25.4012"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M20.125 28.8438H24"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M20.125 24H27.875"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M20.125 19.1562H27.875"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M29.8125 33.6875V27.875"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                        />
                                        <path
                                            d="M32.7188 30.7812L26.9062 30.7813"
                                            stroke="white"
                                            stroke-width="2.17969"
                                            stroke-linecap="round"
                                        />
                                    </svg>

                                    {/* <DocumentBadge /> */}
                                </div>
                                <div className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold text-gray-800">
                                            Upcoming Interviews
                                        </span>
                                        <span className="text-[32px] font-extrabold text-gray-900 leading-none mt-1">
                                            {dashboardData?.stats?.pending <
                                                10 &&
                                            dashboardData?.stats?.pending > 0
                                                ? `0${dashboardData?.stats?.pending}`
                                                : dashboardData?.stats
                                                      ?.pending || "0"}
                                        </span>
                                    </div>
                                    {/* <BoxBadge /> */}
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="48"
                                            height="48"
                                            rx="13.3333"
                                            fill="#1681FF"
                                            fill-opacity="0.05"
                                        />
                                        <path
                                            d="M21 18L21 19C21 20.6569 22.3431 22 24 22C25.6569 22 27 20.6569 27 19V18"
                                            stroke="#28303F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M32.6665 25L31.5569 18.3424C31.2355 16.4137 29.5667 15 27.6113 15H20.3884C18.433 15 16.7642 16.4137 16.4428 18.3424L14.7761 28.3424C14.3698 30.7805 16.2499 33 18.7217 33H24.9999"
                                            stroke="#28303F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M28 31L29.7528 32.4023C30.1707 32.7366 30.7777 32.6826 31.1301 32.2799L34 29"
                                            stroke="#28303F"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 px-6 flex justify-between items-center">
                                    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                                        Today Interviews
                                    </h2>
                                    <div className="flex items-center gap-1 bg-[#f4f5f7] p-1 rounded-xl border border-gray-100">
                                        <button className="px-[14px] py-[6px] flex items-center gap-2 text-[12px] font-bold text-gray-500 rounded-lg hover:text-gray-900 transition-all leading-none">
                                            <CalendarIcon /> Calendar
                                        </button>
                                        <DatePicker
                                            value={selectedDate}
                                            onChange={(date) =>
                                                setSelectedDate(date)
                                            }
                                            allowClear={false}
                                            format="DD MMM YYYY"
                                            className="px-[14px] py-[6px] flex items-center gap-1.5 text-[12px] font-bold text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200"
                                            suffixIcon={
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="relative w-full overflow-x-auto pb-6 px-6 no-scrollbar">
                                    <div className="min-w-[900px] relative min-h-[250px] mt-2">
                                        {/* Time Header */}
                                        <div className="flex border-b border-gray-100 pb-3">
                                            {[...Array(15)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 text-center text-[10px] font-bold text-gray-400"
                                                >
                                                    {`${(i + 8).toString().padStart(2, "0")}:00`}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Grid Lines & Blue Line */}
                                        <div className="absolute top-8 left-0 right-0 bottom-0 flex">
                                            {[...Array(15)].map((_, i) => {
                                                const currentHour =
                                                    currentTime.getHours();
                                                const currentMinute =
                                                    currentTime.getMinutes();
                                                // We only want the active line to show if it falls exactly in this hour's slot
                                                const isCurrentHour =
                                                    currentHour - 8 === i;
                                                const linePosition =
                                                    isCurrentHour
                                                        ? `${(currentMinute / 60) * 100}%`
                                                        : null;

                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex-1 border-r border-dashed border-gray-200 h-full relative"
                                                    >
                                                        {isCurrentHour &&
                                                            currentHour >= 8 &&
                                                            currentHour <=
                                                                22 && (
                                                                <div
                                                                    className="absolute top-0 w-[2px] h-full bg-[#1681FF] z-0"
                                                                    style={{
                                                                        left: linePosition,
                                                                    }}
                                                                >
                                                                    <div className="absolute -top-[3px] -left-[3px] w-2 h-2 rounded-full bg-[#1681FF] ring-4 ring-[#1681FF]/20"></div>
                                                                </div>
                                                            )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Timeline Events based on real data */}
                                        {dashboardData?.today_interviews
                                            ?.length > 0 ? (
                                            dashboardData.today_interviews.map(
                                                (interview, index) => {
                                                    // Calculate alternating top position
                                                    const topOffset =
                                                        35 + (index % 4) * 55;
                                                    const leftPos =
                                                        calculateLeftPosition(
                                                            interview.from_time,
                                                        );

                                                    return (
                                                        <TimelineBubble
                                                            key={
                                                                interview.id ||
                                                                index
                                                            }
                                                            title={`${interview.candidate_name} - ${interview.job_title}`}
                                                            time={
                                                                interview.formatted_time
                                                            }
                                                            top={`${topOffset}px`}
                                                            left={leftPos}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedInterviewInfo(
                                                                    interview,
                                                                );
                                                            }}
                                                        />
                                                    );
                                                },
                                            )
                                        ) : (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-sm text-gray-500 font-semibold">
                                                No interviews scheduled for
                                                today
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lists Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                                {/* Pending Review Container */}
                                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                                            Pending Review
                                        </h2>
                                        <span className="text-[#1681FF] text-[12px] font-bold cursor-pointer hover:underline">
                                            View More
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {dashboardData?.pending_reviews
                                            ?.length > 0 ? (
                                            dashboardData.pending_reviews.map(
                                                (item, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center bg-[#FAFAFA] rounded-[14px] p-3 px-4 border border-gray-100/80"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[12px] font-bold text-gray-800">
                                                                {
                                                                    item.candidate_name
                                                                }{" "}
                                                                -{" "}
                                                                {item.job_title}{" "}
                                                                -{" "}
                                                                {
                                                                    item.round_name
                                                                }
                                                            </span>
                                                            <span className="text-[10.5px] font-semibold text-gray-500">
                                                                {
                                                                    item.formatted_time
                                                                }
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/interviewer/conduct-interview/${item.id}`,
                                                                )
                                                            }
                                                            className="h-8 px-5 bg-[#1681FF] text-white text-[11px] font-bold rounded-lg hover:bg-blue-600 transition-colors"
                                                        >
                                                            Update Review
                                                        </button>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="text-sm text-gray-500 py-4 px-2">
                                                No pending reviews found.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Missed Interviews Container */}
                                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="text-[15px] font-extrabold text-gray-900 tracking-tight">
                                            Missed Interviews
                                        </h2>
                                        <span className="text-[#1681FF] text-[12px] font-bold cursor-pointer hover:underline">
                                            View More
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {dashboardData?.missed_interviews
                                            ?.length > 0 ? (
                                            dashboardData.missed_interviews.map(
                                                (item, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between items-center bg-[#FAFAFA] rounded-[14px] p-3 px-4 border border-gray-100/80"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-[12px] font-bold text-gray-800">
                                                                {
                                                                    item.candidate_name
                                                                }{" "}
                                                                -{" "}
                                                                {item.job_title}{" "}
                                                                -{" "}
                                                                {
                                                                    item.round_name
                                                                }
                                                            </span>
                                                            <span className="text-[10.5px] font-semibold text-gray-500">
                                                                {
                                                                    item.formatted_time
                                                                }
                                                            </span>
                                                        </div>
                                                        <button className="h-8 px-5 border border-red-500 text-red-500 text-[11px] font-bold rounded-lg hover:bg-red-50 transition-colors">
                                                            Reschedule
                                                        </button>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="text-sm text-gray-500 py-4 px-2">
                                                No missed interviews found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Future Feature Modal */}
                <Modal
                    title="Notice"
                    open={isConcernModalOpen}
                    onOk={() => setIsConcernModalOpen(false)}
                    onCancel={() => setIsConcernModalOpen(false)}
                    footer={null}
                    centered
                >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="text-5xl mb-4">🚀</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Coming Soon!
                        </h3>
                        <p className="text-gray-500 text-sm">
                            We are actively building this feature. Please stay
                            tuned.
                        </p>
                    </div>
                </Modal>

                {/* Interview Info Modal */}
                <Modal
                    title="Interview Details"
                    open={!!selectedInterviewInfo}
                    onCancel={() => setSelectedInterviewInfo(null)}
                    footer={null}
                    centered
                >
                    {selectedInterviewInfo && (
                        <div className="flex flex-col gap-4 py-4 px-2">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Candidate Name
                                </span>
                                <div className="text-lg font-bold text-gray-900">
                                    {selectedInterviewInfo.candidate_name}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Role
                                    </span>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {selectedInterviewInfo.job_title}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Round
                                    </span>
                                    <div className="text-sm font-semibold text-gray-800">
                                        {selectedInterviewInfo.round_num !==
                                        undefined
                                            ? `Round ${selectedInterviewInfo.round_num}`
                                            : selectedInterviewInfo.round_name ||
                                              "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Time
                                </span>
                                <div className="text-[15px] font-bold text-[#1681FF]">
                                    {selectedInterviewInfo.formatted_time}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Status
                                </span>
                                <div className="text-sm font-semibold text-gray-800 capitalize mt-1">
                                    <span
                                        className={`px-2.5 py-1 rounded text-xs ${selectedInterviewInfo.status === "pending" ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}
                                    >
                                        {selectedInterviewInfo.status ||
                                            "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </>
        </Main>
    );
};

export default Interviewer;
