import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Input } from "antd";
import { useAuth } from "../../../common/useAuth";
import { SearchOutlined } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
const CandidatesLeft = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
    });
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);

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
                setFilteredData(sortedData);
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

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = data.filter((item) =>
            item.candidate_name.toLowerCase().includes(value.toLowerCase()),
        );
        setFilteredData(filtered);
    };

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
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Joining Date",
            dataIndex: "joining_date",
            key: "joining_date",
        },
        {
            title: "Left Reason",
            dataIndex: "left_reason",
            key: "left_reason",
        },
        {
            title: "Left Date",
            dataIndex: "left_date",
            key: "left_date",
        },
        {
            title: "Replacement Eligible",
            dataIndex: "is_replacement_eligible",
            key: "is_replacement_eligible",
            render: (eligible) => (eligible ? "Yes" : "No"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) =>
                record.is_replacement_eligible ? (
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
                ),
        },
    ];

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-5">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    <div className="p-6">
                        <div className="mt-6 -ml-10">
                            <GoBack />
                        </div>
                        <div className="flex m-2 pl-[15px] rounded-[10px] border border-[#A2A1A866] outline-none text-[#16151C] text-sm font-light items-center h-[55px] gap-2.5">
                            <SearchOutlined />
                            <input
                                type="text"
                                placeholder="Search candidates, agency, job title..."
                                value={searchText}
                                onChange={handleSearch}
                                className="border-none m-2 outline-none text-[#16151C] w-[90%]"
                            />
                        </div>

                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            rowKey="candidate_name"
                            className="mt-5"
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
                                Are you sure you want to request a replacement
                                for {confirmModal.record?.candidate_name}?
                            </p>
                        </Modal>
                    </div>
                </>
            )}
        </Main>
    );
};

export default CandidatesLeft;
