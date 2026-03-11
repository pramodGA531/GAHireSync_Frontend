import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { message, Breadcrumb } from "antd";
// import "./JobEditRequest.css";
import jobDetailsicon from "./../../../../images/Client/CreateJob/Jobdetails.svg";
import jobDescriptionicon from "./../../../../images/Client/CreateJob/Jobdescription.svg";
import additionalInformationicon from "./../../../../images/Client/CreateJob/Additionalnformation.svg";
import { Modal, Checkbox, Select, Input } from "antd";
import { FlagFilled } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import Btnloading from "../../../common/loading/Btnloading";
const { Option } = Select;
const apiurl = import.meta.env.VITE_BACKEND_URL;
import GoBack from "../../../common/Goback";

const EditChangesModal = ({
    isModalVisible,
    setIsModalVisible,
    editedValues,
    acceptedEdits,
    setAcceptedEdits,
    job,
    newFieldName,
    setNewFieldName,
    newFieldValue,
    setNewFieldValue,
    newFields,
    setNewFields,
    handleSubmit,
    btnLoading,
}) => {
    const handleAddNewField = () => {
        if (newFieldName && newFieldValue) {
            setNewFields([
                ...newFields,
                { field_name: newFieldName, field_value: newFieldValue },
            ]);
            setNewFieldName("");
            setNewFieldValue("");
        }
    };

    const fieldOptions = [
        "",
        "job_title",
        "ctc",
        "years_of_experience",
        "job_level",
        "job_type",
        "probation_type",
        "time_period",
        "notice_period",
        "notice_time",
        "timings",
        "working_days_per_week",
        "industry",
        "age",
        "differently_abled",
        "gender",
        "qualifications",
        "qualification_department",
        "languages",
        "passport_availability",
        "visa_status",
        "decision_maker",
        "decision_maker_email",
        "rotational_shift",
        "bond",
        "other_benefits",
    ];

    return (
        <Modal
            title="Review and Add Changes"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            width={800}
            footer={[
                <button
                    className="px-2.5 py-2.5 mr-2.5 bg-white text-red-600 border-2 border-red-600 rounded cursor-pointer"
                    key="cancel"
                    onClick={() => setIsModalVisible(false)}
                >
                    Cancel
                </button>,
                <button
                    className="px-2.5 py-2.5 bg-[#1890ff] text-white border-none rounded cursor-pointer"
                    key="add"
                    onClick={handleSubmit}
                >
                    Send request
                    {btnLoading && (
                        <Btnloading
                            spincolor={"white-spinner"}
                            style={{ marginLeft: "5px" }}
                        />
                    )}
                </button>,
            ]}
        >
            {editedValues.map((item) => (
                <div
                    key={item.field_name}
                    className="flex justify-between items-center mb-2.5"
                >
                    <div className="text-base font-semibold mt-2.5">
                        {item.field_name}
                    </div>
                    <div className="mt-[5px] flex flex-wrap gap-2.5 items-center bg-gray-100 p-2 rounded">
                        <Checkbox
                            checked={acceptedEdits[item.field_name] || false}
                            onChange={() => {
                                setAcceptedEdits((prev) => ({
                                    ...prev,
                                    [item.field_name]: !prev[item.field_name],
                                }));
                            }}
                        />
                        <span
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    `${job[item.field_name]} → ${
                                        item.field_value
                                    }`,
                                ),
                            }}
                        ></span>
                    </div>
                </div>
            ))}

            <div className="mt-2.5 flex items-center">
                <Select
                    showSearch
                    value={newFieldName}
                    onChange={(value) => setNewFieldName(value)}
                    placeholder="Select Field"
                    className="w-[45%] mr-2.5"
                >
                    {fieldOptions.map((field) => (
                        <Option key={field} value={field}>
                            {field}
                        </Option>
                    ))}
                </Select>
                <Input
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    placeholder="Enter Value"
                    style={{ width: "45%", marginRight: "10px" }}
                />
                <button
                    className="p-2.5 bg-[#1890ff] text-white border-none rounded cursor-pointer"
                    onClick={handleAddNewField}
                >
                    Add
                </button>
            </div>

            {newFields.map((field, index) => (
                <div
                    key={index}
                    className="mt-2.5 p-2 bg-blue-50 text-gray-700 rounded"
                >
                    <span>
                        {field.field_name}: {field.field_value}
                    </span>
                </div>
            ))}
        </Modal>
    );
};

