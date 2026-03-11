import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/useAuth";
import Main from "./Layout";
import {
    Clock,
    AlertCircle,
    Briefcase,
    Calendar,
    ChevronDown,
    MapPin,
    CheckCircle,
    XCircle,
    UserCircle,
    Files,
    BarChart2,
    CheckSquare,
    Activity,
    Users,
    MessageCircle,
    X,
    Plus,
    UserPlus,
    FileText,
    FileSignature,
    CreditCard,
} from "lucide-react";
import { Select, DatePicker, Modal, notification } from "antd";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as ReTooltip,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    BarChart,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
const { RangePicker } = DatePicker;
// RECRUITER TAB DATA (From original state)

// const legendItems = [
//     { label: "Profiles Sent", color: "#A16207", bg: "#FCD34D" },
//     { label: "Shortlisted (R1)", color: "#15803D", bg: "#BBF7D0" },
//     { label: "Processing (R2+)", color: "#7E22CE", bg: "#E9D5FF" },
//     { label: "on-Hold", color: "#4D7C0F", bg: "#D9F99D" },
//     { label: "Rejected", color: "#B91C1C", bg: "#FECACA" },
//     { label: "Selected", color: "#1D4ED8", bg: "#BFDBFE" },
//     { label: "Replaced", color: "#C2410C", bg: "#FED7AA" },
//     { label: "Joined", color: "#0F766E", bg: "#99F6E4" },
// ];
const legendItems = [
    { label: "Profiles Sent", color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Shortlisted (R1)", color: "#22C55E", bg: "#F0FDF4" },
    { label: "Processing (R2+)", color: "#A855F7", bg: "#FAF5FF" },
    { label: "on-Hold", color: "#84CC16", bg: "#F7FEE7" },
    { label: "Rejected", color: "#EF4444", bg: "#FEF2F2" },
    { label: "Selected", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Replaced", color: "#F97316", bg: "#FFF7ED" },
    { label: "Joined", color: "#14B8A6", bg: "#F0FDFA" },
];
// Reusable 3-Column List Component
const ListCol = ({ title, data, onViewAll, onItemClick }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1e293b]">{title}</h3>
            <button
                onClick={onViewAll}
                className="text-blue-500 text-sm font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
                View all
            </button>
        </div>
        <div className="flex flex-col gap-0 divide-y divide-gray-50">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg px-1 -mx-1"
                    onClick={() => onItemClick && onItemClick(item)}
                >
                    <div className="min-w-0 flex-1 pr-4">
                        <div className="text-sm font-bold text-gray-800 truncate">
                            {item.title}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">
                            {item.subtitle}
                        </div>
                    </div>
                    <div className="text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200 shrink-0">
                        {item.time}
                    </div>
                </div>
            ))}
            {data.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-sm">
                    No new requests
                </div>
            )}
        </div>
    </div>
);

