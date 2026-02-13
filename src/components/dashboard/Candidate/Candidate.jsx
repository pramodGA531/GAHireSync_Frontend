import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import { Button, message, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../../images/Client/profile.png";

const Candidate = () => {
    const { token, apiurl } = useAuth();
    const navigate = useNavigate();
    const [candidateData, setCandidateData] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [reconfirmationData, SetReconfirmationData] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/dashboard/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.candidate_data) {
                setCandidateData(data.candidate_data);
            }
            if (data.upcoming_interviews) {
                setInterviews(data.upcoming_interviews);
            }
        } catch (e) {
            message.error("Failed to fetch applications");
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const columns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_id",
            render: (jobTitle) => (
                <div className="text-[#2C5F99] text-center text-base">
                    {jobTitle}
                </div>
            ),
        },
        {
            title: "Job Location",
            dataIndex: "job_location",
            key: "job_location",
        },

        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
        },
        {
            title: "Interviewer Name",
            dataIndex: "interviewer_name",
            key: "interviewer_name",
        },
        {
            title: "Scheduled Date",
            dataIndex: "scheduled_date_and_time",
            key: "scheduled_date_and_time",
        },
    ];
    useEffect(() => {
        fillprofile();
    }, [candidateData]);
    const fillprofile= () =>{
        
        if(candidateData?.percentage_filled < 50){
            message.info("Please fill your profile to continue");
            navigate("/profile");
        }
    }
    return (
        <Main defaultSelectedKey="1">
            <div className="flex flex-col lg:flex-row gap-2 w-full justify-between items-stretch m-2">
                <div className="border border-[#bec3c8] rounded-lg bg-white flex-1 flex flex-col justify-between">
                    <div className="flex p-3">
                        <div className="flex flex-col items-center">
                            <div
                                className="h-[135px] w-[135px] rounded-full flex items-center justify-center rotate-180 transition-[background] duration-1000 ease-in-out"
                                style={{
                                    background: `conic-gradient(
                  rgba(86, 168, 253, 1) ${
                      candidateData?.percentage_filled || 45
                  }%, 
                  #fff 0%
                )`,
                                }}
                            >
                                <div className="h-[120px] w-[120px] bg-white -rotate-180 rounded-full overflow-hidden flex items-center justify-center">
                                    <img
                                        src={
                                            candidateData?.profile
                                                ? `${apiurl}/${candidateData.profile}`
                                                : Profile
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="bg-[#56A8FD] py-1 px-2.5 rounded-[5px] text-sm text-white -mt-4 z-10">
                                {candidateData?.percentage_filled} %
                            </div>
                        </div>
                        <div className="ml-5 flex flex-col justify-center">
                            <div className="text-[#3C3F46] text-lg font-semibold">
                                {candidateData?.candidate_name}
                            </div>
                            <div className="mt-1">
                                Last Update: {candidateData?.last_updated}
                            </div>
                            <button
                                onClick={() => {
                                    navigate("/profile");
                                }}
                                className="mt-2.5 rounded-md bg-[#345B9B] px-2.5 py-[5px] text-white"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                    <div className="text-[#A2A1A8] text-base font-normal p-2.5 pb-[18px] border-t border-[#CAC7C7]">
                        <span>
                            Make you update profile everyday, for better results
                        </span>
                    </div>
                </div>
                <div className="border border-[#bec3c8] rounded-lg bg-white flex-1 flex flex-col justify-between">
                    <div
                        className="flex p-3"
                        style={{ marginTop: "14px", marginBottom: "14px" }}
                    >
                        <div className="w-20 h-20 bg-[#f1f5f9] rounded-full border-2 border-[#878A8D] flex justify-center items-center shrink-0">
                            <span className="text-[#123673] text-[28px] font-semibold">
                                {candidateData?.recruiter_shared}
                            </span>
                        </div>
                        <div className="ml-5 flex flex-col justify-center">
                            <div className="text-[#3C3F46] text-lg font-semibold">
                                Viewed by Recruiter
                            </div>
                            <div className="mt-1">
                                Last Job: {candidateData?.latest_job}
                            </div>
                        </div>
                    </div>
                    <div className="text-[#A2A1A8] text-base font-normal p-2.5 pb-[18px] border-t border-[#CAC7C7]">
                        <span>
                            Make you update profile everyday, for better results
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-evenly gap-2 p-2.5 border border-[#bec3c8] rounded-lg bg-white flex-1">
                    <div className="flex gap-2.5">
                        <div className="rounded-lg border border-[#E4E4E4] flex flex-col items-center justify-center min-w-[150px] flex-1 min-h-[80px] bg-[#56A8FD] text-white">
                            <div className="text-xs font-light">
                                Profiles Shared
                            </div>
                            <span className="font-semibold text-[22px]">
                                {candidateData?.recruiter_shared}
                            </span>
                        </div>
                        <div className="rounded-lg border border-[#E4E4E4] flex flex-col items-center justify-center min-w-[150px] flex-1 min-h-[80px] bg-[#fcaaaa] text-white">
                            <div className="text-xs font-light">
                                Profiles Rejected
                            </div>
                            <span className="font-semibold text-[22px]">
                                {candidateData?.rejected}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        <div className="rounded-lg border border-[#E4E4E4] flex flex-col items-center justify-center min-w-[150px] flex-1 min-h-[80px]">
                            <div className="text-xs font-light">
                                Under Processing
                            </div>
                            <span className="font-semibold text-[22px]">
                                {candidateData?.processing}
                            </span>
                        </div>
                        <div className="rounded-lg border border-[#E4E4E4] flex flex-col items-center justify-center min-w-[150px] flex-1 min-h-[80px]">
                            <div className="text-xs font-light">On Hold</div>
                            <span className="val">{candidateData?.onhold}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-2 mt-10">
                <h2 className="text-[#565E6C] mt-10">Upcoming Interviews</h2>
                <Table
                    columns={columns}
                    dataSource={interviews}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </Main>
    );
};

export default Candidate;
