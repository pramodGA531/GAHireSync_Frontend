import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import { useNavigate } from "react-router-dom";
import { Form, message, Input, Button } from "antd";

const BankDetails = () => {
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchBankDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/bank-details/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                // setBankDetails(data.data || {});
                form.setFieldsValue(data.data || {});
            } else {
                message.error(data?.message || "Failed to fetch bank details");
            }
        } catch (e) {
            message.error("Error fetching bank details");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setButtonLoading(true);
            const response = await fetch(`${apiurl}/manager/bank-details/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                message.success(
                    data?.message || "Bank details updated successfully"
                );
                fetchBankDetails(); // Refresh data
            } else {
                message.error(data?.message || "Failed to update bank details");
            }
        } catch (e) {
            message.error("Error updating bank details");
        } finally {
            setButtonLoading(false);
        }
    };

    useEffect(() => {
        fetchBankDetails();
    }, []);

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-[#071C50]">
                            Banking Information
                        </h3>
                        <p className="text-sm text-gray-500">
                            Manage your payout account and business registration
                            details
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="p-8 space-y-4"
                        loading={loading}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Account Number
                                    </span>
                                }
                                name="account_number"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input
                                    placeholder="Account number"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Account Holder Name
                                    </span>
                                }
                                name="bank_holder_name"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input
                                    placeholder="Full name on account"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        IFSC Code
                                    </span>
                                }
                                name="ifsc_code"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input
                                    placeholder="e.g. HDFC0001234"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        Bank Name
                                    </span>
                                }
                                name="bank_name"
                                rules={[
                                    { required: true, message: "Required" },
                                ]}
                            >
                                <Input
                                    placeholder="e.g. HDFC Bank"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        UDAAN Number
                                    </span>
                                }
                                name="udaan_number"
                            >
                                <Input
                                    placeholder="Optional"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                                        MSME Number
                                    </span>
                                }
                                name="msme_number"
                            >
                                <Input
                                    placeholder="Optional"
                                    className="rounded-lg py-2"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item className="mb-0 pt-4 border-t border-gray-50 mt-8">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={buttonLoading}
                                className="h-11 px-10 bg-[#1681FF] hover:bg-[#0061D5] border-none font-bold rounded-lg shadow-md transition-all"
                            >
                                Save Bank Details
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default BankDetails;
