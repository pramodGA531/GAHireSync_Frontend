import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../common/useAuth";
import Main from "./Layout";
import { useNavigate } from "react-router-dom";
import { Modal, DatePicker, Select, Tooltip } from "antd";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    AlertCircle,
    Users,
    Plus,
    Calendar,
    FileText,
    CheckCircle,
    Briefcase,
    UserPlus,
    Rocket,
    Activity,
} from "lucide-react";

// ─── LEGEND ─────────────────────────────────────────────────────────────────

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

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

// ─── STATIC DATA (LEGACY/PLACEHOLDERS) ───────────────────────────────────────

const invoices = [
    {
        id: "INV-2049",
        company: "TechFlow",
        due: "12/02/2026",
        amount: "$4,500",
    },
    {
        id: "INV-2050",
        company: "DesignHub",
        due: "01/15/2026",
        amount: "$3,200",
    },
    {
        id: "INV-2051",
        company: "CodeCrafters",
        due: "01/28/2026",
        amount: "$5,900",
    },
    {
        id: "INV-2052",
        company: "DataSync",
        due: "03/10/2026",
        amount: "$2,750",
    },
    {
        id: "INV-2053",
        company: "MarketGenius",
        due: "04/22/2026",
        amount: "$6,300",
    },
];

const TIMELINE_HOURS = [
    "08:00",
    "",
    "09:00",
    "",
    "10:00",
    "",
    "11:00",
    "",
    "12:00",
    "",
    "13:00",
    "",
    "14:00",
    "",
    "15:00",
    "",
    "16:00",
    "",
    "17:00",
    "",
    "18:00",
    "",
    "19:00",
    "",
    "20:00",
    "",
    "21:00",
    "",
    "22:00",
    "",
];

const timelineEvents = [
    {
        left: "0%",
        top: "0px",
        w: "12%",
        title: "Online Intern HRM Int...",
        time: "10:30-11:40",
        avatars: 3,
    },
    {
        left: "22%",
        top: "0px",
        w: "14%",
        title: "Fresher UI/UX Interview",
        time: "11:00-11:40",
        avatars: 2,
    },
    {
        left: "13%",
        top: "46px",
        w: "15%",
        title: "Onboard Intern UI/UX De...",
        time: "12:00-13:00",
        avatars: 2,
    },
    {
        left: "0%",
        top: "92px",
        w: "11%",
        title: "Onboard...",
        time: "13:00-15:00",
        avatars: 2,
    },
    {
        left: "22%",
        top: "46px",
        w: "14%",
        title: "Fresher UI/UX...",
        time: "09:00-11:00",
        avatars: 2,
    },
    {
        left: "36%",
        top: "46px",
        w: "13%",
        title: "Fresher UI/UX...",
        time: "14:00-15:00",
        avatars: 2,
    },
    {
        left: "13%",
        top: "92px",
        w: "15%",
        title: "Onboard Intern UI/UX De...",
        time: "12:00-13:00",
        avatars: 3,
    },
];

// ─── AGENCIES DATA ────────────────────────────────────────────────────────────

const agencyStatsData = [
    {
        label: "Agencies connected",
        value: "20+",
        iconBg: "bg-blue-50",
        icon: <Users size={20} className="text-blue-500" />,
    },
    {
        label: "T&C Negotiations",
        value: "20",
        iconBg: "bg-pink-50",
        icon: <FileText size={20} className="text-pink-500" />,
    },
    {
        label: "JOB negations",
        value: "05",
        iconBg: "bg-green-50",
        icon: <Briefcase size={20} className="text-green-500" />,
    },
    {
        label: "Rejections",
        value: "01",
        iconBg: "bg-orange-50",
        icon: <AlertCircle size={20} className="text-orange-500" />,
    },
];

const negotiationCards = [
    {
        date: "02/02/2026",
        tag: "T & C Negotiation",
        bg: "bg-[#F9C74F]",
        textDark: "text-[#5C4400]",
        title: "UI/UX\nDesigner",
    },
    {
        date: "02/02/2026",
        tag: "Job Negotiation",
        bg: "bg-[#90E0EF]",
        textDark: "text-[#005F73]",
        title: "UI/UX\nDesigner",
    },
    {
        date: "02/02/2026",
        tag: "Job Negotiation",
        bg: "bg-[#C77DFF]",
        textDark: "text-[#3A0068]",
        title: "UI/UX\nDesigner",
    },
];

