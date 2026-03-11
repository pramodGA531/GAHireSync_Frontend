import React, { useState, useEffect } from "react";
import { Form, message, Spin, Table, Card, Typography, Tag } from "antd";
import { useAuth } from "../../../common/useAuth";
import {
    CalendarOutlined,
    BankOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";

const OrganizationTerms = () => {
    const { Title, Text } = Typography;
    const [loading, setLoading] = useState(false);
    const [termsData, setTermsData] = useState([]);
    const { apiurl, token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchTerms();
        }
    }, [token]);

    const fetchTerms = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/organization-terms/?values=true`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok)
                throw new Error("Failed to fetch organization terms");

            const data = await response.json();
            setTermsData(data.data || []);
        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const termColumns = [
        {
            title: "CTC Range",
            dataIndex: "ctc_range",
            key: "ctc_range",
            render: (text) => (
                <span className="font-bold text-blue-600">{text}</span>
            ),
        },
        {
            title: "Service Fee",
            dataIndex: "service_fee",
            key: "service_fee",
            render: (text, record) => (
                <span className="font-bold">
                    {record.service_fee_type === "percentage"
                        ? `${text}%`
                        : `₹${text}`}
                </span>
            ),
        },
        {
            title: "Invoice After",
            dataIndex: "invoice_after",
            key: "invoice_after",
            render: (text) => (
                <span className="text-gray-500">{text} Days</span>
            ),
        },
        {
            title: "Payment Within",
            dataIndex: "payment_within",
            key: "payment_within",
            render: (text) => (
                <span className="text-gray-500">{text} Days</span>
            ),
        },
        {
            title: "Replacement Clause",
            dataIndex: "replacement_clause",
            key: "replacement_clause",
            render: (text) => (
                <span className="text-gray-500">{text} Days</span>
            ),
        },
        {
            title: "Interest %",
            dataIndex: "interest_percentage",
            key: "interest_percentage",
            render: (text) => (
                <span className="text-red-500 font-medium">{text}%</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "is_negotiated",
            key: "is_negotiated",
            render: (neg, record) => {
                if (!neg) {
                    return <Tag color="default">Standard</Tag>;
                }
                if (record.status === "accepted") {
                    return <Tag color="success">Accepted</Tag>;
                }
                if (record.status === "rejected") {
                    return (
                        <div className="flex flex-col gap-1">
                            <Tag color="error">Rejected</Tag>
                            {record.reason && (
                                <span className="text-[10px] text-red-500 italic max-w-[150px]">
                                    Reason: {record.reason}
                                </span>
                            )}
                        </div>
                    );
                }
                return <Tag color="processing">Pending</Tag>;
            },
        },
    ];

    return (
        <div className="py-6">
            {loading ? (
                <div className="flex justify-center p-20">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="space-y-6">
                    {termsData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <InfoCircleOutlined className="text-4xl text-gray-200 mb-4" />
                            <Text className="text-gray-400">
                                No terms available at this moment
                            </Text>
                        </div>
                    ) : (
                        termsData.map((client, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                            >
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#1681FF] text-xl">
                                            <BankOutlined />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#071C50]">
                                                {client.client_name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="font-bold uppercase tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded italic">
                                                    {client.client}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <CalendarOutlined />{" "}
                                                    Connected on{" "}
                                                    {new Date(
                                                        client.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                                            Active Contract
                                        </span>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <Table
                                        columns={termColumns}
                                        dataSource={client.terms}
                                        rowKey={(record, idx) =>
                                            `${client.client}_${idx}`
                                        }
                                        pagination={false}
                                        className="terms-table"
                                        rowClassName={(record) =>
                                            record.is_negotiated
                                                ? "bg-amber-50/30"
                                                : ""
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizationTerms;
