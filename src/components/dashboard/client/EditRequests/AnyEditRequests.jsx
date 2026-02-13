import React, { useState, useEffect } from "react";
import { Button, message, Tabs, Select } from "antd"; // Added Select
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Main from "../Layout";
// import GoBack from "../../../common/Goback";
import AppTable from "../../../common/AppTable";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const { TabPane } = Tabs;
const { Option } = Select; // Destructure Option

const AnyEditRequests = () => {
    const navigate = useNavigate();
    const [jobList, setJobList] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const [statusFilter, setStatusFilter] = useState("All"); // Add filter state

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
            header: "JOB CODE",
            accessorKey: "job_code",
            searchField: true,
        },
        {
            header: "Job Title",
            accessorKey: "job_title",
            searchField: true,
        },
        {
            header: "Organization Code",
            accessorKey: "organization_code",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <>
                        {record.organization_name} (
                        <span>{record.organization_code}</span>)
                    </>
                );
            },
            searchField: true, // Searching by organization code/name would be good but cell render is complex.
            // AppTable searchField filters based on accessorKey value.
            // If organization_code is the accessor, it filters by that.
        },
        {
            header: "Requested by",
            accessorKey: "edited_by",
            searchField: true,
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const record = row.original;
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

    // Filter data based on status
    const getJobListArray = () => {
        if (Array.isArray(jobList)) return jobList;
        if (jobList && Array.isArray(jobList.jobs)) return jobList.jobs;
        if (jobList && Array.isArray(jobList.data)) return jobList.data;
        return [];
    };

    const filteredData = getJobListArray().filter((item) => {
        if (statusFilter === "All") return true;
        return item.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-3">
            <div className="m-1">
                {/* <div className="mt-4 -ml-2 -mb-4">
                    <GoBack />
                </div> */}
                <div className="p-5">
                    <AppTable
                        columns={jobColumns}
                        data={filteredData}
                        customFilters={
                            <Select
                                defaultValue="All"
                                style={{ width: 150 }}
                                onChange={(value) => setStatusFilter(value)}
                                className="custom-filter-select"
                            >
                                <Option value="All">All Status</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                            </Select>
                        }
                    />
                </div>
            </div>
        </Main>
    );
};

export default AnyEditRequests;