const jobStacksAgencies = [
    {
        id: 91822,
        role: "UI/UX Designer",
        agency: "MCO",
        pos: "02",
        deadline: "2025-04-16",
        turnaround: "2025-04-16 (3 Days)",
    },
    {
        id: 91823,
        role: "Product Manager",
        agency: "NYC",
        pos: "04",
        deadline: "2025-05-01",
        turnaround: "2025-05-01 (2 Days)",
    },
    {
        id: 91824,
        role: "Frontend Developer",
        agency: "LON",
        pos: "01",
        deadline: "2025-06-10",
        turnaround: "2025-06-10 (4 Days)",
    },
    {
        id: 91825,
        role: "Data Analyst",
        agency: "SFO",
        pos: "03",
        deadline: "2025-07-20",
        turnaround: "2025-07-20 (5 Days)",
    },
    {
        id: 91822,
        role: "UI/UX Designer",
        agency: "MCO",
        pos: "02",
        deadline: "2025-04-16",
        turnaround: "2025-04-16 (3 Days)",
    },
];

// ─── SMALL REUSABLE UI ────────────────────────────────────────────────────────

const AvatarStack = ({ count }) => {
    const colors = [
        "bg-blue-400",
        "bg-cyan-400",
        "bg-purple-400",
        "bg-yellow-400",
        "bg-green-400",
    ];
    const show = Math.min(count, 4);
    return (
        <div className="flex items-center mt-1">
            {Array.from({ length: show }).map((_, i) => (
                <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-white ${colors[i % colors.length]}`}
                    style={{ marginLeft: i === 0 ? 0 : -5, zIndex: show - i }}
                />
            ))}
        </div>
    );
};

const NotifDot = ({ type }) => {
    if (type === "check")
        return (
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-green-500" />
            </div>
        );
    if (type === "job")
        return (
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Briefcase size={14} className="text-blue-500" />
            </div>
        );
    if (type === "promote")
        return (
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <UserPlus size={14} className="text-purple-500" />
            </div>
        );
    return (
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Users size={14} className="text-gray-500" />
        </div>
    );
};

const NavBtn = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
    >
        {children}
    </button>
);

const LegendStrip = () => (
    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {legendItems.map((l, i) => (
            <div key={i} className="flex items-center gap-1">
                <span
                    className="w-2.5 h-2.5 rounded-sm inline-block shrink-0"
                    style={{ background: l.bg, border: `1px solid ${l.color}` }}
                />
                <span
                    className="text-[9px] font-medium"
                    style={{ color: l.color }}
                >
                    {l.label}
                </span>
            </div>
        ))}
    </div>
);

// ─── JOBS TAB ─────────────────────────────────────────────────────────────────

const JobsTab = ({
    dashboardData,
    selectedDate,
    setSelectedDate,
    orgsData,
    profileFilter,
    setProfileFilter,
    agencyOrgFilter,
    setAgencyOrgFilter,
    agencyRoleFilter,
    setAgencyRoleFilter,
    agencyMonthFilter,
    setAgencyMonthFilter,
}) => {
    const navigate = useNavigate();
    const stats = dashboardData?.data || {};
    const jobPosts = dashboardData?.job_posts || [];
    const todayInterviews = dashboardData?.today_interviews || [];

    const [invoiceTab, setInvoiceTab] = useState("New");
    const [tip, setTip] = useState({ show: false, label: "", x: 0, y: 0 });

    const funnelStats = dashboardData?.funnel_stats || [0, 0, 0, 0, 0, 0, 0, 0];
    const agencyFunnelStats = dashboardData?.agency_funnel_stats || [
        0, 0, 0, 0, 0, 0, 0, 0,
    ];
    const notifications = dashboardData?.notifications || [];

    const invoices =
        invoiceTab === "New"
            ? dashboardData?.new_invoices || []
            : dashboardData?.overdue_invoices || [];

    const negotiations = dashboardData?.under_negotiations_list || [];
    const [currentJobIndex, setCurrentJobIndex] = useState(0);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [currentTimePosition, setCurrentTimePosition] = useState(0);

    // Update current time position line every minute
    useEffect(() => {
        const updateTimePosition = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const timeInHours = h + m / 60;

            // If it's outside our 08:00 - 22:00 range, we can either hide it or clamp it.
            // We'll hide it by setting it to a value outside 0-100 or a specific state.
            if (timeInHours < 8 || timeInHours > 22) {
                setCurrentTimePosition(-1);
            } else {
                const percent = ((timeInHours - 8) / 14) * 100;
                setCurrentTimePosition(percent);
            }
        };

        updateTimePosition();
        const interval = setInterval(updateTimePosition, 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    const getTimelineStyle = (fromTime, toTime, index) => {
        const parseTime = (t) => {
            if (!t) return null;
            const parts = t.split(":");
            const h = parseInt(parts[0], 10);
            const m = parts.length > 1 ? parseInt(parts[1], 10) : 0;
            if (isNaN(h) || isNaN(m)) return null;
            return h + m / 60;
        };

        const start = parseTime(fromTime);
        let end = parseTime(toTime);

        if (start === null) return { display: "none" };
        if (end === null || end <= start) end = start + 1; // 1 hr default duration

        // TIMELINE_HOURS ranges from 08:00 to 22:00 (14 hours)
        // Adjust these calculation so each hour is 1/14th (approx 7.14%) wide
        // Adding a slight offset for alignment
        const leftPercent = ((start - 8) / 14) * 100;
        const widthPercent = ((end - start) / 14) * 100;

        return {
            left: `${Math.max(0, leftPercent)}%`,
            width: `${Math.max(5, widthPercent)}%`,
            top: `${(index % 3) * 46}px`,
            cursor: "pointer",
        };
    };

    const handleNextJobs = () => {
        if (jobPosts.length <= 3) return;
        setCurrentJobIndex((prev) => (prev + 3) % jobPosts.length);
    };

    const handlePrevJobs = () => {
        if (jobPosts.length <= 3) return;
        setCurrentJobIndex(
            (prev) => (prev - 3 + jobPosts.length) % jobPosts.length,
        );
    };

    const visibleJobs = jobPosts.slice(currentJobIndex, currentJobIndex + 3);
    // If we have fewer than 3 and it's near the end, wrap around to get exactly 3 if possible
    if (visibleJobs.length < 3 && jobPosts.length >= 3) {
        visibleJobs.push(...jobPosts.slice(0, 3 - visibleJobs.length));
    }

    const jobColors = [
        { bg: "bg-[#F9C74F]", textDark: "text-[#5C4400]" },
        { bg: "bg-[#90E0EF]", textDark: "text-[#005F73]" },
        { bg: "bg-[#C77DFF]", textDark: "text-[#3A0068]" },
    ];

    const onEnter = (e, label) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTip({ show: true, label, x: r.left + r.width / 2, y: r.top - 10 });
    };
    const onLeave = () => setTip((p) => ({ ...p, show: false }));

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* ── ROW 0: 4 Key Stats ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        {
                            label: "Resumes Received",
                            value: stats.resumes_received || 0,
                            icon: (
                                <FileText size={20} className="text-blue-500" />
                            ),
                            bg: "bg-blue-50",
                        },
                        {
                            label: "On processing",
                            value: stats.on_process || 0,
                            icon: (
                                <Activity
                                    size={20}
                                    className="text-purple-500"
                                />
                            ),
                            bg: "bg-purple-50",
                        },
                        {
                            label: "No of Roles",
                            value: stats.no_of_roles || 0,
                            icon: (
                                <Briefcase
                                    size={20}
                                    className="text-green-500"
                                />
                            ),
                            bg: "bg-green-50",
                        },
                        {
                            label: "Completed Jobs",
                            value: stats.completed_jobs || 0,
                            icon: (
                                <Rocket size={20} className="text-orange-500" />
                            ),
                            bg: "bg-orange-50",
                        },
                        {
                            label: "Closed (Hired)",
                            value: stats.closed || 0,
                            icon: (
                                <CheckCircle
                                    size={20}
                                    className="text-teal-500"
                                />
                            ),
                            bg: "bg-teal-50",
                        },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start"
                        >
                            <div>
                                <p className="text-[12px] text-gray-500 mb-2">
                                    {s.label}
                                </p>
                                <p className="text-[32px] font-black text-gray-900 leading-none">
                                    {String(s.value).padStart(2, "0")}
                                </p>
                            </div>
                            <div
                                className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}
                            >
                                {s.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── ROW 1: Active Jobs | Profile Stacks | Payment cards ── */}
                <div className="flex flex-col xl:flex-row gap-4 items-stretch">
                    {/* Active Job Posts */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 w-full xl:w-[531px] xl:shrink-0">
                        <div className="flex items-center justify-between mb-3 ">
                            <span className="font-bold text-[14px] text-gray-900">
                                Active Job Posts{" "}
                                <span className="text-blue-500">
                                    (
                                    {String(stats.no_of_roles || 0).padStart(
                                        2,
                                        "0",
                                    )}
                                    )
                                </span>
                            </span>
                            <div className="flex gap-1.5">
                                <NavBtn onClick={handlePrevJobs}>
                                    <ChevronLeft size={14} />
                                </NavBtn>
                                <NavBtn onClick={handleNextJobs}>
                                    <ChevronRight size={14} />
                                </NavBtn>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 ">
                            {visibleJobs.map((job, i) => (
                                <div
                                    key={i}
                                    className={`${jobColors[(currentJobIndex + i) % jobColors.length].bg} rounded-xl p-3 flex flex-col justify-between min-h-[100px] transition-all duration-300`}
                                >
                                    <div>
                                        <span
                                            className={`text-[9px] font-semibold ${jobColors[(currentJobIndex + i) % jobColors.length].textDark} bg-white/40 rounded-full px-2 py-0.5 inline-block mb-2`}
                                        >
                                            {job.posted}
                                        </span>
                                        <p
                                            className={`text-[12px] font-extrabold ${jobColors[(currentJobIndex + i) % jobColors.length].textDark} leading-tight`}
                                        >
                                            {job.job_title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profile Stacks + Right Stats */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Job post profile stacks */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1 ">
                            <div className="flex items-center justify-between mb-3 ">
                                <span className="font-bold text-[14px] text-gray-900">
                                    Job post profile stacks.
                                </span>
                                <Select
                                    value={profileFilter}
                                    onChange={(v) => setProfileFilter(v)}
                                    className="text-[11px]"
                                    style={{ width: 140 }}
                                    variant="borderless"
                                    options={[
                                        {
                                            value: "last_7_days",
                                            label: "Last 7 days",
                                        },
                                        {
                                            value: "last_30_days",
                                            label: "Last 30 days",
                                        },
                                        {
                                            value: "last_3_months",
                                            label: "Last 3 months",
                                        },
                                    ]}
                                    popupMatchSelectWidth={false}
                                    suffixIcon={<ChevronDown size={11} />}
                                />
                            </div>
                            <LegendStrip />
                            <div className="grid grid-cols-4 gap-2">
                                {legendItems.map((leg, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="rounded-xl flex items-center justify-center text-lg font-bold cursor-default"
                                            style={{
                                                height: 76,
                                                // width:96,
                                                background: leg.bg,
                                                color: leg.color,
                                                border: `1.5px solid ${leg.color}`,
                                            }}
                                            onMouseEnter={(e) =>
                                                onEnter(e, leg.label)
                                            }
                                            onMouseLeave={onLeave}
                                        >
                                            {String(
                                                funnelStats[i] || 0,
                                            ).padStart(2, "0")}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right stats */}
                        <div className="flex sm:flex-col flex-row gap-3 sm:w-[152px] w-full">
                            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3.5 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-gray-500 mb-1">
                                        Payment Overdue
                                    </p>
                                    <p className="text-[26px] font-black text-gray-900 leading-none">
                                        {String(
                                            stats.payment_overdue_count || 0,
                                        ).padStart(2, "0")}
                                    </p>
                                    <p className="text-[9px] text-red-500 mt-1.5">
                                        +{stats.payment_overdue_amount || 0}{" "}
                                        need to clear
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                    <AlertCircle
                                        size={16}
                                        className="text-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3.5 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-gray-500 mb-1">
                                        Selected
                                    </p>
                                    <p className="text-[26px] font-black text-gray-900 leading-none">
                                        {String(stats.selected || 0).padStart(
                                            2,
                                            "0",
                                        )}
                                    </p>
                                    <p className="text-[9px] text-blue-500 mt-1.5">
                                        Ready to Hire
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <CheckCircle
                                        size={16}
                                        className="text-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3.5 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-gray-500 mb-1">
                                        Positions Filled
                                    </p>
                                    <p className="text-[26px] font-black text-gray-900 leading-none">
                                        {String(stats.closed || 0).padStart(
                                            2,
                                            "0",
                                        )}
                                    </p>
                                    <p className="text-[9px] text-gray-400 mt-1.5">
                                        {stats.no_of_roles || 0} Open Roles
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                    <Users
                                        size={16}
                                        className="text-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROW 2: Interviews Timeline ── */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[14px] text-gray-900">
                            Interviews
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-[12px] text-blue-500 font-semibold cursor-pointer">
                                View All
                            </span>
                            <DatePicker
                                picker="date"
                                className="text-[11px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1"
                                variant="borderless"
                                suffixIcon={<Calendar size={11} />}
                                value={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                }}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: 800 }}>
                            <div className="flex border-b border-gray-100 pb-2 mb-1">
                                {TIMELINE_HOURS.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 text-[8px] text-gray-400 text-center"
                                        style={{ minWidth: 28 }}
                                    >
                                        {h}
                                    </div>
                                ))}
                            </div>
                            <div className="relative" style={{ height: 145 }}>
                                {currentTimePosition >= 0 && (
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
                                        style={{
                                            left: `${currentTimePosition}%`,
                                        }}
                                    >
                                        <div className="absolute top-0 -left-1 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
                                    </div>
                                )}
                                {todayInterviews.length > 0 ? (
                                    todayInterviews.map((ev, i) => (
                                        <div
                                            key={i}
                                            onClick={() =>
                                                setSelectedInterview(ev)
                                            }
                                            className="absolute bg-blue-50 border border-blue-200 border-l-2 border-l-blue-500 rounded-md px-2 py-1.5 hover:bg-blue-100 transition-colors"
                                            style={getTimelineStyle(
                                                ev.from_time,
                                                ev.to_time,
                                                i,
                                            )}
                                        >
                                            <p className="text-[9px] font-semibold text-gray-800 truncate">
                                                {ev.job_title}
                                            </p>
                                            <p className="text-[8px] text-gray-400 mb-1">
                                                {ev.candidate_name}
                                            </p>
                                            <p className="text-[8px] text-blue-500 font-bold">
                                                {ev.from_time}{" "}
                                                {ev.to_time
                                                    ? `- ${ev.to_time}`
                                                    : ""}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">
                                        No interviews scheduled for today
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROW 3: Invoices + Notifications ── */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-[14px] text-gray-900">
                                Today invoices
                            </span>
                            <span
                                className="text-[12px] text-blue-500 font-semibold cursor-pointer"
                                onClick={() => navigate("/client/invoices")}
                            >
                                View all
                            </span>
                        </div>
                        <div className="flex gap-2 mb-4">
                            {["New", "Over dues"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setInvoiceTab(t)}
                                    className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${invoiceTab === t ? "bg-blue-500 text-white" : "bg-white text-gray-500 border border-gray-300"}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        {invoices.length > 0 ? (
                            invoices.map((inv, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                            <span className="text-[12px] font-bold text-gray-900">
                                                {inv.id}
                                            </span>
                                            <span className="text-[12px] text-gray-500">
                                                {inv.company}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5 ml-3.5">
                                            Due Date : {inv.due}
                                        </p>
                                    </div>
                                    <span className="text-[13px] font-bold text-teal-500">
                                        {inv.amount}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 text-xs italic">
                                No {invoiceTab === "New" ? "new" : "overdue"}{" "}
                                invoices
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-[14px] text-gray-900">
                                Progress Notifications
                            </span>
                            <span
                                className="text-[12px] text-blue-500 font-semibold cursor-pointer"
                                onClick={() => navigate("/notifications")}
                            >
                                View all
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {notifications.length > 0 ? (
                                notifications.map((n, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                                    >
                                        <NotifDot type={n.icon} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold text-gray-800 leading-snug">
                                                {n.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                                {n.sub}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 shrink-0">
                                            {n.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400 text-xs italic">
                                    No new notifications
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── ROW 4: Latest Job Stacks Table ── */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-[15px] text-gray-900">
                            Latest Job Stacks
                        </span>
                        <span className="text-[12px] text-blue-500 font-semibold cursor-pointer">
                            View all
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table
                            className="w-full border-collapse"
                            style={{ minWidth: 520 }}
                        >
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {[
                                        "Job id",
                                        "Job Role",
                                        "Agency",
                                        "Positions",
                                        "Closer time line",
                                        "Summary",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left text-[11px] text-gray-400 font-semibold pb-3 pr-4"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {jobPosts.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-50 last:border-0"
                                    >
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.id}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] font-bold text-gray-900">
                                            {r.job_title}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.agency || "-"}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.num_of_postings || 0}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] font-semibold text-blue-500">
                                            {r.posted}
                                        </td>
                                        <td className="py-3">
                                            <button
                                                className="text-[10px] text-gray-500 border border-gray-200 rounded-md px-3 py-1 bg-white hover:bg-gray-50"
                                                onClick={() =>
                                                    navigate(
                                                        `/client/complete_job_post/${r.id}`,
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── ROW 5: Agency Outcomes ── */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="font-bold text-[15px] text-gray-900">
                            Agency Outcomes
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <Select
                                value={agencyOrgFilter}
                                onChange={(v) => setAgencyOrgFilter(v)}
                                className="text-[11px]"
                                style={{ width: 140 }}
                                variant="borderless"
                                options={[
                                    {
                                        value: "all_agencies",
                                        label: "All Agencies",
                                    },
                                    ...(orgsData || []).map((org) => ({
                                        value: String(org.organization_id),
                                        label: org.organization,
                                    })),
                                ]}
                                suffixIcon={<ChevronDown size={11} />}
                            />
                            <Select
                                value={agencyRoleFilter}
                                onChange={(v) => setAgencyRoleFilter(v)}
                                className="text-[11px]"
                                style={{ width: 250 }}
                                variant="borderless"
                                options={[
                                    {
                                        value: "all_roles",
                                        label: "All Job roles",
                                    },
                                    ...(jobPosts || []).map((job) => ({
                                        value: String(job.id),
                                        label: job.job_title,
                                    })),
                                ]}
                                suffixIcon={<ChevronDown size={11} />}
                            />
                            <Select
                                value={agencyMonthFilter}
                                onChange={(v) => setAgencyMonthFilter(v)}
                                className="text-[11px]"
                                style={{ width: 150 }}
                                variant="borderless"
                                options={[
                                    {
                                        value: "this_month",
                                        label: "This Month",
                                    },
                                    {
                                        value: "last_month",
                                        label: "Last Month",
                                    },
                                    {
                                        value: "last_3_months",
                                        label: "Last 3 Months",
                                    },
                                ]}
                                suffixIcon={<ChevronDown size={11} />}
                            />
                        </div>
                    </div>
                    <LegendStrip />
                    <div className="flex overflow-x-auto w-full px-2 py-4 gap-x-0 pb-6">
                        {legendItems.map((step, i) => (
                            <Tooltip
                                key={i}
                                title={`${step.label}: ${agencyFunnelStats[i] || 0}`}
                                color={step.color}
                                placement="top"
                            >
                                <div className="relative flex-1 min-w-[120px] cursor-pointer transition-transform hover:scale-105 hover:z-20">
                                    <div
                                        className="h-20 relative flex items-center justify-center font-bold text-md shadow-sm"
                                        style={{
                                            backgroundColor: `${step.color}`,
                                            color: "white",
                                            clipPath:
                                                "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
                                            marginLeft: i === 0 ? "0" : "-10px",
                                        }}
                                    >
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-lg">
                                                {agencyFunnelStats[i] || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FLOATING TOOLTIP ── */}
            {tip.show && (
                <div
                    className="fixed pointer-events-none z-[99999]"
                    style={{
                        left: tip.x,
                        top: tip.y,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap">
                        {tip.label}
                    </div>
                    <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 mx-auto -mt-1.5 rounded-sm" />
                </div>
            )}

            <Modal
                title="Interview Details"
                open={!!selectedInterview}
                onCancel={() => setSelectedInterview(null)}
                footer={null}
            >
                {selectedInterview && (
                    <div className="space-y-4 pt-2">
                        <div>
                            <p className="text-sm text-gray-500">
                                Candidate Name
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                                {selectedInterview.candidate_name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Job Title</p>
                            <p className="text-md font-semibold text-gray-800">
                                {selectedInterview.job_title}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">
                                    Interviewer
                                </p>
                                <p className="text-md text-gray-800">
                                    {selectedInterview.interviewer_name}
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Round</p>
                                <p className="text-md text-gray-800">
                                    Round {selectedInterview.round}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="text-md text-blue-600 font-semibold">
                                    {selectedInterview.from_time}{" "}
                                    {selectedInterview.to_time
                                        ? `- ${selectedInterview.to_time}`
                                        : ""}
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="text-md capitalize text-gray-800">
                                    {selectedInterview.status || "Scheduled"}
                                </p>
                            </div>
                        </div>
                        {selectedInterview.meet_link && (
                            <div className="pt-2">
                                <p className="text-sm text-gray-500 mb-1">
                                    Meeting Link
                                </p>
                                <a
                                    href={selectedInterview.meet_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 hover:text-blue-700 underline text-sm break-all"
                                >
                                    {selectedInterview.meet_link}
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </>
    );
};

// ─── AGENCIES TAB ─────────────────────────────────────────────────────────────

const AgenciesTab = ({ orgsData, dashboardData }) => {
    const navigate = useNavigate();
    const agenciesCount = orgsData?.length || 0;
    const stats = dashboardData?.data || {};

    // Partially dynamic stats
    const negotiations = dashboardData?.under_negotiations_list || [];

    const [currentNegIndex, setCurrentNegIndex] = useState(0);

    const handleNextNeg = () => {
        if (negotiations.length <= 3) return;
        setCurrentNegIndex((prev) => (prev + 3) % negotiations.length);
    };

    const handlePrevNeg = () => {
        if (negotiations.length <= 3) return;
        setCurrentNegIndex(
            (prev) => (prev - 3 + negotiations.length) % negotiations.length,
        );
    };

    const visibleNegs = negotiations.slice(
        currentNegIndex,
        currentNegIndex + 3,
    );
    if (visibleNegs.length < 3 && negotiations.length >= 3) {
        visibleNegs.push(...negotiations.slice(0, 3 - visibleNegs.length));
    }

    const jobColors = [
        { bg: "bg-[#F9C74F]", textDark: "text-[#5C4400]" },
        { bg: "bg-[#90E0EF]", textDark: "text-[#005F73]" },
        { bg: "bg-[#C77DFF]", textDark: "text-[#3A0068]" },
    ];
    const agencyStats = [
        {
            label: "Agencies connected",
            value: String(agenciesCount).padStart(2, "0"),
            iconBg: "bg-blue-50",
            icon: <Users size={20} className="text-blue-500" />,
        },
        {
            label: "T&C Negotiations",
            value: "00", // Need a separate logic/count for T&C
            iconBg: "bg-pink-50",
            icon: <FileText size={20} className="text-pink-500" />,
        },
        {
            label: "JOB negations",
            value: String(stats.under_negotiation || 0).padStart(2, "0"),
            iconBg: "bg-green-50",
            icon: <Briefcase size={20} className="text-green-500" />,
        },
        {
            label: "Rejections",
            value: "00",
            iconBg: "bg-orange-50",
            icon: <AlertCircle size={20} className="text-orange-500" />,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* ── ROW 1: 4 Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {agencyStats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start"
                    >
                        <div>
                            <p className="text-[12px] text-gray-500 mb-2">
                                {s.label}
                            </p>
                            <p className="text-[32px] font-black text-gray-900 leading-none">
                                {s.value}
                            </p>
                        </div>
                        <div
                            className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center shrink-0`}
                        >
                            {s.icon}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Concerns Acknowledgements — Coming Soon */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 w-full lg:w-[420px] lg:shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[14px] text-gray-900">
                            Concerns Acknowledgements
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3 py-10">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                            <Rocket size={28} className="text-blue-500" />
                        </div>
                        <p className="text-[15px] font-extrabold text-gray-800">
                            Coming Soon!
                        </p>
                        <p className="text-[12px] text-gray-400 text-center leading-relaxed">
                            The{" "}
                            <span className="font-semibold text-blue-500">
                                Concerns Acknowledgements
                            </span>
                            <br />
                            feature is currently under development.
                        </p>
                    </div>
                </div>

                {/* Job posts under negotiations */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[14px] text-gray-900">
                            Job posts under negotiations{" "}
                            <span className="text-blue-500">
                                (
                                {String(stats.under_negotiation || 0).padStart(
                                    2,
                                    "0",
                                )}
                                )
                            </span>
                        </span>
                        <div className="flex gap-1.5">
                            <NavBtn onClick={handlePrevNeg}>
                                <ChevronLeft size={14} />
                            </NavBtn>
                            <NavBtn onClick={handleNextNeg}>
                                <ChevronRight size={14} />
                            </NavBtn>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visibleNegs.length > 0 ? (
                            visibleNegs.map((card, i) => {
                                const cIdx =
                                    (currentNegIndex + i) % jobColors.length;
                                return (
                                    <div
                                        key={i}
                                        className={`flex flex-col ${jobColors[cIdx].bg} rounded-xl p-4 min-h-[160px]`}
                                    >
                                        <div className="flex items-start justify-between mb-3 gap-1">
                                            <span
                                                className={`text-[9px] font-semibold ${jobColors[cIdx].textDark} bg-white/40 rounded-full px-2 py-0.5 inline-block`}
                                            >
                                                {card.date}
                                            </span>
                                            <span
                                                className={`text-[9px] font-semibold ${jobColors[cIdx].textDark} bg-white/40 rounded-full px-2 py-0.5 inline-block text-right`}
                                            >
                                                {card.status}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-[20px] font-extrabold ${jobColors[cIdx].textDark} leading-tight whitespace-pre-line mb-2`}
                                        >
                                            {card.job_title}
                                        </p>
                                        <p
                                            className={`text-[10px] ${jobColors[cIdx].textDark} opacity-70 leading-relaxed`}
                                        >
                                            Negotiation is in progress for this
                                            job post.
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex-1 flex items-center justify-center py-10 text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No job posts under negotiations
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── ROW 3: Latest Job Stacks (Agencies) ── */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[15px] text-gray-900">
                        Organizations
                    </span>
                    <span
                        className="text-[12px] text-blue-500 font-semibold cursor-pointer"
                        onClick={() => navigate("/client/organizations")}
                    >
                        View all
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table
                        className="w-full border-collapse"
                        style={{ minWidth: 600 }}
                    >
                        <thead>
                            <tr className="border-b border-gray-100">
                                {[
                                    "Job id",
                                    "Job Role",
                                    "Agency",
                                    "Positions",
                                    "Status",
                                    // "Turn around time",
                                    "Summary",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left text-[11px] text-gray-400 font-semibold pb-3 pr-4"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orgsData.length > 0 ? (
                                orgsData.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-50 last:border-0"
                                    >
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.organization_id}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] font-bold text-gray-900">
                                            {r.organization}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.manager}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] text-gray-500">
                                            {r.num_of_postings || 0}
                                        </td>
                                        <td className="py-3 pr-4 text-[12px] font-semibold text-blue-500">
                                            {r.approval_status}
                                        </td>
                                        {/* <td className="py-3 pr-4 text-[12px] font-semibold text-blue-500">
                                            -
                                        </td> */}
                                        <td className="py-3">
                                            <button
                                                className="text-[10px] text-gray-500 border border-gray-200 rounded-md px-3 py-1 bg-white hover:bg-gray-50"
                                                onClick={() =>
                                                    navigate(
                                                        `/client/organizations/${r.organization_id}`,
                                                    )
                                                }
                                            >
                                                View Summary
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="py-10 text-center text-gray-400 text-sm italic"
                                    >
                                        No connected agencies found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── MAIN CLIENT COMPONENT ────────────────────────────────────────────────────

const Client = () => {
    const navigate = useNavigate();
    const { token, apiurl, userData } = useAuth();
    const [activeTab, setActiveTab] = useState("Jobs");
    const [concernModal, setConcernModal] = useState(false);

    const [dashboardData, setDashboardData] = useState(null);
    const [orgsData, setOrgsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const [profileFilter, setProfileFilter] = useState("last_30_days");
    const [agencyOrgFilter, setAgencyOrgFilter] = useState("all_agencies");
    const [agencyRoleFilter, setAgencyRoleFilter] = useState("all_roles");
    const [agencyMonthFilter, setAgencyMonthFilter] = useState("this_month");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (selectedDate)
                    queryParams.append(
                        "date",
                        selectedDate.format("YYYY-MM-DD"),
                    );

                queryParams.append("profile_filter", profileFilter);
                queryParams.append("agency_org", agencyOrgFilter);
                queryParams.append("agency_role", agencyRoleFilter);
                queryParams.append("agency_month", agencyMonthFilter);

                const response = await axios.get(
                    `${apiurl}/client/dashboard/?${queryParams.toString()}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setDashboardData(response.data);
            } catch (err) {
                console.error("Dashboard error:", err);
            }
        };

        const fetchOrgs = async () => {
            try {
                const response = await axios.get(
                    `${apiurl}/client/connected-organizations/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                setOrgsData(response.data.data);
            } catch (err) {
                console.error("Orgs error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchDashboard();
            fetchOrgs();
        }
    }, [
        token,
        apiurl,
        selectedDate,
        profileFilter,
        agencyOrgFilter,
        agencyRoleFilter,
        agencyMonthFilter,
    ]);

    if (isLoading) {
        return (
            <Main defaultSelectedKey="1" defaultSelectedChildKey="">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Main>
        );
    }

    return (
        <>
            <Main defaultSelectedKey="1" defaultSelectedChildKey="">
                <div className="p-3 sm:p-5 bg-gray-50 min-h-screen font-sans">
                    {/* ── HEADER ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <h1 className="text-[20px] sm:text-[22px] font-extrabold text-gray-900">
                                Welcome back, {userData?.username || "Client"}{" "}
                                👋
                            </h1>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Let's find ways to scale and achieve greater
                                success.
                            </p>
                        </div>
                        <div className="flex gap-2.5 items-center flex-wrap">
                            <button
                                onClick={() => setConcernModal(true)}
                                className="px-4 py-2 rounded-lg border border-blue-400 text-blue-500 text-[13px] font-semibold bg-white hover:bg-blue-50 transition-colors"
                            >
                                Rise Concern
                            </button>
                            <button
                                onClick={() => navigate("/client/postjob")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 text-white text-[13px] font-semibold hover:bg-blue-600 transition-colors"
                            >
                                <Plus size={14} /> New Job Post
                            </button>
                        </div>
                    </div>

                    {/* ── TAB SWITCHER ── */}
                    <div className="flex bg-gray-100 rounded-full p-1 w-fit border border-gray-200 mb-5">
                        {["Jobs", "Agencies"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 sm:px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                                    activeTab === tab
                                        ? "bg-blue-500 text-white shadow"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── TAB CONTENT ── */}
                    {activeTab === "Jobs" ? (
                        <JobsTab
                            dashboardData={dashboardData}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            orgsData={orgsData}
                            profileFilter={profileFilter}
                            setProfileFilter={setProfileFilter}
                            agencyOrgFilter={agencyOrgFilter}
                            setAgencyOrgFilter={setAgencyOrgFilter}
                            agencyRoleFilter={agencyRoleFilter}
                            setAgencyRoleFilter={setAgencyRoleFilter}
                            agencyMonthFilter={agencyMonthFilter}
                            setAgencyMonthFilter={setAgencyMonthFilter}
                        />
                    ) : (
                        <AgenciesTab
                            orgsData={orgsData}
                            dashboardData={dashboardData}
                        />
                    )}
                </div>
            </Main>

            {/* ── COMING SOON MODAL (Rise Concern) ── */}
            <Modal
                open={concernModal}
                onCancel={() => setConcernModal(false)}
                footer={null}
                centered
                width={360}
            >
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <Rocket size={32} className="text-blue-500" />
                    </div>
                    <h2 className="text-[20px] font-extrabold text-gray-900 m-0">
                        Coming Soon!
                    </h2>
                    <p className="text-[13px] text-gray-400 text-center leading-relaxed m-0">
                        The{" "}
                        <span className="font-semibold text-blue-500">
                            Rise a Concern
                        </span>{" "}
                        feature is
                        <br />
                        currently under development.
                    </p>
                    <button
                        onClick={() => setConcernModal(false)}
                        className="mt-2 px-6 py-2 rounded-lg bg-blue-500 text-white text-[13px] font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Got it
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Client;
