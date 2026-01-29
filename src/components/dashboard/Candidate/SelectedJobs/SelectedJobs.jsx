import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Button, Modal, Input, Table, Tag, DatePicker } from "antd";
import Main from "../Layout";
import CandAcceptJob from "./CandAcceptJob";
import { title } from "framer-motion/client";
import CustomDatePicker from "../../../common/CustomDatePicker";
import GoBack from "../../../common/Goback"
const SelectedJobs = () => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectFeedback, setRejectFeedback] = useState("");
    const [editRequest, setEditRequest] = useState("");
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

    const updateState = async () => {
        try {
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: ["select_candidate", "accepted_ctc"],
                    }),
                }
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/selected-jobs/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
                return;
            }
            setData(result);
        } catch (e) {
            console.log(e);
            message.error("Failed to fetch selected jobs");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            updateState();
        }
    }, [token]);

    const handleAccept = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/candidate/handle-accepted/?selected_candidate_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
                return;
            }
            message.success(result.message);
            fetchData();
        } catch (e) {
            console.log(e);
            message.error("Failed to accept the job offer");
        }
    };

    const openRejectModal = (id) => {
        setSelectedCandidateId(id);
        setIsRejectModalOpen(true);
    };
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const openEditModal = (id) => {
        setSelectedCandidateId(id);
        setIsEditModalOpen(true);
    };

    const handleEdit = async () => {
        if (!editRequest) {
            message.error("Please provide your edit request note.");
            return;
        }

        const today = new Date().toISOString().split("T")[0];

        try {
            const response = await fetch(
                `${apiurl}/candidate/handle-edit/?selected_candidate_id=${selectedCandidateId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ edit_request: editRequest }),
                }
            );
            const result = await response.json();

            if (result.error) {
                message.error(result.error);
                return;
            }

            message.success(result.message);
            setIsRejectModalOpen(false);
            setEditRequest(""); // assuming you have this state
            fetchData(); // to refresh the data
        } catch (e) {
            console.error("Request failed:", e);
            message.error("Failed to submit the edit request.");
        }
    };

    const handleReject = async () => {
        if (!rejectFeedback.trim()) {
            message.error("Please provide feedback for rejection.");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/candidate/handle-rejected/?selected_candidate_id=${selectedCandidateId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ feedback: rejectFeedback }),
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
                return;
            }
            message.success(result.message);
            setIsRejectModalOpen(false);
            setRejectFeedback("");
            fetchData();
        } catch (e) {
            console.log(e);
            message.error("Failed to reject the job offer");
        }
    };

    return (
        <Main defaultSelectedKey={4}>
            {/* <h1>List of Accepted Jobs</h1> */} <div className="mt-4 -mb-2 -ml-2">
                    <GoBack />
                </div>
            <div className="flex flex-wrap gap-5 m-4 mb-5">
               
                {data.length > 0 ? (
                    data.map((item) => (
                        <CandAcceptJob
                            key={item.selected_candidate_id}
                            job_title={item.job_title}
                            offered_ctc={item.job_ctc}
                            agreed_ctc={item.agreed_ctc}
                            joining={item.joining_date}
                            company={item.company}
                            org_code={item.org_code}
                            benfits={item.other_benfits}
                            acceptance={item.candidate_acceptance}
                            job_id={item.job_id}
                            onAccept={() =>
                                handleAccept(item.selected_candidate_id)
                            }
                            onReject={() =>
                                openRejectModal(item.selected_candidate_id)
                            }
                            onEdit={() =>
                                openEditModal(item.selected_candidate_id)
                            }
                        />
                    ))
                ) : (
                    <p>No selected jobs available.</p>
                )}
            </div>
            {/* Reject Modal */}
            <Modal
                title="Reason for Rejection"
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onOk={handleReject}
            >
                <Input.TextArea
                    value={rejectFeedback}
                    onChange={(e) => setRejectFeedback(e.target.value)}
                    placeholder="Enter reason for rejection"
                />
            </Modal>

            <Modal
                title="Edit request"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleEdit}
            >
                <Input.TextArea
                    value={editRequest}
                    onChange={(e) => setEditRequest(e.target.value)}
                    placeholder="Enter reason for rejection"
                />
            </Modal>
        </Main>
    );
};

export default SelectedJobs;
