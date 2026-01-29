import React, { useState } from "react";
import { useAuth } from "./useAuth";
import ResumeModal from "./ResumeModal";
import {
    CalendarOutlined,
    EnvironmentOutlined,
    BankOutlined,
    DollarOutlined,
    TrophyOutlined,
    FileTextOutlined,
    CopyOutlined,
    StarOutlined,
    AuditOutlined,
    SafetyCertificateOutlined,
    ClockCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { message, Tag, Button, Tooltip, Divider, Rate } from "antd";

const ViewApplication = ({ application_data }) => {
    const { apiurl } = useAuth();
    const [viewResume, setViewResume] = useState(false);

    function parseSkillRating(ratingString) {
        if (!ratingString) return {};
        try {
            const cleaned = ratingString
                .replace(/^"|"$/g, "")
                .replace(/'/g, '"');
            return JSON.parse(cleaned);
        } catch (error) {
            console.error("Failed to parse skill rating:", ratingString, error);
            return {};
        }
    }

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        message.success(`${type} copied to terminal clipboard`);
    };

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {application_data && (
                <>
                    {/* Hero Information Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between gap-10">
                            <div className="flex gap-8">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1681FF] to-[#0061D5] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200">
                                    {application_data.candidate_name?.[0]}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-4xl font-black text-[#071C50] tracking-tight mb-2">
                                            {application_data.candidate_name}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-blue-50 text-[#1681FF] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">
                                                {
                                                    application_data.job_department
                                                }
                                            </span>
                                            <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-100">
                                                {
                                                    application_data.application_status
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div
                                            className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl group hover:bg-white border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(
                                                    application_data.candidate_email,
                                                    "Email"
                                                )
                                            }
                                        >
                                            <MailOutlined className="text-blue-500" />
                                            <span className="text-gray-500 font-bold text-xs">
                                                {
                                                    application_data.candidate_email
                                                }
                                            </span>
                                            <CopyOutlined className="text-gray-300 group-hover:text-blue-400" />
                                        </div>
                                        <div
                                            className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl group hover:bg-white border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(
                                                    application_data.candidate_phone,
                                                    "Phone"
                                                )
                                            }
                                        >
                                            <PhoneOutlined className="text-green-500" />
                                            <span className="text-gray-500 font-bold text-xs">
                                                {
                                                    application_data.candidate_phone
                                                }
                                            </span>
                                            <CopyOutlined className="text-gray-300 group-hover:text-green-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<FileTextOutlined />}
                                    onClick={() => setViewResume(true)}
                                    className="h-16 px-10 rounded-2xl bg-[#001744] hover:bg-[#002b7a] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-50 border-none flex items-center gap-3"
                                >
                                    Review Document
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-6 border-t border-gray-50 bg-gray-50/30">
                            {[
                                {
                                    icon: (
                                        <SafetyCertificateOutlined className="text-blue-500" />
                                    ),
                                    label: "Qualification",
                                    value: application_data.highest_qualification,
                                },
                                {
                                    icon: (
                                        <CalendarOutlined className="text-red-500" />
                                    ),
                                    label: "DOB",
                                    value: application_data.date_of_birth,
                                },
                                {
                                    icon: (
                                        <ClockCircleOutlined className="text-amber-500" />
                                    ),
                                    label: "Notice Period",
                                    value: `${application_data.notice_period} Days`,
                                },
                                {
                                    icon: (
                                        <ThunderboltOutlined className="text-purple-500" />
                                    ),
                                    label: "Joining",
                                    value: `${application_data.joining_days_required} Days`,
                                },
                                {
                                    icon: (
                                        <DollarOutlined className="text-green-500" />
                                    ),
                                    label: "Expected CTC",
                                    value: application_data.expected_ctc,
                                },
                                {
                                    icon: (
                                        <AuditOutlined className="text-cyan-500" />
                                    ),
                                    label: "Current Phase",
                                    value: `Round ${application_data.current_round}`,
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="p-6 border-r border-gray-50 last:border-r-0 flex flex-col items-center text-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-lg">
                                        {stat.icon}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                        {stat.label}
                                    </span>
                                    <span className="text-[#071C50] font-black text-xs">
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {viewResume && (
                        <ResumeModal
                            resume={application_data.resume}
                            showModal={viewResume}
                            setShowModal={setViewResume}
                        />
                    )}

                    {/* Current Employment Card */}
                    {application_data?.current_organization !== null && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                <BankOutlined className="text-[120px] text-[#071C50]" />
                            </div>
                            <div className="mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1681FF]">
                                    <BankOutlined />
                                </div>
                                <h3 className="text-xl font-black text-[#071C50] tracking-tight uppercase">
                                    Present Employment
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Corporation
                                    </p>
                                    <p className="text-[#071C50] font-bold text-sm tracking-tight">
                                        {application_data.current_job || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Industry Role
                                    </p>
                                    <p className="text-[#071C50] font-bold text-sm tracking-tight">
                                        {application_data.current_job_type ||
                                            "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Base Hub
                                    </p>
                                    <p className="text-[#071C50] font-bold text-sm tracking-tight">
                                        {application_data.current_job_location ||
                                            "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Active Remuneration
                                    </p>
                                    <p className="text-[#071C50] font-bold text-sm tracking-tight">
                                        {application_data.current_ctc || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Evaluations Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <StarOutlined />
                            </div>
                            <h2 className="text-2xl font-black text-[#071C50] tracking-tight uppercase">
                                System Evaluations
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Recruiter Assessment */}
                            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                                <div className="p-6 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-sm font-black text-[#071C50] uppercase tracking-widest m-0">
                                        Initial Logging Analysis
                                    </h3>
                                    <Tag className="bg-blue-600 text-white border-none rounded-lg font-black text-[9px] uppercase px-3">
                                        Recruiter
                                    </Tag>
                                </div>
                                <div className="p-8 space-y-8 flex-1">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                                Core Technical Stack
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {application_data?.primary_skills.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-3"
                                                        >
                                                            <span className="text-[#071C50] font-bold text-[11px]">
                                                                {
                                                                    item.skill_name
                                                                }
                                                            </span>
                                                            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-black">
                                                                {item?.value}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Supportive Qualifications
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {application_data?.secondary_skills.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-3"
                                                        >
                                                            <span className="text-gray-500 font-bold text-[11px]">
                                                                {
                                                                    item.skill_name
                                                                }
                                                            </span>
                                                            <span className="bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-black">
                                                                {item?.value}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="my-0 border-gray-50" />
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            Final Narrative
                                        </h4>
                                        <p className="text-gray-600 text-sm italic leading-relaxed">
                                            " {application_data.other_details} "
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Interview Rounds */}
                            {application_data.candidate_evaluation &&
                                Object.entries(
                                    application_data.candidate_evaluation
                                ).map(([roundNum, evaluations]) => (
                                    <React.Fragment key={roundNum}>
                                        {evaluations.map((item, index) => {
                                            const pSkills = parseSkillRating(
                                                JSON.parse(
                                                    item.primary_skills_rating
                                                )
                                            );
                                            const sSkills = parseSkillRating(
                                                JSON.parse(
                                                    item.secondary_skills_rating
                                                )
                                            );

                                            return (
                                                <div
                                                    className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all"
                                                    key={index}
                                                >
                                                    <div className="p-6 bg-[#001744] text-white flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                            <h3 className="text-sm font-black uppercase tracking-widest m-0">
                                                                Phase {roundNum}{" "}
                                                                Intelligence
                                                            </h3>
                                                            <span className="text-[9px] font-bold text-white/50 italic">
                                                                Evaluated by:{" "}
                                                                {
                                                                    item.interviewer_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <CheckCircleOutlined className="text-green-400 text-xl" />
                                                    </div>
                                                    <div className="p-8 space-y-8">
                                                        <div className="space-y-6">
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                                                                    <ThunderboltOutlined />{" "}
                                                                    Verified
                                                                    Proficiencies
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {Object.entries(
                                                                        pSkills
                                                                    ).map(
                                                                        ([
                                                                            skill,
                                                                            val,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    skill
                                                                                }
                                                                                className="flex justify-between items-center group"
                                                                            >
                                                                                <span className="text-[#071C50] font-bold text-xs">
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>
                                                                                <Rate
                                                                                    count={
                                                                                        10
                                                                                    }
                                                                                    value={Number(
                                                                                        val
                                                                                    )}
                                                                                    disabled
                                                                                    className="text-blue-500 text-xs"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                                    <AuditOutlined />{" "}
                                                                    Peripheral
                                                                    Attributes
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {Object.entries(
                                                                        sSkills
                                                                    ).map(
                                                                        ([
                                                                            skill,
                                                                            val,
                                                                        ]) => (
                                                                            <div
                                                                                key={
                                                                                    skill
                                                                                }
                                                                                className="flex justify-between items-center group"
                                                                            >
                                                                                <span className="text-gray-500 font-bold text-xs">
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>
                                                                                <Rate
                                                                                    count={
                                                                                        10
                                                                                    }
                                                                                    value={Number(
                                                                                        val
                                                                                    )}
                                                                                    disabled
                                                                                    className="text-gray-300 text-xs"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider className="my-0 border-gray-50" />
                                                        <div className="space-y-3">
                                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                                Interviewer
                                                                Verdict
                                                            </h4>
                                                            <p className="text-gray-600 font-medium text-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-50 leading-relaxed italic">
                                                                {item.remarks}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewApplication;
