import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../common/useAuth";
import { message, Button, Modal, Radio, Empty, Input, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import Pageloading from "../../../../common/loading/Pageloading";
import Main from "../../Layout";
import GoBack from "../../../../common/Goback";

const { Search } = Input;

const JoinedCandidates = ({ selectedJob }) => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedReason, setSelectedReason] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/joined-candidates/?job_id=${selectedJob}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            }
            if (result.length > 0) {
                setData(result || []);
                setFilteredData(result || []);
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
                }
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

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = data.filter(
            (candidate) =>
                candidate.candidate_name
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                candidate.job_title
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                candidate.organization_name
                    .toLowerCase()
                    .includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token, selectedJob]);

    const columns = [
        {
            title: "Joined Date",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Organization Name",
            dataIndex: "organization_name",
            key: "organization_name",
        },
        {
            title: "Joined Date",
            dataIndex: "joined_date",
            key: "joined_date",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Job Location Status",
            dataIndex: "location_status",
            key: "location_status",
        },
        {
            title: "Joining Status",
            dataIndex: "joining_status",
            key: "joining_status",
            render: (text) => (
                <span
                    className={
                        text === "joined"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                    }
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <div>
                    {record.joining_status === "joined" && (
                        <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() =>
                                handleCandidateLeft(record.candidate_id)
                            }
                        >
                            Candidate Left
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-4">
            {loading ? (
                <Pageloading />
            ) : (
                <div>
                    <div className="mt-4 -ml-2">
                        <GoBack />
                        
                    </div>
                    <h1 className="text-2xl font-semibold m-2  text-[#16151C]">
                            Joined Candidates
                        </h1>
                    <div className="flex m-2 mt-5 pl-[15px] rounded-[10px] border border-[#A2A1A866] outline-none text-[#16151C] text-sm font-light items-center h-[55px] gap-2.5">
                        <SearchOutlined />
                        <input
                            type="text"
                            placeholder="Search candidates, agency, job title..."
                            value={searchText}
                            onChange={handleSearch}
                            className="border-none outline-none m-2 text-[#16151C] w-[90%]"
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="candidate_id"
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
