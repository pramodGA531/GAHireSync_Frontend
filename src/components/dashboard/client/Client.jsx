import React, { useEffect, useState } from "react";

import Main from "./Layout";
import { useNavigate } from "react-router-dom";
import Bag from "./../../../images/Client/Bag.svg";
import Closed from "./../../../images/Client/Closed.svg";
import Experience from "./../../../images/Client/Experience.svg";
import Location from "./../../../images/Client/Location.svg";
import Vacancies from "./../../../images/Client/Vacancies.svg";
import Calendar2 from "./../../../images/Client/Calendar.svg";
import Group from "./../../../images/Client/group.svg";
import Empty from "./../../../images/Client/empty.svg";
import Send from "./../../../images/Client/send.svg";
import Table from "../../common/Table";
import { useAuth } from "../../common/useAuth";

const Component1 = ({ item }) => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 min-w-[280px]">
            <div className="border-l-[5px] border-[#29C5EE] p-2.5 rounded-2xl bg-[#F7F7F7] shadow-sm">
                <div className="flex justify-between mt-2.5">
                    <div
                        className="text-[#1681FF] text-[17px] font-bold truncate"
                        title={item.job_title}
                    >
                        {item.job_title}
                    </div>
                    <div className="flex gap-2.5 items-center">
                        {item.edit_request_status === "pending" ? (
                            <div
                                className="bg-[#29FF160D] text-[#378820] border-2 border-[#34AE12] px-2.5 py-1 text-[8px] rounded-lg cursor-pointer"
                                onClick={() =>
                                    navigate("/client/edit-requests")
                                }
                            >
                                New Edit Request
                            </div>
                        ) : item.approval_status === "pending" ? (
                            <div
                                onClick={() =>
                                    navigate(
                                        `client/complete_job_post/${item.id}`
                                    )
                                }
                                className="text-[8px] px-2.5 py-1 rounded-lg bg-[#FFD0160D] text-[#E4920F] border-2 border-[#D5AF32] cursor-pointer"
                            >
                                Approval pending
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer"
                                onClick={() =>
                                    navigate(
                                        `client/complete_job_post/${item.id}`
                                    )
                                }
                            >
                                <img src={Send} alt="" />
                            </div>
                        )}
                    </div>
                </div>
                <span className="text-[#555] text-xs font-medium">
                    Posted {item.posted}
                </span>
                <div className="flex gap-2.5 mt-1.5 flex-wrap">
                    <div className="rounded-[23px] flex items-center gap-1 bg-[rgba(22,129,255,0.05)] px-2.5 py-2">
                        <img src={Location} alt="" className="h-4" />
                        <span className="text-[#555] text-xs font-medium truncate max-w-[80px]">
                            {item.location}
                        </span>
                    </div>
                    <div className="rounded-[23px] flex items-center gap-1 bg-[rgba(22,129,255,0.05)] px-2.5 py-2">
                        <img src={Experience} alt="" className="h-4" />
                        <span className="text-[#555] text-xs font-medium">
                            {item.years_of_experience} exp
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-2.5">
                    <div className="text-[#1681FF] text-4xl font-bold flex items-baseline">
                        <span className="pr-1.5">{item.applications}</span>
                        <span className="text-[#555] text-sm font-normal">
                            Applications
                        </span>
                    </div>
                    <span className="text-[#00B85E] text-[11px] font-normal pb-2.5">
                        {item.applications_last_week} in last week
                    </span>
                </div>
            </div>
        </div>
    );
};

const Component2 = ({ item }) => {
    return (
        <div className="rounded-2xl border border-[rgba(162,161,168,0.2)] flex-1 min-w-[200px] p-4 bg-[#F7F7F7] shadow-sm">
            <div className="flex items-center mb-4">
                <div className="mr-2.5 rounded-lg bg-[#1681FF0D] p-1.5 flex items-center justify-center">
                    <img src={item.logo} alt="" className="w-5 h-5" />
                </div>
                <span className="text-[#A2A1A8] font-medium text-sm">
                    {item.label}
                </span>
            </div>
            <div className="border-b border-[#A2A1A833] pb-4 mb-4">
                <span className="text-[#16151C] font-semibold text-3xl block">
                    {item.value}
                </span>
            </div>
            <span className="text-[#A2A1A8] font-light text-xs block">
                Update: {item.last_update}
            </span>
        </div>
    );
};

