import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Avatar, Skeleton } from "antd";
import { UserOutlined, MailOutlined, SafetyCertificateOutlined, IdcardOutlined } from "@ant-design/icons";
import { useAuth } from "../../common/useAuth";

const AccountantInfo = () => {
    const { apiurl, token, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState(null);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/get-user-details/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.data) {
                setData(result.data);
                form.setFieldsValue({
                    username: result.data.username,
                    email: result.data.email,
                    role: result.data.role,
                    designation: result.data.designation || "Accountant",
                });
            }
        } catch (error) {
            message.error("Failed to fetch profile details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    if (loading && !data) {
        return (
            <div className="p-8">
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }

    return (
        <div className="py-8 m-2">
            <div className="max-w-3xl mx-auto m-2">
                <div className="bg-white rounded-3xl border m-2 border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 m-2  bg-gradient-to-r from-gray-50/50 to-white">
                        <h3 className="text-xl font-bold text-[#071C50]">
                            Personal Information
                        </h3>
                        <p className="text-sm text-gray-500">
                            Your account details and professional role within the organization.
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        className="p-8 space-y-6 m-2"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-400 m-2 uppercase text-[11px] tracking-widest">
                                        Username
                                    </span>
                                }
                                name="username"
                            >
                                <Input
                                    readOnly
                                    prefix={<UserOutlined className="text-blue-400" />}
                                    className="rounded-xl py-3 ml-1 bg-gray-50/50 border-gray-100 font-medium text-gray-700"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold mt-2 text-gray-400 uppercase text-[11px] tracking-widest">
                                        Email Address
                                    </span>
                                }
                                name="email"
                            >
                                <Input
                                    readOnly
                                    prefix={<MailOutlined className="text-blue-400" />}
                                    className="rounded-xl py-3 mt-2 mr-1 bg-gray-50/50 border-gray-100 font-medium text-gray-700"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Form.Item
                                label={
                                    <span className="font-bold m-2 text-gray-400 uppercase text-[11px] tracking-widest">
                                        Professional Title / Designation
                                    </span>
                                }
                                name="designation"
                            >
                                <Input
                                    readOnly
                                    prefix={<IdcardOutlined className="text-blue-400" />}
                                    className="rounded-xl py-3 ml-1 bg-gray-50/50 border-gray-100 font-medium text-gray-700"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-400 uppercase text-[11px] tracking-widest">
                                        Account Role
                                    </span>
                                }
                                name="role"
                            >
                                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                    <SafetyCertificateOutlined className="text-blue-500" />
                                    <span className="capitalize font-bold text-blue-600 text-sm">
                                        {data?.role || "Staff"}
                                    </span>
                                </div>
                            </Form.Item>
                        </div>
                        
                        <div className="pt-8 border-t border-gray-50 mt-4">
                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex gap-3">
                                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    <strong className="block mb-1">Administrative Note:</strong>
                                    Personal identification details and professional titles are managed by the HR administration. 
                                    If any information above is incorrect or requires an update, please submit a formal request via the support tickets or contact your administrator.
                                </p>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AccountantInfo;
