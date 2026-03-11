import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import ViewJobPost from "../../common/ViewJobPost";
import Pageloading from "../../common/loading/Pageloading";
import { Breadcrumb, Button } from "antd";
import {
    ArrowLeftOutlined,
    AuditOutlined,
    SafetyCertificateOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import GoBack from "../../common/Goback";

const CompleteJobPostRecruiter = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [job, setJob] = useState(null);
    const [interviewers, setInterviewers] = useState([]);

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/recruiter/complete-job/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Fetch failed");
            setJob(data.jd);
            setInterviewers(data.jd.interview_details);
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchJobDetails();
    }, [id]);

    return (
        <Main>
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Navigation Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex flex-col gap-4">
                            <Breadcrumb
                                items={[
                                    {
                                        title: (
                                            <span
                                                onClick={() => navigate(-1)}
                                                className="text-gray-400 text-sm cursor-pointer hover:underline"
                                            >
                                                Assigned Jobs
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-gray-800 text-sm font-medium">
                                                Job Details
                                            </span>
                                        ),
                                    },
                                ]}
                            />
                            <div className="flex items-center gap-4">
                                {/* <Button
                                    onClick={() => navigate(-1)}
                                    icon={<ArrowLeftOutlined />}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center border-gray-100 shadow-sm hover:text-[#1681FF] transition-all"
                                /> */}
                                <div>
                                    <h1 className="text-3xl Text-black font-bold m-0">
                                        Job Details
                                    </h1>
                                    <p className="text-[10px] font-black text-gray-300 mt-2">
                                        Job ID: {id}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                navigate(`/agency/job-calendar/${id}`)
                            }
                            className="bg-[#1681FF] hover:bg-[#1681FF]/90 text-white border-none font-bold rounded-xl h-10 px-6"
                        >
                            View Interview Calendar
                        </Button>
                    </div>

                    {job?.is_edited_by_client && (
                        <div className="bg-linear-to-r from-[#1681FF]/10 to-[#1681FF]/5 border border-[#1681FF]/20 rounded-3xl p-6 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-[#1681FF] flex items-center justify-center shadow-lg shadow-[#1681FF]/20">
                                <InfoCircleOutlined className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="text-[#071C50] font-black uppercase tracking-tight m-0">
                                    Pending Client Edit Request
                                </h3>
                                <p className="text-[#1681FF] font-medium text-[11px] uppercase tracking-wider mt-1 m-0">
                                    Please hold on until the manager reacts to
                                    the client edit request
                                </p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="h-[60vh] flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <ViewJobPost
                                job={job}
                                interviewers={interviewers}
                            />
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-breadcrumb-premium .ant-breadcrumb-separator { color: #E5E7EB !important; font-size: 10px !important; }
            `}</style>
        </Main>
    );
};

export default CompleteJobPostRecruiter;
