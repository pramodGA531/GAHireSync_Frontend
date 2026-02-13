import React, { useEffect, useState, useMemo } from "react";
// import "./JobPost.css";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import {
    EyeOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
    ArrowLeftOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    DollarCircleOutlined,
    GlobalOutlined,
    ProjectOutlined,
    TeamOutlined,
    PlusOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    HomeOutlined,
    FieldTimeOutlined,
    BankOutlined,
    MailOutlined,
    UserSwitchOutlined,
    NodeIndexOutlined,
    ThunderboltOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import {
    Menu,
    message,
    Spin,
    Tag,
    Button,
    Modal,
    Select,
    Input,
    Alert,
    Tooltip,
    Avatar,
    Drawer,
    Timeline,
    Typography,
    Space,
    Divider,
    Tabs,
} from "antd";
const { Text, Title, Paragraph } = Typography;
import Pageloading from "../../../common/loading/Pageloading";
import {
    LoadingOutlined,
    CheckOutlined,
    EditOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import AppTable from "../../../common/AppTable";
import CustomDatePicker from "../../../common/CustomDatePicker";
import { Papa } from "papaparse";
import GoBack from "../../../common/Goback";

const JobsDetails = ({ details, handleExportCSV }) => {
    if (!details) return null;

    return (
        <div className="bg-white p-5 rounded-lg border border-[#BADAFF] mb-5">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold text-[#071C50] m-0">Jobs</h5>
                <button
                    className="px-4 py-2 bg-[#1681FF] text-white rounded-md hover:bg-[#0056b3] transition-colors font-semibold"
                    onClick={handleExportCSV}
                >
                    Export CSV
                </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {Object.entries(details).map(([key, value], index, array) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-2.5 min-w-[120px] rounded-md bg-white border border-[#D1E5FF] shadow-sm ${
                            index === 0 ? "border-[#1681FF] bg-[#F0F7FF]" : ""
                        }`}
                    >
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                            {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-lg font-bold text-[#071C50]">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
const stripHtml = (html) => {
    return html?.replace(/<[^>]+>/g, "");
};

const CandidateStatusBoxes = ({ counts }) => {
    if (!counts) return null;
    const stages = [
        {
            label: "Profiles Sent",
            color: "#EAB308",
            border: "#FEF08A",
            bg: "#FEF9C3",
            value: counts.Applied,
        },
        {
            label: "Shortlisted",
            color: "#22C55E",
            border: "#BBF7D0",
            bg: "#F0FDF4",
            value: counts.Shortlisted,
        },
        {
            label: "Processing",
            color: "#A855F7",
            border: "#E9D5FF",
            bg: "#FAF5FF",
            value: counts.Processing,
        },
        {
            label: "on-Hold",
            color: "#84CC16",
            border: "#D9F99D",
            bg: "#F7FEE7",
            value: counts.onHold || counts["on-Hold"],
        },
        {
            label: "Rejected",
            color: "#EF4444",
            border: "#FECACA",
            bg: "#FEF2F2",
            value: counts.Rejected,
        },
        {
            label: "Selected",
            color: "#3B82F6",
            border: "#BFDBFE",
            bg: "#EFF6FF",
            value: counts.Selected,
        },
    ];

    return (
        <div className="flex gap-2">
            {stages.map((stage, idx) => (
                <Tooltip key={idx} title={stage.label}>
                    <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg border-2 shadow-sm cursor-help"
                        style={{
                            borderColor: stage.border,
                            backgroundColor: stage.bg,
                        }}
                    >
                        <span
                            className="text-sm font-bold"
                            style={{ color: stage.color }}
                        >
                            {String(stage.value || 0).padStart(2, "0")}
                        </span>
                    </div>
                </Tooltip>
            ))}
        </div>
    );
};

const CandidateStatusLegend = () => {
    const legendItems = [
        { label: "Profiles Sent", color: "#A16207", bg: "#FCD34D" },

        { label: "Shortlisted (R1)", color: "#15803D", bg: "#BBF7D0" },

        { label: "Processing (R2+)", color: "#7E22CE", bg: "#E9D5FF" },

        { label: "on-Hold", color: "#4D7C0F", bg: "#D9F99D" },

        { label: "Rejected", color: "#B91C1C", bg: "#FECACA" },

        { label: "Selected", color: "#1D4ED8", bg: "#BFDBFE" },
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider self-center">
                Candidate Status:
            </span>
            {legendItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                    <div
                        className="w-3 h-3 rounded-sm border border-gray-200"
                        style={{ backgroundColor: item.bg }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const JobPosts = ({ defaultTab = "all", hideTabs = false }) => {
    const [data, setData] = useState([]);
    const [orgJobs, setOrgJobs] = useState(null);
    const [current, setCurrent] = useState(defaultTab);
    const [locationFilter, setLocationFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [recruiterFilter, setRecruiterFilter] = useState("All");

    useEffect(() => {
        setCurrent(defaultTab);
    }, [defaultTab]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newDeadline, setNewDeadline] = useState(null);

    // Modal States
    const [showJDModal, setShowJDModal] = useState(false);
    const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);
    const [selectedJobData, setSelectedJobData] = useState(null);
    const [isJdExpanded, setIsJdExpanded] = useState(false);
    const [rejectingJob, setRejectingJob] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [canOpenModal, setCanOpenModal] = useState(false);
    const [showReasonBox, setShowReasonBox] = useState(false);
    const [reason, setReason] = useState("");
    const [planLimitJob, setPlanLimitJob] = useState(null);

    // Not Assigned Jobs States
    const [recruiters, setRecruiters] = useState([]);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);

    const { apiurl, token } = useAuth();

    const updateState = async () => {
        try {
            await fetch(`${apiurl}/update-notification-seen/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category: [
                        "create_job",
                        "accept_job_edit",
                        "reject_job_edit",
                        "partial_job_edit",
                    ],
                }),
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (token) {
            if (current === "edit_requests") {
                fetchEditRequests();
            } else if (current === "notapprovedjobs") {
                fetchNotApprovedJobs();
            } else if (current === "notassigendjobs") {
                fetchNotAssignedJobs();
            } else if (current === "rejected") {
                fetchRejectedJobs();
            } else {
                fetchJobPosts();
            }
            fetchRecruiters();
            updateState();
        }
    }, [token, current]);

    const postOnLinkedIn = async (job_id) => {
        try {
            setButtonLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job/post_on_linkedin/?job_id=${job_id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const res = await response.json();
            if (res.error) {
                message.error(res.error);
            } else {
                message.success(res.message);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleOpenModal = (jobId) => {
        setSelectedJob(jobId);
        setIsModalOpen(true);
    };

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/job-posts/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const resData = await response.json();
            setData(resData.data || []);
            setOrgJobs(resData.org_jobs || {});
        } catch (error) {
            console.error("Error fetching job posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await fetch(`${apiurl}/manager/jobs/export-csv/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "jobs.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error("Error exporting CSV:", e);
        }
    };

    const items = hideTabs
        ? [{ label: "Client Edit Requests", key: "edit_requests" }]
        : [
              { label: "All", key: "all" },
              { label: "New", key: "notapprovedjobs" },
              { label: "Assigned", key: "open" },
              { label: "Under-Negotiation", key: "edit_requests" },
              { label: "Assign JP's", key: "notassigendjobs" },
              { label: "Closed", key: "expired" },
              { label: "Rejected", key: "rejected" },
          ];

    const handleMenuClick = (e) => {
        setCurrent(e.key);
    };

    const fetchNotApprovedJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-approved/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const resData = await response.json();
            setData(resData.data || []);
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const fetchNotAssignedJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-assigned/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const resData = await response.json();
            setData(resData.data || []);
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const fetchRejectedJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/manager/jobs/rejected/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const resData = await response.json();
            setData(resData.data || []);
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const fetchRecruiters = async () => {
        try {
            const response = await fetch(
                `${apiurl}/agency/recruiters/?names=true`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const resData = await response.json();
            setRecruiters(resData);
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        }
    };

    const handleAcceptApproved = async (id) => {
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
                fetchNotApprovedJobs();
            }
        } catch (err) {
            message.error("Error approving job");
        }
    };

    const handleRejectApproved = async () => {
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
                fetchNotApprovedJobs();
            }
        } catch (err) {
            message.error("Error rejecting job");
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
                fetchNotApprovedJobs();
            }
        } catch (err) {
            message.error("An error occurred while sending the reason");
        }
    };

    const handleAssignRecruiters = (location_id) => {
        setSelectedLocationId(location_id);
        fetchRecruiters();
        setOpenAssignModal(true);
    };

    const assignRecruiters = async () => {
        try {
            await fetch(
                `${apiurl}/manager/job/assign-recruiter/by-location/${selectedLocationId}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recruiters: selectedRecruiters }),
                },
            );
            message.success("Job post assigned to recruiters");
            setSelectedLocationId(null);
            setSelectedRecruiters([]);
            setOpenAssignModal(false);
            fetchNotAssignedJobs();
        } catch (err) {
            message.error("Error assigning recruiters");
        }
    };

    const handleApprovedNavigation = (rowId, can_open) => {
        if (can_open) {
            navigate(`/agency/postings/${rowId}`);
        } else {
            const job = data.find((j) => j.id === rowId);
            setPlanLimitJob(job);
            setCanOpenModal(true);
        }
    };

    const fetchEditRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job-edit-requests/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const res = await response.json();
            setData(res.data || []);
        } catch (error) {
            console.error("Error fetching edit requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDeadline = async () => {
        if (!newDeadline) {
            message.warning("Please select a new deadline");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/manager/update-deadline/${selectedJob}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ new_deadline: newDeadline }),
                },
            );
            if (response.ok) {
                message.success("Deadline updated successfully");
                setIsModalOpen(false);
            }
        } catch (error) {
            message.error("Error updating deadline");
        }
    };

    const handleHold = async (job_id) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/job/hold/${job_id}/`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const res = await response.json();
            if (res.error) message.error(res.error);
            else {
                message.success(res.message);
                fetchJobPosts();
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleRemoveFromHold = async (job_id) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/job/remove-hold/${job_id}/`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const res = await response.json();
            if (res.error) message.error(res.error);
            else {
                message.success(res.message);
                fetchJobPosts();
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const filteredJobs = useMemo(() => {
        let result = data;
        if (current === "open") {
            result = result.filter((job) => job.status === "opened");
        } else if (current === "expired") {
            result = result.filter((job) => job.status === "closed");
        }

        if (locationFilter !== "All") {
            result = result.filter((job) => job.location === locationFilter);
        }

        if (statusFilter !== "All") {
            result = result.filter(
                (job) =>
                    job.status?.toLowerCase() === statusFilter.toLowerCase(),
            );
        }

        if (recruiterFilter !== "All") {
            result = result.filter((job) => {
                if (!job.assigned_to) return false;
                const assignedRecruiters = Array.from(
                    new Set(
                        Object.values(job.assigned_to)
                            .flat()
                            .map((r) => r[0]),
                    ),
                );
                return assignedRecruiters.includes(recruiterFilter);
            });
        }
        return result;
    }, [data, current, locationFilter, statusFilter, recruiterFilter]);

    const locationOptions = useMemo(() => {
        const locSet = new Set(
            data?.map((job) => job.location).filter(Boolean),
        );
        return [
            { label: "All Locations", value: "All" },
            ...Array.from(locSet)
                .sort()
                .map((loc) => ({ label: loc, value: loc })),
        ];
    }, [data]);

    const statusOptions = [
        { label: "All Status", value: "All" },
        { label: "Opened", value: "opened" },
        { label: "Closed", value: "closed" },
        { label: "Hold", value: "hold" },
    ];

    const recruiterOptions = useMemo(() => {
        return [
            { label: "All Recruiters", value: "All" },
            ...recruiters.map((r) => ({ label: r.name, value: r.name })),
        ];
    }, [recruiters]);

    const editRequestColumns = [
        { accessorKey: "job_id", header: "Job ID", width: 100 },
        { accessorKey: "edit_reason", header: "Reason", width: 250 },
        {
            accessorKey: "edit_status",
            header: "Status",
            width: 150,
            cell: ({ row }) => (
                <Tag
                    color={
                        row.original.edit_status === "pending"
                            ? "orange"
                            : "green"
                    }
                >
                    {row.original.edit_status}
                </Tag>
            ),
        },
        {
            accessorKey: "edited_at",
            header: "Requested At",
            width: 180,
            cell: ({ row }) =>
                row.original.edited_at
                    ? new Date(row.original.edited_at).toLocaleString()
                    : "-",
        },
        {
            header: "Action",
            accessorKey: "id",
            width: 150,
            cell: ({ row }) =>
                row.original.edit_status === "pending" ? (
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(
                                `/agency/job-edit-request/${row.original.id}`,
                            )
                        }
                    >
                        View Request
                    </Button>
                ) : (
                    <Tag
                        color={
                            row.original.edit_status === "accepted"
                                ? "green"
                                : "red"
                        }
                    >
                        {row.original.edit_status}
                    </Tag>
                ),
        },
    ];

    const customFilters = (
        <div className="flex gap-2.5">
            <Select
                value={locationFilter}
                onChange={setLocationFilter}
                options={locationOptions}
                style={{ width: 180 }}
            />
            <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                style={{ width: 150 }}
            />
            <Select
                value={recruiterFilter}
                onChange={setRecruiterFilter}
                options={recruiterOptions}
                placeholder="Filter by Recruiter"
                style={{ width: 180 }}
            />
        </div>
    );

    const columns = useMemo(() => {
        if (current === "edit_requests") return editRequestColumns;
        if (current === "notapprovedjobs") {
            return [
                {
                    accessorKey: "job_title",
                    header: "Job Title",
                    searchField: true,
                    width: 250,
                    cell: ({ row }) => (
                        <div className="flex items-center gap-2">
                            <div
                                onClick={() =>
                                    handleApprovedNavigation(
                                        row.original.id,
                                        row.original.can_open,
                                    )
                                }
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
                    width: 280,
                    cell: ({ row }) => {
                        const job = row.original;
                        return (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (job.can_open) {
                                            handleAcceptApproved(job.id);
                                        } else {
                                            setPlanLimitJob(job);
                                            setCanOpenModal(true);
                                        }
                                    }}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-600 border border-green-600 hover:bg-green-100 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => {
                                        if (job.can_open) {
                                            navigate(
                                                `/agency/edit_job/${job.id}`,
                                            );
                                        } else {
                                            setPlanLimitJob(job);
                                            setCanOpenModal(true);
                                        }
                                    }}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 border border-blue-600 hover:bg-blue-100 transition"
                                >
                                    Negotiate
                                </button>
                                <button
                                    onClick={() => setRejectingJob(job)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-600 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        );
                    },
                },
            ];
        }
        if (current === "rejected") {
            return [
                {
                    accessorKey: "job_title",
                    header: "Job Title",
                    searchField: true,
                    width: 250,
                    cell: ({ row }) => (
                        <div
                            onClick={() =>
                                navigate(`/agency/postings/${row.original.id}`)
                            }
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
                    accessorKey: "reason",
                    header: "Reason",
                    width: 300,
                    cell: ({ row }) => (
                        <div
                            className="text-red-500 italic truncate"
                            title={row.getValue("reason")}
                        >
                            {row.getValue("reason") || "No reason"}
                        </div>
                    ),
                },
            ];
        }
        if (current === "notassigendjobs") {
            return [
                {
                    accessorKey: "job_title",
                    header: "Job Title",
                    searchField: true,
                    width: 250,
                    cell: ({ row }) => (
                        <div
                            onClick={() =>
                                navigate(`/agency/postings/${row.original.id}`)
                            }
                            className="font-semibold cursor-pointer text-[#3B82F6] hover:underline"
                        >
                            {row.getValue("job_title")}
                        </div>
                    ),
                },
                { accessorKey: "location", header: "Location", width: 150 },
                {
                    header: "Assign",
                    width: 150,
                    cell: ({ row }) => (
                        <Button
                            type="primary"
                            className="bg-[#10B981] border-none"
                            onClick={() =>
                                handleAssignRecruiters(row.original.location_id)
                            }
                        >
                            Assign
                        </Button>
                    ),
                },
            ];
        }

        return [
            {
                accessorKey: "job_id",
                header: "Job ID",
                width: 100,
                cell: ({ row }) => (
                    <span className="font-mono text-gray-400 text-xs">
                        #{row.original.job_id}
                    </span>
                ),
            },
            {
                accessorKey: "job_title",
                header: "Job Role",
                searchField: true,
                width: 250,
                cell: ({ row }) => (
                    <div
                        onClick={() =>
                            navigate(`/agency/postings/${row.original.id}`)
                        }
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
                width: 180,
                cell: ({ row }) => (
                    <span>
                        {row.original.organization_name ||
                            row.original.client_name}
                    </span>
                ),
            },
            {
                accessorKey: "vacancies",
                header: "No. of Positions",
                width: 120,
                cell: ({ row }) => (
                    <span className="font-bold text-gray-700">
                        {row.original.vacancies || 0}
                    </span>
                ),
            },
            {
                header: "Job Status",
                accessorKey: "status",
                width: 120,
                cell: ({ row }) => {
                    const status = row.getValue("status");
                    const color =
                        status === "opened"
                            ? "green"
                            : status === "closed"
                              ? "red"
                              : status === "hold"
                                ? "orange"
                                : "default";
                    return (
                        <Tag color={color} className="rounded-full px-3">
                            {status?.toUpperCase()}
                        </Tag>
                    );
                },
            },
            {
                accessorKey: "created_at",
                header: "Tenure Date",
                width: 120,
                cell: ({ row }) =>
                    new Date(row.getValue("created_at")).toLocaleDateString(),
            },
            {
                header: "Recruitment Status",
                accessorKey: "recruitment_status",
                width: 160,
                cell: ({ row }) => {
                    const status = row.original.recruitment_status;
                    let color = "default";
                    if (status === "assigned") color = "blue";
                    else if (status === "New") color = "warning";
                    else if (status === "closed") color = "error";
                    else if (status === "rejected") color = "red";
                    else if (status === "under-negotiation") color = "purple";

                    return (
                        <Tag color={color} className="font-medium">
                            {status || "New"}
                        </Tag>
                    );
                },
            },
            {
                header: "Recruiter",
                width: 180,
                cell: ({ row }) => {
                    const assignedTo = row.original.assigned_to;
                    if (!assignedTo)
                        return (
                            <span className="text-gray-400 italic">
                                Unassigned
                            </span>
                        );

                    const recruiterData = Array.from(
                        new Map(
                            Object.values(assignedTo)
                                .flat()
                                .map((r) => [
                                    r[0],
                                    { name: r[0], avatar: r[2] },
                                ]),
                        ).values(),
                    );

                    if (recruiterData.length === 0)
                        return (
                            <span className="text-gray-400 italic">
                                Unassigned
                            </span>
                        );

                    return (
                        <Avatar.Group
                            maxCount={3}
                            maxStyle={{
                                color: "#f56a00",
                                backgroundColor: "#fde3cf",
                            }}
                        >
                            {recruiterData.map((rec, i) => (
                                <Tooltip title={rec.name} key={i}>
                                    <Avatar
                                        src={rec.avatar}
                                        style={{
                                            backgroundColor: !rec.avatar
                                                ? "#1677ff"
                                                : "transparent",
                                        }}
                                    >
                                        {!rec.avatar &&
                                            rec.name
                                                ?.substring(0, 2)
                                                .toUpperCase()}
                                    </Avatar>
                                </Tooltip>
                            ))}
                        </Avatar.Group>
                    );
                },
            },
            {
                header: "Candidate Status",
                width: 260,
                cell: ({ row }) => (
                    <CandidateStatusBoxes
                        counts={row.original.candidate_counts}
                    />
                ),
            },
            {
                header: "Summary",
                width: 120,
                cell: ({ row }) => (
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        className="rounded-md border-blue-200 hover:bg-blue-50"
                        onClick={() => {
                            setSelectedJobData(row.original);
                            setShowSummaryDrawer(true);
                            setIsJdExpanded(false);
                        }}
                    >
                        Summary
                    </Button>
                ),
            },
        ];
    }, [current, data, navigate, selectedJobData]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-5">
                    {!loading && orgJobs && (
                        <JobsDetails
                            details={orgJobs}
                            handleExportCSV={handleExportCSV}
                        />
                    )}
                    <Menu
                        onClick={handleMenuClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                        style={{ marginBottom: "20px" }}
                    />
                    <CandidateStatusLegend />
                    <AppTable
                        columns={columns}
                        data={filteredJobs}
                        customFilters={customFilters}
                    />
                </div>
            )}

            <Modal
                title="Update Deadline"
                open={isModalOpen}
                onOk={handleUpdateDeadline}
                onCancel={() => setIsModalOpen(false)}
                okText="Update"
            >
                <CustomDatePicker
                    onChange={setNewDeadline}
                    startDate={new Date()}
                    formatString="yyyy-MM-dd"
                    size="md"
                />
            </Modal>

            <Modal
                title="Reject Job"
                open={!!rejectingJob}
                onOk={handleRejectApproved}
                onCancel={() => {
                    setRejectingJob(null);
                    setFeedback("");
                }}
                okText="Submit"
                okButtonProps={{ disabled: !feedback.trim() }}
            >
                <p>Reason for rejection:</p>
                <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback..."
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
                        <div style={{ textAlign: "right", marginTop: 16 }}>
                            <Button
                                style={{ marginRight: 8 }}
                                onClick={() => {
                                    setReason(planLimitJob?.reason || "");
                                    setShowReasonBox(true);
                                }}
                            >
                                View Reason
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
                title="Assign job"
                open={openAssignModal}
                onOk={assignRecruiters}
                onCancel={() => {
                    setOpenAssignModal(false);
                    setSelectedRecruiters([]);
                }}
                okText="Submit"
                okButtonProps={{ disabled: selectedRecruiters?.length === 0 }}
            >
                <p>Select recruiters:</p>
                <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select recruiters"
                    value={selectedRecruiters}
                    onChange={setSelectedRecruiters}
                >
                    {recruiters.map((r) => (
                        <Select.Option key={r.id} value={r.id}>
                            {r.name}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>

            <Modal
                title={`JD - ${selectedJobData?.job_title}`}
                open={showJDModal}
                onCancel={() => setShowJDModal(false)}
                footer={[
                    <Button key="close" onClick={() => setShowJDModal(false)}>
                        Close
                    </Button>,
                    <Button
                        key="summary"
                        type="primary"
                        onClick={() => {
                            setShowJDModal(false);
                            setShowSummaryDrawer(true);
                            setIsJdExpanded(false);
                        }}
                    >
                        Summary
                    </Button>,
                ]}
                width={800}
            >
                <div className="whitespace-pre-wrap p-4 bg-gray-50 rounded-lg max-h-[60vh] overflow-y-auto">
                    {selectedJobData?.job_description || "No JD"}
                </div>
            </Modal>

            <Drawer
                title={
                    <div className="flex justify-between bg-white items-center w-full pr-8">
                        <div className="flex gap-3 items-center">
                            <span className="text-gray-400 font-mono text-lg">
                                #{selectedJobData?.job_id}
                            </span>
                        </div>
                        <button className="cursor-pointer hover:shadow-xl">
                            <svg
                                width="173"
                                height="32"
                                viewBox="0 0 173 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    x="0.5"
                                    y="0.5"
                                    width="172"
                                    height="31"
                                    rx="7.5"
                                    fill="white"
                                />
                                <rect
                                    x="0.5"
                                    y="0.5"
                                    width="172"
                                    height="31"
                                    rx="7.5"
                                    stroke="url(#paint0_linear_2779_3613)"
                                />
                                <path
                                    d="M16.6719 13.4929C16.6188 13.0223 16.4001 12.6577 16.0156 12.3991C15.6312 12.1373 15.1473 12.0064 14.5639 12.0064C14.1463 12.0064 13.785 12.0727 13.4801 12.2053C13.1752 12.3345 12.9382 12.5135 12.7692 12.7422C12.6035 12.9676 12.5206 13.2244 12.5206 13.5128C12.5206 13.7547 12.5769 13.9635 12.6896 14.1392C12.8056 14.3149 12.9564 14.4624 13.142 14.5817C13.331 14.6977 13.5331 14.7955 13.7486 14.875C13.964 14.9512 14.1712 15.0142 14.37 15.0639L15.3643 15.3224C15.6892 15.402 16.0223 15.5097 16.3636 15.6456C16.705 15.7815 17.0215 15.9605 17.3132 16.1825C17.6049 16.4046 17.8402 16.6797 18.0192 17.0078C18.2015 17.3359 18.2926 17.7287 18.2926 18.1861C18.2926 18.7628 18.1435 19.2749 17.8452 19.7223C17.5502 20.1697 17.121 20.5227 16.5575 20.7812C15.9974 21.0398 15.3196 21.169 14.5241 21.169C13.7618 21.169 13.1023 21.0481 12.5455 20.8061C11.9886 20.5642 11.5528 20.2211 11.2379 19.777C10.9231 19.3295 10.7491 18.7992 10.7159 18.1861H12.2571C12.2869 18.554 12.4063 18.8606 12.6151 19.1058C12.8272 19.3478 13.0973 19.5284 13.4254 19.6477C13.7569 19.7637 14.1198 19.8217 14.5142 19.8217C14.9484 19.8217 15.3345 19.7538 15.6726 19.6179C16.014 19.4787 16.2824 19.2865 16.478 19.0412C16.6735 18.7926 16.7713 18.5026 16.7713 18.1712C16.7713 17.8696 16.6851 17.6226 16.5128 17.4304C16.3438 17.2382 16.1134 17.0791 15.8217 16.9531C15.5334 16.8272 15.2069 16.7161 14.8423 16.62L13.6392 16.2919C12.8239 16.0698 12.1776 15.7434 11.7003 15.3125C11.2263 14.8816 10.9893 14.3116 10.9893 13.6023C10.9893 13.0156 11.1484 12.5036 11.4666 12.0661C11.7848 11.6286 12.2157 11.2888 12.7592 11.0469C13.3028 10.8016 13.916 10.679 14.5987 10.679C15.2881 10.679 15.8963 10.8 16.4233 11.0419C16.9536 11.2839 17.3712 11.617 17.6761 12.0412C17.9811 12.4621 18.1402 12.946 18.1534 13.4929H16.6719ZM24.8464 17.8331V13.3636H26.3379V21H24.8762V19.6776H24.7967C24.621 20.0852 24.3393 20.425 23.9515 20.6967C23.5671 20.9652 23.0881 21.0994 22.5147 21.0994C22.0242 21.0994 21.59 20.9917 21.2122 20.7763C20.8377 20.5575 20.5427 20.2344 20.3272 19.8068C20.1151 19.3793 20.0091 18.8506 20.0091 18.2209V13.3636H21.4956V18.0419C21.4956 18.5623 21.6397 18.9766 21.9281 19.2848C22.2164 19.593 22.591 19.7472 23.0517 19.7472C23.3301 19.7472 23.6068 19.6776 23.8819 19.5384C24.1603 19.3991 24.3907 19.1887 24.573 18.907C24.7586 18.6252 24.8497 18.2673 24.8464 17.8331ZM28.3352 21V13.3636H29.7621V14.6065H29.8565C30.0156 14.1856 30.2758 13.8575 30.6371 13.6222C30.9983 13.3835 31.4309 13.2642 31.9347 13.2642C32.4451 13.2642 32.8726 13.3835 33.2173 13.6222C33.5653 13.8608 33.8222 14.1889 33.9879 14.6065H34.0675C34.2498 14.1989 34.5398 13.8741 34.9375 13.6321C35.3352 13.3868 35.8092 13.2642 36.3594 13.2642C37.0521 13.2642 37.6172 13.4813 38.0547 13.9155C38.4955 14.3497 38.7159 15.0043 38.7159 15.8793V21H37.2294V16.0185C37.2294 15.5014 37.0885 15.1269 36.8068 14.8949C36.5251 14.6629 36.1887 14.5469 35.7976 14.5469C35.3137 14.5469 34.9375 14.696 34.669 14.9943C34.4006 15.2893 34.2663 15.6688 34.2663 16.1328V21H32.7848V15.924C32.7848 15.5097 32.6555 15.1766 32.397 14.9247C32.1385 14.6728 31.8021 14.5469 31.3878 14.5469C31.1061 14.5469 30.8459 14.6214 30.6072 14.7706C30.3719 14.9164 30.1813 15.1203 30.0355 15.3821C29.893 15.6439 29.8217 15.9472 29.8217 16.2919V21H28.3352ZM40.7083 21V13.3636H42.1351V14.6065H42.2296C42.3887 14.1856 42.6489 13.8575 43.0101 13.6222C43.3714 13.3835 43.8039 13.2642 44.3077 13.2642C44.8181 13.2642 45.2457 13.3835 45.5904 13.6222C45.9384 13.8608 46.1953 14.1889 46.361 14.6065H46.4405C46.6228 14.1989 46.9128 13.8741 47.3105 13.6321C47.7083 13.3868 48.1822 13.2642 48.7324 13.2642C49.4251 13.2642 49.9902 13.4813 50.4277 13.9155C50.8685 14.3497 51.089 15.0043 51.089 15.8793V21H49.6025V16.0185C49.6025 15.5014 49.4616 15.1269 49.1799 14.8949C48.8981 14.6629 48.5617 14.5469 48.1706 14.5469C47.6867 14.5469 47.3105 14.696 47.0421 14.9943C46.7736 15.2893 46.6394 15.6688 46.6394 16.1328V21H45.1578V15.924C45.1578 15.5097 45.0286 15.1766 44.7701 14.9247C44.5115 14.6728 44.1751 14.5469 43.7608 14.5469C43.4791 14.5469 43.2189 14.6214 42.9803 14.7706C42.745 14.9164 42.5544 15.1203 42.4086 15.3821C42.266 15.6439 42.1948 15.9472 42.1948 16.2919V21H40.7083ZM55.3036 21.169C54.8197 21.169 54.3822 21.0795 53.9911 20.9006C53.6 20.7183 53.2901 20.4548 53.0614 20.1101C52.8361 19.7654 52.7234 19.3428 52.7234 18.8423C52.7234 18.4115 52.8062 18.0568 52.9719 17.7784C53.1377 17.5 53.3614 17.2796 53.6431 17.1172C53.9248 16.9548 54.2397 16.8321 54.5877 16.7493C54.9357 16.6664 55.2904 16.6035 55.6516 16.5604C56.109 16.5073 56.4802 16.4643 56.7653 16.4311C57.0503 16.3946 57.2575 16.3366 57.3867 16.2571C57.516 16.1776 57.5806 16.0483 57.5806 15.8693V15.8345C57.5806 15.4003 57.458 15.0639 57.2127 14.8253C56.9708 14.5866 56.6095 14.4673 56.1289 14.4673C55.6284 14.4673 55.234 14.5784 54.9457 14.8004C54.6606 15.0192 54.4634 15.2628 54.354 15.5312L52.957 15.2131C53.1228 14.7491 53.3647 14.3745 53.6829 14.0895C54.0044 13.8011 54.3739 13.5923 54.7915 13.4631C55.2092 13.3305 55.6483 13.2642 56.109 13.2642C56.4139 13.2642 56.7371 13.3007 57.0785 13.3736C57.4232 13.4432 57.7447 13.5724 58.043 13.7614C58.3446 13.9503 58.5915 14.2204 58.7837 14.5717C58.976 14.9197 59.0721 15.3722 59.0721 15.929V21H57.6204V19.956H57.5607C57.4646 20.1482 57.3204 20.3371 57.1282 20.5227C56.936 20.7083 56.689 20.8625 56.3874 20.9851C56.0858 21.1077 55.7246 21.169 55.3036 21.169ZM55.6268 19.9759C56.0378 19.9759 56.3891 19.8946 56.6808 19.7322C56.9757 19.5698 57.1995 19.3577 57.3519 19.0959C57.5077 18.8307 57.5856 18.5473 57.5856 18.2457V17.2614C57.5326 17.3144 57.4298 17.3641 57.2773 17.4105C57.1282 17.4536 56.9575 17.4917 56.7653 17.5249C56.573 17.5547 56.3858 17.5829 56.2035 17.6094C56.0212 17.6326 55.8687 17.6525 55.7461 17.669C55.4577 17.7055 55.1942 17.7668 54.9556 17.853C54.7203 17.9392 54.5314 18.0634 54.3888 18.2259C54.2496 18.3849 54.18 18.5971 54.18 18.8622C54.18 19.2301 54.3159 19.5085 54.5877 19.6974C54.8595 19.883 55.2058 19.9759 55.6268 19.9759ZM61.052 21V13.3636H62.4888V14.5767H62.5684C62.7076 14.1657 62.9528 13.8426 63.3042 13.6072C63.6588 13.3686 64.0598 13.2493 64.5073 13.2493C64.6001 13.2493 64.7095 13.2526 64.8354 13.2592C64.9647 13.2659 65.0658 13.2741 65.1387 13.2841V14.706C65.079 14.6894 64.973 14.6712 64.8205 14.6513C64.668 14.6281 64.5156 14.6165 64.3631 14.6165C64.0118 14.6165 63.6986 14.6911 63.4235 14.8402C63.1517 14.986 62.9363 15.1899 62.7772 15.4517C62.6181 15.7102 62.5385 16.0052 62.5385 16.3366V21H61.052ZM66.4251 21V13.3636H67.9116V21H66.4251ZM67.1758 12.1854C66.9173 12.1854 66.6952 12.0992 66.5096 11.9268C66.3273 11.7512 66.2362 11.5424 66.2362 11.3004C66.2362 11.0552 66.3273 10.8464 66.5096 10.674C66.6952 10.4983 66.9173 10.4105 67.1758 10.4105C67.4343 10.4105 67.6547 10.4983 67.837 10.674C68.0226 10.8464 68.1154 11.0552 68.1154 11.3004C68.1154 11.5424 68.0226 11.7512 67.837 11.9268C67.6547 12.0992 67.4343 12.1854 67.1758 12.1854ZM69.7523 21V19.9808L73.8887 14.7259V14.6562H69.8865V13.3636H75.7431V14.4474L71.7658 19.6378V19.7074H75.8823V21H69.7523ZM80.7085 21.1541C79.9561 21.1541 79.3081 20.9934 78.7646 20.6719C78.2243 20.3471 77.8067 19.8913 77.5117 19.3047C77.2201 18.7147 77.0742 18.0237 77.0742 17.2315C77.0742 16.4493 77.2201 15.7599 77.5117 15.1634C77.8067 14.5668 78.2177 14.1011 78.7447 13.7663C79.275 13.4316 79.8948 13.2642 80.604 13.2642C81.0349 13.2642 81.4525 13.3355 81.8569 13.478C82.2612 13.6205 82.6242 13.8442 82.9457 14.1491C83.2672 14.4541 83.5207 14.8501 83.7063 15.3374C83.8919 15.8213 83.9847 16.4096 83.9847 17.1023V17.6293H77.9144V16.5156H82.5281C82.5281 16.1245 82.4485 15.7782 82.2894 15.4766C82.1303 15.1716 81.9066 14.9313 81.6183 14.7557C81.3332 14.58 80.9985 14.4922 80.614 14.4922C80.1964 14.4922 79.8318 14.5949 79.5202 14.8004C79.212 15.0026 78.9734 15.2678 78.8043 15.5959C78.6386 15.9207 78.5558 16.2737 78.5558 16.6548V17.5249C78.5558 18.0353 78.6452 18.4695 78.8242 18.8274C79.0065 19.1854 79.2601 19.4588 79.5849 19.6477C79.9097 19.8333 80.2892 19.9261 80.7234 19.9261C81.0051 19.9261 81.262 19.8864 81.494 19.8068C81.726 19.724 81.9265 19.6013 82.0955 19.4389C82.2646 19.2765 82.3938 19.076 82.4833 18.8374L83.8903 19.0909C83.7776 19.5052 83.5754 19.8681 83.2837 20.1797C82.9954 20.4879 82.6325 20.7282 82.195 20.9006C81.7608 21.0696 81.2653 21.1541 80.7085 21.1541ZM90.9947 21L88.7475 13.3636H90.2837L91.7802 18.9716H91.8548L93.3562 13.3636H94.8924L96.3839 18.9467H96.4585L97.945 13.3636H99.4812L97.239 21H95.7227L94.1715 15.4865H94.0572L92.506 21H90.9947ZM100.892 21V13.3636H102.378V21H100.892ZM101.643 12.1854C101.384 12.1854 101.162 12.0992 100.976 11.9268C100.794 11.7512 100.703 11.5424 100.703 11.3004C100.703 11.0552 100.794 10.8464 100.976 10.674C101.162 10.4983 101.384 10.4105 101.643 10.4105C101.901 10.4105 102.122 10.4983 102.304 10.674C102.489 10.8464 102.582 11.0552 102.582 11.3004C102.582 11.5424 102.489 11.7512 102.304 11.9268C102.122 12.0992 101.901 12.1854 101.643 12.1854ZM107.943 13.3636V14.5568H103.772V13.3636H107.943ZM104.89 11.5341H106.377V18.7578C106.377 19.0462 106.42 19.2633 106.506 19.4091C106.592 19.5516 106.703 19.6494 106.839 19.7024C106.978 19.7521 107.129 19.777 107.292 19.777C107.411 19.777 107.515 19.7687 107.605 19.7521C107.694 19.7356 107.764 19.7223 107.814 19.7124L108.082 20.9403C107.996 20.9735 107.873 21.0066 107.714 21.0398C107.555 21.0762 107.356 21.0961 107.118 21.0994C106.726 21.1061 106.362 21.0365 106.024 20.8906C105.686 20.7448 105.412 20.5194 105.203 20.2145C104.995 19.9096 104.89 19.5268 104.89 19.0661V11.5341ZM111.238 16.4659V21H109.751V10.8182H111.218V14.6065H111.312C111.491 14.1955 111.765 13.8691 112.133 13.6271C112.501 13.3852 112.981 13.2642 113.574 13.2642C114.098 13.2642 114.555 13.3719 114.947 13.5874C115.341 13.8028 115.646 14.1243 115.861 14.5518C116.08 14.9761 116.189 15.5064 116.189 16.1428V21H114.703V16.3217C114.703 15.7616 114.559 15.3274 114.27 15.0192C113.982 14.7076 113.581 14.5518 113.067 14.5518C112.716 14.5518 112.401 14.6264 112.123 14.7756C111.848 14.9247 111.631 15.1435 111.471 15.4318C111.316 15.7169 111.238 16.0616 111.238 16.4659ZM122.858 21H121.227L124.891 10.8182H126.666L130.33 21H128.699L125.821 12.6676H125.741L122.858 21ZM123.131 17.0128H128.421V18.3054H123.131V17.0128ZM131.749 21V13.3636H133.236V21H131.749ZM132.5 12.1854C132.241 12.1854 132.019 12.0992 131.834 11.9268C131.652 11.7512 131.56 11.5424 131.56 11.3004C131.56 11.0552 131.652 10.8464 131.834 10.674C132.019 10.4983 132.241 10.4105 132.5 10.4105C132.759 10.4105 132.979 10.4983 133.161 10.674C133.347 10.8464 133.44 11.0552 133.44 11.3004C133.44 11.5424 133.347 11.7512 133.161 11.9268C132.979 12.0992 132.759 12.1854 132.5 12.1854Z"
                                    fill="#447DCB"
                                />
                                <path
                                    d="M161 21C161 15.477 156.523 11 151 11C145.477 11 141 15.477 141 21M157 21C157 19.4087 156.368 17.8826 155.243 16.7574C154.117 15.6321 152.591 15 151 15C149.409 15 147.883 15.6321 146.757 16.7574C145.632 17.8826 145 19.4087 145 21M153 21C153 20.4696 152.789 19.9609 152.414 19.5858C152.039 19.2107 151.53 19 151 19C150.47 19 149.961 19.2107 149.586 19.5858C149.211 19.9609 149 20.4696 149 21"
                                    stroke="url(#paint1_linear_2779_3613)"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2779_3613"
                                        x1="162.074"
                                        y1="-7.44626e-06"
                                        x2="33.968"
                                        y2="83.8785"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#CB7344" />
                                        <stop
                                            offset="0.379282"
                                            stop-color="#ED3E7B"
                                        />
                                        <stop
                                            offset="0.738723"
                                            stop-color="#2970D0"
                                        />
                                        <stop offset="1" stop-color="#CEBE2F" />
                                    </linearGradient>
                                    <linearGradient
                                        id="paint1_linear_2779_3613"
                                        x1="161"
                                        y1="16"
                                        x2="141"
                                        y2="16"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#56A8FD" />
                                        <stop
                                            offset="0.25"
                                            stop-color="#A16AFE"
                                        />
                                        <stop
                                            offset="0.5"
                                            stop-color="#D142F5"
                                        />
                                        <stop
                                            offset="0.75"
                                            stop-color="#F46EBE"
                                        />
                                        <stop offset="1" stop-color="#F9B2BC" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </button>
                    </div>
                }
                placement="right"
                width={1000}
                onClose={() => setShowSummaryDrawer(false)}
                open={showSummaryDrawer}
                closeIcon={
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 3V9M16 16L20 12M20 12L16 8M20 12H9C8.20435 12 7.44129 12.3161 6.87868 12.8787C6.31607 13.4413 6 14.2044 6 15V21"
                            stroke="#747F91"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                }
                styles={{
                    header: {
                        background: "white",
                        // overflow: "hidden",
                        // borderBottom: "1px solid #f0f0f0",
                    },
                    body: {
                        padding: 0,
                        overflow: "hidden",
                        background: "#fcfcfc",
                    },
                }}
            >
                <div className="flex gap-8 h-full overflow-hidden p-6">
                    {/* Main Content - Left */}
                    <div className="flex-1 overflow-y-auto pr-4 no-scrollbar">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Title
                                        level={4}
                                        style={{ marginBottom: 8 }}
                                    >
                                        {selectedJobData?.job_title}
                                    </Title>
                                </div>
                                {selectedJobData?.approval_status ===
                                    "pending" && (
                                    <div className="flex gap-2 mb-2">
                                        <button
                                            onClick={() => {
                                                if (selectedJobData.can_open) {
                                                    handleAcceptApproved(
                                                        selectedJobData.id,
                                                    );
                                                } else {
                                                    setPlanLimitJob(
                                                        selectedJobData,
                                                    );
                                                    setCanOpenModal(true);
                                                }
                                            }}
                                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (selectedJobData.can_open) {
                                                    navigate(
                                                        `/agency/edit_job/${selectedJobData.id}`,
                                                    );
                                                } else {
                                                    setPlanLimitJob(
                                                        selectedJobData,
                                                    );
                                                    setCanOpenModal(true);
                                                }
                                            }}
                                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition shadow-sm"
                                        >
                                            Negotiate
                                        </button>
                                        <button
                                            onClick={() =>
                                                setRejectingJob(selectedJobData)
                                            }
                                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition shadow-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 mb-4 text-gray-800 font-semibold">
                                <span className="flex items-center gap-2">
                                    {" "}
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="32"
                                            height="32"
                                            rx="6"
                                            fill="#1681FF"
                                            fill-opacity="0.05"
                                        />
                                        <rect width="32" height="32" rx="6" />
                                        <path
                                            opacity="0.2"
                                            d="M23.0295 10.2712L20.6495 23.7912C20.62 23.9584 20.5254 24.1071 20.3863 24.2045C20.2472 24.3018 20.0751 24.3399 19.9079 24.3104L9.48791 22.4704C9.14007 22.4091 8.90771 22.0775 8.96871 21.7296L11.3487 8.20962C11.3782 8.04241 11.4729 7.89376 11.6119 7.79638C11.751 7.69901 11.9231 7.66089 12.0903 7.69042L22.5103 9.53042C22.8581 9.59178 23.0905 9.92332 23.0295 10.2712Z"
                                            fill="#1681FF"
                                        />
                                        <path
                                            d="M22.6201 8.90011L12.2001 7.06011C11.504 6.93762 10.8404 7.40247 10.7177 8.09851L8.33769 21.6185C8.2789 21.953 8.35546 22.2972 8.55052 22.5752C8.74558 22.8532 9.04314 23.0424 9.37769 23.1009L19.7977 24.9409C20.1323 24.9999 20.4767 24.9235 20.7549 24.7284C21.0331 24.5333 21.2223 24.2356 21.2809 23.9009L23.6609 10.3809C23.7823 9.68461 23.3164 9.02169 22.6201 8.90011ZM20.0185 23.6801L9.59769 21.8401L11.9777 8.32011L22.3977 10.1601L20.0185 23.6801ZM12.9049 10.4337C12.9666 10.0858 13.2986 9.85379 13.6465 9.91531L20.2865 11.0873C20.6136 11.1446 20.8426 11.4427 20.8136 11.7735C20.7847 12.1044 20.5074 12.3581 20.1753 12.3577C20.1377 12.3577 20.1003 12.3544 20.0633 12.3481L13.4233 11.1753C13.0754 11.1136 12.8434 10.7816 12.9049 10.4337ZM12.4617 12.9553C12.4911 12.7881 12.5858 12.6395 12.7249 12.5421C12.864 12.4447 13.0361 12.4066 13.2033 12.4361L19.8433 13.6089C20.1729 13.664 20.4046 13.9634 20.3752 14.2963C20.3459 14.6292 20.0654 14.8835 19.7313 14.8801C19.6934 14.8802 19.6557 14.8767 19.6185 14.8697L12.9785 13.6977C12.6309 13.6352 12.3996 13.303 12.4617 12.9553ZM12.0177 15.4761C12.0806 15.1292 12.4122 14.8985 12.7593 14.9601L16.0777 15.5433C16.4047 15.6006 16.6336 15.8984 16.6048 16.2291C16.5761 16.5598 16.2993 16.8137 15.9673 16.8137C15.9297 16.8137 15.8923 16.8105 15.8553 16.8041L12.5353 16.2177C12.1877 16.1556 11.9561 15.8238 12.0177 15.4761Z"
                                            fill="#1681FF"
                                        />
                                    </svg>
                                    Job Description
                                </span>
                                <Button
                                    type="link"
                                    size="small"
                                    className="p-0 text-gray-500 hover:text-gray-700 font-medium"
                                    onClick={() =>
                                        setIsJdExpanded(!isJdExpanded)
                                    }
                                >
                                    {isJdExpanded ? "Show less" : "Show more"}
                                </Button>
                            </div>
                            <Paragraph
                                ellipsis={{
                                    rows: isJdExpanded ? 1000 : 3,
                                    expandable: false,
                                }}
                                className="text-gray-600 text-[14px] leading-relaxed mb-1"
                            >
                                {stripHtml(selectedJobData?.job_description)}
                            </Paragraph>

                            <div className="flex flex-wrap gap-2 mt-6">
                                <Tag
                                    icon={<EnvironmentOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.location}
                                </Tag>
                                <Tag
                                    icon={<DollarCircleOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.ctc}
                                </Tag>
                                <Tag
                                    icon={<ClockCircleOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.years_of_experience} exp.
                                </Tag>
                                <Tag
                                    icon={<ProjectOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.job_level}
                                </Tag>
                                <Tag
                                    icon={<TeamOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.vacancies} Positions
                                </Tag>
                                <Tag
                                    icon={<HomeOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.job_type}
                                </Tag>
                                <Tag
                                    icon={<FieldTimeOutlined />}
                                    className="!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl"
                                >
                                    {selectedJobData?.rotational_shift
                                        ? "Rotational"
                                        : "Non-Rotational"}
                                </Tag>
                            </div>

                            {isJdExpanded && (
                                <>
                                    <div className="bg-white rounded-2xl p-6 mb-6 -ml-4">
                                        <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold">
                                            <span className="flex items-center gap-2 -ml-2">
                                                <svg
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 32 32"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <rect
                                                        width="32"
                                                        height="32"
                                                        rx="6"
                                                        fill="#FDF1F5"
                                                    />
                                                    <rect
                                                        width="32"
                                                        height="32"
                                                        rx="6"
                                                    />
                                                    <path
                                                        d="M10.2891 11.7101C11.0734 11.7101 11.7091 11.0744 11.7091 10.2901C11.7091 9.50587 11.0734 8.87012 10.2891 8.87012C9.5049 8.87012 8.86914 9.50587 8.86914 10.2901C8.86914 11.0744 9.5049 11.7101 10.2891 11.7101Z"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                    <path
                                                        d="M10.2891 17.4201C11.0734 17.4201 11.7091 16.7843 11.7091 16.0001C11.7091 15.2158 11.0734 14.5801 10.2891 14.5801C9.5049 14.5801 8.86914 15.2158 8.86914 16.0001C8.86914 16.7843 9.5049 17.4201 10.2891 17.4201Z"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                    <path
                                                        d="M10.2891 23.13C11.0734 23.13 11.7091 22.4943 11.7091 21.71C11.7091 20.9258 11.0734 20.29 10.2891 20.29C9.5049 20.29 8.86914 20.9258 8.86914 21.71C8.86914 22.4943 9.5049 23.13 10.2891 23.13Z"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                    <path
                                                        d="M14.5996 10.29L23.1196 10.29"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                    <path
                                                        d="M14.5996 16L23.1196 16"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                    <path
                                                        d="M14.5996 21.71L23.1196 21.71"
                                                        stroke="#E8618C"
                                                        stroke-width="1.704"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="square"
                                                    />
                                                </svg>
                                                Skill Set
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <Text className="text-gray-400 font-bold text-[10px] tracking-wider block mb-4">
                                                    PRIMARY SKILLS
                                                </Text>
                                                <div className="space-y-4">
                                                    {selectedJobData?.primary_skills?.map(
                                                        (s, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex justify-between items-center group"
                                                            >
                                                                <Text className="text-gray-700 font-medium">
                                                                    {
                                                                        s.skill_name
                                                                    }
                                                                </Text>
                                                                <Text className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors">
                                                                    {
                                                                        s.metric_value
                                                                    }{" "}
                                                                    <Text className="text-[10px] text-gray-400 font-normal uppercase ml-1">
                                                                        {
                                                                            s.metric_type
                                                                        }
                                                                    </Text>
                                                                </Text>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Text className="text-gray-400 font-bold text-[10px] tracking-wider block mb-4">
                                                    SECONDARY SKILL
                                                </Text>
                                                <div className="space-y-4">
                                                    {selectedJobData?.secondary_skills?.map(
                                                        (s, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex justify-between items-center group"
                                                            >
                                                                <Text className="text-gray-700 font-medium">
                                                                    {
                                                                        s.skill_name
                                                                    }
                                                                </Text>
                                                                <Text className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors">
                                                                    {
                                                                        s.metric_value
                                                                    }{" "}
                                                                    <Text className="text-[10px] text-gray-400 font-normal uppercase ml-1">
                                                                        {
                                                                            s.metric_type
                                                                        }
                                                                    </Text>
                                                                </Text>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 -ml-4">
                                        <div className="flex items-center gap-2 mb-6 text-gray-800 font-semibold">
                                            {/* <PlusOutlined /> */}
                                            <span className="flex items-center gap-2 -ml-2 ">
                                                <svg
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 32 32"
                                                    fill="none"
                                                    className="border-none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <rect
                                                        width="32"
                                                        height="32"
                                                        rx="6"
                                                        fill="#EFFCFA"
                                                    />
                                                    <rect
                                                        width="32"
                                                        height="32"
                                                        rx="6"
                                                    />
                                                    <path
                                                        d="M23.6803 16.0002C23.6803 16.3537 23.3938 16.6402 23.0403 16.6402L8.96031 16.6402C8.60685 16.6402 8.32031 16.3537 8.32031 16.0002C8.32031 15.6468 8.60685 15.3602 8.96031 15.3602L23.0403 15.3602C23.3938 15.3603 23.6803 15.6468 23.6803 16.0002ZM8.96031 11.5202L23.0403 11.5202C23.3938 11.5202 23.6803 11.2337 23.6803 10.8802C23.6803 10.5268 23.3938 10.2402 23.0403 10.2402L8.96031 10.2402C8.60685 10.2402 8.32031 10.5268 8.32031 10.8802C8.32031 11.2337 8.60685 11.5202 8.96031 11.5202ZM23.0403 20.4802L8.96031 20.4802C8.60685 20.4802 8.32031 20.7668 8.32031 21.1202C8.32031 21.4737 8.60685 21.7602 8.96031 21.7602L23.0403 21.7602C23.3938 21.7602 23.6803 21.4737 23.6803 21.1202C23.6803 20.7668 23.3938 20.4802 23.0403 20.4802Z"
                                                        fill="#22CCB2"
                                                    />
                                                </svg>
                                                Additional Details
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                            <div className="flex flex-col gap-1">
                                                <Text className="text-gray-400 font-medium text-xs">
                                                    Education
                                                </Text>
                                                <div className="flex gap-2 mt-1">
                                                    {(typeof selectedJobData?.qualifications ===
                                                    "string"
                                                        ? selectedJobData.qualifications.split(
                                                              ",",
                                                          )
                                                        : [
                                                              selectedJobData?.qualifications ||
                                                                  "Any",
                                                          ]
                                                    ).map((q, i) => (
                                                        <Tag
                                                            key={i}
                                                            className="m-0 !px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]"
                                                        >
                                                            <SafetyCertificateOutlined className="mr-1" />{" "}
                                                            {q.trim()}
                                                        </Tag>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Text className="text-gray-400 font-medium text-xs">
                                                    Languages specific
                                                </Text>
                                                <div className="flex gap-2 mt-1">
                                                    {(typeof selectedJobData?.languages ===
                                                    "string"
                                                        ? selectedJobData.languages.split(
                                                              ",",
                                                          )
                                                        : ["N/A"]
                                                    ).map((l, i) => (
                                                        <Tag
                                                            key={i}
                                                            className="m-0!px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]"
                                                        >
                                                            {l.trim()}
                                                        </Tag>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Text className="text-gray-400 font-medium text-xs">
                                                    Passport and visa
                                                </Text>
                                                <div className="flex gap-2 mt-1">
                                                    <Tag className="m-0 !px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]">
                                                        <GlobalOutlined className="mr-1" />{" "}
                                                        {selectedJobData?.passport_availability ||
                                                            "Not Required"}
                                                    </Tag>
                                                    <Tag className="m-0 !px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]">
                                                        {selectedJobData?.visa_status ||
                                                            "N/A"}
                                                    </Tag>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Text className="text-gray-400 font-medium text-xs">
                                                    Decision Maker
                                                </Text>
                                                <div className="flex flex-col gap-2 mt-1">
                                                    <Tag className="m-0 !px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]">
                                                        <UserOutlined className="mr-1" />{" "}
                                                        {
                                                            selectedJobData?.decision_maker
                                                        }
                                                    </Tag>
                                                    <Tag className="m-0 !px-3 !py-1 !bg-blue-50 !text-black !rounded-xl text-[11px]">
                                                        <MailOutlined className="mr-1" />{" "}
                                                        {
                                                            selectedJobData?.decision_maker_email
                                                        }
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mt-6 pt-6 border-t border-gray-50">
                                            <div>
                                                <Text className="text-gray-700 font-bold text-xs">
                                                    Rotational Shifts:{" "}
                                                    <span
                                                        className={`ml-2 font-medium ${selectedJobData?.rotational_shift ? "text-green-600" : "text-gray-500"}`}
                                                    >
                                                        {selectedJobData?.rotational_shift
                                                            ? "Yes"
                                                            : "No"}
                                                    </span>
                                                </Text>
                                            </div>
                                            <div>
                                                <Text className="text-gray-700 font-bold text-xs">
                                                    Bond:{" "}
                                                    <span className="ml-2 font-medium text-gray-500">
                                                        {selectedJobData?.bond ||
                                                            "No-Bond"}
                                                    </span>
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6  ">
                                        <div className="flex gap-3 items-center mb-6 text-gray-800 font-semibold">
                                            <ProjectOutlined />
                                            <span>Other Benefits</span>
                                        </div>
                                        <Paragraph className="text-gray-600 text-[13px] leading-relaxed">
                                            {selectedJobData?.other_benefits ||
                                                "No additional benefits listed."}
                                        </Paragraph>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex gap-3 items-center mb-6 text-gray-800 font-semibold">
                                <TeamOutlined />
                                <span>Profiles</span>
                            </div>
                            <Tabs
                                defaultActiveKey="1"
                                className="profiles-tabs"
                                items={[
                                    {
                                        key: "1",
                                        label: `Sent(${selectedJobData?.candidate_counts?.Applied || 0})`,
                                        children: (
                                            <Timeline
                                                className="mt-6 ml-2"
                                                items={(
                                                    selectedJobData?.candidate_activities || [
                                                        {
                                                            message:
                                                                "Recruiter shared profile",
                                                            time: "2 days ago",
                                                            user: "Recruiter",
                                                        },
                                                    ]
                                                ).map((log, i) => ({
                                                    dot: (
                                                        <svg
                                                            width="60"
                                                            height="60"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <rect
                                                                x="0.25"
                                                                y="0.25"
                                                                width="19.5"
                                                                height="19.5"
                                                                rx="6.75"
                                                                fill="#D5D5D5"
                                                            />
                                                            <rect
                                                                x="0.25"
                                                                y="0.25"
                                                                width="19.5"
                                                                height="19.5"
                                                                rx="6.75"
                                                                stroke="#C6C6C6"
                                                                stroke-width="0.5"
                                                            />
                                                            <g clip-path="url(#clip0_2780_15557)">
                                                                <path
                                                                    d="M14.5937 6.65759C14.7942 6.7716 14.9607 6.93699 15.0761 7.13671C15.1914 7.33643 15.2514 7.56329 15.25 7.79392V12.0429C15.25 12.5148 14.9916 12.95 14.5745 13.1793L10.637 15.6701C10.4418 15.7773 10.2227 15.8335 10 15.8335C9.7773 15.8335 9.55821 15.7773 9.363 15.6701L5.4255 13.1793C5.22143 13.0677 5.05107 12.9034 4.93224 12.7035C4.81341 12.5036 4.75047 12.2755 4.75 12.0429V7.79334C4.75 7.32142 5.00842 6.88684 5.4255 6.65759L9.363 4.33592C9.56398 4.22511 9.78975 4.16699 10.0192 4.16699C10.2488 4.16699 10.4745 4.22511 10.6755 4.33592L14.613 6.65759H14.5937Z"
                                                                    stroke="white"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                                <path
                                                                    d="M12.0417 8.49625C12.2237 8.60125 12.3351 8.79667 12.3333 9.00725V10.9188C12.3333 11.1312 12.2184 11.3272 12.0329 11.4304L10.2829 12.5516C10.1963 12.5996 10.099 12.6248 10 12.6248C9.90101 12.6248 9.80365 12.5996 9.71708 12.5516L7.96708 11.4304C7.87592 11.3799 7.79997 11.3058 7.74713 11.2159C7.6943 11.1261 7.66651 11.0237 7.66667 10.9194V9.00725C7.66667 8.79492 7.78158 8.59892 7.9665 8.49567L9.7165 7.4515C9.89792 7.35 10.119 7.35 10.2998 7.4515L12.0498 8.49567H12.0417V8.49625Z"
                                                                    stroke="white"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_2780_15557">
                                                                    <rect
                                                                        width="14"
                                                                        height="14"
                                                                        fill="white"
                                                                        transform="translate(3 3)"
                                                                    />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    ),
                                                    children: (
                                                        <div
                                                            key={i}
                                                            className="flex justify-between items-center -mt-1.5 pb-4"
                                                        >
                                                            <Text className="text-[13px] mt-1 text-gray-700 font-medium">
                                                                {log.message}
                                                            </Text>
                                                            <Text className="text-[11px] mt-1 text-gray-400">
                                                                {log.time}
                                                            </Text>
                                                        </div>
                                                    ),
                                                }))}
                                            />
                                        ),
                                    },
                                    { key: "2", label: "Shortlisted" },
                                    { key: "3", label: "Processing" },
                                    { key: "4", label: "on-Hold" },
                                    { key: "5", label: "Rejected" },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Sidebar - Right */}
                    <div className="w-80 overflow-y-auto no-scrollbar">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <Tag className="!bg-blue-100 !text-blue-500 rounded-lg px-2 m-0 text-xs font-semibold">
                                    Client name
                                </Tag>
                                <Text className="text-gray-900 font-bold uppercase text-[10px]">
                                    {selectedJobData?.organization_name}
                                </Text>
                            </div>
                            <Divider className="my-4" />
                            <Title level={5} className="mb-4">
                                Details
                            </Title>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Start Date
                                    </Text>
                                    <Text className="text-gray-700 font-bold text-xs">
                                        {new Date(
                                            selectedJobData?.created_at,
                                        ).toLocaleDateString()}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Deadline
                                    </Text>
                                    <Text className="text-gray-700 font-bold text-xs">
                                        {selectedJobData?.deadline}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Job status
                                    </Text>
                                    <Tag
                                        color="green"
                                        className="m-0 border-none rounded-full px-3 text-[10px] flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        {selectedJobData?.status?.toUpperCase()}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Recruiting Status
                                    </Text>
                                    <Tag
                                        color="orange"
                                        className="m-0 border-none rounded-full px-3 text-[10px] flex items-center gap-1"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        {selectedJobData?.recruitment_status?.toUpperCase()}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Interview Panel
                                    </Text>
                                    <Avatar.Group maxCount={3} size="small">
                                        {(
                                            selectedJobData?.interview_panel ||
                                            []
                                        ).map((panel, idx) => (
                                            <Tooltip
                                                title={`${panel.name} (${panel.type})`}
                                                key={idx}
                                            >
                                                <Avatar
                                                    src={panel.avatar}
                                                    className="border-2 border-white"
                                                >
                                                    {panel.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>
                                            </Tooltip>
                                        ))}
                                    </Avatar.Group>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-400 text-xs">
                                        Allocated Recruiters
                                    </Text>
                                    <Avatar.Group maxCount={3} size="small">
                                        {selectedJobData?.assigned_to &&
                                            Object.values(
                                                selectedJobData.assigned_to,
                                            )
                                                .flat()
                                                .map((r, i) => (
                                                    <Tooltip
                                                        title={r[0]}
                                                        key={i}
                                                    >
                                                        <Avatar
                                                            src={r[2]}
                                                            className="border-2 border-white"
                                                        >
                                                            {r[0]
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </Avatar>
                                                    </Tooltip>
                                                ))}
                                    </Avatar.Group>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                                <ClockCircleOutlined />
                                <span>Job logs</span>
                            </div>
                            <Timeline
                                className="custom-timeline"
                                items={(
                                    selectedJobData?.job_logs || [
                                        {
                                            message: "Job Created",
                                            created_at:
                                                selectedJobData?.created_at,
                                        },
                                    ]
                                ).map((log, i) => ({
                                    dot: (
                                        <svg
                                            width="50"
                                            height="50"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <rect
                                                x="0.25"
                                                y="0.25"
                                                width="19.5"
                                                height="19.5"
                                                rx="6.75"
                                                fill="#D5D5D5"
                                            />
                                            <rect
                                                x="0.25"
                                                y="0.25"
                                                width="19.5"
                                                height="19.5"
                                                rx="6.75"
                                                stroke="#C6C6C6"
                                                stroke-width="0.5"
                                            />
                                            <path
                                                d="M5.99935 8.00016H9.99935M4.66602 5.3335H7.33268M5.99935 5.3335V12.6668C5.99935 12.8436 6.06959 13.0132 6.19461 13.1382C6.31964 13.2633 6.4892 13.3335 6.66602 13.3335H9.99935M9.99935 7.3335C9.99935 7.15668 10.0696 6.98712 10.1946 6.86209C10.3196 6.73707 10.4892 6.66683 10.666 6.66683H14.666C14.8428 6.66683 15.0124 6.73707 15.1374 6.86209C15.2624 6.98712 15.3327 7.15668 15.3327 7.3335V8.66683C15.3327 8.84364 15.2624 9.01321 15.1374 9.13823C15.0124 9.26326 14.8428 9.3335 14.666 9.3335H10.666C10.4892 9.3335 10.3196 9.26326 10.1946 9.13823C10.0696 9.01321 9.99935 8.84364 9.99935 8.66683V7.3335ZM9.99935 12.6668C9.99935 12.49 10.0696 12.3204 10.1946 12.1954C10.3196 12.0704 10.4892 12.0002 10.666 12.0002H14.666C14.8428 12.0002 15.0124 12.0704 15.1374 12.1954C15.2624 12.3204 15.3327 12.49 15.3327 12.6668V14.0002C15.3327 14.177 15.2624 14.3465 15.1374 14.4716C15.0124 14.5966 14.8428 14.6668 14.666 14.6668H10.666C10.4892 14.6668 10.3196 14.5966 10.1946 14.4716C10.0696 14.3465 9.99935 14.177 9.99935 14.0002V12.6668Z"
                                                stroke="white"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    ),
                                    children: (
                                        <div
                                            key={i}
                                            className="flex flex-col -mt-1 pb-4"
                                        >
                                            <Text className="text-[12px] text-gray-700 !mt-1 font-medium leading-tight">
                                                {log.message}
                                            </Text>
                                            <Text className="text-[10px] text-gray-400 mt-1">
                                                {new Date(
                                                    log.created_at,
                                                ).toLocaleString()}
                                            </Text>
                                        </div>
                                    ),
                                }))}
                            />
                        </div>
                    </div>
                </div>
            </Drawer>
        </Main>
    );
};

export default JobPosts;
