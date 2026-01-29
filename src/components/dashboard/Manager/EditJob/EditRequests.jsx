import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const EditRequests = () => {
    const navigate = useNavigate();
    const [jobList, setJobList] = useState([]);
    const authToken = sessionStorage.getItem("authToken");

    useEffect(() => {
        fetchEditRequests();
    }, []);

    const fetchEditRequests = () => {
        fetch(`${apiurl}/api/not_approval_jobs/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch job posts");
                }
                return response.json();
            })
            .then((data) => {
                setJobList(data.data);
            })
            .catch((error) => {
                message.error("Failed to fetch job posts. Please try again.");
            });
    };

    const handleDetails = (id) => {
        navigate(`/job_post_details/${id}`);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" onClick={() => handleDetails(record.id)}>
                    View Complete Details
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="2">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div>
                {jobList && jobList.length > 0 ? (
                    <Table columns={columns} dataSource={jobList} rowKey="id" />
                ) : (
                    <div className="no-postings">There are no editings</div>
                )}
            </div>
        </Main>
    );
};

export default EditRequests;
