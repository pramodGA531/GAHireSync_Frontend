import React, { useState, useEffect } from "react";
import { useAuth } from "../../common/useAuth";
import { Button, message, Table, Tag } from "antd";
import Main from "./Layout";
// import './MyApplications.css'
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GoBack from "../../common/Goback";
const CandidateApplications = () => {
    const [data, setData] = useState([]);
    const { token, apiurl } = useAuth();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/applications`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                return message.error(result.error);
            }
            setData(result.data);
        } catch (e) {
            message.error("Failed to fetch applications");
            console.error(e);
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
                        category: ["promote_candidate", "reject_candidate"],
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
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_id",
            render: (jobTitle, record) => (
                <div className="text-[#2C5F99] text-base flex gap-2.5 items-center justify-center">
                    {jobTitle}
                    <EyeOutlined
                        onClick={() =>
                            navigate(
                                `/candidate/complete-jobdetails/${record.job_id}`
                            )
                        }
                    />
                </div>
            ),
        },
        {
            title: "Application Status",
            dataIndex: "application_status",
            key: "application_status",
            render: (application_status) => {
                const color =
                    application_status === "selected"
                        ? "green"
                        : application_status === "rejected"
                        ? "red"
                        : "blue";
                return (
                    <Tag color={color}>{application_status.toUpperCase()}</Tag>
                );
            },
        },

        {
            title: "Sender",
            dataIndex: "sender",
            key: "sender",
        },
        {
            title: "Receiver",
            dataIndex: "receiver",
            key: "receiver",
        },
        {
            title: "Next Interview",
            dataIndex: "next_interview",
            key: "next_interview",
        },
        {
            title: "Round Number",
            dataIndex: "round_number",
            key: "round_number",
            render: (round_number) => {
                const round = round_number == 0 ? "-" : round_number;
                return <div className="text-[#2C5F99]">Round - {round}</div>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button
                    onClick={() =>
                        viewApplication(record.application_id, record.job_id)
                    }
                    className="bg-[#1681FF] text-white border-none text-xs w-[150px] block mx-auto hover:bg-blue-600 hover:text-white"
                >
                    View Application
                </Button>
            ),
        },
    ];

    const viewApplication = (application_id, job_id) => {
        navigate(`/candidate/complete-application/${application_id}/${job_id}`);
    };

    return (
        <Main defaultSelectedKey="2">
            {/* <div className="mt-4 -ml-2">
                <GoBack />
            </div> */}
            <div className="p-5">
                <h2 className="text-black text-xl font-bold mb-4">Candidate Applications</h2>
                <Table
                    columns={columns.map((col) => ({
                        ...col,
                        onHeaderCell: () => ({
                            className:
                                "bg-[#FAFAFB] text-[#565E6C] text-center font-medium text-base p-2.5",
                        }),
                        onCell: () => ({
                            className: "text-center p-2",
                        }),
                    }))}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    className="shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] [&_.ant-table-tbody>tr]:h-[70px]"
                />
            </div>
        </Main>
    );
};

export default CandidateApplications;
