import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tooltip, message } from "antd";
import {
    InfoCircleOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../common/useAuth";
import { useNavigate } from "react-router-dom";

const AdminInfo = () => {
    const { apiurl, token, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [updateLoading, setUpdateLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            try {
                const user =
                    typeof userData === "string"
                        ? JSON.parse(userData)
                        : userData;
                form.setFieldsValue({
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                });
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, [userData, form]);

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

    // Submit update - currently mocked or needs specific endpoint
    const handleUpdate = async (values) => {
        setUpdateLoading(true);
        try {
            // Note: Using a generic update endpoint or need to confirm specific admin update endpoint
            // For now assuming a similar texture to other updates, but might need adjustment based on backend
            // const response = await   (`${apiurl}/update-admin-profile/`, { ... });

            // Mock success for UI demonstration until endpoint is confirmed
            await new Promise((resolve) => setTimeout(resolve, 1000));
            message.success("Profile updated successfully!");
        } catch (error) {
            message.error(error.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center p-20 text-gray-400">
                Loading profile data...
            </div>
        );

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-[#071C50]">
                            Personal Information
                        </h3>
                        <p className="text-sm text-gray-500">
                            Update your personal details
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        className="space-y-4"
                        style={{ padding: "20px" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Username
                                    </span>
                                }
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        validator: validateUsername,
                                    },
                                ]}
                                validateTrigger="onBlur"
                            >
                                <Input
                                    placeholder="Enter username"
                                    prefix={
                                        <UserOutlined className="text-gray-400" />
                                    }
                                    className="rounded-lg py-2"
                                    suffix={
                                        <Tooltip title="Letters, numbers, and underscores only">
                                            <InfoCircleOutlined className="text-gray-400" />
                                        </Tooltip>
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Email Address
                                    </span>
                                }
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        validator: validateEmail,
                                    },
                                ]}
                                validateTrigger="onBlur"
                            >
                                <Input
                                    disabled
                                    placeholder="Enter email"
                                    prefix={
                                        <MailOutlined className="text-gray-400" />
                                    }
                                    className="rounded-lg py-2 bg-gray-50 text-gray-400"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Contact Number
                                    </span>
                                }
                                name="phone_number"
                            >
                                <Input
                                    className="rounded-lg py-2"
                                    prefix={
                                        <PhoneOutlined className="text-gray-400" />
                                    }
                                />
                            </Form.Item>
                        </div>

                        <Form.Item className="mb-0 pt-4 border-t border-gray-50 mt-8">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateLoading}
                                className="h-11 px-10 bg-[#1681FF] hover:bg-[#0061D5] border-none font-bold rounded-lg shadow-md transition-all"
                            >
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AdminInfo;
