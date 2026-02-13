import React, { useState, useEffect } from "react";
import { Button, Modal, message, Select } from "antd"; // Added Select
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import AppTable from "../../../common/AppTable";

const CandidatesLeft = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
    });
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [eligibleFilter, setEligibleFilter] = useState("All");

    const { Option } = Select;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/candidate-left/?job_id=${selectedJob}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                const sortedData = result.sort(
                    (a, b) =>
                        new Date(a.joining_date) - new Date(b.joining_date),
                );
                setData(sortedData);
            }
        } catch (e) {
            message.error("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, selectedJob]);

    const handleConfirmReplacement = async () => {
        if (!confirmModal.record) return;
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/replacements/?candidate_id=${confirmModal.record.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Replacement request submitted successfully.");
                fetchData();
            }
        } catch (e) {
            message.error("Failed to submit replacement request.");
        } finally {
            setLoading(false);
        }

        setConfirmModal({ visible: false, record: null });
    };

    const columns = [
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            searchField: true,
        },
        {
            header: "Job Title",
            accessorKey: "job_title",
            searchField: true,
        },
        {
            header: "Joining Date",
            accessorKey: "joining_date",
            dateFilter: true,
        },
        {
            header: "Left Reason",
            accessorKey: "left_reason",
            searchField: true,
        },
        {
            header: "Left Date",
            accessorKey: "left_date",
            dateFilter: true,
        },
        {
            header: "Replacement Eligible",
            accessorKey: "is_replacement_eligible",
            cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
            dropdownFilter: true,
            dropdownOptions: [
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
            ],
            // Custom filter function to handle boolean/string mismatch if necessary
            // AppTable's generic filter might compare strings, so user string input "true"/"false" matches stringified bools
        },
        {
            header: "Actions",
            accessorKey: "actions",
            enableColumnFilter: false,
            cell: ({ row }) => {
                const record = row.original;
                return record.is_replacement_eligible ? (
                    record.replacement_status == "no" ? (
                        <Button
                            type="primary"
                            onClick={() =>
                                setConfirmModal({ visible: true, record })
                            }
                        >
                            Request Replacement
                        </Button>
                    ) : (
                        <span>{record.replacement_status}</span>
                    )
                ) : (
                    <span style={{ color: "gray" }}>Not Eligible</span>
                );
            },
        },
    ];

    const filteredData = (data || []).filter((item) => {
        if (eligibleFilter === "All") return true;
        const isEligible = item.is_replacement_eligible;
        if (eligibleFilter === "Yes") {
            return isEligible === true || isEligible === "true";
        }
        if (eligibleFilter === "No") {
            return (
                isEligible === false || isEligible === "false" || !isEligible
            );
        }
        return true;
    });

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-5">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-6">
                    <AppTable
                        columns={columns}
                        data={filteredData}
                        customFilters={
                            <Select
                                defaultValue="All"
                                style={{ width: 200 }}
                                onChange={(value) => setEligibleFilter(value)}
                                className="custom-filter-select"
                            >
                                <Option value="All">
                                    All Replacement Status
                                </Option>
                                <Option value="Yes">
                                    Replacement Eligible
                                </Option>
                                <Option value="No">Not Eligible</Option>
                            </Select>
                        }
                    />

                    {/* Confirmation Modal */}
                    <Modal
                        title="Confirm Replacement Request"
                        open={confirmModal.visible}
                        onOk={handleConfirmReplacement}
                        onCancel={() =>
                            setConfirmModal({
                                visible: false,
                                record: null,
                            })
                        }
                    >
                        <p>
                            Are you sure you want to request a replacement for{" "}
                            {confirmModal.record?.candidate_name}?
                        </p>
                    </Modal>
                </div>
            )}
        </Main>
    );
};

export default CandidatesLeft;
