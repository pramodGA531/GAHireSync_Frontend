import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tooltip, message } from "antd";
import {
    InfoCircleOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";
import { useNavigate } from "react-router-dom";

const MangerInfo = () => {
    const { apiurl, token, updateUserData } = useAuth();
    const [agencyData, setAgencyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [updateLoading, setUpdateLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch current org/manager info
    const fetchAgencyRequests = async () => {
        try {
            const response = await fetch(`${apiurl}/manager/information/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch agency data");

            const data = await response.json();

            const formValues = {
                ...data,
            };

            setAgencyData(formValues);
            form.setFieldsValue(formValues);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching agency info:", error.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        const loadRequests = async () => {
            await fetchAgencyRequests();
        };
        loadRequests();
    }, []);

    useEffect(() => {
        if (
            agencyData &&
            (!agencyData.target_in_amount || !agencyData.target_in_positions)
        ) {
            message.info(
                "Welcome! Please set your valid target amount and positions to get started.",
                4,
            );
        }
    }, [agencyData]);

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

    // Submit update
    const handleUpdate = async (values) => {
        setUpdateLoading(true);
        try {
            const response = await fetch(`${apiurl}/signup/agency/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Update failed");
            }

            message.success("Profile updated successfully!");
            updateUserData({
                target_in_amount: values.target_in_amount,
                target_in_positions: values.target_in_positions,
            });
            // navigate('/dashboard'); // redirect if needed
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
                            Organization Information
                        </h3>
                        <p className="text-sm text-gray-500">
                            Update your agency details and contact information
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        className="space-y-4"
                        style={{ padding: "10px" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Username (Manager)
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
                                        Organization Name
                                    </span>
                                }
                                name="name"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input className="rounded-lg py-2" />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Company Code
                                    </span>
                                }
                                name="org_code"
                            >
                                <Input
                                    disabled
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
                                name="contact_number"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input className="rounded-lg py-2" />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Website URL
                                    </span>
                                }
                                name="website_url"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input
                                    className="rounded-lg py-2"
                                    placeholder="e.g. https://company.com"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={
                                <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                    Company Address
                                </span>
                            }
                            name="company_address"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input.TextArea rows={4} className="rounded-lg" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Target in Amount (₹)
                                    </span>
                                }
                                name="target_in_amount"
                                rules={[]}
                            >
                                <Input
                                    type="number"
                                    placeholder="e.g. 5000000"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Target in Positions
                                    </span>
                                }
                                name="target_in_positions"
                                rules={[]}
                            >
                                <Input
                                    type="number"
                                    placeholder="e.g. 50"
                                    className="rounded-lg py-2"
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

export default MangerInfo;
