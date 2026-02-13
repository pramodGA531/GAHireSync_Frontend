import React, { useState } from "react";
import { Input, Button, Modal, Steps } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
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
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [interviewRounds, setInterviewRounds] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [primarySkills, setPrimarySkills] = useState([]);
    const [sumbitLoading, setSubmitLoading] = useState(false);
    const [secondarySkills, setSecondarySkills] = useState([]);
    const [isChatExpanded, setIsChatExpanded] = useState(false);

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
        // ✅ put this at the TOP of PostJob.jsx (inside component or outside)
        const parseRange = (value) => {
            // array case: [5, 7]
            if (Array.isArray(value) && value.length === 2) {
                const [min, max] = value.map(Number);
                if (isNaN(min) || isNaN(max)) return null;
                return { min, max };
            }

            // string case: "2-7 LPA" or "3,4"
            if (typeof value === "string") {
                const nums = value.match(/\d+(\.\d+)?/g)?.map(Number);
                if (!nums || nums.length < 2) return null;
                return { min: nums[0], max: nums[1] };
            }

            return null;
        };

        if (!termsData || termsData.length === 0) {
            message.error("Terms data not available");
            setSubmitLoading(false);
            return;
        }

        // Aggregate CTC ranges from all terms
        let globalMin = Infinity;
        let globalMax = -Infinity;

        termsData.forEach((term) => {
            const range = parseRange(term.ctc_range);
            if (range) {
                globalMin = Math.min(globalMin, range.min);
                globalMax = Math.max(globalMax, range.max);
            }
        });

        if (globalMin === Infinity || globalMax === -Infinity) {
            message.error("Could not determine valid CTC range from terms");
            setSubmitLoading(false);
            return;
        }

        // parse payload CTC ([5,7] or "3,4")
        const payloadRange = parseRange(formValues.ctc);

        if (!payloadRange) {
            message.error("Invalid CTC format in job details");
            setSubmitLoading(false);
            return;
        }

        // compare against aggregated range
        if (payloadRange.min < globalMin || payloadRange.max > globalMax) {
            message.error(
                `CTC is out of range (${globalMin}-${globalMax} LPA expected). Please contact the agency manager.`,
            );
            setSubmitLoading(false);
            setShowTermsModal(true);
            setShowReviewModal(false);
            return;
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
    console.log("terms values", termsData);
    console.log("form values", formValues);
    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
            {loading ? (
                <Pageloading />
            ) : (
                <div>
                    {/* <div className="mt-4 -ml-2 -mb-6">
                        <GoBack />
                    </div> */}

                    <h2 className="text-[28px] text-[#171A1F] font-semibold m-4">
                        Create a JobPost
                    </h2>

                    <div className="mx-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <Steps
                            current={currentStep - 1}
                            items={[
                                {
                                    title: "Connect Organization",
                                    description: "Select Organization",
                                },
                                {
                                    title: "Terms & Conditions",
                                    description: "Review contract",
                                },
                                {
                                    title: "Job Details",
                                    description: "Post info",
                                },
                                {
                                    title: "Interview Details",
                                    description: "Set rounds",
                                },
                            ]}
                        />
                    </div>

                    <div>
                        {currentStep === 1 && (
                            <div className="m-2">
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
                                <strong>Title:</strong>{" "}
                                {formValues.job_title || "N/A"}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {formValues.job_department || "N/A"}
                            </p>
                            <p>
                                <strong>Description:</strong>{" "}
                                {formValues.job_description ? (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                formValues.job_description,
                                            ),
                                        }}
                                    />
                                ) : (
                                    "N/A"
                                )}
                            </p>
                            <p>
                                <strong>Primary Skills:</strong>{" "}
                                {primarySkills?.length > 0
                                    ? primarySkills
                                          ?.map(
                                              (skill) =>
                                                  skill.skill_name || skill,
                                          )
                                          .join(", ")
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Secondary Skills:</strong>{" "}
                                {secondarySkills?.length > 0
                                    ? secondarySkills
                                          ?.map(
                                              (skill) =>
                                                  skill.skill_name || skill,
                                          )
                                          .join(", ")
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Experience:</strong>{" "}
                                {formValues.years_of_experience
                                    ? typeof formValues.years_of_experience ===
                                          "string" &&
                                      formValues.years_of_experience.startsWith(
                                          "[",
                                      )
                                        ? (() => {
                                              try {
                                                  const cleaned =
                                                      formValues.years_of_experience.replace(
                                                          /None/g,
                                                          "null",
                                                      );
                                                  return JSON.parse(cleaned)
                                                      .map((v) =>
                                                          v === null ? "0" : v,
                                                      )
                                                      .join(" - ");
                                              } catch (e) {
                                                  return formValues.years_of_experience;
                                              }
                                          })()
                                        : formValues.years_of_experience
                                    : "N/A"}{" "}
                                years
                            </p>

                            <p>
                                <strong>CTC:</strong>{" "}
                                {(() => {
                                    const ctc = formValues.ctc;
                                    if (Array.isArray(ctc)) {
                                        return ctc
                                            .filter((v) => v !== null)
                                            .join(" - ");
                                    }
                                    if (typeof ctc === "string") {
                                        try {
                                            const cleaned = ctc.replace(
                                                /None/g,
                                                "null",
                                            );
                                            const parsed = JSON.parse(cleaned);
                                            if (Array.isArray(parsed)) {
                                                return parsed
                                                    .filter((v) => v !== null)
                                                    .join(" - ");
                                            }
                                        } catch (e) {
                                            return ctc
                                                .replace(/[\[\]]/g, "")
                                                .replace(",", " - ");
                                        }
                                        return ctc;
                                    }
                                    return ctc || "N/A";
                                })()}{" "}
                                LPA
                            </p>

                            <p>
                                <strong>Job Locations:</strong>{" "}
                                {Array.isArray(locationData) &&
                                locationData.length > 0
                                    ? locationData
                                          .map((l) => l.location)
                                          .join(", ")
                                    : formValues.job_locations || "N/A"}
                            </p>
                            <p>
                                <strong>Job Type:</strong>{" "}
                                {formValues.job_type || "N/A"}
                            </p>
                            <p>
                                <strong>Industry:</strong>{" "}
                                {formValues.industry || "N/A"}
                            </p>
                            <p>
                                <strong>Languages:</strong>{" "}
                                {formValues.languages || "N/A"}
                            </p>
                            <p>
                                <strong>Bond:</strong>{" "}
                                {formValues.bond || "N/A"}
                            </p>
                            <p>
                                <strong>Decision Maker:</strong>{" "}
                                {formValues.decision_maker
                                    ? `${formValues.decision_maker} (${formValues.decision_maker_email || "N/A"})`
                                    : "N/A"}
                            </p>
                            <hr />

                            <h4>Other Details</h4>
                            <p>
                                <strong>Working Days:</strong>{" "}
                                {formValues.working_days_per_week || "N/A"}
                            </p>
                            <p>
                                <strong>Notice Period:</strong>{" "}
                                {formValues.notice_period || "N/A"}
                            </p>
                            <p>
                                <strong>Notice Time:</strong>{" "}
                                {formValues.notice_time || "N/A"}
                            </p>

                            <p>
                                <strong>Rotational Shift:</strong>{" "}
                                {formValues.rotational_shift !== null &&
                                formValues.rotational_shift !== undefined &&
                                formValues.rotational_shift !== ""
                                    ? formValues.rotational_shift
                                        ? "Yes"
                                        : "No"
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>Visa Status:</strong>{" "}
                                {formValues.visa_status || "N/A"}
                            </p>
                            <p>
                                <strong>Gender:</strong>{" "}
                                {formValues.gender || "N/A"}
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

                    <Modal
                        title="Terms & Conditions"
                        open={showTermsModal}
                        onOk={() => setShowTermsModal(false)}
                        onCancel={() => setShowTermsModal(false)}
                        footer={null}
                        width={800}
                    >
                        {termsData && termsData.length > 0 ? (
                            termsData.map((term, index) => (
                                <div key={index} className="mb-4">
                                    <h4 className="text-red-600">
                                        Make sure your job details are with in
                                        the Terms and Conditions
                                    </h4>
                                    <h4 className="mb-2">
                                        {term.is_negotiated
                                            ? "Negotiated Terms"
                                            : `Terms & Conditions - ${index + 1}`}
                                    </h4>
                                    <div className="border rounded p-3">
                                        <p>
                                            <strong>CTC Range:</strong>{" "}
                                            {term.ctc_range || "N/A"}
                                        </p>
                                        <p>
                                            <strong>Interest:</strong>{" "}
                                            {term.interest_percentage}%
                                        </p>
                                        {term.service_fee_type ===
                                        "percentage" ? (
                                            <p>
                                                <strong>Service Fee:</strong>{" "}
                                                {term.service_fee}%
                                            </p>
                                        ) : (
                                            <p>
                                                <strong>Service Fee:</strong>{" "}
                                                {term.service_fee}/-
                                            </p>
                                        )}
                                        <p>
                                            <strong>Invoice After:</strong>{" "}
                                            {term.invoice_after}
                                        </p>
                                        <p>
                                            <strong>Payment Terms:</strong>{" "}
                                            {term.payment_terms}
                                        </p>
                                        <p>
                                            <strong>Replacement Clause:</strong>{" "}
                                            {term.replacement_clause}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No terms data available</p>
                        )}
                    </Modal>
                </div>
            )}

            {/* Expandable Floating Button and Panel */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Expandable Panel */}
                <div
                    className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out overflow-hidden mb-4 ${
                        isChatExpanded
                            ? "w-[396px] h-[590px] opacity-100"
                            : "w-0 h-0 opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-800">
                            Generative job description
                        </h3>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => setIsChatExpanded(false)}
                            className="hover:bg-gray-200 rounded-full"
                        />
                    </div>
                    <div className="p-6 h-[calc(70vh-64px)] overflow-y-auto">
                        <div className="ml-10 mt-12 text-indigo-700 p-4 self-center rounded-xl mb-4 text-sm">
                            <svg
                                width="242"
                                height="180"
                                viewBox="0 0 242 180"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M85 27C85 17.0589 93.0589 9 103 9H136.044C140.818 9 145.396 10.8964 148.772 14.2721L160.728 26.2279C164.104 29.6036 166 34.1819 166 38.9558V81C166 90.9411 157.941 99 148 99H103C93.0589 99 85 90.9411 85 81V27Z"
                                    stroke="#CBDCEC"
                                    stroke-width="6.75"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M107.5 31.5L143.5 31.5"
                                    stroke="#CBDCEC"
                                    stroke-width="6.75"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M107.5 54H143.5"
                                    stroke="#CBDCEC"
                                    stroke-width="6.75"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M107.5 76.5H125.5"
                                    stroke="#CBDCEC"
                                    stroke-width="6.75"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M20.7266 143.559V144.232C20.7266 145.313 20.5801 146.283 20.2871 147.143C19.9941 148.002 19.5807 148.734 19.0469 149.34C18.513 149.939 17.875 150.398 17.1328 150.717C16.3971 151.036 15.5801 151.195 14.6816 151.195C13.7897 151.195 12.9727 151.036 12.2305 150.717C11.4948 150.398 10.8568 149.939 10.3164 149.34C9.77604 148.734 9.35612 148.002 9.05664 147.143C8.76367 146.283 8.61719 145.313 8.61719 144.232V143.559C8.61719 142.471 8.76367 141.501 9.05664 140.648C9.34961 139.789 9.76302 139.057 10.2969 138.451C10.8372 137.846 11.4753 137.383 12.2109 137.064C12.9531 136.745 13.7702 136.586 14.6621 136.586C15.5605 136.586 16.3776 136.745 17.1133 137.064C17.8555 137.383 18.4935 137.846 19.0273 138.451C19.5677 139.057 19.9844 139.789 20.2773 140.648C20.5768 141.501 20.7266 142.471 20.7266 143.559ZM17.7676 144.232V143.539C17.7676 142.784 17.6992 142.12 17.5625 141.547C17.4258 140.974 17.224 140.492 16.957 140.102C16.6901 139.711 16.3646 139.418 15.9805 139.223C15.5964 139.021 15.1569 138.92 14.6621 138.92C14.1673 138.92 13.7279 139.021 13.3438 139.223C12.9661 139.418 12.6439 139.711 12.377 140.102C12.1165 140.492 11.918 140.974 11.7812 141.547C11.6445 142.12 11.5762 142.784 11.5762 143.539V144.232C11.5762 144.981 11.6445 145.645 11.7812 146.225C11.918 146.798 12.1198 147.283 12.3867 147.68C12.6536 148.07 12.9792 148.367 13.3633 148.568C13.7474 148.77 14.1868 148.871 14.6816 148.871C15.1764 148.871 15.6159 148.77 16 148.568C16.3841 148.367 16.7064 148.07 16.9668 147.68C17.2272 147.283 17.4258 146.798 17.5625 146.225C17.6992 145.645 17.7676 144.981 17.7676 144.232ZM28.9102 148.471V140.434H31.7227V151H29.0762L28.9102 148.471ZM29.2227 146.303L30.0527 146.283C30.0527 146.986 29.9714 147.641 29.8086 148.246C29.6458 148.845 29.4017 149.366 29.0762 149.809C28.7507 150.245 28.3405 150.587 27.8457 150.834C27.3509 151.075 26.7682 151.195 26.0977 151.195C25.5833 151.195 25.1081 151.124 24.6719 150.98C24.2422 150.831 23.8711 150.6 23.5586 150.287C23.2526 149.968 23.0117 149.561 22.8359 149.066C22.6667 148.565 22.582 147.963 22.582 147.26V140.434H25.3945V147.279C25.3945 147.592 25.4303 147.855 25.502 148.07C25.5801 148.285 25.6875 148.461 25.8242 148.598C25.9609 148.734 26.1204 148.832 26.3027 148.891C26.4915 148.949 26.6999 148.979 26.9277 148.979C27.5072 148.979 27.9629 148.861 28.2949 148.627C28.6335 148.393 28.8711 148.074 29.0078 147.67C29.151 147.26 29.2227 146.804 29.2227 146.303ZM36.6836 142.738V151H33.8711V140.434H36.5176L36.6836 142.738ZM39.8672 140.365L39.8184 142.973C39.6816 142.953 39.5156 142.937 39.3203 142.924C39.1315 142.904 38.959 142.895 38.8027 142.895C38.4056 142.895 38.0605 142.947 37.7676 143.051C37.4811 143.148 37.2402 143.295 37.0449 143.49C36.8561 143.686 36.7129 143.923 36.6152 144.203C36.5241 144.483 36.472 144.802 36.459 145.16L35.8926 144.984C35.8926 144.301 35.9609 143.673 36.0977 143.1C36.2344 142.52 36.4329 142.016 36.6934 141.586C36.9603 141.156 37.2858 140.824 37.6699 140.59C38.054 140.355 38.4935 140.238 38.9883 140.238C39.1445 140.238 39.304 140.251 39.4668 140.277C39.6296 140.297 39.763 140.326 39.8672 140.365ZM51.8789 148.617V143.91C51.8789 143.572 51.8236 143.282 51.7129 143.041C51.6022 142.794 51.4297 142.602 51.1953 142.465C50.9674 142.328 50.6712 142.26 50.3066 142.26C49.9941 142.26 49.724 142.315 49.4961 142.426C49.2682 142.53 49.0924 142.683 48.9688 142.885C48.8451 143.08 48.7832 143.311 48.7832 143.578H45.9707C45.9707 143.129 46.0749 142.702 46.2832 142.299C46.4915 141.895 46.7943 141.54 47.1914 141.234C47.5885 140.922 48.0605 140.678 48.6074 140.502C49.1608 140.326 49.7793 140.238 50.4629 140.238C51.2832 140.238 52.0124 140.375 52.6504 140.648C53.2884 140.922 53.7897 141.332 54.1543 141.879C54.5254 142.426 54.7109 143.109 54.7109 143.93V148.451C54.7109 149.031 54.7467 149.506 54.8184 149.877C54.89 150.242 54.9941 150.561 55.1309 150.834V151H52.2891C52.1523 150.714 52.0482 150.355 51.9766 149.926C51.9115 149.49 51.8789 149.053 51.8789 148.617ZM52.25 144.564L52.2695 146.156H50.6973C50.3262 146.156 50.0039 146.199 49.7305 146.283C49.457 146.368 49.2324 146.488 49.0566 146.645C48.8809 146.794 48.7507 146.97 48.666 147.172C48.5879 147.374 48.5488 147.595 48.5488 147.836C48.5488 148.077 48.6042 148.295 48.7148 148.49C48.8255 148.679 48.985 148.829 49.1934 148.939C49.4017 149.044 49.6458 149.096 49.9258 149.096C50.349 149.096 50.7168 149.011 51.0293 148.842C51.3418 148.673 51.5827 148.464 51.752 148.217C51.9277 147.969 52.0189 147.735 52.0254 147.514L52.7676 148.705C52.6634 148.972 52.5202 149.249 52.3379 149.535C52.1621 149.822 51.9375 150.092 51.6641 150.346C51.3906 150.593 51.0618 150.798 50.6777 150.961C50.2936 151.117 49.8379 151.195 49.3105 151.195C48.64 151.195 48.0312 151.062 47.4844 150.795C46.944 150.521 46.5143 150.147 46.1953 149.672C45.8828 149.19 45.7266 148.643 45.7266 148.031C45.7266 147.478 45.8307 146.986 46.0391 146.557C46.2474 146.127 46.5534 145.766 46.957 145.473C47.3672 145.173 47.8783 144.949 48.4902 144.799C49.1022 144.643 49.8118 144.564 50.6191 144.564H52.25ZM63.5684 140.434H66.1172V150.648C66.1172 151.612 65.9023 152.429 65.4727 153.1C65.0495 153.777 64.457 154.288 63.6953 154.633C62.9336 154.984 62.0482 155.16 61.0391 155.16C60.5964 155.16 60.1276 155.102 59.6328 154.984C59.1445 154.867 58.6758 154.685 58.2266 154.438C57.7839 154.19 57.4128 153.878 57.1133 153.5L58.3535 151.84C58.679 152.217 59.0566 152.51 59.4863 152.719C59.916 152.934 60.3913 153.041 60.9121 153.041C61.4199 153.041 61.8496 152.947 62.2012 152.758C62.5527 152.576 62.8229 152.305 63.0117 151.947C63.2005 151.596 63.2949 151.169 63.2949 150.668V142.875L63.5684 140.434ZM56.459 145.844V145.639C56.459 144.831 56.5566 144.099 56.752 143.441C56.9538 142.777 57.237 142.208 57.6016 141.732C57.9727 141.257 58.4219 140.889 58.9492 140.629C59.4766 140.368 60.0723 140.238 60.7363 140.238C61.4395 140.238 62.0286 140.368 62.5039 140.629C62.9792 140.889 63.3698 141.26 63.6758 141.742C63.9818 142.217 64.2194 142.781 64.3887 143.432C64.5645 144.076 64.7012 144.783 64.7988 145.551V146C64.7012 146.736 64.5547 147.419 64.3594 148.051C64.1641 148.682 63.9069 149.236 63.5879 149.711C63.2689 150.18 62.8717 150.544 62.3965 150.805C61.9277 151.065 61.3678 151.195 60.7168 151.195C60.0658 151.195 59.4766 151.062 58.9492 150.795C58.4284 150.528 57.9824 150.154 57.6113 149.672C57.2402 149.19 56.9538 148.624 56.752 147.973C56.5566 147.322 56.459 146.612 56.459 145.844ZM59.2715 145.639V145.844C59.2715 146.28 59.3138 146.687 59.3984 147.064C59.4831 147.442 59.6133 147.777 59.7891 148.07C59.9714 148.357 60.196 148.581 60.4629 148.744C60.7363 148.9 61.0586 148.979 61.4297 148.979C61.944 148.979 62.3639 148.871 62.6895 148.656C63.015 148.435 63.2591 148.132 63.4219 147.748C63.5846 147.364 63.679 146.921 63.7051 146.42V145.141C63.6921 144.73 63.6367 144.363 63.5391 144.037C63.4414 143.705 63.3047 143.422 63.1289 143.188C62.9531 142.953 62.7253 142.771 62.4453 142.641C62.1654 142.51 61.8333 142.445 61.4492 142.445C61.0781 142.445 60.7559 142.53 60.4824 142.699C60.2155 142.862 59.9909 143.087 59.8086 143.373C59.6328 143.66 59.4993 143.998 59.4082 144.389C59.3171 144.773 59.2715 145.189 59.2715 145.639ZM73.168 151.195C72.3477 151.195 71.612 151.065 70.9609 150.805C70.3099 150.538 69.7565 150.17 69.3008 149.701C68.8516 149.232 68.5065 148.689 68.2656 148.07C68.0247 147.445 67.9043 146.781 67.9043 146.078V145.688C67.9043 144.887 68.0182 144.154 68.2461 143.49C68.474 142.826 68.7995 142.25 69.2227 141.762C69.6523 141.273 70.1732 140.899 70.7852 140.639C71.3971 140.372 72.0872 140.238 72.8555 140.238C73.6042 140.238 74.2682 140.362 74.8477 140.609C75.4271 140.857 75.9121 141.208 76.3027 141.664C76.6999 142.12 76.9993 142.667 77.2012 143.305C77.403 143.936 77.5039 144.639 77.5039 145.414V146.586H69.1055V144.711H74.7402V144.496C74.7402 144.105 74.6686 143.757 74.5254 143.451C74.3887 143.139 74.1803 142.891 73.9004 142.709C73.6204 142.527 73.2624 142.436 72.8262 142.436C72.4551 142.436 72.1361 142.517 71.8691 142.68C71.6022 142.842 71.3841 143.07 71.2148 143.363C71.0521 143.656 70.9284 144.001 70.8438 144.398C70.7656 144.789 70.7266 145.219 70.7266 145.688V146.078C70.7266 146.501 70.7852 146.892 70.9023 147.25C71.026 147.608 71.1986 147.917 71.4199 148.178C71.6478 148.438 71.9212 148.64 72.2402 148.783C72.5658 148.926 72.9336 148.998 73.3438 148.998C73.8516 148.998 74.3236 148.9 74.7598 148.705C75.2025 148.503 75.5833 148.201 75.9023 147.797L77.2695 149.281C77.0482 149.6 76.7454 149.906 76.3613 150.199C75.9837 150.492 75.528 150.733 74.9941 150.922C74.4603 151.104 73.8516 151.195 73.168 151.195ZM81.8594 142.689V151H79.0469V140.434H81.6836L81.8594 142.689ZM81.4492 145.346H80.6875C80.6875 144.564 80.7884 143.861 80.9902 143.236C81.1921 142.605 81.4753 142.068 81.8398 141.625C82.2044 141.176 82.6374 140.834 83.1387 140.6C83.6465 140.359 84.2129 140.238 84.8379 140.238C85.3327 140.238 85.7852 140.31 86.1953 140.453C86.6055 140.596 86.957 140.824 87.25 141.137C87.5495 141.449 87.7773 141.863 87.9336 142.377C88.0964 142.891 88.1777 143.52 88.1777 144.262V151H85.3457V144.252C85.3457 143.783 85.2806 143.419 85.1504 143.158C85.0202 142.898 84.8281 142.715 84.5742 142.611C84.3268 142.501 84.0208 142.445 83.6562 142.445C83.2786 142.445 82.9499 142.52 82.6699 142.67C82.3965 142.82 82.1686 143.028 81.9863 143.295C81.8105 143.555 81.6771 143.861 81.5859 144.213C81.4948 144.564 81.4492 144.942 81.4492 145.346ZM95.4922 140.434V142.426H89.3398V140.434H95.4922ZM90.8633 137.826H93.6758V147.816C93.6758 148.122 93.7148 148.357 93.793 148.52C93.8776 148.682 94.0013 148.796 94.1641 148.861C94.3268 148.92 94.5319 148.949 94.7793 148.949C94.9551 148.949 95.1113 148.943 95.248 148.93C95.3913 148.91 95.5117 148.891 95.6094 148.871L95.6191 150.941C95.3783 151.02 95.1178 151.081 94.8379 151.127C94.5579 151.173 94.2487 151.195 93.9102 151.195C93.2917 151.195 92.7513 151.094 92.2891 150.893C91.8333 150.684 91.4818 150.352 91.2344 149.896C90.987 149.441 90.8633 148.842 90.8633 148.1V137.826ZM104.818 136V151H102.006V136H104.818ZM104.418 145.346H103.646C103.653 144.61 103.751 143.933 103.939 143.314C104.128 142.689 104.398 142.149 104.75 141.693C105.102 141.231 105.521 140.873 106.01 140.619C106.505 140.365 107.051 140.238 107.65 140.238C108.171 140.238 108.643 140.313 109.066 140.463C109.496 140.606 109.864 140.84 110.17 141.166C110.482 141.485 110.723 141.905 110.893 142.426C111.062 142.947 111.146 143.578 111.146 144.32V151H108.314V144.301C108.314 143.832 108.246 143.464 108.109 143.197C107.979 142.924 107.787 142.732 107.533 142.621C107.286 142.504 106.98 142.445 106.615 142.445C106.212 142.445 105.867 142.52 105.58 142.67C105.3 142.82 105.076 143.028 104.906 143.295C104.737 143.555 104.613 143.861 104.535 144.213C104.457 144.564 104.418 144.942 104.418 145.346ZM118.148 151.195C117.328 151.195 116.592 151.065 115.941 150.805C115.29 150.538 114.737 150.17 114.281 149.701C113.832 149.232 113.487 148.689 113.246 148.07C113.005 147.445 112.885 146.781 112.885 146.078V145.688C112.885 144.887 112.999 144.154 113.227 143.49C113.454 142.826 113.78 142.25 114.203 141.762C114.633 141.273 115.154 140.899 115.766 140.639C116.378 140.372 117.068 140.238 117.836 140.238C118.585 140.238 119.249 140.362 119.828 140.609C120.408 140.857 120.893 141.208 121.283 141.664C121.68 142.12 121.98 142.667 122.182 143.305C122.383 143.936 122.484 144.639 122.484 145.414V146.586H114.086V144.711H119.721V144.496C119.721 144.105 119.649 143.757 119.506 143.451C119.369 143.139 119.161 142.891 118.881 142.709C118.601 142.527 118.243 142.436 117.807 142.436C117.436 142.436 117.117 142.517 116.85 142.68C116.583 142.842 116.365 143.07 116.195 143.363C116.033 143.656 115.909 144.001 115.824 144.398C115.746 144.789 115.707 145.219 115.707 145.688V146.078C115.707 146.501 115.766 146.892 115.883 147.25C116.007 147.608 116.179 147.917 116.4 148.178C116.628 148.438 116.902 148.64 117.221 148.783C117.546 148.926 117.914 148.998 118.324 148.998C118.832 148.998 119.304 148.9 119.74 148.705C120.183 148.503 120.564 148.201 120.883 147.797L122.25 149.281C122.029 149.6 121.726 149.906 121.342 150.199C120.964 150.492 120.508 150.733 119.975 150.922C119.441 151.104 118.832 151.195 118.148 151.195ZM127.055 136V151H124.232V136H127.055ZM132.191 142.465V155.062H129.379V140.434H131.986L132.191 142.465ZM138.881 145.6V145.805C138.881 146.573 138.79 147.286 138.607 147.943C138.432 148.601 138.171 149.174 137.826 149.662C137.481 150.144 137.051 150.521 136.537 150.795C136.029 151.062 135.443 151.195 134.779 151.195C134.135 151.195 133.575 151.065 133.1 150.805C132.624 150.544 132.224 150.18 131.898 149.711C131.579 149.236 131.322 148.686 131.127 148.061C130.932 147.436 130.782 146.765 130.678 146.049V145.512C130.782 144.743 130.932 144.04 131.127 143.402C131.322 142.758 131.579 142.201 131.898 141.732C132.224 141.257 132.621 140.889 133.09 140.629C133.565 140.368 134.122 140.238 134.76 140.238C135.43 140.238 136.02 140.365 136.527 140.619C137.042 140.873 137.471 141.238 137.816 141.713C138.168 142.188 138.432 142.755 138.607 143.412C138.79 144.07 138.881 144.799 138.881 145.6ZM136.059 145.805V145.6C136.059 145.15 136.02 144.737 135.941 144.359C135.87 143.975 135.753 143.64 135.59 143.354C135.434 143.067 135.225 142.846 134.965 142.689C134.711 142.527 134.402 142.445 134.037 142.445C133.653 142.445 133.324 142.507 133.051 142.631C132.784 142.755 132.566 142.934 132.396 143.168C132.227 143.402 132.1 143.682 132.016 144.008C131.931 144.333 131.879 144.701 131.859 145.111V146.469C131.892 146.951 131.983 147.383 132.133 147.768C132.283 148.145 132.514 148.445 132.826 148.666C133.139 148.887 133.549 148.998 134.057 148.998C134.428 148.998 134.74 148.917 134.994 148.754C135.248 148.585 135.453 148.354 135.609 148.061C135.772 147.768 135.886 147.429 135.951 147.045C136.023 146.661 136.059 146.247 136.059 145.805ZM146.342 148.08C146.342 147.878 146.283 147.696 146.166 147.533C146.049 147.37 145.831 147.221 145.512 147.084C145.199 146.941 144.747 146.811 144.154 146.693C143.62 146.576 143.122 146.43 142.66 146.254C142.204 146.072 141.807 145.854 141.469 145.6C141.137 145.346 140.876 145.046 140.688 144.701C140.499 144.35 140.404 143.949 140.404 143.5C140.404 143.057 140.499 142.641 140.688 142.25C140.883 141.859 141.16 141.514 141.518 141.215C141.882 140.909 142.325 140.671 142.846 140.502C143.373 140.326 143.965 140.238 144.623 140.238C145.541 140.238 146.329 140.385 146.986 140.678C147.65 140.971 148.158 141.374 148.51 141.889C148.868 142.396 149.047 142.976 149.047 143.627H146.234C146.234 143.354 146.176 143.109 146.059 142.895C145.948 142.673 145.772 142.501 145.531 142.377C145.297 142.247 144.991 142.182 144.613 142.182C144.301 142.182 144.031 142.237 143.803 142.348C143.575 142.452 143.399 142.595 143.275 142.777C143.158 142.953 143.1 143.148 143.1 143.363C143.1 143.526 143.132 143.673 143.197 143.803C143.269 143.926 143.383 144.04 143.539 144.145C143.695 144.249 143.897 144.346 144.145 144.438C144.398 144.522 144.711 144.6 145.082 144.672C145.844 144.828 146.524 145.033 147.123 145.287C147.722 145.535 148.197 145.873 148.549 146.303C148.9 146.726 149.076 147.283 149.076 147.973C149.076 148.441 148.972 148.871 148.764 149.262C148.555 149.652 148.256 149.994 147.865 150.287C147.475 150.574 147.006 150.798 146.459 150.961C145.919 151.117 145.31 151.195 144.633 151.195C143.65 151.195 142.816 151.02 142.133 150.668C141.456 150.316 140.941 149.87 140.59 149.33C140.245 148.783 140.072 148.223 140.072 147.65H142.738C142.751 148.035 142.849 148.344 143.031 148.578C143.22 148.812 143.458 148.982 143.744 149.086C144.037 149.19 144.353 149.242 144.691 149.242C145.056 149.242 145.359 149.193 145.6 149.096C145.84 148.992 146.023 148.855 146.146 148.686C146.277 148.51 146.342 148.308 146.342 148.08ZM161.059 140.434V142.426H154.906V140.434H161.059ZM156.43 137.826H159.242V147.816C159.242 148.122 159.281 148.357 159.359 148.52C159.444 148.682 159.568 148.796 159.73 148.861C159.893 148.92 160.098 148.949 160.346 148.949C160.521 148.949 160.678 148.943 160.814 148.93C160.958 148.91 161.078 148.891 161.176 148.871L161.186 150.941C160.945 151.02 160.684 151.081 160.404 151.127C160.124 151.173 159.815 151.195 159.477 151.195C158.858 151.195 158.318 151.094 157.855 150.893C157.4 150.684 157.048 150.352 156.801 149.896C156.553 149.441 156.43 148.842 156.43 148.1V137.826ZM161.957 145.824V145.619C161.957 144.844 162.068 144.132 162.289 143.48C162.51 142.823 162.833 142.253 163.256 141.771C163.679 141.29 164.2 140.915 164.818 140.648C165.437 140.375 166.146 140.238 166.947 140.238C167.748 140.238 168.461 140.375 169.086 140.648C169.711 140.915 170.235 141.29 170.658 141.771C171.088 142.253 171.413 142.823 171.635 143.48C171.856 144.132 171.967 144.844 171.967 145.619V145.824C171.967 146.592 171.856 147.305 171.635 147.963C171.413 148.614 171.088 149.184 170.658 149.672C170.235 150.154 169.714 150.528 169.096 150.795C168.477 151.062 167.768 151.195 166.967 151.195C166.166 151.195 165.453 151.062 164.828 150.795C164.21 150.528 163.686 150.154 163.256 149.672C162.833 149.184 162.51 148.614 162.289 147.963C162.068 147.305 161.957 146.592 161.957 145.824ZM164.77 145.619V145.824C164.77 146.267 164.809 146.68 164.887 147.064C164.965 147.449 165.089 147.787 165.258 148.08C165.434 148.367 165.661 148.591 165.941 148.754C166.221 148.917 166.563 148.998 166.967 148.998C167.357 148.998 167.693 148.917 167.973 148.754C168.253 148.591 168.477 148.367 168.646 148.08C168.816 147.787 168.939 147.449 169.018 147.064C169.102 146.68 169.145 146.267 169.145 145.824V145.619C169.145 145.189 169.102 144.786 169.018 144.408C168.939 144.024 168.812 143.686 168.637 143.393C168.467 143.093 168.243 142.859 167.963 142.689C167.683 142.52 167.344 142.436 166.947 142.436C166.55 142.436 166.212 142.52 165.932 142.689C165.658 142.859 165.434 143.093 165.258 143.393C165.089 143.686 164.965 144.024 164.887 144.408C164.809 144.786 164.77 145.189 164.77 145.619ZM183.041 148.998C183.386 148.998 183.692 148.933 183.959 148.803C184.226 148.666 184.434 148.477 184.584 148.236C184.74 147.989 184.822 147.699 184.828 147.367H187.475C187.468 148.109 187.27 148.77 186.879 149.35C186.488 149.923 185.964 150.375 185.307 150.707C184.649 151.033 183.913 151.195 183.1 151.195C182.279 151.195 181.563 151.059 180.951 150.785C180.346 150.512 179.841 150.134 179.438 149.652C179.034 149.164 178.731 148.598 178.529 147.953C178.327 147.302 178.227 146.605 178.227 145.863V145.58C178.227 144.831 178.327 144.135 178.529 143.49C178.731 142.839 179.034 142.273 179.438 141.791C179.841 141.303 180.346 140.922 180.951 140.648C181.557 140.375 182.266 140.238 183.08 140.238C183.946 140.238 184.704 140.404 185.355 140.736C186.013 141.068 186.527 141.544 186.898 142.162C187.276 142.774 187.468 143.5 187.475 144.34H184.828C184.822 143.988 184.747 143.669 184.604 143.383C184.467 143.096 184.265 142.868 183.998 142.699C183.738 142.523 183.415 142.436 183.031 142.436C182.621 142.436 182.286 142.523 182.025 142.699C181.765 142.868 181.563 143.103 181.42 143.402C181.277 143.695 181.176 144.031 181.117 144.408C181.065 144.779 181.039 145.17 181.039 145.58V145.863C181.039 146.273 181.065 146.667 181.117 147.045C181.169 147.423 181.267 147.758 181.41 148.051C181.56 148.344 181.765 148.575 182.025 148.744C182.286 148.913 182.624 148.998 183.041 148.998ZM191.918 142.738V151H189.105V140.434H191.752L191.918 142.738ZM195.102 140.365L195.053 142.973C194.916 142.953 194.75 142.937 194.555 142.924C194.366 142.904 194.193 142.895 194.037 142.895C193.64 142.895 193.295 142.947 193.002 143.051C192.715 143.148 192.475 143.295 192.279 143.49C192.09 143.686 191.947 143.923 191.85 144.203C191.758 144.483 191.706 144.802 191.693 145.16L191.127 144.984C191.127 144.301 191.195 143.673 191.332 143.1C191.469 142.52 191.667 142.016 191.928 141.586C192.195 141.156 192.52 140.824 192.904 140.59C193.288 140.355 193.728 140.238 194.223 140.238C194.379 140.238 194.538 140.251 194.701 140.277C194.864 140.297 194.997 140.326 195.102 140.365ZM201.098 151.195C200.277 151.195 199.542 151.065 198.891 150.805C198.24 150.538 197.686 150.17 197.23 149.701C196.781 149.232 196.436 148.689 196.195 148.07C195.954 147.445 195.834 146.781 195.834 146.078V145.688C195.834 144.887 195.948 144.154 196.176 143.49C196.404 142.826 196.729 142.25 197.152 141.762C197.582 141.273 198.103 140.899 198.715 140.639C199.327 140.372 200.017 140.238 200.785 140.238C201.534 140.238 202.198 140.362 202.777 140.609C203.357 140.857 203.842 141.208 204.232 141.664C204.63 142.12 204.929 142.667 205.131 143.305C205.333 143.936 205.434 144.639 205.434 145.414V146.586H197.035V144.711H202.67V144.496C202.67 144.105 202.598 143.757 202.455 143.451C202.318 143.139 202.11 142.891 201.83 142.709C201.55 142.527 201.192 142.436 200.756 142.436C200.385 142.436 200.066 142.517 199.799 142.68C199.532 142.842 199.314 143.07 199.145 143.363C198.982 143.656 198.858 144.001 198.773 144.398C198.695 144.789 198.656 145.219 198.656 145.688V146.078C198.656 146.501 198.715 146.892 198.832 147.25C198.956 147.608 199.128 147.917 199.35 148.178C199.577 148.438 199.851 148.64 200.17 148.783C200.495 148.926 200.863 148.998 201.273 148.998C201.781 148.998 202.253 148.9 202.689 148.705C203.132 148.503 203.513 148.201 203.832 147.797L205.199 149.281C204.978 149.6 204.675 149.906 204.291 150.199C203.913 150.492 203.458 150.733 202.924 150.922C202.39 151.104 201.781 151.195 201.098 151.195ZM212.738 148.617V143.91C212.738 143.572 212.683 143.282 212.572 143.041C212.462 142.794 212.289 142.602 212.055 142.465C211.827 142.328 211.531 142.26 211.166 142.26C210.854 142.26 210.583 142.315 210.355 142.426C210.128 142.53 209.952 142.683 209.828 142.885C209.704 143.08 209.643 143.311 209.643 143.578H206.83C206.83 143.129 206.934 142.702 207.143 142.299C207.351 141.895 207.654 141.54 208.051 141.234C208.448 140.922 208.92 140.678 209.467 140.502C210.02 140.326 210.639 140.238 211.322 140.238C212.143 140.238 212.872 140.375 213.51 140.648C214.148 140.922 214.649 141.332 215.014 141.879C215.385 142.426 215.57 143.109 215.57 143.93V148.451C215.57 149.031 215.606 149.506 215.678 149.877C215.749 150.242 215.854 150.561 215.99 150.834V151H213.148C213.012 150.714 212.908 150.355 212.836 149.926C212.771 149.49 212.738 149.053 212.738 148.617ZM213.109 144.564L213.129 146.156H211.557C211.186 146.156 210.863 146.199 210.59 146.283C210.316 146.368 210.092 146.488 209.916 146.645C209.74 146.794 209.61 146.97 209.525 147.172C209.447 147.374 209.408 147.595 209.408 147.836C209.408 148.077 209.464 148.295 209.574 148.49C209.685 148.679 209.844 148.829 210.053 148.939C210.261 149.044 210.505 149.096 210.785 149.096C211.208 149.096 211.576 149.011 211.889 148.842C212.201 148.673 212.442 148.464 212.611 148.217C212.787 147.969 212.878 147.735 212.885 147.514L213.627 148.705C213.523 148.972 213.38 149.249 213.197 149.535C213.021 149.822 212.797 150.092 212.523 150.346C212.25 150.593 211.921 150.798 211.537 150.961C211.153 151.117 210.697 151.195 210.17 151.195C209.499 151.195 208.891 151.062 208.344 150.795C207.803 150.521 207.374 150.147 207.055 149.672C206.742 149.19 206.586 148.643 206.586 148.031C206.586 147.478 206.69 146.986 206.898 146.557C207.107 146.127 207.413 145.766 207.816 145.473C208.227 145.173 208.738 144.949 209.35 144.799C209.962 144.643 210.671 144.564 211.479 144.564H213.109ZM222.914 140.434V142.426H216.762V140.434H222.914ZM218.285 137.826H221.098V147.816C221.098 148.122 221.137 148.357 221.215 148.52C221.299 148.682 221.423 148.796 221.586 148.861C221.749 148.92 221.954 148.949 222.201 148.949C222.377 148.949 222.533 148.943 222.67 148.93C222.813 148.91 222.934 148.891 223.031 148.871L223.041 150.941C222.8 151.02 222.54 151.081 222.26 151.127C221.98 151.173 221.671 151.195 221.332 151.195C220.714 151.195 220.173 151.094 219.711 150.893C219.255 150.684 218.904 150.352 218.656 149.896C218.409 149.441 218.285 148.842 218.285 148.1V137.826ZM229.379 151.195C228.559 151.195 227.823 151.065 227.172 150.805C226.521 150.538 225.967 150.17 225.512 149.701C225.062 149.232 224.717 148.689 224.477 148.07C224.236 147.445 224.115 146.781 224.115 146.078V145.688C224.115 144.887 224.229 144.154 224.457 143.49C224.685 142.826 225.01 142.25 225.434 141.762C225.863 141.273 226.384 140.899 226.996 140.639C227.608 140.372 228.298 140.238 229.066 140.238C229.815 140.238 230.479 140.362 231.059 140.609C231.638 140.857 232.123 141.208 232.514 141.664C232.911 142.12 233.21 142.667 233.412 143.305C233.614 143.936 233.715 144.639 233.715 145.414V146.586H225.316V144.711H230.951V144.496C230.951 144.105 230.88 143.757 230.736 143.451C230.6 143.139 230.391 142.891 230.111 142.709C229.831 142.527 229.473 142.436 229.037 142.436C228.666 142.436 228.347 142.517 228.08 142.68C227.813 142.842 227.595 143.07 227.426 143.363C227.263 143.656 227.139 144.001 227.055 144.398C226.977 144.789 226.938 145.219 226.938 145.688V146.078C226.938 146.501 226.996 146.892 227.113 147.25C227.237 147.608 227.41 147.917 227.631 148.178C227.859 148.438 228.132 148.64 228.451 148.783C228.777 148.926 229.145 148.998 229.555 148.998C230.062 148.998 230.535 148.9 230.971 148.705C231.413 148.503 231.794 148.201 232.113 147.797L233.48 149.281C233.259 149.6 232.956 149.906 232.572 150.199C232.195 150.492 231.739 150.733 231.205 150.922C230.671 151.104 230.062 151.195 229.379 151.195ZM70.4922 164.434V166.426H64.3398V164.434H70.4922ZM65.8633 161.826H68.6758V171.816C68.6758 172.122 68.7148 172.357 68.793 172.52C68.8776 172.682 69.0013 172.796 69.1641 172.861C69.3268 172.92 69.5319 172.949 69.7793 172.949C69.9551 172.949 70.1113 172.943 70.248 172.93C70.3913 172.91 70.5117 172.891 70.6094 172.871L70.6191 174.941C70.3783 175.02 70.1178 175.081 69.8379 175.127C69.5579 175.173 69.2487 175.195 68.9102 175.195C68.2917 175.195 67.7513 175.094 67.2891 174.893C66.8333 174.684 66.4818 174.352 66.2344 173.896C65.987 173.441 65.8633 172.842 65.8633 172.1V161.826ZM74.8379 160V175H72.0254V160H74.8379ZM74.4375 169.346H73.666C73.6725 168.61 73.7702 167.933 73.959 167.314C74.1478 166.689 74.418 166.149 74.7695 165.693C75.1211 165.231 75.541 164.873 76.0293 164.619C76.5241 164.365 77.071 164.238 77.6699 164.238C78.1908 164.238 78.6628 164.313 79.0859 164.463C79.5156 164.606 79.8835 164.84 80.1895 165.166C80.502 165.485 80.7428 165.905 80.9121 166.426C81.0814 166.947 81.166 167.578 81.166 168.32V175H78.334V168.301C78.334 167.832 78.2656 167.464 78.1289 167.197C77.9987 166.924 77.8066 166.732 77.5527 166.621C77.3053 166.504 76.9993 166.445 76.6348 166.445C76.2311 166.445 75.8861 166.52 75.5996 166.67C75.3197 166.82 75.0951 167.028 74.9258 167.295C74.7565 167.555 74.6328 167.861 74.5547 168.213C74.4766 168.564 74.4375 168.942 74.4375 169.346ZM88.168 175.195C87.3477 175.195 86.612 175.065 85.9609 174.805C85.3099 174.538 84.7565 174.17 84.3008 173.701C83.8516 173.232 83.5065 172.689 83.2656 172.07C83.0247 171.445 82.9043 170.781 82.9043 170.078V169.688C82.9043 168.887 83.0182 168.154 83.2461 167.49C83.474 166.826 83.7995 166.25 84.2227 165.762C84.6523 165.273 85.1732 164.899 85.7852 164.639C86.3971 164.372 87.0872 164.238 87.8555 164.238C88.6042 164.238 89.2682 164.362 89.8477 164.609C90.4271 164.857 90.9121 165.208 91.3027 165.664C91.6999 166.12 91.9993 166.667 92.2012 167.305C92.403 167.936 92.5039 168.639 92.5039 169.414V170.586H84.1055V168.711H89.7402V168.496C89.7402 168.105 89.6686 167.757 89.5254 167.451C89.3887 167.139 89.1803 166.891 88.9004 166.709C88.6204 166.527 88.2624 166.436 87.8262 166.436C87.4551 166.436 87.1361 166.517 86.8691 166.68C86.6022 166.842 86.3841 167.07 86.2148 167.363C86.0521 167.656 85.9284 168.001 85.8438 168.398C85.7656 168.789 85.7266 169.219 85.7266 169.688V170.078C85.7266 170.501 85.7852 170.892 85.9023 171.25C86.026 171.608 86.1986 171.917 86.4199 172.178C86.6478 172.438 86.9212 172.64 87.2402 172.783C87.5658 172.926 87.9336 172.998 88.3438 172.998C88.8516 172.998 89.3236 172.9 89.7598 172.705C90.2025 172.503 90.5833 172.201 90.9023 171.797L92.2695 173.281C92.0482 173.6 91.7454 173.906 91.3613 174.199C90.9837 174.492 90.528 174.733 89.9941 174.922C89.4603 175.104 88.8516 175.195 88.168 175.195ZM105.014 170.635V160.781H107.934V170.635C107.934 171.585 107.725 172.402 107.309 173.086C106.892 173.763 106.322 174.284 105.6 174.648C104.883 175.013 104.076 175.195 103.178 175.195C102.247 175.195 101.423 175.039 100.707 174.727C99.9909 174.414 99.4277 173.936 99.0176 173.291C98.6074 172.64 98.4023 171.816 98.4023 170.82H101.342C101.342 171.341 101.413 171.755 101.557 172.061C101.706 172.367 101.918 172.585 102.191 172.715C102.465 172.845 102.794 172.91 103.178 172.91C103.549 172.91 103.871 172.822 104.145 172.646C104.418 172.471 104.63 172.214 104.779 171.875C104.936 171.536 105.014 171.123 105.014 170.635ZM109.809 169.824V169.619C109.809 168.844 109.919 168.132 110.141 167.48C110.362 166.823 110.684 166.253 111.107 165.771C111.531 165.29 112.051 164.915 112.67 164.648C113.288 164.375 113.998 164.238 114.799 164.238C115.6 164.238 116.312 164.375 116.938 164.648C117.562 164.915 118.087 165.29 118.51 165.771C118.939 166.253 119.265 166.823 119.486 167.48C119.708 168.132 119.818 168.844 119.818 169.619V169.824C119.818 170.592 119.708 171.305 119.486 171.963C119.265 172.614 118.939 173.184 118.51 173.672C118.087 174.154 117.566 174.528 116.947 174.795C116.329 175.062 115.619 175.195 114.818 175.195C114.018 175.195 113.305 175.062 112.68 174.795C112.061 174.528 111.537 174.154 111.107 173.672C110.684 173.184 110.362 172.614 110.141 171.963C109.919 171.305 109.809 170.592 109.809 169.824ZM112.621 169.619V169.824C112.621 170.267 112.66 170.68 112.738 171.064C112.816 171.449 112.94 171.787 113.109 172.08C113.285 172.367 113.513 172.591 113.793 172.754C114.073 172.917 114.415 172.998 114.818 172.998C115.209 172.998 115.544 172.917 115.824 172.754C116.104 172.591 116.329 172.367 116.498 172.08C116.667 171.787 116.791 171.449 116.869 171.064C116.954 170.68 116.996 170.267 116.996 169.824V169.619C116.996 169.189 116.954 168.786 116.869 168.408C116.791 168.024 116.664 167.686 116.488 167.393C116.319 167.093 116.094 166.859 115.814 166.689C115.535 166.52 115.196 166.436 114.799 166.436C114.402 166.436 114.063 166.52 113.783 166.689C113.51 166.859 113.285 167.093 113.109 167.393C112.94 167.686 112.816 168.024 112.738 168.408C112.66 168.786 112.621 169.189 112.621 169.619ZM121.547 160H124.359V172.578L124.076 175H121.547V160ZM131.049 169.609V169.814C131.049 170.602 130.964 171.325 130.795 171.982C130.632 172.64 130.378 173.21 130.033 173.691C129.688 174.167 129.258 174.538 128.744 174.805C128.236 175.065 127.637 175.195 126.947 175.195C126.303 175.195 125.743 175.065 125.268 174.805C124.799 174.544 124.405 174.176 124.086 173.701C123.767 173.226 123.51 172.669 123.314 172.031C123.119 171.393 122.973 170.697 122.875 169.941V169.492C122.973 168.737 123.119 168.04 123.314 167.402C123.51 166.764 123.767 166.208 124.086 165.732C124.405 165.257 124.799 164.889 125.268 164.629C125.736 164.368 126.29 164.238 126.928 164.238C127.624 164.238 128.23 164.372 128.744 164.639C129.265 164.899 129.695 165.27 130.033 165.752C130.378 166.227 130.632 166.794 130.795 167.451C130.964 168.102 131.049 168.822 131.049 169.609ZM128.236 169.814V169.609C128.236 169.18 128.204 168.776 128.139 168.398C128.08 168.014 127.976 167.679 127.826 167.393C127.676 167.1 127.471 166.868 127.211 166.699C126.957 166.53 126.628 166.445 126.225 166.445C125.84 166.445 125.515 166.51 125.248 166.641C124.981 166.771 124.76 166.953 124.584 167.188C124.415 167.422 124.288 167.702 124.203 168.027C124.118 168.346 124.066 168.698 124.047 169.082V170.361C124.066 170.876 124.151 171.331 124.301 171.729C124.457 172.119 124.691 172.428 125.004 172.656C125.323 172.878 125.736 172.988 126.244 172.988C126.641 172.988 126.97 172.91 127.23 172.754C127.491 172.598 127.693 172.376 127.836 172.09C127.986 171.803 128.09 171.468 128.148 171.084C128.207 170.693 128.236 170.27 128.236 169.814ZM143.49 169.932H139.867V167.646H143.49C144.05 167.646 144.506 167.555 144.857 167.373C145.209 167.184 145.466 166.924 145.629 166.592C145.792 166.26 145.873 165.885 145.873 165.469C145.873 165.046 145.792 164.652 145.629 164.287C145.466 163.923 145.209 163.63 144.857 163.408C144.506 163.187 144.05 163.076 143.49 163.076H140.883V175H137.953V160.781H143.49C144.604 160.781 145.557 160.983 146.352 161.387C147.152 161.784 147.764 162.334 148.188 163.037C148.611 163.74 148.822 164.544 148.822 165.449C148.822 166.367 148.611 167.161 148.188 167.832C147.764 168.503 147.152 169.02 146.352 169.385C145.557 169.749 144.604 169.932 143.49 169.932ZM150.082 169.824V169.619C150.082 168.844 150.193 168.132 150.414 167.48C150.635 166.823 150.958 166.253 151.381 165.771C151.804 165.29 152.325 164.915 152.943 164.648C153.562 164.375 154.271 164.238 155.072 164.238C155.873 164.238 156.586 164.375 157.211 164.648C157.836 164.915 158.36 165.29 158.783 165.771C159.213 166.253 159.538 166.823 159.76 167.48C159.981 168.132 160.092 168.844 160.092 169.619V169.824C160.092 170.592 159.981 171.305 159.76 171.963C159.538 172.614 159.213 173.184 158.783 173.672C158.36 174.154 157.839 174.528 157.221 174.795C156.602 175.062 155.893 175.195 155.092 175.195C154.291 175.195 153.578 175.062 152.953 174.795C152.335 174.528 151.811 174.154 151.381 173.672C150.958 173.184 150.635 172.614 150.414 171.963C150.193 171.305 150.082 170.592 150.082 169.824ZM152.895 169.619V169.824C152.895 170.267 152.934 170.68 153.012 171.064C153.09 171.449 153.214 171.787 153.383 172.08C153.559 172.367 153.786 172.591 154.066 172.754C154.346 172.917 154.688 172.998 155.092 172.998C155.482 172.998 155.818 172.917 156.098 172.754C156.378 172.591 156.602 172.367 156.771 172.08C156.941 171.787 157.064 171.449 157.143 171.064C157.227 170.68 157.27 170.267 157.27 169.824V169.619C157.27 169.189 157.227 168.786 157.143 168.408C157.064 168.024 156.938 167.686 156.762 167.393C156.592 167.093 156.368 166.859 156.088 166.689C155.808 166.52 155.469 166.436 155.072 166.436C154.675 166.436 154.337 166.52 154.057 166.689C153.783 166.859 153.559 167.093 153.383 167.393C153.214 167.686 153.09 168.024 153.012 168.408C152.934 168.786 152.895 169.189 152.895 169.619ZM167.533 172.08C167.533 171.878 167.475 171.696 167.357 171.533C167.24 171.37 167.022 171.221 166.703 171.084C166.391 170.941 165.938 170.811 165.346 170.693C164.812 170.576 164.314 170.43 163.852 170.254C163.396 170.072 162.999 169.854 162.66 169.6C162.328 169.346 162.068 169.046 161.879 168.701C161.69 168.35 161.596 167.949 161.596 167.5C161.596 167.057 161.69 166.641 161.879 166.25C162.074 165.859 162.351 165.514 162.709 165.215C163.074 164.909 163.516 164.671 164.037 164.502C164.564 164.326 165.157 164.238 165.814 164.238C166.732 164.238 167.52 164.385 168.178 164.678C168.842 164.971 169.35 165.374 169.701 165.889C170.059 166.396 170.238 166.976 170.238 167.627H167.426C167.426 167.354 167.367 167.109 167.25 166.895C167.139 166.673 166.964 166.501 166.723 166.377C166.488 166.247 166.182 166.182 165.805 166.182C165.492 166.182 165.222 166.237 164.994 166.348C164.766 166.452 164.59 166.595 164.467 166.777C164.35 166.953 164.291 167.148 164.291 167.363C164.291 167.526 164.324 167.673 164.389 167.803C164.46 167.926 164.574 168.04 164.73 168.145C164.887 168.249 165.089 168.346 165.336 168.438C165.59 168.522 165.902 168.6 166.273 168.672C167.035 168.828 167.715 169.033 168.314 169.287C168.913 169.535 169.389 169.873 169.74 170.303C170.092 170.726 170.268 171.283 170.268 171.973C170.268 172.441 170.163 172.871 169.955 173.262C169.747 173.652 169.447 173.994 169.057 174.287C168.666 174.574 168.197 174.798 167.65 174.961C167.11 175.117 166.501 175.195 165.824 175.195C164.841 175.195 164.008 175.02 163.324 174.668C162.647 174.316 162.133 173.87 161.781 173.33C161.436 172.783 161.264 172.223 161.264 171.65H163.93C163.943 172.035 164.04 172.344 164.223 172.578C164.411 172.812 164.649 172.982 164.936 173.086C165.229 173.19 165.544 173.242 165.883 173.242C166.247 173.242 166.55 173.193 166.791 173.096C167.032 172.992 167.214 172.855 167.338 172.686C167.468 172.51 167.533 172.308 167.533 172.08ZM177.27 164.434V166.426H171.117V164.434H177.27ZM172.641 161.826H175.453V171.816C175.453 172.122 175.492 172.357 175.57 172.52C175.655 172.682 175.779 172.796 175.941 172.861C176.104 172.92 176.309 172.949 176.557 172.949C176.732 172.949 176.889 172.943 177.025 172.93C177.169 172.91 177.289 172.891 177.387 172.871L177.396 174.941C177.156 175.02 176.895 175.081 176.615 175.127C176.335 175.173 176.026 175.195 175.688 175.195C175.069 175.195 174.529 175.094 174.066 174.893C173.611 174.684 173.259 174.352 173.012 173.896C172.764 173.441 172.641 172.842 172.641 172.1V161.826Z"
                                    fill="url(#paint0_linear_2841_13799)"
                                />
                                <defs>
                                    <linearGradient
                                        id="paint0_linear_2841_13799"
                                        x1="3.19229e-07"
                                        y1="139.636"
                                        x2="234.828"
                                        y2="205.552"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stop-color="#56A8FD" />
                                        <stop
                                            offset="0.318442"
                                            stop-color="#CD8EDD"
                                        />
                                        <stop
                                            offset="0.773401"
                                            stop-color="#F9B2BC"
                                        />
                                        <stop offset="1" stop-color="#D142F5" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        {/* Placeholder for content */}
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                            <div className="h-20 bg-gray-50 rounded-xl border border-dashed border-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                    className="p-0 bg-transparent -m-12 -mb-20 cursor-pointer border-none outline-none transition-transform duration-300 hover:scale-105"
                >
                    <svg
                        width="225"
                        height="159"
                        viewBox="0 0 325 159"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-300`}
                    >
                        <svg
                            width="325"
                            height="159"
                            viewBox="0 0 325 159"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g filter="url(#filter0_d_2840_13432)">
                                <rect
                                    x="57.5"
                                    y="57.5"
                                    width="210"
                                    height="44"
                                    rx="12"
                                    fill="white"
                                    shape-rendering="crispEdges"
                                />
                                <rect
                                    x="58"
                                    y="58"
                                    width="209"
                                    height="43"
                                    rx="11.5"
                                    stroke="url(#paint0_linear_2840_13432)"
                                    shape-rendering="crispEdges"
                                />
                                <path
                                    d="M86.5694 79.51C86.6996 79.5284 86.8249 79.5723 86.9381 79.6392C87.0514 79.706 87.1503 79.7946 87.2292 79.8997C87.3082 80.0049 87.3656 80.1245 87.3983 80.2519C87.4309 80.3793 87.4381 80.5118 87.4194 80.642C87.1688 82.376 86.3561 83.9799 85.1061 85.2075C83.856 86.4352 82.2377 87.2187 80.4994 87.438V88.5C80.4994 88.7652 80.3941 89.0196 80.2066 89.2071C80.019 89.3946 79.7647 89.5 79.4994 89.5C79.2342 89.5 78.9799 89.3946 78.7923 89.2071C78.6048 89.0196 78.4994 88.7652 78.4994 88.5V87.438C76.7614 87.2184 75.1434 86.4347 73.8936 85.2071C72.6438 83.9795 71.8312 82.3758 71.5804 80.642C71.5428 80.3794 71.611 80.1127 71.77 79.9004C71.929 79.6881 72.1659 79.5477 72.4284 79.51C72.691 79.4723 72.9578 79.5405 73.1701 79.6996C73.3824 79.8586 73.5228 80.0954 73.5604 80.358C73.7673 81.7856 74.4814 83.0909 75.5721 84.035C76.6627 84.979 78.057 85.4986 79.4994 85.4986C80.9419 85.4986 82.3362 84.979 83.4268 84.035C84.5175 83.0909 85.2316 81.7856 85.4384 80.358C85.4571 80.228 85.5011 80.1029 85.5681 79.9899C85.6351 79.8769 85.7237 79.7783 85.8288 79.6995C85.9339 79.6208 86.0535 79.5635 86.1808 79.531C86.308 79.4985 86.4394 79.4913 86.5694 79.51ZM79.4994 69.5C80.3184 69.5 81.0914 69.697 81.7734 70.046C81.3208 70.3644 80.965 70.8018 80.7455 71.3098C80.526 71.8178 80.4513 72.3767 80.5296 72.9245C80.608 73.4724 80.8363 73.9879 81.1895 74.414C81.5426 74.8401 82.0067 75.1603 82.5304 75.339L82.9084 75.469C83.0529 75.5183 83.1841 75.5999 83.2921 75.7078C83.4001 75.8156 83.4819 75.9467 83.5314 76.091L83.6604 76.469C83.8304 76.969 84.1244 77.401 84.4994 77.736V78.618V79.5C84.4994 80.8261 83.9727 82.0979 83.035 83.0355C82.0973 83.9732 80.8255 84.5 79.4994 84.5C78.1734 84.5 76.9016 83.9732 75.9639 83.0355C75.0262 82.0979 74.4994 80.8261 74.4994 79.5V74.5C74.4994 73.1739 75.0262 71.9021 75.9639 70.9645C76.9016 70.0268 78.1734 69.5 79.4994 69.5Z"
                                    fill="#56A8FD"
                                />
                                <path
                                    d="M86.5 70.8018C86.675 71.111 86.8848 71.4003 87.1289 71.6611C87.4408 71.9945 87.802 72.2759 88.1973 72.5C87.8885 72.6748 87.6004 72.8852 87.3398 73.1289C87.0063 73.4409 86.7231 73.8017 86.499 74.1973C86.3242 73.8885 86.1148 73.5994 85.8711 73.3389C85.5589 73.0052 85.1975 72.7232 84.8018 72.499C85.1108 72.3241 85.4004 72.1151 85.6611 71.8711C85.9947 71.559 86.2759 71.1974 86.5 70.8018Z"
                                    stroke="url(#paint1_linear_2840_13432)"
                                    stroke-width="3"
                                />
                                <path
                                    d="M107.391 74.6328L103.625 85H102.086L106.422 73.625H107.414L107.391 74.6328ZM110.547 85L106.773 74.6328L106.75 73.625H107.742L112.094 85H110.547ZM110.352 80.7891V82.0234H103.961V80.7891H110.352ZM118.32 82.7578C118.32 82.5495 118.273 82.3568 118.18 82.1797C118.091 81.9974 117.906 81.8333 117.625 81.6875C117.349 81.5365 116.932 81.4062 116.375 81.2969C115.906 81.1979 115.482 81.0807 115.102 80.9453C114.727 80.8099 114.406 80.6458 114.141 80.4531C113.88 80.2604 113.68 80.0339 113.539 79.7734C113.398 79.513 113.328 79.2083 113.328 78.8594C113.328 78.526 113.401 78.2109 113.547 77.9141C113.698 77.6172 113.909 77.3542 114.18 77.125C114.456 76.8958 114.786 76.7161 115.172 76.5859C115.557 76.4557 115.987 76.3906 116.461 76.3906C117.138 76.3906 117.716 76.5104 118.195 76.75C118.674 76.9896 119.042 77.3099 119.297 77.7109C119.552 78.1068 119.68 78.5469 119.68 79.0312H118.234C118.234 78.7969 118.164 78.5703 118.023 78.3516C117.888 78.1276 117.688 77.9427 117.422 77.7969C117.161 77.651 116.841 77.5781 116.461 77.5781C116.06 77.5781 115.734 77.6406 115.484 77.7656C115.24 77.8854 115.06 78.0391 114.945 78.2266C114.836 78.4141 114.781 78.612 114.781 78.8203C114.781 78.9766 114.807 79.1172 114.859 79.2422C114.917 79.362 115.016 79.474 115.156 79.5781C115.297 79.6771 115.495 79.7708 115.75 79.8594C116.005 79.9479 116.331 80.0365 116.727 80.125C117.419 80.2812 117.99 80.4688 118.438 80.6875C118.885 80.9062 119.219 81.1745 119.438 81.4922C119.656 81.8099 119.766 82.1953 119.766 82.6484C119.766 83.0182 119.688 83.3568 119.531 83.6641C119.38 83.9714 119.159 84.237 118.867 84.4609C118.581 84.6797 118.237 84.8516 117.836 84.9766C117.44 85.0964 116.995 85.1562 116.5 85.1562C115.755 85.1562 115.125 85.0234 114.609 84.7578C114.094 84.4922 113.703 84.1484 113.438 83.7266C113.172 83.3047 113.039 82.8594 113.039 82.3906H114.492C114.513 82.7865 114.628 83.1016 114.836 83.3359C115.044 83.5651 115.299 83.7292 115.602 83.8281C115.904 83.9219 116.203 83.9688 116.5 83.9688C116.896 83.9688 117.227 83.9167 117.492 83.8125C117.763 83.7083 117.969 83.5651 118.109 83.3828C118.25 83.2005 118.32 82.9922 118.32 82.7578ZM126.586 82.7578C126.586 82.5495 126.539 82.3568 126.445 82.1797C126.357 81.9974 126.172 81.8333 125.891 81.6875C125.615 81.5365 125.198 81.4062 124.641 81.2969C124.172 81.1979 123.747 81.0807 123.367 80.9453C122.992 80.8099 122.672 80.6458 122.406 80.4531C122.146 80.2604 121.945 80.0339 121.805 79.7734C121.664 79.513 121.594 79.2083 121.594 78.8594C121.594 78.526 121.667 78.2109 121.812 77.9141C121.964 77.6172 122.174 77.3542 122.445 77.125C122.721 76.8958 123.052 76.7161 123.438 76.5859C123.823 76.4557 124.253 76.3906 124.727 76.3906C125.404 76.3906 125.982 76.5104 126.461 76.75C126.94 76.9896 127.307 77.3099 127.562 77.7109C127.818 78.1068 127.945 78.5469 127.945 79.0312H126.5C126.5 78.7969 126.43 78.5703 126.289 78.3516C126.154 78.1276 125.953 77.9427 125.688 77.7969C125.427 77.651 125.107 77.5781 124.727 77.5781C124.326 77.5781 124 77.6406 123.75 77.7656C123.505 77.8854 123.326 78.0391 123.211 78.2266C123.102 78.4141 123.047 78.612 123.047 78.8203C123.047 78.9766 123.073 79.1172 123.125 79.2422C123.182 79.362 123.281 79.474 123.422 79.5781C123.562 79.6771 123.76 79.7708 124.016 79.8594C124.271 79.9479 124.596 80.0365 124.992 80.125C125.685 80.2812 126.255 80.4688 126.703 80.6875C127.151 80.9062 127.484 81.1745 127.703 81.4922C127.922 81.8099 128.031 82.1953 128.031 82.6484C128.031 83.0182 127.953 83.3568 127.797 83.6641C127.646 83.9714 127.424 84.237 127.133 84.4609C126.846 84.6797 126.503 84.8516 126.102 84.9766C125.706 85.0964 125.26 85.1562 124.766 85.1562C124.021 85.1562 123.391 85.0234 122.875 84.7578C122.359 84.4922 121.969 84.1484 121.703 83.7266C121.438 83.3047 121.305 82.8594 121.305 82.3906H122.758C122.779 82.7865 122.893 83.1016 123.102 83.3359C123.31 83.5651 123.565 83.7292 123.867 83.8281C124.169 83.9219 124.469 83.9688 124.766 83.9688C125.161 83.9688 125.492 83.9167 125.758 83.8125C126.029 83.7083 126.234 83.5651 126.375 83.3828C126.516 83.2005 126.586 82.9922 126.586 82.7578ZM131.5 76.5469V85H130.047V76.5469H131.5ZM129.938 74.3047C129.938 74.0703 130.008 73.8724 130.148 73.7109C130.294 73.5495 130.508 73.4688 130.789 73.4688C131.065 73.4688 131.276 73.5495 131.422 73.7109C131.573 73.8724 131.648 74.0703 131.648 74.3047C131.648 74.5286 131.573 74.7214 131.422 74.8828C131.276 75.0391 131.065 75.1172 130.789 75.1172C130.508 75.1172 130.294 75.0391 130.148 74.8828C130.008 74.7214 129.938 74.5286 129.938 74.3047ZM138.742 82.7578C138.742 82.5495 138.695 82.3568 138.602 82.1797C138.513 81.9974 138.328 81.8333 138.047 81.6875C137.771 81.5365 137.354 81.4062 136.797 81.2969C136.328 81.1979 135.904 81.0807 135.523 80.9453C135.148 80.8099 134.828 80.6458 134.562 80.4531C134.302 80.2604 134.102 80.0339 133.961 79.7734C133.82 79.513 133.75 79.2083 133.75 78.8594C133.75 78.526 133.823 78.2109 133.969 77.9141C134.12 77.6172 134.331 77.3542 134.602 77.125C134.878 76.8958 135.208 76.7161 135.594 76.5859C135.979 76.4557 136.409 76.3906 136.883 76.3906C137.56 76.3906 138.138 76.5104 138.617 76.75C139.096 76.9896 139.464 77.3099 139.719 77.7109C139.974 78.1068 140.102 78.5469 140.102 79.0312H138.656C138.656 78.7969 138.586 78.5703 138.445 78.3516C138.31 78.1276 138.109 77.9427 137.844 77.7969C137.583 77.651 137.263 77.5781 136.883 77.5781C136.482 77.5781 136.156 77.6406 135.906 77.7656C135.661 77.8854 135.482 78.0391 135.367 78.2266C135.258 78.4141 135.203 78.612 135.203 78.8203C135.203 78.9766 135.229 79.1172 135.281 79.2422C135.339 79.362 135.438 79.474 135.578 79.5781C135.719 79.6771 135.917 79.7708 136.172 79.8594C136.427 79.9479 136.753 80.0365 137.148 80.125C137.841 80.2812 138.411 80.4688 138.859 80.6875C139.307 80.9062 139.641 81.1745 139.859 81.4922C140.078 81.8099 140.188 82.1953 140.188 82.6484C140.188 83.0182 140.109 83.3568 139.953 83.6641C139.802 83.9714 139.581 84.237 139.289 84.4609C139.003 84.6797 138.659 84.8516 138.258 84.9766C137.862 85.0964 137.417 85.1562 136.922 85.1562C136.177 85.1562 135.547 85.0234 135.031 84.7578C134.516 84.4922 134.125 84.1484 133.859 83.7266C133.594 83.3047 133.461 82.8594 133.461 82.3906H134.914C134.935 82.7865 135.049 83.1016 135.258 83.3359C135.466 83.5651 135.721 83.7292 136.023 83.8281C136.326 83.9219 136.625 83.9688 136.922 83.9688C137.318 83.9688 137.648 83.9167 137.914 83.8125C138.185 83.7083 138.391 83.5651 138.531 83.3828C138.672 83.2005 138.742 82.9922 138.742 82.7578ZM145.625 76.5469V77.6562H141.055V76.5469H145.625ZM142.602 74.4922H144.047V82.9062C144.047 83.1927 144.091 83.4089 144.18 83.5547C144.268 83.7005 144.383 83.7969 144.523 83.8438C144.664 83.8906 144.815 83.9141 144.977 83.9141C145.096 83.9141 145.221 83.9036 145.352 83.8828C145.487 83.8568 145.589 83.8359 145.656 83.8203L145.664 85C145.549 85.0365 145.398 85.0703 145.211 85.1016C145.029 85.138 144.807 85.1562 144.547 85.1562C144.193 85.1562 143.867 85.0859 143.57 84.9453C143.273 84.8047 143.036 84.5703 142.859 84.2422C142.688 83.9089 142.602 83.4609 142.602 82.8984V74.4922ZM153.43 83.5L155.602 76.5469H156.555L156.367 77.9297L154.156 85H153.227L153.43 83.5ZM151.969 76.5469L153.82 83.5781L153.953 85H152.977L150.523 76.5469H151.969ZM158.633 83.5234L160.398 76.5469H161.836L159.383 85H158.414L158.633 83.5234ZM156.766 76.5469L158.891 83.3828L159.133 85H158.211L155.938 77.9141L155.75 76.5469H156.766ZM164.891 76.5469V85H163.438V76.5469H164.891ZM163.328 74.3047C163.328 74.0703 163.398 73.8724 163.539 73.7109C163.685 73.5495 163.898 73.4688 164.18 73.4688C164.456 73.4688 164.667 73.5495 164.812 73.7109C164.964 73.8724 165.039 74.0703 165.039 74.3047C165.039 74.5286 164.964 74.7214 164.812 74.8828C164.667 75.0391 164.456 75.1172 164.18 75.1172C163.898 75.1172 163.685 75.0391 163.539 74.8828C163.398 74.7214 163.328 74.5286 163.328 74.3047ZM170.75 76.5469V77.6562H166.18V76.5469H170.75ZM167.727 74.4922H169.172V82.9062C169.172 83.1927 169.216 83.4089 169.305 83.5547C169.393 83.7005 169.508 83.7969 169.648 83.8438C169.789 83.8906 169.94 83.9141 170.102 83.9141C170.221 83.9141 170.346 83.9036 170.477 83.8828C170.612 83.8568 170.714 83.8359 170.781 83.8203L170.789 85C170.674 85.0365 170.523 85.0703 170.336 85.1016C170.154 85.138 169.932 85.1562 169.672 85.1562C169.318 85.1562 168.992 85.0859 168.695 84.9453C168.398 84.8047 168.161 84.5703 167.984 84.2422C167.812 83.9089 167.727 83.4609 167.727 82.8984V74.4922ZM173.891 73V85H172.445V73H173.891ZM173.547 80.4531L172.945 80.4297C172.951 79.8516 173.036 79.3177 173.203 78.8281C173.37 78.3333 173.604 77.9036 173.906 77.5391C174.208 77.1745 174.568 76.8932 174.984 76.6953C175.406 76.4922 175.872 76.3906 176.383 76.3906C176.799 76.3906 177.174 76.4479 177.508 76.5625C177.841 76.6719 178.125 76.849 178.359 77.0938C178.599 77.3385 178.781 77.6562 178.906 78.0469C179.031 78.4323 179.094 78.9036 179.094 79.4609V85H177.641V79.4453C177.641 79.0026 177.576 78.6484 177.445 78.3828C177.315 78.112 177.125 77.9167 176.875 77.7969C176.625 77.6719 176.318 77.6094 175.953 77.6094C175.594 77.6094 175.266 77.6849 174.969 77.8359C174.677 77.987 174.424 78.1953 174.211 78.4609C174.003 78.7266 173.839 79.0312 173.719 79.375C173.604 79.7135 173.547 80.0729 173.547 80.4531ZM189.656 74.6328L185.891 85H184.352L188.688 73.625H189.68L189.656 74.6328ZM192.812 85L189.039 74.6328L189.016 73.625H190.008L194.359 85H192.812ZM192.617 80.7891V82.0234H186.227V80.7891H192.617ZM201.141 76.5469H202.453V84.8203C202.453 85.5651 202.302 86.2005 202 86.7266C201.698 87.2526 201.276 87.651 200.734 87.9219C200.198 88.1979 199.578 88.3359 198.875 88.3359C198.583 88.3359 198.24 88.2891 197.844 88.1953C197.453 88.1068 197.068 87.9531 196.688 87.7344C196.312 87.5208 195.997 87.2318 195.742 86.8672L196.5 86.0078C196.854 86.4349 197.224 86.7318 197.609 86.8984C198 87.0651 198.385 87.1484 198.766 87.1484C199.224 87.1484 199.62 87.0625 199.953 86.8906C200.286 86.7188 200.544 86.4635 200.727 86.125C200.914 85.7917 201.008 85.3802 201.008 84.8906V78.4062L201.141 76.5469ZM195.32 80.8672V80.7031C195.32 80.0573 195.396 79.4714 195.547 78.9453C195.703 78.4141 195.924 77.9583 196.211 77.5781C196.503 77.1979 196.854 76.9062 197.266 76.7031C197.677 76.4948 198.141 76.3906 198.656 76.3906C199.188 76.3906 199.651 76.4844 200.047 76.6719C200.448 76.8542 200.786 77.1224 201.062 77.4766C201.344 77.8255 201.565 78.2474 201.727 78.7422C201.888 79.237 202 79.7969 202.062 80.4219V81.1406C202.005 81.7604 201.893 82.3177 201.727 82.8125C201.565 83.3073 201.344 83.7292 201.062 84.0781C200.786 84.4271 200.448 84.6953 200.047 84.8828C199.646 85.0651 199.177 85.1562 198.641 85.1562C198.135 85.1562 197.677 85.0495 197.266 84.8359C196.859 84.6224 196.51 84.3229 196.219 83.9375C195.927 83.5521 195.703 83.099 195.547 82.5781C195.396 82.0521 195.32 81.4818 195.32 80.8672ZM196.766 80.7031V80.8672C196.766 81.2891 196.807 81.6849 196.891 82.0547C196.979 82.4245 197.112 82.75 197.289 83.0312C197.471 83.3125 197.703 83.5339 197.984 83.6953C198.266 83.8516 198.602 83.9297 198.992 83.9297C199.471 83.9297 199.867 83.8281 200.18 83.625C200.492 83.4219 200.74 83.1536 200.922 82.8203C201.109 82.487 201.255 82.125 201.359 81.7344V79.8516C201.302 79.5651 201.214 79.2891 201.094 79.0234C200.979 78.7526 200.828 78.513 200.641 78.3047C200.458 78.0911 200.232 77.9219 199.961 77.7969C199.69 77.6719 199.372 77.6094 199.008 77.6094C198.612 77.6094 198.271 77.6927 197.984 77.8594C197.703 78.0208 197.471 78.2448 197.289 78.5312C197.112 78.8125 196.979 79.1406 196.891 79.5156C196.807 79.8854 196.766 80.2812 196.766 80.7031ZM208.156 85.1562C207.568 85.1562 207.034 85.0573 206.555 84.8594C206.081 84.6562 205.672 84.3724 205.328 84.0078C204.99 83.6432 204.729 83.2109 204.547 82.7109C204.365 82.2109 204.273 81.6641 204.273 81.0703V80.7422C204.273 80.0547 204.375 79.4427 204.578 78.9062C204.781 78.3646 205.057 77.9062 205.406 77.5312C205.755 77.1562 206.151 76.8724 206.594 76.6797C207.036 76.487 207.495 76.3906 207.969 76.3906C208.573 76.3906 209.094 76.4948 209.531 76.7031C209.974 76.9115 210.336 77.2031 210.617 77.5781C210.898 77.9479 211.107 78.3854 211.242 78.8906C211.378 79.3906 211.445 79.9375 211.445 80.5312V81.1797H205.133V80H210V79.8906C209.979 79.5156 209.901 79.151 209.766 78.7969C209.635 78.4427 209.427 78.151 209.141 77.9219C208.854 77.6927 208.464 77.5781 207.969 77.5781C207.641 77.5781 207.339 77.6484 207.062 77.7891C206.786 77.9245 206.549 78.1276 206.352 78.3984C206.154 78.6693 206 79 205.891 79.3906C205.781 79.7812 205.727 80.2318 205.727 80.7422V81.0703C205.727 81.4714 205.781 81.849 205.891 82.2031C206.005 82.5521 206.169 82.8594 206.383 83.125C206.602 83.3906 206.865 83.599 207.172 83.75C207.484 83.901 207.839 83.9766 208.234 83.9766C208.745 83.9766 209.177 83.8724 209.531 83.6641C209.885 83.4557 210.195 83.1771 210.461 82.8281L211.336 83.5234C211.154 83.7995 210.922 84.0625 210.641 84.3125C210.359 84.5625 210.013 84.7656 209.602 84.9219C209.195 85.0781 208.714 85.1562 208.156 85.1562ZM214.578 78.3516V85H213.133V76.5469H214.5L214.578 78.3516ZM214.234 80.4531L213.633 80.4297C213.638 79.8516 213.724 79.3177 213.891 78.8281C214.057 78.3333 214.292 77.9036 214.594 77.5391C214.896 77.1745 215.255 76.8932 215.672 76.6953C216.094 76.4922 216.56 76.3906 217.07 76.3906C217.487 76.3906 217.862 76.4479 218.195 76.5625C218.529 76.6719 218.812 76.849 219.047 77.0938C219.286 77.3385 219.469 77.6562 219.594 78.0469C219.719 78.4323 219.781 78.9036 219.781 79.4609V85H218.328V79.4453C218.328 79.0026 218.263 78.6484 218.133 78.3828C218.003 78.112 217.812 77.9167 217.562 77.7969C217.312 77.6719 217.005 77.6094 216.641 77.6094C216.281 77.6094 215.953 77.6849 215.656 77.8359C215.365 77.987 215.112 78.1953 214.898 78.4609C214.69 78.7266 214.526 79.0312 214.406 79.375C214.292 79.7135 214.234 80.0729 214.234 80.4531ZM225.516 76.5469V77.6562H220.945V76.5469H225.516ZM222.492 74.4922H223.938V82.9062C223.938 83.1927 223.982 83.4089 224.07 83.5547C224.159 83.7005 224.273 83.7969 224.414 83.8438C224.555 83.8906 224.706 83.9141 224.867 83.9141C224.987 83.9141 225.112 83.9036 225.242 83.8828C225.378 83.8568 225.479 83.8359 225.547 83.8203L225.555 85C225.44 85.0365 225.289 85.0703 225.102 85.1016C224.919 85.138 224.698 85.1562 224.438 85.1562C224.083 85.1562 223.758 85.0859 223.461 84.9453C223.164 84.8047 222.927 84.5703 222.75 84.2422C222.578 83.9089 222.492 83.4609 222.492 82.8984V74.4922ZM228.781 76.5469V85H227.328V76.5469H228.781ZM227.219 74.3047C227.219 74.0703 227.289 73.8724 227.43 73.7109C227.576 73.5495 227.789 73.4688 228.07 73.4688C228.346 73.4688 228.557 73.5495 228.703 73.7109C228.854 73.8724 228.93 74.0703 228.93 74.3047C228.93 74.5286 228.854 74.7214 228.703 74.8828C228.557 75.0391 228.346 75.1172 228.07 75.1172C227.789 75.1172 227.576 75.0391 227.43 74.8828C227.289 74.7214 227.219 74.5286 227.219 74.3047ZM234.484 83.9688C234.828 83.9688 235.146 83.8984 235.438 83.7578C235.729 83.6172 235.969 83.4245 236.156 83.1797C236.344 82.9297 236.451 82.6458 236.477 82.3281H237.852C237.826 82.8281 237.656 83.2943 237.344 83.7266C237.036 84.1536 236.633 84.5 236.133 84.7656C235.633 85.026 235.083 85.1562 234.484 85.1562C233.849 85.1562 233.294 85.0443 232.82 84.8203C232.352 84.5964 231.961 84.2891 231.648 83.8984C231.341 83.5078 231.109 83.0599 230.953 82.5547C230.802 82.0443 230.727 81.5052 230.727 80.9375V80.6094C230.727 80.0417 230.802 79.5052 230.953 79C231.109 78.4896 231.341 78.0391 231.648 77.6484C231.961 77.2578 232.352 76.9505 232.82 76.7266C233.294 76.5026 233.849 76.3906 234.484 76.3906C235.146 76.3906 235.724 76.526 236.219 76.7969C236.714 77.0625 237.102 77.4271 237.383 77.8906C237.669 78.349 237.826 78.8698 237.852 79.4531H236.477C236.451 79.1042 236.352 78.7891 236.18 78.5078C236.013 78.2266 235.784 78.0026 235.492 77.8359C235.206 77.6641 234.87 77.5781 234.484 77.5781C234.042 77.5781 233.669 77.6667 233.367 77.8438C233.07 78.0156 232.833 78.25 232.656 78.5469C232.484 78.8385 232.359 79.1641 232.281 79.5234C232.208 79.8776 232.172 80.2396 232.172 80.6094V80.9375C232.172 81.3073 232.208 81.6719 232.281 82.0312C232.354 82.3906 232.477 82.7161 232.648 83.0078C232.826 83.2995 233.062 83.5339 233.359 83.7109C233.661 83.8828 234.036 83.9688 234.484 83.9688ZM247.875 74.6328L244.109 85H242.57L246.906 73.625H247.898L247.875 74.6328ZM251.031 85L247.258 74.6328L247.234 73.625H248.227L252.578 85H251.031ZM250.836 80.7891V82.0234H244.445V80.7891H250.836ZM255.719 73.625V85H254.211V73.625H255.719Z"
                                    fill="#404040"
                                />
                            </g>
                            <defs>
                                <filter
                                    id="filter0_d_2840_13432"
                                    x="0"
                                    y="0"
                                    width="325"
                                    height="159"
                                    filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB"
                                >
                                    <feFlood
                                        flood-opacity="0"
                                        result="BackgroundImageFix"
                                    />
                                    <feColorMatrix
                                        in="SourceAlpha"
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                        result="hardAlpha"
                                    />
                                    <feOffset />
                                    <feGaussianBlur stdDeviation="28.75" />
                                    <feComposite
                                        in2="hardAlpha"
                                        operator="out"
                                    />
                                    <feColorMatrix
                                        type="matrix"
                                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in2="BackgroundImageFix"
                                        result="effect1_dropShadow_2840_13432"
                                    />
                                    <feBlend
                                        mode="normal"
                                        in="SourceGraphic"
                                        in2="effect1_dropShadow_2840_13432"
                                        result="shape"
                                    />
                                </filter>
                                <linearGradient
                                    id="paint0_linear_2840_13432"
                                    x1="57.5"
                                    y1="64.5"
                                    x2="262.833"
                                    y2="119.062"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#56A8FD" />
                                    <stop
                                        offset="0.318442"
                                        stop-color="#CD8EDD"
                                    />
                                    <stop
                                        offset="0.773401"
                                        stop-color="#F9B2BC"
                                    />
                                    <stop offset="1" stop-color="#D142F5" />
                                </linearGradient>
                                <linearGradient
                                    id="paint1_linear_2840_13432"
                                    x1="82.5"
                                    y1="69.7727"
                                    x2="90.8489"
                                    y2="70.2375"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#56A8FD" />
                                    <stop
                                        offset="0.318442"
                                        stop-color="#CD8EDD"
                                    />
                                    <stop
                                        offset="0.773401"
                                        stop-color="#F9B2BC"
                                    />
                                    <stop offset="1" stop-color="#D142F5" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* YOUR FULL SVG HERE */}
                    </svg>
                </button>
            </div>
        </Main>
    );
};

export default JobPosting;
