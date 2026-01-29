import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";

const JobEditRequests = () => {
    const navigate = useNavigate();
    const [jobList, setJobList] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { apiurl, token } = useAuth();

    const fetchData = () => {
        try {
            setLoading(true);
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
                        "Failed to fetch job posts. Please try again."
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (e) {
            console.error(e);
            setLoading(false); // fallback in case fetch throws before .finally
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleDetails = (id) => {
        setLoading(true);
        navigate(`/client/edited_job_details/${id}`);
    };

    const jobColumns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Organization Name",
            dataIndex: "organization_name",
            key: "organization_name",
        },
        {
            title: "Organization Code",
            key: "organizaton_code",
            dataIndex: "organization_code",
        },
        {
            title: "Requested by",
            dataIndex: "edited_by_username",
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

    return (
        <div>
            {loading ? (
                <Pageloading />
            ) : jobList && jobList.length > 0 ? (
                <Table columns={jobColumns} dataSource={jobList} rowKey="id" />
            ) : (
                <div className="text-center p-5">
                      There are no changes in postings
                </div>
            )}
        </div>
    );
};

export default JobEditRequests;
