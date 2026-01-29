import React, { useContext, useEffect, useState } from "react";
import { Table, Button } from "antd";
import Main from "./Layout";
import GoBack from "../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const RequestReview = ({ Toggler }) => {
    const [jobList, setJobList] = useState([]);
    const navigate = useNavigate();
    const { authToken, login } = useContext(AuthContext);

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, [login]);

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
            })
            .catch((error) =>
                console.error("Error fetching job posts:", error),
            );
    };

    const handleCompleteDetails = (id) => {
        navigate(`/job_post_details/${id}`);
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
            title: "Role Details",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => (
                <span className="font-medium text-gray-700">{text}</span>
            ),
        },
        {
            title: "Candidate Joining",
            dataIndex: "is_assigned",
            key: "is_assigned",
            render: (text) => (
                <span className="text-gray-500">{text || "Pending"}</span>
            ),
        },
        {
            title: "Service Fee",
            dataIndex: "service_fee",
            key: "service_fee",
            render: (text) => (
                <span className="font-semibold text-gray-800">
                    {text ? `₹${text}` : "N/A"}
                </span>
            ),
        },
        {
            title: "Status",
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
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Review Requests
                        </h2>
                        <Button
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 text-gray-600 border-none hover:bg-gray-200 font-bold"
                        >
                            Back
                        </Button>
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
                                    📝
                                </div>
                                <span className="text-lg font-bold text-gray-400">
                                    No requests for review
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default RequestReview;
