import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppCalendar from "./AppCalendar";
import { useAuth } from "./useAuth";
import { message, Button, Breadcrumb } from "antd";
import Pageloading from "./loading/Pageloading";

const InterviewCalendar = ({ title, subTitle, showBreadcrumb = true }) => {
    const { jobId } = useParams();
    const { apiurl, token, user } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            const url = jobId
                ? `${apiurl}/job-interview-calendar/${jobId}/`
                : `${apiurl}/job-interview-calendar/`;
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setInterviews(data);
            } else {
                message.error(data.error || "Failed to fetch interviews");
            }
        } catch (error) {
            console.error("Error fetching interviews:", error);
            message.error("An error occurred while fetching interviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchInterviews();
    }, [token, jobId]);

    const convertInterviewsToEvents = (interviewData) => {
        return interviewData.map((interview) => {
            const startDateTime = new Date(
                `${interview.scheduled_date}T${interview.from_time}`,
            );
            const endDateTime = new Date(
                `${interview.scheduled_date}T${interview.to_time}`,
            );

            return {
                id: interview.id,
                title: `${interview.candidate_name} - ${interview.job_title} (Round ${interview.round_num})`,
                start: startDateTime,
                end: endDateTime,
                interviewer: interview.interviewer_name,
                candidate: interview.candidate_name,
                jobTitle: interview.job_title,
                status: interview.status,
            };
        });
    };

    return (
        <div className="p-6 bg-[#F9FAFB] min-h-screen">
            {showBreadcrumb && (
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            {
                                title:
                                    user?.role === "client"
                                        ? "Dashboard"
                                        : "Dashboard",
                            },
                            jobId
                                ? {
                                      title: "Job Details",
                                      onClick: () => navigate(-1),
                                      className:
                                          "cursor-pointer hover:text-blue-500",
                                  }
                                : null,
                            { title: "Interview Calendar" },
                        ].filter(Boolean)}
                    />
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[#071C50] m-0">
                            {title ||
                                (jobId
                                    ? "Job Interview Calendar"
                                    : "My Interview Calendar")}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {subTitle ||
                                (jobId
                                    ? `Viewing interviews for Job ID: ${jobId}`
                                    : "Viewing all your scheduled interviews")}
                        </p>
                    </div>
                    <Button
                        type="primary"
                        onClick={fetchInterviews}
                        loading={loading}
                    >
                        Refresh Data
                    </Button>
                </div>

                {loading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Pageloading />
                    </div>
                ) : (
                    <div className="w-full overflow-hidden min-h-[600px]">
                        <AppCalendar
                            events={convertInterviewsToEvents(interviews)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewCalendar;
