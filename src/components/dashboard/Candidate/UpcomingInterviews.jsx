import React, { useEffect, useState } from "react";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import { message, Table, Tag } from "antd";
import Interviewer from "../Interviewer/Interviewer";
// import "./UpcomingInterviews.css";
import GoBack from "../../common/Goback";
const UpcomingInterviews = () => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${apiurl}/candidate/upcoming-interviews/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                const formattedData = result.map((item, index) => ({
                    ...item,
                    key: index,
                }));
                setData(formattedData);
            }
        } catch (e) {
            message.error(e.message || "Something went wrong.");
        }
    };

    const updateState = async () => {
        try {
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: "schedule_interview",
                    }),
                }
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            updateState();
        }
    }, [token]);

    const columns = [
        {
            title: "Company Name",
            dataIndex: "job_id",
            key: "job_id",
            render: (job_id) => {
                return (
                    <p className="text-[#565E6C] m-0">{job_id.company_name}</p>
                );
            },
        },
        {
            title: "Job Title",
            dataIndex: "job_id",
            key: "job_id",
            render: (job_id) => {
                return <p className="text-[#2C5F99] m-0">{job_id.job_title}</p>;
            },
        },

        {
            title: "Round Number",
            dataIndex: "round_num",
            key: "round_num",
        },
        {
            title: "Interviewer Name",
            dataIndex: "interviewer_name",
            key: "interviewer_name",
        },

        {
            title: "Type of Interview",
            dataIndex: [
                "scheduled_date_and_time",
                "interviewer",
                "type_of_interview",
            ],
            key: "type_of_interview",
            render: (text, record) =>
                record?.scheduled_date_and_time?.interviewer
                    ?.type_of_interview || "N/A", // Safe fallback
        },
        {
            title: "Mode of Interview",
            dataIndex: [
                "scheduled_date_and_time",
                "interviewer",
                "mode_of_interview",
            ],
            key: "mode_of_interview",
            render: (text, record) =>
                record?.scheduled_date_and_time?.interviewer
                    ?.mode_of_interview || "N/A", // Safe fallback
        },
        {
            title: "Date of Interview",
            dataIndex: ["scheduled_date_and_time", "scheduled_date"],
            key: "scheduled_date",
            render: (text, record) =>
                record?.scheduled_date_and_time?.scheduled_date || "N/A", // Safe fallback
        },
        {
            title: "Time of Interview",
            dataIndex: ["scheduled_date_and_time", "from_time"],
            key: "from_time",
            render: (text, record) =>
                record?.scheduled_date_and_time?.from_time || "N/A", // Safe fallback
        },
        {
            title: "Link",
            dataIndex: ["scheduled_date_and_time", "meet_link"],
            key: "meet_link",
            render: (text, record) => {
                const mode =
                    record?.scheduled_date_and_time?.interviewer
                        ?.mode_of_interview;
                const link = record?.scheduled_date_and_time?.meet_link;

                if (mode?.toLowerCase() === "online" && link) {
                    return (
                        <a href={link} target="_blank">
                            {link}
                        </a>
                    );
                }

                return "N/A";
            },
        },
        {
            title: "status of Interview",
            dataIndex: ["scheduled_date_and_time", "status"],
            key: "status",
            render: (text, record) => {
                const status = record?.scheduled_date_and_time?.status || "N/A"; // Safe fallback

                // Define status colors
                const statusColors = {
                    scheduled: "blue",
                    completed: "green",
                    // cancelled: "red",
                    pending: "red",
                };

                return (
                    <Tag
                        color={statusColors[status.toLowerCase()] || "default"}
                    >
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
    ];

    console.log("data", data);

    return (
        <Main defaultSelectedKey="3">
            {/* <div className="mt-2 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="p-5">
                <h1 className="text-2xl font-semibold mb-4 text-[#000000] font-bold">
                    Interviews
                </h1>
                {data.length > 0 ? (
                    <Table
                        columns={columns.map((col) => ({
                            ...col,
                            onHeaderCell: () => ({
                                className:
                                    "bg-white text-[#565E6C] text-center font-medium",
                            }),
                            onCell: () => ({
                                className: "text-center",
                            }),
                        }))}
                        dataSource={data}
                        className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] [&_.ant-table-tbody>tr:nth-child(odd)]:bg-[#F6FAFF]"
                    />
                ) : (
                    <p>No upcoming interviews found.</p>
                )}
            </div>
        </Main>
    );
};

export default UpcomingInterviews;
