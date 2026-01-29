import React from "react";
import { Modal, Table } from "antd";

const TermsModal = ({ open, onClose, terms }) => {
    const columns = [
        {
            title: "Term ID",
            dataIndex: "terms_id",
            key: "terms_id",
        },
        {
            title: "Description",
            dataIndex: "term_description",
            key: "term_description",
        },
        {
            title: "Service Fee",
            dataIndex: "service_fee",
            key: "service_fee",
        },
        {
            title: "Invoice After",
            dataIndex: "invoice_after",
            key: "invoice_after",
        },
        {
            title: "Payment Within",
            dataIndex: "payment_within",
            key: "payment_within",
        },
        {
            title: "Interest %",
            dataIndex: "interest_percentage",
            key: "interest_percentage",
        },
        {
            title: "Is Negotiated",
            dataIndex: "is_negotiated",
            key: "is_negotiated",
            render: (val) =>
                val ? "True" : "False"
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) =>
                date ? new Date(date).toISOString().split("T")[0] : "-",
        },
    ];

    return (
        <Modal
            title="Terms Details"
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
        >
            {terms && terms.length > 0 ? (
                <Table
                    dataSource={terms}
                    columns={columns}
                    rowKey="terms_id"
                    pagination={false}
                />
            ) : (
                <p>No terms available for this job post.</p>
            )}
        </Modal>
    );
};

export default TermsModal;
