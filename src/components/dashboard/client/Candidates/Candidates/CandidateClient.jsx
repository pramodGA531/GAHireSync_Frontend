import React, { useEffect, useState } from "react";
import Main from "../../Layout";
import GoBack from "../../../../common/Goback";
import Profile from "../../../../../images/Client/profile.png";
import Location from "../../../../../images/Client/Location.svg";
import Bag from "../../../../../images/Client/Bag.svg";
import Envelope from "../../../../../images/Client/Envelope.svg";
import Resume from "../../../../../images/Client/TV.svg";
import Comments from "../../../../../images/Client/Comments.svg";
import { useAuth } from "../../../../common/useAuth";
import {
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    CalendarOutlined,
    FileProtectOutlined,
} from "@ant-design/icons";
import { message, Spin } from "antd";
import { useParams } from "react-router-dom";

const CandidateClient = () => {
    const { apiurl, token } = useAuth();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${apiurl}/client/candidate/?application_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setData(result);
            }
        } catch (e) {
            message.error("Failed to fetch candidate details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [id]);

    if (loading || !data) {
        return (
            <Spin style={{ marginTop: "20%", display: "block" }} size="large" />
        );
    }

    return (
        <Main defaultSelectedKey="4">
            <div className="p-2.5">
                <div className="mt-4 -ml-2 mb-4">
                    <GoBack />
                </div>
                <div className="main-heading">
                    <div className="text-[#171A1F] text-2xl font-bold">
                        Candidate Details
                    </div>
                </div>
                <div className="mt-5 flex gap-2.5 items-center">
                    <div className="h-[50px] w-[50px]">
                        <img
                            src={data.profile_image || Profile}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="name-details">
                        <div className="font-bold text-xl text-[#171A1F]">
                            {data.name}
                        </div>
                        <div className="flex flex-wrap gap-5 items-center">
                            <div className="flex gap-[5px] text-[#171A1F] font-normal text-sm mt-0 pt-0">
                                {" "}
                                <PhoneOutlined /> {data.phone}
                            </div>
                            <div className="flex gap-[5px] text-[#171A1F] font-normal text-sm mt-0 pt-0">
                                {" "}
                                <img src={Location} alt="" /> {data.location}
                            </div>
                            <div className="flex gap-[5px] text-[#171A1F] font-normal text-sm mt-0 pt-0">
                                <MailOutlined /> {data.email}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[30px]">
                    <div className="left">
                        <span className="text-[#1681FF] text-sm font-bold pb-[5px] border-b-[3px] border-[#1681FF] mb-2.5 inline-block">
                            Information
                        </span>

                        <div className="mt-[15px]">
                            <div className="flex items-center gap-[15px] text-[#171A1F] text-sm font-bold">
                                <img src={Bag} alt="" />
                                Working experience{" "}
                                <span className="rounded-[10px] bg-[#F3F4F6] text-[#323842] px-2.5 py-[3px]">
                                    {data.total_experience}
                                </span>
                            </div>
                            <div className="mt-[15px] ml-5 border-l-2 border-[#BCC1CA] pl-[30px]">
                                {data.experiences?.map((exp, index) => (
                                    <div className="mt-5" key={index}>
                                        <div className="text-[#171A1F] text-sm font-bold flex gap-2.5">
                                            {exp.role}{" "}
                                            <span className="bg-[#FDF1F5] text-[#E8618C] px-2.5 py-[3px]">
                                                {exp.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-5 mt-2.5">
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <FileProtectOutlined />{" "}
                                                {exp.employment_type}
                                            </span>
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <BankOutlined /> {exp.company}
                                            </span>
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <CalendarOutlined /> {exp.from}{" "}
                                                - {exp.to}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            Candidate is not yet updated working experience
                        </div>

                        <div className="mt-[15px]">
                            <div className="flex items-center gap-[15px] text-[#171A1F] text-sm font-bold">
                                <img src={Bag} alt="" />
                                Education Details
                            </div>
                            <div className="mt-[15px] ml-5 border-l-2 border-[#BCC1CA] pl-[30px]">
                                {data.education?.map((edu, index) => (
                                    <div className="mt-5" key={index}>
                                        <div className="text-[#171A1F] text-sm font-bold flex gap-2.5">
                                            {edu.degree}{" "}
                                            <span className="bg-[#FDF1F5] text-[#E8618C] px-2.5 py-[3px]">
                                                {edu.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-5 mt-2.5">
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <FileProtectOutlined />{" "}
                                                {edu.score}
                                            </span>
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <BankOutlined />{" "}
                                                {edu.institution}
                                            </span>
                                            <span className="flex flex-row gap-2.5 items-center text-[#6E7787] text-sm font-normal">
                                                <CalendarOutlined /> {edu.from}{" "}
                                                - {edu.to}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                Candidate is not updated his education details
                                yet
                            </div>
                        </div>

                        {data.resume && (
                            <div className="mt-[25px]">
                                <span className="flex gap-2.5 items-center text-sm text-[#171A1F] font-bold">
                                    <img
                                        src={Resume}
                                        alt=""
                                        className="bg-[#F2F5FD] p-2.5 rounded-md"
                                    />
                                    Resume
                                </span>
                                <div className="ml-[45px] bg-[#FAFAFB] p-5 rounded-[10px] text-[#424955] text-xs font-normal">
                                    {data.resume}
                                </div>
                            </div>
                        )}

                        {data.comments?.length > 0 && (
                            <div className="mt-[15px] flex flex-col gap-2.5">
                                <span className="flex gap-2.5 items-center text-sm text-[#171A1F] font-bold">
                                    <img
                                        src={Comments}
                                        alt=""
                                        className="bg-[#F2F5FD] p-2.5 rounded-md"
                                    />
                                    Comments
                                </span>
                                {data.comments.map((comment, index) => (
                                    <div
                                        className="ml-[45px] flex flex-col gap-2.5 px-5 py-[15px] bg-[#F2F5FD] rounded-lg"
                                        key={index}
                                    >
                                        <span className="text-sm font-bold text-[#171A1F]">
                                            {comment.interviewer}
                                        </span>
                                        <span className="text-xs font-bold text-[#6E7787]">
                                            {comment.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default CandidateClient;
