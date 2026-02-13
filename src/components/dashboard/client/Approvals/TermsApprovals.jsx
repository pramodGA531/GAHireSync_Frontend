import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { Table, Tooltip, Modal, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import AppTable from "../../../common/AppTable";
import GoBack from "../../../common/Goback";

const { Option } = Select;

const TermsApprovals = () => {
    const { token, apiurl } = useAuth();
    const [loading, setLoading] = useState(false);
    const [negotiations, setNegotiations] = useState([]); // Initialize as empty array
    const [statusFilter, setStatusFilter] = useState("All");

    const updateState = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: ["accept_terms", "reject_terms"],
                    }),
                },
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchNegotiations = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/client/negotiations/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setNegotiations(data.negotiations || []); // Ensure array
        } catch (error) {
            console.error("Error fetching negotiation requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNegotiations();
        updateState();
    }, []);

    const columns = [
        {
            accessorKey: "organization_name",
            header: "Organization Name",
            searchField: true,
        },
        {
            accessorKey: "service_fee",
            header: "Service Fee",
            cell: ({ row }) => {
                const record = row.original;
                return record.service_fee_type === "percentage"
                    ? `${record.service_fee}%`
                    : `₹${record.service_fee}`;
            },
        },
        {
            accessorKey: "replacement_clause",
            header: "Replacement Clause (days)",
        },
        {
            accessorKey: "invoice_after",
            header: "Invoice After (days)",
        },
        {
            accessorKey: "payment_within",
            header: "Payment Within (days)",
        },
        {
            accessorKey: "interest_percentage",
            header: "Interest Percentage",
            cell: ({ getValue }) => (getValue() ? `${getValue()}%` : "0%"),
        },
        {
            accessorKey: "requested_date",
            header: "Requested Date",
            dateFilter: true,
            cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
        },
        {
            accessorKey: "status",
            header: "Status",
            rightSticky: true,
            cell: ({ row }) => {
                const status = row.original.status;
                const reason = row.original.reason;

                if (status === "rejected") {
                    return (
                        <>
                            <span style={{ marginRight: 8 }}>Rejected</span>
                            <Tooltip title="View Rejection Reason">
                                <InfoCircleOutlined
                                    style={{
                                        color: "#faad14",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        Modal.info({
                                            title: "Rejection Reason",
                                            content:
                                                reason || "No reason provided.",
                                            okText: "Close",
                                        });
                                    }}
                                />
                            </Tooltip>
                        </>
                    );
                }
                return <>{status}</>;
            },
        },
    ];

    const filteredData = negotiations.filter((item) => {
        if (statusFilter === "All") return true;
        // Case-insensitive comparison just in case
        return item.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    return (
        <Main defaultSelectedKey="7" defaultSelectedChildKey="7-2">
            {loading ? (
                <Pageloading />
            ) : (
                <div>
                    {/* <div className="mt-2 -ml-4">
                        {" "}
                        <GoBack />
                    </div> */}
                    <AppTable
                        columns={columns}
                        data={filteredData}
                        rowKey="id"
                        customFilters={
                            <Select
                                defaultValue="All"
                                style={{ width: 150 }}
                                onChange={(value) => setStatusFilter(value)}
                                className="custom-filter-select"
                            >
                                <Option value="All">All Status</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="accepted">Accepted</Option>
                                <Option value="rejected">Rejected</Option>
                            </Select>
                        }
                    />
                </div>
            )}
        </Main>
    );
};

export default TermsApprovals;
