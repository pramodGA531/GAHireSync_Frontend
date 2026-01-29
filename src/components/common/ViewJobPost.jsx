import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewersTable from "./ViewInterviewers";
import jobDetailsicon from "./../../images/Client/CreateJob/Jobdetails.svg";
import jobDescriptionicon from "./../../images/Client/CreateJob/Jobdescription.svg";
import additionalInformationicon from "./../../images/Client/CreateJob/Additionalnformation.svg";
import { resolveElements } from "framer-motion";
import DOMPurify from "dompurify";
import { Modal } from "antd";
import { Select } from "antd";
import { LucideChartNoAxesColumnIncreasing } from "lucide-react";
const apiurl = import.meta.env.VITE_BACKEND_URL;
const InterviewsCard = ({ item }) => {
    return (
        <div className="mt-[15px] w-[90%] rounded-[10px] bg-[#F3F9FF70] shadow-[0px_0px_4px_0px_rgba(55,73,85,0.25)] p-[15px] flex flex-col gap-0">
            <span className="text-[#54577A] text-[16px] font-semibold tracking-[-0.32px]">
                {item?.name?.username}
            </span>
            <span className="text-[#54577A] text-[15px] font-normal">
                {item?.name?.email}
            </span>
            <div className="mt-[10px] flex flex-wrap gap-[10px]">
                <span className="py-[8px] px-[10px] rounded-[23px] bg-[#1681FF0D] text-[#555] text-center text-[12.6px] font-medium">
                    Round {item?.round_num}
                </span>
                <span className="py-[8px] px-[10px] rounded-[23px] bg-[#1681FF0D] text-[#555] text-center text-[12.6px] font-medium">
                    {item?.mode_of_interview}
                </span>
                <span className="py-[8px] px-[10px] rounded-[23px] bg-[#1681FF0D] text-[#555] text-center text-[12.6px] font-medium">
                    {item?.type_of_interview}
                </span>
            </div>
        </div>
    );
};

const RecruiterCard = ({ item }) => {
    return (
        <div className="rounded-[10px] bg-[#F3F9FF70] shadow-[0px_0px_4px_0px_rgba(55,73,85,0.25)] p-[20px] flex flex-col gap-[5px] mt-[15px] w-[90%]">
            <span className="text-[#54577A] text-[16px] font-semibold">
                {item?.username}
            </span>
            <span className="text-[#54577A] text-[12px] font-normal">
                {item?.email}
            </span>
            <span className="text-[#54577A] text-[12px] font-normal">
                {item?.location}
            </span>
        </div>
    );
};

