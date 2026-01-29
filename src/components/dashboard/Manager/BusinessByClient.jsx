import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Main from "./Layout";
import GoBack from "../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const BusinessByClient = () => {
    const [jobList, setJobList] = useState([]);

    const authToken = sessionStorage.getItem("authToken");

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = () => {
        fetch(`${apiurl}/api/get_all_job_posts/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setJobList(data.data);
                console.log(data.data, "is the data");
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
            title: "Role closed (with date)",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => (
                <span className="font-medium text-gray-700">{text}</span>
            ),
        },
        {
            title: "Payment Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        status === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                    }`}
                >
                    {status || "Pending"}
                </span>
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
                            Business By Client
                        </h2>
                    </div>
                    <div className="p-0">
                        {jobList && jobList.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={jobList}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                    className: "p-4",
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white">
                                <div className="text-5xl mb-4 opacity-20">
                                    💼
                                </div>
                                <span className="text-lg font-bold text-gray-400">
                                    There are no postings found
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default BusinessByClient;
