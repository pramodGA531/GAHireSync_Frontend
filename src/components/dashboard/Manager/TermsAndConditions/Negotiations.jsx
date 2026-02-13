import React, { useState, useEffect } from "react";
import { Button, Modal, Input, notification, Tooltip, Tag } from "antd";
import {
    InfoCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleFilled,
    BankOutlined,
} from "@ant-design/icons";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import NoDataFound from "../../../../images/Illustrations/NoDataFound-2.png";
import Btnloading from "../../../common/loading/Btnloading";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import GoBack from "../../../common/Goback";

const SeeNegotiations = () => {
    const [data, setData] = useState([]);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [btnloading, setBtnLoading] = useState(false);

    const updateState = async () => {
        try {
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: "negotiated_terms",
                    }),
                },
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        if (token) {
            updateState();
            fetchNegotiations();
        }
    }, []);

    const fetchNegotiations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/negotiate-terms/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching negotiation requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = (record) => {
        Modal.confirm({
            title: <span className="font-bold">Accept Negotiation</span>,
            content:
                "Are you sure you want to accept this negotiation? The updated terms will be applied immediately.",
            okText: "Accept",
            okButtonProps: { className: "bg-green-600 hover:bg-green-700" },
            onOk: async () => {
                try {
                    setBtnLoading(true);
                    const response = await fetch(`${apiurl}/negotiate-terms/`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            status: "accepted",
                            id: record.id,
                        }),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to accept negotiation");
                    }
                    notification.success({
                        message: "Negotiation accepted successfully!",
                        icon: <CheckCircleFilled className="text-green-500" />,
                    });
                    fetchNegotiations();
                } catch (error) {
                    notification.error({
                        message: "Error accepting negotiation",
                    });
                    console.error(error);
                } finally {
                    setBtnLoading(false);
                }
            },
        });
    };

    const handleReject = (record) => {
        setSelectedRecord(record);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason) {
            notification.warning({
                message: "Please provide a reason for rejection.",
            });
            return;
        }

        try {
            setBtnLoading(true);
            const response = await fetch(`${apiurl}/negotiate-terms/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: "rejected",
                    id: selectedRecord.id,
                    reason: rejectReason,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to reject negotiation");
            }
            notification.success({
                message: "Negotiation rejected successfully!",
                icon: <CloseCircleFilled className="text-red-500" />,
            });
            setRejectReason("");
            setSelectedRecord(null);
            fetchNegotiations();
        } catch (error) {
            notification.error({ message: "Error rejecting negotiation" });
            console.error(error);
        } finally {
            setBtnLoading(false);
        }
    };

    const handleRejectReasonChange = (e) => {
        setRejectReason(e.target.value);
    };

    const columns = [
        {
            accessorKey: "client_organization.client.username",
            header: "Client Name",
            width: 180,
            cell: ({ row }) => (
                <span className="font-bold text-[#071C50]">
                    {row.original.client_organization?.client?.username}
                    {/* {row.getValue("client_organization.client.username")} */}
                </span>
            ),
        },
        {
            accessorKey: "client_organization.client.name_of_organization",
            header: "Organization",
            width: 220,
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <BankOutlined className="text-gray-400" />
                    <span className="text-sm">
                        {
                            row.original.client_organization?.client
                                ?.name_of_organization
                        }
                        {/* {row.getValue(
                            "client_organization.client.name_of_organization"
                        )} */}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "ctc_range",
            header: "CTC Range",
            width: 120,
            cell: ({ row }) => {
                const isChanged =
                    row.original.original_terms?.ctc_range !==
                    row.original.ctc_range;
                return (
                    <span
                        className={`font-bold ${
                            isChanged
                                ? "text-red-600 underline"
                                : "text-blue-600"
                        }`}
                    >
                        {row.getValue("ctc_range")}
                    </span>
                );
            },
        },
        {
            accessorKey: "service_fee",
            header: "Fee",
            width: 100,
            cell: ({ row }) => {
                const isChanged =
                    Number(row.original.original_terms?.service_fee) !==
                    Number(row.original.service_fee);
                return (
                    <span
                        className={`font-bold ${
                            isChanged
                                ? "text-red-600 underline"
                                : "text-gray-700"
                        }`}
                    >
                        {row.original.service_fee_type === "percentage"
                            ? `${row.getValue("service_fee")}%`
                            : `₹${row.getValue("service_fee")}`}
                    </span>
                );
            },
        },
        {
            accessorKey: "replacement_clause",
            header: "Replacement",
            width: 120,
            cell: ({ row }) => {
                const isChanged =
                    row.original.original_terms?.replacement_clause !==
                    row.original.replacement_clause;
                return (
                    <span
                        className={`text-xs ${
                            isChanged
                                ? "text-red-500 font-bold underline"
                                : "text-gray-500"
                        }`}
                    >
                        {row.getValue("replacement_clause")} Days
                    </span>
                );
            },
        },
        {
            accessorKey: "invoice_after",
            header: "Invoice",
            width: 120,
            cell: ({ row }) => {
                const isChanged =
                    row.original.original_terms?.invoice_after !==
                    row.original.invoice_after;
                return (
                    <span
                        className={`text-xs ${
                            isChanged
                                ? "text-red-500 font-bold underline"
                                : "text-gray-500"
                        }`}
                    >
                        {row.getValue("invoice_after")} Days
                    </span>
                );
            },
        },
        {
            accessorKey: "payment_within",
            header: "Payment",
            width: 120,
            cell: ({ row }) => {
                const isChanged =
                    row.original.original_terms?.payment_within !==
                    row.original.payment_within;
                return (
                    <span
                        className={`text-xs ${
                            isChanged
                                ? "text-red-500 font-bold underline"
                                : "text-gray-500"
                        }`}
                    >
                        {row.getValue("payment_within")} Days
                    </span>
                );
            },
        },
        {
            accessorKey: "interest_percentage",
            header: "Interest",
            width: 100,
            cell: ({ row }) => {
                const isChanged =
                    Number(row.original.original_terms?.interest_percentage) !==
                    Number(row.original.interest_percentage);
                return (
                    <span
                        className={`font-bold ${
                            isChanged
                                ? "text-red-600 underline"
                                : "text-gray-500"
                        }`}
                    >
                        {row.getValue("interest_percentage")}%
                    </span>
                );
            },
        },
        {
            accessorKey: "requested_date",
            header: "Requested",
            width: 180,
            cell: ({ row }) => (
                <div className="flex flex-col text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>
                        {new Date(
                            row.getValue("requested_date"),
                        ).toLocaleDateString()}
                    </span>
                    <span>
                        {new Date(
                            row.getValue("requested_date"),
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Action / Status",
            width: 200,
            rightSticky: true,
            cell: ({ row }) => {
                const status = row.getValue("status");
                const record = row.original;

                if (status === "accepted") {
                    return (
                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-2.5 py-1 rounded-lg w-fit">
                            <CheckCircleFilled /> Accepted
                        </div>
                    );
                } else if (status === "rejected") {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg w-fit">
                                <CloseCircleFilled /> Rejected
                            </div>
                            <Tooltip title="View Reason">
                                <InfoCircleOutlined
                                    className="text-amber-500 cursor-pointer hover:text-amber-600 text-lg"
                                    onClick={() => {
                                        Modal.info({
                                            title: (
                                                <span className="font-bold">
                                                    Rejection Reason
                                                </span>
                                            ),
                                            content: (
                                                <div className="py-4 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                                    "
                                                    {record.reason ||
                                                        "No reason provided."}
                                                    "
                                                </div>
                                            ),
                                            okText: "Close",
                                        });
                                    }}
                                />
                            </Tooltip>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                className="bg-green-600 text-white border-none font-bold text-[10px] px-3 h-7 cursor-pointer rounded hover:bg-green-700"
                                onClick={() => handleAccept(record)}
                            >
                                Accept
                            </button>
                            <button
                                className="bg-red-600 text-white border-none font-bold text-[10px] px-3 h-7 cursor-pointer rounded hover:bg-red-700"
                                onClick={() => handleReject(record)}
                            >
                                Reject
                            </button>
                        </div>
                    );
                }
            },
        },
    ];

    return (
        <Main defaultSelectedKey="6" defaultSelectedChildKey="6-1">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                {/* <div className="-ml-6 -mt-2">
                    <GoBack />
                </div> */}
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#071C50]">
                            Negotiation Requests
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Review and respond to client requests for updated
                            service terms and pricing.
                        </p>
                    </div>

                    {loading ? (
                        <Pageloading />
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                            {data && data.length > 0 ? (
                                <AppTable
                                    columns={columns}
                                    data={data}
                                    rowKey="id"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 text-center">
                                    <img
                                        src={NoDataFound}
                                        alt="No Data"
                                        className="w-64 opacity-50 mb-6"
                                    />
                                    <h3 className="text-lg font-bold text-gray-400">
                                        No Pending Requests
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        You're all caught up! No negotiations
                                        are waiting for your response.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title={<span className="font-bold">Rejection Reason</span>}
                open={!!selectedRecord}
                onCancel={() => {
                    setSelectedRecord(null);
                    setRejectReason("");
                }}
                onOk={handleRejectSubmit}
                okText="Submit Rejection"
                confirmLoading={btnloading}
                okButtonProps={{
                    danger: true,
                    disabled: !rejectReason.trim(),
                    className: "bg-red-600 hover:bg-red-700",
                }}
                className="premium-modal"
            >
                <div className="py-4">
                    <p className="text-xs text-gray-500 mb-3 font-medium">
                        Please explain why the requested terms are not
                        acceptable. This message will be sent to the client.
                    </p>
                    {btnloading ? (
                        <div className="flex justify-center py-6">
                            <Btnloading spincolor="blue-spinner" />
                        </div>
                    ) : (
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter reason for rejection..."
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={rejectReason}
                            onChange={handleRejectReasonChange}
                        />
                    )}
                </div>
            </Modal>
        </Main>
    );
};

export default SeeNegotiations;