const Client = () => {
    const navigate = useNavigate();
    const [sec2Details, setSec2Details] = useState([
        { label: "No of Roles", logo: Group, value: 0, last_update: "" },
        { label: "Resumes Received", logo: Bag, value: 0, last_update: "" },
        { label: "On Process", logo: Calendar2, value: 0, last_update: "" },
        {
            label: "Total Vacancies",
            logo: Vacancies,
            value: 0,
            last_update: "",
        },
        { label: "Closed", logo: Closed, value: 0, last_update: "" },
    ]);

    const columns = [
        {
            title: "Interviewer Name",
            dataIndex: "interviewer_name",
            key: "interviewer_name",
            render: (text) => <div className="text-center">{text}</div>,
        },
        {
            title: "Email",
            dataIndex: "interviewer_email",
            key: "interviewer_email",
            render: (text) => <div className="text-center">{text}</div>,
        },
        {
            title: "Jobs Allotted",
            dataIndex: "jobs_alloted",
            key: "jobs_alloted",
            render: (text) => <div className="text-center">{text}</div>,
        },
        {
            title: "Rounds Allotted",
            dataIndex: "rounds_alloted",
            key: "rounds_alloted",
            render: (text) => <div className="text-center">{text}</div>,
        },
        {
            title: "Pending Rounds",
            dataIndex: "pending",
            key: "pending",
            render: (text) => <div className="text-center">{text}</div>,
        },
        {
            title: "Completed Rounds",
            dataIndex: "completed",
            key: "completed",
            render: (text) => <div className="text-center">{text}</div>,
        },
    ];
    const { apiurl, token } = useAuth();
    const [jobs, setJobs] = useState();
    const [interviewers, setInterviewers] = useState([]);
    const [todayInterviews, setTodayInterviews] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/client/dashboard`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                console.log(data.error);
            }
            console.log(data);
            setJobs(data.job_posts);
            let applications_data = data.data;
            const updatedDetails = [
                {
                    label: "No of Roles",
                    logo: Group,
                    value: applications_data.no_of_roles,
                    last_update: new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    }),
                },
                {
                    label: "Resumes Received",
                    logo: Bag,
                    value: applications_data.resumes_received,
                    last_update: new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    }),
                },
                {
                    label: "On Process",
                    logo: Calendar2,
                    value: applications_data.on_process,
                    last_update: new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    }),
                },
                {
                    label: "Total Vacancies",
                    logo: Vacancies,
                    value: applications_data.vacancies,
                    last_update: new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    }),
                },
                {
                    label: "Closed",
                    logo: Closed,
                    value: applications_data.closed,
                    last_update: new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    }),
                },
            ];
            setSec2Details(updatedDetails);
            setInterviewers(data.interviewers_data);
            setTodayInterviews(data.today_interviews);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <Main defaultSelectedKey="1" defaultSelectedChildKey="">
            <div className="p-5">
                <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                    {jobs &&
                        jobs.map((item, index) => (
                            <Component1 item={item} key={index}></Component1>
                        ))}
                </div>
                <div className="flex gap-5 mt-5 flex-wrap">
                    {sec2Details.map((item, index) => (
                        <Component2 item={item} key={index}></Component2>
                    ))}
                </div>
                <div className="flex gap-5 mt-8 flex-col xl:flex-row">
                    <div className="flex-1 overflow-x-auto">
                        {interviewers && (
                            <Table
                                columns={columns}
                                data={interviewers}
                                pagination={false}
                                className="w-full"
                            />
                        )}
                    </div>
                    {todayInterviews && (
                        <div className="p-5 w-full xl:w-auto min-w-[300px] border border-[#A2A1A833] rounded-xl bg-white shadow-sm self-start">
                            <span className="text-[#1681FF] font-semibold text-lg block mb-4">
                                Today's Interviews
                            </span>
                            <div className="space-y-4">
                                {todayInterviews.length > 0 ? (
                                    todayInterviews.map((item, index) => (
                                        <div
                                            className="flex flex-col gap-1"
                                            key={index}
                                        >
                                            <span className="text-[#16151C] font-semibold text-base">
                                                {item.from_time}
                                            </span>
                                            <div className="h-px bg-gray-100 w-full"></div>
                                            <div className="border-l-[3px] border-[#1681FF] pl-2.5 bg-gradient-to-r from-[rgba(22,129,255,0.1)] to-transparent py-1">
                                                <div className="text-[#16151C] font-light text-sm">
                                                    {item.candidate_name} -{" "}
                                                    {item.job_title}
                                                </div>
                                                <div className="text-[#16151C] font-semibold text-sm">
                                                    Round-{item.round_num} and{" "}
                                                    {item.interviewer_name}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center py-5">
                                        <img
                                            src={Empty}
                                            alt="No Data"
                                            className="w-12 h-12 opacity-50 mb-2"
                                        />
                                        <p className="text-[#A2A1A8] text-sm">
                                            No Interviews Found
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default Client;
