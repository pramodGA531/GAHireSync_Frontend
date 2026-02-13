import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Spin } from "antd";
import Location from "../../../../images/Client/Location.svg";
import Note from "../../../../images/Client/note.svg";
import Experience from "../../../../images/Client/Experience.svg";
import MoneyBag from "../../../../images/Client/money bag.svg";
import Piechart from "../../../../images/Client/Piechart.svg";
import Bag from "../../../../images/briefcase.svg";
// import "./ViewResume.css";
import { Modal, Input } from "antd";
import ResumeViewer from "../../../common/ResumeViewer";

const ViewResume = ({ id, onClose }) => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [reason, setReason] = useState("");
    const [currentResumeId, setCurrentResumeId] = useState();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/applications/complete-resume/?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const resData = await response.json();
            if (resData.error) {
                message.error(resData.error);
            } else {
                setData(resData);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && id) fetchData();
    }, [token, id]);

    const openModal = (type, resumeId) => {
        setModalType(type);
        setCurrentResumeId(resumeId);
        setReason("");
    };

    const handleModalSubmit = async () => {
        setLoading(true);
        let url = "";
        let body = {};

        if (modalType === "accept") {
            url = `${apiurl}/client/accept-application/?id=${currentResumeId}`;
            body = {
                feedback: reason,
                resume_id: currentResumeId,
                round_num: 1,
            };
        } else if (modalType === "reject") {
            url = `${apiurl}/client/reject-application/?id=${currentResumeId}`;
            body = { feedback: reason };
        } else if (modalType === "select") {
            url = `${apiurl}/client/select-application/?id=${currentResumeId}`;
            body = { feedback: reason };
        }

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const resData = await response.json();
            if (!response.ok) {
                message.error(resData.error || "An error occurred.");
            } else {
                message.success(resData.message);
                window.location.reload();
            }
        } catch (e) {
            message.error(e.message);
        } finally {
            setLoading(false);
            setModalType("");
        }
    };

    return (
        <div className="p-4 h-[600px] overflow-hidden">
            {loading ? (
                <div className="flex h-full items-center justify-center">
                    <Spin tip="Loading..." />
                </div>
            ) : (
                data && (
                    <div className="flex flex-row h-full gap-5">
                        <div className="w-1/2 flex flex-col overflow-y-auto no-scrollbar pr-2">
                            {/* Candidate Details */}
                            <div className="flex justify-between p-2.5">
                                <div className="flex flex-col">
                                    <span className="text-base text-[#54577A] font-semibold">
                                        {data.candidate_name}
                                    </span>
                                    <span className="text-xs font-normal text-[#54577A]">
                                        {data.date_of_birth || "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            {data.current_job_type && (
                                <div className="flex flex-wrap gap-2.5 mt-[5px] pb-2.5 mb-2.5 border-b border-[#54666929]">
                                    <span className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                        <img src={Bag} alt="" />
                                        {data.current_organization || "N/A"}
                                    </span>
                                    <span className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                        <img src={Location} alt="" />
                                        {data.current_job_location || "N/A"}
                                    </span>
                                    <span className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                        <img src={MoneyBag} alt="" />
                                        {data.current_ctc
                                            ? `${data.current_ctc} LPA`
                                            : "N/A"}
                                    </span>
                                    {data.notice_period && (
                                        <span className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                            <img src={Note} alt="" />
                                            {data.notice_period} days Notice
                                        </span>
                                    )}
                                    <span className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                        <img src={Piechart} alt="" />
                                        {data.current_job_type || "N/A"}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2.5 mt-[5px] pb-2.5 mb-2.5 border-b border-[#54666929]">
                                <div className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                    <img src={MoneyBag} alt="" />
                                    Expected CTC:{" "}
                                    {data.expected_ctc
                                        ? `${data.expected_ctc} LPA`
                                        : "N/A"}
                                </div>
                                <div className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                    <img src={Experience} alt="" />
                                    Experience:{" "}
                                    {data.experience
                                        ? `${data.experience} years`
                                        : "N/A"}
                                </div>
                            </div>

                            {/* Primary Skills */}
                            <div className="mb-2.5 border-b border-[#54666929]">
                                <div className="font-bold mb-2">
                                    Primary Skills
                                </div>
                                <div className="flex flex-row flex-wrap gap-2.5 mb-[15px]">
                                    {data.primary_skills &&
                                    data.primary_skills.length > 0 ? (
                                        data.primary_skills.map(
                                            (skill, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2.5 flex flex-col items-start bg-gray-50 rounded"
                                                >
                                                    <span className="text-sm text-[#171A1F] font-bold">
                                                        {skill.skill_name}
                                                    </span>
                                                    <span className="text-xs">
                                                        {skill.skill_metric}:{" "}
                                                        {skill.metric_value}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <span>No primary skills listed.</span>
                                    )}
                                </div>

                                {/* Secondary Skills */}
                                <div className="font-bold mb-2">
                                    Secondary Skills
                                </div>
                                <div className="flex flex-row flex-wrap gap-2.5 mb-[15px]">
                                    {data.secondary_skills &&
                                    data.secondary_skills.length > 0 ? (
                                        data.secondary_skills.map(
                                            (skill, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2.5 flex flex-col items-start bg-gray-50 rounded"
                                                >
                                                    <span className="text-sm text-[#171A1F] font-bold">
                                                        {skill.skill_name}
                                                    </span>
                                                    <span className="text-xs">
                                                        {skill.skill_metric}:{" "}
                                                        {skill.metric_value}
                                                    </span>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <span>No secondary skills listed.</span>
                                    )}
                                </div>
                            </div>

                            {/* Recruiter Feedback */}
                            {data.other_details && (
                                <div className="mb-2.5 border-b border-[#54666929]">
                                    <div className="font-bold mb-2">
                                        Recruiter Feedback
                                    </div>
                                    <div className="flex flex-wrap gap-2.5 mt-[5px] pb-2.5 mb-2.5">
                                        <div className="bg-[#1681FF0D] text-[#555555] flex items-center gap-[5px] px-2.5 py-2 rounded-[30px]">
                                            {data.other_details}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-auto pt-4">
                                {data.status === "pending" ? (
                                    <div className="flex flex-row justify-between">
                                        <button
                                            className="bg-[#E8618C1A] text-[#E8618C] h-10 px-2.5 rounded text-xs font-light border-none cursor-pointer hover:bg-[#E8618C33]"
                                            onClick={() =>
                                                openModal(
                                                    "reject",
                                                    data.resume_id,
                                                )
                                            }
                                        >
                                            Reject application
                                        </button>
                                        {data.next_interview ? (
                                            <button
                                                className="bg-[#1681FF0D] text-[#1681FF] h-10 px-2.5 rounded text-xs font-light border-none cursor-pointer hover:bg-[#1681FF33]"
                                                onClick={() =>
                                                    openModal(
                                                        "accept",
                                                        data.resume_id,
                                                    )
                                                }
                                            >
                                                Shortlist application
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-[#1681FF0D] text-[#1681FF] h-10 px-2.5 rounded text-xs font-light border-none cursor-pointer hover:bg-[#1681FF33]"
                                                onClick={() =>
                                                    openModal(
                                                        "select",
                                                        data.resume_id,
                                                    )
                                                }
                                            >
                                                Direct Select
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#1681FF0D] text-[#1681FF] h-10 px-2.5 rounded text-xs font-light flex items-center justify-center">
                                        {data.status}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resume Viewer */}
                        <div className="w-1/2 h-full border-l pl-2 overflow-hidden flex flex-col">
                            <div className="font-bold mb-2 text-lg">
                                Resume Preview
                            </div>
                            {data.resume && data.status !== "rejected" ? (
                                <div className="flex-1 overflow-hidden">
                                    <ResumeViewer
                                        resume={data.resume}
                                        onPrintScreenAttempt={onClose}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    {data.status === "rejected"
                                        ? "Resume not available for rejected candidates"
                                        : "No resume available"}
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}

            <Modal
                title={
                    modalType === "accept"
                        ? "Shortlist Candidate"
                        : modalType === "reject"
                          ? "Reject Candidate"
                          : modalType === "select"
                            ? "Direct Select Candidate"
                            : ""
                }
                open={modalType !== ""}
                onOk={handleModalSubmit}
                onCancel={() => setModalType("")}
                okText="Submit"
            >
                <p>Please provide a reason:</p>
                <Input.TextArea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason here..."
                />
            </Modal>
        </div>
    );
};

export default ViewResume;
