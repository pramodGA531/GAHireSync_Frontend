import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Button,
    Modal,
    Input,
    Tag,
    Tooltip,
    Progress,
    Popconfirm,
    Popover,
    Divider,
    Badge,
    Menu,
    Select,
} from "antd";
import CustomDatePicker from "../../../common/CustomDatePicker";
import AppTable from "../../../common/AppTable";
import Pageloading from "../../../common/loading/Pageloading";
import { format as formatDate } from "date-fns";
import dayjs from "dayjs";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CommentOutlined,
    CalendarOutlined,
    StarOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
    TeamOutlined,
} from "@ant-design/icons";

/* ─────────────────────────────────────────────
   Helper: Skill ratings renderer  (used in feedback popup)
─────────────────────────────────────────────── */
const SkillRatings = ({ raw }) => {
    if (!raw) return <span className="text-gray-400 italic text-xs">N/A</span>;

    // Normalise Python-style single-quote dicts → valid JSON
    let normalised = raw;
    if (typeof raw === "string") {
        normalised = raw
            .replace(/'/g, '"')
            .replace(/True/g, "true")
            .replace(/False/g, "false")
            .replace(/None/g, "null");
    }

    try {
        const parsed =
            typeof normalised === "string"
                ? JSON.parse(normalised)
                : normalised;

        // ── Array format: [{skill_name, rating}, …] ──
        if (Array.isArray(parsed)) {
            return (
                <div className="space-y-2">
                    {parsed.map((s, i) => {
                        const score = s.rating ?? s.score ?? s.value ?? 0;
                        const max = score > 10 ? 100 : 10;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-600 w-28 truncate">
                                    {s.skill_name || s.name || `Skill ${i + 1}`}
                                </span>
                                <Progress
                                    percent={Math.round((score / max) * 100)}
                                    size="small"
                                    strokeColor="#6366f1"
                                    className="flex-1 m-0"
                                    showInfo={false}
                                />
                                <span className="text-xs font-bold text-indigo-600 w-12 text-right">
                                    {score}/{max}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // ── Object / dict format: {"Python": 5, "SQL": 5, …} ──
        if (parsed && typeof parsed === "object") {
            return (
                <div className="space-y-2">
                    {Object.entries(parsed).map(([skill, score], i) => {
                        const max = Number(score) > 10 ? 100 : 10;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-gray-600 w-28 truncate">
                                    {skill}
                                </span>
                                <Progress
                                    percent={Math.round(
                                        (Number(score) / max) * 100,
                                    )}
                                    size="small"
                                    strokeColor="#6366f1"
                                    className="flex-1 m-0"
                                    showInfo={false}
                                />
                                <span className="text-xs font-bold text-indigo-600 w-12 text-right">
                                    {score}/{max}
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <span className="text-xs text-gray-400 italic">N/A</span>;
    } catch {
        return <span className="text-xs text-gray-500">{String(raw)}</span>;
    }
};

/* ─────────────────────────────────────────────
   Helper: Feedback Popup content
─────────────────────────────────────────────── */
const FeedbackPopoverContent = ({ feedback, candidateName }) => {
    if (!feedback)
        return (
            <span className="text-gray-400 italic text-xs">
                No feedback yet
            </span>
        );
    const statusColor =
        feedback.status === "selected"
            ? "success"
            : feedback.status === "rejected"
              ? "error"
              : feedback.status === "hold"
                ? "warning"
                : "default";
    return (
        <div className="flex flex-col gap-3" style={{ width: 340 }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-black text-sm text-[#071C50] m-0">
                        {candidateName}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest m-0">
                        Round {feedback.round_num}
                    </p>
                </div>
                <Tag
                    color={statusColor}
                    className="text-[10px] font-black uppercase"
                >
                    {feedback.status}
                </Tag>
            </div>
            <Divider className="m-0" />

            {/* Score — only shown when a real score exists */}
            {feedback.score > 0 && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <StarOutlined className="text-amber-500 text-base" />
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest m-0">
                            Overall Score
                        </p>
                        <p className="text-2xl font-black text-[#071C50] m-0 leading-tight">
                            {feedback.score}
                            <span className="text-sm text-gray-400 font-bold">
                                /100
                            </span>
                        </p>
                    </div>
                    <Progress
                        type="circle"
                        percent={feedback.score}
                        size={48}
                        strokeColor="#6366f1"
                        format={(p) => (
                            <span className="text-[10px] font-black text-indigo-600">
                                {p}
                            </span>
                        )}
                    />
                </div>
            )}

            {/* Remarks */}
            {feedback.remarks && (
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Remarks
                    </p>
                    <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 m-0">
                        {feedback.remarks}
                    </p>
                </div>
            )}
            {feedback.comments && (
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Comments
                    </p>
                    <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 m-0">
                        {feedback.comments}
                    </p>
                </div>
            )}

            {/* Skill Ratings */}
            {feedback.primary_skills_rating && (
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Primary Skills
                    </p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <SkillRatings raw={feedback.primary_skills_rating} />
                    </div>
                </div>
            )}
            {feedback.secondary_skills_rating && (
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Secondary Skills
                    </p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <SkillRatings raw={feedback.secondary_skills_rating} />
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   Helper: Status tag colour map
─────────────────────────────────────────────── */
const profileStatusColor = {
    selected: "#1681FF",
    shortlisted: "#7c3aed",
    rejected: "#ef4444",
    processing: "#f59e0b",
    joined: "#10b981",
};

const profileStatusLabel = {
    selected: "Selected",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    processing: "In Review",
    joined: "Joined ✓",
};

/* ─────────────────────────────────────────────
   CandidateCard  – one card per suggested profile
─────────────────────────────────────────────── */
const CandidateCard = ({
    profile,
    replacementId,
    locationId,
    anySelected, // true if ANY profile in this row is selected/joined
    onShortlist,
    onOpenSelect,
    onReject,
    onOpenJoiningDate,
    onMarkJoined,
    onViewProfile,
    minimal = false,
}) => {
    const p = profile;
    const isSelected = p.status === "selected" || p.joining_status;
    const isJoined = p.joining_status === "joined";
    const isPending = p.joining_status === "pending";
    const showActions = !anySelected; // hide all action buttons once any candidate is selected

    if (minimal) {
        return (
            <div className="flex items-center gap-2">
                {/* Feedback Popover */}
                {p.interview_feedback ? (
                    <Popover
                        trigger="click"
                        placement="top"
                        content={
                            <FeedbackPopoverContent
                                feedback={p.interview_feedback}
                                candidateName={p.candidate_name}
                            />
                        }
                        overlayStyle={{ zIndex: 1050 }}
                        overlayInnerStyle={{ borderRadius: 20, padding: 16 }}
                    >
                        <Button
                            size="small"
                            icon={<CommentOutlined />}
                            className="text-[10px] font-black border-indigo-200 text-indigo-600 hover:border-indigo-500 rounded-xl px-2"
                        >
                            Feedback
                        </Button>
                    </Popover>
                ) : (
                    <span className="text-[10px] text-gray-300 italic border px-2 py-0.5 rounded-xl">
                        No feedback
                    </span>
                )}

                {/* Main Actions */}
                <div className="flex items-center gap-1.5">
                    {showActions && (
                        <>
                            {!p.interview_feedback &&
                                p.status === "processing" && (
                                    <Button
                                        size="small"
                                        icon={<StarOutlined />}
                                        className="text-[10px] font-black rounded-xl border-purple-300 text-purple-700 hover:border-purple-500"
                                        onClick={() =>
                                            onShortlist(
                                                replacementId,
                                                p.application_id,
                                            )
                                        }
                                    >
                                        Shortlist
                                    </Button>
                                )}
                            {(p.interview_feedback ||
                                p.status === "processing" ||
                                p.status === "shortlisted") && (
                                <>
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        className="text-[10px] font-black rounded-xl bg-[#1681FF] border-none"
                                        onClick={() =>
                                            onOpenSelect(replacementId, p)
                                        }
                                    >
                                        Select
                                    </Button>
                                    <Popconfirm
                                        title="Reject this candidate?"
                                        onConfirm={() =>
                                            onReject(
                                                replacementId,
                                                p.application_id,
                                            )
                                        }
                                        okText="Reject"
                                        okButtonProps={{ danger: true }}
                                        icon={
                                            <ExclamationCircleOutlined className="text-red-500" />
                                        }
                                    >
                                        <Button
                                            size="small"
                                            danger
                                            icon={<CloseCircleOutlined />}
                                            className="text-[10px] font-black rounded-xl"
                                        >
                                            Reject
                                        </Button>
                                    </Popconfirm>
                                </>
                            )}
                        </>
                    )}

                    {/* Joining Buttons */}
                    {isSelected && !isJoined && (
                        <div className="flex gap-1.5">
                            <Button
                                size="small"
                                icon={<CalendarOutlined />}
                                className="text-[10px] font-black rounded-xl border-green-300 text-green-700 hover:border-green-500"
                                onClick={() =>
                                    onOpenJoiningDate(replacementId, p)
                                }
                            >
                                Date
                            </Button>
                            <Popconfirm
                                title="Mark as joined?"
                                onConfirm={() =>
                                    onMarkJoined(
                                        replacementId,
                                        p.application_id,
                                    )
                                }
                                okText="Joined"
                            >
                                <Button
                                    size="small"
                                    type="primary"
                                    className="text-[10px] font-black rounded-xl bg-green-600 border-none"
                                >
                                    Join
                                </Button>
                            </Popconfirm>
                        </div>
                    )}
                </div>

                <Button
                    size="small"
                    icon={<UserOutlined />}
                    className="text-[10px] font-black rounded-xl"
                    onClick={() => onViewProfile(p, replacementId)}
                >
                    View
                </Button>
            </div>
        );
    }

    const statusBg = {
        selected: "bg-blue-50 border-blue-200",
        shortlisted: "bg-purple-50 border-purple-200",
        rejected: "bg-red-50 border-red-100",
        processing: "bg-amber-50 border-amber-200",
        joined: "bg-emerald-50 border-emerald-200",
    };

    const cardBg =
        statusBg[isJoined ? "joined" : p.status] ||
        "bg-gray-50 border-gray-100";

    return (
        <div
            className={`rounded-2xl border p-3 flex flex-col gap-2.5 transition-all ${cardBg}`}
            style={{ minWidth: 200 }}
        >
            {/* Name + Profile link */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#071C50] font-black text-xs">
                        {p.candidate_name?.[0]?.toUpperCase()}
                    </div>
                    <button
                        onClick={() => onViewProfile(p, replacementId)}
                        className="text-sm font-black text-[#071C50] hover:text-[#1681FF] transition-colors text-left leading-tight"
                    >
                        {p.candidate_name}
                    </button>
                </div>
                {/* Status Badge */}
                <span
                    className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap"
                    style={{
                        color:
                            profileStatusColor[
                                isJoined ? "joined" : p.status
                            ] || "#6b7280",
                        borderColor:
                            profileStatusColor[
                                isJoined ? "joined" : p.status
                            ] || "#e5e7eb",
                        background: "white",
                    }}
                >
                    {profileStatusLabel[isJoined ? "joined" : p.status] ||
                        p.status}
                </span>
            </div>

            {/* Feedback Popover Button */}
            {p.interview_feedback ? (
                <Popover
                    trigger="click"
                    placement="left"
                    content={
                        <FeedbackPopoverContent
                            feedback={p.interview_feedback}
                            candidateName={p.candidate_name}
                        />
                    }
                    overlayStyle={{ zIndex: 1050 }}
                    overlayInnerStyle={{ borderRadius: 20, padding: 16 }}
                >
                    <Button
                        size="small"
                        icon={<CommentOutlined />}
                        className="w-full text-[10px] font-black border-indigo-200 text-indigo-600 hover:border-indigo-500 rounded-xl"
                    >
                        View Feedback
                    </Button>
                </Popover>
            ) : (
                <span className="text-[10px] text-gray-300 italic">
                    No feedback yet
                </span>
            )}

            {/* ── Action Buttons (hidden once any candidate selected/joined) ── */}
            {showActions && (
                <div className="flex flex-wrap gap-1.5">
                    {/* Shortlist: only if NO feedback yet and status is processing */}
                    {!p.interview_feedback && p.status === "processing" && (
                        <Button
                            size="small"
                            icon={<StarOutlined />}
                            className="text-[10px] font-black rounded-xl border-purple-300 text-purple-700 hover:border-purple-500"
                            onClick={() =>
                                onShortlist(replacementId, p.application_id)
                            }
                        >
                            Shortlist
                        </Button>
                    )}
                    {/* Select + Reject: shown when status is processing/shortlisted.
                        If feedback exists, always show these (skipping Shortlist above). */}
                    {(p.interview_feedback ||
                        p.status === "processing" ||
                        p.status === "shortlisted") && (
                        <>
                            <Button
                                size="small"
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                className="text-[10px] font-black rounded-xl bg-[#1681FF] border-none"
                                onClick={() => onOpenSelect(replacementId, p)}
                            >
                                Select
                            </Button>
                            <Popconfirm
                                title="Reject this candidate?"
                                onConfirm={() =>
                                    onReject(replacementId, p.application_id)
                                }
                                okText="Reject"
                                okButtonProps={{ danger: true }}
                                icon={
                                    <ExclamationCircleOutlined className="text-red-500" />
                                }
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={<CloseCircleOutlined />}
                                    className="text-[10px] font-black rounded-xl"
                                >
                                    Reject
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </div>
            )}

            {/* ── Joining Status Section (shown for selected/joined candidates) ── */}
            {isSelected && (
                <div className="flex flex-col gap-1.5 pt-1 border-t border-white/60">
                    {isJoined ? (
                        <Tag
                            icon={<CheckCircleOutlined />}
                            color="success"
                            className="w-fit font-black uppercase text-[10px] rounded-full"
                        >
                            Joined
                        </Tag>
                    ) : isPending ? (
                        <>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold">
                                <CalendarOutlined className="text-green-500" />
                                {p.joining_date || "Date TBD"}
                            </div>
                            <div className="flex gap-1.5">
                                <Button
                                    size="small"
                                    icon={<CalendarOutlined />}
                                    className="text-[10px] font-black rounded-xl border-green-300 text-green-700 hover:border-green-500"
                                    onClick={() =>
                                        onOpenJoiningDate(replacementId, p)
                                    }
                                >
                                    Update Date
                                </Button>
                                <Popconfirm
                                    title="Mark this candidate as joined?"
                                    onConfirm={() =>
                                        onMarkJoined(
                                            replacementId,
                                            p.application_id,
                                        )
                                    }
                                    okText="Yes, Joined"
                                >
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        className="text-[10px] font-black rounded-xl bg-green-600 border-none hover:bg-green-700"
                                    >
                                        Mark Joined
                                    </Button>
                                </Popconfirm>
                            </div>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════ */
const Replacement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState("requests");
    const { apiurl, token } = useAuth();

    // Profile view modal
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [activeReplacementId, setActiveReplacementId] = useState(null);

    // Selection modal
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [activeApplicationId, setActiveApplicationId] = useState(null);
    const [activeCandidateName, setActiveCandidateName] = useState("");
    const [formDetails, setFormDetails] = useState({
        accepted_ctc: 0,
        joining_date: null,
        other_benefits: "",
    });

    // Joining date update modal
    const [joiningDateModalVisible, setJoiningDateModalVisible] =
        useState(false);
    const [joiningDateValue, setJoiningDateValue] = useState(null);
    const [joiningAppId, setJoiningAppId] = useState(null);
    const [joiningReplacementId, setJoiningReplacementId] = useState(null);
    const [joiningCandidateName, setJoiningCandidateName] = useState("");

    // Shortlist + Interviewer allotment modal
    const [shortlistModalVisible, setShortlistModalVisible] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    const [selectedInterviewer, setSelectedInterviewer] = useState(null);
    const [shortlistData, setShortlistData] = useState({
        rid: null,
        aid: null,
    });

    /* ── Data Fetch ── */
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/client/replacements/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.error) message.error(result.error);
            else setData(result || []);
        } catch {
            message.error("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const loadInterviewers = async () => {
        try {
            const response = await fetch(`${apiurl}/client/get-interviewers/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (Array.isArray(result)) {
                setInterviewers(result);
            }
        } catch (error) {
            console.error("Error fetching interviewers:", error);
        }
    };

    const handleAction = async (
        replacementId,
        applicationId,
        action,
        extraData = null,
    ) => {
        try {
            setLoading(true);
            const body = {
                replacement_id: replacementId,
                application_id: applicationId,
                action,
                ...(extraData || {}),
            };
            const response = await fetch(
                `${apiurl}/client/replacement-action/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success(result.message);
                setSelectionModalVisible(false);
                setJoiningDateModalVisible(false);
                setShortlistModalVisible(false); // Close shortlist modal on success
                fetchData();
            }
        } catch {
            message.error("Action failed.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Modal openers ── */
    const openSelectionModal = (replacementId, profile) => {
        setActiveReplacementId(replacementId);
        setActiveApplicationId(profile.application_id);
        setActiveCandidateName(profile.candidate_name);
        setFormDetails({
            accepted_ctc: 0,
            joining_date: null,
            other_benefits: "",
        });
        setSelectionModalVisible(true);
    };

    const openJoiningDateModal = (replacementId, profile) => {
        setJoiningReplacementId(replacementId);
        setJoiningAppId(profile.application_id);
        setJoiningCandidateName(profile.candidate_name);
        setJoiningDateValue(
            profile.joining_date ? dayjs(profile.joining_date) : null,
        );
        setJoiningDateModalVisible(true);
    };

    const viewProfile = (profile, replacementId) => {
        setSelectedProfile(profile);
        setActiveReplacementId(replacementId);
        setProfileModalVisible(true);
    };

    const openShortlistModal = (rid, aid) => {
        setShortlistData({ rid, aid });
        setSelectedInterviewer(null);
        setShortlistModalVisible(true);
    };

    useEffect(() => {
        if (token) {
            fetchData();
            loadInterviewers();
        }
    }, [token]);

    /* ── Tab Items ── */
    const items = [
        {
            label: (
                <span className="hover:text-[#1681FF] transition-colors font-semibold">
                    Replacement Requests
                </span>
            ),
            key: "requests",
        },
        {
            label: (
                <span className="hover:text-[#1681FF] transition-colors font-semibold">
                    Suggested Profiles
                </span>
            ),
            key: "proposals",
        },
    ];

    const handleMenuClick = (e) => {
        setCurrent(e.key);
    };

    /* ── Data Transformation ── */
    const displayData = useMemo(() => {
        if (current === "requests") return data;

        // Flatten data for proposals tab
        const flattened = [];
        data.forEach((replacement) => {
            const profiles = replacement.suggested_profiles || [];
            if (profiles.length === 0) {
                // Keep the row even if no profiles, or filter it out?
                // User said "each suggested profile should occupy each row",
                // suggesting they want to see the profiles primarily.
                // But we might want to see replacements with no profiles too?
                // For now, let's only show rows with profiles in the Proposals tab.
                return;
            }

            const anySelected = profiles.some(
                (p) => p.status === "selected" || p.joining_status,
            );

            profiles.forEach((profile) => {
                flattened.push({
                    ...replacement,
                    profile,
                    anySelected, // Useful for disabling actions if another is selected
                });
            });
        });
        return flattened;
    }, [data, current]);

    /* ── Table columns ── */
    const columns = useMemo(() => {
        const baseColumns = [
            {
                header: "Job ID",
                accessorKey: "job_code",
                width: 100,
                searchField: true,
                cell: ({ row }) => (
                    <span className="font-black text-[#1681FF] text-xs tracking-tight">
                        {row.original.job_code}
                    </span>
                ),
            },
            {
                header: "Candidate",
                accessorKey: "original_candidate_name",
                width: 200,
                searchField: true,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#071C50] flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0">
                            {row.original.original_candidate_name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="font-bold text-[#071C50] text-xs leading-tight truncate">
                                {row.original.original_candidate_name}
                            </span>
                            {row.original.original_application_id && (
                                <Link
                                    to={`/client/application/${row.original.original_application_id}`}
                                    state={{
                                        from: "replacements",
                                        label: "Replacement Requests",
                                    }}
                                    className="text-[10px] font-bold text-[#1681FF] hover:text-blue-800 underline underline-offset-2 leading-none"
                                >
                                    View Profile →
                                </Link>
                            )}
                        </div>
                    </div>
                ),
            },
        ];

        if (current === "requests") {
            return [
                ...baseColumns,
                {
                    header: "Reason",
                    accessorKey: "reason_for_leaving",
                    width: 250,
                    cell: ({ row }) => (
                        <div className="flex items-start gap-1.5 bg-amber-50 border border-amber-100 rounded-xl p-2.5">
                            <ExclamationCircleOutlined className="text-amber-500 text-xs mt-0.5 shrink-0" />
                            <span className="text-[11px] text-amber-800 font-medium italic leading-tight line-clamp-2">
                                {row.original.reason_for_leaving ||
                                    "Not specified"}
                            </span>
                        </div>
                    ),
                },
                {
                    header: "Status",
                    accessorKey: "status",
                    width: 140,
                    cell: ({ row }) => {
                        const status = row.original.status;
                        const cfg = {
                            completed: { color: "success", label: "Completed" },
                            pending: { color: "warning", label: "Pending" },
                            pending_manager_approval: {
                                color: "processing",
                                label: "Awaiting Approval",
                            },
                        };
                        const c = cfg[status] || {
                            color: "default",
                            label: status,
                        };
                        return (
                            <Tag
                                color={c.color}
                                className="uppercase font-black text-[9px] tracking-widest rounded-full"
                            >
                                {c.label}
                            </Tag>
                        );
                    },
                },
                {
                    header: "Replaced By",
                    accessorKey: "replaced_by",
                    width: 150,
                    cell: ({ row }) =>
                        row.original.replaced_by ? (
                            <div className="flex items-center gap-2">
                                <CheckCircleOutlined className="text-emerald-500" />
                                <span className="font-bold text-emerald-600 text-xs">
                                    {row.original.replaced_by}
                                </span>
                            </div>
                        ) : (
                            <span className="text-gray-300 italic text-xs">
                                —
                            </span>
                        ),
                },
            ];
        } else {
            return [
                ...baseColumns,
                {
                    header: "Suggested Candidate",
                    accessorKey: "profile.candidate_name",
                    width: 200,
                    searchField: true,
                    cell: ({ row }) => {
                        const { profile } = row.original;
                        if (!profile) return null;
                        return (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
                                    {profile.candidate_name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0 gap-0.5">
                                    <button
                                        onClick={() =>
                                            viewProfile(
                                                profile,
                                                row.original.replacement_id,
                                            )
                                        }
                                        className="font-bold text-[#071C50] text-xs hover:text-[#1681FF] transition-colors text-left truncate"
                                    >
                                        {profile.candidate_name}
                                    </button>
                                    <span className="text-[10px] text-gray-400 truncate">
                                        {profile.email}
                                    </span>
                                    {profile.application_id && (
                                        <Link
                                            to={`/client/application/${profile.application_id}`}
                                            state={{
                                                from: "replacements",
                                                label: "Suggested Profiles",
                                            }}
                                            className="text-[10px] font-bold text-[#1681FF] hover:text-blue-800 underline underline-offset-2 leading-none"
                                        >
                                            View Profile & Resume →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    },
                },
                {
                    header: "Experience",
                    width: 110,
                    cell: ({ row }) => {
                        const { profile } = row.original;
                        if (!profile)
                            return (
                                <span className="text-gray-300 text-xs">—</span>
                            );
                        return (
                            <span className="text-xs font-semibold text-gray-600">
                                {profile.experience
                                    ? `${profile.experience} yrs`
                                    : "—"}
                            </span>
                        );
                    },
                },
                {
                    header: "Exp. CTC",
                    width: 110,
                    cell: ({ row }) => {
                        const { profile } = row.original;
                        if (!profile)
                            return (
                                <span className="text-gray-300 text-xs">—</span>
                            );
                        return (
                            <span className="text-xs font-semibold text-gray-600">
                                {profile.expected_ctc
                                    ? `${profile.expected_ctc} LPA`
                                    : "—"}
                            </span>
                        );
                    },
                },
                {
                    header: "Status",
                    width: 130,
                    cell: ({ row }) => {
                        const { profile } = row.original;
                        if (!profile) return null;
                        const isJoined = profile.joining_status === "joined";
                        const status = isJoined
                            ? "joined"
                            : profile.joining_status || profile.status;
                        const colorMap = {
                            selected: "cyan",
                            joined: "green",
                            shortlisted: "blue",
                            rejected: "red",
                            processing: "orange",
                            pending: "purple",
                        };
                        const labelMap = {
                            selected: "Selected",
                            joined: "Joined ✓",
                            shortlisted: "Shortlisted",
                            rejected: "Rejected",
                            processing: "In Review",
                            pending: "Pending",
                        };
                        return (
                            <Tag
                                color={colorMap[status] || "default"}
                                className="uppercase font-black text-[9px] tracking-widest rounded-full"
                            >
                                {labelMap[status] || status}
                            </Tag>
                        );
                    },
                },
                {
                    header: "Feedback",
                    width: 110,
                    cell: ({ row }) => {
                        const { profile } = row.original;
                        if (!profile) return null;
                        if (!profile.interview_feedback) {
                            return (
                                <span className="text-[10px] text-gray-300 italic">
                                    None yet
                                </span>
                            );
                        }
                        return (
                            <Popover
                                trigger="click"
                                placement="left"
                                content={
                                    <FeedbackPopoverContent
                                        feedback={profile.interview_feedback}
                                        candidateName={profile.candidate_name}
                                    />
                                }
                                overlayStyle={{ zIndex: 1050 }}
                                overlayInnerStyle={{
                                    borderRadius: 20,
                                    padding: 16,
                                }}
                            >
                                <Button
                                    size="small"
                                    icon={<CommentOutlined />}
                                    className="text-[10px] font-black border-indigo-200 text-indigo-600 hover:border-indigo-500 rounded-xl"
                                >
                                    View
                                </Button>
                            </Popover>
                        );
                    },
                },
                {
                    header: "Actions",
                    width: 280,
                    rightSticky: true,
                    cell: ({ row }) => {
                        const record = row.original;
                        const { profile, anySelected } = record;
                        if (!profile) return null;

                        const rid = record.replacement_id;
                        const aid = profile.application_id;
                        const isJoined = profile.joining_status === "joined";
                        const isPendingJoin =
                            profile.joining_status === "pending";
                        const isSelected =
                            profile.status === "selected" ||
                            !!profile.joining_status;
                        const showActions = !anySelected || isSelected;

                        return (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {/* ── Stage 5: Joined ── */}
                                {isJoined && (
                                    <Tag
                                        icon={<CheckCircleOutlined />}
                                        color="success"
                                        className="font-black uppercase text-[9px] rounded-full"
                                    >
                                        Joined
                                    </Tag>
                                )}

                                {/* ── Stage 4: Selected → Set joining date + Mark Joined ── */}
                                {!isJoined && isSelected && (
                                    <>
                                        {isPendingJoin && (
                                            <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                                <CalendarOutlined className="text-green-400" />
                                                {profile.joining_date ||
                                                    "Date TBD"}
                                            </span>
                                        )}
                                        <Button
                                            size="small"
                                            icon={<CalendarOutlined />}
                                            className="text-[10px] font-black rounded-xl border-green-300 text-green-700 hover:border-green-500"
                                            onClick={() =>
                                                openJoiningDateModal(
                                                    rid,
                                                    profile,
                                                )
                                            }
                                        >
                                            {isPendingJoin
                                                ? "Update Date"
                                                : "Set Date"}
                                        </Button>
                                        <Popconfirm
                                            title="Mark this candidate as joined?"
                                            onConfirm={() =>
                                                handleAction(rid, aid, "joined")
                                            }
                                            okText="Yes, Joined"
                                        >
                                            <Button
                                                size="small"
                                                type="primary"
                                                icon={<CheckCircleOutlined />}
                                                className="text-[10px] font-black rounded-xl bg-green-600 border-none"
                                            >
                                                Mark Joined
                                            </Button>
                                        </Popconfirm>
                                    </>
                                )}

                                {/* ── Stages 1–3: not yet selected ── */}
                                {!isSelected && !isJoined && showActions && (
                                    <>
                                        {/* Stage 1: pending — Shortlist or Reject */}
                                        {profile.status === "pending" &&
                                            !profile.interview_feedback && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        icon={<StarOutlined />}
                                                        className="text-[10px] font-black rounded-xl border-purple-300 text-purple-700 hover:border-purple-500"
                                                        onClick={() =>
                                                            openShortlistModal(
                                                                rid,
                                                                aid,
                                                            )
                                                        }
                                                    >
                                                        Shortlist
                                                    </Button>
                                                    <Popconfirm
                                                        title="Reject this candidate?"
                                                        onConfirm={() =>
                                                            handleAction(
                                                                rid,
                                                                aid,
                                                                "reject",
                                                            )
                                                        }
                                                        okText="Reject"
                                                        okButtonProps={{
                                                            danger: true,
                                                        }}
                                                        icon={
                                                            <ExclamationCircleOutlined className="text-red-500" />
                                                        }
                                                    >
                                                        <Button
                                                            size="small"
                                                            danger
                                                            icon={
                                                                <CloseCircleOutlined />
                                                            }
                                                            className="text-[10px] font-black rounded-xl"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Popconfirm>
                                                </>
                                            )}

                                        {/* Stage 2: shortlisted/processing, no feedback yet — recruiter needs to schedule/conduct interview */}
                                        {(profile.status === "shortlisted" ||
                                            profile.status === "processing") &&
                                            !profile.interview_feedback && (
                                                <span className="text-[10px] text-indigo-500 font-bold flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-xl px-2 py-1">
                                                    <CalendarOutlined />{" "}
                                                    Awaiting Interview
                                                </span>
                                            )}

                                        {/* Stage 3: interview feedback received — Select or Reject */}
                                        {profile.interview_feedback && (
                                            <>
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    icon={
                                                        <CheckCircleOutlined />
                                                    }
                                                    className="text-[10px] font-black rounded-xl bg-[#1681FF] border-none"
                                                    onClick={() =>
                                                        openSelectionModal(
                                                            rid,
                                                            profile,
                                                        )
                                                    }
                                                >
                                                    Select
                                                </Button>
                                                <Popconfirm
                                                    title="Reject this candidate?"
                                                    onConfirm={() =>
                                                        handleAction(
                                                            rid,
                                                            aid,
                                                            "reject",
                                                        )
                                                    }
                                                    okText="Reject"
                                                    okButtonProps={{
                                                        danger: true,
                                                    }}
                                                    icon={
                                                        <ExclamationCircleOutlined className="text-red-500" />
                                                    }
                                                >
                                                    <Button
                                                        size="small"
                                                        danger
                                                        icon={
                                                            <CloseCircleOutlined />
                                                        }
                                                        className="text-[10px] font-black rounded-xl"
                                                    >
                                                        Reject
                                                    </Button>
                                                </Popconfirm>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* No actions available (another candidate already selected/joined) */}
                                {!isSelected && !isJoined && !showActions && (
                                    <span className="text-[10px] text-gray-400 italic">
                                        —
                                    </span>
                                )}
                            </div>
                        );
                    },
                },
            ];
        }
    }, [current]);

    /* ── Render ── */
    return (
        <Main defaultSelectedKey="6">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    <div className="p-6 bg-[#F9FAFB] min-h-screen">
                        {/* Page Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="font-black text-2xl text-[#071C50] m-0 tracking-tight">
                                    Replacement Dashboard
                                </h1>
                                <p className="text-gray-400 text-xs font-semibold mt-1 m-0">
                                    Review and act on replacement candidate
                                    profiles
                                </p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#071C50] flex items-center justify-center text-white shadow-md">
                                    <FileTextOutlined className="text-base" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest m-0">
                                        Total
                                    </p>
                                    <p className="text-[#071C50] font-black text-lg m-0 leading-tight">
                                        {data.length}{" "}
                                        <span className="text-sm text-gray-400 font-bold">
                                            Records
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Menu
                            onClick={handleMenuClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={items}
                            style={{
                                marginBottom: "20px",
                                background: "transparent",
                                borderBottom: "1px solid #e5e7eb",
                            }}
                            className="replacement-tabs"
                        />

                        {/* Table */}
                        <AppTable
                            columns={columns}
                            data={displayData}
                            pageSize={10}
                        />

                        {/* ── Profile View Modal ── */}
                        <Modal
                            title={null}
                            open={profileModalVisible}
                            onCancel={() => setProfileModalVisible(false)}
                            footer={null}
                            width={640}
                            className="premium-modal-v2"
                        >
                            {selectedProfile && (
                                <div className="flex flex-col gap-5">
                                    {/* Header */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-[18px] bg-[#071C50] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-100">
                                            {selectedProfile.candidate_name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-black text-[#071C50] m-0 tracking-tighter">
                                                {selectedProfile.candidate_name}
                                            </h2>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest m-0">
                                                Candidate Profile
                                            </p>
                                        </div>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border"
                                            style={{
                                                color:
                                                    profileStatusColor[
                                                        selectedProfile.status
                                                    ] || "#6b7280",
                                                borderColor:
                                                    profileStatusColor[
                                                        selectedProfile.status
                                                    ] || "#e5e7eb",
                                                background: "#f9fafb",
                                            }}
                                        >
                                            {profileStatusLabel[
                                                selectedProfile.status
                                            ] || selectedProfile.status}
                                        </span>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        {[
                                            {
                                                label: "Email",
                                                val:
                                                    selectedProfile.email ||
                                                    "—",
                                            },
                                            {
                                                label: "Experience",
                                                val: selectedProfile.experience
                                                    ? `${selectedProfile.experience} yrs`
                                                    : "—",
                                            },
                                            {
                                                label: "Expected CTC",
                                                val: selectedProfile.expected_ctc
                                                    ? `${selectedProfile.expected_ctc} LPA`
                                                    : "—",
                                            },
                                        ].map(({ label, val }) => (
                                            <div key={label}>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                                                    {label}
                                                </p>
                                                <p className="font-bold text-gray-800 text-sm m-0">
                                                    {val}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        {(selectedProfile.status ===
                                            "processing" ||
                                            selectedProfile.status ===
                                                "shortlisted") && (
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<CheckCircleOutlined />}
                                                className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-[#071C50] border-none"
                                                onClick={() => {
                                                    setProfileModalVisible(
                                                        false,
                                                    );
                                                    openSelectionModal(
                                                        activeReplacementId,
                                                        selectedProfile,
                                                    );
                                                }}
                                            >
                                                Select Candidate
                                            </Button>
                                        )}
                                        {selectedProfile.interview_feedback && (
                                            <Popover
                                                trigger="click"
                                                placement="top"
                                                content={
                                                    <FeedbackPopoverContent
                                                        feedback={
                                                            selectedProfile.interview_feedback
                                                        }
                                                        candidateName={
                                                            selectedProfile.candidate_name
                                                        }
                                                    />
                                                }
                                                overlayInnerStyle={{
                                                    borderRadius: 20,
                                                    padding: 16,
                                                }}
                                            >
                                                <Button
                                                    size="large"
                                                    icon={<CommentOutlined />}
                                                    className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest border-indigo-200 text-indigo-600"
                                                >
                                                    View Feedback
                                                </Button>
                                            </Popover>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Modal>

                        {/* ── Selection Details Modal ── */}
                        <Modal
                            title={null}
                            open={selectionModalVisible}
                            onCancel={() => setSelectionModalVisible(false)}
                            footer={null}
                            width={520}
                            className="premium-modal-v2"
                        >
                            <div className="p-1 flex flex-col gap-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-[#071C50] flex items-center justify-center text-white">
                                        <CheckCircleOutlined className="text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#071C50] m-0 tracking-tighter">
                                            Confirm Selection
                                        </h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest m-0">
                                            {activeCandidateName}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Accepted CTC (LPA)
                                        </p>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter agreed CTC"
                                            value={formDetails.accepted_ctc}
                                            onChange={(e) =>
                                                setFormDetails({
                                                    ...formDetails,
                                                    accepted_ctc:
                                                        e.target.value,
                                                })
                                            }
                                            size="large"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Joining Date
                                        </p>
                                        <CustomDatePicker
                                            placeholder="Select joining date"
                                            value={formDetails.joining_date}
                                            onChange={(date) =>
                                                setFormDetails({
                                                    ...formDetails,
                                                    joining_date: date,
                                                })
                                            }
                                            style={{ width: "100%" }}
                                            size="large"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Other Benefits / Remarks
                                        </p>
                                        <Input.TextArea
                                            placeholder="Enter benefits or remarks..."
                                            value={formDetails.other_benefits}
                                            onChange={(e) =>
                                                setFormDetails({
                                                    ...formDetails,
                                                    other_benefits:
                                                        e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() =>
                                            setSelectionModalVisible(false)
                                        }
                                        className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-[#071C50] border-none"
                                        onClick={() => {
                                            if (!formDetails.joining_date) {
                                                message.error(
                                                    "Please select a joining date",
                                                );
                                                return;
                                            }
                                            handleAction(
                                                activeReplacementId,
                                                activeApplicationId,
                                                "select",
                                                {
                                                    selection_details: {
                                                        accepted_ctc:
                                                            formDetails.accepted_ctc,
                                                        joining_date:
                                                            formatDate(
                                                                formDetails.joining_date,
                                                                "yyyy-MM-dd",
                                                            ),
                                                        other_benefits:
                                                            formDetails.other_benefits,
                                                    },
                                                },
                                            );
                                        }}
                                    >
                                        Confirm Selection
                                    </Button>
                                </div>
                            </div>
                        </Modal>

                        {/* ── Update Joining Date Modal ── */}
                        <Modal
                            title={null}
                            open={joiningDateModalVisible}
                            onCancel={() => setJoiningDateModalVisible(false)}
                            footer={null}
                            width={420}
                            className="premium-modal-v2"
                        >
                            <div className="p-1 flex flex-col gap-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-200/50">
                                        <CalendarOutlined className="text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#071C50] m-0 tracking-tighter">
                                            Update Joining Date
                                        </h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest m-0">
                                            {joiningCandidateName}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                        New Joining Date
                                    </p>
                                    <CustomDatePicker
                                        placeholder="Select new joining date"
                                        value={joiningDateValue}
                                        onChange={(date) =>
                                            setJoiningDateValue(date)
                                        }
                                        style={{ width: "100%" }}
                                        size="large"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() =>
                                            setJoiningDateModalVisible(false)
                                        }
                                        className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        className="flex-1 h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-green-600 border-none hover:bg-green-700"
                                        onClick={() => {
                                            if (!joiningDateValue) {
                                                message.error(
                                                    "Please select a date",
                                                );
                                                return;
                                            }
                                            handleAction(
                                                joiningReplacementId,
                                                joiningAppId,
                                                "update_joining_date",
                                                {
                                                    joining_date: formatDate(
                                                        joiningDateValue,
                                                        "yyyy-MM-dd",
                                                    ),
                                                },
                                            );
                                        }}
                                    >
                                        Update Date
                                    </Button>
                                </div>
                            </div>
                        </Modal>

                        {/* ── Shortlist + Interviewer Modal ── */}
                        <Modal
                            title={
                                <div className="flex items-center gap-2">
                                    <StarOutlined className="text-purple-500" />
                                    <span className="font-black text-[#071C50]">
                                        Allot Interviewer
                                    </span>
                                </div>
                            }
                            open={shortlistModalVisible}
                            onCancel={() => setShortlistModalVisible(false)}
                            onOk={() => {
                                handleAction(
                                    shortlistData.rid,
                                    shortlistData.aid,
                                    "shortlist",
                                    { interviewer_id: selectedInterviewer },
                                );
                            }}
                            okText="Shortlist Candidate"
                            className="premium-modal-v2"
                        >
                            <div className="py-4">
                                <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">
                                    Please select an interviewer who will
                                    conduct the interview for this round.
                                </p>
                                <Select
                                    placeholder="Select Interviewer"
                                    className="w-full"
                                    value={selectedInterviewer}
                                    onChange={setSelectedInterviewer}
                                    suffixIcon={<UserOutlined />}
                                >
                                    {interviewers.map((i) => (
                                        <Select.Option key={i.id} value={i.id}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold">
                                                    {i.interviewer_name}
                                                </span>
                                                <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full uppercase">
                                                    {i.rounds_alloted} Alloted
                                                </span>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </Modal>

                        <style>{`
                            .replacement-tabs .ant-menu-item {
                                padding: 0 16px !important;
                                height: 44px !important;
                                line-height: 44px !important;
                            }
                            .replacement-tabs .ant-menu-item-selected {
                                color: #1681FF !important;
                            }
                            .replacement-tabs .ant-menu-item-active::after,
                            .replacement-tabs .ant-menu-item-selected::after {
                                border-bottom-color: #1681FF !important;
                                border-bottom-width: 3px !important;
                                border-radius: 3px !important;
                            }
                            .premium-modal-v2 .ant-modal-content {
                                border-radius: 24px;
                                padding: 24px;
                                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08) !important;
                            }
                        `}</style>
                    </div>
                </>
            )}
        </Main>
    );
};

export default Replacement;
