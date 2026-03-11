import React, { useState, useEffect } from "react";
import { Button, Modal, Input, notification, Tooltip, Tag } from "antd";
import {
    InfoCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleFilled,
    BankOutlined,
    EyeOutlined,
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
    const [viewRecord, setViewRecord] = useState(null);
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

    // Helper: normalize a value to string for comparison (handles number/string type mismatches)
    const isSame = (original, negotiated) => {
        if (original === null || original === undefined) return true;
        return String(original).trim() === String(negotiated).trim();
    };

    // Helper: format fee display
    const formatFee = (record) => {
        return record.service_fee_type === "percentage"
            ? `${record.service_fee}%`
            : `₹${record.service_fee}`;
    };

    const formatOriginalFee = (record) => {
        return record.service_fee_type === "percentage"
            ? `${record.original_terms?.service_fee}%`
            : `₹${record.original_terms?.service_fee}`;
    };

    const columns = [
        {
            accessorKey: "client_organization.client.username",
            header: "Client Name",
            width: 180,
            cell: ({ row }) => (
                <span className="font-bold text-[#071C50]">
                    {row.original.client_organization?.client?.username}
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
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "ctc_range",
            header: "CTC Range",
            width: 160,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.ctc_range;
                const neg = row.original.ctc_range;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`font-bold text-xs ${changed ? "text-red-600" : "text-blue-600"}`}
                        >
                            {neg}
                        </span>
                        {changed && orig && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {orig}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "service_fee",
            header: "Fee",
            width: 120,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.service_fee;
                const neg = row.original.service_fee;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`font-bold text-xs ${changed ? "text-red-600" : "text-gray-700"}`}
                        >
                            {formatFee(row.original)}
                        </span>
                        {changed && orig !== undefined && orig !== null && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {formatOriginalFee(row.original)}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "replacement_clause",
            header: "Replacement",
            width: 130,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.replacement_clause;
                const neg = row.original.replacement_clause;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`text-xs font-bold ${changed ? "text-red-500" : "text-gray-500"}`}
                        >
                            {neg} Days
                        </span>
                        {changed && orig !== undefined && orig !== null && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {orig} Days
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "invoice_after",
            header: "Invoice",
            width: 120,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.invoice_after;
                const neg = row.original.invoice_after;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`text-xs font-bold ${changed ? "text-red-500" : "text-gray-500"}`}
                        >
                            {neg} Days
                        </span>
                        {changed && orig !== undefined && orig !== null && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {orig} Days
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "payment_within",
            header: "Payment",
            width: 120,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.payment_within;
                const neg = row.original.payment_within;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`text-xs font-bold ${changed ? "text-red-500" : "text-gray-500"}`}
                        >
                            {neg} Days
                        </span>
                        {changed && orig !== undefined && orig !== null && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {orig} Days
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "interest_percentage",
            header: "Interest",
            width: 100,
            cell: ({ row }) => {
                const orig = row.original.original_terms?.interest_percentage;
                const neg = row.original.interest_percentage;
                const changed = !isSame(orig, neg);
                return (
                    <div className="flex flex-col gap-0.5">
                        <span
                            className={`font-bold text-xs ${changed ? "text-red-600" : "text-gray-500"}`}
                        >
                            {neg}%
                        </span>
                        {changed && orig !== undefined && orig !== null && (
                            <span className="text-[10px] text-gray-400 line-through">
                                {orig}%
                            </span>
                        )}
                    </div>
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
            width: 220,
            rightSticky: true,
            cell: ({ row }) => {
                const status = row.getValue("status");
                const record = row.original;

                if (status === "accepted") {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-2.5 py-1 rounded-lg w-fit">
                                <CheckCircleFilled /> Accepted
                            </div>
                            <Tooltip title="View Details">
                                <EyeOutlined
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 text-base"
                                    onClick={() => setViewRecord(record)}
                                />
                            </Tooltip>
                        </div>
                    );
                } else if (status === "rejected") {
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg w-fit">
                                <CloseCircleFilled /> Rejected
                            </div>
                            <Tooltip title="View Reason & Details">
                                <EyeOutlined
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 text-base"
                                    onClick={() => setViewRecord(record)}
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
                            <Tooltip title="View Details">
                                <EyeOutlined
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 text-base"
                                    onClick={() => setViewRecord(record)}
                                />
                            </Tooltip>
                        </div>
                    );
                }
            },
        },
    ];

    // Comparison rows for the detail modal
    const comparisonFields = (record) => [
        {
            label: "CTC Range",
            original: record.original_terms?.ctc_range,
            negotiated: record.ctc_range,
        },
        {
            label: "Service Fee",
            original:
                record.original_terms?.service_fee !== undefined
                    ? record.service_fee_type === "percentage"
                        ? `${record.original_terms.service_fee}%`
                        : `₹${record.original_terms.service_fee}`
                    : "-",
            negotiated: formatFee(record),
        },
        {
            label: "Replacement Clause",
            original:
                record.original_terms?.replacement_clause !== undefined
                    ? `${record.original_terms.replacement_clause} Days`
                    : "-",
            negotiated: `${record.replacement_clause} Days`,
        },
        {
            label: "Invoice After",
            original:
                record.original_terms?.invoice_after !== undefined
                    ? `${record.original_terms.invoice_after} Days`
                    : "-",
            negotiated: `${record.invoice_after} Days`,
        },
        {
            label: "Payment Within",
            original:
                record.original_terms?.payment_within !== undefined
                    ? `${record.original_terms.payment_within} Days`
                    : "-",
            negotiated: `${record.payment_within} Days`,
        },
        {
            label: "Interest %",
            original:
                record.original_terms?.interest_percentage !== undefined
                    ? `${record.original_terms.interest_percentage}%`
                    : "-",
            negotiated: `${record.interest_percentage}%`,
        },
    ];

    return (
        <Main defaultSelectedKey="6" defaultSelectedChildKey="6-1">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
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

            {/* Rejection Reason Modal */}
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

            {/* View Comparison Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#071C50]">
                            Negotiation Details
                        </span>
                        {viewRecord && (
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    viewRecord.status === "accepted"
                                        ? "bg-green-100 text-green-700"
                                        : viewRecord.status === "rejected"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {viewRecord.status?.charAt(0).toUpperCase() +
                                    viewRecord.status?.slice(1)}
                            </span>
                        )}
                    </div>
                }
                open={!!viewRecord}
                onCancel={() => setViewRecord(null)}
                footer={[
                    <button
                        key="close"
                        onClick={() => setViewRecord(null)}
                        className="bg-gray-100 text-gray-700 font-semibold text-sm px-5 py-1.5 rounded cursor-pointer hover:bg-gray-200"
                    >
                        Close
                    </button>,
                ]}
                width={600}
                className="premium-modal"
            >
                {viewRecord && (
                    <div className="py-2">
                        {/* Client info */}
                        <div className="mb-4 bg-blue-50 rounded-xl p-3 flex gap-3 items-center">
                            <BankOutlined className="text-blue-400 text-lg" />
                            <div>
                                <p className="font-bold text-[#071C50] text-sm">
                                    {
                                        viewRecord.client_organization?.client
                                            ?.username
                                    }
                                </p>
                                <p className="text-xs text-gray-500">
                                    {
                                        viewRecord.client_organization?.client
                                            ?.name_of_organization
                                    }
                                </p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                    Requested
                                </p>
                                <p className="text-xs text-gray-600 font-medium">
                                    {new Date(
                                        viewRecord.requested_date,
                                    ).toLocaleDateString()}{" "}
                                    {new Date(
                                        viewRecord.requested_date,
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase py-2 px-3 border border-gray-100">
                                        Field
                                    </th>
                                    <th className="text-center text-xs font-semibold text-gray-500 uppercase py-2 px-3 border border-gray-100">
                                        Original
                                    </th>
                                    <th className="text-center text-xs font-semibold text-gray-500 uppercase py-2 px-3 border border-gray-100">
                                        Negotiated
                                    </th>
                                    <th className="text-center text-xs font-semibold text-gray-500 uppercase py-2 px-3 border border-gray-100">
                                        Changed
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFields(viewRecord).map((row, i) => {
                                    const changed = !isSame(
                                        row.original === "-"
                                            ? row.negotiated
                                            : row.original,
                                        row.negotiated,
                                    );
                                    return (
                                        <tr
                                            key={i}
                                            className={`${changed ? "bg-red-50" : "bg-white"} hover:bg-gray-50 transition`}
                                        >
                                            <td className="py-2 px-3 border border-gray-100 font-medium text-gray-700 text-xs">
                                                {row.label}
                                            </td>
                                            <td className="py-2 px-3 border border-gray-100 text-center text-gray-500 text-xs">
                                                {row.original ?? "-"}
                                            </td>
                                            <td
                                                className={`py-2 px-3 border border-gray-100 text-center font-bold text-xs ${changed ? "text-red-600" : "text-green-700"}`}
                                            >
                                                {row.negotiated ?? "-"}
                                            </td>
                                            <td className="py-2 px-3 border border-gray-100 text-center">
                                                {changed ? (
                                                    <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                                                        Changed
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">
                                                        Same
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Description / Reason */}
                        {viewRecord.description && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Client Note
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 italic border border-gray-100">
                                    "{viewRecord.description}"
                                </div>
                            </div>
                        )}
                        {viewRecord.status === "rejected" &&
                            viewRecord.reason && (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                        Rejection Reason
                                    </p>
                                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-600 italic border border-red-100">
                                        "{viewRecord.reason}"
                                    </div>
                                </div>
                            )}
                        {viewRecord.status === "accepted" &&
                            viewRecord.accepted_date && (
                                <div className="mt-3 text-right">
                                    <span className="text-[10px] text-gray-400">
                                        Accepted on{" "}
                                        {new Date(
                                            viewRecord.accepted_date,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            )}
                    </div>
                )}
            </Modal>
        </Main>
    );
};

export default SeeNegotiations;
