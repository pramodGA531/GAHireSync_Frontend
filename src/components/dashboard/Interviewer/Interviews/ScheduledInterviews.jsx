import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import { Button, message, Modal, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../../common/Table";
import Main from "../Layout";
// import "./ScheduledInterviews.css";
import Pageloading from "../../../common/loading/Pageloading";
import ResumeModal from "../../../common/ResumeModal";
import GoBack from "../../../common/Goback";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const ScheduledInterviews = () => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedResume, setSelectedResume] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [viewResume, setViewResume] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const rowStyle = {
        display: "flex",
        padding: "10px",
        borderBottom: "1px solid #e8e8e8",
        alignItems: "center",
    };

    const labelStyle = {
        width: "160px", // Fixed width for all labels for alignment
        fontWeight: "bold",
    };

    const valueStyle = {
        flex: 1, // Take remaining space
        wordBreak: "break-word",
    };

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/interviewer/scheduled-interviews/?page=${page}`,
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
                return;
            }
            setData(data.results);
            setTotal(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData(currentPage);
        }
    }, [token, currentPage]);

    const columns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
            render: (title, record) => (
                <div
                    onClick={() => {
                        navigate(`/interviewer/jobpost/${record.job_id}`, {
                            state: { from: location.pathname },
                        });
                    }}
                    style={{
                        color: "#2C5F99",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    {title}
                </div>
            ),
        },
        {
            title: "Job Location",
            dataIndex: "location",
            key: "location",
            render: (location) => (
                <div style={{ color: "#2C5F99", fontWeight: "500" }}>
                    {location}
                </div>
            ),
        },
        {
            title: "Rounds of Interview",
            dataIndex: "round_of_interview",
            key: "round_of_interview",
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
            render: (candidate_name, record) => (
                <div
                    className="candidate-name"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewProfile(record.application_id)}
                >
                    {candidate_name}
                </div>
            ),
        },
        {
            title: "Scheduled Time",
            dataIndex: "scheduled_date",
            key: "scheduled_date",
            render: (text) => new Date(text).toLocaleDateString(),
            sorter: (a, b) =>
                new Date(a.schedule_date) - new Date(b.schedule_date),
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Timings",
            dataIndex: "timings",
            key: "timings",
            render: (text) => {
                if (!text) return "-";
                return text
                    .split(" - ") // split start and end time
                    .map((time) => time.split(":").slice(0, 2).join(":")) // remove seconds
                    .join(" - "); // join back as range
            },
        },
        {
            title: "Remarks",
            dataIndex: "interview_id",
            key: "interview_id",
            render: (interview_id, record) => {
                if (record.status === "completed") {
                    return <p>Completed</p>;
                } else if (record.status === "selected") {
                    return <p>Shortlisted</p>;
                } else if (record.status === "rejected") {
                    return <p>Rejected</p>;
                }
                let isPast = false;
                const { status, scheduled_date, timings } = record;
                if (scheduled_date && timings) {
                    try {
                        const endTimeStr = timings.split(" - ")[1]; // e.g. "16:30"
                        const [hours, minutes] = endTimeStr
                            .split(":")
                            .map(Number);

                        const scheduledEnd = new Date(scheduled_date);
                        scheduledEnd.setHours(hours);
                        scheduledEnd.setMinutes(minutes);
                        scheduledEnd.setSeconds(0);

                        const now = new Date();
                        isPast = now >= scheduledEnd; // Only enable if current time is past interview end
                    } catch (err) {
                        console.error("Failed to parse interview time", err);
                    }
                }
                return (
                    <Button
                        // disabled={!isPast}      //Enable in the live versioin
                        onClick={() =>
                            navigate(
                                `/interviewer/conduct-interview/${interview_id}`,
                            )
                        }
                    >
                        Add Remarks
                    </Button>
                );
            },
        },
    ];

    const handleViewProfile = async (id) => {
        setModalVisible(true);
        setLoading(true);

        try {
            const response = await fetch(
                `${apiurl}/basic-application-details/${id}`,
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
                return;
            } else if (data.message) {
                message.success(data.message);
                return;
            }

            setResumeData(data);
            console.log(data, "is the resume data");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {loading ? (
                <Pageloading></Pageloading>
            ) : (
                <>
                    {/* <div className="-ml-4 mt-4">
                    <GoBack />
                </div> */}
                    <h1 className="m-2 text-xl mx-4 font-bold">
                        {" "}
                        Scheduled Interviews{" "}
                    </h1>
                    {data && (
                        <div className="p-5">
                            <Table
                                columns={columns.map((col) => ({
                                    ...col,
                                    onHeaderCell: () => ({
                                        className:
                                            "bg-[#1681FF] text-white text-sm font-normal",
                                    }),
                                    onCell: () => ({
                                        className:
                                            "text-sm font-normal text-center p-0",
                                    }),
                                }))}
                                data={data}
                                className="[&_.ant-table-tbody>tr:nth-child(odd)]:bg-[#F6FAFF] [&_.ant-table-tbody>tr:nth-child(even)]:bg-white text-center"
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: total, // Total interviews count for pagination
                                    onChange: (page, pageSize) => {
                                        setCurrentPage(page);
                                        setPageSize(pageSize);
                                    },
                                    showSizeChanger: true,
                                    pageSizeOptions: ["5", "10", "20", "50"],
                                }}
                            />
                        </div>
                    )}

                    {/* Modal for showing resume data */}
                    <Modal
                        title="Candidate Profile"
                        visible={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        width={600}
                    >
                        {loading ? (
                            <div style={{ textAlign: "center" }}>
                                <Spin size="large" />
                                <p>Loading...</p>
                            </div>
                        ) : (
                            resumeData && (
                                <div className="border border-[#f0f0f0] rounded-lg overflow-hidden mt-2.5">
                                    {/* Row Wrapper */}
                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Name:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.candidate_name}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Experience:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.experience}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Current CTC:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.current_ctc}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Current Job Type:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.current_job_type}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Expected CTC:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.expected_ctc}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Notice Period:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            {resumeData.notice_period}
                                        </div>
                                    </div>

                                    <div className="flex p-2.5 border-b border-[#e8e8e8] items-center">
                                        <div className="w-[160px] font-bold">
                                            <strong>Resume:</strong>
                                        </div>
                                        <div className="flex-1 break-words">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => {
                                                    setViewResume(true);
                                                    setSelectedResume(
                                                        resumeData.resume,
                                                    );
                                                }}
                                            >
                                                View Resume
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </Modal>

                    {viewResume && (
                        <ResumeModal
                            resume={selectedResume}
                            showModal={viewResume}
                            setShowModal={setViewResume}
                        />
                    )}
                </>
            )}
        </Main>
    );
};

export default ScheduledInterviews;
