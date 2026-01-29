import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
// import "./JobEditRequest.css";
import jobDetailsicon from "./../../../../images/Client/CreateJob/Jobdetails.svg";
import jobDescriptionicon from "./../../../../images/Client/CreateJob/Jobdescription.svg";
import additionalInformationicon from "./../../../../images/Client/CreateJob/Additionalnformation.svg";
import Pageloading from "../../../common/loading/Pageloading";
import Btnloading from "../../../common/loading/Btnloading";
const apiurl = import.meta.env.VITE_BACKEND_URL;
import GoBack from "../../../common/Goback";

const ManagerJobEditRequest = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const { id } = useParams(); // Request ID, not Job ID
    const [job, setJob] = useState(null);
    const [editedValues, setEditedValues] = useState([]);
    const [acceptedEdits, setAcceptedEdits] = useState({});
    const [descriptionModalVisible, setDescriptionModalVisible] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleOpenModal = () => {
        setDescriptionModalVisible(true);
    };

    const handleCloseModal = () => {
        setDescriptionModalVisible(false);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job-edit-requests/?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                navigate(-1);
                return;
            }

            setJob(data.job);

            // Transform edit_request object to array of changes
            const editRequest = data.edit_request;
            const ignoreFields = [
                "id",
                "job_id",
                "organization",
                "edited_by",
                "edited_at",
                "edit_status",
                "is_seen",
                "edit_reason",
                "job",
                "approval_status",
                "status",
                "created_at",
                "reason",
                "is_linkedin_posted",
            ];

            const changes = [];
            if (editRequest) {
                Object.keys(editRequest).forEach((key) => {
                    const value = editRequest[key];
                    if (
                        !ignoreFields.includes(key) &&
                        value !== null &&
                        value !== undefined &&
                        value !== "" &&
                        value !== " "
                    ) {
                        const originalValue = data.job[key];
                        // eslint-disable-next-line eqeqeq
                        if (originalValue != value) {
                            changes.push({
                                field_name: key,
                                field_value: value,
                            });
                        }
                    }
                });
            }
            setEditedValues(changes);
        } catch (e) {
            console.error("Error fetching job details ", e);
            message.error("Failed to fetch job details");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, id]);

    const handleAcceptAllChanges = () => {
        const allAccepted = {};
        editedValues.forEach((item) => {
            allAccepted[item.field_name] = true;
        });
        setAcceptedEdits(allAccepted);
    };

    const JobDescriptionComponent = ({ value }) => {
        const editedField = editedValues?.find(
            (item) => item.field_name === "job_description",
        );
        const isAccepted = acceptedEdits["job_description"] || false;

        const handleCheckboxChange = () => {
            setAcceptedEdits((prev) => ({
                ...prev,
                ["job_description"]: !isAccepted,
            }));
        };

        if (editedField) {
            return (
                <div>
                    <span className="relative inline-block ml-2 text-red-600">
                        <span
                            style={{ color: "red" }}
                            className="text-[#323842] text-justify text-sm font-normal overflow-hidden text-ellipsis line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    editedField?.field_value,
                                ),
                            }}
                        ></span>

                        {editedField?.field_value.length > 0 && (
                            <div style={{ marginTop: "8px" }}>
                                <button
                                    onClick={handleOpenModal}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#1890ff",
                                        cursor: "pointer",
                                    }}
                                >
                                    View More
                                </button>
                            </div>
                        )}
                        <input
                            type="checkbox"
                            checked={isAccepted}
                            onChange={handleCheckboxChange}
                            className="absolute -top-5 -right-3 h-5 w-5 scale-75 cursor-pointer"
                            style={{ top: "0px" }}
                        />
                    </span>
                </div>
            );
        }

        return (
            <div>
                <span
                    className="text-[#323842] text-justify text-sm font-normal overflow-hidden text-ellipsis line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(job?.job_description),
                    }}
                ></span>

                {job?.job_description?.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                        <button
                            onClick={handleOpenModal}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#1890ff",
                                cursor: "pointer",
                            }}
                        >
                            View More
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const SmallComponent = ({ fieldName, value }) => {
        const editedField = editedValues?.find(
            (item) => item.field_name === fieldName,
        );
        const isAccepted = acceptedEdits[fieldName] || false;

        const handleCheckboxChange = () => {
            setAcceptedEdits((prev) => ({
                ...prev,
                [fieldName]: !isAccepted,
            }));
        };

        if (editedField) {
            let displayValue = editedField.field_value;

            // Handle Array (e.g., job_locations)
            if (Array.isArray(editedField.field_value)) {
                displayValue = (
                    <div className="flex flex-col items-start text-left">
                        {editedField.field_value.map((item, idx) => (
                            <div
                                key={idx}
                                className="mb-1 border-b border-gray-200 pb-1 last:border-0 last:mb-0"
                            >
                                {/* Handle Location Object */}
                                {typeof item === "object" ? (
                                    <>
                                        <strong>{item.location}</strong> (
                                        {item.job_type}) - Positions:{" "}
                                        {item.positions}
                                    </>
                                ) : (
                                    // Fallback for simple array
                                    item
                                )}
                            </div>
                        ))}
                    </div>
                );
            }

            return (
                <div className="px-[11.646px] py-[5.823px] flex items-center gap-[3.882px] text-[#555] text-center text-[12.616px] font-medium rounded-[23.292px] bg-[rgba(19,109,211,0.108)] h-auto">
                    <span className="relative inline-block ml-2 text-red-600">
                        <strong className="text-black mr-1 uppercase">
                            {editedField.field_name.replace(/_/g, " ")}:
                        </strong>
                        {displayValue}
                        <input
                            type="checkbox"
                            checked={isAccepted}
                            onChange={handleCheckboxChange}
                            className="absolute -top-5 -right-3 h-5 w-5 scale-75 cursor-pointer"
                        />
                    </span>
                </div>
            );
        }

        return (
            <div className="px-[11.646px] py-[5.823px] flex items-center gap-[3.882px] text-[#555] text-center text-[12.616px] font-medium rounded-[23.292px] bg-[rgba(19,109,211,0.108)]">
                {value}
            </div>
        );
    };

    const SkillsList = ({ skill_type, skills }) => {
        if (!skills) return null;
        return (
            <div className="w-[45%] rounded-lg border border-[#DEE1E6] bg-white shadow-[0px_0px_11px_0px_rgba(22,129,255,0.06)] px-2.5 py-[15px]">
                <div className="text-[#4A5768] text-base font-semibold px-2.5 pb-[15px] w-full">
                    {skill_type}
                </div>
                <div className="line"></div>
                <div className="">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="flex justify-between rounded-[10px] bg-[#f1f2f4] px-2.5 py-2.5 mt-2.5 text-sm"
                        >
                            <span className="skill-name">
                                {skill.skill_name}
                            </span>
                            <div className="flex gap-2.5">
                                <span className="text-sm">
                                    {skill.metric_value}
                                </span>
                                <span className="text-[#555] text-base font-bold">
                                    {skill.metric_type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleReject = async () => {
        try {
            setBtnLoading(true);
            const response = await fetch(
                `${apiurl}/manager/action/on-edit-job/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: id,
                        status: "rejected",
                    }),
                },
            );
            const data = await response.json();

            if (data.message) {
                message.success(data.message);
                navigate("/agency/jobs");
            } else if (data.error) {
                message.error(data.error);
            }
        } catch (e) {
            console.log(e);
            message.error("An error occurred");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleSubmit = async () => {
        const acceptedChanges = editedValues
            .filter((item) => acceptedEdits[item.field_name])
            .map((item) => item.field_name);

        if (acceptedChanges.length === 0) {
            message.warning("Please select at least one change to accept.");
            return;
        }

        try {
            setBtnLoading(true);
            const response = await fetch(
                `${apiurl}/manager/action/on-edit-job/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request_id: id,
                        status: "accepted",
                        accepted_fields: acceptedChanges,
                    }),
                },
            );

            const data = await response.json();

            if (data.message) {
                message.success("Changes accepted successfully");
                navigate("/agency/jobs");
            } else {
                message.error(data.error || "Failed to submit changes");
            }
        } catch (error) {
            console.error("Error submitting changes:", error);
            message.error("An error occurred while submitting changes");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4 pl-4">
                <GoBack />
            </div>
            {loading ? (
                <Pageloading />
            ) : (
                <div className="flex flex-row mb-6 w-full p-6">
                    {job && (
                        <>
                            <div className="w-full">
                                <div className="sec-1">
                                    <div className="text-[#171A1F] text-xl font-bold flex justify-between">
                                        <div className="flex gap-[18px] items-center">
                                            {job.job_title}
                                            <button
                                                className="px-[15px] py-2 bg-blue-100 text-blue-600 rounded"
                                                onClick={handleAcceptAllChanges}
                                            >
                                                Select all changes
                                            </button>
                                        </div>
                                        <div className="flex gap-[15px]">
                                            <button
                                                className="bg-[#FF7676] text-white px-[15px] py-2 rounded"
                                                onClick={() => handleReject()}
                                            >
                                                Reject Request
                                                {btnLoading && (
                                                    <Btnloading
                                                        spincolor={
                                                            "white-spinner"
                                                        }
                                                    />
                                                )}
                                            </button>
                                            <button
                                                className="bg-green-500 text-white px-[15px] py-2 rounded"
                                                onClick={() => handleSubmit()}
                                            >
                                                Accept Selected
                                                {btnLoading && (
                                                    <Btnloading
                                                        spincolor={
                                                            "white-spinner"
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-[5px] text-[#57585a] text-base font-normal mt-[15px]">
                                        Opening at{" "}
                                        <span className="text-[#2A8CFF] text-lg font-normal">
                                            {job.organization_name ||
                                                "Organization"}
                                        </span>
                                        <SmallComponent
                                            fieldName="job_close_duration"
                                            value={job.job_close_duration}
                                        ></SmallComponent>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center text-[#424955] text-lg gap-2.5 font-bold mb-2.5">
                                        <img src={jobDetailsicon} alt="" />
                                        Job Description
                                    </div>
                                    <div className="line-clamp-2 overflow-hidden text-ellipsis">
                                        <JobDescriptionComponent
                                            value={job?.job_description}
                                        ></JobDescriptionComponent>
                                    </div>

                                    <div className="flex gap-2.5 flex-wrap mt-2.5">
                                        <SmallComponent
                                            fieldName="ctc"
                                            value={job.ctc}
                                        />
                                        <SmallComponent
                                            fieldName="years_of_experience"
                                            value={`${job.years_of_experience} of experience`}
                                        />
                                        <SmallComponent
                                            fieldName="job_level"
                                            value={`Job Level - ${job.job_level}`}
                                        />
                                        <SmallComponent
                                            fieldName="job_type"
                                            value={job.job_type}
                                        />

                                        {job.job_type === "probation" && (
                                            <>
                                                <SmallComponent
                                                    fieldName="probation_type"
                                                    value={job.probation_type}
                                                />
                                                <SmallComponent
                                                    fieldName="time_period"
                                                    value={job.time_period}
                                                />
                                            </>
                                        )}

                                        {job.time_period !== " " && (
                                            <SmallComponent
                                                fieldName="time_period"
                                                value={job.time_period}
                                            />
                                        )}

                                        <SmallComponent
                                            fieldName="notice_period"
                                            value={job.notice_period}
                                        />

                                        {job.notice_time !== "" && (
                                            <SmallComponent
                                                fieldName="notice_time"
                                                value={job.notice_time}
                                            />
                                        )}

                                        <SmallComponent
                                            fieldName="timings"
                                            value={job.timings}
                                        />
                                        <SmallComponent
                                            fieldName="working_days_per_week"
                                            value={`${job.working_days_per_week} Working days in week`}
                                        />
                                        <SmallComponent
                                            fieldName="industry"
                                            value={`${job.industry} Industry`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center text-[#424955] text-lg gap-2.5 font-bold mb-2.5">
                                        <img src={jobDescriptionicon} alt="" />
                                        Skills List
                                    </div>
                                    <div className="flex mt-2.5 gap-5">
                                        <SkillsList
                                            skill_type="Primary Skills"
                                            skills={job.primary_skills}
                                        />
                                        <SkillsList
                                            skill_type="Secondary Skills"
                                            skills={job.secondary_skills}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex items-center text-[#424955] text-lg gap-2.5 font-bold mb-5">
                                        <img
                                            src={additionalInformationicon}
                                            alt=""
                                        />
                                        Additional Details
                                    </div>
                                    <div className="preferences">
                                        <span className="text-[#424955] text-base font-medium">
                                            Preferences
                                        </span>
                                        <div className="mt-2.5 mb-2.5 flex gap-[15px]">
                                            <SmallComponent
                                                fieldName="age"
                                                value={`Age ${job?.age}`}
                                            />
                                            <SmallComponent
                                                fieldName="differently_abled"
                                                value={` Differently abled ${job?.differently_abled}`}
                                            />
                                            <SmallComponent
                                                fieldName="gender"
                                                value={`${job?.gender}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="education">
                                        <span className="text-[#424955] text-base font-medium">
                                            Education
                                        </span>
                                        <div className="mt-2.5 mb-2.5 flex gap-[15px]">
                                            <SmallComponent
                                                fieldName="qualifications"
                                                value={`${job?.qualifications}`}
                                            />
                                            <SmallComponent
                                                fieldName="qualification_department"
                                                value={`${job?.qualification_department}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="lanugages">
                                        <span className="text-[#424955] text-base font-medium">
                                            Languages specific
                                        </span>
                                        <div className="mt-2.5 mb-2.5 flex gap-[15px]">
                                            {job.languages &&
                                                job.languages
                                                    .split(",")
                                                    .map((lang, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-[11.646px] py-[5.823px] flex items-center gap-[3.882px] text-[#555] text-center text-[12.616px] font-medium rounded-[23.292px] bg-[rgba(19,109,211,0.108)]"
                                                        >
                                                            {lang}
                                                        </span>
                                                    ))}
                                        </div>
                                    </div>
                                    <div className="passport">
                                        <span className="text-[#424955] text-base font-medium">
                                            Passport and Visa status
                                        </span>
                                        <div className="mt-2.5 mb-2.5 flex gap-[15px]">
                                            <SmallComponent
                                                fieldName="passport_availability"
                                                value={`${job?.passport_availability}`}
                                            />
                                            <SmallComponent
                                                fieldName="visa_status"
                                                value={`${job.visa_status}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="decision-maker">
                                        <span className="text-[#424955] text-base font-medium">
                                            Decision Maker
                                        </span>
                                        <div className="mt-2.5 mb-2.5 flex gap-[15px]">
                                            <SmallComponent
                                                fieldName="decision_maker"
                                                value={`${job.decision_maker}`}
                                            />
                                            <SmallComponent
                                                fieldName="decision_maker_email"
                                                value={`${job.decision_maker_email}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[15px] flex gap-[15px]">
                                    <div className="flex items-center gap-[5px] text-sm font-bold">
                                        <span className="text-[#5C6472] text-justify font-bold">
                                            Rotational Shift :{" "}
                                        </span>
                                        <SmallComponent
                                            fieldName="rotational_shift"
                                            value={`${job.rotational_shift}`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-[5px] text-sm font-bold">
                                        <span className="text-[#5C6472] text-justify font-bold">
                                            Bond :
                                        </span>
                                        <SmallComponent
                                            fieldName="bond"
                                            value={`${job.bond}`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-[15px]">
                                    <div className="text-[#424955] text-[17px] font-medium">
                                        Other Benefits
                                    </div>
                                    <SmallComponent
                                        fieldName="other_benefits"
                                        value={`${job.other_benefits}`}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
            <Modal
                title="Full Job Description"
                open={descriptionModalVisible}
                onCancel={handleCloseModal}
                footer={null}
            >
                {(() => {
                    const editedField = editedValues?.find(
                        (item) => item.field_name === "job_description",
                    );
                    const isAccepted =
                        acceptedEdits["job_description"] || false;

                    const handleCheckboxChange = () => {
                        setAcceptedEdits((prev) => ({
                            ...prev,
                            ["job_description"]: !isAccepted,
                        }));
                    };

                    if (editedField) {
                        return (
                            <div>
                                <div style={{ marginTop: "12px" }}>
                                    <label style={{ color: "green" }}>
                                        New Content:
                                    </label>
                                    <span className="relative inline-block ml-2 text-red-600">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    editedField.field_value,
                                                ),
                                            }}
                                        />
                                        <input
                                            type="checkbox"
                                            checked={isAccepted}
                                            onChange={handleCheckboxChange}
                                            className="absolute top-0 right-0 h-5 w-5 cursor-pointer"
                                        />
                                    </span>
                                </div>
                                <hr className="my-4" />
                                <div>
                                    <label style={{ color: "gray" }}>
                                        Original Content:
                                    </label>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                job?.job_description,
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        job?.job_description,
                                    ),
                                }}
                            />
                        );
                    }
                })()}
            </Modal>
        </Main>
    );
};

export default ManagerJobEditRequest;
