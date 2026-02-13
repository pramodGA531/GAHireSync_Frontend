"use client";

import { useState, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { Button } from "antd";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
export default function ClientInterviewersCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("week");
    const { token, apiurl } = useAuth();
    const [loading, setLoading] = useState(false);

    // Sample interview data
    const [interviews, setInterviews] = useState([]);

    const allTypes = [
        "design",
        "coding",
        "hr",
        "behavioral",
        "technical",
        "ml",
        "frontend",
        "backend",
        "fullstack",
        "database",
        "product",
        "cloud",
        "devops",
        "security",
        "datascience",
        "blockchain",
        "ai",
        "networking",
        "architecture",
        "datastructures",
    ];

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${apiurl}/client/job-post/interviews/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const fetchedinterviews = data.scheduled_interviews.map(
                    (obj, index) => {
                        const [rawStart, rawEnd] =
                            obj.scheduled_time.split(" - ");

                        // Extract only HH:MM part from HH:MM:SS
                        const startTime = rawStart.slice(0, 5); // "06:00"
                        const endTime = rawEnd.slice(0, 5); // "10:00"

                        return {
                            id: index.toString(),
                            name: obj.candidate_name,
                            day: obj.scheduled_date,
                            title: obj.job_id.job_title,
                            time: obj.scheduled_time,
                            startTime,
                            endTime,
                            mode_of_interview: obj.mode_of_interview,
                            meet: obj.meet_link,
                            type: allTypes[
                                Math.floor(Math.random() * allTypes.length)
                            ],
                        };
                    }
                );

                setInterviews([
                    {
                        id: 29,
                        title: "AI/ML Final Round",
                        day: "2025-03-23",
                        startTime: "11:00",
                        endTime: "12:00",
                        type: "ai",
                    },
                    {
                        id: 30,
                        title: "software Developer",
                        day: "2025-03-21",
                        startTime: "12:00",
                        endTime: "2:00",
                        type: "ai",
                    },
                    ...fetchedinterviews,
                ]);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    // Get the start of the current week (Monday)
    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(date.setDate(diff));
    };

    // Get week days starting from Monday

    const getWeekDays = () => {
        const startOfWeek = getStartOfWeek(new Date(currentDate));
        const weekDays = [];

        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);

            weekDays.push({
                dayName: dayNames[day.getDay()],
                date: day,
            });
        }

        return weekDays;
    };

    // Get time slots from 8 AM to 5 PM
    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 19; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
        }
        return slots;
    };

    // Format date as "DD"
    const formatDate = (date) => {
        return date.date.getDate().toString();
    };

    // Format month and year
    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    // Get day name (3 letters)
    const getDayName = (date) => {
        return date.date
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase();
    };

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    // Go to today
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Check if a date is today
    const isToday = (date) => {
        console.log("date", date.date);
        const today = new Date();
        return (
            date.date.getDate() === today.getDate() &&
            date.date.getMonth() === today.getMonth() &&
            date.date.getFullYear() === today.getFullYear()
        );
    };

    // Calculate interview position and size
    const calculateInterviewStyle = (interview) => {
        // Convert start and end times to hours for positioning
        const [startHour, startMinute] = interview.startTime
            .split(":")
            .map(Number);
        const [endHour, endMinute] = interview.endTime.split(":").map(Number);

        // Calculate top position (relative to 8 AM)
        const startFromTop = (startHour - 8) * 60 + startMinute;

        // Calculate height based on duration
        const durationMinutes =
            (endHour - startHour) * 60 + (endMinute - startMinute);

        return {
            top: `${startFromTop}px`,
            height: `${durationMinutes}px`,
            left: `${interview.day * (100 / 7)}%`,
            width: `${100 / 7.7}%`,
        };
    };

    // Current Time Indicator Component
    const CurrentTimeIndicator = () => {
        const [currentTimePosition, setCurrentTimePosition] = useState(null);

        useEffect(() => {
            const updateCurrentTimePosition = () => {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                // Calculate the current position based on the time slots (relative to 8 AM)
                const minutesSince8AM = (currentHour - 8) * 60 + currentMinute;

                // Ensure the indicator is only displayed within the defined time slots (8 AM to 5 PM)
                if (currentHour >= 8 && currentHour <= 17) {
                    setCurrentTimePosition(minutesSince8AM);
                } else {
                    setCurrentTimePosition(null); // Hide the indicator if outside the time slots
                }
            };

            // Update the position every minute
            updateCurrentTimePosition();
            const intervalId = setInterval(updateCurrentTimePosition, 60000);

            return () => clearInterval(intervalId);
        }, []);

        if (currentTimePosition === null) {
            return null;
        }

        return (
            <div
                className="absolute left-0 right-0 h-[1px] bg-[#3b82f6] border-t border-dashed border-[#3b82f6] z-10"
                style={{
                    top: `${currentTimePosition}px`,
                }}
            />
        );
    };

    const weekDays = getWeekDays();
    const timeSlots = getTimeSlots();

    const [openIntPop, setOpenIntPop] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const handleOpenDetails = (interview) => {
        setSelectedInterview(interview);
        setOpenIntPop(true);
    };

    function getHourDifference(startTime, endTime) {
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        const today = new Date();

        const start = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            startHours,
            startMinutes
        );
        const end = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            endHours,
            endMinutes
        );

        // If end time is earlier than start time, assume it's the next day
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60); // Convert ms to hours

        return diffHours;
    }

    return (
        <Main defaultSelectedKey="5" defaultSelectedChildKey="5-3">
            {loading ? (
                <Pageloading /> // Display loading spinner while data is loading
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                        {/* <div className="-ml-6">
                            <GoBack />
                            </div> */}
                        <div className="flex items-center gap-4">
                            
                            <span className="text-xl font-semibold text-gray-800 tracking-tight">
                                {formatMonthYear(currentDate)}
                            </span>
                            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                                <button
                                    onClick={goToPreviousWeek}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                >
                                    <LeftOutlined
                                        style={{ fontSize: "14px" }}
                                    />
                                </button>
                                <button
                                    onClick={goToToday}
                                    className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={goToNextWeek}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                                >
                                    <RightOutlined
                                        style={{ fontSize: "14px" }}
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                    view === "week"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setView("week")}
                            >
                                Week
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col bg-white">
                        <div className="overflow-x-auto flex-1 flex flex-col">
                            <div className="min-w-[800px] flex-1 flex flex-col">
                                {/* Day headers */}
                                <div className="flex h-16 border-b border-gray-200">
                                    <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50/50"></div>
                                    {weekDays.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`flex-1 flex flex-col items-center justify-center border-r border-gray-100 transition-colors ${
                                                isToday(day)
                                                    ? "bg-blue-50/30"
                                                    : "bg-white"
                                            }`}
                                        >
                                            <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                                                {getDayName(day)}
                                            </div>
                                            <div
                                                className={`w-9 h-9 flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                                                    isToday(day)
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                {formatDate(day)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
                                    {/* Time column */}
                                    <div className="w-16 shrink-0 border-r border-gray-100 bg-gray-50/30">
                                        {timeSlots.map((time, index) => (
                                            <div
                                                key={index}
                                                className="h-[60px] flex items-start justify-center pt-2 text-xs font-medium text-gray-400 relative"
                                            >
                                                <span className="-mt-3 bg-white px-1 z-10">
                                                    {time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar grid */}
                                    <div className="flex-1 relative overflow-hidden">
                                        {/* Time grid lines */}
                                        {timeSlots.map((_, index) => (
                                            <div
                                                key={index}
                                                className="absolute left-0 right-0 h-[1px] bg-[#f1f5f9]"
                                                style={{
                                                    top: `${
                                                        (index + 1) * 60
                                                    }px`,
                                                }}
                                            ></div>
                                        ))}

                                        {/* Day columns */}
                                        <div className="flex absolute inset-0">
                                            {weekDays.map((day, dayIndex) => {
                                                const dayFormatted = new Date(
                                                    day.date
                                                )
                                                    .toISOString()
                                                    .split("T")[0]; // Convert day.date to YYYY-MM-DD
                                                console.log(
                                                    "dayFormatted",
                                                    dayFormatted
                                                );

                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className="flex-1 border-r border-[#f1f5f9] h-full relative"
                                                    >
                                                        {/* Filter interviews that match the current day's date */}
                                                        {interviews
                                                            .filter(
                                                                (interview) => {
                                                                    console.log(
                                                                        "time duration ",
                                                                        getHourDifference(
                                                                            interview.startTime,
                                                                            interview.endTime
                                                                        )
                                                                    );

                                                                    return (
                                                                        interview.day ==
                                                                        dayFormatted
                                                                    );
                                                                }
                                                            )
                                                            .map(
                                                                (interview) => {
                                                                    const style =
                                                                        calculateInterviewStyle(
                                                                            interview
                                                                        );

                                                                    const typeColors =
                                                                        {
                                                                            designer:
                                                                                "bg-[#f1f5f9]",
                                                                            coding: "bg-[#e0f2fe]",
                                                                            hr: "bg-[#fde68a]",
                                                                            behavioral:
                                                                                "bg-[#fef3c7]",
                                                                            technical:
                                                                                "bg-[#d1fae5]",
                                                                            ml: "bg-[#fbcfe8]",
                                                                            frontend:
                                                                                "bg-[#fef9c3]",
                                                                            backend:
                                                                                "bg-[#f3e8ff]",
                                                                            fullstack:
                                                                                "bg-[#dbeafe]",
                                                                            database:
                                                                                "bg-[#fef2f2]",
                                                                            product:
                                                                                "bg-[#e2e8f0]",
                                                                            cloud: "bg-[#c7d2fe]",
                                                                            devops: "bg-[#a7f3d0]",
                                                                            security:
                                                                                "bg-[#facc15]",
                                                                            datascience:
                                                                                "bg-[#bbf7d0]",
                                                                            blockchain:
                                                                                "bg-[#fca5a5]",
                                                                            ai: "bg-[#bfdbfe]",
                                                                            networking:
                                                                                "bg-[#fde047]",
                                                                            architecture:
                                                                                "bg-[#fbcfe8]",
                                                                            cultural:
                                                                                "bg-[#fef9c3]",
                                                                        };

                                                                    const bgColor =
                                                                        typeColors[
                                                                            interview
                                                                                .type
                                                                        ] ||
                                                                        "bg-[#f1f5f9]";

                                                                    return (
                                                                        <div
                                                                            onClick={() =>
                                                                                handleOpenDetails(
                                                                                    interview
                                                                                )
                                                                            }
                                                                            key={
                                                                                interview.id
                                                                            }
                                                                            className={`absolute m-1 p-2 rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group overflow-hidden ${bgColor}`}
                                                                            style={{
                                                                                top: style.top,
                                                                                height: `${Math.max(
                                                                                    parseInt(
                                                                                        style.height
                                                                                    ) -
                                                                                        8,
                                                                                    40
                                                                                )}px`, // Subtracted margin/padding space
                                                                                // left: style.left,
                                                                                // width: style.width,
                                                                                left: "2px",
                                                                                right: "2px",
                                                                                borderLeftColor:
                                                                                    "rgb(59 130 246)", // Blue-500
                                                                                zIndex: 5,
                                                                            }}
                                                                        >
                                                                            <div className="text-xs font-semibold text-gray-800 truncate mb-0.5 group-hover:text-blue-700">
                                                                                {
                                                                                    interview.title
                                                                                }
                                                                            </div>
                                                                            <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                                                {
                                                                                    interview.startTime
                                                                                }{" "}
                                                                                -{" "}
                                                                                {
                                                                                    interview.endTime
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Current time indicator */}
                                        <CurrentTimeIndicator />

                                        {/* Interview blocks */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal
                title="Interview Details"
                open={openIntPop}
                onCancel={() => setOpenIntPop(false)}
                footer={[]}
            >
                {selectedInterview && (
                    <CalendarInterviewCard interview={selectedInterview} />
                )}
            </Modal>
        </Main>
    );
}

// import React from "react";

const CalendarInterviewCard = ({ interview }) => {
    return (
        <div className="bg-white rounded-lg p-4 font-sans">
            <div className="flex justify-between items-center text-base font-bold text-[#007bff]">
                <span className="font-medium text-sm mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {interview.title}
                </span>
                <button className="bg-none border-none text-base cursor-pointer">
                    ⤢
                </button>
            </div>
            <div className="flex justify-between mt-3">
                <div className="w-[48%]">
                    <div className="mb-2.5">
                        <span className="block text-xs text-gray-500">
                            Date
                        </span>
                        <span className="text-sm font-bold text-black">
                            {interview.day}
                        </span>
                    </div>
                    <div className="mb-2.5">
                        <span className="block text-xs text-gray-500">
                            {interview.title}
                        </span>
                        <span className="text-sm font-bold text-black">
                            {interview.type}
                        </span>
                    </div>
                    <div className="mb-2.5">
                        <span className="block text-xs text-gray-500">
                            Time
                        </span>
                        <span className="flex flex-col text-sm font-bold text-black opacity-90">
                            <span className="bg-[#fce4ec] text-[#d81b60] px-1.5 py-0.5 rounded text-[10px] inline-block mb-1 w-[60px]">
                                30 mins
                            </span>{" "}
                            {interview.startTime} - {interview.endTime}
                        </span>
                    </div>
                    {interview.mode_of_interview}
                    {interview.meet_link && (
                        <div className="mb-2.5">
                            <span className="block text-xs text-gray-500">
                                Online Link
                            </span>
                            <a
                                href={interview.meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#007bff] no-underline"
                            >
                                {interview.meet_link}
                            </a>
                        </div>
                    )}
                </div>
                <div className="w-[48%]">
                    <div className="mb-2.5">
                        <span className="block text-xs text-gray-500">
                            Candidate
                        </span>
                        <span className="text-sm font-bold text-black">
                            Ameer
                        </span>
                    </div>
                    <div className="mb-2.5">
                        <span className="block text-xs text-gray-500">
                            Interviewer
                        </span>
                        <div className="flex items-center">
                            <img
                                src="https://randomuser.me/api/portraits/men/1.jpg"
                                alt="Kalki"
                                className="w-[30px] h-[30px] rounded-full mr-2"
                            />
                            <span className="text-sm font-bold text-black">
                                Kalki
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-3">
                {/* need to implement the functionality here */}
                <button className="border-none px-3 py-1.5 rounded cursor-pointer text-sm bg-[#f8f9fa] text-black">
                    Edit
                </button>
                <button className="border-none px-3 py-1.5 rounded cursor-pointer text-sm bg-[#007bff] text-white">
                    Share
                </button>
            </div>
        </div>
    );
};
