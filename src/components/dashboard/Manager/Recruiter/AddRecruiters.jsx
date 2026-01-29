import React, { useEffect, useState } from "react";
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
    List,
} from "antd";
import {
    InfoCircleOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../../common/useAuth";
import Btnloading from "../../../common/loading/Btnloading";

const { Title } = Typography;

const validateUsername = (_, value) => {
    if (!value || /^[a-zA-Z0-9_]+$/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(
        new Error(
            "Username should contain only letters, numbers, and underscores."
        )
    );
};

const validateEmail = (_, value) => {
    if (!value || /\S+@\S+\.\S+/.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid email address."));
};

const { Option } = Select;

const AddRecruiters = ({ onclose }) => {
    const [form] = Form.useForm();
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState(null);
    const [recruiterList, setRecruiterList] = useState([]);

    const fetchRecruiters = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/org/get-recruiters/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                return message.error("Unable to fetch the recruiters");
            }
            const data = await response.json();
            if (data.error) {
                return message.error(data.error);
            }
            setRecruiterList(data.data);
        } catch (e) {
            console.error(e);
            message.error(e.message || "Error fetching recruiters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecruiters();
        }
    }, [token]);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleSubmit = async (values) => {
        setError(null);
        setBtnLoading(true);
        try {
            const response = await fetch(`${apiurl}/agency/recruiters/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    alloted_to: values.alloted_to,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to register user");
            }

            // Reset form and state
            form.resetFields();
            setSuccess("Account Created Successfully");
            setError(null);

            // Refresh recruiter list
            await fetchRecruiters();

            setTimeout(() => {
                if (typeof onclose === "function") {
                    onclose();
                }
            }, 1000);
        } catch (error) {
            setError(error.message);
            setSuccess("");
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <div className="p-4">
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="space-y-4"
                noValidate
                autoComplete="off"
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#071C50]">
                        Add New Recruiter
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Create an account for your team member
                    </p>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                )}
                {success && (
                    <Alert
                        message={success}
                        type="success"
                        showIcon
                        className="mb-4"
                    />
                )}

                <Form.Item
                    name="username"
                    label={
                        <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                            Username
                        </span>
                    }
                    rules={[{ required: true, validator: validateUsername }]}
                    validateTrigger="onBlur"
                >
                    <Input
                        placeholder="e.g. john_doe"
                        prefix={<UserOutlined className="text-gray-400" />}
                        className="rounded-lg py-2"
                        suffix={
                            <Tooltip title="Letters, numbers, and underscores only">
                                <InfoCircleOutlined className="text-gray-400" />
                            </Tooltip>
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label={
                        <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                            Email Address
                        </span>
                    }
                    rules={[{ required: true, validator: validateEmail }]}
                    validateTrigger="onBlur"
                >
                    <Input
                        placeholder="e.g. john@example.com"
                        prefix={<MailOutlined className="text-gray-400" />}
                        className="rounded-lg py-2"
                    />
                </Form.Item>

                <Form.Item
                    name="alloted_to"
                    label={
                        <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                            Assign To Organization
                        </span>
                    }
                    rules={[
                        { required: true, message: "Please select a user" },
                    ]}
                >
                    <Select
                        placeholder="Search or select organization"
                        className="w-full h-10"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    >
                        {recruiterList.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name} ({item.role})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        disabled={btnLoading}
                        className="h-11 bg-[#1681FF] hover:bg-[#0061D5] border-none font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        {btnLoading ? (
                            <Btnloading spincolor="white-spinner" />
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddRecruiters;
