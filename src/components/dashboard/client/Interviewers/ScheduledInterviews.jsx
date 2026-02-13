import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import { message } from "antd";
import { ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import Table from "../../../common/Table";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const InterviewCard = ({ item }) => {
    return (
        <div className="bg-white w-1/4 border-l-[10px] border-l-[#379AE6] shadow-[1px_1px_5px_rgba(0,0,0,0.5)] rounded-[15px] p-5 flex-1 min-w-[250px]">
            <div className="text-[#379AE6] text-xl font-bold mb-2.5">
                {item.interviewer_name}
            </div>
            <div className="text-[#565E6C] font-normal text-sm mb-[15px] flex flex-col gap-[5px]">
                <span className="flex gap-2.5 items-center">
                    <ClockCircleOutlined /> {item.scheduled_time}
                </span>
                <span className="flex gap-2.5 items-center">
                    <CalendarOutlined /> {item.scheduled_date}
                </span>
            </div>
            <div className="text-[#565E6C] font-normal text-sm mb-[15px] pb-[15px] border-b border-[#DEE1E6]">
                <span className="candidate-name">
                    {item.candidate_name} (Round - {item.round_num})
                </span>
            </div>
            <div className="flex gap-2.5 text-[#379AE6] font-normal text-sm">
                <span className="mode">{item.mode_of_interview}</span>
                <span className="type">{item.type_of_interview}</span>
            </div>
        </div>
    );
};

const ScheduledInterviewsClient = () => {
    const { apiurl, token } = useAuth();
    const [jobList, setJobList] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [interviewRounds, setInterviewRounds] = useState([]);
    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(false);

    const columns = [
        {
            title: "Interviewer Name",
            dataIndex: "interviewer_name",
            key: "interviewer_name",
        },
        {
            title: "Interviewer Email",
            dataIndex: "interviewer_email",
            key: "interviewer_email",
        },
        {
            title: "Round",
            dataIndex: "round_num",
            key: "round_num",
        },
        {
            title: "Mode",
            dataIndex: "mode_of_interview",
            key: "mode_of_interview",
        },
        {
            title: "Type",
            dataIndex: "type_of_interview",
            key: "type_of_interview",
        },
    ];

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/client/job-postings/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch job posts");
            const data = await response.json();
            setJobList(data.results || []);
        } catch (error) {
            message.error("Failed to fetch job posts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobList.length > 0) {
            setSelectedJobId(jobList[0].id);
            fetchScheduledInterviews(jobList[0].id);
        }
    }, [jobList]);

    // Fetch interviews for selected job
    const fetchScheduledInterviews = async (id) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/job-post/interviews/?job_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setInterviews([]);
                return;
            } else if (data.message) {
                message.success(data.message);
                setInterviews([]);
                return;
            }
            setInterviews(data.scheduled_interviews || []);
            setInterviewRounds(data.interviewers || []);
        } catch (error) {
            message.error("Failed to fetch interviews. Please try again.");
            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle job selection
    const handleJobChange = (e) => {
        const selectedId = e.target.value;
        setSelectedJobId(selectedId);
        if (selectedId) {
            fetchScheduledInterviews(selectedId);
        } else {
            setInterviews([]);
        }
    };

    // Initial fetch of job posts
    useEffect(() => {
        if (token) fetchJobPosts();
    }, [token]);

    return (
        <Main
            defaultSelectedKey="5"
            defaultSelectedChildKey="5-2"
            className="p-[30px]"
        >
            <div className="p-[30px]">
                {loading ? (
                    <Pageloading />
                ) : (
                    <>
                    {/* <div className="-ml-10 -mt-2">
                        <GoBack />
                    </div> */}
                        <div className="mb-5 flex flex-col md:flex-row items-start md:items-center gap-2">
                            <label
                                className="mr-2.5 text-black text-sm whitespace-nowrap"
                                htmlFor="jobSelect"
                            >
                                Select Job Title:
                            </label>
                            <select
                                id="jobSelect"
                                value={selectedJobId}
                                onChange={handleJobChange}
                                className="p-[5px] rounded border border-[#ccc] w-full md:min-w-[200px] text-xs text-black focus:outline-none"
                            >
                                <option value="">-- Select Job --</option>
                                {jobList.map((job) => (
                                    <option key={job.id} value={job.id}>
                                        {job.job_title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="scheduled-heading">Interview Rounds</div> */}
                        {interviewRounds.length > 0 ? (
                            <div className="interview-rounds overflow-x-auto">
                                <div className="min-w-[600px]">
                                    <Table
                                        columns={columns}
                                        data={interviewRounds}
                                        pagination={false}
                                    ></Table>
                                </div>
                            </div>
                        ) : (
                            selectedJobId && (
                                <p className="text-center mt-5 text-[#888]">
                                    No interview rounds for this job.
                                </p>
                            )
                        )}

                        <div className="my-[10px] pb-[10px] mt-[30px] text-[25px] text-black font-semibold">
                            Scheduled Interviews
                        </div>

                        {interviews.length > 0 ? (
                            <div className="flex flex-wrap gap-4 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                                {interviews.map((item, idx) => (
                                    <InterviewCard key={idx} item={item} />
                                ))}
                            </div>
                        ) : (
                            selectedJobId && (
                                <p className="text-center mt-5 text-[#888]">
                                    No interviews scheduled for this job.
                                </p>
                            )
                        )}
                    </>
                )}
            </div>
        </Main>
    );
};

export default ScheduledInterviewsClient;
