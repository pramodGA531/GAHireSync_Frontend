import React, { useState, useEffect } from "react";
import { Table, Button, message, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const { TabPane } = Tabs;

const AnyEditRequests = () => {
    const navigate = useNavigate();
    const [jobList, setJobList] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const fetchData = () => {
        try {
            fetch(`${apiurl}/client/not-approval-jobs/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setJobList(data);
                    setInterviewers(data.interviewers_data);
                    console.log(data, " is the received data");
                })
                .catch((error) => {
                    message.error(
                        "Failed to fetch job posts. Please try again.",
                    );
                });
        } catch (e) {
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
                        category: ["edit_job"],
                    }),
                },
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

    const handleDetails = (id) => {
        setLoading(true);
        navigate(`/client/edited_job_details/${id}`);
    };

    const handleInterviewersData = (id) => {
        navigate(`/client/interviewers_data/${id}`);
    };

    const jobColumns = [
        {
            title: "JOB CODE",
            dataIndex: "job_code",
            key: "job_code",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Organization Code",
            key: "organizaton_code",
            render: (text, record) => (
                <>
                    {record.organization_name} (
                    <span>{record.organization_code}</span>)
                </>
            ),
        },
        {
            title: "Requested by",
            dataIndex: "edited_by",
            key: "edited_by",
        },
        {
            title: "Status",
            key: "status",
            render: (text, record) => {
                if (record.status === "pending") {
                    return (
                        <Button
                            type="primary"
                            onClick={() => handleDetails(record.id)}
                            loading={loading}
                        >
                            See Complete Details
                        </Button>
                    );
                } else {
                    return <p>{record.status}</p>;
                }
            },
        },
    ];

    const interviewerColumns = [
        {
            title: "ID",
            dataIndex: "job_id",
            key: "job_id",
        },
        {
            title: "Edited By",
            dataIndex: "edited_by",
            key: "edited_by",
        },
        {
            title: "View Complete Details",
            key: "viewInterviewersDetails",
            render: (text, record) => (
                <Button onClick={() => handleInterviewersData(record.job_id)}>
                    See Complete details
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-3">
            <div>
                <div className="mt-4 -ml-2 -mb-4">
                    <GoBack />
                </div>
                {jobList && jobList.length > 0 ? (
                    <Table
                        columns={jobColumns}
                        dataSource={jobList}
                        rowKey="id"
                    />
                ) : (
                    <div className="text-center p-5">
                        There are no changes in postings
                    </div>
                )}
            </div>
        </Main>
    );
};

export default AnyEditRequests;
