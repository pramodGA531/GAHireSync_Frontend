import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Select, message, Tag } from "antd";
import GoBack from "../../common/Goback";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";

const Replacements = () => {
    const [replacements, setReplacements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReplacement, setSelectedReplacement] = useState(null);
    const [selectedRecruiter, setSelectedRecruiter] = useState([]);
    const [assignLoading, setAssignLoading] = useState(false);

    const { token, apiurl } = useAuth();

    useEffect(() => {
        if (token) {
            fetchReplacements();
        }
    }, [token]);

    const fetchReplacements = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/replacement-requests/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (response.ok) {
                setReplacements(data);
            } else {
                message.error(data.error || "Failed to fetch replacements");
            }
        } catch (error) {
            console.error("Error fetching replacements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedRecruiter || selectedRecruiter.length === 0) {
            message.error("Please select at least one recruiter");
            return;
        }
        setAssignLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/assign-replacement-candidate/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        recruiter_ids: selectedRecruiter,
                        replacement_id: selectedReplacement?.replacement_id,
                    }),
                },
            );
            const result = await response.json();
            if (response.ok) {
                message.success(result.message);
                // Refresh data or close modal
                setIsModalOpen(false);
                setSelectedRecruiter([]);
                fetchReplacements();
            } else {
                message.error(result.error || "Failed to assign candidate");
            }
        } catch (error) {
            console.error("Error assigning candidate:", error);
            message.error("Something went wrong");
        } finally {
            setAssignLoading(false);
        }
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "client_name",
            key: "client_name",
            render: (text) => (
                <span className="font-bold text-[#071C50]">{text}</span>
            ),
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Candidate Replaced",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Job Location ID",
            dataIndex: "job_location_id",
            key: "job_location_id",
        },
        {
            title: "Suggested Candidates",
            key: "suggested_candidates",
            render: (_, record) =>
                record.suggested_candidates &&
                record.suggested_candidates.length > 0 ? (
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedReplacement(record);
                            setIsModalOpen(true);
                            setSelectedRecruiter(null);
                        }}
                    >
                        View {record.suggested_candidates.length} Suggestions
                    </Button>
                ) : (
                    <span className="text-gray-400">None</span>
                ),
        },
    ];

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Candidate Replacements
                        </h2>
                    </div>
                    <div className="p-0">
                        <Table
                            columns={columns}
                            dataSource={replacements}
                            rowKey="replacement_id"
                            loading={loading}
                            pagination={{ pageSize: 10, className: "p-4" }}
                        />
                    </div>
                </div>
            </div>

            <Modal
                title="Suggested Candidates"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedReplacement && (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-center bg-blue-50 p-4 rounded-lg">
                            <span className="font-medium text-gray-700">
                                Assign all candidates to:
                            </span>
                            <Select
                                mode="multiple"
                                placeholder="Select Recruiters"
                                style={{ width: 400 }}
                                onChange={(value) =>
                                    setSelectedRecruiter(value)
                                }
                                options={(
                                    selectedReplacement.assigned_recruiters ||
                                    []
                                ).map((r) => ({ label: r.name, value: r.id }))}
                                value={selectedRecruiter}
                            />
                        </div>

                        <Table
                            dataSource={
                                selectedReplacement.suggested_candidates
                            }
                            rowKey="application_id"
                            pagination={false}
                            columns={[
                                {
                                    title: "Candidate Name",
                                    dataIndex: "candidate_name",
                                    key: "candidate_name",
                                },
                                {
                                    title: "Email",
                                    dataIndex: "email",
                                    key: "email",
                                },
                            ]}
                        />

                        <div className="flex justify-end pt-4 border-t">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => handleAssign()} // No ID needed, uses state
                                loading={assignLoading}
                                disabled={
                                    !selectedRecruiter ||
                                    selectedRecruiter.length === 0
                                }
                                className="bg-[#10B981] hover:bg-[#059669]"
                            >
                                Assign All & Send Profiles
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </Main>
    );
};

export default Replacements;
