import React, { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth"; // Assuming this is the hook that provides auth details
import { Form, Input, Button, Spin, message } from "antd"; // Import Ant Design components
// import './ClientInfo.css'
import Btnloading from "../../../common/loading/Btnloading";
const ClientInfo = () => {
    const [clientData, setClientData] = useState(null); // State to hold fetched data
    const [loading, setLoading] = useState(false); // Loading state for fetching data
    const { token, apiurl } = useAuth(); // Assuming the token is provided by the useAuth hook

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = () => {
        setLoading(true);
        fetch(`${apiurl}/client/information/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch information. Status: ${response.status}`
                    );
                }
                return response.json();
            })
            .then((data) => {
                setClientData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching information:", error);
                message.error("Error fetching data!");
                setLoading(false); // Stop loading
            });
    };

    const handleSubmit = (values) => {
        setLoading(true); // Start loading

        // Prepare the data to be sent in the request
        const updatedValues = {
            user_id: values.user_id, // Ensure this matches what the backend expects
            email: values.email,
            username: values.username,
            password: values.password, // Only send if password is being changed
            name_of_organization: values.name_of_organization,
            designation: values.designation,
            contact_number: values.contact_number,
            website_url: values.website_url,
            gst: values.gst,
            company_pan: values.company_pan,
            company_address: values.company_address,
            about: values.about,
        };

        // Call your API to update the client data
        fetch(`${apiurl}/client/information/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Make sure token is available
            },
            body: JSON.stringify(updatedValues), // Send form values in the request body
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(
                            error.error || "Failed to update information"
                        );
                    });
                }
                return response.json();
            })
            .then((data) => {
                message.success("Client information updated successfully!"); // Success message
                setLoading(false); // Stop loading
            })
            .catch((error) => {
                console.error("Error updating information:", error);
                message.error(error.message || "Error updating data!"); // Display error message
                setLoading(false); // Stop loading
            });
    };

    // if (loading) {
    //   return <Spin size="large" />; // Show a spinner while data is being fetched
    // }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
            {clientData ? (
                <Form
                    initialValues={{
                        company_address:
                            clientData?.client_details?.company_address,
                        contact_number:
                            clientData?.client_details?.contact_number,
                        designation: clientData?.client_details?.designation,
                        username: clientData?.client_details?.username,
                        website_url: clientData?.client_details?.website_url,
                        email: clientData?.user?.email,
                        about: clientData?.client_details?.about,
                    }}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="bg-white rounded-xl shadow-md max-w-4xl mx-auto border border-gray-100"
                    style={{ padding: "2rem" }}
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                        Organization Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Contact Number
                                </span>
                            }
                            name="contact_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input contact number!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Designation
                                </span>
                            }
                            name="designation"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input designation!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Username
                                </span>
                            }
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input username!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Website URL
                                </span>
                            }
                            name="website_url"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input website URL!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Email
                                </span>
                            }
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input email!",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="font-medium text-gray-700">
                                    Company Address
                                </span>
                            }
                            name="company_address"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input company address!",
                                },
                            ]}
                        >
                            <Input className="h-11 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={
                            <span className="font-medium text-gray-700">
                                About
                            </span>
                        }
                        name="about"
                    >
                        <Input.TextArea
                            placeholder="Write about your organization..."
                            className="min-h-[120px] resize-none rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:shadow-sm transition-all p-3"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="h-11 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md font-medium text-sm w-full md:w-auto"
                        >
                            Update Information
                            {loading ? (
                                <Btnloading
                                    spincolor={"white-spinner"}
                                ></Btnloading>
                            ) : (
                                ""
                            )}
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>No client data available.</p> // Display message if no client data is fetched
            )}
        </div>
    );
};

export default ClientInfo;
