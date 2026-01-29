import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { UploadOutlined } from "@ant-design/icons";
import { message, Form, Input, Button, Upload, Image } from "antd";
import dayjs from "dayjs";
import CustomDatePicker from "../../../common/CustomDatePicker";
import { a } from "framer-motion/client";

const CandidateDetails = () => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/profile/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Error ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                if (data.date_of_birth) {
                    data.date_of_birth = dayjs(
                        data.date_of_birth,
                        "YYYY-MM-DD"
                    );
                }
                setData(data);
            }
        } catch (e) {
            message.error(`Failed to fetch profile: ${e.message}`);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            for (const key in values) {
                if (key === "resume" && values[key]?.file) {
                    formData.append(key, values[key].file);
                } else if (key === "date_of_birth" && values[key] != null) {
                    formData.append(
                        key,
                        dayjs(values[key]).format("YYYY-MM-DD")
                    );
                } else if (values[key] != null) {
                    formData.append(key, values[key]);
                }
            }
            const response = await fetch(`${apiurl}/candidate/profile/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.error) {
                message.error("Error while submitting the file");
            } else if (data.message) {
                message.success(data.message); // Fixed incorrect key
            }
        } catch (e) {
            console.log(e);
            message.error("error occured"); // Improved error handling
        }
    };

    return (
        <div>
            {message && message.success && (
                <div className="text-green-600">{message.success}</div>
            )}
            {message && message.error && (
                <div className="text-red-500">{message.error}</div>
            )}
            {/* <h2>Basic Details</h2> */}
            {data && data.name && (
                <div className="block w-[95%] mx-auto p-5 rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] bg-white">
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        initialValues={{
                            ...data,
                            name: data?.name?.username,
                        }}
                        layout="vertical"
                    >
                        {!data?.resume && (
                            <Form.Item label="Resume" name="resume">
                                <Upload
                                    fileList={fileList}
                                    onChange={() => {
                                        setFileList();
                                    }}
                                    beforeUpload={() => false}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Upload Resume
                                    </Button>
                                </Upload>
                            </Form.Item>
                        )}
                        {data?.resume && (
                            <a
                                className="border-2 border-black p-1.5 rounded-md mb-2.5 inline-block text-black hover:text-blue-600 transition-colors"
                                href={`${apiurl}/${data.resume}`}
                                target="_blank"
                            >
                                Current Resume
                            </a>
                        )}
                        {data?.resume && (
                            <Form.Item label="Update Resume" name="resume">
                                <Upload
                                    fileList={fileList}
                                    onChange={() => {
                                        setFileList();
                                    }}
                                    beforeUpload={() => false} // Prevent automatic upload
                                    accept="image/*"
                                    maxCount={1} // Allow only a single file
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Update Resume
                                    </Button>
                                </Upload>
                            </Form.Item>
                        )}

                        <div className="flex justify-between gap-4 mb-4 flex-wrap md:flex-nowrap">
                            {/* First Name */}
                            <Form.Item shouldUpdate className="w-full">
                                {() => (
                                    <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] w-full">
                                        <label className="font-medium whitespace-nowrap min-w-max">
                                            First Name :
                                        </label>
                                        <Form.Item
                                            name="first_name"
                                            noStyle
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "First name is required",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                            {/* Middle Name */}
                            <Form.Item shouldUpdate className="w-full">
                                {() => (
                                    <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] w-full">
                                        <label className="font-medium whitespace-nowrap min-w-max">
                                            Middle Name :
                                        </label>
                                        <Form.Item
                                            name="middle_name"
                                            noStyle
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Middle name is required",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                            {/* Last Name */}
                            <Form.Item shouldUpdate className="w-full">
                                {() => (
                                    <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] w-full">
                                        <label className="font-medium whitespace-nowrap min-w-max">
                                            Last Name :
                                        </label>
                                        <Form.Item
                                            name="last_name"
                                            noStyle
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Last name is required",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-4">
                            {/* Name */}
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]">
                                        <label className="font-medium">
                                            Name:
                                        </label>
                                        <Form.Item name="name" noStyle>
                                            <Input
                                                disabled
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>

                            {/* Email */}
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]">
                                        <label className="font-medium">
                                            Email:
                                        </label>
                                        <Form.Item name="email" noStyle>
                                            <Input
                                                disabled
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                        {/* Communication Address */}
                        <Form.Item shouldUpdate>
                            {() => (
                                <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] mb-4">
                                    <label
                                        style={{ width: "180px" }}
                                        className="font-medium"
                                    >
                                        Communication Address
                                    </label>
                                    <Form.Item
                                        name="communication_address"
                                        noStyle
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Communication address is required",
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={2}
                                            style={{ flex: 1 }}
                                            className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none !resize-none"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.Item>
                        {/* Permanent Address */}
                        <Button
                            className="mb-5"
                            onClick={() => {
                                const communicationAddress = form.getFieldValue(
                                    "communication_address"
                                );
                                if (communicationAddress) {
                                    form.setFieldsValue({
                                        permanent_address: communicationAddress,
                                    });
                                } else {
                                    message.error(
                                        "Please fill the communication address first."
                                    );
                                }
                            }}
                        >
                            Same as communication address
                        </Button>
                        <Form.Item shouldUpdate>
                            {() => (
                                <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] mb-4">
                                    <label
                                        style={{ width: "180px" }}
                                        className="font-medium"
                                    >
                                        Permanent Address
                                    </label>
                                    <Form.Item
                                        name="permanent_address"
                                        noStyle
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Perminant address is required",
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={2}
                                            style={{ flex: 1 }}
                                            className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none !resize-none"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.Item>
                        {/* Phone Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-4">
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div
                                        //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                        className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]"
                                    >
                                        <label
                                            style={{ width: "180px" }}
                                            className="font-medium"
                                        >
                                            Phone Number
                                        </label>
                                        <Form.Item
                                            name="phone_num"
                                            noStyle
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Phone number is required",
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                            {/* Date of Birth */}
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div
                                        //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                        className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]"
                                    >
                                        <label
                                            style={{ width: "180px" }}
                                            className="font-medium"
                                        >
                                            Date of Birth
                                        </label>
                                        <Form.Item name="date_of_birth" noStyle>
                                            <CustomDatePicker
                                                format="YYYY-MM-DD"
                                                // style={{ flex: 1, width: "100%" }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none w-full"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-4">
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div
                                        //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                        className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]"
                                    >
                                        <label
                                            style={{ width: "180px" }}
                                            className="font-medium"
                                        >
                                            Blood Group
                                        </label>
                                        <Form.Item name="blood_group" noStyle>
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                            {/* Years of Experience */}
                            <Form.Item shouldUpdate>
                                {() => (
                                    <div
                                        //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                        className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px]"
                                    >
                                        <label
                                            style={{ width: "180px" }}
                                            className="font-medium"
                                        >
                                            Years of Experience
                                        </label>
                                        <Form.Item
                                            name="experience_years"
                                            noStyle
                                        >
                                            <Input
                                                style={{ flex: 1 }}
                                                className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                            />
                                        </Form.Item>
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                        {/* Designation */}
                        <Form.Item shouldUpdate>
                            {() => (
                                <div
                                    //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                    className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] mb-4"
                                >
                                    <label
                                        style={{ width: "180px" }}
                                        className="font-medium"
                                    >
                                        Designation
                                    </label>
                                    <Form.Item name="designation" noStyle>
                                        <Input
                                            style={{ flex: 1 }}
                                            className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.Item>
                        {/* Social Media Links */}
                        <Form.Item shouldUpdate>
                            {() => (
                                <div
                                    //   style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                    className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-lg p-[10px_15px] mb-4"
                                >
                                    <label
                                        style={{ width: "180px" }}
                                        className="font-medium"
                                    >
                                        LinkedIn Profile
                                    </label>
                                    <Form.Item
                                        name="linked_in"
                                        noStyle
                                        rules={[
                                            {
                                                type: "url",
                                                message:
                                                    "Please enter a valid URL",
                                            },
                                            {
                                                pattern:
                                                    /^(https?:\/\/)?(www\.)?linkedin\.com\/[a-zA-Z0-9_]+$/,
                                                message:
                                                    "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)",
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="https://linkedin.com/in/..."
                                            style={{ flex: 1 }}
                                            className="!border-none !m-0 !outline-none !bg-transparent !shadow-none focus:!shadow-none"
                                        />
                                    </Form.Item>
                                </div>
                            )}
                        </Form.Item>
                        {/* Skills */}
                        <Form.Item label="Skills" name="skills">
                            <Input.TextArea
                                rows={3}
                                placeholder="e.g., React, Django, Python"
                            />
                        </Form.Item>
                        {/* Submit Button */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default CandidateDetails;
