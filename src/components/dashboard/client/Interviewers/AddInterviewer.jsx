import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Typography,
    Alert,
    Tooltip,
    Row,
    Col,
    message,
    Select,
} from "antd";
import {
    InfoCircleOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";
// import "./AddInterviewer.css";
import { useAuth } from "../../../common/useAuth";
import Btnloading from "../../../common/loading/Btnloading";

const { Title } = Typography;

const validateUsername = (_, value) => {
    if (!value || /^[a-zA-Z0-9_]+$/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(
        new Error(
            "Username should contain only letters, numbers, and underscores.",
        ),
    );
};

const validateEmail = (_, value) => {
    if (!value || /\S+@\S+\.\S+/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid email address."));
};

const AddInterviewer = ({ onclose }) => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        designation: "",
    });

    const { apiurl, token } = useAuth();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const [form] = Form.useForm();
    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiurl}/client/add-interviewers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    designation: user.designation,
                }),
            });
            // console.log(response.json());
            if (!response.ok) {
                const errorData = await response.json();
                // console.log(errorData.error.match(/string='([^']+)'/)?.[1]);
                throw new Error(
                    errorData.error.match(/string='([^']+)'/)?.[1] ||
                        "Failed to register user",
                );
            }

            onclose();

            setLoading(false);

            form.resetFields();
            setSuccess("Account Created Successfully");
            setError(null);
        } catch (error) {
            setLoading(false);

            setError(error.message);
            setSuccess("");
        }
    };

    return (
        <div className="w-full">
            <div className="mt-5 pb-[10px] flex gap-[10px] items-center justify-start border-b border-[#A2A1A866] font-semibold text-base text-[#1681FF]">
                <UserOutlined></UserOutlined> Add Interviewer
            </div>
            <Form
                form={form}
                onFinish={handleSubmit}
                className="w-full m-auto p-6 flex flex-col gap-4 rounded-[10px]"
                noValidate
                autoComplete="off"
            >
                {error && <Alert message={error} type="error" showIcon />}
                {success && <Alert message={success} type="success" showIcon />}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, validator: validateUsername },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username"
                                className="h-[45px] p-[10px] rounded-lg text-[15px] transition-all duration-300 ease"
                                prefix={
                                    <UserOutlined
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                suffix={
                                    <Tooltip title="Username should contain only letters, numbers, and underscores">
                                        <InfoCircleOutlined
                                            style={{ color: "rgba(0,0,0,.45)" }}
                                        />
                                    </Tooltip>
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, validator: validateEmail },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="h-[45px] p-[10px] rounded-lg text-[15px] transition-all duration-300 ease"
                                prefix={
                                    <MailOutlined
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="designation"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a designation",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select Designation"
                                className="w-full h-[45px] transition-all duration-300 ease"
                                onChange={(val) =>
                                    setUser((prev) => ({
                                        ...prev,
                                        designation: val,
                                    }))
                                }
                            >
                                <Select.Option value="Technical">
                                    Technical
                                </Select.Option>
                                <Select.Option value="HR">HR</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="flex items-end w-full" span={16} offset={6}>
                        <Form.Item>
                            <button
                                htmlType="submit"
                                className="bg-[#1681FF] px-5 py-2.5 border-none rounded-[10px] text-white cursor-pointer hover:scale-[1.01] flex gap-[5px]"
                                block
                            >
                                Create account
                                {loading ? (
                                    <Btnloading spincolor={"white-spinner"} />
                                ) : (
                                    ""
                                )}
                            </button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddInterviewer;
