import React, { useState } from "react";
import { Input, Button, Modal } from "antd";
import OrganizationTerms from "./OrganizationTerms";
import FillJobDetails from "./FillJobDetails";
import FillIntervieweDetails from "./FillIntervieweDetails";
import Pageloading from "../../../common/loading/Pageloading";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import DOMPurify from "dompurify";
import { message } from "antd";
import ConnectOrganization from "./ConnectOrganization";
import GoBack from "../../../common/Goback";
const JobPosting = () => {
    const { apiurl, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [connectionId, setConnectionId] = useState();
    const [currentStep, setCurrentStep] = useState(1);
    const [termsData, setTermsData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [interviewRounds, setInterviewRounds] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [primarySkills, setPrimarySkills] = useState([]);
    const [sumbitLoading, setSubmitLoading] = useState(false);
    const [secondarySkills, setSecondarySkills] = useState([]);

    const [formValues, setFormValues] = useState({
        job_code: "",
        job_title: "",
        description_file: "",
        job_department: "",
        job_description: "",
        years_of_experience: "",
        ctc: "",
        job_type: "",
        job_level: "",
        qualifications: "",
        timings: "",
        other_benefits: "",
        working_days_per_week: "",
        notice_time: "",
        decision_maker: "",
        decision_maker_email: "",
        bond: "",
        rotational_shift: "",
        notice_period: "",
        age: "",
        gender: "",
        industry: "",
        differently_abled: "",
        languages: "",
        visa_status: "",
        probation_type: "",
        probation_period: "",
        time_period: "",
        consultant_time_period: "",
        passport_availability: "",
    });

    const handleJobPostingSubmit = async () => {
        // Validate interview rounds
        if (interviewRounds && interviewRounds.length > 0) {
            for (let i = 0; i < interviewRounds.length; i++) {
                if (!interviewRounds[i].id) {
                    message.error(
                        `Please select an interviewer for round ${interviewRounds[i].round_num}`,
                    );
                    setSubmitLoading(false);
                    return;
                }
            }
        }

        const payload = new FormData();
        // console.log("form values", formValues);
        setSubmitLoading(true);
        try {
            // Append basic job fields from formValues
            for (const key in formValues) {
                if (key === "description_file") continue;
                payload.append(key, formValues[key]);
            }

            const file = formValues.description_file;
            if (file) {
                if (file instanceof File) {
                    payload.append("description_file", file);
                } else if (typeof file === "string") {
                    payload.append("description_file_url", file);
                }
            }

            // Append company code
            payload.append("connection_id", connectionId);

            // Append terms data (if it's a file or JSON string)
            if (termsData) {
                if (
                    typeof termsData === "object" &&
                    termsData instanceof File
                ) {
                    payload.append("terms_data", termsData); // File case
                } else {
                    payload.append("terms_data", JSON.stringify(termsData)); // JSON case
                }
            }

            payload.append("interview_rounds", JSON.stringify(interviewRounds));

            // Append primary skills
            payload.append("primary_skills", JSON.stringify(primarySkills));

            // Append secondary skills
            payload.append("secondary_skills", JSON.stringify(secondarySkills));

            // Append location data
            payload.append("location_data", JSON.stringify(locationData));
            console.log("job data", payload);
            const response = await fetch(`${apiurl}/job-postings/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // If you're using auth
                },
                body: payload,
            });

            const data = await response.json();
            console.log("data", data);
            if (!response.ok) {
                throw new Error(data?.error || "Job posting failed");
            }

            message.success("Job posted successfully!");
            setShowReviewModal(false);
            setSubmitLoading(false);
            navigate(-1);
        } catch (e) {
            console.error("Job Posting Error:", e);
            message.error("Failed to submit job post");
            setSubmitLoading(false);
        }
    };

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
            {loading ? (
                <Pageloading />
            ) : (
                <div>
                    <div className="mt-4 -ml-2 -mb-6">
                        <GoBack />
                    </div>

                    <h2 className="text-[28px] text-[#171A1F] font-semibold m-4">
                        Create a JobPost
                    </h2>

                    <div>
                        {currentStep === 1 && (
                            <div>
                                <ConnectOrganization
                                    setCurrentStep={setCurrentStep}
                                    setConnectionId={setConnectionId}
                                />
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div>
                                <OrganizationTerms
                                    setCurrentStep={setCurrentStep}
                                    connectionId={connectionId}
                                    termsData={termsData}
                                    setTermsData={setTermsData}
                                    setInterviewRounds={setInterviewRounds}
                                    setPrimarySkills={setPrimarySkills}
                                    setSecondarySkills={setSecondarySkills}
                                    setLocationData={setLocationData}
                                    setFormValues={setFormValues}
                                />
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="mt-5">
                                <FillJobDetails
                                    setCurrentStep={setCurrentStep}
                                    setFormValues={setFormValues}
                                    formValues={formValues}
                                    termsData={termsData}
                                    locationData={locationData}
                                    primarySkills={primarySkills}
                                    setPrimarySkills={setPrimarySkills}
                                    setSecondarySkills={setSecondarySkills}
                                    setLocationData={setLocationData}
                                    secondarySkills={secondarySkills}
                                    connectionId={connectionId}
                                ></FillJobDetails>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div>
                                <FillIntervieweDetails
                                    interviewRounds={interviewRounds}
                                    setInterviewRounds={setInterviewRounds}
                                    connectionId={connectionId}
                                />
                                <div className="mt-[15px] pb-5 mx-auto px-4 md:px-[30px] flex justify-between items-center w-full md:w-1/2">
                                    <Button onClick={() => setCurrentStep(3)}>
                                        Previous
                                    </Button>
                                    <Button
                                        loading={loading}
                                        style={{ marginLeft: 10 }}
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => setShowReviewModal(true)}
                                    >
                                        Submit Job Posting
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <Modal
                        title="Review Job Post"
                        open={showReviewModal}
                        onCancel={() => setShowReviewModal(false)}
                        footer={[
                            <Button
                                key="cancel"
                                onClick={() => setShowReviewModal(false)}
                            >
                                Cancel
                            </Button>,
                            <Button
                                key="submit"
                                type="primary"
                                loading={sumbitLoading}
                                onClick={() =>
                                    handleJobPostingSubmit(formValues)
                                }
                            >
                                Submit
                            </Button>,
                        ]}
                        width={800}
                    >
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <h4>Basic Job Details</h4>
                            <p>
                                <strong>Title:</strong> {formValues.job_title}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {formValues.job_department}
                            </p>
                            <p>
                                <strong>Description:</strong>{" "}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            formValues.job_description,
                                        ),
                                    }}
                                />
                            </p>
                            <p>
                                <strong>Primary Skills:</strong>{" "}
                                {primarySkills
                                    ?.map((skill) => skill.skill_name || skill)
                                    .join(", ")}
                            </p>
                            <p>
                                <strong>Secondary Skills:</strong>{" "}
                                {secondarySkills
                                    ?.map((skill) => skill.skill_name || skill)
                                    .join(", ")}
                            </p>
                            <p>
                                <strong>Experience:</strong>{" "}
                                {Array.isArray(formValues.years_of_experience)
                                    ? formValues.years_of_experience.join(" - ")
                                    : formValues.years_of_experience}{" "}
                                years
                            </p>
                            <p>
                                <strong>CTC:</strong>{" "}
                                {Array.isArray(formValues.ctc)
                                    ? formValues.ctc.join(" - ")
                                    : formValues.ctc}{" "}
                                LPA
                            </p>
                            <p>
                                <strong>Job Locations:</strong>{" "}
                                {Array.isArray(locationData)
                                    ? locationData
                                          .map((l) => l.location)
                                          .join(", ")
                                    : formValues.job_locations}
                            </p>
                            <p>
                                <strong>Job Type:</strong> {formValues.job_type}
                            </p>
                            <p>
                                <strong>Industry:</strong> {formValues.industry}
                            </p>
                            <p>
                                <strong>Languages:</strong>{" "}
                                {formValues.languages}
                            </p>
                            <p>
                                <strong>Bond:</strong> {formValues.bond}
                            </p>
                            <p>
                                <strong>Decision Maker:</strong>{" "}
                                {formValues.decision_maker} (
                                {formValues.decision_maker_email})
                            </p>
                            <hr />

                            <h4>Other Details</h4>
                            <p>
                                <strong>Working Days:</strong>{" "}
                                {formValues.working_days_per_week}
                            </p>
                            <p>
                                <strong>Notice Period:</strong>{" "}
                                {formValues.notice_period}
                            </p>
                            <p>
                                <strong>Notice Time:</strong>{" "}
                                {formValues.notice_time}
                            </p>
                            <p>
                                <strong>Rotational Shift:</strong>{" "}
                                {formValues.rotational_shift}
                            </p>
                            <p>
                                <strong>Visa Status:</strong>{" "}
                                {formValues.visa_status}
                            </p>

                            <hr />
                            <h4>Interview Rounds</h4>
                            {interviewRounds?.length > 0 ? (
                                interviewRounds.map((round, index) => (
                                    <div key={index}>
                                        <p>
                                            <strong>Round </strong> {index + 1}
                                            :{" "}
                                        </p>
                                        <p>
                                            <strong>Interviewer Name : </strong>
                                            {round.interviewer_name}
                                        </p>
                                        <p>
                                            <strong>
                                                Type of interview :{" "}
                                            </strong>
                                            {round.type_of_interview}
                                        </p>
                                        <p>
                                            <strong>
                                                Mode of interview :{" "}
                                            </strong>
                                            {round.mode_of_interview}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No rounds added</p>
                            )}
                        </div>
                    </Modal>
                </div>
            )}
        </Main>
    );
};

export default JobPosting;
