import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import { Form, Input, Select, Button, Typography, Alert } from "antd";

import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const apiurl = import.meta.env.VITE_BACKEND_URL;

const EditRounds_Manager = () => {
    const { id } = useParams();
    const { authToken, login } = useContext(AuthContext);
    const [interviewers, setInterviewers] = useState([]);
    const navigate = useNavigate();
    const [job, setJob] = useState({
        id: id,
        username: "",
        job_title: "",
        job_description: "",
        primary_skills: "",
        secondary_skills: "",
        years_of_experience: 0,
        ctc: "",
        rounds_of_interview: 0,
        job_location: "",
        job_type: "",
        job_level: "",
        qualifications: "",
        timings: "",
        other_benefits: "",
        working_days_per_week: 5,
        decision_maker: "",
        bond: "",
        rotational_shift: false,
        is_approved: true,
        is_assigned: null,
    });

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, [login]);

    useEffect(() => {
        if (authToken) {
            fetch(`${apiurl}/api/particular_job/${id}/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setJob(data.data);
                    setInterviewers(
                        data.interviewers_data.map((interviewer) => ({
                            name: interviewer.name,
                            email: interviewer.email,
                            round_num: interviewer.round_num,
                            type_of_interview: interviewer.type_of_interview,
                        }))
                    );
                    console.log(data);
                })
                .catch((error) =>
                    console.error("Error fetching job details:", error)
                );
        }
    }, [authToken, id]);

    const handleRoundsChange = (value) => {
        const rounds = parseInt(value, 10);
        const newInterviewers = [...interviewers];

        if (rounds > newInterviewers.length) {
            for (let i = newInterviewers.length; i < rounds; i++) {
                newInterviewers.push({
                    name: "",
                    email: "",
                    round_num: i + 1,
                    type_of_interview: "",
                });
            }
        } else if (rounds < newInterviewers.length) {
            newInterviewers.length = rounds;
        }

        setJob((prevJob) => ({
            ...prevJob,
            rounds_of_interview: rounds,
        }));
        setInterviewers(newInterviewers);
    };

    const handleInterviewerChange = (index, field, value) => {
        const newInterviewers = [...interviewers];
        newInterviewers[index][field] = value;
        setInterviewers(newInterviewers);
    };

    const handleSubmit = (values) => {
        const updatedJob = {
            ...job,
            interviewers_data: interviewers,
        };
        console.log(updatedJob);
        fetch(`${apiurl}/api/particular_job/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(updatedJob),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                alert("Successfully made a request");
                setInterviewers([]);
                navigate(-1);
                // Handle success, e.g., show a success message or redirect
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle error, e.g., show an error message to the user
            });
    };

    return (
        <div className="p-5 w-[80%] mx-auto bg-white shadow-md rounded-lg mt-10">
            <Title level={2} className="mb-5 !text-[#1681FF]">
                Edit Interview Rounds
            </Title>
            <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item label="Rounds of Interview">
                    <Input
                        type="number"
                        value={job.rounds_of_interview}
                        onChange={(e) => handleRoundsChange(e.target.value)}
                        min="0"
                        className="rounded-md border-gray-300"
                    />
                </Form.Item>

                {interviewers.map((interviewer, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 p-4 rounded-md mb-4 bg-gray-50"
                    >
                        <Form.Item
                            label={`Round ${index + 1}`}
                            className="mb-2"
                        >
                            <Input
                                value={interviewer.name}
                                onChange={(e) =>
                                    handleInterviewerChange(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Interviewer Name"
                                className="rounded-md"
                            />
                        </Form.Item>
                        <Form.Item label="Interviewer Email" className="mb-2">
                            <Input
                                type="email"
                                value={interviewer.email}
                                onChange={(e) =>
                                    handleInterviewerChange(
                                        index,
                                        "email",
                                        e.target.value
                                    )
                                }
                                placeholder="Interviewer Email"
                                className="rounded-md"
                            />
                        </Form.Item>
                        <Form.Item label="Mode of Interview" className="mb-0">
                            <Select
                                value={interviewer.type_of_interview}
                                onChange={(value) =>
                                    handleInterviewerChange(
                                        index,
                                        "type_of_interview",
                                        value
                                    )
                                }
                                placeholder="Select Mode"
                                allowClear
                                required
                                className="rounded-md"
                            >
                                <Option value="face_to_face">
                                    Face To Face Interview
                                </Option>
                                <Option value="online">Online Interview</Option>
                                <Option value="telephone">
                                    Telephone Interview
                                </Option>
                            </Select>
                        </Form.Item>
                    </div>
                ))}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRounds_Manager;
