import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";
import { Button, Modal, Input, message, Tag, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const ClosedHoldJobs = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectingJob, setRejectingJob] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/closed-hold/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const res = await response.json();
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const handleAccept = async (id) => {
        try {
            await fetch(`${apiurl}/manager/jobs/not-approved/APPROVE/${id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            message.success("Job approved successfully");
            fetchData();
        } catch (err) {
            message.error("Error approving job");
        }
    };

    const handleReject = async () => {
        try {
            await fetch(
                `${apiurl}/manager/jobs/not-approved/REJECT/${rejectingJob.id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ feedback }),
                },
            );
            message.success("Job rejected with feedback");
            setRejectingJob(null);
            setFeedback("");
            fetchData();
        } catch (err) {
            message.error("Error rejecting job");
        }
    };

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Title",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div
                    onClick={() => {
                        navigate(`/agency/postings/${row.original.id}`);
                    }}
                    className="font-semibold cursor-pointer text-[#3B82F6] hover:underline"
                >
                    {row.getValue("job_title")}
                </div>
            ),
        },
        {
            accessorKey: "client_name",
            header: "Client Name",
            searchField: true,
            width: 200,
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("created_at")).toLocaleString(),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("created_at")).toLocaleString(),
        },
        {
            accessorKey: "status",
            header: "Status",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("created_at")).toLocaleString(),
        },
        {
            header: "Actions",
            accessorKey: "id",
            width: 220,
            cell: ({ row }) => {
                const job = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            type="text"
                            icon={<CloseOutlined className="text-[#EF4444]" />}
                            onClick={() => setRejectingJob(job)}
                            title="Reject Job"
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const filteredData = React.useMemo(() => {
        if (statusFilter === "All") return data;
        return data.filter(
            (item) => item.status?.toLowerCase() === statusFilter.toLowerCase(),
        );
    }, [data, statusFilter]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-4">
            {/* <div className="-ml-2 mt-4">
                <GoBack />
            </div> */}
            <AppTable
                title="Not Approved Jobs"
                columns={columns}
                data={filteredData}
                loading={loading}
                customFilters={
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: 150 }}
                        options={[
                            { label: "All Status", value: "All" },
                            { label: "Closed", value: "closed" },
                            { label: "Hold", value: "hold" },
                        ]}
                    />
                }
            />

            {/* Modal for Reject Feedback */}
            <Modal
                title="Reject Job"
                open={!!rejectingJob}
                onOk={handleReject}
                onCancel={() => {
                    setRejectingJob(null);
                    setFeedback("");
                }}
                okText="Submit"
                okButtonProps={{ disabled: !feedback.trim() }}
            >
                <p>Please provide a reason for rejection:</p>
                <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback here..."
                />
            </Modal>
        </Main>
    );
};

export default ClosedHoldJobs;
