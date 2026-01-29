import React, { useEffect, useState } from "react";
import { useAuth } from "../../common/useAuth";
import Main from "./Layout";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import DashaBoardCard from "./managercards/DashaBoardCard";
import InterviewsCard from "./managercards/InterviewsCard";
// import "./Manager.css";
import interviewschedule from "../../../images/agency/interviewschedule.svg";
import approvalpending from "../../../images/agency/approvalpending.svg";
import rctrjoballocation from "../../../images/agency/rctrjoballocation.svg";
import jobclosed from "../../../images/Manager/Dashboard/jobclosed.svg";
import { Table, Typography } from "antd";
import tableicon from "../../../images/agency/tableicon.svg";
import NodataFound from "../../../images/Illustrations/NoDataFound-1.png";
import Pageloding from "../../common/loading/Pageloading";

// const apiurl = import.meta.env.VITE_BACKEND_URL;

const Manager = () => {
    const { token, apiurl } = useAuth();
    const [Data, setData] = useState(null);
    const [latestJob, setLatestJobs] = useState(null);
    const [tab, setTabs] = useState("Jobs");
    const [loading, setLoading] = useState(false);

    const [upcomingInterviews, setUpcomingInterviews] = useState(null);

    const navigate = useNavigate();

    const fetchTandC = async () => {
        const response = await fetch(`${apiurl}/organization-terms`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.error) {
            message.error(data.error);
        }
        if (data === null) {
            alert("add terms and conditions!");
            navigate("/agency/terms");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/dashboard/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.error) {
                return message.error(data.error);
            }

            if (data.data) {
                setData(data.data);
            }

            if (data.latest_jobs) {
                setLatestJobs(data.latest_jobs);
            }

            if (data.upcoming_interviews) {
                setUpcomingInterviews(data.upcoming_interviews);
            }
        } catch (e) {
            message.error(e);
        } finally {
            setLoading(false);
        }
    };

    const formattedTime = (time) => {
        time = new Date(time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        return time;
    };

    useEffect(() => {
        fetchTandC();
        fetchData();
    }, []);

    const cardData = [
        {
            count: Data?.interviews_scheduled,

            imgSrc: interviewschedule,
            text: "Interview Schedule",
        },
        {
            count: Data?.approval_pending,
            imgSrc: approvalpending,
            text: "Approval Pending",
        },
        {
            count: Data?.recruiter_allocation_pending,
            imgSrc: rctrjoballocation,
            text: "Recrutier Allocation Pending",
        },
        {
            count: Data?.jobpost_edit_requests,
            imgSrc: interviewschedule,
            text: "job post edit request",
        },
        {
            count: Data?.opened_jobs,
            imgSrc: interviewschedule,
            text: "Active job posts",
        },
        {
            count: Data?.closed_jobs,
            imgSrc: jobclosed,
            text: "Closed job posts",
        },
    ];
    const columns = [
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (text, record) => (
                <div className="flex items-center gap-2.5">
                    <img src={tableicon} alt="" className="w-10" />
                    <h4 className="text-[#071C50] font-bold">
                        {text}-{record.location}
                    </h4>
                </div>
            ),
        },
        {
            title: "Positions Left",
            dataIndex: "positions_left",
            key: "positions_left",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
        {
            title: "Applications",
            dataIndex: "applications",
            key: "applications",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
        {
            title: "Interviewed",
            dataIndex: "interviewed",
            key: "interviewed",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
        {
            title: "Rejected",
            dataIndex: "rejected",
            key: "rejected",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
        {
            title: "Feedback Pending",
            dataIndex: "feedback_pending",
            key: "feedback_pending",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
        {
            title: "Offered",
            dataIndex: "offered",
            key: "offered",
            align: "center",
            render: (text) => (
                <span className="text-[#071C50] opacity-50 font-bold">
                    {text}
                </span>
            ),
        },
    ];

    const handleTab = (tab) => {
        if (tab === "Jobs") {
            setTabs("Jobs");
        } else {
            setTabs("onBoarding");
        }
    };

    return (
        <Main defaultSelectedKey="1">
            {loading ? (
                <Pageloding />
            ) : (
                <div className="flex flex-col lg:flex-row gap-5 p-4 mt-4 lg:mt-10">
                    <div className="flex-1 overflow-hidden">
                        <div className="flex flex-col gap-[15px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {cardData.map((obj, index) => (
                                    <DashaBoardCard
                                        key={index}
                                        count={obj.count}
                                        text={obj.text}
                                        imgSrc={obj.imgSrc}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-[#071C50] font-bold text-xl m-[5px]">
                                Require Attention
                            </h2>
                            <div className="flex gap-2.5 mb-4 overflow-x-auto">
                                <h3
                                    onClick={() => handleTab("Jobs")}
                                    className={`cursor-pointer p-[5px] text-lg font-semibold whitespace-nowrap ${
                                        tab === "Jobs"
                                            ? "border-b-2 border-[#FFB8B8]"
                                            : ""
                                    }`}
                                >
                                    Jobs
                                </h3>
                                <h3
                                    onClick={() => handleTab("onBoarding")}
                                    className={`cursor-pointer p-[5px] text-lg font-semibold whitespace-nowrap ${
                                        tab === "onBoarding"
                                            ? "border-b-2 border-[#FFB8B8]"
                                            : ""
                                    }`}
                                >
                                    onBoarding
                                </h3>
                            </div>
                            {tab === "Jobs" ? (
                                <Table
                                    dataSource={latestJob}
                                    columns={columns}
                                    bordered={false}
                                    pagination={false}
                                    className="border border-[#071c501a] rounded-lg overflow-hidden"
                                    scroll={{ x: 1000 }}
                                />
                            ) : (
                                <div className="p-10 text-center opacity-50">
                                    Onboarding Content Coming Soon
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-[400px] flex flex-col bg-[#F3F8FF] rounded-lg p-4 self-start">
                        <div className="text-[#071C50] text-lg font-semibold mb-4 text-left">
                            Upcoming Interviews
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            {upcomingInterviews &&
                                upcomingInterviews.map((key, index) => (
                                    <InterviewsCard
                                        key={index}
                                        time={formattedTime(key.scheduled_time)}
                                        round_num={key.round_num}
                                        job_title={key.job_title}
                                        interviewer_name={key.candidate_name}
                                        is_highlighted={(index + 1) % 4 == 0}
                                    />
                                ))}
                            {upcomingInterviews?.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full mt-[15vh]">
                                    <img
                                        src={NodataFound}
                                        alt=""
                                        className="w-[70%]"
                                    />
                                    <span className="mt-[15px] opacity-60">
                                        No Upcoming Interviews
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Main>
    );
};

export default Manager;
