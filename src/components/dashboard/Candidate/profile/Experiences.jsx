import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Button,
    Form,
    Input,
    Upload,
    Select,
    Image,
    Modal,
    Table,
} from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../../common/CustomDatePicker";

const CandidateExperience = () => {
    const [data, setData] = useState([]);
    const { apiurl, token } = useAuth();
    const [add, setAdd] = useState(false);
    const [form] = Form.useForm();
    const { Option } = Select;

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/experience/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok)
                return message.error("Failed to fetch experience data");
            const result = await response.json();
            setData(result);
        } catch (error) {
            message.error("Error fetching candidate experience");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleAdd = async (values) => {
        const formData = new FormData();
        formData.append("company_name", values.company_name);
        formData.append("from_date", values.from_date.format("YYYY-MM-DD"));
        formData.append("job_type", values.job_type);
        formData.append("job_role", values.job_role);

        if (values.to_date) {
            formData.append("to_date", values.to_date.format("YYYY-MM-DD"));
        }

        formData.append("status", values.status);

        if (values.reason_for_resignation)
            formData.append(
                "reason_for_resignation",
                values.reason_for_resignation
            );

        const getFile = (fileList) =>
            fileList && fileList.length > 0 ? fileList[0].originFileObj : null;

        formData.append("relieving_letter", getFile(values.relieving_letter));
        formData.append("pay_slip1", getFile(values.pay_slip1));
        formData.append("pay_slip2", getFile(values.pay_slip2));
        formData.append("pay_slip3", getFile(values.pay_slip3));

        try {
            const response = await fetch(`${apiurl}/candidate/experience/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) return message.error("Failed to add experience");
            message.success("Experience added successfully");
            setAdd(false);
            fetchData();
            form.resetFields();
        } catch (error) {
            message.error("Error adding experience");
        }
    };

    const handleRemove = async (experienceId) => {
        try {
            const response = await fetch(
                `${apiurl}/candidate/experience/?id=${experienceId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                message.error("Failed to remove experience");
                return;
            }
            message.success("Experience removed successfully");
            fetchData();
        } catch (error) {
            message.error("Error removing Experience");
        }
    };

    const columns = [
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "From Date",
            dataIndex: "from_date",
            key: "from_date",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "To Date",
            dataIndex: "to_date",
            key: "to_date",
            render: (text) => text || "Present",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
            render: (text) =>
                text === true ? <span>Working</span> : <span>Not Working</span>,
        },
        {
            title: "Reason for Resignation",
            dataIndex: "reason_for_resignation",
            key: "reason_for_resignation",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Relieving Letter",
            dataIndex: "relieving_letter",
            key: "relieving_letter",
            render: (text) =>
                text ? (
                    <a
                        href={`${apiurl}${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                ),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Pay Slip 1",
            dataIndex: "pay_slip1",
            key: "pay_slip1",
            render: (text) =>
                text ? (
                    <a
                        href={`${apiurl}${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                ),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Pay Slip 2",
            dataIndex: "pay_slip2",
            key: "pay_slip2",
            render: (text) =>
                text ? (
                    <a
                        href={`${apiurl}${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                ),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Pay Slip 3",
            dataIndex: "pay_slip3",
            key: "pay_slip3",
            render: (text) =>
                text ? (
                    <a
                        href={`${apiurl}${text}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                ),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
            render: (id) => (
                <Button danger onClick={() => handleRemove(id)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between w-[95%] mx-auto">
                <h2 className="text-xl font-semibold">Candidate Experience</h2>
                <Button type="primary" onClick={() => setAdd(true)}>
                    Add Experience <PlusSquareOutlined />
                </Button>
            </div>
            <div className="w-[95%] mx-auto">
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    className="mt-5"
                />
            </div>

            <Modal open={add} onClose={() => setAdd(false)} footer={false}>
                <h2>Add Experience</h2>
                <Form form={form} onFinish={handleAdd} layout="vertical">
                    <Form.Item
                        label="Company Name"
                        name="company_name"
                        rules={[
                            {
                                required: true,
                                message: "Company name is required",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Job Role"
                        name="job_role"
                        rules={[
                            { required: true, message: "Job Role is required" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Job Type"
                        name="job_type"
                        rules={[
                            { required: true, message: "Job type is required" },
                        ]}
                    >
                        <Select placeholder="Select Job Type">
                            <Option value="full_time">Full Time</Option>
                            <Option value="part_time">Part Time</Option>
                            <Option value="intern">Intern</Option>
                            <Option value="contract">Contract</Option>
                            <Option value="freelance">Freelance</Option>
                            <Option value="consultant">Consultant</Option>
                            <Option value="temporary">Temporary</Option>
                            <Option value="volunteer">Volunteer</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="From Date"
                        name="from_date"
                        rules={[
                            {
                                required: true,
                                message: "From date is required",
                            },
                        ]}
                    >
                        <CustomDatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item label="To Date" name="to_date">
                        <CustomDatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                            { required: true, message: "Status is required" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Reason for Resignation"
                        name="reason_for_resignation"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Relieving Letter"
                        name="relieving_letter"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Pay Slip 1"
                        name="pay_slip1"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Pay Slip 2 (Optional)"
                        name="pay_slip2"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Pay Slip 3 (Optional)"
                        name="pay_slip3"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                    >
                        <Upload beforeUpload={() => false} maxCount={1}>
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            type="default"
                            onClick={() => setAdd(false)}
                            className="ml-2.5"
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CandidateExperience;
