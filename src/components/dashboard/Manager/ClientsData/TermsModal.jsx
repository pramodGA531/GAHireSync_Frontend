import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Input, Space, message, Popconfirm, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";

const emptyRow = () => ({
    key: Date.now() + Math.random(),
    ctc_range: "",
    service_fee: "",
    replacement_clause: "",
    interest_percentage: "",
    payment_within: "",
    service_fee_type: "",
    invoice_after: "",
});

const ctcRegex = /^\s*\d+(\.\d+)?\s*-\s*\d+(\.\d+)?\s+LPA\s*$/i;


const TermsModal = ({ visible, onClose, connection_id }) => {
    const [termsData, setTermsData] = useState([emptyRow()]);
    const [loading, setLoading] = useState(false);
    const [validateError, setValidateError] = useState(false)
    const { apiurl, token } = useAuth()

    function isValidCTC(ctc) {
        return ctcRegex.test(ctc);
    }


    const fetchOldTerms = async () => {
        try {
            const response = await fetch(`${apiurl}/manager/old-client-terms/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const resData = await response.json();
            const rows = Array.isArray(resData?.data) ? resData.data : [];

            if (rows.length === 0) {
                setTermsData([emptyRow()]);
            } else {
                setTermsData(
                    rows.map(item => ({
                        key: Date.now() + Math.random(),
                        ctc_range: item.ctc_range || "",
                        service_fee: String(item.service_fee ?? ""),
                        replacement_clause: String(item.replacement_clause ?? ""),
                        interest_percentage: String(item.interest_percentage ?? ""),
                        payment_within: String(item.payment_within ?? ""),
                        service_fee_type: item.service_fee_type || "",
                        invoice_after: String(item.invoice_after ?? "")
                    }))
                );
            }
        }
        catch (e) {
            message.error(e)
        }
    }


    useEffect(() => {
        if (token) {
            fetchOldTerms();
        }
    }, [])


    const handleInputChange = (key, field, value) => {
        const updated = termsData.map((item) =>
            item.key === key ? { ...item, [field]: value } : item
        );
        setTermsData(updated);
        if (field === 'ctc_range') {

            if (value && !isValidCTC(value)) {
                setValidateError("Format must be: Min-Max LPA (e.g., 1-100 LPA)");
            } else {
                setValidateError("");
            }
        }
    };

    const addNewTerm = () => {
        setTermsData([...termsData, emptyRow()]);
    };

    const deleteRow = (key) => {
        const updated = termsData.filter((item) => item.key !== key);
        setTermsData(updated.length ? updated : [emptyRow()]);
    };

    const isValid = () => {
        for (let row of termsData) {
            if (
                !row.ctc_range ||
                !row.service_fee ||
                !row.service_fee_type ||
                !row.replacement_clause ||
                !row.interest_percentage ||
                !row.payment_within ||
                !row.invoice_after
            ) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!isValid()) {
            message.warning("Please fill all fields before submitting.");
            return;
        }

        const payload = termsData.map((item) => ({
            ctc_range: item.ctc_range,
            service_fee: item.service_fee.replace('%', ''),
            replacement_clause: item.replacement_clause,
            interest_percentage: item.interest_percentage.replace('%', ''),
            payment_within: item.payment_within.replace('days', ''),
            invoice_after: item.invoice_after.replace('days', ''),
            service_fee_type: item.service_fee_type,
        }));

        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/accept-approval-client/?connection_id=${connection_id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ terms: payload }),
            });

            const data = await response.json();
            if (response.ok) {
                message.success("Terms saved successfully!");
                onClose();
                setTermsData([emptyRow()]);
            } else {
                message.error(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            message.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const { Option } = Select;

    const columns = [
        {
            title: "CTC Range",
            dataIndex: "ctc_range",
            render: (_, record) => (
                <>
                    <Input
                        value={record.ctc_range}
                        onChange={(e) =>
                            handleInputChange(record.key, "ctc_range", e.target.value)
                        }
                        placeholder="e.g. 0-3 LPA"
                    />
                    {validateError && <p style={{ color: "red" }}>{validateError}</p>}
                </>
            ),

        },
        {
            title: "Service Fee Type",
            dataIndex: "service_fee_type",
            render: (_, record) => (
                <Select
                    value={record.service_fee_type ?? null}
                    style={{ width: 140 }}
                    placeholder="Select Type"
                    onChange={(val) =>
                        handleInputChange(record.key, "service_fee_type", val)
                    }
                >
                    <Option value="percentage">Percentage</Option>
                    <Option value="fixed">Fixed</Option>
                </Select>
            ),
        },

        {
            title: "Service Fee",
            dataIndex: "service_fee",
            render: (_, record) => (
                <Input
                    suffix={record.service_fee_type === "fixed" ? "₹" : "%"}
                    value={record.service_fee}
                    onChange={(e) =>
                        handleInputChange(record.key, "service_fee", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Replacement Clause",
            dataIndex: "replacement_clause",
            render: (_, record) => (
                <Input
                    suffix="days"
                    value={record.replacement_clause}
                    onChange={(e) =>
                        handleInputChange(record.key, "replacement_clause", e.target.value)
                    }
                />
            ),
        },
        
        {
            title: "Payment Within (days)",
            dataIndex: "payment_within",
            render: (_, record) => (
                <Input
                    suffix="days"
                    value={record.payment_within}
                    onChange={(e) =>
                        handleInputChange(record.key, "payment_within", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Invoice After (days)",
            dataIndex: "invoice_after",
            render: (_, record) => (
                <Input
                    suffix="days"
                    value={record.invoice_after}
                    onChange={(e) =>
                        handleInputChange(record.key, "invoice_after", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Interest On Late Payment(%)",
            dataIndex: "interest_percentage",
            render: (_, record) => (
                <Input
                    suffix="%"
                    value={record.interest_percentage}
                    onChange={(e) =>
                        handleInputChange(record.key, "interest_percentage", e.target.value)
                    }
                />
            ),
        },
        {
            title: "Actions",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this row?"
                    onConfirm={() => deleteRow(record.key)}
                >
                    <Button danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Modal
            open={visible}
            title="Manage Terms"
            onCancel={onClose}
            footer={[
                <Button key="add" onClick={addNewTerm} icon={<PlusOutlined />}>
                    Add Term
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!isValid()}
                >
                    Submit
                </Button>,
            ]}
            width={1200}
        ><div
            style={{
                backgroundColor: "#fff8e1",
                borderLeft: "4px solid #ff9800",
                padding: "10px 15px",
                borderRadius: "4px",
                color: "#5d4037",
                fontSize: "14px",
                margin: "10px",
                marginTop: "20px",
                fontFamily: "sans-serif",
            }}
        >
                <strong>Note:</strong> Add CTC ranges from minimum to maximum LPA your
                business will handle, to avoid future consequences.
                For best practices, use categories like <em>1-10 LPA</em>, <em>10-50 LPA</em>, or
                <em>50-100 LPA</em>, and define terms for each category.
            </div>
            <Table
                dataSource={termsData}
                columns={columns}
                rowKey="key"
                pagination={false}
                scroll={{ x: true }}
            />
        </Modal>
    );
};

export default TermsModal;
