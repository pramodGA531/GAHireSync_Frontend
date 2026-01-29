import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Button, Form, Input, Upload, Image, Modal } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

const Certificates = () => {
    const [data, setData] = useState();
    const { apiurl, token } = useAuth();
    const [add, setAdd] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async (values) => {
        try {
            const response = await fetch(`${apiurl}/candidate/certificates/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                message.error("Not able to fetch data");
            }
            const data = await response.json();
            if (data.error) {
                return message.error(data.error);
            }
            if (data.message) {
                message.warning(data.message);
            }
            setData(data);
        } catch (e) {
            message.error("unable to fetch the certificates");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleAdd = async (values) => {
        const formData = new FormData();
        formData.append("certificate_name", values.certificate_name);
        formData.append(
            "certificate_image",
            values.certificate_image[0].originFileObj
        );

        try {
            const response = await fetch(`${apiurl}/candidate/certificates/`, {
                method: "POST", // Use POST for adding new data
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                message.error("Failed to add certificate");
                return;
            }

            const result = await response.json();
            if (result.error) {
                return message.error(result.error);
            }

            message.success("Certificate added successfully");
            setAdd(false);
            fetchData();
        } catch (e) {
            message.error("Unable to add certificate");
        }
    };

    const handleRemove = async (certificateId) => {
        try {
            const response = await fetch(
                `${apiurl}/candidate/certificates/?id=${certificateId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                message.error("Failed to remove certificate");
                return;
            }

            message.success("Certificate removed successfully");
            fetchData(); // Refresh the list of certificates
        } catch (e) {
            message.error("Unable to remove certificate");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mx-auto w-[95%]">
                <h2 className="text-xl font-semibold">Certificates</h2>
                <Button
                    type="primary"
                    onClick={() => {
                        setAdd(true);
                    }}
                >
                    Add Certificate <PlusSquareOutlined />{" "}
                </Button>
            </div>

            <div className="mt-5 w-[95%] mx-auto">
                {data && data.length > 0 ? (
                    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {data.map((item) => (
                            <li
                                className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white"
                                key={item.id}
                            >
                                <strong className="text-lg">
                                    {item.certificate_name}
                                </strong>
                                <Image
                                    className="h-[188px] w-[163px] object-cover rounded-md"
                                    src={`${apiurl}${item.certificate_image}/`}
                                ></Image>
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => handleRemove(item.id)}
                                >
                                    Remove
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">
                        No certificates available
                    </p>
                )}
            </div>
            <Modal
                title="Add Certificate"
                open={add}
                onCancel={() => setAdd(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAdd} layout="vertical">
                    <Form.Item
                        label="Certificate Name"
                        name="certificate_name"
                        rules={[
                            {
                                required: true,
                                message: "Please provide the certificate name",
                            },
                        ]}
                    >
                        <Input className="rounded-md" />
                    </Form.Item>

                    <Form.Item
                        label="Add Certificate Image"
                        name="certificate_image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                        rules={[
                            {
                                required: true,
                                message: "Please upload a certificate image",
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false} // Prevent auto upload
                            accept="image/*"
                            maxCount={1} // Allow only one file
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
        </div>
    );
};

export default Certificates;
