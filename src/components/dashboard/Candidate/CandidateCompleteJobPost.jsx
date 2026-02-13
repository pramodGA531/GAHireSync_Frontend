import React, { useEffect, useState } from "react";
import ViewJobPost from "../../common/ViewJobPost";
import Main from "./Layout";
import { useParams } from "react-router-dom";
import { useAuth } from "../../common/useAuth";
import { Breadcrumb } from "antd";
import Pageloading from "../../common/loading/Pageloading";
import GoBack from "../../common/Goback";

const CandidateCompleteJobPost = () => {
    const { job_id } = useParams();
    const { token, apiurl } = useAuth();
    const [job, setJob] = useState();
    const [interviewers, setInterviewers] = useState();
    const [loading, setLoading] = useState(true);

    const fetchJobDetails = async () => {
        if (token) {
            setLoading(true);
            try {
                const response = await fetch(
                    `${apiurl}/candidate/complete-job-details/?job_id=${job_id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const data = await response.json();
                setJob(data.job);
                setInterviewers(data.job?.interview_details);
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
        <Main defaultSelectedKey="2">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            {loading ? (
                <Pageloading />
            ) : job ? (
                <>
                    <div className="m-4 -mb-1">
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: "Selected Jobs",
                                    href: "/candidate/selected_jobs",
                                },
                                {
                                    title: "Job Details",
                                },
                            ]}
                        />
                    </div>
                    <ViewJobPost
                        id={job_id}
                        job={job}
                        interviewers={interviewers}
                        hideAssigned={true}
                    />
                </>
            ) : null}
        </Main>
    );
};

export default CandidateCompleteJobPost;
