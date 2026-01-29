import React, { useState, useEffect } from "react";
import Main from "../Layout";
import { message } from "antd";
import { useAuth } from "../../../common/useAuth";
import GoBack from "../../../common/Goback";

import profile_pic from "../../../../images/Manager/ViewCandidate/sampleProfile.png";
import image1 from "../../../../images/Manager/ViewCandidate/image.png";
import image2 from "../../../../images/Manager/ViewCandidate/image2.png";
import image3 from "../../../../images/Manager/ViewCandidate/image3.png";
import checked_success from "../../../../images/Manager/ViewCandidate/checked-success.svg";
import checked_failed from "../../../../images/Manager/ViewCandidate/checked-failed.svg";
import briefcase from "../../../../images/Manager/ViewCandidate/briefcase.svg";
import people from "../../../../images/Manager/ViewCandidate/people.svg";

import {
    MailOutlined,
    PhoneOutlined,
    PushpinOutlined,
} from "@ant-design/icons";

const Profile = ({ profile }) => {
    const data = profile;
    console.log(data);
    const education = [
        {
            id: 1,
            details: "JNTUGV -UCEV, CSE, Vizianagaram",
        },
        {
            id: 2,
            details: "JNTUGV -UCEV, CSE, Vizianagaram",
        },
        {
            id: 3,
            details: "JNTUGV -UCEV, CSE, Vizianagaram",
        },
        {
            id: 4,
            details: "JNTUGV -UCEV, CSE, Vizianagaram",
        },
    ];
    return (
        <div className="w-[30%] pt-5">
            <div className="flex gap-5">
                <div className="profile-pic">
                    <img src={profile_pic} alt="Profile Pic" />
                </div>
                <div className="flex flex-col mt-[5px]">
                    <span className="text-[#4F4F4F] text-lg font-bold">
                        {data.candidate_name}
                    </span>
                    <div className="mt-2.5 flex flex-col text-[#9297A6] font-medium text-xs">
                        <span className="phone">
                            {" "}
                            <PhoneOutlined />
                            <span className="ml-[5px]">
                                {" "}
                                {data.candidate_phone}{" "}
                            </span>
                        </span>
                        <span className="mt-[5px]">
                            {" "}
                            <PushpinOutlined />{" "}
                            <span className="ml-[5px]">
                                {" "}
                                {data.candidate_location}{" "}
                            </span>
                        </span>
                    </div>
                    <span className="mt-[5px] text-[#9297A6] font-medium text-xs">
                        <MailOutlined />{" "}
                        <span className="ml-[5px]">
                            {" "}
                            {data.candidate_email}{" "}
                        </span>
                    </span>
                </div>
            </div>
            <div className="mt-[15px]">
                <div className="flex items-center justify-between w-[85%]">
                    <span className="text-black/70 font-normal text-sm">
                        Profile Completion
                    </span>
                    {/* <span className="edit"><EditOutlined /> Edit</span> */}
                </div>
                <div className="mt-[15px] w-[80%] bg-[#E6E6E6] h-px flex">
                    <div
                        className="h-[10px] bg-gradient-to-r from-[#80A3FF] to-[#012173] relative -top-[5px] rounded-2xl"
                        style={{ width: `${data.profile_percentage}%` }}
                    ></div>
                    <div className="relative h-9 w-9 flex justify-center items-center -top-[18px] bg-white rounded-[5px] shadow-[1px_1px_3px_rgba(0,0,0,0.25)] -left-[3px]">
                        <div className="text-black font-bold text-[11px]">
                            {data.profile_percentage}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-[#ECEBF5] rounded-md w-full pb-2.5">
                <div className="border-b border-[#C3C1C1] flex items-center gap-5">
                    <span className="ml-5 text-black/70 font-bold text-sm flex-none w-[80px]">
                        Skills
                    </span>
                    <span className="text-[#18191C] font-normal text-sm mt-2.5 mb-2.5 flex flex-col">
                        {data.skills}
                    </span>
                </div>
                <div className="border-b border-[#C3C1C1] flex items-center gap-5">
                    <span className="ml-5 text-black/70 font-bold text-sm flex-none w-[80px]">
                        Education
                    </span>
                    <span className="text-[#18191C] font-normal text-sm mt-2.5 mb-2.5 flex flex-col">
                        {data.education.map((item, index) => (
                            <span key={index} className="education">
                                {item.result}
                            </span>
                        ))}
                    </span>
                </div>
                <div className="border-b border-[#C3C1C1] flex items-center gap-5">
                    <span className="ml-5 text-black/70 font-bold text-sm flex-none w-[80px]">
                        Experience
                    </span>
                    <span className="text-[#18191C] font-normal text-sm mt-2.5 mb-2.5 flex flex-col ">
                        {data.experience.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <span className="company_name">
                                    {item.company_name}
                                </span>
                                <span className="text-xs text-[#A5AAB5]">
                                    {item.duration}
                                </span>
                            </div>
                        ))}
                    </span>
                </div>
                <div className="border-b border-[#C3C1C1] flex items-center gap-5">
                    <span className="ml-5 text-black/70 font-bold text-sm flex-none w-[80px]">
                        Salary
                    </span>
                    <span className="text-[#18191C] font-normal text-sm mt-2.5 mb-2.5 flex flex-col">
                        {data.salary}
                    </span>
                </div>
                <div className="border-b border-[#C3C1C1] flex items-center gap-5">
                    <span className="ml-5 text-black/70 font-bold text-sm flex-none w-[80px]">
                        Extra Info
                    </span>
                    <span className="text-[#18191C] font-normal text-sm mt-2.5 mb-2.5 flex flex-col">
                        {data.extra_info}
                    </span>
                </div>
                <div className="border border-[#A5AAB5] m-2.5 rounded-md bg-white pb-[5px]">
                    <div className="h-10 items-center flex justify-between px-5 text-[#747474] font-normal text-sm">
                        <span className="title">Documents</span>
                        <span className="cursor-pointer">
                            Click to Download
                        </span>
                    </div>
                    <div className="mt-0 w-full bg-[#E6E6E6] h-px flex"></div>
                    <div className="mt-5 flex gap-5 ml-[15px]">
                        {profile.documents && (
                            <span className="border-2 border-[#005BBE] items-center px-2.5 py-[5px] text-[#005BBE] rounded cursor-pointer">
                                {profile.documents.document_name}
                            </span>
                        )}
                    </div>
                    <div className="mt-[15px] ml-[200px]">
                        <span className="relative -right-[30px] text-[#407BFF] cursor-pointer">
                            Download All
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobDetails = ({ jobs, candidate_id }) => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState();
    const [jobId, setJobId] = useState(0);

    const rounds = data?.all_rounds;

    const selected = data?.selected_round;

    const fetchJobData = async (job_id) => {
        try {
            const response = await fetch(
                `${apiurl}/candidate_status_for_job/?job_id=${job_id}&candidate_id=${candidate_id}`,
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
            }
            setData(data);
        } catch (e) {
            console.log(e);
            message.error(e);
        }
    };

    useEffect(() => {
        if (jobs && jobs[jobId]) {
            fetchJobData(jobs[jobId].job_id);
        }
    }, [jobId, jobs]);

    return (
        <div className="w-[45%] ml-5 mt-[30px]">
            <div className="border-[2px] border-[#E5E5E5] flex items-center gap-2.5 pl-2.5 rounded-[5px]">
                <span className="border-r-[2px] border-[#E5E5E5] h-10 flex pr-2.5 items-center text-sm font-medium">
                    Applied Jobs
                </span>
                <span className="dropdown">
                    <select
                        name="job_titles"
                        value={jobs[jobId]?.title}
                        onChange={(e) => {
                            const newJobId = jobs.findIndex(
                                (job) => job.title === e.target.value,
                            );
                            console.log(newJobId);
                            setJobId(newJobId); // Update jobId based on selected job
                        }}
                        className="font-light border-none bg-[#F8F8F8] outline-none cursor-pointer relative"
                    >
                        {jobs.map((job) => (
                            <option value={job.title} key={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </span>
            </div>

            <div className="border-[2px] border-[#E5E5E5] rounded-[10px] mt-5">
                <div className="flex border-b border-[#E5E5E5] h-[55px] items-center justify-evenly text-[#3E3B3B]">
                    <span>Job Overview</span>
                    <span className="job_position">
                        {data?.new_position ? `New Position` : "Old Position"}
                    </span>
                    <span className="flex flex-col items-end">
                        <span>Created By - {data?.interviewer}</span>
                        <span className="text-[10px]">
                            {data?.created_at
                                ? new Date(data.created_at).toLocaleDateString()
                                : "Date not available"}
                        </span>
                    </span>
                </div>
                <div className="flex justify-evenly h-[90px] items-center">
                    <div className="p-2.5 flex h-[60px] gap-2.5 border-[2px] border-[#E5E5E5] rounded-md">
                        <span className="bg-[#E7F0FA] w-10 h-10 flex items-center justify-center rounded-[3px]">
                            <img src={briefcase} alt="briefcase" />
                        </span>
                        <div className="flex flex-col justify-center">
                            <span className="text-[#18191C] font-medium text-sm">
                                {data?.job_experience}
                            </span>
                            <span className="text-[#767F8C] font-normal text-[10px]">
                                Experience
                            </span>
                        </div>
                    </div>
                    <div className="p-2.5 flex h-[60px] gap-2.5 border-[2px] border-[#E5E5E5] rounded-md">
                        <span className="bg-[#E7F0FA] w-10 h-10 flex items-center justify-center rounded-[3px]">
                            <img src={briefcase} alt="briefcase" />
                        </span>
                        <div className="flex flex-col justify-center">
                            <span className="text-[#18191C] font-medium text-sm">
                                {data?.job_graduation}
                            </span>
                            <span className="text-[#767F8C] font-normal text-[10px]">
                                Educations
                            </span>
                        </div>
                    </div>
                    <div className="p-2.5 flex h-[60px] gap-2.5 border-[2px] border-[#E5E5E5] rounded-md">
                        <span className="bg-[#E7F0FA] w-10 h-10 flex items-center justify-center rounded-[3px]">
                            <img src={people} alt="people" />
                        </span>
                        <div className="flex flex-col justify-center">
                            <span className="text-[#18191C] font-medium text-sm">
                                {data?.num_of_positions}
                            </span>
                            <span className="text-[#767F8C] font-normal text-[10px]">
                                Positions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[30px] flex gap-5 text-sm font-normal">
                <span className="title">Current Stage</span>
                <span className="flex border-[2px] border-[#D7D7D7] h-[30px] w-[80px] items-center justify-center rounded-[5px] text-[#18191C] font-medium text-[15px] -mt-[5px]">
                    {data?.current_stage}
                </span>
                <span className="text-[#4B93E7] cursor-pointer font-medium text-[13px]">
                    View CTC
                </span>
            </div>

            <div className="mt-[15px] w-full border-[2px] border-[#C6C6C6] flex gap-5 px-[15px] py-[5px] rounded-[7.6px] overflow-x-auto whitespace-nowrap scrollbar-hide">
                {rounds &&
                    rounds.map((round) => (
                        <span
                            key={round}
                            className={`min-w-[120px] text-xs text-center px-[15px] py-[10px] rounded-[5px] cursor-pointer transition-all duration-300 hover:bg-gray-400 ${
                                selected === round
                                    ? "bg-[#4B93E7] text-white"
                                    : ""
                            }`}
                        >
                            {round}
                        </span>
                    ))}
            </div>

            <div className="mt-5 border-[2px] border-[#E6E6E6] rounded-[6px]">
                <div className="flex justify-between px-[25px] py-[15px] border-b-[2px] border-[#E6E6E6] text-sm font-medium">
                    <span className="title">Interviews</span>
                    <span className="text-[#18191C] font-normal">
                        Scheduled By- {data?.interviewer}
                        <span className="ml-[10px]">
                            {data?.next_round_time
                                ? new Date(
                                      data.next_round_time,
                                  ).toLocaleDateString()
                                : "Date Not Mentioned"}
                        </span>
                    </span>
                </div>
                <div className="m-[15px_25px] flex">
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-between text-[#18191C] font-medium">
                            <span className="interview_name">
                                {data?.interview_type}
                            </span>
                            <span className="bg-[#F9F3E5] rounded-lg px-2 py-[5px] text-[#ADAEAF] font-medium text-[9px]">
                                {data?.interview_mode}
                            </span>
                        </div>
                        <span className="mt-[5px] text-[#18191C] font-medium text-[11px]">
                            {data?.next_round_time
                                ? new Date(
                                      data.next_round_time,
                                  ).toLocaleString()
                                : "Date Not Mentioned"}
                        </span>
                        <span className="mt-[5px] text-[#ADAEAF] text-[11px]">
                            Meet Link:{" "}
                            <a href={data?.meet_link}>
                                {data?.meet_link
                                    ? data?.meet_link
                                    : "Meet link not added"}{" "}
                            </a>
                        </span>
                    </div>
                    <div className="ml-[30px] flex flex-col items-center">
                        <span className="name">Assigned Recruiter</span>
                        <img src={image1} alt="" className="mt-[7px]" />
                        <span className="name">{data?.recruiter_name}</span>
                    </div>
                    <div className="ml-[30px]">
                        <span className="title">Interviewers</span>
                        <div className="mt-[7px]">
                            <img
                                className="mr-[-15px] inline-block"
                                src={image2}
                                alt=""
                            />
                            <img
                                className="mr-[-15px] inline-block"
                                src={image3}
                                alt=""
                            />
                            <img className="inline-block" src={image1} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-around">
                <div className="mt-5 flex flex-col justify-center max-w-[45%]">
                    <div className="flex gap-5">
                        <img src={checked_success} alt="success" />
                        <div className="details">
                            <div className="text-[#008000] text-[10px] font-medium mt-[5px]">
                                What Skills Matched?
                            </div>
                            <div className="mt-[5px] font-medium text-[13px]">
                                {data?.matched_skills
                                    ? data.matched_skills.join(", ")
                                    : "No matched skills"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex flex-col justify-center max-w-[45%]">
                    <div className="flex gap-5">
                        <img src={checked_failed} alt="failed" />
                        <div className="details">
                            <div className="text-[#BC6969] text-[10px] font-medium mt-[5px]">
                                What Skills Not Matched?
                            </div>
                            <div className="mt-[5px] font-medium text-[13px]">
                                {data?.unmatched_skills
                                    ? data.unmatched_skills.join(", ")
                                    : "No unmatched skills"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Comments = ({ feedback }) => {
    const count = feedback.length;
    // const comments = [
    //     {
    //         "id": 1,
    //         "name": "Interviewer Name 1",
    //         "feedback": "This is the feedback of interviewer 1, and he said more about this guy ",
    //         "profile": image1
    //     },
    //     {
    //         "id": 2,
    //         "name": "Interviewer Name 2",
    //         "feedback": "This is the feedback of interviewer 1, and he said more about this gy",
    //         "profile": image2
    //     },

    // ]

    const comments = feedback;

    return (
        <div className="mt-[30px] w-[25%] ml-2.5">
            <div className="border-[2px] border-[#E6E6E6] pb-[15px] rounded-[6px]">
                <div className="flex gap-5 pl-[15px] text-[#505050] font-bold text-base py-[15px] pb-[10px] border-b-[2px] border-[#E6E6E6]">
                    <span className="title">Comments</span>
                    <span className="bg-[#005BBE] px-[13px] py-[2px] -mt-[3px] rounded-[9px] text-white">
                        {count}
                    </span>
                </div>
                {comments.map((comment, index) => (
                    <div
                        className="mt-[15px] pl-[15px] flex items-center gap-2.5"
                        key={index}
                    >
                        <img
                            src={image1}
                            alt="image here"
                            className="h-10 w-10"
                        />
                        <div className="flex flex-col mt-[5px]">
                            <span className="text-[#4F4F4F] text-sm font-semibold">
                                {comment.interviewer_name}
                            </span>
                            <span className="text-[#949498] text-xs font-normal">
                                {comment.feedback}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NotUpdatedProfile = ({ candidate_id }) => {
    const { apiurl, token } = useAuth();
    const sendNotification = async () => {
        try {
            const response = await fetch(
                `${apiurl}/notification_to_update_profile/?id=${candidate_id}`,
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
            }
            if (data.error) {
                message.error(data.error);
            }
        } catch (e) {
            message.error(e);
        }
    };

    return (
        <div className="max-h-[30%] flex flex-col items-center justify-center">
            {message && message.success && (
                <div className="text-green-600 mb-2">{message.success}</div>
            )}
            <div className="rounded-[5px] px-[10px] py-5 bg-white justify-center flex flex-col">
                <div className="text-[#005BBE] text-[15px] font-medium">
                    Candidate is'nt updated his profile yet
                </div>
                <div className="text-[#B3904F] text-[13px]">
                    Notify Candidate to update his profile
                </div>
                <button
                    onClick={() => sendNotification()}
                    className="mt-2.5 bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                    Send Notification
                </button>
            </div>
        </div>
    );
};

const ViewCandidate = () => {
    const [profile, setProfile] = useState();
    const { token, apiurl } = useAuth();
    const [jobs, setJobs] = useState();
    const [feedback, setFeedback] = useState([]);

    const candidate_id = 2;

    const fetchProfile = async () => {
        try {
            const response = await fetch(
                `${apiurl}/view_candidate_profile/?id=${candidate_id}`,
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
            }
            if (data.candidate_data) {
                setProfile(data.candidate_data);
            }
            if (!data.candidate_data) {
                message.error("Candidate is not updated his profile, ");
            }
            if (data.applied_jobs) {
                setJobs(data.applied_jobs);
            }
            if (data.feedback) {
                setFeedback(data.feedback);
            }
        } catch (e) {
            message.error(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    return (
        <Main defaultSelectedKey="9">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="flex">
                {profile && <Profile profile={profile} />}
                {!profile && <NotUpdatedProfile candidate_id={candidate_id} />}
                {jobs && <JobDetails jobs={jobs} candidate_id={candidate_id} />}
                {feedback && <Comments feedback={feedback} />}
            </div>
        </Main>
    );
};

export default ViewCandidate;
