import React, { useState, useEffect } from "react";
import Main from "./Layout";
import illustration1 from "../../../images/Interviewer/Illustration-1.svg";
import illustration2 from "../../../images/Interviewer/Illustration-2.svg";
import bag from "../../../images/Client/Bag.svg";
import group from "../../../images/Client/group.svg";

import Calendar from "./Calendar";
import { useAuth } from "../../common/useAuth";
import { message } from "antd";
import Pageloading from "../../common/loading/Pageloading";
import { useNavigate } from "react-router-dom";

const InterviewerCard = ({ item }) => {
    return (
        <div className="border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col justify-center mt-2.5 w-full md:w-[300px] rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_12px_45px_rgb(0,0,0,0.08)] hover:-translate-y-0.5">
            <div className="flex gap-[50px] items-start">
                <img src={item.icon} className="h-[50px] mt-2" alt="" />
                <img src={item.illustration} className="h-[100px]" alt="" />
            </div>
            <div className="text-[#4798FC] text-5xl font-bold -mt-4">
                {item.value}
            </div>
            <span className="text-gray-500 text-sm font-medium mt-1">
                {item.query}
            </span>
        </div>
    );
};

const TodayUpcomingInterviews = ({ item }) => {
    const navigate = useNavigate();
    return (
        <div className="m-2 flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100 border-l-[4px] border-l-[#1681FF] shadow-sm transition-all hover:shadow-md">
            <div className="text-xs text-[#16151C] flex flex-col">
                <span className="text">
                    {item.candidate_name} - {item.job_title} - Round{" "}
                    {item.round_num}
                </span>
                <span className="time">
                    {item.from_time} - {item.to_time}
                </span>
            </div>
            <button
                className="bg-[#1681FF] text-white rounded-lg px-4 h-9 text-[11px] font-bold border-none cursor-pointer shadow-sm hover:bg-[#0066FF] transition-all"
                onClick={() =>
                    navigate(
                        `/interviewer/conduct-interview/${item.interview_id}`,
                    )
                }
                disabled={item.status === "completed"}
            >
                Update Review
            </button>
        </div>
    );
};

const MissedInterviews = ({ item }) => {
    return (
        <div className="m-2 flex justify-between items-center p-4 rounded-xl bg-gray-50/50 border border-gray-100 border-l-[4px] border-l-[#1681FF] shadow-sm transition-all hover:shadow-md">
            <div className="text-xs text-[#16151C] flex flex-col">
                <span className="text">
                    {item.candidate_name} - {item.job_title} - Round{" "}
                    {item.round_num}
                </span>
                <span className="time">
                    {item.from_time} - {item.to_time}
                </span>
            </div>
            <button className="bg-[#1681FF] text-white rounded-lg px-4 h-9 text-[11px] font-bold border-none cursor-pointer shadow-sm hover:bg-[#0066FF] transition-all">
                Enter Remarks
            </button>
        </div>
    );
};

const Interviewer = () => {
    const { apiurl, token } = useAuth();
    const [events, setEvents] = useState([]);
    const [todayInterviews, setTodayInterviews] = useState([]);
    const [missedInterviews, setMissedInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cardData, setCardData] = useState([
        {
            icon: group,
            query: "Total No. of interviews assigned",
            value: "0",
            illustration: illustration1,
        },
        {
            icon: bag,
            query: "No. of interviews conducted",
            value: "0",
            illustration: illustration2,
        },
    ]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/interviewer/interviewer-dashboard/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else {
                setEvents(data.events || []);
                setTodayInterviews(data.today_interviews || []);
                setMissedInterviews(data.missed_interviews || []);

                setCardData([
                    {
                        icon: group,
                        query: "Total No. of interviews assigned",
                        value: data.data.assigned || "0",
                        illustration: illustration1,
                    },
                    {
                        icon: bag,
                        query: "No. of interviews conducted",
                        value: data.data.completed || "0",
                        illustration: illustration2,
                    },
                ]);
            }
        } catch (e) {
            message.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Main defaultSelectedKey="1">
            {loading ? (
                <Pageloading></Pageloading>
            ) : (
                <div className="flex flex-col lg:flex-row p-4 lg:p-5 gap-5 lg:justify-between">
                    <div className="w-full lg:w-[65%]">
                        <div className="flex flex-wrap gap-4 lg:gap-[30px] justify-center lg:justify-start">
                            {cardData &&
                                cardData.length > 0 &&
                                cardData.map((item, index) => (
                                    <InterviewerCard key={index} item={item} />
                                ))}
                        </div>

                        <div className="w-full mt-5">
                            <Calendar events={events} />
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px]">
                        <div className="shadow-md rounded-2xl p-[10px_5px] bg-white">
                            <div className="flex justify-between items-center p-[10px_10px_5px]">
                                <div className="text-base font-semibold mb-0">
                                    Today's Interviews
                                </div>
                                <div
                                    onClick={() =>
                                        navigate(
                                            "/interviewer/interviews/upcoming",
                                        )
                                    }
                                    className="text-[#1681FF] text-sm font-medium cursor-pointer"
                                >
                                    View More
                                </div>
                            </div>
                            <div className="cards">
                                {todayInterviews.length > 0 ? (
                                    todayInterviews.map((item, index) => (
                                        <TodayUpcomingInterviews
                                            key={index}
                                            item={item}
                                        />
                                    ))
                                ) : (
                                    <p className="ml-2 mb-2">
                                        No interviews scheduled for today.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="shadow-md rounded-2xl p-[10px_5px] mt-5 bg-white">
                            <div className="flex justify-between items-center p-[10px_10px_5px]">
                                <div className="text-base font-semibold mb-0">
                                    Remarks Pending
                                </div>
                                <div className="text-[#1681FF] text-sm font-medium cursor-pointer">
                                    View More
                                </div>
                            </div>
                            <div className="cards">
                                {missedInterviews.length > 0 ? (
                                    missedInterviews.map((item, index) => (
                                        <MissedInterviews
                                            key={index}
                                            item={item}
                                        />
                                    ))
                                ) : (
                                    <p className="ml-2 mb-2">
                                        No missed interviews.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Main>
    );
};

export default Interviewer;
