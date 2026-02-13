import { useEffect, useState } from "react";
import { useAuth } from "../../../../common/useAuth";
import { message, Rate, Tag, Divider } from "antd";
import {
    SafetyCertificateOutlined,
    AppstoreOutlined,
    FormOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    AuditOutlined,
    RocketOutlined,
} from "@ant-design/icons";

const InterviewerReview = ({ id }) => {
    const { apiurl, token } = useAuth();
    const [reviewData, setReviewData] = useState(null);

    const fetchInterviewResult = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/get-interview-marks/?interview_id=${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) message.error(data.error);
            else setReviewData(data);
        } catch (e) {
            message.error("Failed to retrieve scorecard.");
        }
    };

    useEffect(() => {
        if (token) fetchInterviewResult(id);
    }, [token, id]);

    const parseSkills = (skillString) => {
        if (!skillString) return [];
        try {
            const parsed = JSON.parse(skillString.replace(/'/g, '"'));
            return Object.entries(parsed).map(([name, rating], index) => ({
                id: index,
                name,
                rating,
            }));
        } catch (e) {
            return [];
        }
    };

    const primarySkills = parseSkills(
        reviewData?.primary_skills_rating || "{}",
    );
    const secondarySkills = parseSkills(
        reviewData?.secondary_skills_rating || "{}",
    );

    return (
        <div className="bg-white rounded-[40px] p-2 md:p-6 animate-in fade-in duration-700">
            {/* Minimalist Header */}
            <div className="bg-[#b7eafb] border border-slate-100 p-10 rounded-[48px] shadow-sm mb-10 overflow-hidden relative">
                <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] rotate-12 scale-150 pointer-events-none">
                    {/* <SafetyCertificateOutlined className="text-[180px] text-slate-900" /> */}
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <AuditOutlined className="text-2xl text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-800 uppercase m-0">
                                Interview Results
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                Interview details and feedback
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 px-1">
                            Current Status
                        </span>
                        <Tag
                            className={`border-none rounded-xl px-5 py-2 font-black text-[10px] uppercase tracking-widest shadow-sm ${
                                reviewData?.status?.toLowerCase() === "selected"
                                    ? "bg-green-50 text-green-600"
                                    : reviewData?.status?.toLowerCase() ===
                                        "rejected"
                                      ? "bg-red-50 text-red-600"
                                      : "bg-amber-50 text-amber-600"
                            }`}
                        >
                            {reviewData?.status}
                        </Tag>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Core Skills */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                <RocketOutlined className="text-blue-500 text-sm" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] m-0">
                                Core Skills
                            </h3>
                        </div>
                        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            {primarySkills.length > 0 ? (
                                primarySkills.map((skill) => (
                                    <div key={skill.id} className="group">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <span className="text-slate-700 font-bold text-xs tracking-tight">
                                                {skill.name}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                                {skill.rating}/10
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${
                                                        (skill.rating / 10) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest text-center py-4">
                                    No core skills recorded
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Skills */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                <AppstoreOutlined className="text-amber-500 text-sm" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] m-0">
                                Additional Skills
                            </h3>
                        </div>
                        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            {secondarySkills.length > 0 ? (
                                secondarySkills.map((skill) => (
                                    <div key={skill.id} className="group">
                                        <div className="flex justify-between items-center mb-2.5">
                                            <span className="text-slate-700 font-bold text-xs tracking-tight">
                                                {skill.name}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                                {skill.rating}/10
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                            <div
                                                className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${
                                                        (skill.rating / 10) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest text-center py-4">
                                    No additional skills recorded
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Remarks Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                            <FormOutlined className="text-slate-400 text-sm" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] m-0">
                            Interviewer's Remarks
                        </h3>
                    </div>
                    <div className="relative p-10 bg-slate-50/30 rounded-[40px] border border-slate-100 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] grayscale pointer-events-none">
                            <CheckCircleOutlined className="text-8xl text-slate-900" />
                        </div>
                        <p className="text-slate-600 font-medium leading-[1.8] text-sm relative z-10 m-0">
                            {reviewData?.remarks ? (
                                <span className="text-slate-700 italic">
                                    "{reviewData.remarks}"
                                </span>
                            ) : (
                                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                                    No descriptive feedback provided for this
                                    session
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Footer Tag */}
                <div className="pt-6 pb-8 flex justify-center">
                    <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
                        <CheckCircleOutlined className="text-slate-300 text-sm" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                            Review Finalized
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewerReview;
