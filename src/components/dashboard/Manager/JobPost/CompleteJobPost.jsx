import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
// import "./CompleteJobPost.css";
import {
    Button,
    Table,
    Modal,
    Select,
    message,
    Input,
    Breadcrumb,
    Spin,
    Typography,
    Tag,
} from "antd";
const { Text, Title, Paragraph } = Typography;
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import ViewJobPost from "../../../common/ViewJobPost";
import { EyeOutlined } from "@ant-design/icons";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CloudCog, Sparkles } from "lucide-react";
import GoBack from "../../../common/Goback";

const AIInsightsDashboard = ({ content, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
                <Spin
                    indicator={
                        <LoadingOutlined
                            style={{ fontSize: 40, color: "#6366f1" }}
                            spin
                        />
                    }
                />
                <div className="text-center">
                    <Title level={4} className="!mb-1 text-indigo-900">
                        AI Analysis in Progress
                    </Title>
                    <Text className="text-gray-400 font-medium">
                        Deep diving into job logs and requirements...
                    </Text>
                </div>
            </div>
        );
    }

    if (!content) return null;

    // Helper to strip markdown and format красиво
    const sections = content
        .split(/### |#### /)
        .filter((s) => s.trim().length > 0);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <Tag
                    color="indigo"
                    className="m-0 border-none rounded-full px-3 py-1 text-[10px] items-center gap-1.5 flex"
                >
                    <Sparkles size={12} className="text-indigo-600" />
                    AI AGENT ANALYSIS
                </Tag>
            </div>

            {sections.map((section, idx) => {
                const lines = section.trim().split("\n");
                const title = lines[0].replace(/[:*#]/g, "").trim();
                const body = lines.slice(1).join("\n").trim();

                if (!body && idx === 0) return null; // Skip if title only (main header)

                return (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <Title
                                level={5}
                                className="!m-0 text-gray-800 uppercase tracking-wider text-[13px] font-bold"
                            >
                                {title}
                            </Title>
                        </div>
                        <div className="text-gray-600 leading-relaxed text-[14px]">
                            {body.split("\n").map((line, lidx) => {
                                const cleanLine = line
                                    .replace(/^[*+-]\s*/, "")
                                    .replace(/[*_~`]/g, "")
                                    .trim();
                                if (!cleanLine) return null;
                                return (
                                    <div
                                        key={lidx}
                                        className="mb-3 flex gap-3 group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-2 flex-shrink-0 group-hover:bg-indigo-400 transition-colors" />
                                        <span>{cleanLine}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Sparkles className="text-indigo-600" size={20} />
                </div>
                <div>
                    <Text className="text-indigo-900 font-bold block">
                        AI Powered Report
                    </Text>
                    <Text className="text-indigo-600/70 text-xs">
                        Generated in real-time based on latest system logs.
                    </Text>
                </div>
            </div>
        </div>
    );
};

const CompleteJobPost = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { apiurl, token } = useAuth();
    const [job, setJob] = useState(null);
    const [recruiters, setRecruiters] = useState([]);
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [status, setStatus] = useState();
    const [interviewers, setInterviewers] = useState();
    const [editHistory, setEditHistory] = useState([]);
    const [openEditRequests, setOpenEditRequests] = useState(false);
    const [fieldOpen, setFieldOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [locations, setLocations] = useState([]);
    const [rejectJob, setRejectJob] = useState(false);

    // Plan Limit States
    const [canOpenModal, setCanOpenModal] = useState(false);
    const [showReasonBox, setShowReasonBox] = useState(false);
    const [reason, setReason] = useState("");
    const [planLimitJob, setPlanLimitJob] = useState(null);

    // AI Summary States
    const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
    const [jobSummary, setJobSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);

    const fetchAIJobSummary = async () => {
        setSummaryLoading(true);
        setIsSummaryModalVisible(true);
        try {
            const response = await fetch(`${apiurl}/ai/job-summary/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setJobSummary(data.summary);
            } else {
                message.error(data.error || "Failed to fetch summary");
            }
        } catch (error) {
            message.error("An error occurred while fetching summary");
        } finally {
            setSummaryLoading(false);
        }
    };

    const fetchJobDetails = async () => {
        if (token) {
            try {
                setLoading(true);
                const response = await fetch(
                    `${apiurl}/job-details/?job_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                setJob(data.job);
                setInterviewers(data.job.interview_details);
                setSelectedRecruiters(data.assigned_recruiters);
                setLocations(data.job.locations);

                // Check for plan limit
                const notApprovedResponse = await fetch(
                    `${apiurl}/manager/jobs/not-approved/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const notApprovedData = await notApprovedResponse.json();
                const matchedJob = notApprovedData.data?.find(
                    (j) => j.id === parseInt(id),
                );
                if (matchedJob && matchedJob.can_open === false) {
                    setPlanLimitJob(matchedJob);
                    setCanOpenModal(true);
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchJobEditDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job-edit-details/?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.edit_history) {
                setEditHistory(data.edit_history);
            }
            if (data.status) {
                setStatus(data.status);
            } else if (data.notFound) {
                setStatus("not found");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
        fetchJobEditDetails();
    }, [token, id, apiurl]);

    const fetchRecruiters = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${apiurl}/agency/recruiters/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched recruiters:", data);
                if (Array.isArray(data)) {
                    setRecruiters(data);
                    console.log("inside:", data);
                } else {
                    console.error("Recruiters response is not an array:", data);
                    setRecruiters([]);
                }
            } else {
                console.error(
                    "Failed to fetch recruiters, status:",
                    response.status,
                );
                message.error("Failed to fetch recruiters list");
            }
        } catch (error) {
            console.error("Error fetching recruiters:", error);
            message.error("Error fetching recruiters");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = () => {
        setIsModalVisible(true);
        fetchRecruiters();
    };

    const handleChangeRecruiter = () => {
        setIsModalVisible(true);
        fetchRecruiters();
    };

    const handleEditRequest = async (action) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/action-on-edit-job/?id=${id}&action=${action}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.message) {
                message.success(data.message);
                setOpenEditRequests(false);
                fetchJobEditDetails();
            } else if (data.error) {
                message.error(data.error);
            }
        } catch (error) {
            console.error("Error handling edit request:", error);
            message.error("Something went wrong");
        }
    };

    const handleJobPost = async (action) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/job-action/?id=${id}&action=${action}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reason: rejectReason,
                    }),
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            }
            if (data.message) {
                message.success(data.message);
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
            message.error(e);
        }
    };

    const handleSelectRecruiters = (locationId, recruiterIds) => {
        setSelectedRecruiters((prev) => ({
            ...prev,
            [locationId]: recruiterIds,
        }));
    };

    const handleCloseJob = async () => {
        try {
            const response = await fetch(
                `${apiurl}/manager/close-job/?id=${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.data) {
                message.error("There is an error in closing job");
            }
            const data = await response.json();
            if (data.error) {
                return message.error(data.error);
            }
            if (data.message) {
                message.success(data.message);
                window.location.reload();
            }
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitRecruiter = async () => {
        if (!selectedRecruiters) {
            message.error("Please select a recruiter");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/manager/job/assign-recruiter/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        job_id: id,
                        recruiter_ids: selectedRecruiters,
                    }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                message.success("Recruiter updated successfully");
                setIsModalVisible(false);
                fetchJobDetails();
            } else {
                message.error("Failed to update recruiter");
            }
        } catch (error) {
            console.error("Error updating recruiter:", error);
            message.error("An error occurred while updating the recruiter");
        }
    };

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
                fetchJobDetails();
            }
        } catch (err) {
            message.error("An error occurred while sending the reason");
        }
    };

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="m-4">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => navigate(-1)}
                                    className="text-gray-400 text-sm cursor-pointer hover:underline"
                                >
                                    Job Posts
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="text-gray-800 text-sm">
                                    Job Details
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
            <div className="p-5 flex flex-col items-center">
                {job && interviewers && (
                    <div className="w-full max-w-[1200px] flex flex-col items-center">
                        <div className="w-full flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-5 gap-4">
                            <div className="text-xl font-bold text-[#071C50]">
                                Job post Details
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    icon={<Sparkles size={16} />}
                                    onClick={fetchAIJobSummary}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white border-none font-bold"
                                >
                                    AI Job Summary
                                </Button>
                                <Button
                                    icon={<calendar size={16} />}
                                    onClick={() =>
                                        navigate(`/agency/job-calendar/${id}`)
                                    }
                                    className="bg-white hover:bg-gray-50 text-[#071C50] border-gray-200 font-bold"
                                >
                                    View Calendar
                                </Button>
                                {editHistory.length > 0 &&
                                editHistory[0].status === "pending" ? (
                                    <button
                                        className="px-4 py-2 bg-[#EF4444] text-white rounded-md hover:bg-[#DC2626] transition-colors font-bold text-sm"
                                        onClick={() =>
                                            setOpenEditRequests(true)
                                        }
                                    >
                                        New Edit Request
                                    </button>
                                ) : status === "pending" ? (
                                    <div className="px-4 py-2 bg-[#F59E0B] text-white rounded-md font-bold text-sm">
                                        Edit Request pending
                                    </div>
                                ) : status === "field_rejected" ? (
                                    <div
                                        className="px-4 py-2 bg-[#3B82F6] text-white rounded-md font-bold text-sm cursor-pointer flex items-center gap-2"
                                        onClick={() => setFieldOpen(true)}
                                    >
                                        Edit Request accepted partially{" "}
                                        <EyeOutlined />
                                    </div>
                                ) : null}

                                {job?.approval_status === "pending" &&
                                    status !== "pending" &&
                                    status !== "field_rejected" && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    handleJobPost("accept")
                                                }
                                                className="bg-[#10B981] hover:bg-[#059669] text-white border-none font-bold"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                className="bg-[#F59E0B] hover:bg-[#D97706] text-white border-none font-bold"
                                                onClick={() =>
                                                    navigate(
                                                        `/agency/edit_job/${id}`,
                                                    )
                                                }
                                            >
                                                Edit Job
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setRejectJob(true);
                                                }}
                                                className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-none font-bold"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                {job?.approval_status === "rejected" && (
                                    <div className="px-4 py-2 text-red-500 rounded-md font-bold text-sm flex items-center gap-2">
                                        Job post Rejected
                                        <InfoCircleOutlined
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setRejectModalOpen(true)
                                            }
                                        />
                                    </div>
                                )}
                                {job?.approval_status === "accepted" &&
                                    job?.status === "opened" && (
                                        <div className="flex flex-col items-end">
                                            {job.assigned_to &&
                                            job.assigned_to.length > 0 ? (
                                                <Button
                                                    onClick={
                                                        handleChangeRecruiter
                                                    }
                                                    disabled={
                                                        status === "pending"
                                                    }
                                                    className="font-bold"
                                                >
                                                    Change the Staff
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleAssign}
                                                    disabled={
                                                        status === "pending"
                                                    }
                                                    type="primary"
                                                    className="font-bold"
                                                >
                                                    Assign Job to Staff
                                                </Button>
                                            )}

                                            {status && status == "pending" && (
                                                <div className="text-[#EF4444] text-xs font-bold mt-1">
                                                    Your Edit request is
                                                    pending.....
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {job?.status == "closed" && (
                                    <div className="px-4 py-2 text-red-500 rounded-md font-bold text-sm">
                                        Job Closed
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full bg-white rounded-lg shadow-sm">
                            <ViewJobPost
                                id={id}
                                job={job}
                                editHistory={editHistory}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Modal
                title="Select Recruiters"
                open={isModalVisible}
                onOk={handleSubmitRecruiter}
                onCancel={() => setIsModalVisible(false)}
                okText="Submit"
                cancelText="Cancel"
            >
                <div className="flex flex-col gap-6 p-2">
                    {locations.map((item, index) => (
                        <div
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            key={item.id}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex gap-2 items-baseline">
                                    <span className="text-xs text-gray-500 uppercase font-bold">
                                        Location
                                    </span>
                                    <span className="text-sm font-semibold text-[#071C50]">
                                        {item.location}
                                    </span>
                                </div>
                                <div className="flex gap-2 items-baseline">
                                    <span className="text-xs text-gray-500 uppercase font-bold">
                                        Positions
                                    </span>
                                    <span className="text-sm font-semibold text-[#071C50]">
                                        {item.positions}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-[11px] text-gray-500 uppercase font-bold">
                                    Select Recruiters
                                </span>
                            </div>
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                                placeholder="Select recruiters"
                                onChange={(value) =>
                                    handleSelectRecruiters(item.id, value)
                                }
                                value={selectedRecruiters[item.id] || []}
                                options={recruiters.map((recruiter) => ({
                                    label: recruiter.username,
                                    value: recruiter.id,
                                }))}
                                getPopupContainer={(trigger) =>
                                    trigger.parentNode
                                }
                            />
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                title=""
                open={openEditRequests}
                onCancel={() => setOpenEditRequests(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setOpenEditRequests(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        onClick={() => handleEditRequest("reject")}
                    >
                        Reject
                    </Button>,
                    <Button
                        key="accept"
                        type="primary"
                        onClick={() => handleEditRequest("accept")}
                    >
                        Approve
                    </Button>,
                ]}
                width={1000}
            >
                <h3>Old Fields</h3>
                <div style={{ width: "100px" }}>
                    <Table
                        dataSource={editHistory[0]?.old_fields || []}
                        columns={[
                            {
                                title: "Field Name",
                                dataIndex: "field_name",
                                key: "field_name",
                            },
                            {
                                title: "Field Value",
                                dataIndex: "field_value",
                                key: "field_value",
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "status",
                                render: (text) => (
                                    <span
                                        style={{
                                            color:
                                                text === "accepted"
                                                    ? "green"
                                                    : text === "rejected"
                                                      ? "red"
                                                      : "gray",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {text}
                                    </span>
                                ),
                            },
                        ]}
                        rowKey="field_name"
                        pagination={false}
                    />
                </div>

                <h3 style={{ marginTop: 16 }}>New Fields</h3>
                <Table
                    dataSource={editHistory[0]?.new_fields || []}
                    columns={[
                        {
                            title: "Field Name",
                            dataIndex: "field_name",
                            key: "field_name",
                        },
                        {
                            title: "Requested Value",
                            dataIndex: "field_value",
                            key: "field_value",
                        },
                    ]}
                    rowKey="field_name"
                    pagination={false}
                />
            </Modal>

            <Modal
                title="Edit Request Details"
                open={fieldOpen}
                onCancel={() => setFieldOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setFieldOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        onClick={() => handleEditRequest("reject")}
                    >
                        Reject
                    </Button>,
                    <Button
                        key="accept"
                        type="primary"
                        onClick={() => handleEditRequest("accept")}
                    >
                        Approve
                    </Button>,
                ]}
                width={1000}
            >
                <Table
                    dataSource={
                        editHistory[0]?.new_fields?.filter(
                            (f) => f.status === "rejected",
                        ) || []
                    }
                    columns={[
                        {
                            title: "Field Name",
                            dataIndex: "field_name",
                            key: "field_name",
                        },
                        {
                            title: "Field Value",
                            dataIndex: "field_value",
                            key: "field_value",
                            width: 100,
                            render: (text) => (
                                <span
                                    style={{
                                        display: "inline-block",
                                        maxWidth: "600px",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(text),
                                    }}
                                />
                            ),
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            render: (text) => (
                                <span
                                    style={{
                                        color:
                                            text === "accepted"
                                                ? "green"
                                                : text === "rejected"
                                                  ? "red"
                                                  : "gray",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {text}
                                </span>
                            ),
                        },
                    ]}
                    rowKey="field_name"
                    pagination={false}
                />
            </Modal>
            <Modal
                title="Reject Reason"
                open={rejectJob}
                onCancel={() => {
                    setRejectJob(false);
                    setRejectReason("");
                }}
                footer={[
                    <Button key="cancel" onClick={() => setRejectJob(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={() => {
                            if (rejectReason.trim()) {
                                handleJobPost("reject");
                                setRejectJob(false);
                                setRejectReason("");
                            }
                        }}
                        disabled={!rejectReason.trim()}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <p>Please enter the reason for rejecting this job post:</p>
                <Input.TextArea
                    rows={4}
                    placeholder="Enter reason here..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                />
            </Modal>
            <Modal
                title="Rejection Reason"
                open={rejectModalOpen}
                onCancel={() => setRejectModalOpen(false)}
                footer={null}
            >
                <p>{job?.reason}</p>
            </Modal>

            <Modal
                title="Plan Limit Reached"
                open={canOpenModal}
                onCancel={() => {
                    setCanOpenModal(false);
                    setShowReasonBox(false);
                    setReason("");
                    setPlanLimitJob(null);
                    navigate("/agency/jobs");
                }}
                footer={null}
                destroyOnClose
                styles={{
                    mask: {
                        backdropFilter: "blur(15px)",
                    },
                }}
            >
                {!showReasonBox ? (
                    <>
                        <p>You have reached your current plan limit.</p>
                        <div style={{ textAlign: "right", marginTop: 16 }}>
                            <Button
                                style={{ marginRight: 8 }}
                                onClick={() => {
                                    setReason(planLimitJob?.reason || "");
                                    setShowReasonBox(true);
                                }}
                            >
                                Send Reason
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => navigate("/upgrade-plan")}
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-2">Reason (sent to client):</p>
                        <Input.TextArea
                            rows={4}
                            value={reason}
                            className="mb-4"
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div style={{ textAlign: "right" }}>
                            <Button
                                style={{ marginRight: 8 }}
                                onClick={() => setShowReasonBox(false)}
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

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-600" size={20} />
                        <span className="text-lg font-bold text-[#071C50]">
                            AI Powered Job Summary
                        </span>
                    </div>
                }
                open={isSummaryModalVisible}
                onCancel={() => setIsSummaryModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setIsSummaryModalVisible(false)}
                        className="font-semibold"
                    >
                        Close
                    </Button>,
                ]}
                width={800}
                centered
                styles={{
                    mask: {
                        backdropFilter: "blur(4px)",
                    },
                }}
            >
                <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
                    <AIInsightsDashboard
                        content={jobSummary}
                        loading={summaryLoading}
                    />
                </div>
            </Modal>
        </Main>
    );
};

export default CompleteJobPost;
