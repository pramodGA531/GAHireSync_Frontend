import React, { useEffect, useState } from "react";
// import "./Compare.css";
import Main from "../Layout";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import { message, Modal, Input, Breadcrumb, Tag } from "antd";
import GoBack from "../../../common/Goback";
import JobDescription from "../../../../images/Client/CreateJob/Jobdescription.svg";
import Note from "../../../../images/Client/note.svg";
import Experience from "../../../../images/Client/Experience.svg";
import Notice from "../../../../images/Client/Vacancies.svg";
import Bag from "../../../../images/Client/Bag.svg";
import { CloseOutlined } from "@ant-design/icons";
import ResumeModal from "../../../common/ResumeModal";

const JobComponent = ({ job }) => {
    return (
        <div className="p-[5px]">
            <div className="flex justify-between">
                <div className="flex items-center gap-[10px] justify-center text-[22px] font-normal text-[#171A1F]">
                    <img src={JobDescription} alt="" />
                    <span className="">Job Details</span>
                </div>
            </div>
            <div className="mt-[10px] flex gap-[20px]">
                <span className="flex items-center gap-[10px] text-sm font-bold text-[#282E38]">
                    <img src={Note} alt="" /> {job.ctc}
                </span>
                <span className="flex items-center gap-[10px] text-sm font-bold text-[#282E38]">
                    <img src={Bag} alt="" className="h-7 w-7 text-black" />{" "}
                    {job.job_title}
                </span>
                <Tag color={job.location_status === "opened" ? "green" : "red"}>
                    {job.location_status}
                </Tag>
            </div>
        </div>
    );
};

