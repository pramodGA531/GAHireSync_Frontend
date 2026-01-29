import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, Button, Table } from "antd";
import Main from "./Layout";
import GoBack from "../../common/Goback";

const { Option } = Select;
const apiurl = import.meta.env.VITE_BACKEND_URL;

const MyResponses = () => {
    const [newList, setNewList] = useState([]);
    const navigate = useNavigate();
    const authToken = sessionStorage.getItem("authToken");
    const { id } = useParams();
    const [applicationList, setApplicationList] = useState([]);

    useEffect(() => {
        if (authToken) {
            fetch(`${apiurl}/api/recruiter/applications/${id}`, {
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
        }
    }, [authToken]);

    const viewApplication = (id) => {
        navigate(`/application/${id}`);
    };

    const handleFilters = (value) => {
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

    const columns = [
        {
            title: "Application Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Resume Status",
            dataIndex: "is_viewed",
            key: "is_viewed",
            render: (is_viewed) => (is_viewed ? "Viewed" : "Not Viewed"),
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Application Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "View Application",
            key: "action",
            render: (text, record) => (
                <Button onClick={() => viewApplication(record.id)}>
                    View Complete Application
                </Button>
            ),
        },
    ];

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-5">
                <div className="flex justify-end items-center mb-4">
                    <Select
                        defaultValue="all"
                        className="w-[120px] mr-4"
                        onChange={handleFilters}
                    >
                        <Option value="all">All</Option>
                        <Option value="reject">Rejected</Option>
                        <Option value="accepted">Accepted</Option>
                        <Option value="hold">On Hold</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="shortlisted">Shortlisted</Option>
                    </Select>
                </div>
                <Link
                    to={`/client/resumes/particular_resume/${id}`}
                    className="text-blue-500 hover:text-blue-700 underline mb-4 block"
                >
                    Change to Comparision view
                </Link>
                <Table
                    className="w-full"
                    dataSource={newList}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </div>
        </Main>
    );
};

export default MyResponses;
