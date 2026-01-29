import React, { useEffect, useState } from "react";

import { useAuth } from "../../../common/useAuth";
import { useParams } from "react-router-dom";
import { message } from "antd";
import Main from "../Layout";
import Profile from "../../../../images/Client/profile.png";
import Note from "../../../../images/Client/note.svg";
import Table from "../../../common/Table";
import { SearchOutlined } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";

const ViewInterviewer = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [interviewerDetails, setInterviewerDetails] = useState();
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/get-interviewers/?interviewer_id=${id}`,
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
                setData(data.interviews);
                setFilteredData(data.interviews);
                setInterviewerDetails(data);
            }
        } catch (error) {
            message.error("Something went wrong while fetching data.");
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Scheduled Date",
            dataIndex: "scheduled_date",
            key: "scheduled_date",
        },
        { title: "Job Title", dataIndex: "job_title", key: "job_title" },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        { title: "Agency Name", dataIndex: "agency_name", key: "agency_name" },
        {
            title: "Type of Interview",
            dataIndex: "type_of_interview",
            key: "type_of_interview",
        },
        {
            title: "Mode of Interview",
            dataIndex: "mode_of_interview",
            key: "mode_of_interview",
        },
        { title: "Round No", dataIndex: "round_num", key: "round_num" },
        {
            title: "Status",
            dataIndex: "interview_status",
            key: "interview_status",
            render: (status) => {
                const statusColors = {
                    pending: "orange",
                    completed: "#1681FF0D",
                    Rejected: "red",
                    Selected: "blue",
                };

                const textColor = {
                    pending: "white",
                    completed: "#1681FF",
                };

                const backgroundColor = statusColors[status] || "white";
                const color = textColor[status] || "#16151C";

                return (
                    <div
                        style={{
                            backgroundColor,
                            color,
                            padding: "4px 8px",
                            borderRadius: "12px",
                            textAlign: "center",
                            minWidth: "80px",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-block",
                        }}
                    >
                        {status}
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = data.filter((item) =>
            item.job_title?.toLowerCase().includes(value.toLowerCase()),
        );
        setFilteredData(filtered);
    };

    return (
        <Main defaultSelectedKey="5">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    {interviewerDetails && (
                        <div className="p-2.5">
                            <div className="flex items-start text-[32px] font-semibold text-[#171A1F]">
                                {interviewerDetails.interviewer_name}
                            </div>
                            <div className="flex w-full bg-[#1681FF0D] items-center p-5 rounded-[10px] gap-2.5 mt-2.5">
                                <img
                                    src={Profile}
                                    alt=""
                                    className="h-[50px] w-[50px]"
                                />
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold text-lg">
                                        {interviewerDetails.interviewer_name}
                                    </span>
                                    <span className="font-light text-sm text-[#54577A] opacity-80">
                                        {interviewerDetails.interviewer_email}
                                    </span>
                                </div>
                                <div className="flex justify-center gap-2.5 items-center font-normal text-base text-[#54577A] pl-5 border-l border-gray-300 ml-5">
                                    <img src={Note} alt="" />
                                    {interviewerDetails.alloted} Rounds Alloted
                                </div>
                                <div className="flex justify-center gap-2.5 items-center font-normal text-base text-[#54577A] pl-5 border-l border-gray-300">
                                    <img src={Note} alt="" />
                                    {interviewerDetails.scheduled} Scheduled
                                </div>
                                <div className="flex justify-center gap-2.5 items-center font-normal text-base text-[#54577A] pl-5 border-l border-gray-300">
                                    <img src={Note} alt="" />{" "}
                                    {interviewerDetails.completed} Completed
                                </div>
                            </div>
                        </div>
                    )}
                    {filteredData && (
                        <div className="border border-[#A2A1A833] mx-[30px] my-2.5 pt-2.5 rounded-[10px]">
                            <div className="mx-[15px] my-2.5 p-2.5 flex border border-[#A2A1A866] text-[#16151C] rounded-[10px] gap-[5px] text-base w-fit items-center bg-white">
                                <SearchOutlined className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Job Title"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="outline-none border-none bg-white text-[#16151C] text-base w-[250px]"
                                />
                            </div>
                            <div className="mx-[15px] my-2.5">
                                <Table
                                    columns={columns}
                                    data={filteredData}
                                    pagination={false}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </Main>
    );
};

export default ViewInterviewer;
