import React, { useEffect, useState } from "react";
import ViewJobPost from "../../common/ViewJobPost";
import Main from "./Layout";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../common/useAuth";
import Pageloading from "../../common/loading/Pageloading";
import GoBack from "../../common/Goback";
import { Breadcrumb } from "antd";
const InterviewerCompleteJobPost = () => {
    const { id } = useParams();
    const location = useLocation();
    const { token, apiurl } = useAuth();
    const [job, setJob] = useState();
    const [interviewers, setInterviewers] = useState();
    const [loading, setLoading] = useState(true);

    const fetchJobDetails = async () => {
        if (token) {
            setLoading(true);
            try {
                const response = await fetch(
                    `${apiurl}/job-details?job_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                setJob(data.job);
                setInterviewers(data.interview_details);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [token]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            {loading ? (
                <Pageloading />
            ) : job ? (
                <>
                    <div className="m-4">
                        <Breadcrumb
                            items={[
                                {
                                    title: "Job Post",
                                    href:
                                        location.state?.from ||
                                        "/interviewer/jobinterviews",
                                },
                                {
                                    title: "Job Post Details",
                                },
                            ]}
                        />
                    </div>
                    <div className="text-[#171A1F] text-[24px] font-bold mt-4 ml-[15px]">
                        Job post Details
                    </div>
                    <ViewJobPost
                        id={id}
                        job={job}
                        interviewers={interviewers}
                    />
                </>
            ) : null}
        </Main>
    );
};

export default InterviewerCompleteJobPost;
