import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Upload,
} from "antd";
import { useAuth } from "../common/useAuth";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const ViewTickets = () => {
    const { apiurl, token, userData } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/view-tickets/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setData(result);
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch tickets.");
        }
        setLoading(false);
    };

    const fetchTicket = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/view-tickets/?ticket_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setSelectedTicket(result);
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch tickets.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const raiseTicket = async (values) => {
        try {
            const formData = new FormData();

            formData.append(
                "category",
                values.category === "Other"
                    ? values.customCategory
                    : values.category
            );
            formData.append("description", values.description);

            if (values.attachments && values.attachments.length > 0) {
                formData.append(
                    "attachment",
                    values.attachments[0].originFileObj
                );
            }

            const response = await fetch(`${apiurl}/view-tickets/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Ticket raised successfully!");
                setIsModalOpen(false);
                fetchData(); // Refresh table data
                form.resetFields();
            }
        } catch (error) {
            message.error("Failed to raise ticket.");
        }
    };

    const formatDate = (oldDate) => {
        let newDate = new Date(oldDate);
        return newDate.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit',
            // hour12: true
        });
    };

    // Table Columns
    const columns = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (text, record) => (
                <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setIsViewModalOpen(true);
                        fetchTicket(record.id);
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Assigned To",
            dataIndex: "assigned_to",
            key: "assigned_to",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => <span>{formatDate(text)}</span>,
        },
    ];

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-2.5">
                <Button type="default" onClick={() => navigate(-1)}>
                    Back
                </Button>
                <h2 className="m-0 text-xl font-bold">View Tickets</h2>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Add Ticket
                </Button>
            </div>
            <Table
                dataSource={data}
                columns={columns}
                loading={loading}
                rowKey="id"
            />
            {/* Add Ticket Modal */}
            <Modal
                title="Raise a Ticket"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={raiseTicket}>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[
                            {
                                required: true,
                                message: "Please select a category",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Category"
                            onChange={(value) =>
                                setIsOtherSelected(value === "Other")
                            }
                        >
                            <Option value="Feature Request">
                                Feature Request - Request for new functionality
                                or improvements
                            </Option>
                            <Option value="Support">
                                Support - Issues with existing features or
                                system errors
                            </Option>
                            <Option value="Bug Report">
                                Bug Report - Report system malfunctions or
                                unexpected behavior
                            </Option>
                            <Option value="Access Request">
                                Access Request - Request permissions or account
                                access
                            </Option>
                            <Option value="Performance Issue">
                                Performance Issue - Report slow loading or
                                inefficiencies
                            </Option>
                            <Option value="Integration Help">
                                Integration Help - Assistance with API or
                                third-party integrations
                            </Option>
                            <Option value="Other">
                                Other - Any issue not listed above
                            </Option>
                        </Select>
                    </Form.Item>
                    {isOtherSelected && (
                        <Form.Item
                            label="Specify Your Request"
                            name="customCategory"
                            rules={[
                                {
                                    required: true,
                                    message: "Please specify your request type",
                                },
                            ]}
                        >
                            <Input placeholder="Enter request type" />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a description",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Describe your issue in detail"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Attachments (Optional)"
                        name="attachments"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                    >
                        <Upload
                            beforeUpload={() => false}
                            listType="text"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>
                                Click to Upload
                            </Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Ticket Details"
                open={isViewModalOpen}
                onCancel={() => {
                    setSelectedTicket(null);
                    setIsViewModalOpen(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setIsViewModalOpen(false)}
                    >
                        Back
                    </Button>,
                ]}
            >
                {selectedTicket && (
                    <div className="ticket-details-modal">
                        <p>
                            <strong>Category:</strong> {selectedTicket.category}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {selectedTicket.description}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedTicket.status}
                        </p>
                        <p>
                            <strong>Assigned To:</strong>{" "}
                            {selectedTicket.assigned_to || "Not Assigned"}
                        </p>
                        <p>
                            <strong>Created At:</strong>{" "}
                            {formatDate(selectedTicket.created_at)}
                        </p>
                        {selectedTicket.attachments && (
                            <p>
                                <strong>Attachments:</strong>{" "}
                                <a
                                    href={`${apiurl}${selectedTicket.attachments}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Attachment
                                </a>
                            </p>
                        )}
                        {selectedTicket.status !== "Pending" &&
                            selectedTicket.reply && (
                                <div className="ticket-reply">
                                    <p>
                                        <strong>Reply:</strong>{" "}
                                        {selectedTicket.reply}
                                    </p>
                                </div>
                            )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewTickets;
