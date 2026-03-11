import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../common/useAuth";
import { useNavigate } from "react-router-dom";
import Main from "./Layout";
import {
    PlusOutlined,
    CalendarOutlined,
    BarChartOutlined,
    EllipsisOutlined,
    RightOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    RocketOutlined,
} from "@ant-design/icons";
import {
    Card,
    Row,
    Col,
    Button,
    Typography,
    Avatar,
    Badge,
    Table,
    Select,
    Tag,
    Modal,
    Tooltip,
} from "antd";
import {
    TrendingUp,
    Users,
    Briefcase,
    DollarSign,
    ClipboardCheck,
    // Archive,
    Archive,
    UserCheck,
    Rocket,
} from "lucide-react";

const { Title, Text } = Typography;

const Recruiter = () => {
    const navigate = useNavigate();
    const { token, apiurl, userData } = useAuth();
    const [isConcernModalOpen, setIsConcernModalOpen] = useState(false);
    const [recentActives, setRecentActives] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [selectedJob, setSelectedJob] = useState(null);
    const [assignedJobs, setAssignedJobs] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [selectedClientForOutcomes, setSelectedClientForOutcomes] =
        useState(null);
    const [selectedPeriodForOutcomes, setSelectedPeriodForOutcomes] =
        useState("Month");

    const getNotificationIcon = (subject, message) => {
        const text = (subject + " " + message).toLowerCase();
        if (text.includes("interview"))
            return <SyncOutlined style={{ color: "#1681FF" }} />;
        if (text.includes("accepted") || text.includes("joined"))
            return <CheckCircleFilled style={{ color: "#52C41A" }} />;
        if (text.includes("job") || text.includes("requisition"))
            return <Briefcase size={16} color="#1681FF" />;
        if (text.includes("promotion"))
            return <TrendingUp size={16} color="#8B5CF6" />;
        return <SyncOutlined style={{ color: "#1681FF" }} />;
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    const getOrdinalSuffix = (num) => {
        if (!num) return "th";
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return "st";
        if (j === 2 && k !== 12) return "nd";
        if (j === 3 && k !== 13) return "rd";
        return "th";
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!token) return;
            try {
                // Fetch notifications
                const notifRes = await axios.get(`${apiurl}/notifications/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (notifRes.data && notifRes.data.data) {
                    const mapped = notifRes.data.data
                        .slice(0, 5)
                        .map((item) => ({
                            user: item.subject,
                            sub: item.message,
                            time: formatTimeAgo(item.created_at),
                            icon: getNotificationIcon(
                                item.subject,
                                item.message,
                            ),
                        }));
                    setRecentActives(mapped);
                }

                // Fetch unseen count
                const countRes = await axios.get(
                    `${apiurl}/notifications/?count=true`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (countRes.data && countRes.data.count !== undefined) {
                    setUnseenCount(countRes.data.count);
                }

                // Fetch dashboard stats
                try {
                    const statsRes = await axios.get(
                        `${apiurl}/recruiter/dashboard/stats/?period=${selectedPeriodForOutcomes}${selectedClientForOutcomes ? `&job_id=${selectedClientForOutcomes}` : ""}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    );
                    if (statsRes.data && statsRes.data.data) {
                        setDashboardStats(statsRes.data.data);
                    }
                } catch (statsError) {
                    console.error(
                        "Error fetching recruiter stats:",
                        statsError,
                    );
                }
            } catch (error) {
                console.error("Error fetching recruiter notifications:", error);
            }
        };

        fetchNotifications();
    }, [token, apiurl, selectedPeriodForOutcomes, selectedClientForOutcomes]);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!token) return;
            try {
                const res = await axios.get(
                    `${apiurl}/recruiter/interview-scheduling/?date=${selectedDate}${selectedJob ? `&job_id=${selectedJob}` : ""}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                if (res.data && res.data.data) {
                    setInterviews(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching interviews:", error);
            }
        };

        const fetchJobs = async () => {
            if (!token) return;
            try {
                const res = await axios.get(
                    `${apiurl}/recruiter/assigned-jobs/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (res.data && res.data.data) {
                    setAssignedJobs(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchInterviews();
        fetchJobs();
    }, [token, apiurl, selectedDate, selectedJob]);

    const showConcernModal = () => setIsConcernModalOpen(true);
    const closeConcernModal = () => setIsConcernModalOpen(false);

    // Stat Cards Data
    const statCards = [
        {
            title: "Today Interviews",
            count: dashboardStats?.today_interviews || "0",
            icon: <CalendarOutlined style={{ color: "#FF7A00" }} />,
            bg: "#FFF7F0",
        },
        {
            title: "Target amount this month",
            count: `₹${dashboardStats?.target_amount || "0"}`,
            icon: <DollarSign size={20} color="#FF4D4F" />,
            bg: "#FFF1F0",
        },
        {
            title: "Target Closed Positions",
            count: dashboardStats?.target_closed_positions || "0",
            icon: <UserOutlined style={{ color: "#1681FF" }} />,
            bg: "#E6F7FF",
        },
        {
            title: "New citations today",
            count: dashboardStats?.new_citations || "0",
            icon: <SyncOutlined style={{ color: "#1681FF" }} />,
            bg: "#E6F7FF",
        },
        {
            title: "Replacements",
            count: dashboardStats?.replacements || "0",
            icon: <UserCheck size={20} color="#434343" />,
            bg: "#F5F5F5",
        },
        {
            title: "Achieved amount this month",
            count: `₹${dashboardStats?.achieved_amount || "0"}`,
            icon: <CheckCircleFilled style={{ color: "#52C41A" }} />,
            bg: "#F6FFED",
        },
        {
            title: "Closed Positions",
            count: dashboardStats?.archived_positions || "0",
            icon: <Archive size={20} color="#FAAD14" />,
            bg: "#FFFBE6",
            sub: dashboardStats?.archived_sub || "",
            subColor: "#52C41A",
        },
    ];

    // Follow ups data from backend
    const followUps = dashboardStats?.follow_ups || [];

    // Recent Active data - Now managed by state
    // Initial data is empty, loaded from backend

    // Latest Job Stocks Table Columns
    const jobStockColumns = [
        { title: "Job id", dataIndex: "id", key: "id" },
        {
            title: "Job Role",
            dataIndex: "role",
            key: "role",
            render: (text) => <b>{text}</b>,
        },
        { title: "Client", dataIndex: "client", key: "client" },
        { title: "Positions", dataIndex: "positions", key: "positions" },
        {
            title: "Job status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color =
                    status === "Open"
                        ? "blue"
                        : status === "Closed"
                          ? "red"
                          : "orange";
                return (
                    <Tag color={color} style={{ borderRadius: "4px" }}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Tenure Date",
            dataIndex: "date",
            key: "date",
            render: (date) => <span style={{ color: "#52C41A" }}>{date}</span>,
        },
        {
            title: "Candidates status",
            dataIndex: "status_counts",
            key: "candidates",
            render: (counts) => (
                <div className="flex gap-1">
                    {[
                        {
                            label: "Profiles Sent",
                            value: counts?.sent || 0,
                            color: "#F59E0B",
                            bg: "#FFFBEB",
                        },
                        {
                            label: "Shortlisted (R1)",
                            value: counts?.shortlisted_r1 || 0,
                            color: "#22C55E",
                            bg: "#F0FDF4",
                        },
                        {
                            label: "Processing (R2+)",
                            value: counts?.processing_r2_plus || 0,
                            color: "#A855F7",
                            bg: "#FAF5FF",
                        },
                        {
                            label: "on-Hold",
                            value: counts?.on_hold || 0,
                            color: "#84CC16",
                            bg: "#F7FEE7",
                        },
                        {
                            label: "Rejected",
                            value: counts?.rejected || 0,
                            color: "#EF4444",
                            bg: "#FEF2F2",
                        },
                        {
                            label: "Selected",
                            value: counts?.selected || 0,
                            color: "#3B82F6",
                            bg: "#EFF6FF",
                        },
                        {
                            label: "Replaced",
                            value: counts?.replaced || 0,
                            color: "#F97316",
                            bg: "#FFF7ED",
                        },
                        {
                            label: "Joined",
                            value: counts?.joined || 0,
                            color: "#14B8A6",
                            bg: "#F0FDFA",
                        },
                    ].map((step, i) => (
                        <Tooltip key={i} title={`${step.label}: ${step.value}`}>
                            <div
                                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 cursor-help"
                                style={{
                                    backgroundColor: step.bg,
                                    color: step.color,
                                    border: `1px solid ${step.color}`,
                                }}
                            >
                                {step.value}
                            </div>
                        </Tooltip>
                    ))}
                </div>
            ),
        },
    ];

    const jobStockData = [
        {
            id: "91822",
            role: "UI/UX Designer",
            client: "MCO",
            positions: "02",
            status: "Open",
            date: "2025-04-15",
        },
        {
            id: "91822",
            role: "UI/UX Designer",
            client: "MCO",
            positions: "02",
            status: "Closed",
            date: "2025-04-15",
        },
        {
            id: "91822",
            role: "UI/UX Designer",
            client: "MCO",
            positions: "02",
            status: "On hold",
            date: "2025-04-15",
        },
        {
            id: "91824",
            role: "Frontend Developer",
            client: "NYC",
            positions: "02",
            status: "Open",
            date: "2025-05-20",
        },
        {
            id: "91824",
            role: "Backend Developer",
            client: "LON",
            positions: "02",
            status: "Closed",
            date: "2025-06-10",
        },
    ];

    const outcomesSteps = [
        {
            label: "Profiles Sent",
            value: dashboardStats?.outcomes?.sent || 0,
            color: "#F59E0B", // brighter amber
            bg: "#FFFBEB",
        },
        {
            label: "Shortlisted (R1)",
            value: dashboardStats?.outcomes?.shortlisted_r1 || 0,
            color: "#22C55E", // brighter green
            bg: "#F0FDF4",
        },
        {
            label: "Processing (R2+)",
            value: dashboardStats?.outcomes?.processing_r2_plus || 0,
            color: "#A855F7", // brighter purple
            bg: "#FAF5FF",
        },
        {
            label: "on-Hold",
            value: dashboardStats?.outcomes?.on_hold || 0,
            color: "#84CC16", // brighter lime
            bg: "#F7FEE7",
        },
        {
            label: "Rejected",
            value: dashboardStats?.outcomes?.rejected || 0,
            color: "#EF4444", // brighter red
            bg: "#FEF2F2",
        },
        {
            label: "Selected",
            value: dashboardStats?.outcomes?.selected || 0,
            color: "#3B82F6", // brighter blue
            bg: "#EFF6FF",
        },
        {
            label: "Replaced",
            value: dashboardStats?.outcomes?.replaced || 0,
            color: "#F97316", // brighter orange
            bg: "#FFF7ED",
        },
        {
            label: "Joined",
            value: dashboardStats?.outcomes?.joined || 0,
            color: "#14B8A6", // brighter teal
            bg: "#F0FDFA",
        },
    ];

    return (
        <Main defaultSelectedKey="1" defaultSelectedChildKey="0">
            <div className="p-6 bg-[#F8F9FA] min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <Title level={2} className="!mb-0">
                            Welcome back, {userData?.username || "Recruiter"} 👋
                        </Title>
                        <Text className="text-gray-500">
                            Let's find ways to scale and achieve greater
                            success.
                        </Text>
                    </div>
                    <div className="flex flex-wrap m-0 gap-3">
                        <Button
                            icon={<PlusOutlined />}
                            className="text-blue-500 border-blue-500"
                            onClick={showConcernModal}
                        >
                            Rise concern
                        </Button>
                        <Button
                            icon={<CalendarOutlined />}
                            onClick={() => navigate("/recruiter/job-calendar")}
                        >
                            Calendar
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-blue-500"
                            onClick={() =>
                                navigate("/recruiter/applications/to-schedule")
                            }
                        >
                            Schedule interview
                        </Button>
                    </div>
                </div>

                {/* Top Section: Leaderboard + Stats */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} lg={8}>
                        <Card
                            className="h-full relative overflow-hidden text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, #FFFFFF 54%, #1A73E8 99%)",
                                border: "none",
                                borderRadius: "16px",
                            }}
                        >
                            <div className="relative z-10 p-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px]">
                                            🔔
                                        </div>
                                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-[10px]">
                                            🎁
                                        </div>
                                        <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-[10px]">
                                            🔄
                                        </div>
                                    </div>
                                    <Text className="text-gray-600 font-medium">
                                        Total you have{" "}
                                        {dashboardStats?.new_items_today || 0}{" "}
                                        new items today
                                    </Text>
                                </div>

                                <div className="mt-8">
                                    <Text className="text-gray-400 block mb-1">
                                        You are on
                                    </Text>
                                    <Title
                                        level={4}
                                        className="!m-0 text-gray-800"
                                    >
                                        {dashboardStats?.leaderboard_position ||
                                            0}
                                        {getOrdinalSuffix(
                                            dashboardStats?.leaderboard_position,
                                        )}{" "}
                                        Position in the leader board
                                    </Title>

                                    {/* <div className="flex items-center mt-4">
                                        <Avatar.Group maxCount={4}>
                                            <Avatar src="https://i.pravatar.cc/100?u=1" />
                                            <Avatar src="https://i.pravatar.cc/100?u=2" />
                                            <Avatar src="https://i.pravatar.cc/100?u=3" />
                                            <Avatar src="https://i.pravatar.cc/100?u=4" />
                                        </Avatar.Group>
                                        <span className="text-gray-400 ml-2 text-xs">
                                            +2
                                        </span>
                                    </div> */}
                                    <Text className="text-gray-300 text-[10px] mt-4 block italic">
                                        *This will be updated on start of every
                                        month
                                    </Text>
                                </div>
                            </div>
                            {/* Gradient Overlay for visual effect like in image */}
                            <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-10 -mb-10"></div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-full">
                            {statCards.map((stat, idx) => (
                                <Card
                                    key={idx}
                                    bodyStyle={{ padding: "12px" }}
                                    className="border-none shadow-sm rounded-xl flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-gray-500 text-[11px] mb-1">
                                                {stat.title}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {stat.count}
                                            </div>
                                           
                                        </div>
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: stat.bg }}
                                        >
                                            {stat.icon}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Card className="mb-6 rounded-2xl shadow-sm border-none overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 p-4">
                        <Title level={4} className="!m-0">
                            Interview scheduling's
                        </Title>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Select
                                placeholder="Select Job"
                                style={{ width: 150 }}
                                className="w-full sm:w-[150px]"
                                size="small"
                                allowClear
                                onChange={(val) => setSelectedJob(val)}
                            >
                                {assignedJobs.map((job) => (
                                    <Select.Option
                                        key={job.id}
                                        value={job.job_id}
                                    >
                                        {job.job_title}
                                    </Select.Option>
                                ))}
                            </Select>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="border rounded px-2 py-1 text-xs outline-none w-full sm:w-auto"
                            />
                        </div>
                    </div>

                    <div className="relative overflow-x-auto">
                        <div className="min-w-[800px] h-[200px] border-t border-gray-100 pt-4">
                            {/* Time indicators */}
                            <div className="flex justify-between text-[10px] text-gray-400 mb-8 px-2">
                                {[
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
                                    <span key={t}>{t}</span>
                                ))}
                            </div>

                            {/* Dynamic scheduled blocks */}
                            <div className="relative h-16 bg-blue-50/30 rounded-lg flex items-center">
                                {interviews.length > 0 ? (
                                    interviews.map((interview, index) => {
                                        const [h, m] = interview.from_time
                                            .split(":")
                                            .map(Number);
                                        let minsSince09 = (h - 9) * 60 + m;
                                        // Clamp between 0 and 780 (22:00)
                                        minsSince09 = Math.max(
                                            0,
                                            Math.min(780, minsSince09),
                                        );
                                        const leftPos =
                                            (minsSince09 / 780) * 100;

                                        return (
                                            <div
                                                key={interview.id}
                                                className="absolute bg-white p-2 rounded shadow-sm flex items-center gap-2 border border-blue-200 transition-all hover:z-20 hover:shadow-md cursor-pointer hover:border-blue-400 group"
                                                style={{
                                                    left: `${leftPos}%`,
                                                    transform:
                                                        "translateX(-10%)",
                                                }}
                                                onClick={() => {
                                                    setSelectedInterview(
                                                        interview,
                                                    );
                                                    setIsInterviewModalOpen(
                                                        true,
                                                    );
                                                }}
                                            >
                                                <Avatar
                                                    icon={<UserOutlined />}
                                                    size="small"
                                                    className="bg-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                                                />
                                                <div className="text-[10px] whitespace-nowrap overflow-hidden max-w-[120px]">
                                                    <div
                                                        className="font-bold truncate"
                                                        title={interview.title}
                                                    >
                                                        {interview.title}
                                                    </div>
                                                    <div className="text-gray-400">
                                                        {interview.from_time} -{" "}
                                                        {interview.to_time}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="w-full text-center text-gray-400 text-xs italic">
                                        No interviews scheduled for this date
                                    </div>
                                )}

                                {/* Current time marker (if today) */}
                                {selectedDate ===
                                    new Date().toISOString().split("T")[0] &&
                                    (() => {
                                        const now = new Date();
                                        const currentH = now.getHours();
                                        const currentM = now.getMinutes();
                                        if (currentH >= 9 && currentH < 22) {
                                            const mins =
                                                (currentH - 9) * 60 + currentM;
                                            const left = (mins / 780) * 100;
                                            return (
                                                <div
                                                    className="absolute top-[-20px] bottom-[-20px] w-[1px] bg-red-400 z-10"
                                                    style={{ left: `${left}%` }}
                                                >
                                                    <div className="w-2 h-2 bg-red-400 rounded-full -ml-[3.5px] -mt-1"></div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Follow ups & Recent Actives Row */}
                <Row gutter={[24, 24]} className="mb-6 mt-6 flex items-stretch">
                    <Col xs={24} md={12} className="flex">
                        <Card
                            className="rounded-2xl shadow-sm border-none flex-1 h-full"
                            bodyStyle={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            title={
                                <div className="flex justify-between">
                                    <span>Follow ups</span>
                                    <Button
                                        type="link"
                                        size="small"
                                        className="text-blue-500"
                                    >
                                        View all
                                    </Button>
                                </div>
                            }
                        >
                            <div className="space-y-4 flex-1">
                                {followUps.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                icon={<UserOutlined />}
                                                style={{
                                                    backgroundColor: `${item.color}20`,
                                                    color: item.color,
                                                }}
                                                size="small"
                                            />
                                            <div>
                                                <div className="text-xs font-medium">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    @ {item.client}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="small"
                                            type="primary"
                                            className="text-[10px] h-6 bg-blue-500"
                                            onClick={() => {
                                                if (item.candidate_id) {
                                                    navigate(
                                                        `/agency/view_candidate?candidate_id=${item.candidate_id}`,
                                                    );
                                                }
                                            }}
                                            disabled={!item.candidate_id}
                                        >
                                            Contact info
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} className="flex">
                        <Card
                            className="rounded-2xl shadow-sm border-none flex-1 h-full"
                            bodyStyle={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            title={
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span>Recent actives</span>
                                        <Badge
                                            count={unseenCount}
                                            style={{
                                                backgroundColor: "#10B981",
                                                fontSize: "10px",
                                            }}
                                            title={`${unseenCount} new notifications`}
                                        />
                                    </div>
                                    <Button
                                        type="link"
                                        size="small"
                                        className="text-blue-500"
                                        onClick={() =>
                                            navigate("/notifications")
                                        }
                                    >
                                        View all
                                    </Button>
                                </div>
                            }
                        >
                            <div className="space-y-4 flex-1">
                                {recentActives.length > 0 ? (
                                    recentActives.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-start gap-3 pb-2 border-b border-gray-50 last:border-0"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <CheckCircleFilled
                                                        style={{
                                                            color: "#52C41A",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            "/notifications",
                                                        )
                                                    }
                                                >
                                                    <div className="text-xs font-medium">
                                                        {item.user}
                                                    </div>
                                                    {/* <div className="text-[10px] text-gray-400">
                                                        {item.sub}
                                                    </div> */}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-300 whitespace-nowrap">
                                                {item.time}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <SyncOutlined className="text-2xl mb-2 opacity-20" />
                                        <span className="text-xs">
                                            No recent activities
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Latest Job Stocks Table */}
                <Card
                    className="mb-6 rounded-2xl shadow-sm border-none overflow-hidden"
                    title={
                        <div className="flex justify-between items-center">
                            <span>Latest Job Stocks</span>
                            <Button
                                type="link"
                                size="small"
                                className="text-blue-500"
                                onClick={() =>
                                    navigate("/recruiter/postings/opened")
                                }
                            >
                                View all
                            </Button>
                        </div>
                    }
                >
                    <div className="overflow-x-auto">
                        <Table
                            columns={jobStockColumns}
                            dataSource={dashboardStats?.job_stocks || []}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            className="custom-dashboard-table min-w-[800px]"
                        />
                    </div>
                </Card>

                {/* Allocated positions & Priorities Row */}
                <Row
                    gutter={[24, 24]}
                    className="mb-6 mt-6  flex items-stretch"
                >
                    <Col xs={24} md={12} className="flex">
                        <Card
                            className="rounded-2xl h-full shadow-sm border-none flex-1"
                            bodyStyle={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            title={
                                <div className="flex justify-between">
                                    <span>Allocated positions</span>
                                    <Button
                                        type="link"
                                        size="small"
                                        className="text-blue-500"
                                        onClick={() =>
                                            navigate(
                                                "/recruiter/postings/opened",
                                            )
                                        }
                                    >
                                        View all
                                    </Button>
                                </div>
                            }
                        >
                            <div className="space-y-4 flex-1">
                                {(
                                    dashboardStats?.allocated_positions || []
                                ).map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                icon={<UserOutlined />}
                                                style={{
                                                    backgroundColor: `${item.color}10`,
                                                    color: item.color,
                                                }}
                                                size="small"
                                            />
                                            <div>
                                                <div className="text-xs font-medium">
                                                    {item.name}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    @ {item.client}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-300">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} className="flex">
                        <Card
                            className="rounded-2xl h-full shadow-sm border-none flex-1"
                            bodyStyle={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                            title={
                                <div className="flex  justify-between">
                                    <span>Priorities</span>
                                    <Button
                                        type="link"
                                        size="small"
                                        className="text-blue-500"
                                        onClick={() =>
                                            navigate(
                                                "/recruiter/postings/opened",
                                            )
                                        }
                                    >
                                        View all
                                    </Button>
                                </div>
                            }
                        >
                            <div className="space-y-4 flex-1">
                                <div className="flex text-[10px] font-bold text-gray-400 border-b pb-1">
                                    <div className="w-1/3">Job Role</div>
                                    <div className="w-1/4">Client</div>
                                    <div className="w-1/4 text-center">
                                        Positions
                                    </div>
                                    <div className="flex-1 text-right">
                                        Tenure Date
                                    </div>
                                </div>
                                {(dashboardStats?.priorities || []).map(
                                    (row, i) => (
                                        <div
                                            key={i}
                                            className="flex text-xs border-b border-gray-50 pb-2 last:border-0"
                                        >
                                            <div className="w-1/3 font-bold truncate pr-2">
                                                {row.role}
                                            </div>
                                            <div className="w-1/4 text-gray-400 truncate pr-2">
                                                {row.client}
                                            </div>
                                            <div className="w-1/4 text-center">
                                                {row.pos}
                                            </div>
                                            <div className="flex-1 text-right text-orange-500 font-medium">
                                                {row.date}
                                            </div>
                                        </div>
                                    ),
                                )}
                                {(!dashboardStats?.priorities ||
                                    dashboardStats.priorities.length === 0) && (
                                    <div className="text-center py-4 text-gray-400 text-xs italic">
                                        No active priorities found
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Outcomes Delivered Section (Funnel Chart) */}
                <Title level={4} className="mb-4">
                    Outcomes Delivered
                </Title>
                <div className="flex flex-wrap gap-4 mb-4">
                    <Select
                        placeholder="All Jobs"
                        style={{ width: 150 }}
                        size="small"
                        allowClear
                        onChange={(val) => setSelectedClientForOutcomes(val)}
                    >
                        {assignedJobs.map((aj) => (
                            <Select.Option key={aj.job_id} value={aj.job_id}>
                                {aj.job_title}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue="All"
                        style={{ width: 120 }}
                        size="small"
                        onChange={(val) => setSelectedPeriodForOutcomes(val)}
                    >
                        <Select.Option value="Today">Today</Select.Option>
                        <Select.Option value="Week">Week</Select.Option>
                        <Select.Option value="Month">Month</Select.Option>
                        <Select.Option value="Year">Year</Select.Option>
                        <Select.Option value="All">All Time</Select.Option>
                    </Select>
                </div>

                <Card className="rounded-2xl shadow-sm border-none bg-white p-4">
                    {/* <div className="flex items-start mb-6">
                        <div className="p-2 bg-gray-50 rounded mr-3">
                            <BarChartOutlined className="text-gray-400" />
                        </div>
                        <div>
                            <div className="text-[20px]  text-gray-400">
                                Total {dashboardStats?.total_outcomes || 0}
                            </div>
                        </div>
                    </div> */}

                    <div className="flex overflow-x-auto w-full px-2 py-4 gap-x-0 pb-6">
                        {outcomesSteps.map((step, i) => (
                            <Tooltip
                                key={i}
                                title={`${step.label}: ${step.value}`}
                                color={step.color}
                                placement="top"
                                className="text-white"
                            >
                                <div className="relative flex-1 min-w-[100px] cursor-pointer transition-transform hover:scale-105 hover:z-20">
                                    <div
                                        className="h-20 relative flex items-center justify-center font-bold text-md shadow-sm"
                                        style={{
                                            backgroundColor: `${step.color}`, // 15% opacity tint
                                            color: step.color,
                                            clipPath:
                                                "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
                                            marginLeft: i === 0 ? "0" : "-10px",
                                        }}
                                    >
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-lg text-white">
                                                {step.value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                        ))}
                    </div>

                    {/* Legend for mobile screens */}
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
                        {outcomesSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: step.color }}
                                />
                                <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <style jsx>{`
                .custom-dashboard-table .ant-table-thead > tr > th {
                    background-color: transparent !important;
                    font-size: 11px;
                    color: #999;
                    font-weight: 500;
                    border-bottom: 1px solid #f0f0f0;
                }
                .custom-dashboard-table .ant-table-tbody > tr > td {
                    font-size: 11px;
                    padding: 12px 8px !important;
                }
            `}</style>
            <Modal
                title={null}
                open={isConcernModalOpen}
                onCancel={closeConcernModal}
                footer={null}
                centered
                styles={{
                    mask: {
                        backdropFilter: "blur(4px)",
                    },
                }}
                width={400}
            >
                <div className="text-center py-10">
                    <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-bounce">
                            <Rocket size={48} color="#1A73E8" fill="#E6F0FF" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Coming Soon!
                    </h3>
                    <p className="text-gray-500 mb-6">
                        We're building something cosmic. This feature will be
                        available in the next update.
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        onClick={closeConcernModal}
                        className="bg-blue-600 w-full rounded-lg h-12 font-semibold"
                    >
                        Awesome!
                    </Button>
                </div>
            </Modal>

            {/* Interview Detail Modal */}
            <Modal
                title={
                    <Title level={4} className="!m-0">
                        Interview Details
                    </Title>
                }
                open={isInterviewModalOpen}
                onCancel={() => setIsInterviewModalOpen(false)}
                footer={[
                    <Button
                        key="profile"
                        type="primary"
                        onClick={() => {
                            if (selectedInterview?.candidate_id) {
                                navigate(
                                    `/agency/view_candidate?candidate_id=${selectedInterview.candidate_id}`,
                                );
                            }
                        }}
                        disabled={!selectedInterview?.candidate_id}
                    >
                        View Profile
                    </Button>,
                    <Button
                        key="close"
                        onClick={() => setIsInterviewModalOpen(false)}
                    >
                        Close
                    </Button>,
                ]}
                centered
            >
                {selectedInterview && (
                    <div className="py-4">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
                            <Avatar
                                size={64}
                                icon={<UserOutlined />}
                                className="bg-blue-500"
                            />
                            <div>
                                <Title level={5} className="!mb-0">
                                    {selectedInterview.title}
                                </Title>
                                <Tag color="cyan" className="mt-1">
                                    {selectedInterview.job_title}
                                </Tag>
                            </div>
                        </div>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div className="flex flex-col gap-1">
                                    <Text type="secondary" size="small">
                                        Interview Time
                                    </Text>
                                    <Text strong>
                                        <ClockCircleFilled className="text-blue-500 mr-2" />{" "}
                                        {selectedInterview.from_time} -{" "}
                                        {selectedInterview.to_time}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="flex flex-col gap-1">
                                    <Text type="secondary" size="small">
                                        Interviewer
                                    </Text>
                                    <Text strong>
                                        <UserOutlined className="text-blue-500 mr-2" />{" "}
                                        {selectedInterview.interviewer_name}
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="flex flex-col gap-1">
                                    <Text type="secondary" size="small">
                                        Mode
                                    </Text>
                                    <Text strong>
                                        <Tag color="blue">
                                            {selectedInterview.mode
                                                ?.replace("_", " ")
                                                .toUpperCase()}
                                        </Tag>
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="flex flex-col gap-1">
                                    <Text type="secondary" size="small">
                                        Status
                                    </Text>
                                    <Text strong>
                                        <Badge
                                            status={
                                                selectedInterview.status ===
                                                "completed"
                                                    ? "success"
                                                    : "processing"
                                            }
                                            text={selectedInterview.status?.toUpperCase()}
                                        />
                                    </Text>
                                </div>
                            </Col>
                            {selectedInterview.meet_link &&
                                selectedInterview.meet_link !== "NA" && (
                                    <Col span={24}>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <Text type="secondary" size="small">
                                                Meeting Link
                                            </Text>
                                            <a
                                                href={
                                                    selectedInterview.meet_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline break-all overflow-hidden"
                                            >
                                                {selectedInterview.meet_link}
                                            </a>
                                        </div>
                                    </Col>
                                )}
                        </Row>
                    </div>
                )}
            </Modal>
        </Main>
    );
};

export default Recruiter;
