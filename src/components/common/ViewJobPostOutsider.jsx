import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jobDetailsicon from "./../../images/Client/CreateJob/Jobdetails.svg";
import jobDescriptionicon from "./../../images/Client/CreateJob/Jobdescription.svg";
import additionalInformationicon from "./../../images/Client/CreateJob/Additionalnformation.svg";
import DOMPurify from "dompurify";
import { Modal } from "antd";

const SkillsList = ({ skill_type, skills }) => {
    return (
        <div className="w-[45%] rounded-lg border border-[#DEE1E6] bg-white shadow-[0px_0px_11px_0px_rgba(22,129,255,0.06)] p-[15px_10px]">
            <div className="text-[#4A5768] text-base font-semibold p-[10px_10px_15px] w-full">
                {skill_type}
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="">
                {skills?.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex mt-2.5 justify-between rounded bg-[#F8F8F8] p-2.5"
                    >
                        <span className="skill-name">{skill.skill_name}</span>
                        <div className="flex gap-2.5">
                            <span className="metric-value">
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

const ViewJobPostOutsider = ({ id, job }) => {
    const navigate = useNavigate();
    id = parseInt(id);

    const handleBack = () => {
        navigate(-1);
    };

    const [descriptionModalVisible, setDescriptionModalVisible] =
        useState(false);

    const handleOpenModal = () => {
        setDescriptionModalVisible(true);
    };

    return (
        <div className="flex flex-row mb-6 gap-2.5">
            {job && (
                <>
                    <div className="w-full md:w-[70%]">
                        <div className="sec-1">
                            <div className="flex gap-2.5 items-center">
                                <span className="text-[#171A1F] text-xl font-bold">
                                    {job?.job_title}
                                </span>
                                <div className="text-lg">{job?.status}</div>
                            </div>
                            <div className="flex gap-[5px] text-[#57585a] text-base font-normal">
                                Opening at{" "}
                                <span className="text-[#2A8CFF] text-lg font-normal">
                                    {job.organization?.name}
                                </span>{" "}
                                <span className="pl-5">
                                    Deadline : {job?.job_close_duration}
                                </span>
                            </div>
                        </div>
                        <div className="mt-[25px]">
                            <div className="flex items-center text-[#424955] text-lg gap-2.5 font-bold mb-2.5">
                                <img src={jobDetailsicon} alt="" />
                                Job Description
                            </div>
                            <span
                                className="text-[#323842] text-justify text-sm font-normal line-clamp-3 overflow-hidden text-ellipsis"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        job?.job_description
                                    ),
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

                            <div className="flex gap-2.5 flex-wrap mt-2.5">
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.ctc}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.years_of_experience} of experience
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    Job Level - {job?.job_level}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.job_type}
                                </div>
                                {job?.job_type === "probation" && (
                                    <>
                                        <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                            {job?.probation_type}
                                        </div>
                                        <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                            {job?.time_period}
                                        </div>
                                    </>
                                )}
                                {job?.time_period !== "" && (
                                    <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                        {job?.time_period}
                                    </div>
                                )}
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.notice_period}
                                </div>
                                {job?.notice_time !== "" && (
                                    <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                        {job?.notice_time}
                                    </div>
                                )}
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.timings}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.working_days_per_week} Working days in
                                    week
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[13px] font-medium p-2.5">
                                    {job?.industry} Industry
                                </div>
                            </div>
                        </div>
                        <div className="mt-[25px]">
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
                        <div className="mt-[25px]">
                            <div className="flex items-center text-[#424955] text-lg gap-2.5 font-bold mb-5">
                                <img src={additionalInformationicon} alt="" />
                                Additional Details
                            </div>
                            <div className="sec-4-item">
                                <span className="text-[#424955] text-base font-medium">
                                    Preferences
                                </span>
                                <div className="my-2.5 flex gap-[15px]">
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Age limit : {job?.age}
                                    </span>
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Differently abled Preference :{" "}
                                        {job?.differently_abled}{" "}
                                    </span>
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Gender Preferences : {job?.gender}{" "}
                                    </span>
                                </div>
                            </div>
                            <div className="sec-4-item">
                                <span className="text-[#424955] text-base font-medium">
                                    Education
                                </span>
                                <div className="my-2.5 flex gap-[15px]">
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.qualifications}
                                    </span>
                                </div>
                            </div>
                            <div className="sec-4-item">
                                <span className="text-[#424955] text-base font-medium">
                                    Languages specific
                                </span>
                                <div className="my-2.5 flex gap-[15px]">
                                    {job?.languages
                                        ?.split(",")
                                        .map((lang, index) => (
                                            <span
                                                key={index}
                                                className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                </div>
                            </div>
                            <div className="sec-4-item">
                                <span className="text-[#424955] text-base font-medium">
                                    Passport and Visa status
                                </span>
                                <div className="my-2.5 flex gap-[15px]">
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.passport_availability === ""
                                            ? "Not Required"
                                            : job?.passport_availability}
                                    </span>
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.visa_status === ""
                                            ? "No Mention"
                                            : job?.visa_status}
                                    </span>
                                </div>
                            </div>
                            <div className="sec-4-item">
                                <span className="text-[#424955] text-base font-medium">
                                    Decision Maker
                                </span>
                                <div className="my-2.5 flex gap-[15px]">
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.decision_maker}
                                    </span>
                                    <span className="flex px-3 py-1.5 items-center gap-1 text-[#555] text-center text-[13px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.decision_maker_email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[15px]">
                            <div className="text-[#424955] text-[17px] font-medium">
                                Other Benefits
                            </div>
                            <span className="text-[#323842] text-justify text-sm font-normal">
                                {job.other_benefits}
                            </span>
                        </div>
                        <div className="mt-[15px]">
                            <div className="text-[#424955] text-[17px] font-medium mb-2">
                                Locations
                            </div>
                            <div className="flex flex-wrap gap-5">
                                {job?.locations?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col p-2.5 bg-[#136DD31C] rounded-[10px]"
                                    >
                                        <span className="text-[#424955] text-sm font-medium">
                                            Location : {item?.location}
                                        </span>
                                        <span className="text-[#424955] text-sm font-medium">
                                            Positions : {item?.positions}
                                        </span>
                                        <span className="text-[#424955] text-sm font-medium">
                                            Job Type : {item?.job_type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex gap-4">
                            <div className="text-sm">
                                <span className="text-[#5C6472] font-bold text-justify">
                                    Rotational Shift :{" "}
                                </span>{" "}
                                <span className="font-light">
                                    {job?.rotational_shift == true
                                        ? "Yes"
                                        : "No"}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-[#5C6472] font-bold text-justify">
                                    Bond :{" "}
                                </span>{" "}
                                <span className="font-light">{job?.bond}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Modal
                title="Full Job Description"
                open={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
                width="50%"
            >
                <div>
                    <div
                        className="text-[#323842] text-justify text-sm font-normal"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(job?.job_description),
                        }}
                    ></div>
                </div>
            </Modal>
        </div>
    );
};

export default ViewJobPostOutsider;