export default function Manager() {
    const [tab, setTab] = useState("Client");
    const [invoiceTab, setInvoiceTab] = useState("Today's invoices");
    const { token, apiurl, userData, updateUserData } = useAuth();
    const navigate = useNavigate();
    const [targetsChecked, setTargetsChecked] = useState(false);

    useEffect(() => {
        const syncUserDetails = async () => {
            try {
                const response = await axios.get(`${apiurl}/user-details/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.data) {
                    updateUserData(response.data.data);
                }
            } catch (error) {
                console.error("Error syncing user details:", error);
            }
        };

        if (token && userData?.role === "manager") {
            syncUserDetails();
        }
    }, [token, apiurl]);

    const [clientStats, setClientStats] = useState({
        total_clients: 0,
        active_clients: 0,
        inactive_clients: 0,
    });
    const [negotiationStats, setNegotiationStats] = useState({
        pending_negotiations: 0,
    });
    const [jobNegotiationStats, setJobNegotiationStats] = useState({
        pending_job_negotiations: 0,
    });
    const [newJobRequestsList, setNewJobRequestsList] = useState([]);
    const [replacementRequestsList, setReplacementRequestsList] = useState([]);
    const [newClientRequestsList, setNewClientRequestsList] = useState([]);
    const [tcNegotiationList, setTcNegotiationList] = useState([]);
    const [jpNegotiationsList, setJpNegotiationsList] = useState([]);
    const [latestJobStacksList, setLatestJobStacksList] = useState([]);
    const [revenueRange, setRevenueRange] = useState("30days");
    const [revenueStats, setRevenueStats] = useState({
        total_revenue: 0,
        pending_amount: 0,
        pending_count: 0,
        overdue_amount: 0,
        overdue_count: 0,
        avg_deal_size: 0,
    });
    const [recruiterJobStats, setRecruiterJobStats] = useState({
        near_to_deadline: 0,
        overdue: 0,
        active_jobs: 0,
        jobs_closed: 0,
        new_job_requests: 0,
        positions_to_fill: 0,
        applications_received: 0,
    });
    const [pendingNegotiations, setPendingNegotiations] = useState(0);
    const [invoiceSummary, setInvoiceSummary] = useState({
        today_invoices: [],
        overdue_invoices: [],
    });
    const [interviewData, setInterviewData] = useState([]);
    const [interviewFilterClients, setInterviewFilterClients] = useState([]);
    const [interviewFilterRecruiters, setInterviewFilterRecruiters] = useState(
        [],
    );
    const [selectedInterviewClient, setSelectedInterviewClient] =
        useState("all");
    const [selectedInterviewRecruiter, setSelectedInterviewRecruiter] =
        useState("all");
    const [selectedInterviewDate, setSelectedInterviewDate] = useState("");
    const [selectedInterviewModalData, setSelectedInterviewModalData] =
        useState(null);
    const [recentNotifications, setRecentNotifications] = useState([]);
    const [jobStackStats, setJobStackStats] = useState([]);
    const [jobStackFilters, setJobStackFilters] = useState({
        clients: [],
        jobs: [],
    });
    const [selectedStackClient, setSelectedStackClient] = useState("all");
    const [selectedStackJob, setSelectedStackJob] = useState("all");
    const [stackDateRange, setStackDateRange] = useState([]);
    const [recruiterSummaryStats, setRecruiterSummaryStats] = useState([]);
    const [selectedRecruiterSummary, setSelectedRecruiterSummary] =
        useState("all");
    const [recruiterSummaryDateRange, setRecruiterSummaryDateRange] = useState(
        [],
    );

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    useEffect(() => {
        const fetchClientStats = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/client-stats/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                if (response.data) {
                    setClientStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching client stats:", error);
            }
        };

        const fetchNegotiationStats = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/negotiation-stats/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) setNegotiationStats(response.data);
            } catch (error) {
                console.error("Error fetching negotiation stats:", error);
            }
        };

        const fetchJobNegotiationStats = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/job-negotiation-stats/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) setJobNegotiationStats(response.data);
            } catch (error) {
                console.error("Error fetching job negotiation stats:", error);
            }
        };

        const fetchNewJobRequests = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/jobs/not-approved/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data && response.data.data) {
                    const formatted = response.data.data.map((job) => ({
                        title: job.job_title,
                        subtitle: job.client_name,
                        time: formatTimeAgo(job.created_at),
                    }));
                    setNewJobRequestsList(formatted);
                }
            } catch (error) {
                console.error("Error fetching new job requests:", error);
            }
        };

        const fetchReplacementRequests = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/replacement-requests/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) {
                    const formattedReplacements = response.data.map((req) => ({
                        title: req.candidate_name,
                        subtitle: `${req.role} @ ${req.organization_name}`,
                        time: formatTimeAgo(req.created_at),
                    }));
                    setReplacementRequestsList(formattedReplacements);
                }
            } catch (error) {
                console.error("Error fetching replacement requests:", error);
            }
        };

        const fetchNewClientRequests = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/clients-data/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data && response.data.connection_requests) {
                    const formatted = response.data.connection_requests.map(
                        (req) => ({
                            title: req.client_name,
                            subtitle: req.company_name,
                            time: formatTimeAgo(req.created_at),
                        }),
                    );
                    setNewClientRequestsList(formatted);
                }
            } catch (error) {
                console.error("Error fetching client requests:", error);
            }
        };

        const fetchJpNegotiations = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/job-edit-requests/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data && response.data.data) {
                    const formatted = response.data.data.map((req) => ({
                        title: req.job_title,
                        subtitle: req.client_name,
                        time: formatTimeAgo(req.edited_at),
                    }));
                    setJpNegotiationsList(formatted);
                }
            } catch (error) {
                console.error("Error fetching JP negotiations:", error);
            }
        };

        const fetchTcNegotiations = async () => {
            try {
                const response = await axios.get(`${apiurl}/negotiate-terms/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data) {
                    const formatted = response.data.map((req) => ({
                        title:
                            req.client_organization?.client?.username ||
                            "Unknown",
                        subtitle:
                            req.client_organization?.client
                                ?.name_of_organization || "Unknown",
                        time: formatTimeAgo(req.requested_date),
                    }));
                    setTcNegotiationList(formatted);
                }
            } catch (error) {
                console.error("Error fetching T&C negotiations:", error);
            }
        };

        const fetchRevenueStats = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/revenue-stats/?range=${revenueRange}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) {
                    setRevenueStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching revenue stats:", error);
            }
        };

        const fetchRecruiterJobStats = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/recruiter-job-stats/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) {
                    setRecruiterJobStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching recruiter job stats:", error);
            }
        };

        const fetchLatestJobStacks = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/job-posts/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data && response.data.data) {
                    const formatted = response.data.data.map((job) => {
                        let stColor = "text-blue-500 bg-blue-50";
                        if (job.status === "closed")
                            stColor = "text-red-500 bg-red-50";
                        if (job.status === "on-hold")
                            stColor = "text-orange-500 bg-orange-50";

                        let rcColor = "text-yellow-500 bg-yellow-50";
                        if (job.recruitment_status === "closed")
                            rcColor = "text-green-500 bg-green-50";
                        if (job.recruitment_status === "replacement")
                            rcColor = "text-blue-600 bg-blue-100";
                        if (job.recruitment_status === "rejected")
                            rcColor = "text-red-500 bg-red-50";

                        return {
                            id: job.job_id,
                            role: job.job_title,
                            client: job.client_name,
                            pos: String(job.vacancies).padStart(2, "0"),
                            status: job.status,
                            date: job.deadline,
                            recStatus: job.recruitment_status,
                            stColor: stColor,
                            rcColor: rcColor,
                            candidate_counts: job.candidate_counts,
                        };
                    });
                    setLatestJobStacksList(formatted);
                }
            } catch (error) {
                console.error("Error fetching latest job stacks:", error);
            }
        };

        const fetchInterviewScheduling = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/interview-scheduling/`,
                    {
                        params: {
                            client_id: selectedInterviewClient,
                            rec_id: selectedInterviewRecruiter,
                            date: selectedInterviewDate,
                        },
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) {
                    setInterviewData(response.data.interviews);
                    setInterviewFilterClients(response.data.clients);
                    setInterviewFilterRecruiters(response.data.recruiters);
                }
            } catch (error) {
                console.error("Error fetching interview scheduling:", error);
            }
        };

        const fetchRecentNotifications = async () => {
            try {
                const response = await axios.get(`${apiurl}/notifications/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.data) {
                    setRecentNotifications(response.data.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        const fetchStackFilterData = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/filter-data/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) setJobStackFilters(response.data);
            } catch (error) {
                console.error("Error fetching filter data:", error);
            }
        };

        const fetchJobStackStats = async () => {
            try {
                const params = {
                    client_id: selectedStackClient,
                    job_id: selectedStackJob,
                };
                if (stackDateRange && stackDateRange.length === 2) {
                    params.start_date = stackDateRange[0].format("YYYY-MM-DD");
                    params.end_date = stackDateRange[1].format("YYYY-MM-DD");
                }
                const response = await axios.get(
                    `${apiurl}/manager/job-stack-stats/`,
                    {
                        params,
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) setJobStackStats(response.data);
            } catch (error) {
                console.error("Error fetching job stack stats:", error);
            }
        };

        const fetchInvoiceSummary = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/manager/invoice-summary/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) {
                    setInvoiceSummary(response.data);
                }
            } catch (error) {
                console.error("Error fetching invoice summary:", error);
            }
        };

        const fetchRecruiterSummaryStats = async () => {
            try {
                const params = {
                    recruiter_id: selectedRecruiterSummary,
                };
                if (
                    recruiterSummaryDateRange &&
                    recruiterSummaryDateRange.length === 2
                ) {
                    params.start_date =
                        recruiterSummaryDateRange[0].format("YYYY-MM-DD");
                    params.end_date =
                        recruiterSummaryDateRange[1].format("YYYY-MM-DD");
                }
                const response = await axios.get(
                    `${apiurl}/manager/recruiter-summary-stats/`,
                    {
                        params,
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (response.data) setRecruiterSummaryStats(response.data);
            } catch (error) {
                console.error("Error fetching recruiter summary stats:", error);
            }
        };

        if (token) {
            fetchClientStats();
            fetchNegotiationStats();
            fetchJobNegotiationStats();
            fetchNewJobRequests();
            fetchReplacementRequests();
            fetchNewClientRequests();
            fetchTcNegotiations();
            fetchJpNegotiations();
            fetchRevenueStats();
            fetchRecruiterJobStats();
            fetchLatestJobStacks();
            fetchInterviewScheduling();
            fetchRecentNotifications();
            fetchInvoiceSummary();
            fetchStackFilterData();
            fetchJobStackStats();
            fetchRecruiterSummaryStats();
        }
    }, [
        token,
        apiurl,
        tab,
        revenueRange,
        selectedInterviewClient,
        selectedInterviewRecruiter,
        selectedInterviewDate,
        selectedStackClient,
        selectedStackJob,
        stackDateRange,
        selectedRecruiterSummary,
        recruiterSummaryDateRange,
    ]);
    console.log(userData);

    useEffect(() => {
        if (
            userData?.role === "manager" &&
            !targetsChecked &&
            userData.hasOwnProperty("target_in_amount") &&
            userData.hasOwnProperty("target_in_positions")
        ) {
            const hasAmountTarget =
                userData.target_in_amount &&
                parseFloat(userData.target_in_amount) > 0;
            const hasPositionTarget =
                userData.target_in_positions &&
                parseInt(userData.target_in_positions) > 0;

            if (!hasAmountTarget || !hasPositionTarget) {
                let message = "";
                if (!hasAmountTarget && !hasPositionTarget) {
                    message =
                        "Please fill in your Target in Amount (₹) and Target in Positions.";
                } else if (!hasAmountTarget) {
                    message = "Please fill in your Target in Amount (₹).";
                } else {
                    message = "Please fill in your Target in Positions.";
                }

                notification.warning({
                    message: "Targets Not Set",
                    description: message,
                    placement: "topRight",
                    duration: 10,
                });
            }
            setTargetsChecked(true);
        }
    }, [userData, targetsChecked]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Main defaultSelectedKey="1">
            <div className="p-6 bg-white min-h-screen font-sans text-gray-800">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        Welcome back, {userData?.username || "Manager"} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Let's explore ways to scale up together and achieve even
                        greater success.
                    </p>
                </div>

                {/* Toggle Group */}
                <div className="flex bg-gray-100/80 p-1 w-max rounded-full mb-8 border border-gray-200 shadow-sm">
                    <button
                        onClick={() => setTab("Client")}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === "Client" ? "bg-[#3B82F6] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Client
                    </button>
                    <button
                        onClick={() => setTab("Recruiters")}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tab === "Recruiters" ? "bg-[#3B82F6] text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Recruiters
                    </button>
                </div>

                {tab === "Client" && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#1e293b]">
                                Over View
                            </h2>
                            <Select
                                value={revenueRange}
                                onChange={(value) => setRevenueRange(value)}
                                className="w-40 mr-12 h-12"
                                size="large"
                                variant="borderless"
                                options={[
                                    { value: "30days", label: "Last 30 Days" },
                                    {
                                        value: "3months",
                                        label: "Last 3 Months",
                                    },
                                    {
                                        value: "6months",
                                        label: "Last 6 Months",
                                    },
                                    {
                                        value: "9months",
                                        label: "Last 9 Months",
                                    },
                                    {
                                        value: "12months",
                                        label: "Last 12 Months",
                                    },
                                ]}
                            />
                        </div>

                        {/* TOP STATS SECTION */}
                        <div className="flex flex-col lg:flex-row gap-5 mb-6">
                            {/* Left Col - 4 Stacked Cards */}
                            <div className="w-[300px] flex flex-col gap-4">
                                <div className="bg-white border rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-800 mb-2">
                                            <div className="p-1 rounded bg-orange-50">
                                                <UserPlus
                                                    size={14}
                                                    className="text-orange-500"
                                                />
                                            </div>
                                            Clients
                                        </div>
                                        <div className="text-[28px] font-black text-gray-800">
                                            {clientStats.total_clients}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end text-xs font-bold gap-3 pr-2">
                                        <div className="flex gap-4">
                                            <span className="text-gray-900">
                                                {clientStats.active_clients}
                                            </span>{" "}
                                            <span className="text-green-500 ml-3">
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-gray-900">
                                                {clientStats.inactive_clients}
                                            </span>{" "}
                                            <span className="text-red-500">
                                                Inactive
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col h-24 justify-center">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-800 mb-2">
                                        <div className="p-1 rounded bg-gray-50">
                                            <FileText
                                                size={14}
                                                className="text-gray-600"
                                            />
                                        </div>
                                        T&C Negotiations requests
                                    </div>
                                    <div className="text-[28px] font-black text-gray-800">
                                        {negotiationStats.pending_negotiations}
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col h-24 justify-center">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-800 mb-2">
                                        <div className="p-1 rounded bg-rose-50">
                                            <FileSignature
                                                size={14}
                                                className="text-rose-500"
                                            />
                                        </div>
                                        New Job Post Negotiations
                                    </div>
                                    <div className="text-[28px] font-black text-gray-800">
                                        {
                                            jobNegotiationStats.pending_job_negotiations
                                        }
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col h-24 justify-center">
                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-800 mb-2">
                                        <div className="p-1 rounded bg-rose-50">
                                            <CreditCard
                                                size={14}
                                                className="text-rose-500"
                                            />
                                        </div>
                                        New Payments recived
                                    </div>
                                    <div className="text-[28px] font-black text-gray-800">
                                        10+
                                    </div>
                                </div>
                            </div>

                            {/* Middle Col - Big Graph */}
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 relative min-h-[350px]">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-[16px] font-bold text-gray-800">
                                            Revenue Performance
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Placement fees vs. Monthly Goal
                                        </p>
                                    </div>
                                    <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 flex items-center gap-2 bg-white">
                                        {revenueRange === "30days"
                                            ? "last 30 days"
                                            : revenueRange === "3months"
                                              ? "last 3 months"
                                              : revenueRange === "6months"
                                                ? "last 6 months"
                                                : revenueRange === "9months"
                                                  ? "last 9 months"
                                                  : "last 12 months"}{" "}
                                        <ChevronDown size={14} />
                                    </button>
                                </div>

                                {/* Graphical Representation */}
                                <div className="absolute bottom-6 left-6 right-6 top-24">
                                    {revenueStats?.chart_data &&
                                    revenueStats.chart_data.length > 0 ? (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <ComposedChart
                                                data={revenueStats.chart_data.map(
                                                    (item) => ({
                                                        name: item.m,
                                                        Achieved:
                                                            item.amount || 0,
                                                        Target:
                                                            revenueStats.target_amount ||
                                                            0,
                                                    }),
                                                )}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                    stroke="#E5E7EB"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: "#9CA3AF",
                                                    }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: "#9CA3AF",
                                                    }}
                                                    tickFormatter={(val) =>
                                                        `₹${val}`
                                                    }
                                                />
                                                <ReTooltip
                                                    contentStyle={{
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                                    }}
                                                />
                                                <Legend
                                                    wrapperStyle={{
                                                        paddingTop: "10px",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="Target"
                                                    fill="#BFDBFE"
                                                    radius={[4, 4, 0, 0]}
                                                    maxBarSize={40}
                                                />
                                                <Bar
                                                    dataKey="Achieved"
                                                    fill="#3B82F6"
                                                    radius={[4, 4, 0, 0]}
                                                    maxBarSize={40}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-bold border-t border-gray-200">
                                            No data available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Col - 3 Stacked Cards */}
                            <div className="w-[300px] flex flex-col gap-4">
                                <div className="bg-white border rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col flex-1 justify-center relative">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                        Total Revenue (
                                        {revenueRange === "30days"
                                            ? "Last 30 Days"
                                            : revenueRange === "3months"
                                              ? "Last 3 Months"
                                              : revenueRange === "6months"
                                                ? "Last 6 Months"
                                                : revenueRange === "9months"
                                                  ? "Last 9 Months"
                                                  : "Last 12 Months"}
                                        )
                                    </div>
                                    <div className="text-[28px] font-bold text-gray-800">
                                        {formatCurrency(
                                            revenueStats.total_revenue,
                                        )}
                                    </div>
                                    {/* <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded flex items-center gap-1 border border-green-100">
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                                            12.5%
                                        </span>
                                        <span className="text-[10px] text-gray-400">vs last year</span>
                                    </div> */}
                                </div>
                                <div className="bg-white border rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col flex-1 justify-center relative">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                        Overdue Invoices
                                    </div>
                                    <div className="text-[28px] font-bold text-gray-800">
                                        {formatCurrency(
                                            revenueStats.pending_amount,
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[10px] font-bold rounded flex items-center gap-1 w-max border border-orange-100">
                                            <AlertCircle
                                                size={10}
                                                strokeWidth={3}
                                            />{" "}
                                            {revenueStats.pending_count} Pending
                                            Invoices
                                        </span>
                                        {revenueStats.overdue_count > 0 && (
                                            <span className="text-[10px] text-red-500 font-bold">
                                                ({revenueStats.overdue_count}{" "}
                                                overdue)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col flex-1 justify-center relative">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                        AVG DEAL SIZE
                                    </div>
                                    <div className="text-[28px] font-bold text-gray-800">
                                        {formatCurrency(
                                            revenueStats.avg_deal_size,
                                        )}
                                    </div>
                                    {/* <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded flex items-center gap-1 border border-green-100">
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                                            2.1%
                                        </span>
                                        <span className="text-[10px] text-gray-400">vs last month</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE ROW (New Jobs, Replacements & Concerns) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                            {/* New job Requests Column */}
                            <ListCol
                                title="New job Requests"
                                data={newJobRequestsList.slice(0, 5)}
                                onViewAll={() =>
                                    navigate("/agency/jobs?tab=notapprovedjobs")
                                }
                                onItemClick={() =>
                                    navigate("/agency/jobs?tab=notapprovedjobs")
                                }
                            />

                            {/* Replacements requests */}
                            <ListCol
                                title="Replacements requests"
                                data={replacementRequestsList.slice(0, 5)}
                                onViewAll={() =>
                                    navigate("/agency/jobs?tab=replacements")
                                }
                                onItemClick={() =>
                                    navigate("/agency/jobs?tab=replacements")
                                }
                            />

                            {/* Client Concerns */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[#1e293b]">
                                        Client Concerns
                                    </h3>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                        <Activity className="text-blue-500 w-6 h-6 animate-pulse" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">
                                        Coming Soon
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1 px-4 text-center">
                                        We're building a smarter way to track
                                        and resolve client feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM ROW (3 Columns) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                            <ListCol
                                title="New Client Requests"
                                data={newClientRequestsList.slice(0, 5)}
                                onViewAll={() => navigate("/agency/allclients")}
                                onItemClick={() =>
                                    navigate("/agency/allclients")
                                }
                            />
                            <ListCol
                                title="T & C Negotiation Requests"
                                data={tcNegotiationList.slice(0, 5)}
                                onViewAll={() =>
                                    navigate("/agency/negotiations")
                                }
                                onItemClick={() =>
                                    navigate("/agency/negotiations")
                                }
                            />
                            <ListCol
                                title="JP negotiations"
                                data={jpNegotiationsList.slice(0, 5)}
                                onViewAll={() =>
                                    navigate("/agency/jobs?tab=edit_requests")
                                }
                                onItemClick={() =>
                                    navigate("/agency/jobs?tab=edit_requests")
                                }
                            />
                        </div>
                    </>
                )}

                {/* /////////////////////////////////////////
                    //           RECRUITERS TAB            //
                    ///////////////////////////////////////// */}

                {tab === "Recruiters" && (
                    <>
                        {/* EXISTING RECRUITERS TAB CONTENT FROM PREVIOUS EDIT GOES HERE */}
                        {/* JOB OVERVIEW */}
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Job over view
                        </h2>

                        <div className="flex flex-col xl:flex-row gap-5 mb-8">
                            {/* Left Small Col */}
                            <div className="flex flex-col gap-4 w-full xl:w-[220px]">
                                <div className="bg-white border rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col justify-center h-[100px]">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                        <div className="p-1 rounded bg-rose-50">
                                            <AlertCircle
                                                size={14}
                                                className="text-rose-500"
                                            />
                                        </div>
                                        Near to deadlines
                                    </div>
                                    <div className="text-3xl font-black text-gray-800">
                                        {recruiterJobStats.near_to_deadline}
                                    </div>
                                </div>
                                <div className="bg-white border rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 flex flex-col justify-center h-[100px]">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2">
                                        <div className="p-1 rounded bg-rose-50">
                                            <XCircle
                                                size={14}
                                                className="text-rose-500"
                                            />
                                        </div>
                                        Deadlines over due
                                    </div>
                                    <div className="text-3xl font-black text-gray-800">
                                        {recruiterJobStats.overdue}
                                    </div>
                                </div>
                            </div>

                            {/* Right Big Col */}
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 relative">
                                {/* <div className="absolute top-5 right-5">
                                <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                                    last 30 days <ChevronDown size={14}/>
                                </button>
                            </div> */}

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                                    <div className="flex flex-col border-r border-gray-200 pr-4 last:border-0 pl-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                                            <div className="p-1 rounded bg-blue-50">
                                                <Briefcase
                                                    size={14}
                                                    className="text-blue-500"
                                                />
                                            </div>{" "}
                                            Active Jobs
                                        </div>
                                        <div className="text-[32px] font-black text-gray-800 leading-none">
                                            {recruiterJobStats.active_jobs}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                            currently live
                                        </div>
                                    </div>
                                    <div className="flex flex-col border-r border-gray-200 pr-4 last:border-0 pl-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                                            <div className="p-1 rounded bg-gray-100">
                                                <Briefcase
                                                    size={14}
                                                    className="text-gray-500"
                                                />
                                            </div>{" "}
                                            Job closed
                                        </div>
                                        <div className="text-[32px] font-black text-gray-800 leading-none">
                                            {recruiterJobStats.jobs_closed}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Total
                                        </div>
                                    </div>
                                    <div className="flex flex-col border-r border-gray-200 pr-4 last:border-0 pl-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                                            <div className="p-1 rounded bg-orange-50">
                                                <Briefcase
                                                    size={14}
                                                    className="text-orange-500"
                                                />
                                            </div>{" "}
                                            New job requests
                                        </div>
                                        <div className="text-[32px] font-black text-gray-800 leading-none">
                                            {recruiterJobStats.new_job_requests}
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Pending approval
                                        </div>
                                    </div>
                                    <div className="flex flex-col border-r border-gray-200 pr-4 last:border-0 pl-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                                            <div className="p-1 rounded bg-green-50">
                                                <Briefcase
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                            </div>{" "}
                                            Positions to be filled
                                        </div>
                                        <div className="text-[32px] font-black text-gray-800 leading-none">
                                            {
                                                recruiterJobStats.positions_to_fill
                                            }
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Across all locations
                                        </div>
                                    </div>
                                    <div className="flex flex-col pl-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                                            <div className="p-1 rounded bg-purple-50">
                                                <Briefcase
                                                    size={14}
                                                    className="text-purple-500"
                                                />
                                            </div>{" "}
                                            Application received
                                        </div>
                                        <div className="text-[32px] font-black text-gray-800 leading-none">
                                            {
                                                recruiterJobStats.applications_received
                                            }
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 font-medium">
                                            Across all jobs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROW 2: INTERVIEW SCHEDULING'S */}
                        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 mb-8 overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#1e293b]">
                                    Interview scheduling's
                                </h3>
                                <div className="flex gap-3">
                                    <Select
                                        value={selectedInterviewClient}
                                        onChange={setSelectedInterviewClient}
                                        style={{ width: 140 }}
                                        placeholder="Client"
                                        size="small"
                                    >
                                        <Select.Option value="all">
                                            All Clients
                                        </Select.Option>
                                        {interviewFilterClients.map((c) => (
                                            <Select.Option
                                                key={c.id}
                                                value={c.id}
                                            >
                                                {c.username}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        value={selectedInterviewRecruiter}
                                        onChange={setSelectedInterviewRecruiter}
                                        style={{ width: 140 }}
                                        placeholder="Recruiter"
                                        size="small"
                                    >
                                        <Select.Option value="all">
                                            All Recruiters
                                        </Select.Option>
                                        {interviewFilterRecruiters.map((r) => (
                                            <Select.Option
                                                key={r.id}
                                                value={r.id}
                                            >
                                                {r.username}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <input
                                        type="date"
                                        value={selectedInterviewDate}
                                        onChange={(e) =>
                                            setSelectedInterviewDate(
                                                e.target.value,
                                            )
                                        }
                                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="relative w-full overflow-x-auto pb-6">
                                <div className="min-w-[1200px]">
                                    {/* Timeline Header */}
                                    <div className="flex text-[10px] text-gray-400 font-bold mb-4 border-b border-gray-100 pb-2">
                                        {[
                                            "08:00",
                                            "09:00",
                                            "10:00",
                                            "11:00",
                                            "12:00",
                                            "13:00",
                                            "14:00",
                                            "15:00",
                                            "16:00",
                                            "17:00",
                                            "18:00",
                                            "19:00",
                                            "20:00",
                                            "21:00",
                                            "22:00",
                                        ].map((t) => (
                                            <div
                                                key={t}
                                                className="flex-1 text-center"
                                            >
                                                {t}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timeline Body */}
                                    <div className="relative h-64 w-full bg-gray-50/30 rounded-lg">
                                        {/* Slot Lines */}
                                        {Array.from({ length: 15 }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className="absolute h-full w-px bg-gray-100"
                                                    style={{
                                                        left: `${(i / 14) * 100}%`,
                                                    }}
                                                ></div>
                                            ),
                                        )}

                                        {interviewData.map((item, idx) => {
                                            const [h, m] = item.from_time
                                                .split(":")
                                                .map(Number);
                                            // Map 08:00 - 22:00 (14 hours)
                                            let leftPercent =
                                                ((h - 8 + m / 60) / 14) * 100;
                                            if (leftPercent < 0)
                                                leftPercent = 0;
                                            if (leftPercent > 95)
                                                leftPercent = 95;

                                            // Stagger top positions
                                            const topPos = 20 + (idx % 4) * 55;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="absolute bg-white border rounded-lg border-blue-500 shadow-sm p-1.5 flex items-center gap-2 z-10 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer max-w-[180px]"
                                                    style={{
                                                        left: `${leftPercent}%`,
                                                        top: `${topPos}px`,
                                                    }}
                                                    onClick={() =>
                                                        setSelectedInterviewModalData(
                                                            item,
                                                        )
                                                    }
                                                    title={`${item.candidate_name} | ${item.job_title} | Client: ${item.client_username} | Recruiter: ${item.recruiters}`}
                                                >
                                                    {/* <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                                                        <img
                                                            src={`https://i.pravatar.cc/100?img=${(idx % 70) + 1}`}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    </div> */}
                                                    <div className="flex flex-col justify-center leading-tight overflow-hidden">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-[10px] font-bold text-gray-800 truncate">
                                                                {
                                                                    item.candidate_name
                                                                }
                                                            </span>
                                                            <span className="text-[8px] bg-blue-50 text-blue-600 px-1 rounded">
                                                                R{item.round}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] text-gray-500 truncate">
                                                            {item.job_title}
                                                        </span>
                                                        <span className="text-[8px] text-gray-400 font-medium">
                                                            {item.from_time} -{" "}
                                                            {item.to_time}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {interviewData.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                                <Calendar
                                                    size={32}
                                                    className="opacity-20"
                                                />
                                                <span className="text-sm font-medium italic">
                                                    No interviews scheduled for
                                                    this selection
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Interview Details Modal */}
                            <Modal
                                title={
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 -mx-6 px-6">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Calendar className="text-blue-500 w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-base font-bold text-gray-800">
                                                Interview Details
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider tabular-nums">
                                                {
                                                    selectedInterviewModalData?.scheduled_date
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                open={!!selectedInterviewModalData}
                                onCancel={() =>
                                    setSelectedInterviewModalData(null)
                                }
                                footer={null}
                                width={450}
                                centered
                                className="interview-modal rounded-2xl overflow-hidden"
                                closeIcon={
                                    <X
                                        size={18}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    />
                                }
                            >
                                {selectedInterviewModalData && (
                                    <div className="py-2">
                                        {/* Candidate Header */}
                                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-xl font-black text-white shadow-sm ring-4 ring-white shrink-0">
                                                {selectedInterviewModalData
                                                    .candidate_name?.[0] || "C"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-lg font-black text-gray-800 leading-tight truncate">
                                                    {
                                                        selectedInterviewModalData.candidate_name
                                                    }
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter">
                                                        Round{" "}
                                                        {
                                                            selectedInterviewModalData.round
                                                        }
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tighter ${
                                                            selectedInterviewModalData.status ===
                                                            "completed"
                                                                ? "bg-green-50 text-green-600 border-green-100"
                                                                : selectedInterviewModalData.status ===
                                                                    "scheduled"
                                                                  ? "bg-blue-50 text-blue-600 border-blue-100"
                                                                  : "bg-gray-50 text-gray-400 border-gray-100"
                                                        }`}
                                                    >
                                                        {
                                                            selectedInterviewModalData.status
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="space-y-4 px-1">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Job Role
                                                    </span>
                                                    <div className="text-[13px] font-bold text-gray-800 leading-snug">
                                                        {
                                                            selectedInterviewModalData.job_title
                                                        }
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Client
                                                    </span>
                                                    <div className="text-[13px] font-bold text-blue-600">
                                                        @
                                                        {
                                                            selectedInterviewModalData.client_username
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Recruiter(s)
                                                </span>
                                                <div className="text-[12px] font-semibold text-gray-600 mt-1 flex flex-wrap gap-1.5">
                                                    {selectedInterviewModalData.recruiters
                                                        ? selectedInterviewModalData.recruiters
                                                              .split(",")
                                                              .map((r, i) => (
                                                                  <span
                                                                      key={i}
                                                                      className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 border border-gray-200"
                                                                  >
                                                                      {r.trim()}
                                                                  </span>
                                                              ))
                                                        : "N/A"}
                                                </div>
                                            </div>

                                            <div className="pt-2 flex items-center justify-between p-3 bg-blue-50/30 rounded-lg border border-blue-100/50 border-dashed">
                                                <div className="flex items-center gap-2">
                                                    <Clock
                                                        size={16}
                                                        className="text-blue-500"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                                                            Time Slot
                                                        </span>
                                                        <span className="text-sm font-black text-gray-800 tabular-nums">
                                                            {
                                                                selectedInterviewModalData.from_time
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                selectedInterviewModalData.to_time
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setSelectedInterviewModalData(
                                                            null,
                                                        )
                                                    }
                                                    className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Modal>
                        </div>

                        {/* ROW 3: RECRUITER CONCERNS (FULL WIDTH) */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 w-full mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#1e293b]">
                                    Recruiter Concerns
                                </h3>
                                {/* <a href="#" className="text-blue-500 text-sm font-semibold hover:underline">View all</a> */}
                            </div>
                            <div className="flex flex-col gap-0 divide-y divide-gray-50">
                                <div className="flex-1 flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                        <Activity className="text-blue-500 w-6 h-6 animate-pulse" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">
                                        Coming Soon
                                    </span>
                                    <p className="text-[10px] text-gray-400 mt-1 px-4 text-center">
                                        We're building a smarter way to track
                                        and resolve recruiter feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ROW 4: RECENT ACTIVES & INVOICES */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 flex flex-col h-[460px]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[#1e293b]">
                                        Recent actives
                                    </h3>
                                    <span
                                        onClick={() =>
                                            navigate("/notifications")
                                        }
                                        className="text-blue-500 text-sm font-semibold hover:underline cursor-pointer"
                                    >
                                        View all
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4 mt-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                    {recentNotifications.map((notif, idx) => (
                                        <div
                                            key={notif.id || idx}
                                            onClick={() =>
                                                navigate("/notifications")
                                            }
                                            className="cursor-pointer flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100">
                                                <Activity className="text-blue-500 w-5 h-5" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div
                                                    className="text-sm font-bold text-gray-800 leading-snug truncate pr-4"
                                                    title={
                                                        notif.subject ||
                                                        notif.message
                                                    }
                                                >
                                                    {notif.subject ||
                                                        notif.message}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5 truncate">
                                                    {notif.sender?.username ||
                                                        "System Alert"}
                                                </div>
                                            </div>
                                            <div className="text-[11px] font-medium text-gray-400 mt-1 shrink-0">
                                                {formatTimeAgo(
                                                    notif.created_at,
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {recentNotifications.length === 0 && (
                                        <div className="text-center text-sm font-semibold italic text-gray-400 py-8">
                                            No recent activity
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 flex flex-col h-[460px]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-[#1e293b]">
                                        Invoices
                                    </h3>
                                    <button
                                        onClick={() =>
                                            navigate("/agency/reports")
                                        }
                                        className="text-blue-500 text-sm font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                                    >
                                        View all
                                    </button>
                                </div>
                                <div className="flex border border-[#3B82F6] rounded overflow-hidden w-max mb-5">
                                    <button
                                        onClick={() =>
                                            setInvoiceTab("Today's invoices")
                                        }
                                        className={`px-4 py-1 text-xs font-semibold ${invoiceTab === "Today's invoices" ? "bg-[#3B82F6] text-white" : "bg-white text-blue-500"}`}
                                    >
                                        Today's invoices
                                    </button>
                                    <button
                                        onClick={() =>
                                            setInvoiceTab("Over dues")
                                        }
                                        className={`px-4 py-1 text-xs font-semibold ${invoiceTab === "Over dues" ? "bg-[#3B82F6] text-white" : "bg-white text-blue-500"}`}
                                    >
                                        Over dues
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                    {(invoiceTab === "Today's invoices"
                                        ? invoiceSummary.today_invoices
                                        : invoiceSummary.overdue_invoices
                                    ).map((inv, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between py-2.5 px-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 rounded-lg group"
                                            onClick={() =>
                                                navigate("/agency/reports")
                                            }
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div
                                                    className={`w-2 h-2 rounded-full shrink-0 ${inv.status === "paid" ? "bg-green-500" : "bg-red-500"}`}
                                                ></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-bold text-gray-700 tracking-tight">
                                                        {inv.id}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 truncate font-medium">
                                                        {inv.company}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-xs font-bold shrink-0 ${inv.status === "paid" ? "text-green-600" : "text-gray-900"} group-hover:text-blue-600 transition-colors`}
                                            >
                                                {formatCurrency(inv.amount)}
                                            </div>
                                        </div>
                                    ))}
                                    {(invoiceTab === "Today's invoices"
                                        ? invoiceSummary.today_invoices
                                        : invoiceSummary.overdue_invoices
                                    ).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                                            <FileText
                                                size={32}
                                                strokeWidth={1.5}
                                                className="opacity-20"
                                            />
                                            <span className="text-sm font-medium italic">
                                                No invoices found
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ROW 5: LATEST JOB STACKS */}
                        <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#1e293b]">
                                    Latest Job Stacks
                                </h3>
                                <a
                                    href="/agency/jobs"
                                    className="text-blue-500 text-sm font-semibold hover:underline"
                                >
                                    View all
                                </a>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs text-gray-400 font-semibold border-b border-gray-100">
                                            <th className="pb-3 px-2 font-normal">
                                                Job Id
                                            </th>
                                            <th className="pb-3 px-2 font-normal">
                                                Job Role
                                            </th>
                                            <th className="pb-3 px-2 font-normal">
                                                Client
                                            </th>
                                            <th className="pb-3 px-2 font-normal">
                                                Positions
                                            </th>
                                            <th className="pb-3 px-2 font-normal text-center">
                                                Job status
                                            </th>
                                            <th className="pb-3 px-2 font-normal">
                                                Tenure Date
                                            </th>
                                            <th className="pb-3 px-2 font-normal text-center">
                                                Recruiting status
                                            </th>
                                            <th className="pb-3 px-2 font-normal">
                                                Candidates status
                                            </th>
                                            {/* <th className="pb-3 px-2 font-normal text-center">Summary</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {latestJobStacksList.map((row, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-50 hover:bg-gray-50/50"
                                            >
                                                <td className="py-4 px-2 text-gray-500">
                                                    {row.id}
                                                </td>
                                                <td className="py-4 px-2 font-bold text-gray-800">
                                                    {row.role}
                                                </td>
                                                <td className="py-4 px-2 text-gray-600">
                                                    {row.client}
                                                </td>
                                                <td className="py-4 px-2 text-gray-600 text-center">
                                                    {row.pos}
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <span
                                                        className={`px-3 py-1 rounded text-xs font-bold ${row.stColor}`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-green-500 font-medium">
                                                    {row.date}
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <span
                                                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${row.rcColor}`}
                                                    >
                                                        {row.recStatus}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div
                                                        className="flex gap-1"
                                                        title="Profiles Sent | Shortlisted | Joined | Selected | Processing"
                                                    >
                                                        <div
                                                            className="w-6 h-6 border text-[10px] font-bold flex items-center justify-center rounded"
                                                            style={{
                                                                borderColor:
                                                                    legendItems[0]
                                                                        .bg,
                                                                color: legendItems[0]
                                                                    .color,
                                                            }}
                                                            title={
                                                                legendItems[0]
                                                                    .label
                                                            }
                                                        >
                                                            {row
                                                                .candidate_counts
                                                                ?.Applied || 0}
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 border text-[10px] font-bold flex items-center justify-center rounded"
                                                            style={{
                                                                borderColor:
                                                                    legendItems[1]
                                                                        .bg,
                                                                color: legendItems[1]
                                                                    .color,
                                                            }}
                                                            title={
                                                                legendItems[1]
                                                                    .label
                                                            }
                                                        >
                                                            {row
                                                                .candidate_counts
                                                                ?.Shortlisted ||
                                                                0}
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 border text-[10px] font-bold flex items-center justify-center rounded"
                                                            style={{
                                                                borderColor:
                                                                    legendItems[7]
                                                                        .bg,
                                                                color: legendItems[7]
                                                                    .color,
                                                            }}
                                                            title={
                                                                legendItems[7]
                                                                    .label
                                                            }
                                                        >
                                                            {row
                                                                .candidate_counts
                                                                ?.Joined || 0}
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 border text-[10px] font-bold flex items-center justify-center rounded"
                                                            style={{
                                                                borderColor:
                                                                    legendItems[5]
                                                                        .bg,
                                                                color: legendItems[5]
                                                                    .color,
                                                            }}
                                                            title={
                                                                legendItems[5]
                                                                    .label
                                                            }
                                                        >
                                                            {row
                                                                .candidate_counts
                                                                ?.Selected || 0}
                                                        </div>
                                                        <div
                                                            className="w-6 h-6 border text-[10px] font-bold flex items-center justify-center rounded"
                                                            style={{
                                                                borderColor:
                                                                    legendItems[2]
                                                                        .bg,
                                                                color: legendItems[2]
                                                                    .color,
                                                            }}
                                                            title={
                                                                legendItems[2]
                                                                    .label
                                                            }
                                                        >
                                                            {row
                                                                .candidate_counts
                                                                ?.Processing ||
                                                                0}
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* <td className="py-4 px-2 text-center">
                                                <button className="border border-gray-300 text-gray-500 text-[10px] font-semibold px-3 py-1 rounded hover:bg-gray-50">View Summary</button>
                                            </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ROW 6: CHARTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Job stacks for roles */}
                            <div className="bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col h-[400px]">
                                <h3 className="text-lg font-bold text-[#1e293b] mb-4">
                                    Job Stacks for roles
                                </h3>
                                <div className="flex gap-2 mb-6">
                                    <Select
                                        className="flex-1"
                                        placeholder="All Clients"
                                        value={selectedStackClient}
                                        onChange={(val) => {
                                            setSelectedStackClient(val);
                                            setSelectedStackJob("all");
                                        }}
                                        size="small"
                                    >
                                        <Select.Option value="all">
                                            All Clients
                                        </Select.Option>
                                        {jobStackFilters.clients.map((c) => (
                                            <Select.Option
                                                key={c.user_id}
                                                value={c.user_id}
                                            >
                                                {c.name_of_organization}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    <Select
                                        className="flex-1"
                                        placeholder="All Jobs"
                                        value={selectedStackJob}
                                        onChange={setSelectedStackJob}
                                        size="small"
                                    >
                                        <Select.Option value="all">
                                            All Jobs
                                        </Select.Option>
                                        {jobStackFilters.jobs
                                            .filter(
                                                (j) =>
                                                    selectedStackClient ===
                                                        "all" ||
                                                    j.username_id ===
                                                        selectedStackClient,
                                            )
                                            .map((j) => (
                                                <Select.Option
                                                    key={j.id}
                                                    value={j.id}
                                                >
                                                    {j.job_title}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                    <RangePicker
                                        className="flex-1"
                                        size="small"
                                        onChange={setStackDateRange}
                                        value={stackDateRange}
                                    />
                                </div>
                                <div className="flex flex-1 items-center justify-center relative px-2">
                                    <div className="w-48 h-48 relative flex items-center justify-center">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={jobStackStats.map(
                                                        (item) => ({
                                                            name: item.label,
                                                            value: item.count,
                                                        }),
                                                    )}
                                                    innerRadius={60}
                                                    outerRadius={85}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {jobStackStats.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    legendItems.find(
                                                                        (l) =>
                                                                            l.label ===
                                                                            entry.label,
                                                                    )?.color ||
                                                                    "#ccc"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <ReTooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => {
                                                        if (
                                                            active &&
                                                            payload &&
                                                            payload.length
                                                        ) {
                                                            const itemColor =
                                                                legendItems.find(
                                                                    (l) =>
                                                                        l.label ===
                                                                        payload[0]
                                                                            .name,
                                                                )?.color ||
                                                                "#000";
                                                            return (
                                                                <div
                                                                    className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg border-l-4"
                                                                    style={{
                                                                        borderLeftColor:
                                                                            itemColor,
                                                                    }}
                                                                >
                                                                    <div className="font-bold flex items-center gap-1.5">
                                                                        <span
                                                                            className="w-1.5 h-1.5 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    itemColor,
                                                                            }}
                                                                        ></span>
                                                                        {
                                                                            payload[0]
                                                                                .name
                                                                        }
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        {
                                                                            payload[0]
                                                                                .value
                                                                        }{" "}
                                                                        Applications
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="text-xl font-black text-gray-800">
                                                {jobStackStats.reduce(
                                                    (sum, item) =>
                                                        sum + item.count,
                                                    0,
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                Total
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 ml-6">
                                        <div className="flex flex-col gap-1.5 text-[10px] font-bold text-gray-400">
                                            {[0, 1, 2, 3, 5, 4, 7, 6].map(
                                                (idx) => {
                                                    const stat =
                                                        jobStackStats.find(
                                                            (s) =>
                                                                s.label ===
                                                                legendItems[idx]
                                                                    .label,
                                                        );
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between uppercase"
                                                        >
                                                            <span
                                                                style={{
                                                                    color: legendItems[
                                                                        idx
                                                                    ].color,
                                                                }}
                                                            >
                                                                {
                                                                    legendItems[
                                                                        idx
                                                                    ].label
                                                                }
                                                            </span>
                                                            <span
                                                                style={{
                                                                    color: legendItems[
                                                                        idx
                                                                    ].color,
                                                                }}
                                                            >
                                                                {stat
                                                                    ? String(
                                                                          stat.count,
                                                                      ).padStart(
                                                                          2,
                                                                          "0",
                                                                      )
                                                                    : "00"}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] text-gray-500 font-medium">
                                    {legendItems.map((item) => (
                                        <span
                                            key={item.label}
                                            className="flex items-center gap-1"
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    backgroundColor: item.bg,
                                                }}
                                            ></span>
                                            <span style={{ color: item.color }}>
                                                {item.label}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recruiter Summary */}
                            <div className="bg-white border mb-6 border-gray-100 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex flex-col h-[400px]">
                                <h3 className="text-lg font-bold text-[#1e293b] mb-4">
                                    Recruiter Summary
                                </h3>
                                <div className="flex gap-4 mb-8">
                                    <Select
                                        className="flex-[2]"
                                        placeholder="All Recruiters"
                                        value={selectedRecruiterSummary}
                                        onChange={setSelectedRecruiterSummary}
                                        size="small"
                                    >
                                        <Select.Option value="all">
                                            All Recruiters
                                        </Select.Option>
                                        {jobStackFilters.recruiters?.map(
                                            (r) => (
                                                <Select.Option
                                                    key={r.id}
                                                    value={r.id}
                                                >
                                                    {r.username}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
                                    <RangePicker
                                        className="flex-[3]"
                                        size="small"
                                        onChange={setRecruiterSummaryDateRange}
                                        value={recruiterSummaryDateRange}
                                    />
                                </div>
                                <div className="flex flex-1 items-center justify-center relative px-2">
                                    <div className="w-48 h-48 relative flex items-center justify-center">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={recruiterSummaryStats.map(
                                                        (item) => ({
                                                            name: item.label,
                                                            value: item.count,
                                                        }),
                                                    )}
                                                    innerRadius={60}
                                                    outerRadius={85}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {recruiterSummaryStats.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    legendItems.find(
                                                                        (l) =>
                                                                            l.label ===
                                                                            entry.label,
                                                                    )?.color ||
                                                                    "#ccc"
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <ReTooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => {
                                                        if (
                                                            active &&
                                                            payload &&
                                                            payload.length
                                                        ) {
                                                            const itemColor =
                                                                legendItems.find(
                                                                    (l) =>
                                                                        l.label ===
                                                                        payload[0]
                                                                            .name,
                                                                )?.color ||
                                                                "#000";
                                                            return (
                                                                <div
                                                                    className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg border-l-4"
                                                                    style={{
                                                                        borderLeftColor:
                                                                            itemColor,
                                                                    }}
                                                                >
                                                                    <div className="font-bold flex items-center gap-1.5">
                                                                        <span
                                                                            className="w-1.5 h-1.5 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    itemColor,
                                                                            }}
                                                                        ></span>
                                                                        {
                                                                            payload[0]
                                                                                .name
                                                                        }
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        {
                                                                            payload[0]
                                                                                .value
                                                                        }{" "}
                                                                        Applications
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <div className="text-xl font-black text-gray-800">
                                                {recruiterSummaryStats.reduce(
                                                    (sum, item) =>
                                                        sum + item.count,
                                                    0,
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                Total
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 ml-6">
                                        <div className="flex flex-col gap-1.5 text-[10px] font-bold text-gray-400">
                                            {[0, 1, 2, 3, 5, 4, 7, 6].map(
                                                (idx) => {
                                                    const stat =
                                                        recruiterSummaryStats.find(
                                                            (s) =>
                                                                s.label ===
                                                                legendItems[idx]
                                                                    .label,
                                                        );
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between uppercase"
                                                        >
                                                            <span
                                                                style={{
                                                                    color: legendItems[
                                                                        idx
                                                                    ].color,
                                                                }}
                                                            >
                                                                {
                                                                    legendItems[
                                                                        idx
                                                                    ].label
                                                                }
                                                            </span>
                                                            <span
                                                                style={{
                                                                    color: legendItems[
                                                                        idx
                                                                    ].color,
                                                                }}
                                                            >
                                                                {stat
                                                                    ? String(
                                                                          stat.count,
                                                                      ).padStart(
                                                                          2,
                                                                          "0",
                                                                      )
                                                                    : "00"}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 mb-6 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] text-gray-500 font-medium">
                                    {legendItems.map((item) => (
                                        <span
                                            key={item.label}
                                            className="flex items-center gap-1"
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    backgroundColor: item.bg,
                                                }}
                                            ></span>
                                            <span style={{ color: item.color }}>
                                                {item.label}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Main>
    );
}
