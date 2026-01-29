import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"; // Icons for buttons
import { useAuth } from "../../../common/useAuth";
// import "./ReopenJob.css";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
import CustomDatePicker from "../../../common/CustomDatePicker";
import dayjs from "dayjs";

const { Option } = Select;

const ReopenJob = () => {
    const { id } = useParams();
    const { token, apiurl } = useAuth();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    const [companyInterviewers, setCompanyInterviewers] = useState([]);
    const interviewModes = [
        { value: "face_to_face", label: "Face-to-Face" },
        { value: "online", label: "Online" },
        { value: "telephone", label: "Telephone" },
    ];

    const interviewTypes = [
        { value: "non-technical", label: "Non Tech" },
        { value: "technical", label: "Tech" },
        { value: "assignment", label: "Assignment" },
    ];

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(
                    `${apiurl}/client/reopen-job/?id=${id}`,
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
                    form.setFieldsValue(data);
                    setInterviewers(data.interviewer_details || []);
                    setCompanyInterviewers(data.company_interviewers || []);
                }
            } catch (e) {
                message.error("Failed to fetch job details.");
            }
        };

        if (id && token) {
            fetchJobDetails();
        }
    }, [id, token, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formattedDate = dayjs(values.job_closing_duration).format(
                "YYYY-MM-DD",
            );
            const updatedData = {
                ...values,
                interviewer_details: interviewers,
                job_close_duration: formattedDate,
            };
            console.log(updatedData);

            const response = await fetch(
                `${apiurl}/client/reopen-job/?job_id=${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                },
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                message.success(data.message);
                navigate("/client/mypostings");
            }
        } catch (e) {
            message.error("Failed to update job post.");
        } finally {
            setLoading(false);
        }
    };

    const handleInterviewerChange = (index, field, value) => {
        const updatedInterviewers = [...interviewers];

        if (field === "id") {
            console.log("entered here");
            const selectedInterviewer = companyInterviewers.find(
                (item) => item.id === value,
            );
            updatedInterviewers[index].interviewer_name =
                selectedInterviewer.interviewer_name; // Store name for UI display
            updatedInterviewers[index].interviewer_id = selectedInterviewer.id; // Store ID for backend
        } else {
            updatedInterviewers[index][field] = value;
        }

        setInterviewers(updatedInterviewers);
    };

    const addInterviewer = () => {
        setInterviewers([
            ...interviewers,
            {
                round_num: interviewers.length + 1,
                interviewer_id: null,
                mode_of_interview: "",
                type_of_interview: "",
            },
        ]);
        form.setFieldValue(
            "rounds_of_interview",
            form.getFieldValue("rounds_of_interview") + 1,
        );
    };

    const removeInterviewer = (index) => {
        const updatedInterviewers = interviewers.filter((_, i) => i !== index);
        setInterviewers(updatedInterviewers);
        form.setFieldValue(
            "rounds_of_interview",
            form.getFieldValue("rounds_of_interview") - 1,
        );
    };

    return (
        <Main defaultSelectedKey="1" className="w-full">
            <div className="mt-4 -ml-2 -mb-4 pl-4">
                <GoBack />
            </div>
            <div className="max-w-[800px] mx-auto p-5 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-5 mb-5">
                <h2 className="text-center text-2xl text-[#333] mb-5 font-semibold">
                    Reopen Job Post
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <Form.Item
                        label="Job Title"
                        name="job_title"
                        className="mb-4"
                    >
                        <Input disabled className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="job_department"
                        className="mb-4"
                    >
                        <Input disabled className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="job_description"
                        className="mb-4"
                    >
                        <Input.TextArea rows={4} disabled className="w-full" />
                    </Form.Item>

                    {/* 
                <Form.Item label="Primary Skills" name="primary_skills">
                    <Input />
                </Form.Item>

                <Form.Item label="Secondary Skills" name="secondary_skills">
                    <Input />
                </Form.Item> */}

                    <Form.Item label="CTC Range" name="ctc" className="mb-4">
                        <Input className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Number of Positions"
                        name="num_of_positions"
                        className="mb-4"
                    >
                        <Input className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Job Close Duration"
                        name="job_close_duration"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please select the date when the job should close",
                            },
                        ]}
                        className="mb-4"
                    >
                        <CustomDatePicker
                            disabledDate={(current) =>
                                current && current.isBefore(dayjs(), "day")
                            }
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Rounds of Interview"
                        name="rounds_of_interview"
                        className="mb-4"
                    >
                        <Input type="number" disabled className="w-full" />
                    </Form.Item>

                    <h3 className="text-lg font-bold mt-2.5 mb-0 text-[#333]">
                        Interviewer Details
                    </h3>
                    <div className="mt-2.5 p-4 rounded-lg bg-[#f9f9f9] flex flex-col gap-4">
                        {interviewers.map((interviewer, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg border border-[#eee] flex flex-col gap-2.5 shadow-sm"
                            >
                                <h3 className="font-semibold">
                                    Round Num: {interviewer.round_num}
                                </h3>
                                <Form.Item
                                    label="Interviewer Name"
                                    name={["interviewer_details", index, "id"]}
                                    className="mb-0"
                                >
                                    <Select
                                        value={interviewer.id}
                                        onChange={(value) =>
                                            handleInterviewerChange(
                                                index,
                                                "id",
                                                value,
                                            )
                                        }
                                        className="w-full"
                                    >
                                        {companyInterviewers.map((item) => (
                                            <Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.interviewer_name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Mode of Interview"
                                    name={[
                                        "interviewer_details",
                                        index,
                                        "mode_of_interview",
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        value={interviewer.mode_of_interview}
                                        onChange={(value) =>
                                            handleInterviewerChange(
                                                index,
                                                "mode_of_interview",
                                                value,
                                            )
                                        }
                                        className="w-full"
                                    >
                                        {interviewModes.map((mode) => (
                                            <Option
                                                key={mode.value}
                                                value={mode.value}
                                            >
                                                {mode.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Type of Interview"
                                    name={[
                                        "interviewer_details",
                                        index,
                                        "type_of_interview",
                                    ]}
                                    className="mb-0"
                                >
                                    <Select
                                        value={interviewer.type_of_interview}
                                        onChange={(value) =>
                                            handleInterviewerChange(
                                                index,
                                                "type_of_interview",
                                                value,
                                            )
                                        }
                                        className="w-full"
                                    >
                                        {interviewTypes.map((mode) => (
                                            <Option
                                                key={mode.value}
                                                value={mode.value}
                                            >
                                                {mode.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => removeInterviewer(index)}
                                    icon={<DeleteOutlined />}
                                    className="mt-2.5 bg-red-500 hover:bg-red-600 text-white border-none w-fit"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="dashed"
                        onClick={addInterviewer}
                        icon={<PlusOutlined />}
                        className="mt-4 flex items-center gap-2 w-[160px] text-white border-none"
                        style={{ backgroundColor: "green" }}
                    >
                        Add Interviewer
                    </Button>

                    <Form.Item className="mt-5">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-10 text-lg bg-blue-600 hover:bg-blue-700"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Main>
    );
};

export default ReopenJob;
