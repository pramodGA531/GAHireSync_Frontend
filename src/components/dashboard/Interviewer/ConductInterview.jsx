import React, { useState, useEffect } from "react";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import { useParams } from "react-router-dom";
import { message, Button, Form, Input, Spin, Table, InputNumber } from "antd";

import CustomDatePicker from "../../common/CustomDatePicker";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PrevInterviewRes from "./PrevInterviewRes";
import { CloudDownloadOutlined, DiffFilled } from "@ant-design/icons";
import Goback from "../../common/Goback";
import dayjs from "dayjs";
import { div } from "framer-motion/client";
import Pageloading from "../../common/loading/Pageloading";
import Btnloading from "../../common/loading/Btnloading";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const ConductInterview = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [rejectAction, setRejectAction] = useState(false);
    const [acceptAction, setAcceptAction] = useState(false);
    const [primarySkills, setPrimarySkills] = useState([]);
    const [secondarySkills, setSecondarySkills] = useState([]);
    const [primarySkillRatings, setPrimarySkillRatings] = useState({});
    const [secondarySkillRatings, setSecondarySkillRatings] = useState({});
    const [remarks, setRemarks] = useState();
    const [hasNextRound, setHasNextRound] = useState(false);
    const navigate = useNavigate();
    const [notJoinedLoading, setNotJoinedLoading] = useState(false);

    const fetchInterviewDetails = async () => {
        setLoading(true);
        console.log("interview id is ", id);
        try {
            const response = await fetch(
                `${apiurl}/interviewer/scheduled-interviews/?id=${id}`,
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
            } else {
                const dateString = new Date(data.scheduled_date);
                data.scheduled_date = dateString.toLocaleString();
                setData(data);
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to fetch interview details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchInterviewDetails();
        }
    }, [token]);

    const fetchSkills = async (job_id, resume_id) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/fetch-skills/?id=${job_id}&resume_id=${resume_id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setHasNextRound(data.has_next_round);

            const primarySkillNames = Array.isArray(data.data.primary_skills)
                ? data.data.primary_skills.map((skill) => skill.skill_name)
                : [];

            const secondarySkillNames = Array.isArray(
                data.data.secondary_skills,
            )
                ? data.data.secondary_skills.map((skill) => skill.skill_name)
                : [];

            setPrimarySkills(primarySkillNames);
            setSecondarySkills(secondarySkillNames);

            const primaryRatings = {};
            primarySkillNames.forEach((skill) => {
                primaryRatings[skill] = null; // or 0 if you prefer
            });
            setPrimarySkillRatings(primaryRatings);

            const secondaryRatings = {};
            secondarySkillNames.forEach((skill) => {
                secondaryRatings[skill] = null;
            });
            setSecondarySkillRatings(secondaryRatings);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Failed to fetch skills.");
        } finally {
            setLoading(false);
        }
    };

    const [btnLoading, setBtnLoading] = useState(false);
    const handleRejection = async (values, candidate_resume_id, round_num) => {
        setBtnLoading(true);
        try {
            const requestedData = JSON.stringify({
                round_num: round_num,
                primary_skills: primarySkillRatings,
                secondary_skills: secondarySkillRatings,
                remarks: values.remarks,
            });
            const response = await fetch(
                `${apiurl}/interviewer/reject-candidate/?id=${candidate_resume_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: ` Bearer ${token}`,
                    },
                    body: requestedData,
                },
            );
            const data = await response.json();
            if (data.message) {
                message.success(data.message);
                navigate(-1);
            } else {
                message.error(data.error);
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to reject the candidate.");
        } finally {
            setBtnLoading(false);
        }
    };

    const promoteCandidate = async (
        round_num,
        candidate_resume_id,
        remarks,
    ) => {
        setBtnLoading(true);

        if (remarks === "") {
            message.error("Please enter remarks");
            setLoading(false);
            return;
        }

        const isPrimaryValid = Object.values(primarySkillRatings).every(
            (value) => value !== null && value !== "",
        );
        const isSecondaryValid = Object.values(secondarySkillRatings).every(
            (value) => value !== null && value !== "",
        );

        if (!isPrimaryValid || !isSecondaryValid) {
            message.error("Please fill all skill ratings before submitting.");
            setLoading(false);
            return;
        }

        const requestData = JSON.stringify({
            remarks: remarks,
            primary_skills: primarySkillRatings,
            secondary_skills: secondarySkillRatings,
        });

        try {
            const response = await fetch(
                `${apiurl}/interviewer/promote-candidate/?id=${candidate_resume_id}&round_num=${round_num}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: requestData,
                },
            );
            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            }

            if (data.message) {
                message.success(data.message);
                navigate(-1);
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to accept the candidate.");
        } finally {
            setBtnLoading(false);
        }
    };

    const handleNotJoined = async (candidate_resume_id) => {
        setNotJoinedLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/interviewer/candidate-not-joined/?id=${candidate_resume_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.message) {
                message.success(data.message);
                navigate(-1);
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to accept the candidate.");
        } finally {
            setNotJoinedLoading(false);
        }
    };

    const handleSelect = async (round_num, candidate_resume_id, remarks) => {
        setBtnLoading(true);

        if (remarks === "") {
            message.error("Please enter remarks");
            setBtnLoading(false);
            return;
        }

        const isPrimaryValid = Object.values(primarySkillRatings).every(
            (value) => value !== null && value !== "",
        );
        const isSecondaryValid = Object.values(secondarySkillRatings).every(
            (value) => value !== null && value !== "",
        );

        if (!isPrimaryValid || !isSecondaryValid) {
            message.error("Please fill all skill ratings before submitting.");
            setBtnLoading(false);
            return;
        }

        const requestData = JSON.stringify({
            remarks: remarks,
            primary_skills: primarySkillRatings,
            secondary_skills: secondarySkillRatings,
        });

        try {
            const response = await fetch(
                `${apiurl}/interviewer/select-candidate/?id=${candidate_resume_id}&round_num=${round_num}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: requestData,
                },
            );

            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            }

            if (data.message) {
                message.success(data.message);
                navigate(-1);
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to select the candidate.");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            <div className="mt-4 -ml-2 mb-4">
                <Goback />
            </div>
            {loading ? (
                <Pageloading></Pageloading>
            ) : (
                data && (
                    <div className="mt-[15px] p-5">
                        <div className="p-[25px_15px] rounded-2xl border border-[#dee1e6] bg-white shadow-[0_0_11px_rgba(0,0,0,0.1)]">
                            <div className="text-[#1681ff] text-2xl font-semibold leading-[22px]">
                                {data.job_title}
                            </div>
                            <div className="mt-[5px] text-black text-sm font-normal leading-[22px] border-b border-[#9f9f9f]">
                                with{" "}
                                <span className="text-[#1681ff] text-sm font-medium">
                                    {data.candidate_name}
                                </span>
                            </div>
                            <div className="mt-[15px] flex gap-5">
                                <div className="flex flex-col items-start gap-2.5">
                                    <span className="text-black text-base font-normal leading-[22px]">
                                        Job Department
                                    </span>
                                    <span className="text-[#615f5f] text-sm font-normal leading-[22px]">
                                        {data?.job_department}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start gap-2.5">
                                    <span className="text-black text-base font-normal leading-[22px]">
                                        Round Number
                                    </span>
                                    <span className="text-[#615f5f] text-sm font-normal leading-[22px]">
                                        {data.round_num}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start gap-2.5">
                                    <span className="text-black text-base font-normal leading-[22px]">
                                        Scheduled Date
                                    </span>
                                    <span className="text-[#615f5f] text-sm font-normal leading-[22px]">
                                        {dayjs(data.scheduled_date).format(
                                            "YYYY-MM-DD",
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start gap-2.5">
                                    <span className="text-black text-base font-normal leading-[22px]">
                                        Scheduled Time
                                    </span>
                                    <span className="text-[#615f5f] text-sm font-normal leading-[22px]">
                                        {data.from_time} - {data.to_time}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-[15px] flex gap-[15px]">
                                <button
                                    className="px-5 py-2.5"
                                    onClick={() => {
                                        setAcceptAction(true);
                                        setRejectAction(false);
                                        fetchSkills(
                                            data.job_id,
                                            data.candidate_resume_id,
                                        );
                                    }}
                                >
                                    Promote Candidate
                                </button>
                                <button
                                    className="px-5 py-2.5 rounded-[11px] border border-[#ff0307] bg-[#ffefef] text-[#f00]"
                                    type="primary"
                                    onClick={() => {
                                        setAcceptAction(false);
                                        setRejectAction(true);
                                    }}
                                >
                                    Reject Candidate
                                </button>
                                <button
                                    className="px-5 py-2.5 rounded-[11px] border border-[#ff0307] bg-[#ffefef] text-[#f00]"
                                    type="primary"
                                    onClick={() => {
                                        setAcceptAction(false);
                                        setRejectAction(false);
                                        handleNotJoined(
                                            data.candidate_resume_id,
                                        );
                                    }}
                                >
                                    Not Joined
                                </button>
                            </div>
                        </div>
                    </div>
                )
            )}

            {rejectAction && (
                <div className="action-form">
                    <Form
                        onFinish={(values) =>
                            handleRejection(
                                values,
                                data.candidate_resume_id,
                                data.round_num,
                            )
                        }
                        layout="vertical"
                        className="reject-form"
                        style={{ marginTop: "30px" }}
                    >
                        <Form.Item
                            label="Reason for Rejection"
                            name="remarks"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please provide a reason for rejection",
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit Rejection
                                {btnLoading && (
                                    <Btnloading
                                        spincolor={"white-spinner"}
                                    ></Btnloading>
                                )}
                            </Button>
                            <Button
                                style={{ marginLeft: "10px" }}
                                onClick={() => setRejectAction(false)}
                            >
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}

            {acceptAction && (
                <div className="mt-[15px] p-5">
                    <div className="flex gap-5">
                        <div className="p-[25px] rounded-2xl border border-[#dee1e6] bg-white shadow-md w-[35%]">
                            <div className="flex justify-between pb-2.5 border-b border-[#9f9f9f]">
                                <span className="text-[#1681ff] text-base font-semibold">
                                    Primary Skills
                                </span>
                                <span className="text-black text-base font-normal">
                                    Rate 1-10
                                </span>
                            </div>
                            {primarySkills &&
                                primarySkills.length > 0 &&
                                primarySkills.map((skill) => (
                                    <div
                                        key={skill}
                                        className="flex justify-between text-black mt-2.5"
                                    >
                                        <span className="skill-name">
                                            {skill}
                                        </span>
                                        <span className="skill-val">
                                            <InputNumber
                                                min={1}
                                                max={10}
                                                placeholder="Rate skill"
                                                onChange={(value) => {
                                                    setPrimarySkillRatings(
                                                        (prev) => ({
                                                            ...prev,
                                                            [skill]: value,
                                                        }),
                                                    );
                                                }}
                                            />
                                        </span>
                                    </div>
                                ))}
                        </div>

                        <div className="p-[25px] rounded-2xl border border-[#dee1e6] bg-white shadow-md w-[35%]">
                            <div className="flex justify-between pb-2.5 border-b border-[#9f9f9f]">
                                <span className="text-[#1681ff] text-base font-semibold">
                                    Secondary Skills
                                </span>
                                <span className="text-black text-base font-normal">
                                    Rate 1-10
                                </span>
                            </div>
                            {secondarySkills && secondarySkills.length > 0 ? (
                                secondarySkills.map((skill) => (
                                    <div
                                        key={skill}
                                        className="flex justify-between text-black mt-2.5"
                                    >
                                        <span className="skill-name">
                                            {skill}
                                        </span>
                                        <span className="skill-val">
                                            <InputNumber
                                                min={1}
                                                max={10}
                                                placeholder="Rate skill"
                                                onChange={(value) => {
                                                    setSecondarySkillRatings(
                                                        (prev) => ({
                                                            ...prev,
                                                            [skill]: value,
                                                        }),
                                                    );
                                                }}
                                            />
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div>There are no secondary skills</div>
                            )}
                        </div>
                    </div>

                    {hasNextRound ? (
                        <div className="action-form">
                            <Form
                                layout="vertical"
                                onFinish={(values) => {
                                    promoteCandidate(
                                        data.round_num,
                                        data.candidate_resume_id,
                                        values.remarks,
                                    );
                                }}
                                style={{ marginTop: "30px" }}
                            >
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please provide remarks before proceeding.",
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Promote Candidate
                                    </Button>
                                    <Button
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => setAcceptAction(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    ) : (
                        <div className="action-form">
                            <Form
                                layout="vertical"
                                onFinish={(values) => {
                                    handleSelect(
                                        data.round_num,
                                        data.candidate_resume_id,
                                        values.remarks,
                                    );
                                }}
                                style={{ marginTop: "30px" }}
                            >
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please provide remarks before proceeding.",
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Select Candidate
                                        {btnLoading && (
                                            <Btnloading
                                                spincolor={"white-spinner"}
                                            ></Btnloading>
                                        )}
                                    </Button>
                                    <Button
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => setAcceptAction(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </div>
            )}

            {data && data.round_num > 1 && (
                <PrevInterviewRes ApplicationId={data.candidate_resume_id} />
            )}
        </Main>
    );
};

export default ConductInterview;
