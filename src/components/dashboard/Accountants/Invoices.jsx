import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Input, Select, Tag, Space, Card, Dropdown, Menu } from "antd";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import html2pdf from "html2pdf.js";
import { 
    SearchOutlined, 
    DownloadOutlined, 
    EyeOutlined, 
    FilterOutlined, 
    MoreOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import invoiceicon from "../../../images/invoice/downloadinvoicebut.svg";

const Invoices = () => {
    const { token, apiurl } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/get_invoices/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.invoices) {
                setInvoices(data.invoices);
            } else {
                message.error("No invoices found.");
            }
        } catch (error) {
            message.error("Error fetching invoices.");
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (htmlContent, invoiceCode) => {
        const invoiceElement = document.createElement("div");
        invoiceElement.innerHTML = htmlContent;
        document.body.appendChild(invoiceElement);

        const options = {
            margin: 0.5,
            filename: `Invoice_${invoiceCode || "invoice"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf()
            .from(invoiceElement)
            .set(options)
            .save()
            .then(() => {
                document.body.removeChild(invoiceElement);
                message.success("Invoice downloaded successfully.");
            });
    };

    const viewInvoice = (htmlContent) => {
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const updatePaymentVerification = async (id, verification) => {
        const data = {
            invoice_id: id,
            payment_verification: verification,
        };

        try {
            const response = await fetch(`${apiurl}/update_invoices/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || "Update failed");
            
            message.success(`Payment ${verification ? "verified" : "unverified"} successfully.`);
            fetchInvoices();
        } catch (error) {
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: "Invoice Details",
            key: "invoice_details",
            render: (_, record) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{record.invoice_code}</span>
                    <span className="text-xs text-gray-400">Agency: {record.agency_code}</span>
                </div>
            )
        },
        {
            title: "Client",
            dataIndex: "client_email",
            key: "client_email",
            render: (text) => <span className="text-gray-600 font-medium">{text}</span>
        },
        {
            title: "Status",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (status) => (
                <Tag color={status === "Paid" ? "green" : "volcano"} className="rounded-full px-4 font-bold border-none">
                    {(status || 'Pending').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Payment Verification",
            dataIndex: "payment_verification",
            key: "payment_verification",
            render: (verified, record) => (
                <Select
                    value={verified ? "Verified" : "Not Verified"}
                    className={`custom-select-verification ${verified ? 'verified-active' : 'pending-active'}`}
                    style={{ width: 140 }}
                    onChange={(value) => updatePaymentVerification(record.id, value === "Verified")}
                    options={[
                        { value: "Not Verified", label: "Not Verified" },
                        { value: "Verified", label: "Verified" },
                    ]}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="text" 
                        icon={<EyeOutlined className="text-blue-500" />} 
                        onClick={() => viewInvoice(record.html)}
                        className="hover:bg-blue-50 rounded-lg"
                    />
                    <Button 
                        type="text" 
                        icon={<DownloadOutlined className="text-indigo-500" />} 
                        onClick={() => downloadInvoice(record.html, record.invoice_code)}
                        className="hover:bg-indigo-50 rounded-lg"
                    />
                </Space>
            ),
        },
    ];

    const filteredData = invoices.filter((item) => {
        const matchesSearch = Object.values(item).some(
            (value) => value && value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
        const matchesStatus = filterStatus === "all" || item.payment_status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <Main defaultSelectedKey="2">
            <div className="p-8 bg-[#F8FAFC] min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#071C50]">Invoices Management</h1>
                        <p className="text-gray-500">View, verify and manage all outgoing client invoices.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-wrap">
                        <Input
                            placeholder="Search code, client..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="w-64 border-none bg-gray-50 rounded-xl hover:bg-gray-100 focus:bg-white transition-all"
                        />
                        <Select
                            defaultValue="all"
                            style={{ width: 120 }}
                            onChange={setFilterStatus}
                            className="premium-select"
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "Paid", label: "Paid" },
                                { value: "Unpaid", label: "Unpaid" },
                            ]}
                        />
                        <Button type="primary" className="bg-[#071C50] rounded-xl h-9 px-6 font-bold flex items-center gap-2">
                            <FilterOutlined /> Filter
                        </Button>
                    </div>
                </div>

                <Card bordered={false} className="rounded-3xl shadow-sm border border-gray-100 p-0 overflow-hidden">
                    <Table
                        loading={loading}
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            className: "custom-pagination px-6 py-4",
                        }}
                        className="premium-table"
                    />
                </Card>
            </div>

            <style jsx>{`
                .premium-table :global(.ant-table-thead > tr > th) {
                    background: #F8FAFC !important;
                    color: #94A3B8 !important;
                    font-size: 11px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    font-weight: 700 !important;
                    padding: 20px 24px !important;
                    border-bottom: 2px solid #F1F5F9 !important;
                }
                .premium-table :global(.ant-table-tbody > tr > td) {
                    padding: 16px 24px !important;
                    border-bottom: 1px solid #F8FAFC !important;
                }
                .premium-table :global(.ant-table-tbody > tr:hover > td) {
                    background: #F1F5F9 !important;
                }
                .custom-select-verification :global(.ant-select-selector) {
                    border-radius: 12px !important;
                    border: 1px solid #E2E8F0 !important;
                    font-size: 13px !important;
                    font-weight: 600 !important;
                }
                .verified-active :global(.ant-select-selector) {
                    background-color: #EFF6FF !important;
                    color: #2563EB !important;
                    border-color: #DBEAFE !important;
                }
                .pending-active :global(.ant-select-selector) {
                    background-color: #F8FAFC !important;
                    color: #64748B !important;
                }
                .premium-select :global(.ant-select-selector) {
                    border-radius: 12px !important;
                    background: #F9FAFB !important;
                    border: none !important;
                }
            `}</style>
        </Main>
    );
};

export default Invoices;
