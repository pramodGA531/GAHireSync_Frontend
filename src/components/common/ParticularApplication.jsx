import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const ParticularApplication = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const authToken = sessionStorage.getItem("authToken");

    const [applicationDetails, setApplicationDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authToken) {
            fetch(`${apiurl}/api/particular_application/${id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setApplicationDetails(data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching application details:", error);
                    setLoading(false);
                });
        }
    }, [id, authToken]);

    const renderSkillset = (skillset) => {
        return Object.keys(skillset).map((skillhead) =>
            Object.keys(skillset[skillhead]).map((skill) => (
                <p key={skill}>
                    <strong className="text-gray-800 font-semibold">
                        {skill}:
                    </strong>{" "}
                    {skillset[skillhead][skill]} years
                </p>
            ))
        );
    };

    const onBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="text-center text-xl text-gray-500 p-5">
                Loading...
            </div>
        );
    }

    if (!applicationDetails) {
        return (
            <div className="text-center text-xl text-gray-500 p-5">
                No application details found.
            </div>
        );
    }

    return (
        <div className="p-5 bg-gray-50 rounded-xl max-w-[960px] mx-auto flex flex-col my-5">
            <h1 className="text-4xl text-[#001744] mb-8 text-center font-bold">
                Application Details
            </h1>
            <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.1)] mb-5 p-5 flex flex-col">
                <div className="text-3xl text-[#001744] border-b-2 border-[#001744] pb-2.5 mb-4 font-bold">
                    Job Information
                </div>
                <div className="text-base text-gray-700 leading-relaxed">
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Job ID:
                            </strong>{" "}
                            {applicationDetails.job_id}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Candidate Name:
                            </strong>{" "}
                            {applicationDetails.candidate_name}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Candidate Email:
                            </strong>{" "}
                            {applicationDetails.candidate_email}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Contact Number:
                            </strong>{" "}
                            {applicationDetails.contact_number}
                        </div>
                    </div>
                    {applicationDetails.alternate_contact_number && (
                        <div className="flex flex-wrap mb-4">
                            <div className="flex-1 mr-5 last:mr-0">
                                <strong className="text-gray-800 font-semibold">
                                    Alternate Contact Number:
                                </strong>{" "}
                                {applicationDetails.alternate_contact_number}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.1)] mb-5 p-5 flex flex-col">
                <div className="text-3xl text-[#001744] border-b-2 border-[#001744] pb-2.5 mb-4 font-bold">
                    Additional Information
                </div>
                <div className="text-base text-gray-700 leading-relaxed">
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Current Organisation:
                            </strong>{" "}
                            {applicationDetails.current_organisation}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Current Job Location:
                            </strong>{" "}
                            {applicationDetails.current_job_location}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Current Job Type:
                            </strong>{" "}
                            {applicationDetails.current_job_type}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Date of Birth:
                            </strong>{" "}
                            {applicationDetails.date_of_birth}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Total Years of Experience:
                            </strong>{" "}
                            {applicationDetails.total_years_of_experience} years
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Job Status:
                            </strong>{" "}
                            {applicationDetails.job_status}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Current CTC:
                            </strong>{" "}
                            {applicationDetails.current_ctc}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Expected CTC:
                            </strong>{" "}
                            {applicationDetails.expected_ctc}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Notice Period:
                            </strong>{" "}
                            {applicationDetails.notice_period}
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-4">
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Joining Days Required:
                            </strong>{" "}
                            {applicationDetails.joining_days_required}
                        </div>
                        <div className="flex-1 mr-5 last:mr-0">
                            <strong className="text-gray-800 font-semibold">
                                Highest Qualification:
                            </strong>{" "}
                            {applicationDetails.highest_qualification}
                        </div>
                    </div>
                    <div className="flex-1 mr-5 last:mr-0">
                        <strong className="text-gray-800 font-semibold">
                            Application Status:
                        </strong>{" "}
                        {applicationDetails.status}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.1)] mb-5 p-5 flex flex-col">
                <div className="text-3xl text-[#001744] border-b-2 border-[#001744] pb-2.5 mb-4 font-bold">
                    Skill Set
                </div>
                <div className="text-base text-gray-700 leading-relaxed">
                    <div className="flex-1 mr-5 last:mr-0">
                        {applicationDetails.skillset &&
                            renderSkillset(applicationDetails.skillset)}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.1)] mb-5 p-5 flex flex-col">
                <div className="text-3xl text-[#001744] border-b-2 border-[#001744] pb-2.5 mb-4 font-bold">
                    Resume
                </div>
                <div className="text-base text-gray-700 leading-relaxed">
                    <a
                        href={`${apiurl}${applicationDetails.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-bold hover:underline"
                    >
                        View Resume
                    </a>
                </div>
            </div>
            <Button onClick={onBack}>Back</Button>
        </div>
    );
};

export default ParticularApplication;