const SkillsList = ({ skill_type, skills }) => {
    return (
        <div className="w-full md:w-[45%] rounded-[8px] border border-[#DEE1E6] bg-white shadow-[0px_0px_11px_0px_rgba(22,129,255,0.06)] p-[15px_10px]">
            <div className="text-[#4A5768] text-[16px] font-semibold p-[10px] pb-[15px] w-full">
                {skill_type}
            </div>
            <div className="line"></div>
            <div>
                {skills?.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex mt-[10px] justify-between rounded-[4px] bg-[#F8F8F8] p-[10px]"
                    >
                        <span className="skill-name">{skill?.skill_name}</span>
                        <div className="flex gap-[10px]">
                            <span className="metric-value">
                                {skill?.metric_value}
                            </span>
                            <span className="text-[#555] text-[16px] font-bold">
                                {skill?.metric_type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ViewJobPost = ({ id, job }) => {
    const navigate = useNavigate();
    id = parseInt(id);

    const [descriptionModalVisible, setDescriptionModalVisible] =
        useState(false);
    const [recruiters, setRecruiters] = useState([]);
    const [isChangeRecruiterModalOpen, setIsChangeRecruiterModalOpen] =
        useState(false);
    const token = localStorage.getItem("hiresynctoken");

    const handleChangeRecruiterOk = () => {
        setIsChangeRecruiterModalOpen(false);
    };
    const handleChangeRecruiterCancel = () => {
        setIsChangeRecruiterModalOpen(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formattedCTC = (ctc) => {
        const ctc_range = ctc?.split(",");
        return `CTC Range : ${ctc_range[0]} LPA - ${ctc_range[1]} LPA`;
    };

    const formattedExperience = (experience) => {
        const yof = experience.split(",");
        return `${yof[0]} - ${yof[1]} years of experience`;
    };

    const handleOpenModal = () => {
        setDescriptionModalVisible(true);
    };
    
    const handleChangeRecruiter = (value) => {
        console.log("Selected recruiter:", value);
    };
    return (
        <div className="flex flex-col lg:flex-row p-2 md:p-4 mb-[25px] gap-[10px]">
            {job && (
                <>
                    <div className="w-full lg:w-[70%]">
                        <div className="sec-1">
                            <div className="flex gap-[10px] items-center">
                                <span className="text-[#171A1F] text-[20px] font-bold">
                                    {job.job_title}
                                </span>
                                <div className="text-[18px]">{job.status}</div>
                            </div>
                            <div className="flex gap-[5px] text-[#57585a] text-[16px] font-normal">
                                Opening at{" "}
                                <span className="text-[#2A8CFF] text-[18px] font-normal">
                                    {job?.organization?.name}
                                </span>{" "}
                                <span className="pl-[20px]">
                                    Deadline : {job.job_close_duration}
                                </span>
                            </div>
                            <div className="company-name">
                                Website:{" "}
                                <a
                                    href={
                                        job?.client_website?.startsWith("http")
                                            ? job.client_website
                                            : `https://${job?.client_website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {job?.client_website}
                                </a>
                            </div>
                        </div>
                        <div className="mt-[25px]">
                            <div className="flex items-center text-[#424955] text-[18px] gap-[10px] font-bold mb-[10px]">
                                <img src={jobDetailsicon} alt="" />
                                Job Description
                            </div>
                            <span
                                className="text-[#323842] text-justify text-[14px] font-normal line-clamp-3 overflow-hidden text-ellipsis block"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        job?.job_description,
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
                            <div className="flex gap-[10px] flex-wrap mt-[10px]">
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    {job?.ctc && formattedCTC(job?.ctc)}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    {job?.years_of_experience &&
                                        formattedExperience(
                                            job?.years_of_experience,
                                        )}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    Job Level - {job?.job_level}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    Job Type - {job?.job_type}
                                </div>
                                {job?.job_type === "probation" && (
                                    <>
                                        <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                            {job?.probation_type}
                                        </div>
                                        <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                            {job?.probation_period}
                                        </div>
                                    </>
                                )}
                                {job?.job_type === "Consultant" && (
                                    <>
                                        <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                            Consultant Time Period :{" "}
                                            {job?.time_period} Years
                                        </div>
                                    </>
                                )}

                                {job?.job_type == "Intern" && (
                                    <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                        {job?.time_period}
                                    </div>
                                )}
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    {job?.notice_period}
                                </div>
                                {job?.notice_time !== "" && (
                                    <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                        Notice Time : {job?.notice_time} days
                                    </div>
                                )}
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    {job?.timings}
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    {job?.working_days_per_week} Working days in
                                    week
                                </div>
                                <div className="rounded-[23px] bg-[#136DD31C] text-[#555] text-center text-[12.6px] font-medium p-[10px]">
                                    Industry - {job?.industry}
                                </div>
                            </div>
                        </div>
                        <div className="mt-[25px]">
                            <div className="flex items-center text-[#424955] text-[18px] gap-[10px] font-bold mb-[10px]">
                                <img src={jobDescriptionicon} alt="" />
                                Skills List
                            </div>
                            <div className="flex flex-col md:flex-row mt-[10px] gap-[20px]">
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
                            <div className="flex items-center text-[#424955] text-[18px] gap-[10px] font-bold mb-[20px]">
                                <img src={additionalInformationicon} alt="" />
                                Additional Details
                            </div>
                            <div className="preferences">
                                <span className="text-[#424955] text-[16px] font-medium">
                                    Preferences
                                </span>
                                <div className="mt-[10px] mb-[10px] flex gap-[15px] flex-wrap">
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Age limit :{" "}
                                        {job?.age || "Not mentioned"}
                                    </span>
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Differently abled Preference :{" "}
                                        {job?.differently_abled ||
                                            "Not mentioned"}{" "}
                                    </span>
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {" "}
                                        Gender Preferences :{" "}
                                        {job?.gender || "Not mentioned"}{" "}
                                    </span>
                                </div>
                            </div>
                            <div className="education">
                                <span className="text-[#424955] text-[16px] font-medium">
                                    Education
                                </span>
                                <div className="mt-[10px] mb-[10px] flex gap-[15px] flex-wrap">
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.qualifications}
                                    </span>
                                </div>
                            </div>
                            <div className="lanugages">
                                <span className="text-[#424955] text-[16px] font-medium">
                                    Languages specific
                                </span>
                                <div className="mt-[10px] mb-[10px] flex gap-[15px] flex-wrap">
                                    {job?.languages?.split(",").map((lang) => (
                                        <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="passport">
                                <span className="text-[#424955] text-[16px] font-medium">
                                    Passport and Visa status
                                </span>
                                <div className="mt-[10px] mb-[10px] flex gap-[15px] flex-wrap">
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.passport_availability === ""
                                            ? "Not Required"
                                            : job?.passport_availability}
                                    </span>
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.visa_status === ""
                                            ? "No Mention"
                                            : job?.visa_status}
                                    </span>
                                </div>
                            </div>
                            <div className="decision-maker">
                                <span className="text-[#424955] text-[16px] font-medium">
                                    Decision Maker
                                </span>
                                <div className="mt-[10px] mb-[10px] flex gap-[15px] flex-wrap">
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.decision_maker || "Not mentioned"}
                                    </span>
                                    <span className="flex px-[11.6px] py-[5.8px] items-center gap-[4px] text-[#555] text-center text-[12.6px] font-medium rounded-[23px] bg-[#136DD31C]">
                                        {job?.decision_maker_email ||
                                            "Not mentioned"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[15px]">
                            <div className="text-[#424955] text-[17px] font-medium">
                                Other Benefits
                            </div>
                            <span className="text-[#323842] text-justify text-[14px] font-normal">
                                {job.other_benefits}
                            </span>
                        </div>
                        <div className="mt-[15px]">
                            <div className="text-[#424955] text-[17px] font-medium">
                                Locations
                            </div>
                            <div className="flex flex-wrap gap-[20px]">
                                {job?.locations?.map((item, index) => (
                                    <div className="flex flex-col p-[10px] bg-[#136DD31C] rounded-[10px]">
                                        <span className="text-[#424955] text-[14px] font-medium">
                                            Location : {item?.location}
                                        </span>
                                        <span className="text-[#424955] text-[14px] font-medium">
                                            Positions : {item?.positions}
                                        </span>
                                        <span className="text-[#424955] text-[14px] font-medium">
                                            Job Type : {item?.job_type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-[15px] flex gap-[15px] flex-wrap">
                            <div className="text-[14px] font-bold">
                                <span className="color-[#5C6472] text-justify font-bold">
                                    Rotational Shift :{" "}
                                </span>{" "}
                                <span className="font-light">
                                    {job?.rotational_shift == true
                                        ? "Yes"
                                        : "No"}
                                </span>
                            </div>
                            <div className="text-[14px] font-bold">
                                <span className="color-[#5C6472] text-justify font-bold">
                                    Bond :{" "}
                                </span>{" "}
                                <span className="font-light">
                                    {job?.bond || "No Bond"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-[30%]">
                        <div className="text-[#171A1F] text-[20px] font-semibold">
                            Interviewer Assigned
                           
                        </div>
                        {job?.interview_details?.map((item, index) => (
                            <InterviewsCard key={index} item={item} />
                        ))}

                        {job?.assigned_to && (
                            <>
                                <div className="text-[#171A1F] text-[20px] font-semibold mt-[15px]">
                                    Recruiters Assigned
                                </div>
                                {job?.assigned_to?.map((item, index) => (
                                    <RecruiterCard key={index} item={item} />
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}

            <Modal
                title="Full Job Description"
                open={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
                width="80%"
            >
                <div>
                    <div
                        className="text-[#323842] text-justify text-[14px] font-normal line-clamp-3 overflow-hidden text-ellipsis block"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(job?.job_description),
                        }}
                    ></div>
                </div>
            </Modal>
            <Modal
                title="Change Recruiter"
                open={isChangeRecruiterModalOpen}
                onOk={handleChangeRecruiterOk}
                onCancel={handleChangeRecruiterCancel}
            >
                <div>
                    <Select
                        placeholder="Select a recruiter"
                        style={{ width: "100%" }}
                        onChange={handleChangeRecruiter}
                        options={recruiters.map((recruiter) => ({
                            value: recruiter.username,
                            label: recruiter.username,
                        }))}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ViewJobPost;
