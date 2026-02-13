import React, { useEffect, useState } from "react";
import { message, Modal, Tag, Select } from "antd"; // Added Select
import { useAuth } from "../../../common/useAuth";
import { EyeOutlined } from "@ant-design/icons";
// import "./ShortlistedCandidates.css"; // Assuming CSS might be needed or ignored
import Main from "../Layout";
import { useNavigate } from "react-router-dom";
// import Pageloading from "../../../common/loading/Pageloading";
// import GoBack from "../../../common/Goback";
import AppTable from "../../../common/AppTable";

const { Option } = Select; // Destructure Option

const ShortlistedCandidates = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
    });
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [jobStatusFilter, setJobStatusFilter] = useState("All");

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/shortlisted-candidates/?job_id=${selectedJob}`,
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
                // AppTable handles sorting, but initial sort by date is fine.
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
    }, [token]);
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, selectedJob]);

    const confirmJoining = async (record) => {
        try {
            const response = await fetch(
                `${apiurl}/client/candidate-joined/?candidate_id=${record.selected_candidate_id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ joining_status: "joined" }),
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Candidate confirmed as joined.");
                fetchData();
            }
        } catch (e) {
            message.error("Failed to update joining status.");
        }
    };

    const columns = [
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            cell: ({ row }) => (
                <span
                    style={{
                        cursor: "pointer",
                        color: "rgb(56 99 172)",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                    className="name"
                    onClick={() =>
                        navigate(
                            `/client/application/${row.original.application_id}`,
                        )
                    }
                >
                    {row.original.candidate_name}&nbsp;&nbsp;
                    <EyeOutlined />
                </span>
            ),
            searchField: true,
        },
        {
            header: "Job Title",
            accessorKey: "job_title",
            cell: ({ row }) => (
                <span
                    style={{
                        cursor: "pointer",
                        color: "rgb(216 70 243)",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                    className="name"
                    onClick={() =>
                        navigate(
                            `/client/complete_job_post/${row.original.job_id}`,
                        )
                    }
                >
                    {row.original.job_title}&nbsp;&nbsp;
                    <EyeOutlined />
                </span>
            ),
            searchField: true,
        },
        {
            header: "Agency",
            accessorKey: "agency",
            searchField: true,
        },
        {
            header: "Current Round ",
            accessorKey: "current_status",
            searchField: true,
        },
        {
            header: "Next Interview",
            accessorKey: "next_interview",
            dateFilter: true, // Assuming this is a date field or date string
        },
        {
            header: "Job Location",
            accessorKey: "job_location",
            searchField: true,
        },
        {
            header: "Job Status",
            accessorKey: "location_status",
            cell: ({ getValue }) => (
                <Tag color={getValue() === "opened" ? "green" : "red"}>
                    {getValue()}
                </Tag>
            ),
            searchField: true,
        },
    ];

    const filteredData = (data || []).filter((item) => {
        if (jobStatusFilter === "All") return true;
        return (
            item.location_status?.toLowerCase() ===
            jobStatusFilter.toLowerCase()
        );
    });

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-1">
            <div className="p-5">
                {/* <div className="mt-4 -ml-2">
                    <GoBack />
                </div> */}
                <AppTable
                    columns={columns}
                    data={filteredData}
                    isLoading={loading}
                    customFilters={
                        <Select
                            defaultValue="All"
                            style={{ width: 150 }}
                            onChange={(value) => setJobStatusFilter(value)}
                            className="custom-filter-select"
                        >
                            <Option value="All">All Job Status</Option>
                            <Option value="opened">Opened</Option>
                            <Option value="closed">Closed</Option>
                        </Select>
                    }
                />
                <Modal
                    title="Confirm Joining"
                    visible={confirmModal.visible}
                    onOk={() => confirmJoining(confirmModal.record)}
                    onCancel={() =>
                        setConfirmModal({ visible: false, record: null })
                    }
                >
                    <p>Are you sure this candidate has joined?</p>
                </Modal>
            </div>
        </Main>
    );
};

export default ShortlistedCandidates;
