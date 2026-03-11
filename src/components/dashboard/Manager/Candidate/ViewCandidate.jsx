import React, { useState, useEffect } from "react";
import Main from "../Layout";
import { message, Progress, Tag, Avatar, Tooltip, Rate } from "antd";
import { useAuth } from "../../../common/useAuth";
import GoBack from "../../../common/Goback";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    DownloadOutlined,
    UserOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    ArrowUpOutlined,
    StarFilled,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import profile_pic from "../../../../images/Manager/ViewCandidate/sampleProfile.png";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const parseSkillRatings = (raw) => {
    if (!raw) return {};
    try {
        return typeof raw === "string"
            ? JSON.parse(raw.replace(/'/g, '"'))
            : raw;
    } catch {
        return {};
    }
};

const StatusBadge = ({ status }) => {
    const map = {
        selected: { bg: "bg-emerald-100 text-emerald-700", label: "Selected" },
        rejected: { bg: "bg-red-100 text-red-600", label: "Rejected" },
        processing: { bg: "bg-blue-100 text-blue-700", label: "In Progress" },
        hold: { bg: "bg-amber-100 text-amber-700", label: "On Hold" },
        pending: { bg: "bg-gray-100 text-gray-600", label: "Pending" },
    };
    const s = map[status?.toLowerCase()] || map.pending;
    return (
        <span
            className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${s.bg}`}
        >
            {s.label}
        </span>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Left Sidebar
// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ profile }) => {
    return (
        <aside className="w-full lg:w-64 flex-none flex flex-col gap-5">
            {/* Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
                <div className="relative">
                    <img
                        src={profile.profile || profile_pic}
                        alt="avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
                </div>
                <div>
                    <h2 className="text-base font-black text-gray-900 m-0 leading-tight">
                        {profile.candidate_name}
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {profile.experience?.[0]?.role || "Candidate"}
                    </p>
                </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Candidate's Skills
                    </p>
                    <InfoCircleOutlined className="text-gray-300 text-xs" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {profile.skills ? (
                        profile.skills.split(",").map((s, i) => (
                            <span
                                key={i}
                                className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100"
                            >
                                {s.trim()}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-gray-400">
                            No skills listed
                        </span>
                    )}
                </div>
            </div>

            {/* Documents */}
            {profile.candidate_documents?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                        Documents
                    </p>
                    <div className="space-y-2">
                        {profile.candidate_documents.map((doc, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileTextOutlined className="text-red-400 flex-none text-base" />
                                    <span className="text-xs text-gray-700 font-medium truncate">
                                        {doc.document_name ||
                                            doc.document?.split("/").pop()}
                                    </span>
                                </div>
                                {doc.document && (
                                    <a
                                        href={doc.document}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-300 hover:text-indigo-500 transition-colors flex-none ml-2"
                                    >
                                        <DownloadOutlined />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    Contact Information
                </p>
                <div className="space-y-2.5 text-xs text-gray-600">
                    {profile.candidate_location && (
                        <div className="flex items-start gap-2">
                            <EnvironmentOutlined className="text-gray-400 mt-0.5 flex-none" />
                            <span>{profile.candidate_location}</span>
                        </div>
                    )}
                    {profile.candidate_email && (
                        <div className="flex items-center gap-2">
                            <MailOutlined className="text-gray-400 flex-none" />
                            <span className="truncate">
                                {profile.candidate_email}
                            </span>
                        </div>
                    )}
                    {profile.candidate_phone && (
                        <div className="flex items-center gap-2">
                            <PhoneOutlined className="text-gray-400 flex-none" />
                            <span>{profile.candidate_phone}</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Middle Column
// ─────────────────────────────────────────────────────────────────────────────
const MiddleColumn = ({ profile, feedback, jobs, candidate_id, job_id }) => {
    const { apiurl, token } = useAuth();
    const [jobData, setJobData] = useState(null);

    // If job_id is available from URL, find the matching job title from jobs list
    const activeJob = job_id
        ? jobs?.find((j) => String(j.job_id) === String(job_id))
        : jobs?.[0];

    // Filter feedback to this job only when job_id is set
    const jobFeedback = job_id
        ? (feedback || []).filter(
              (r) => r.job_title === activeJob?.title || !activeJob,
          )
        : feedback || [];

    useEffect(() => {
        const targetJobId = job_id || activeJob?.job_id;
        if (targetJobId && candidate_id) {
            fetch(
                `${apiurl}/candidate_status_for_job/?job_id=${targetJobId}&candidate_id=${candidate_id}`,
                { headers: { Authorization: `Bearer ${token}` } },
            )
                .then((r) => r.json())
                .then((d) => setJobData(d))
                .catch(console.error);
        }
    }, [job_id, jobs, candidate_id]);

    const latestFeedback = jobFeedback?.[jobFeedback.length - 1];
    const latestRound = jobFeedback?.length || 0;
    const primaryRatings = parseSkillRatings(
        latestFeedback?.primary_skills_rating,
    );
    const secondaryRatings = parseSkillRatings(
        latestFeedback?.secondary_skills_ratings,
    );

    return (
        <section className="flex-1 min-w-0 flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-xl font-black text-gray-900 m-0">
                        {profile.candidate_name}
                    </h1>
                    {latestRound > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200">
                            Round {latestRound}:{" "}
                            {latestFeedback?.job_title || "Interview"}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-medium">
                    <p className="m-0">
                        Applied for:{" "}
                        {activeJob ? (
                            <span className="font-semibold text-gray-700">
                                {activeJob.title}
                            </span>
                        ) : jobs?.length > 0 ? (
                            <span className="font-semibold text-gray-700">
                                {jobs[0].title}
                            </span>
                        ) : (
                            "—"
                        )}
                    </p>
                    {jobData?.current_stage && (
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Stage:</span>
                            <StatusBadge status={jobData.current_stage} />
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                    {
                        label: "Current CTC",
                        value: `₹${profile.current_salary || "0"}`,
                        sub: "Base",
                        color: "text-gray-800",
                    },
                    {
                        label: "Expected CTC",
                        value: `₹${profile.expected_salary || "0"}`,
                        sub: profile.hike
                            ? `+${profile.hike}% hike from current`
                            : null,
                        color: "text-emerald-600",
                    },
                    {
                        label: "Notice Period",
                        value: `${profile.notice_period || "0"} Days`,
                        sub: "Negotiable",
                        color: "text-gray-800",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                            {s.label}
                        </p>
                        <p className={`text-2xl font-black m-0 ${s.color}`}>
                            {s.value}
                        </p>
                        {s.sub && (
                            <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
                                {s.sub}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Screening Summary */}
            {latestFeedback && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide m-0">
                            Screening Summary
                        </h3>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                        <Avatar
                            className="bg-indigo-500 font-bold flex-none"
                            size={36}
                        >
                            {latestFeedback.interviewer_name?.[0] || "?"}
                        </Avatar>
                        <div>
                            <p className="text-sm font-bold text-gray-800 m-0">
                                {latestFeedback.interviewer_name || "Unknown"}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">
                                Interview Round {latestFeedback.round_num}
                            </p>
                        </div>
                    </div>
                    {latestFeedback.remarks && (
                        <blockquote className="text-sm text-gray-600 italic leading-relaxed border-l-2 border-indigo-200 pl-3 mb-4">
                            "{latestFeedback.remarks}"
                        </blockquote>
                    )}
                    {latestFeedback.comments && (
                        <div className="flex flex-wrap gap-2">
                            {latestFeedback.comments
                                .split(",")
                                .map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                        </div>
                    )}
                    {jobData && (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Current Stage:
                            </span>
                            <StatusBadge status={jobData.current_stage} />
                        </div>
                    )}
                </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Primary Skill Ratings */}
                {Object.keys(primaryRatings).length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-4">
                            Key Skills{" "}
                            <span className="text-indigo-400">(Primary)</span>
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(primaryRatings).map(
                                ([skill, val]) => {
                                    const score = parseFloat(val) || 0;
                                    const pct = Math.min(
                                        100,
                                        (score / 10) * 100,
                                    );
                                    return (
                                        <div key={skill}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {skill}
                                                </span>
                                                <span className="text-xs font-bold text-blue-600">
                                                    {score}/10
                                                </span>
                                            </div>
                                            <Progress
                                                percent={pct}
                                                strokeColor="#3b82f6"
                                                trailColor="#f1f5f9"
                                                strokeWidth={7}
                                                showInfo={false}
                                            />
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}

                {/* Secondary Skill Ratings */}
                {Object.keys(secondaryRatings).length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-4">
                            Key Skills{" "}
                            <span className="text-purple-400">(Secondary)</span>
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(secondaryRatings).map(
                                ([skill, val]) => {
                                    const score = parseFloat(val) || 0;
                                    const pct = Math.min(
                                        100,
                                        (score / 10) * 100,
                                    );
                                    return (
                                        <div key={skill}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {skill}
                                                </span>
                                                <span className="text-xs font-bold text-purple-500">
                                                    {score}/10
                                                </span>
                                            </div>
                                            <Progress
                                                percent={pct}
                                                strokeColor="#a855f7"
                                                trailColor="#f1f5f9"
                                                strokeWidth={7}
                                                showInfo={false}
                                            />
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience Timeline */}
            {profile.experience?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-5">
                        Experience
                    </h3>
                    <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                        {profile.experience.map((exp, i) => {
                            const start = exp.from_date
                                ? new Date(exp.from_date)
                                : null;
                            const end =
                                exp.is_working || !exp.to_date
                                    ? new Date()
                                    : new Date(exp.to_date);
                            let durationStr = "";
                            if (start) {
                                const totalMonths =
                                    (end.getFullYear() - start.getFullYear()) *
                                        12 +
                                    (end.getMonth() - start.getMonth());
                                const yrs = Math.floor(totalMonths / 12);
                                const mos = totalMonths % 12;
                                durationStr =
                                    [
                                        yrs > 0
                                            ? `${yrs} yr${yrs > 1 ? "s" : ""}`
                                            : "",
                                        mos > 0
                                            ? `${mos} mo${mos > 1 ? "s" : ""}`
                                            : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "< 1 mo";
                            }
                            const fromLabel = start
                                ? start.toLocaleDateString("en-IN", {
                                      month: "short",
                                      year: "numeric",
                                  })
                                : "";
                            const toLabel =
                                exp.is_working || !exp.to_date
                                    ? "Present"
                                    : new Date(exp.to_date).toLocaleDateString(
                                          "en-IN",
                                          { month: "short", year: "numeric" },
                                      );

                            return (
                                <li key={i} className="ml-4">
                                    <span
                                        className={`absolute -left-[7px] w-3.5 h-3.5 rounded-full border-2 border-white ${i === 0 ? "bg-indigo-500" : "bg-gray-300"}`}
                                    ></span>
                                    <p className="text-sm font-bold text-gray-800 m-0 leading-tight">
                                        {exp.role || "Role"}
                                    </p>
                                    <p className="text-xs font-semibold text-indigo-500 mt-0.5">
                                        {exp.company_name || "—"}
                                    </p>
                                    {fromLabel && (
                                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                            {fromLabel} – {toLabel}
                                            {durationStr && (
                                                <span className="ml-1.5 text-gray-300">
                                                    · {durationStr}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}
        </section>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Right Panel — Interview Feedback
// ─────────────────────────────────────────────────────────────────────────────
const FeedbackPanel = ({ feedback, job_id, jobs }) => {
    // Filter to active job's feedback when job_id is available
    const activeJob = job_id
        ? jobs?.find((j) => String(j.job_id) === String(job_id))
        : null;
    const panelFeedback = job_id
        ? (feedback || []).filter(
              (r) => r.job_title === activeJob?.title || !activeJob,
          )
        : feedback || [];

    const avgScore =
        panelFeedback?.length > 0
            ? (
                  panelFeedback.reduce(
                      (sum, r) => sum + (parseFloat(r.score) || 0),
                      0,
                  ) / panelFeedback.length
              ).toFixed(1)
            : null;

    if (!panelFeedback || panelFeedback.length === 0) {
        return (
            <aside className="w-full lg:w-80 flex-none lg:sticky lg:top-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center py-16 opacity-50">
                    <ClockCircleOutlined className="text-3xl mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400 font-medium text-center">
                        No interview feedback yet
                    </p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-80 flex-none flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide m-0">
                    Interview Feedback
                </h2>
                {avgScore && (
                    <span className="text-xs font-bold text-gray-500">
                        Average Rating:{" "}
                        <span className="text-amber-500 font-black">
                            {avgScore}/10
                        </span>
                    </span>
                )}
            </div>

            {/* Round Cards — reverse order so newest first */}
            {[...panelFeedback].reverse().map((round, idx) => {
                const primary = parseSkillRatings(round.primary_skills_rating);
                const secondary = parseSkillRatings(
                    round.secondary_skills_ratings,
                );
                const allRatings = { ...primary, ...secondary };
                const isLatest = idx === 0;

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.07 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        {/* Top Bar */}
                        <div className="px-4 pt-4 pb-3 border-b border-gray-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-black text-gray-900 m-0">
                                            Round {round.round_num}:{" "}
                                            {round.job_title || "Interview"}
                                        </h4>
                                    </div>
                                </div>
                                {isLatest && round.status === "processing" ? (
                                    <span className="bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                        In Progress
                                    </span>
                                ) : (
                                    round.score > 0 && (
                                        <div className="text-right">
                                            <span className="text-lg font-black text-amber-500 leading-none">
                                                {round.score}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold">
                                                /10
                                            </span>
                                            <div className="flex mt-0.5">
                                                {Array.from({ length: 5 }).map(
                                                    (_, si) => (
                                                        <StarFilled
                                                            key={si}
                                                            className={`text-[10px] ${
                                                                si <
                                                                Math.round(
                                                                    round.score /
                                                                        2,
                                                                )
                                                                    ? "text-amber-400"
                                                                    : "text-gray-200"
                                                            }`}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Interviewer */}
                            <div className="flex items-center gap-2 mt-2">
                                <Avatar
                                    size={28}
                                    className="bg-indigo-100 text-indigo-600 text-xs font-bold flex-none"
                                >
                                    {round.interviewer_name?.[0] || "?"}
                                </Avatar>
                                <div>
                                    <p className="text-xs font-bold text-gray-700 m-0">
                                        {round.interviewer_name || "Unknown"}
                                    </p>
                                    <StatusBadge status={round.status} />
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            {/* Competency Ratings Table */}
                            {Object.keys(allRatings).length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                        Competency Rating
                                    </p>
                                    <div className="space-y-1">
                                        {Object.entries(allRatings).map(
                                            ([skill, val]) => (
                                                <div
                                                    key={skill}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span className="text-xs text-gray-600">
                                                        {skill}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {val}/10
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Interviewer Notes */}
                            {round.remarks && (
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                        Interviewer Notes
                                    </p>
                                    <p className="text-xs text-gray-600 italic leading-relaxed">
                                        "{round.remarks}"
                                    </p>
                                </div>
                            )}

                            {/* Pending state */}
                            {!round.remarks &&
                                Object.keys(allRatings).length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center py-2">
                                        Waiting for interviewer to submit
                                        scorecard…
                                    </p>
                                )}
                        </div>
                    </motion.div>
                );
            })}
        </aside>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Fallback — Profile Not Filled
// ─────────────────────────────────────────────────────────────────────────────
const NotUpdatedProfile = ({ candidate_id }) => {
    const { apiurl, token } = useAuth();
    const [notifying, setNotifying] = useState(false);

    const sendNotification = async () => {
        setNotifying(true);
        try {
            const res = await fetch(
                `${apiurl}/notification_to_update_profile/?id=${candidate_id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const d = await res.json();
            if (d.message) message.success(d.message);
            else if (d.error) message.error(d.error);
        } catch {
            message.error("Network error");
        } finally {
            setNotifying(false);
        }
    };

    return (
        <div className="w-full py-24 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center max-w-sm text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-400 mb-5 text-3xl">
                    <UserOutlined />
                </div>
                <h2 className="text-xl font-black text-gray-800 mb-2">
                    Profile Not Finished
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                    This candidate hasn't filled in their profile yet. Send them
                    a reminder.
                </p>
                <button
                    onClick={sendNotification}
                    disabled={notifying}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center text-sm"
                >
                    {notifying ? (
                        <ClockCircleOutlined className="animate-spin mr-2" />
                    ) : (
                        <MailOutlined className="mr-2" />
                    )}
                    Send Notification Nudge
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
const ViewCandidate = () => {
    const [searchParams] = useSearchParams();
    const candidate_id =
        searchParams.get("candidate_id") || searchParams.get("id");
    const job_id = searchParams.get("job_id");
    const [profile, setProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, apiurl } = useAuth();

    useEffect(() => {
        if (!token || !candidate_id) return;
        setLoading(true);
        fetch(`${apiurl}/view_candidate_profile/?id=${candidate_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) message.error(data.error);
                if (data.candidate_data) setProfile(data.candidate_data);
                if (data.applied_jobs) setJobs(data.applied_jobs);
                if (data.feedback) setFeedback(data.feedback);
            })
            .catch(() => message.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, [token, candidate_id]);

    return (
        <Main defaultSelectedKey="9">
            <div className="max-w-[1400px] mx-auto px-4 py-6 sm:px-6 lg:px-8 min-h-screen bg-gray-50/40">
                {/* Page Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm hover:scale-105 transition-transform">
                        <GoBack />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-0.5">
                            Recruitment Management
                        </p>
                        <h1 className="text-xl font-black text-gray-900 m-0">
                            Candidate Profile
                        </h1>
                    </div>
                </div>

                {/* Body */}
                {loading ? (
                    <div className="w-full py-40 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <ClockCircleOutlined className="text-4xl text-indigo-400 animate-spin" />
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Loading…
                            </p>
                        </div>
                    </div>
                ) : profile ? (
                    <div className="flex flex-col lg:flex-row gap-5 items-start">
                        <Sidebar profile={profile} />
                        <div className="flex-1 w-full flex flex-col lg:flex-row gap-5">
                            <MiddleColumn
                                profile={profile}
                                feedback={feedback}
                                jobs={jobs}
                                candidate_id={candidate_id}
                                job_id={job_id}
                            />
                            <FeedbackPanel
                                feedback={feedback}
                                job_id={job_id}
                                jobs={jobs}
                            />
                        </div>
                    </div>
                ) : (
                    <NotUpdatedProfile candidate_id={candidate_id} />
                )}
            </div>
        </Main>
    );
};

export default ViewCandidate;
