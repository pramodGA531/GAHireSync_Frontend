import React, { useEffect, useState } from "react";
import ViewJobPostOutsider from "../common/ViewJobPostOutsider";
import { useParams } from "react-router-dom";
import { useAuth } from "../common/useAuth";
import Pageloading from "../common/loading/Pageloading";

const CompleteJobPostOutsider = () => {
    const { id } = useParams();
    const { apiurl } = useAuth();
    const [job, setJob] = useState();
    const [loading, setLoading] = useState(true);

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/job-details/outsider/?job_id=${id}`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            setJob(data.job);
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    return (
        <div className="p-5 pl-[10%] mt-[5%]" defaultSelectedKey="2">
            {loading ? (
                <Pageloading />
            ) : job ? (
                <>
                    <ViewJobPostOutsider id={id} job={job} />
                </>
            ) : null}
        </div>
    );
};

export default CompleteJobPostOutsider;
