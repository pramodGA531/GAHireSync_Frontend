import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";
import { Button, Modal, Input, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const NotApprovedJobs = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectingJob, setRejectingJob] = useState(null);
    const [canOpenModal, setCanOpenModal] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [showReasonBox, setShowReasonBox] = useState(false);
    const [reason, setReason] = useState("");
    const [planLimitJob, setPlanLimitJob] = useState(null);
    const { TextArea } = Input;
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-approved/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const res = await response.json();
            if (response.ok && res.data) {
                setData(res.data);
            } else {
                message.error(res.message || "Failed to fetch jobs");
            }
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const handleAccept = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-approved/APPROVE/${id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            if (response.ok) {
                message.success("Job approved successfully");
                fetchData();
            } else {
                const res = await response.json();
                message.error(res.message || "Error approving job");
            }
        } catch (err) {
            message.error("Error approving job");
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-approved/REJECT/${rejectingJob.id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reason: feedback }),
                },
            );
            if (response.ok) {
                message.success("Job rejected with feedback");
                setRejectingJob(null);
                setFeedback("");
                fetchData();
            } else {
                const res = await response.json();
                message.error(res.message || "Error rejecting job");
            }
        } catch (err) {
            message.error("Error rejecting job");
        }
    };
    const handleNavigation = (rowId, can_open) => {
        if (can_open) {
            navigate(`/agency/postings/${rowId}`);
        } else {
            const job = data.find((j) => j.id === rowId);
            setPlanLimitJob(job);
            setCanOpenModal(true);
        }
    };
    const printMessage = (message) => {
        console.log("Message:", message);
    };

    // Print user reason
    const printReason = () => {
        console.log("User Reason:", reason);
    };

    // Handle upgrade navigation
    const handleUpgrade = () => {
        printMessage("User chose to upgrade plan");
        setCanOpenModal(false);
        navigate("/upgrade-plan");
    };

    // Handle reason submit
    const handleSubmitReason = async () => {
        if (!planLimitJob) return;

        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-approved/PLAN_LIMIT_REJECT/${planLimitJob.id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reason: reason }),
                },
            );

            if (response.ok) {
                message.success("Reason sent to the client successfully");
                setCanOpenModal(false);
                setShowReasonBox(false);
                setReason("");
                setPlanLimitJob(null);
                fetchData();
            } else {
                const res = await response.json();
                message.error(res.message || "Failed to send reason");
            }
        } catch (err) {
            message.error("An error occurred while sending the reason");
        }
    };
    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Title",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div
                        onClick={() => {
                            // navigate(`/agency/postings/${row.original.id}`);
                            // console.log("calling row",row);
                            handleNavigation(
                                row.original.id,
                                row.original.can_open,
                            );
                        }}
                        className="font-semibold cursor-pointer text-[#3B82F6] hover:underline"
                    >
                        {row.getValue("job_title")}
                    </div>
                    {row.original.reason && (
                        <Tag color="orange" className="ml-2">
                            Note Sent
                        </Tag>
                    )}
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
            header: "Actions",
            accessorKey: "id",
            width: 220,
            cell: ({ row }) => {
                const job = row.original;
                return (
                    <div className="flex gap-2">

  {/* Accept */}
  <button
    onClick={() => {
      if (job.can_open) {
        handleAccept(job.id);
      } else {
        setPlanLimitJob(job);
        setCanOpenModal(true);
      }
    }}
    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
  >
    Accept
  </button>

  {/* Edit */}
  <button
    onClick={() => {
      if (job.can_open) {
        navigate(`/agency/edit_job/${job.id}`);
      } else {
        setPlanLimitJob(job);
        setCanOpenModal(true);
      }
    }}
    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
  >
    Edit
  </button>

  {/* Reject */}
  <button
    onClick={() => setRejectingJob(job)}
    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
  >
    Reject
  </button>

</div>

                );
            },
        },
    ];

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-3">
            {/* <div className="-ml-4 mt-4">
                <GoBack />
            </div> */}
            <AppTable
                title="Not Approved Jobs"
                columns={columns}
                data={data}
                loading={loading}
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
            <Modal
                title="Plan Limit Reached"
                open={canOpenModal}
                onCancel={() => {
                    setCanOpenModal(false);
                    setShowReasonBox(false);
                    setReason("");
                    setPlanLimitJob(null);
                }}
                footer={null}
                destroyOnClose
            >
                {!showReasonBox ? (
                    <>
                        <p>You have reached your current plan limit.</p>

                        <div style={{ textAlign: "right" }}>
                            <Button
                                style={{ marginRight: 16, marginTop: 16 }}
                                onClick={() => {
                                    setReason(planLimitJob?.reason || "");
                                    setShowReasonBox(true);
                                }}
                            >
                                {planLimitJob?.reason
                                    ? "View/Resend Note"
                                    : "Note to the Client"}
                            </Button>

                            <Button type="primary" onClick={handleUpgrade}>
                                Upgrade Plan
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-2">
                            Reason communicated to the client:
                        </p>

                        <TextArea
                            rows={4}
                            value={reason}
                            className="m-2"
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter your reason..."
                        />

                        <div style={{ textAlign: "right", marginTop: 16 }}>
                            <Button
                                onClick={() => setShowReasonBox(false)}
                                style={{ marginRight: 8 }}
                            >
                                Back
                            </Button>

                            <Button type="primary" onClick={handleSubmitReason}>
                                Submit
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </Main>
    );
};

export default NotApprovedJobs;
