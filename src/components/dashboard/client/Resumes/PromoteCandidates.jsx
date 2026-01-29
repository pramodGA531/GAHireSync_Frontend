import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
import { Link, useNavigate, useParams } from "react-router-dom";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const PromoteCandidates = () => {
    const [data, setData] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const authToken = sessionStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken) {
            fetch(`${apiurl}/api/client/promote_candidates/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setData(data.data);
                })
                .catch((error) => {
                    message.error(
                        "Failed to fetch candidates. Please try again.",
                    );
                });
        }
    }, [authToken]);

    const handlePromote = (candidate) => {
        setSelectedCandidate(candidate);
    };

    const handleSubmitFeedback = async () => {
        setLoading(true);
        if (!feedback) {
            message.warning("Please provide feedback before submitting.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${apiurl}/api/client/promote_candidates/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...selectedCandidate, feedback }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }

            const data = await response.json();
            message.success(data.message);
            setSelectedCandidate(null);
            setFeedback("");
            window.location.reload();
        } catch (error) {
            message.error("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getButtonName = (job) => {
        const { status, rounds_of_interview } = job;
        if (status === "shortlisted") {
            return `Promote to Round 1`;
        } else if (status === "pending") {
            return `Shortlist`;
        } else if (status.startsWith("round")) {
            const currentRound = parseInt(status.replace("round", ""));
            if (currentRound < rounds_of_interview) {
                return `Promote to Round ${currentRound + 1}`;
            } else {
                return "Hire the Candidate";
            }
        }
        return "Promote";
    };

    const viewApplication = (id) => {
        navigate(`/application/${id}`);
    };
    const columns = [
        {
            title: "Candidate ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <div className="flex gap-2">
                    <Button onClick={() => viewApplication(record.id)}>
                        View Complete Application
                    </Button>{" "}
                </div>
            ),
        },
        {
            title: "Promote",
            key: "action",
            render: (text, record) =>
                record.status !== "rejected" &&
                record.status !== "accepted" &&
                record.status !== "pending" && (
                    <Button onClick={() => handlePromote(record)}>
                        {getButtonName(record)}
                    </Button>
                ),
        },
    ];

    return (
        <Main>
            <div className="p-5">
                <div className="mt-4 -ml-2 -mb-4">
                    <GoBack />
                </div>
                {data && data.length > 0 ? (
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        className="bg-white shadow-md rounded-lg"
                    />
                ) : (
                    <div className="text-center mt-5 text-[#666]">
                        There are no postings
                    </div>
                )}

                {selectedCandidate && (
                    <div className="mx-auto w-[90%] bg-white p-5 shadow-md mt-5 rounded-lg">
                        <h2 className="mb-2 text-xl font-semibold">
                            Provide Feedback for{" "}
                            {selectedCandidate.candidate_name}
                        </h2>
                        <Input.TextArea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter feedback"
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            className="w-full p-2.5 border border-[#ddd] rounded mb-2.5"
                        />
                        <Button
                            onClick={handleSubmitFeedback}
                            loading={loading}
                            type="primary"
                            className="bg-[#1677ff]"
                        >
                            Submit Feedback and Promote
                        </Button>
                    </div>
                )}
            </div>
        </Main>
    );
};

export default PromoteCandidates;
