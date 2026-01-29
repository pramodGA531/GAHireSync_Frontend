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
                }
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
        reviewData?.primary_skills_rating || "{}"
    );
    const secondarySkills = parseSkills(
        reviewData?.secondary_skills_rating || "{}"
    );

    return (
        <div className="bg-white rounded-[40px] p-2 md:p-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-[#071C50] text-white p-10 rounded-[48px] shadow-2xl shadow-blue-900/10 mb-10 overflow-hidden relative">
                <div className="absolute right-[-30px] top-[-30px] opacity-10 rotate-12 scale-150">
                    <SafetyCertificateOutlined className="text-[180px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                <AuditOutlined className="text-2xl text-blue-300" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase m-0">
                                    Performance Scorecard
                                </h2>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">
                                    Operational Evaluation Data Log
                                </p>
                            </div>
                        </div>
                        <Tag
                            className={`border-none rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest ${
                                reviewData?.status?.toLowerCase() === "selected"
                                    ? "bg-green-500 text-white"
                                    : reviewData?.status?.toLowerCase() ===
                                      "rejected"
                                    ? "bg-red-500 text-white"
                                    : "bg-amber-500 text-white"
                            }`}
                        >
                            Result: {reviewData?.status}
                        </Tag>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Primary Skills */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <RocketOutlined className="text-[#1681FF] text-xl" />
                            <h3 className="text-sm font-black text-[#071C50] uppercase tracking-widest m-0">
                                Primary Proficiencies
                            </h3>
                        </div>
                        <div className="space-y-5 bg-blue-50/20 p-8 rounded-[32px] border border-blue-100/50">
                            {primarySkills.length > 0 ? (
                                primarySkills.map((skill) => (
                                    <div key={skill.id} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[#071C50] font-bold text-xs tracking-tight">
                                                {skill.name}
                                            </span>
                                            <span className="text-[10px] font-black text-[#1681FF] bg-blue-100/50 px-2 py-0.5 rounded-lg">
                                                {skill.rating} / 10
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-blue-100/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#1681FF] rounded-full transition-all duration-1000 ease-out"
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
                                <p className="text-gray-400 font-bold text-xs italic text-center py-4">
                                    No primary metrics logged.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Secondary Skills */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AppstoreOutlined className="text-amber-500 text-xl" />
                            <h3 className="text-sm font-black text-[#071C50] uppercase tracking-widest m-0">
                                Auxiliary Credentials
                            </h3>
                        </div>
                        <div className="space-y-5 bg-amber-50/10 p-8 rounded-[32px] border border-amber-100/30">
                            {secondarySkills.length > 0 ? (
                                secondarySkills.map((skill) => (
                                    <div key={skill.id} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-600 font-bold text-xs tracking-tight">
                                                {skill.name}
                                            </span>
                                            <span className="text-[10px] font-black text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-lg">
                                                {skill.rating} / 10
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-amber-100/30 rounded-full overflow-hidden">
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
                                <p className="text-gray-400 font-bold text-xs italic text-center py-4">
                                    No secondary metrics found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Remarks Section */}
                <div className="bg-slate-50/50 p-10 rounded-[40px] border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <FormOutlined className="text-[#071C50] text-xl" />
                        <h3 className="text-sm font-black text-[#071C50] uppercase tracking-widest m-0">
                            Interviewer Narrative
                        </h3>
                    </div>
                    <div className="relative p-8 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[120px]">
                        <div className="absolute top-4 right-6 opacity-5 grayscale">
                            <CheckCircleOutlined className="text-6xl text-green-500" />
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed italic relative z-10">
                            "{" "}
                            {reviewData?.remarks ||
                                "Operational logs indicate no descriptive narrative recorded for this session."}{" "}
                            "
                        </p>
                    </div>
                </div>

                <div className="pt-4 pb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#071C50] text-white">
                        <CheckCircleOutlined className="text-blue-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            Verified Evaluation Complete
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewerReview;
