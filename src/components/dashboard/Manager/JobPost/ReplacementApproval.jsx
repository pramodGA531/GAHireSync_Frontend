import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";
import { Button, Modal, Input, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import Main from "../Layout";

const ReplacementApproval = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectingRequest, setRejectingRequest] = useState(null);
    const [feedback, setFeedback] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/replacement-requests/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const res = await response.json();
            if (response.ok) {
                setData(res);
            } else {
                message.error(
                    res.error || "Failed to fetch replacement requests",
                );
            }
        } catch (error) {
            message.error("Failed to fetch replacement requests");
        }
        setLoading(false);
    };

    const handleAction = async (replacementId, action, reason = "") => {
        try {
            const response = await fetch(
                `${apiurl}/manager/replacement-action/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        replacement_id: replacementId,
                        action,
                        reason,
                    }),
                },
            );
            if (response.ok) {
                message.success(`Replacement request ${action}ed successfully`);
                if (action === "reject") {
                    setRejectingRequest(null);
                    setFeedback("");
                }
                fetchData();
            } else {
                const res = await response.json();
                message.error(
                    res.error || `Error ${action}ing replacement request`,
                );
            }
        } catch (err) {
            message.error(`Error ${action}ing replacement request`);
        }
    };

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Title",
            searchField: true,
        },
        {
            accessorKey: "organization_name",
            header: "Client Org",
            searchField: true,
        },
        {
            accessorKey: "candidate_name",
            header: "Candidate to Replace",
            searchField: true,
        },
        {
            accessorKey: "agreed_ctc",
            header: "Agreed CTC",
        },
        {
            accessorKey: "joining_date",
            header: "Joining Date",
        },
        {
            header: "Actions",
            accessorKey: "replacement_id",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            type="text"
                            icon={<CheckOutlined className="text-[#10B981]" />}
                            onClick={() =>
                                handleAction(item.replacement_id, "accept")
                            }
                            title="Accept Request"
                        />
                        <Button
                            type="text"
                            icon={<CloseOutlined className="text-[#EF4444]" />}
                            onClick={() => setRejectingRequest(item)}
                            title="Reject Request"
                        />
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-4">
            <AppTable
                title="Replacement Approval Requests"
                columns={columns}
                data={data}
                loading={loading}
            />

            <Modal
                title="Reject Replacement Request"
                open={!!rejectingRequest}
                onOk={() =>
                    handleAction(
                        rejectingRequest.replacement_id,
                        "reject",
                        feedback,
                    )
                }
                onCancel={() => {
                    setRejectingRequest(null);
                    setFeedback("");
                }}
                okText="Submit"
                okButtonProps={{ disabled: !feedback.trim() }}
            >
                <p>Please provide a reason for rejection:</p>
                <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter rejection reason..."
                />
            </Modal>
        </Main>
    );
};

export default ReplacementApproval;
