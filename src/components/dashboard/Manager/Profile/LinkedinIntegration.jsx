import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Button } from "antd";
import { LinkedinOutlined, CheckCircleFilled } from "@ant-design/icons";

const LinkedinIntegration = () => {
    const [loading, setLoading] = useState(false);
    const { apiurl, token } = useAuth();
    const [isVerified, setIsVerified] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${apiurl}/manager/is_linkedin_verified/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
            } else {
                setIsVerified(data.status);
                if (data.expired && data.auth_url) {
                    message.warning(
                        "LinkedIn token expired. Redirecting to re-authenticate..."
                    );
                    window.location.href = data.auth_url;
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/is_linkedin_verified/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                message.success(
                    data.message || "LinkedIn connected successfully!"
                );
                if (data.url) {
                    window.location.href = data.url;
                }
            }
        } catch (e) {
            console.error(e);
            message.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12">
            <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 bg-blue-50 text-[#0077B5] rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm border border-blue-100">
                    <LinkedinOutlined />
                </div>
                <h2 className="text-2xl font-bold text-[#071C50] mb-2">
                    LinkedIn Integration
                </h2>
                <p className="text-gray-500 mb-8 px-4">
                    Connect your agency's LinkedIn profile to post jobs directly
                    and manage candidate interactions.
                </p>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    {isVerified ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-6 py-3 rounded-xl border border-green-100">
                                <CheckCircleFilled className="text-xl" />
                                LinkedIn Connected
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Your LinkedIn account is synchronized with
                                HireSync.
                            </p>
                        </div>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            loading={loading}
                            className="h-12 px-8 bg-[#0077B5] hover:bg-[#005E93] text-white border-none font-bold rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mx-auto"
                        >
                            <LinkedinOutlined className="text-lg" />
                            Connect LinkedIn Profile
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkedinIntegration;