const ParticularJobEdit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { Option } = Select;

    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [editedValues, setEditedValues] = useState([]);
    const [acceptedEdits, setAcceptedEdits] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [descriptionModalVisible, setDescriptionModalVisible] =
        useState(false);
    const [newFieldName, setNewFieldName] = useState("");
    const [newFieldValue, setNewFieldValue] = useState("");
    const [newFields, setNewFields] = useState([]);
    const [loading, setLoading] = useState(false);

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
                `${apiurl}/client/not-approval-jobs/?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setJob(data.job);
            setEditedValues(data.edited_job || {});
            if (data.error) {
                message.error(data.error);
                navigate(-1);
            }
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
    }, [token]);

    const handleAcceptAllChanges = () => {
        // first button
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

                {job?.job_description.length > 0 && (
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
            return (
                <div className="px-[11.646px] py-[5.823px] flex items-center gap-[3.882px] text-[#555] text-center text-[12.616px] font-medium rounded-[23.292px] bg-[rgba(19,109,211,0.108)]">
                    <span className="relative inline-block ml-2 text-red-600">
                        {editedField.field_value}
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
        // this functionality is not working
        try {
            setBtnLoading(true);
            const response = await fetch(
                `${apiurl}/reject-job-edit/?job_id=${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.message) {
                message.success(data.message);
                navigate("/client/mypostings");
            }
            if (data.error) {
                message.error(data.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setBtnLoading(false);
        }
    };

    const [btnLoading, setBtnLoading] = useState(false);

    const handleSubmit = async () => {
        const acceptedChanges = editedValues
            .filter((item) => acceptedEdits[item.field_name])
            .map((item) => ({
                field_name: item.field_name,
                field_value: item.field_value,
            }));
        try {
            setBtnLoading(true);

            const response = await fetch(
                `${apiurl}/accept-job-post/?job_id=${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        changes: acceptedChanges,
                        new_changes: newFields,
                    }),
                },
            );

            const data = await response.json();

            if (data.message) {
                message.success("Changes submitted successfully");
                setIsModalVisible(false);
                setDescriptionModalVisible(false);
                navigate("/client/mypostings");
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
            <div className="m-4">
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link to="/client/edit-requests">
                                        Edit Request
                                    </Link>
                                ),
                            },
                            {
                                title: "Edit Job",
                            },
                        ]}
                    />
                </div>
                {loading ? (
                    <Pageloading />
                ) : (
                    <div className="flex flex-row mb-6 w-full">
                        {job && (
                            <>
                                <div className="w-full">
                                    <div className="sec-1">
                                        <div className="text-[#171A1F] text-xl font-bold flex justify-between">
                                            <div className="flex gap-[18px] items-center">
                                                {job.job_title}
                                            </div>
                                            <div className="flex gap-[15px]">
                                                <button
                                                    className="px-[15px] py-2 medium border-2 text-gray-700 border-gray-700 rounded hover:bg-gray-200 hover:shadow-md cursor-pointer"
                                                    onClick={
                                                        handleAcceptAllChanges
                                                    }
                                                >
                                                    Accept all changes
                                                </button>
                                                {/* <button
                                                    className="bg-transparent border-2 border-[#2A8CFF] text-[#2A8CFF] px-[15px] py-2 rounded cursor-pointer hover:bg-blue-100"
                                                    onClick={() =>
                                                        setIsModalVisible(true)
                                                    }
                                                >
                                                    Add New Changes
                                                </button> */}
                                                <EditChangesModal
                                                    isModalVisible={
                                                        isModalVisible
                                                    }
                                                    setIsModalVisible={
                                                        setIsModalVisible
                                                    }
                                                    editedValues={editedValues}
                                                    acceptedEdits={
                                                        acceptedEdits
                                                    }
                                                    setAcceptedEdits={
                                                        setAcceptedEdits
                                                    }
                                                    job={job}
                                                    newFieldName={newFieldName}
                                                    setNewFieldName={
                                                        setNewFieldName
                                                    }
                                                    newFieldValue={
                                                        newFieldValue
                                                    }
                                                    setNewFieldValue={
                                                        setNewFieldValue
                                                    }
                                                    newFields={newFields}
                                                    setNewFields={setNewFields}
                                                    handleSubmit={handleSubmit}
                                                    btnLoading={btnLoading}
                                                />
                                                <button
                                                    className="bg-[#FF7676] hover:bg-red-400 text-white px-[15px] py-2 rounded cursor-pointer"
                                                    onClick={() =>
                                                        handleReject()
                                                    }
                                                >
                                                    Reject
                                                    {btnLoading && (
                                                        <Btnloading
                                                            spincolor={
                                                                "white-spinner"
                                                            }
                                                        />
                                                    )}
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-[15px] py-2 rounded cursor-pointer"
                                                    onClick={() =>
                                                        handleSubmit()
                                                    }
                                                >
                                                    Accept
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
                                                GA Digital Solutions
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
                                                        value={
                                                            job.probation_type
                                                        }
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
                                            <img
                                                src={jobDescriptionicon}
                                                alt=""
                                            />
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
                                                {job.languages
                                                    .split(",")
                                                    .map((lang) => (
                                                        <span className="px-[11.646px] py-[5.823px] flex items-center gap-[3.882px] text-[#555] text-center text-[12.616px] font-medium rounded-[23.292px] bg-[rgba(19,109,211,0.108)]">
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
                                            <input
                                                type="checkbox"
                                                checked={isAccepted}
                                                onChange={handleCheckboxChange}
                                                className="absolute -top-5 -right-3 h-5 w-5 scale-75 cursor-pointer"
                                            />{" "}
                                            Accept Edited Version
                                        </label>
                                    </div>
                                    <h4>Original:</h4>
                                    <div
                                        className="text-[#323842] text-justify text-sm font-normal"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                job?.job_description,
                                            ),
                                        }}
                                    ></div>

                                    <h4 style={{ marginTop: "16px" }}>
                                        Edited:
                                    </h4>
                                    <div
                                        className="text-[#323842] text-justify text-sm font-normal"
                                        style={{ color: "red" }}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                editedField?.field_value,
                                            ),
                                        }}
                                    ></div>
                                </div>
                            );
                        }

                        return (
                            <div>
                                <span
                                    className="text-[#323842] text-justify text-sm font-normal overflow-hidden text-ellipsis line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            job?.job_description,
                                        ),
                                    }}
                                ></span>
                            </div>
                        );
                    })()}
                </Modal>
            </div>
        </Main>
    );
};

export default ParticularJobEdit;
