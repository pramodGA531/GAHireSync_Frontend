import React, { useEffect, useState } from "react";
import ViewJobPost from "../../../common/ViewJobPost";
import Main from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import { Modal, Select ,message} from "antd";
import GoBack from "../../../common/Goback";

const CompleteJobPost = () => {
    const { id } = useParams();
    const { token, apiurl } = useAuth();

    const [job, setJob] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [changeInterviewerModal, setChangeInterviewerModal] = useState(false);
    const Navigate =useNavigate();
    // fallback for empty / null / undefined

    /* =========================
        FETCH JOB DETAILS
    ========================= */
    const fetchJobDetails = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/job-details?job_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setJob(data.job);
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };
    console.log(job);
    useEffect(() => {
        fetchJobDetails();
    }, [token]);

    const handleEditJob = async () => {
        const Response = await fetch(`${apiurl}/job/posting/is_editted_by_client/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data =await Response.json();
        console.log(data.is_editted)
        if(!data.is_editted){
          Navigate(`/client/edit_job/${id}`) ; 
        }
        else {
    message.info(
        "This job posting has already been edited. Additional changes are not permitted."
    );
}

    };
    /* =========================
        FETCH INTERVIEWERS
    ========================= */
    useEffect(() => {
        const fetchInterviewers = async () => {
            if (!token) return;

            try {
                const response = await fetch(`${apiurl}/interviewers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setInterviewers(data);
            } catch (error) {
                console.error("Error fetching interviewers:", error);
            }
        };

        fetchInterviewers();
    }, [token]);

    /* =========================
        MAP INTERVIEW ROUNDS
    ========================= */
    useEffect(() => {
        if (job?.interview_details) {
            const rounds = job.interview_details
                .map((round) => ({
                    round_num: round.round_num,
                    interviewer_id: round.name.id,
                    interviewer_name: round.name.username,
                }))
                .sort((a, b) => a.round_num - b.round_num);

            setSelectedInterviewers(rounds);
        }
    }, [job]);

    /* =========================
        HANDLERS
    ========================= */
    const handleChangeInterviewer = () => {
        setChangeInterviewerModal(true);
    };

    const handleRoundChange = (roundNum, newInterviewerId) => {
        setSelectedInterviewers((prev) =>
            prev.map((r) =>
                r.round_num === roundNum
                    ? { ...r, interviewer_id: newInterviewerId }
                    : r,
            ),
        );
    };

    const handleModifyInterviewer = async () => {
        try {
            await fetch(`${apiurl}/modify-interviewers/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    interviewers: selectedInterviewers,
                }),
            });

            fetchJobDetails();
            setChangeInterviewerModal(false);
        } catch (error) {
            console.error("Error modifying interviewer:", error);
        }
    };

    /* =========================
        RENDER
    ========================= */
    return (
        <Main defaultSelectedKey="2">
            {loading ? (
                <Pageloading />
            ) : job ? (
                <>
                    <div className="mt-4 -ml-2 -mb-4 pl-4">
                        <GoBack />
                    </div>

                    <div className="text-[#171A1F] m-4 flex items-center justify-between">
                        <p className="text-3xl">Job Post Details</p>
                        <div className="flex items-center justify-end">
                            <button
                                onClick={handleChangeInterviewer}
                                className="text-md border-2 p-2 m-2 mt-0 border-gray-400 hover:border-blue-400 hover:text-blue-500 rounded-md"
                            >
                                Change Interviewer
                            </button>
                            <button
                                onClick={handleEditJob}
                                className="text-md border-2 p-2 m-2 mt-0 border-gray-400 hover:border-blue-400 hover:text-blue-500 rounded-md"
                            >
                               Edit Job
                            </button>
                        </div>
                    </div>

                    <ViewJobPost
                        id={id}
                        job={job}
                        interviewers={interviewers}
                    />
                </>
            ) : null}

            {/* =========================
                CHANGE INTERVIEWER MODAL
            ========================= */}
            {changeInterviewerModal && (
                <Modal
                    open={changeInterviewerModal}
                    title="Change Interviewer"
                    onCancel={() => setChangeInterviewerModal(false)}
                    onOk={handleModifyInterviewer}
                >
                    <div style={{ maxHeight: 400, overflowY: "auto" }}>
                        {selectedInterviewers.map((round) => (
                            <div key={round.round_num} className="mb-4">
                                <p className="mb-2 font-semibold">
                                    Round {round.round_num}
                                </p>
                                <Select
                                    className="w-full"
                                    value={round.interviewer_id}
                                    onChange={(val) =>
                                        handleRoundChange(round.round_num, val)
                                    }
                                    options={interviewers.map((i) => ({
                                        value: i.id,
                                        label: i.username,
                                    }))}
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </Main>
    );
};

export default CompleteJobPost;
