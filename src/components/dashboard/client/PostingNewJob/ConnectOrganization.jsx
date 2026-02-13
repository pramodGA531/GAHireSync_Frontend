// ConnectOrganization.tsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Input, Button, Spin, Empty } from "antd";
import { Modal } from "antd";

const ConnectOrganization = ({ setCurrentStep, setConnectionId }) => {
    const [organizationList, setOrganizationlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jobCode, setJobCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { apiurl, token } = useAuth();

    const sentMailOrgIds = useRef(new Set());

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/connected-organizations/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setOrganizationlist(data.data);
        } catch (e) {
            console.log(e);
            message.error("Failed to fetch organizations.");
        } finally {
            setLoading(false);
        }
    };

    const sendMail = async (org_id) => {
        try {
            if (sentMailOrgIds.current.has(org_id)) {
                console.log("Mail already sent for this org.");
                return;
            }

            const response = await fetch(
                `${apiurl}/send-upgrade-mail/?org_id=${org_id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Optional if your API requires auth
                    },
                }
            );
            sentMailOrgIds.current.add(org_id);
            console.log("Upgrade request email sent.");
        } catch (e) {
            console.error("Failed to send email:", e);
        }
    };

    const handleAddConnection = async () => {
        if (!jobCode.trim()) {
            return message.warning("Please enter a job code");
        }
        setSubmitting(true);
        try {
            const response = await fetch(`${apiurl}/client/add-organization/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: jobCode }),
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                message.success("Organization connected successfully");
                setJobCode("");
                fetchData();
            }
        } catch (e) {
            console.log(e);
            message.error("Failed to connect organization.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddJobPost = (connection_id, can_add_new, organization_id) => {
        // if (can_add_new) {
            setCurrentStep(2);
            setConnectionId(connection_id);
        // } else {
        //     Modal.warning({
        //         title: "Job Post Limit Reached",
        //         content:
        //             "To add job post, please contact your Talent Acquisition partner or upgrade your plan.",
        //         centered: true,
        //         okText: "Okay",
        //     });

        //     sendMail(organization_id);
        // }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <div className="p-5">
            {/* <h2 className="text-2xl font-bold mb-2">Connect Organization</h2>
            <p className="mb-5 text-[#666]">These are the organizations you're connected to:</p> */}

            {loading ? (
                <Spin size="large" />
            ) : organizationList?.length > 0 ? (
                <div className="flex flex-wrap gap-4 mb-8">
                    {organizationList.map((org) => (
                        <div
                            key={org.id}
                            className="bg-[#f9f9f9] p-4 lg:p-5 flex flex-col gap-2.5 border border-[#ddd] rounded-lg flex-[1_1_250px] min-w-[250px] max-w-[300px] shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-[#333]">
                                {org.organization}
                            </h3>
                            <div className="text-sm text-[#333] flex items-center flex-row gap-2.5">
                                <strong>Manager:</strong> {org.manager}
                            </div>
                            <div className="text-sm text-[#333] flex items-center flex-row gap-2.5">
                                <strong>Email:</strong> {org.manager_email}
                            </div>
                            <div className="text-sm text-[#333] flex items-center flex-row gap-2.5">
                                <strong>Organization Code:</strong>{" "}
                                {org.organization_code}
                            </div>
                            <div className="text-sm text-[#333] flex items-center flex-row gap-2.5">
                                <strong>Approval Status:</strong>
                                <div
                                    className={`${
                                        org.approval_status === "accepted"
                                            ? "text-green-600 bg-[#EEFDF3]"
                                            : "text-yellow-600 bg-[#FEF9EE]"
                                    } px-2 py-0.5 rounded`}
                                >
                                    {org.approval_status}
                                </div>
                            </div>
                            <Button
                                className="w-[200px] p-2.5 h-auto text-sm"
                                disabled={org.approval_status !== "accepted"}
                                onClick={() =>
                                    handleAddJobPost(
                                        org.id,
                                        org.can_add_new,
                                        org.organization_id
                                    )
                                }
                            >
                                Add Job Post
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description="No organizations connected." />
            )}

            <div className="max-w-[400px] text-[#333]">
                <h3 className="text-lg font-bold mb-2">
                    Connect with Agency Code
                </h3>
                <div className="flex gap-2.5 mt-3">
                    <Input
                        placeholder="Enter Agency Code"
                        value={jobCode}
                        onChange={(e) => setJobCode(e.target.value)}
                    />
                    <Button
                        type="primary"
                        onClick={handleAddConnection}
                        loading={submitting}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConnectOrganization;
