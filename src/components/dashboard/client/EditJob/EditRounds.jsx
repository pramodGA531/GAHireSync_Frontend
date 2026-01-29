import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth"; // Adjusted import
import { Form, Input, Select, Button, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

const apiurl = import.meta.env.VITE_BACKEND_URL;

const EditRounds = () => {
    const { id } = useParams();
    const { token } = useAuth(); // Using useAuth hook
    const [interviewers, setInterviewers] = useState([]);
    const navigate = useNavigate();
    const [job, setJob] = useState({
        id: id,
        rounds_of_interview: 0,
    });

    useEffect(() => {
        if (token) {
            // Using logic similar to CompleteJobPost for fetching interviewers
            fetch(`${apiurl}/interviewers/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // Adapt data if structure differs
                    // Assuming data is array of interviewers
                    const roundsData = data.map((item) => ({
                        name: item.username,
                        email: item.email,
                        round_num: item.round_num || 1,
                        type_of_interview: "online", // Default or fetch if available
                    }));
                    setInterviewers(roundsData);
                    setJob((prev) => ({
                        ...prev,
                        rounds_of_interview: roundsData.length,
                    }));
                    console.log("Fetched Interviewers (Log Only)", data);
                })
                .catch((error) =>
                    console.error("Error fetching job details:", error),
                );
        }
    }, [token, id]);

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
        console.log("Updated Job Rounds (Log Only):", updatedJob);
        alert("Successfully logged request (No API call)");
        navigate(-1);
    };

    return (
        <div className="p-5 w-[80%] mx-auto bg-white shadow-md rounded-lg mt-10">
            <Title level={2} className="mb-5 text-[#1681FF]!">
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
                                        e.target.value,
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
                                        e.target.value,
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
                                        value,
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
                        Submit (Log Only)
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRounds;
