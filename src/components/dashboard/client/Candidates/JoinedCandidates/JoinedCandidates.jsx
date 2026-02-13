import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../common/useAuth";
import { message, Button, Modal, Radio, Select } from "antd"; // Added Select
// import { SearchOutlined } from "@ant-design/icons";

import Pageloading from "../../../../common/loading/Pageloading";
import Main from "../../Layout";
// import GoBack from "../../../../common/Goback";
import AppTable from "../../../../common/AppTable";

const { Option } = Select; // Added Option

const JoinedCandidates = ({ selectedJob }) => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    // const [searchText, setSearchText] = useState("");
    // const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedReason, setSelectedReason] = useState("");
    const [statusFilter, setStatusFilter] = useState("All"); // Added state

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/joined-candidates/?job_id=${selectedJob}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            }
            if (result.length > 0) {
                setData(result || []);
                // setFilteredData(result || []);
            }
        } catch (e) {
            message.error("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const handleCandidateLeft = (candidateId) => {
        setSelectedCandidate(candidateId);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!selectedReason) {
            message.warning("Please select a reason before saving.");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/client/candidate-left/?candidate_id=${selectedCandidate}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        candidate_id: selectedCandidate,
                        reason: selectedReason,
                    }),
                },
            );
            const result = await response.json();
            if (result.message) {
                message.success("Candidate marked as left successfully.");
                setModalVisible(false);
                fetchData();
            } else {
                message.error(result.error || "Something went wrong.");
            }
        } catch (e) {
            message.error("Failed to update candidate status.");
        }
    };

    // const handleSearch = (value) => {
    //     setSearchText(value);
    //     const filtered = data.filter(
    //         (candidate) =>
    //             candidate.candidate_name
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             candidate.job_title
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             candidate.organization_name
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()),
    //     );
    //     setFilteredData(filtered);
    // };

    useEffect(() => {
        if (token) fetchData();
    }, [token, selectedJob]);

    const columns = [
        {
            header: "Joined Date",
            accessorKey: "created_at",
            dateFilter: true,
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        },
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            searchField: true,
        },
        {
            header: "Organization Name",
            accessorKey: "organization_name",
            searchField: true,
        },
        {
            header: "Joined Date (Official)",
            accessorKey: "joined_date",
            dateFilter: true,
        },
        {
            header: "Job Title",
            accessorKey: "job_title",
            searchField: true,
        },
        {
            header: "Job Location Status",
            accessorKey: "location_status",
            searchField: true,
        },
        {
            header: "Joining Status",
            accessorKey: "joining_status",
            searchField: true,
            cell: ({ getValue }) => (
                <span
                    className={
                        getValue() === "joined"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                    }
                >
                    {getValue()}
                </span>
            ),
        },
        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => (
                <div>
                    {row.original.joining_status === "joined" && (
                        <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() =>
                                handleCandidateLeft(row.original.candidate_id)
                            }
                        >
                            Candidate Left
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const filteredData = (data || []).filter((item) => {
        if (statusFilter === "All") return true;
        return (
            item.joining_status?.toLowerCase() === statusFilter.toLowerCase()
        );
    });

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-4">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-5">
                    {/* <div className="mt-4 -ml-2">
                        <GoBack />
                        
                    </div> */}
                    <h1 className="text-2xl font-semibold m-2  text-[#16151C]">
                        Joined Candidates
                    </h1>

                    <AppTable
                        columns={columns}
                        data={filteredData}
                        rowKey="candidate_id"
                        customFilters={
                            <Select
                                defaultValue="All"
                                style={{ width: 150 }}
                                onChange={(value) => setStatusFilter(value)}
                                className="custom-filter-select"
                            >
                                <Option value="All">All Status</Option>
                                <Option value="joined">Joined</Option>
                                <Option value="left">Left</Option>
                            </Select>
                        }
                    />

                    <Modal
                        title="Candidate Left"
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        onOk={handleSave}
                        okText="Save"
                    >
                        <p>Select a reason why the candidate left:</p>
                        <Radio.Group
                            onChange={(e) => setSelectedReason(e.target.value)}
                            value={selectedReason}
                        >
                            <Radio value="absconding">Absconding</Radio>
                            <Radio value="behavioral_issues">
                                Behavioral Issues
                            </Radio>
                            <Radio value="performance_issues">
                                Performance Issues
                            </Radio>
                        </Radio.Group>
                    </Modal>
                </div>
            )}
        </Main>
    );
};

export default JoinedCandidates;