const Compare = () => {
    const { id } = useParams();
    const { apiurl, token } = useAuth();

    const [data, setData] = useState([]);
    const [jobData, setJobData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalType, setModalType] = useState(""); // accept, reject, select
    const [currentApplicationId, setCurrentApplicationId] = useState(null);
    const [reason, setReason] = useState("");
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [resumeToShow, setResumeToShow] = useState(null);

    const fetchCompareData = async (applicationIds) => {
        try {
            const response = await fetch(
                `${apiurl}/client/compare-list-view/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jobid: id,
                        application_ids: applicationIds,
                    }),
                },
            );
            if (!response.ok)
                throw new Error("Failed to fetch comparison data!");
            const result = await response.json();
            setData(result.data);
            setJobData(result.job_data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const compareListRaw = sessionStorage.getItem("compareList");
        if (compareListRaw) {
            const compareList = JSON.parse(compareListRaw);
            const applicationIds = compareList[id];

            if (applicationIds && applicationIds.length > 0) {
                fetchCompareData(applicationIds);
            } else {
                setLoading(false);
                setError("No applications selected for comparison.");
            }
        } else {
            setLoading(false);
            setError("No applications selected for comparison.");
        }
    }, [id]);

    const handleRemoveFromCompare = (applicationId, resumeId) => {
        const compareListRaw = sessionStorage.getItem("compareList");
        if (compareListRaw) {
            const compareList = JSON.parse(compareListRaw);
            const applicationIds = compareList[id] || [];

            const updatedApplicationIds = applicationIds.filter(
                (appId) => appId !== applicationId,
            );

            compareList[id] = updatedApplicationIds;
            sessionStorage.setItem("compareList", JSON.stringify(compareList));

            console.log(compareList);

            setData((prevData) =>
                prevData.filter((item) => item.resume_id !== resumeId),
            );

            if (updatedApplicationIds.length === 0) {
                setError("No applications selected for comparison.");
            }
        }
    };

    const openModal = (type, applicationId) => {
        setModalType(type);
        setCurrentApplicationId(applicationId);
        setReason("");
    };

    const fields = [
        { label: "Candidate Name", key: "candidate_name" },
        { label: "Sender", key: "sender" },
        { label: "Job Status", key: "job_status" },
        { label: "Current Organization", key: "current_organization" },
        { label: "Current Job Location", key: "current_job_location" },
        { label: "Current Job Type", key: "current_job_type" },
        { label: "Date of Birth", key: "date_of_birth" },
        { label: "Experience (yrs)", key: "experience" },
        { label: "Current CTC (LPA)", key: "current_ctc" },
        { label: "Expected CTC (LPA)", key: "expected_ctc" },
        { label: "Notice Period (days)", key: "notice_period" },
        { label: "Primary Skills", key: "primary_skills" },
        { label: "Secondary Skills", key: "secondary_skills" },
        { label: "Resume", key: "resume" },
        { label: "Actions", key: "actions" }, // This will be handled separately
    ];

    const handleModalSubmit = async () => {
        setLoading(true);
        let url = "";
        let body = {};
        console.log(currentApplicationId, " is the current application id");

        if (modalType === "accept") {
            url = `${apiurl}/client/accept-application/?id=${currentApplicationId}`;
            body = {
                feedback: reason,
                resume_id: currentApplicationId,
                round_num: 1,
            };
        } else if (modalType === "reject") {
            url = `${apiurl}/client/reject-application/?id=${currentApplicationId}`;
            body = { feedback: reason };
        } else if (modalType === "select") {
            url = `${apiurl}/client/select-application/?id=${currentApplicationId}`;
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
        <Main>
            {/* <div className="mt-4 -ml-2 -mb-4 pl-4">
                <GoBack />
            </div> */}
            <div className="m-4">
            <Breadcrumb
                items={[
                    // {
                    //     title: <Link to="/">Home</Link>,
                    // },
                    {
                        title: (
                            <Link to="/client/applications">Applications</Link>
                        ),
                    },
                    {
                        title: (
                            <Link to={`/client/get-resumes/${id}`}>
                                job-applications
                            </Link>
                        ),
                    },
                    {
                        title: "Compare",
                    },
                ]}
            /></div>
            <div className="p-5">
                {jobData && <JobComponent job={jobData} />}
                <h2>Compare Applications</h2>
                {loading && <p>Loading applications...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && data.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse mt-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                            <tbody>
                                {fields.map((field, idx) => (
                                    <tr key={idx}>
                                        <th className="bg-[#f4f4f4] w-[200px] text-left font-bold border border-[#ccc] p-3">
                                            {field.label}
                                        </th>
                                        {data.map((item, index) => (
                                            <td
                                                key={index}
                                                className="border border-[#ccc] p-3 text-center align-middle"
                                            >
                                                {field.key === "resume" ? (
                                                    <>
                                                        {item.resume ? (
                                                            <button
                                                                disabled={
                                                                    item.status ===
                                                                        "rejected" ||
                                                                    jobData?.location_status ===
                                                                        "closed"
                                                                }
                                                                style={{
                                                                    paddingLeft:
                                                                        "5px",
                                                                    paddingRight:
                                                                        "5px",
                                                                    paddingBlock:
                                                                        "7px",
                                                                    backgroundColor:
                                                                        jobData?.location_status ===
                                                                            "closed" ||
                                                                        item.status ===
                                                                            "rejected"
                                                                            ? "gray"
                                                                            : undefined,
                                                                }}
                                                                className={`text-blue-500 underline cursor-pointer hover:text-blue-700 bg-transparent border-none ${
                                                                    item.status ===
                                                                        "rejected" ||
                                                                    jobData?.location_status ===
                                                                        "closed"
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                                onClick={() => {
                                                                    setResumeToShow(
                                                                        item.resume,
                                                                    );
                                                                    setShowResumeModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                // target="_blank" // Removed as it opens a modal now
                                                                // rel="noopener noreferrer"
                                                            >
                                                                View Resume
                                                            </button>
                                                        ) : (
                                                            "Not uploaded"
                                                        )}
                                                    </>
                                                ) : field.key === "actions" ? (
                                                    item.status ===
                                                    "pending" ? (
                                                        <div className="flex gap-1.5 justify-center">
                                                            {jobData &&
                                                            jobData.interviews ===
                                                                0 ? (
                                                                <button
                                                                    disabled={
                                                                        item.status ===
                                                                            "rejected" ||
                                                                        jobData?.location_status ===
                                                                            "closed"
                                                                    }
                                                                    style={{
                                                                        backgroundColor:
                                                                            jobData?.location_status ===
                                                                                "closed" ||
                                                                            item.status ===
                                                                                "rejected"
                                                                                ? "gray"
                                                                                : undefined,
                                                                    }}
                                                                    className="px-[10px] py-[6px] border-none rounded-[4px] cursor-pointer bg-[#007bff] text-white transition-colors duration-300 hover:bg-[#0056b3]"
                                                                    onClick={() =>
                                                                        openModal(
                                                                            "select",
                                                                            item.resume_id,
                                                                        )
                                                                    }
                                                                >
                                                                    Direct
                                                                    Select
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    disabled={
                                                                        item.status ===
                                                                            "rejected" ||
                                                                        jobData?.location_status ===
                                                                            "closed"
                                                                    }
                                                                    style={{
                                                                        backgroundColor:
                                                                            jobData?.location_status ===
                                                                                "closed" ||
                                                                            item.status ===
                                                                                "rejected"
                                                                                ? "gray"
                                                                                : undefined,
                                                                    }}
                                                                    className="px-[10px] py-[6px] border-none rounded-[4px] cursor-pointer bg-[#007bff] text-white transition-colors duration-300 hover:bg-[#0056b3]"
                                                                    onClick={() =>
                                                                        openModal(
                                                                            "accept",
                                                                            item.resume_id,
                                                                        )
                                                                    }
                                                                >
                                                                    Shortlist
                                                                </button>
                                                            )}
                                                            <button
                                                                className="px-[10px] py-[6px] border-none rounded-[4px] cursor-pointer bg-[#007bff] text-white transition-colors duration-300 hover:bg-[#0056b3]"
                                                                onClick={() =>
                                                                    openModal(
                                                                        "reject",
                                                                        item.resume_id,
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span>
                                                            {item.status}
                                                        </span>
                                                    )
                                                ) : field.key ===
                                                  "primary_skills" ? (
                                                    item.primary_skills.length >
                                                    0 ? (
                                                        item.primary_skills.map(
                                                            (
                                                                skill,
                                                                skillIndex,
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        skillIndex
                                                                    }
                                                                    className="inline-block bg-[#e0e0e0] rounded px-1.5 py-0.5 text-xs mr-1 mb-1"
                                                                >
                                                                    {
                                                                        skill.skill_name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        skill.metric_value
                                                                    }{" "}
                                                                    {
                                                                        skill.skill_metric
                                                                    }
                                                                    )
                                                                    {skillIndex !==
                                                                        item
                                                                            .primary_skills
                                                                            .length -
                                                                            1 &&
                                                                        ", "}
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        "-"
                                                    )
                                                ) : field.key ===
                                                  "secondary_skills" ? (
                                                    item.secondary_skills
                                                        .length > 0 ? (
                                                        item.secondary_skills.map(
                                                            (
                                                                skill,
                                                                skillIndex,
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        skillIndex
                                                                    }
                                                                    className="inline-block bg-[#e0e0e0] rounded px-1.5 py-0.5 text-xs mr-1 mb-1"
                                                                >
                                                                    {
                                                                        skill.skill_name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        skill.metric_value
                                                                    }{" "}
                                                                    {
                                                                        skill.skill_metric
                                                                    }
                                                                    )
                                                                    {skillIndex !==
                                                                        item
                                                                            .secondary_skills
                                                                            .length -
                                                                            1 &&
                                                                        ", "}
                                                                </span>
                                                            ),
                                                        )
                                                    ) : (
                                                        "-"
                                                    )
                                                ) : item[field.key] !== null &&
                                                  item[field.key] !==
                                                      undefined ? (
                                                    item[field.key]
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <th className="bg-[#f4f4f4] w-[200px] text-left font-bold border border-[#ccc] p-3">
                                        {" "}
                                    </th>
                                    {data.map((item, index) => (
                                        <td
                                            key={index}
                                            style={{ textAlign: "center" }}
                                            className="border border-[#ccc] p-3 align-middle"
                                        >
                                            <button
                                                className="mt-[5px] bg-[#ff4d4f] text-white border-none py-1 px-2 cursor-pointer rounded text-xs hover:bg-[#d9363e] flex gap-[10px] justify-center items-center h-[25px]"
                                                onClick={() =>
                                                    handleRemoveFromCompare(
                                                        item.id,
                                                        item.resume_id,
                                                    )
                                                }
                                            >
                                                <CloseOutlined></CloseOutlined>{" "}
                                                Remove From Compare list
                                            </button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && data.length === 0 && (
                    <p>No data available for comparison.</p>
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
            {showResumeModal && (
                <ResumeModal
                    showModal={showResumeModal}
                    setShowModal={setShowResumeModal}
                    resume={resumeToShow}
                />
            )}
        </Main>
    );
};

export default Compare;
