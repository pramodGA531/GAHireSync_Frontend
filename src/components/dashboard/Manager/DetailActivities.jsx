import React, { useEffect, useState } from "react";
import { Table } from "antd";
import GoBack from "../../common/Goback";
const DetailActivities = () => {
    const [jobList, setJobList] = useState([]);
    const authToken = sessionStorage.getItem("authToken");

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = () => {
        fetch(`${apiurl}/api/client_activities/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setJobList(data.data);
            })
            .catch((error) =>
                console.error("Error fetching job posts:", error),
            );
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "username",
            key: "username",
            render: (text) => (
                <span className="font-bold text-[#071C50]">{text}</span>
            ),
        },
        {
            title: "Role & Share Date",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => (
                <span className="font-medium text-gray-700">{text}</span>
            ),
        },
        {
            title: "Recruiter Assigned",
            dataIndex: "recruiter_name",
            key: "recruiter_name",
            render: (text) => (
                <span className="text-blue-600 font-medium">
                    {text || "Unassigned"}
                </span>
            ),
        },
        {
            title: "Started Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => (
                <span className="text-gray-500">
                    {new Date(text).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: "Resumes Shared",
            dataIndex: "candidates",
            key: "candidates",
            render: (text) => (
                <span className="font-bold text-gray-800">{text || 0}</span>
            ),
        },
        {
            title: "Shortlisted",
            dataIndex: "candidates_shortlisted",
            key: "candidates_shortlisted",
            render: (text) => (
                <span className="font-bold text-green-600">{text || 0}</span>
            ),
        },
    ];

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Detailed Client Activities
                        </h2>
                    </div>
                    <div className="p-0">
                        {jobList && jobList.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={jobList}
                                rowKey="id"
                                pagination={{ pageSize: 10, className: "p-4" }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white">
                                <div className="text-5xl mb-4 opacity-20">
                                    📊
                                </div>
                                <span className="text-lg font-bold text-gray-400">
                                    No activities recorded yet
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default DetailActivities;
