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
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
            {application_data && (
                <>
                    {/* Hero Information Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 overflow-hidden">
                        <div className="p-6 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1681FF] to-[#0061D5] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-100">
                                    {application_data.candidate_name?.[0]}
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <h2 className="text-3xl font-bold text-[#071C50] tracking-tight mb-1">
                                            {application_data.candidate_name}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-blue-50 text-[#1681FF] text-xs font-semibold px-3 py-1 rounded-full border border-blue-100">
                                                {
                                                    application_data.job_department
                                                }
                                            </span>
                                            <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full border border-amber-100">
                                                {
                                                    application_data.application_status
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div
                                            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg group hover:bg-white border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(
                                                    application_data.candidate_email,
                                                    "Email",
                                                )
                                            }
                                        >
                                            <MailOutlined className="text-blue-500" />
                                            <span className="text-gray-500 font-medium text-sm">
                                                {
                                                    application_data.candidate_email
                                                }
                                            </span>
                                            <CopyOutlined className="text-gray-300 group-hover:text-blue-400" />
                                        </div>
                                        <div
                                            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg group hover:bg-white border border-transparent hover:border-blue-100 transition-all cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(
                                                    application_data.candidate_phone,
                                                    "Phone",
                                                )
                                            }
                                        >
                                            <PhoneOutlined className="text-green-500" />
                                            <span className="text-gray-500 font-medium text-sm">
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
                                    className="h-12 px-8 rounded-xl bg-[#001744] hover:bg-[#002b7a] font-bold text-sm shadow-lg shadow-blue-50 border-none flex items-center gap-3"
                                >
                                    View Resume
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-6 border-t border-gray-50 bg-gray-50/20">
                            {[
                                {
                                    icon: (
                                        <SafetyCertificateOutlined className="text-blue-500" />
                                    ),
                                    label: "Education",
                                    value: application_data.highest_qualification,
                                },
                                {
                                    icon: (
                                        <CalendarOutlined className="text-red-500" />
                                    ),
                                    label: "Date of Birth",
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
                                    label: "Joining Time",
                                    value: `${application_data.joining_days_required} Days`,
                                },
                                {
                                    icon: (
                                        <DollarOutlined className="text-green-500" />
                                    ),
                                    label: "Expected Salary",
                                    value: application_data.expected_ctc,
                                },
                                {
                                    icon: (
                                        <AuditOutlined className="text-cyan-500" />
                                    ),
                                    label: "Current Stage",
                                    value: `Round ${application_data.current_round}`,
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="p-4 border-r border-gray-50 last:border-r-0 flex flex-col items-center text-center gap-1.5"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-base">
                                        {stat.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                    <span className="text-[#071C50] font-bold text-xs">
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
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm relative overflow-hidden group">
                            <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                                <BankOutlined className="text-[120px] text-[#071C50]" />
                            </div>
                            <div className="mb-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1681FF]">
                                    <BankOutlined />
                                </div>
                                <h3 className="text-lg font-bold text-[#071C50] tracking-tight">
                                    Current Job
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Company
                                    </p>
                                    <p className="text-[#071C50] font-semibold text-sm">
                                        {application_data.current_job || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Job Title
                                    </p>
                                    <p className="text-[#071C50] font-semibold text-sm">
                                        {application_data.current_job_type ||
                                            "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Current Location
                                    </p>
                                    <p className="text-[#071C50] font-semibold text-sm">
                                        {application_data.current_job_location ||
                                            "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Current Salary
                                    </p>
                                    <p className="text-[#071C50] font-semibold text-sm">
                                        {application_data.current_ctc || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Evaluations Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <StarOutlined />
                            </div>
                            <h2 className="text-xl font-bold text-[#071C50] tracking-tight">
                                Interview Feedback
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recruiter Assessment */}
                            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                                <div className="p-5 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-[#071C50] uppercase tracking-wider m-0">
                                        Recruiter Notes
                                    </h3>
                                    <Tag className="bg-blue-600 text-white border-none rounded-lg font-bold text-[10px] uppercase px-3">
                                        Recruiter
                                    </Tag>
                                </div>
                                <div className="p-6 space-y-6 flex-1">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                                                Primary Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {application_data?.primary_skills.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-blue-50/50 border border-blue-100 px-3 py-1 rounded-xl flex items-center gap-2"
                                                        >
                                                            <span className="text-[#071C50] font-semibold text-[11px]">
                                                                {
                                                                    item.skill_name
                                                                }
                                                            </span>
                                                            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                                {item?.value}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Secondary Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {application_data?.secondary_skills.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-xl flex items-center gap-2"
                                                        >
                                                            <span className="text-gray-500 font-semibold text-[11px]">
                                                                {
                                                                    item.skill_name
                                                                }
                                                            </span>
                                                            <span className="bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                                {item?.value}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="my-0 border-gray-50" />
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Recruiter Remarks
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
                                    application_data.candidate_evaluation,
                                ).map(([roundNum, evaluations]) => (
                                    <React.Fragment key={roundNum}>
                                        {evaluations.map((item, index) => {
                                            const pSkills = parseSkillRating(
                                                JSON.parse(
                                                    item.primary_skills_rating,
                                                ),
                                            );
                                            const sSkills = parseSkillRating(
                                                JSON.parse(
                                                    item.secondary_skills_rating,
                                                ),
                                            );

                                            return (
                                                <div
                                                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                                                    key={index}
                                                >
                                                    <div className="p-5 bg-[#001744] text-white flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                            <h3 className="text-xs font-bold uppercase tracking-wider m-0">
                                                                Round {roundNum}{" "}
                                                                Review
                                                            </h3>
                                                            <span className="text-[10px] font-medium text-white/60 italic">
                                                                Evaluated by:{" "}
                                                                {
                                                                    item.interviewer_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <CheckCircleOutlined className="text-green-400 text-lg" />
                                                    </div>
                                                    <div className="p-6 space-y-6">
                                                        <div className="space-y-5">
                                                            <div className="space-y-3">
                                                                <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-2">
                                                                    <ThunderboltOutlined />{" "}
                                                                    Main Skills
                                                                </h4>
                                                                <div className="space-y-2.5">
                                                                    {Object.entries(
                                                                        pSkills,
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
                                                                                <span className="text-[#071C50] font-semibold text-xs">
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>
                                                                                <Rate
                                                                                    count={
                                                                                        10
                                                                                    }
                                                                                    value={Number(
                                                                                        val,
                                                                                    )}
                                                                                    disabled
                                                                                    className="text-blue-500 text-[10px]"
                                                                                />
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                                    <AuditOutlined />{" "}
                                                                    Other
                                                                    Attributes
                                                                </h4>
                                                                <div className="space-y-2.5">
                                                                    {Object.entries(
                                                                        sSkills,
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
                                                                                <span className="text-gray-500 font-semibold text-xs">
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>
                                                                                <Rate
                                                                                    count={
                                                                                        10
                                                                                    }
                                                                                    value={Number(
                                                                                        val,
                                                                                    )}
                                                                                    disabled
                                                                                    className="text-gray-300 text-[10px]"
                                                                                />
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider className="my-0 border-gray-50" />
                                                        <div className="space-y-2">
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                Interviewer
                                                                Remarks
                                                            </h4>
                                                            <p className="text-gray-600 font-medium text-sm bg-gray-50/50 p-4 rounded-xl border border-gray-50 leading-relaxed italic">
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
