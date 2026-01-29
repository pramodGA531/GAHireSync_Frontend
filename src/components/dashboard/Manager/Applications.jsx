import React, { useState, useEffect } from "react";
import { Select, Button, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Main from "./Layout";
import GoBack from "../../common/Goback";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const Applications = () => {
    const navigate = useNavigate();
    const authToken = sessionStorage.getItem("authToken");

    const [applicationList, setApplicationList] = useState([]);
    const [newList, setNewList] = useState([]);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchApplications();
    }, [authToken]);

    const fetchApplications = () => {
        console.log(`${apiurl}`);
        fetch(`${apiurl}/api/recruiter/applications/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setApplicationList(data.data);
                setNewList(data.data);
            })
            .catch((error) => console.error(error));
    };

    const viewApplication = (id) => {
        navigate(`/application/${id}`);
    };

    const handleFilters = (value) => {
        setFilter(value);
        let filteredList;
        switch (value) {
            case "reject":
                filteredList = applicationList.filter(
                    (application) => application.status === "rejected",
                );
                break;
            case "accepted":
                filteredList = applicationList.filter(
                    (application) => application.status === "accepted",
                );
                break;
            case "round1":
                filteredList = applicationList.filter(
                    (application) => application.status === "round1",
                );
                break;
            case "round2":
                filteredList = applicationList.filter(
                    (application) => application.status === "round2",
                );
                break;
            case "round3":
                filteredList = applicationList.filter(
                    (application) => application.status === "round3",
                );
                break;
            case "hold":
                filteredList = applicationList.filter(
                    (application) => application.status === "hold",
                );
                break;
            case "pending":
                filteredList = applicationList.filter(
                    (application) => application.status === "pending",
                );
                break;
            case "shortlisted":
                filteredList = applicationList.filter(
                    (application) => application.status === "shortlisted",
                );
                break;
            case "all":
            default:
                filteredList = applicationList;
                break;
        }
        setNewList(filteredList);
    };

    const statusColors = {
        rejected: "bg-red-100 text-red-600",
        accepted: "bg-green-100 text-green-600",
        hold: "bg-orange-100 text-orange-600",
        pending: "bg-gray-100 text-gray-600",
        shortlisted: "bg-blue-100 text-blue-600",
        round1: "bg-purple-100 text-purple-600",
        round2: "bg-purple-100 text-purple-600",
        round3: "bg-purple-100 text-purple-600",
    };

    const columns = [
        {
            title: "Job Id",
            dataIndex: "job_id",
            key: "job_id",
        },
        {
            title: "Application Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Recruiter Name",
            dataIndex: "sender",
            key: "sender",
        },
        {
            title: "Resume Status",
            dataIndex: "is_viewed",
            key: "is_viewed",
            render: (is_viewed) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                        is_viewed
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {is_viewed ? "Viewed" : "Not Viewed"}
                </span>
            ),
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
            render: (text) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: "Application Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        statusColors[status?.toLowerCase()] ||
                        "bg-gray-100 text-gray-600"
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Button
                    onClick={() => viewApplication(record.id)}
                    className="bg-[#1681FF] text-white border-none hover:bg-[#0061D5] font-bold text-xs"
                >
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="4">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Candidate Applications
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-500 uppercase">
                                Filter:
                            </span>
                            <Select
                                defaultValue="all"
                                style={{ width: 160 }}
                                onChange={handleFilters}
                                className="font-medium"
                            >
                                <Select.Option value="all">
                                    All Status
                                </Select.Option>
                                <Select.Option value="reject">
                                    Rejected
                                </Select.Option>
                                <Select.Option value="accepted">
                                    Accepted
                                </Select.Option>
                                <Select.Option value="hold">
                                    On Hold
                                </Select.Option>
                                <Select.Option value="pending">
                                    Pending
                                </Select.Option>
                                <Select.Option value="shortlisted">
                                    Shortlisted
                                </Select.Option>
                            </Select>
                        </div>
                    </div>
                    <div className="p-0">
                        <Table
                            dataSource={newList}
                            columns={columns}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                className: "p-4",
                            }}
                            className="applications-table"
                        />
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default Applications;
