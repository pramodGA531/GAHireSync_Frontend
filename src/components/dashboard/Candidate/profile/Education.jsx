import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Button,
    Form,
    Input,
    Upload,
    Table,
    Modal,
    Select,
} from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CustomDatePicker from "../../../common/CustomDatePicker";

const Education = () => {
    const [data, setData] = useState([]);
    const { apiurl, token } = useAuth();
    const [add, setAdd] = useState(false);
    const [form] = Form.useForm();
    const [gradingType, setGradingType] = useState();
    const { Option } = Select;

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/education/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                message.error("Failed to fetch education details");
                return;
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            message.error("Error fetching education details");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleAdd = async (values) => {
        const formData = new FormData();
        formData.append("institution_name", values.institution_name);
        formData.append("field_of_study", values.field_of_study);
        formData.append("start_date", values.start_date.format("YYYY-MM-DD"));
        formData.append("end_date", values.end_date.format("YYYY-MM-DD"));
        formData.append("degree", values.degree);
        formData.append(
            "education_proof",
            values.education_proof[0].originFileObj
        );

        if (values.grading_type === "marks") {
            formData.append("grade", `${values.marks} Marks`);
        } else if (values.grading_type === "percentage") {
            formData.append("grade", `${values.percentage} Percentage`);
        } else if (values.grading_type === "cgpa") {
            formData.append("grade", `${values.cgpa} CGPA`);
        }

        try {
            const response = await fetch(`${apiurl}/candidate/education/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                message.error("Failed to add education");
                return;
            }

            message.success("Education added successfully");
            setAdd(false);
            fetchData();
        } catch (error) {
            message.error("Error adding education");
        }
    };

    const handleRemove = async (educationId) => {
        try {
            const response = await fetch(
                `${apiurl}/candidate/education/?id=${educationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                message.error("Failed to remove education");
                return;
            }

            message.success("Education removed successfully");
            fetchData();
        } catch (error) {
            message.error("Error removing education");
        }
    };

    const columns = [
        {
            title: "Institution Name",
            dataIndex: "institution_name",
            key: "institution_name",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Field of Study",
            dataIndex: "field_of_study",
            key: "field_of_study",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Degree",
            dataIndex: "degree",
            key: "degree",
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date",
            render: (text) => dayjs(text).format("YYYY-MM-DD"),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            render: (text) => dayjs(text).format("YYYY-MM-DD"),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
        {
            title: "Education Proof",
            dataIndex: "education_proof",
            key: "education_proof",
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
            key: "action",
            render: (_, record) => (
                <Button
                    type="link"
                    danger
                    onClick={() => handleRemove(record.id)}
                >
                    Remove
                </Button>
            ),
            onHeaderCell: () => ({
                className: "bg-[#1681FF] text-white font-bold text-center",
            }),
            onCell: () => ({ className: "text-center" }),
        },
    ];

    return (
        <div>
            <style>{`
                .custom-datepicker .ant-picker-dropdown {
                    min-width: 1000px !important;
                }
                .ant-picker-dropdown {
                    overflow: visible !important;
                    width: auto !important;
                    max-width: 20px !important;
                }
            `}</style>
            <div className="flex items-center justify-between w-[95%] mx-auto">
                <h2 className="text-xl font-semibold">Education</h2>
                <Button type="primary" onClick={() => setAdd(true)}>
                    Add Education <PlusSquareOutlined />
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

            <Modal
                title="Add Education Details"
                open={add}
                onCancel={() => setAdd(false)}
                footer={null} // Removing default footer buttons
            >
                <Form form={form} onFinish={handleAdd} layout="vertical">
                    <Form.Item
                        label="Institution Name"
                        name="institution_name"
                        rules={[
                            {
                                required: true,
                                message: "Please provide the institution name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Field of Study"
                        name="field_of_study"
                        rules={[
                            {
                                required: true,
                                message: "Please provide the field of study",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Degree"
                        name="degree"
                        rules={[
                            {
                                required: true,
                                message: "Please provide the degree",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="start_date"
                        rules={[
                            {
                                required: true,
                                message: "Please select the start date",
                            },
                        ]}
                    >
                        <CustomDatePicker
                            dropdownClassName="custom-datepicker"
                            format="YYYY-MM-DD"
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="end_date"
                        rules={[
                            {
                                required: true,
                                message: "Please select the end date",
                            },
                        ]}
                    >
                        <CustomDatePicker
                            format="YYYY-MM-DD"
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Grading System"
                        name="grading_type"
                        rules={[
                            {
                                required: true,
                                message: "Please select a grading system",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select grading type"
                            onChange={(value) => setGradingType(value)}
                        >
                            <Option value="cgpa">CGPA</Option>
                            <Option value="marks">Marks</Option>
                            <Option value="percentage">Percentage</Option>
                        </Select>
                    </Form.Item>

                    {/* Conditional Input Field Based on Selection */}
                    {gradingType === "cgpa" && (
                        <Form.Item
                            label="CGPA"
                            name="cgpa"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your CGPA",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                className="rounded-md"
                            />
                        </Form.Item>
                    )}

                    {gradingType === "marks" && (
                        <Form.Item
                            label="Marks Obtained"
                            name="marks"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your marks",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                min="0"
                                className="rounded-md"
                            />
                        </Form.Item>
                    )}

                    {gradingType === "percentage" && (
                        <Form.Item
                            label="Percentage"
                            name="percentage"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your percentage",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                className="rounded-md"
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Upload Education Proof"
                        name="education_proof"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please upload an education proof document",
                            },
                        ]}
                    >
                        <Upload
                            listType="text"
                            beforeUpload={() => false}
                            accept=".pdf,.jpg,.png"
                            maxCount={1}
                        >
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item className="flex justify-end mb-0">
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

            {/* {add && (
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            label="Institution Name"
            name="institution_name"
            rules={[
              {
                required: true,
                message: "Please provide the institution name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Field of Study"
            name="field_of_study"
            rules={[
              { required: true, message: "Please provide the field of study" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Degree"
            name="degree"
            rules={[{ required: true, message: "Please provide the degree" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[
              { required: true, message: "Please select the start date" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
            rules={[{ required: true, message: "Please select the end date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Upload Education Proof"
            name="education_proof"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
            rules={[
              {
                required: true,
                message: "Please upload an education proof document",
              },
            ]}
          >
            <Upload
              listType="text"
              beforeUpload={() => false}
              accept=".pdf,.jpg,.png"
              maxCount={1}
            >
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
              style={{ marginLeft: 10 }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )} */}
        </div>
    );
};

export default Education;
