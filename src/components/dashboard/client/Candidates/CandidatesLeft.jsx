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
        step: 1, // 1: Confirmation, 2: Select On-Hold
    });
    const [onHoldCandidates, setOnHoldCandidates] = useState([]);
    const [selectedHoldCandidates, setSelectedHoldCandidates] = useState([]);
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

    const fetchOnHoldCandidates = async (jobId) => {
        try {
            // setLoading(true); // Don't block main UI, maybe local loading for modal?
            const response = await fetch(
                `${apiurl}/client/on-hold/?job_id=${jobId}`,
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
                return [];
            } else {
                return result;
            }
        } catch (e) {
            message.error("Failed to fetch on-hold candidates.");
            return [];
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, selectedJob]);

    const openReplacementModal = (record) => {
        setConfirmModal({ visible: true, record, step: 1 });
        setSelectedHoldCandidates([]);
        setOnHoldCandidates([]);
    };

    const handleProceedToOnHold = async () => {
        if (!confirmModal.record) return;

        let jobIdToUse = confirmModal.record.job_id;

        if (!jobIdToUse) {
            jobIdToUse = selectedJob;
        }

        if (!jobIdToUse) {
            message.error("Job ID not found for this candidate.");
            return;
        }

        const candidates = await fetchOnHoldCandidates(jobIdToUse);
        setOnHoldCandidates(candidates);
        setConfirmModal((prev) => ({ ...prev, step: 2 }));
    };

    const handleSubmitReplacement = async () => {
        if (!confirmModal.record) return;
        try {
            setLoading(true);
            const body = {
                suggested_candidates: selectedHoldCandidates,
            };

            const response = await fetch(
                `${apiurl}/client/replacements/?candidate_id=${confirmModal.record.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                },
            );

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Replacement request submitted successfully.");
                fetchData();
                setConfirmModal({ visible: false, record: null, step: 1 });
            }
        } catch (e) {
            message.error("Failed to submit replacement request.");
        } finally {
            setLoading(false);
        }
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
                            onClick={() => openReplacementModal(record)}
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
                        onCancel={() =>
                            setConfirmModal({
                                visible: false,
                                record: null,
                                step: 1,
                            })
                        }
                        footer={null}
                    >
                        {confirmModal.step === 1 && (
                            <div className="flex flex-col gap-4">
                                <p>
                                    Your request will be processed by the
                                    manager. Do you want to proceed with the ON
                                    HOLD candidates?
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={handleSubmitReplacement} // "No" means just submit request without candidates
                                    >
                                        No, Just Request
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleProceedToOnHold}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {confirmModal.step === 2 && (
                            <div className="flex flex-col gap-4">
                                <p>Select candidates to suggest:</p>
                                <div className="max-h-60 overflow-y-auto border p-2 rounded">
                                    {onHoldCandidates.length > 0 ? (
                                        onHoldCandidates.map((cand) => (
                                            <div
                                                key={cand.application_id}
                                                className="flex items-center gap-2 py-1"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`cand-${cand.application_id}`}
                                                    checked={selectedHoldCandidates.includes(
                                                        cand.application_id,
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedHoldCandidates(
                                                                [
                                                                    ...selectedHoldCandidates,
                                                                    cand.application_id,
                                                                ],
                                                            );
                                                        } else {
                                                            setSelectedHoldCandidates(
                                                                selectedHoldCandidates.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        cand.application_id,
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`cand-${cand.application_id}`}
                                                >
                                                    {cand.candidate_name}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No on-hold candidates found.</p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() =>
                                            setConfirmModal((prev) => ({
                                                ...prev,
                                                step: 1,
                                            }))
                                        }
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleSubmitReplacement}
                                    >
                                        Send Request
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            )}
        </Main>
    );
};

export default CandidatesLeft;
