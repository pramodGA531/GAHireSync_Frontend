import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Table from "../../../common/Table";
// import "./ScheduledInterviews.css";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const CompletedInterviews = () => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/interviewer/completed-interviews/?page=${page}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setData(data.results);
            setTotal(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData(currentPage);
        }
    }, [token, currentPage]);

    const columns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
            render: (title, record) => (
                <div
                    onClick={() => {
                        navigate(`/interviewer/jobpost/${record.job_id}`);
                    }}
                    style={{
                        color: "#2C5F99",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    {title}
                </div>
            ),
        },
        {
            title: "Rounds Number",
            dataIndex: "round_num",
            key: "round_num",
        },
        {
            title: "Mode of Interview",
            dataIndex: "mode_of_interview",
            key: "mode_of_interview",
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Scheduled Time",
            dataIndex: "scheduled_date",
            key: "scheduled_date",
            render: (text) => new Date(text).toLocaleDateString(),
            sorter: (a, b) =>
                new Date(a.schedule_date) - new Date(b.schedule_date),
            sortDirections: ["ascend", "descend"],
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
            {loading ? (
                <Pageloading />
            ) : (
                data && (
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="-ml-6">
                            <GoBack />
                        </div>
                        <h1 className="text-xl font-bold">
                            Completed Interviews
                        </h1>
                        <Table
                            columns={columns}
                            data={data}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: total, // Total interviews count for pagination
                                onChange: (page, pageSize) => {
                                    setCurrentPage(page);
                                    setPageSize(pageSize);
                                },
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20", "50"],
                            }}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                                        <div>
                                            <strong className="text-gray-700">
                                                Primary Skills Rating:
                                            </strong>{" "}
                                            {record.primary_skills_rating}
                                        </div>
                                        <div>
                                            <strong className="text-gray-700">
                                                Secondary Skills Rating:
                                            </strong>{" "}
                                            {record.secondary_skills_rating}
                                        </div>
                                        <div>
                                            <strong className="text-gray-700">
                                                Remarks:
                                            </strong>{" "}
                                            {record?.remarks || "No Remarks"}
                                        </div>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                )
            )}
        </Main>
    );
};

export default CompletedInterviews;
