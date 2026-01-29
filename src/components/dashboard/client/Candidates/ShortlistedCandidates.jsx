import React, { useEffect, useState } from "react";
import { Table, message, Modal, Tag } from "antd";
import { useAuth } from "../../../common/useAuth";
import { SearchOutlined } from "@ant-design/icons";

import Main from "../Layout";
import { useNavigate } from "react-router-dom";
import Pageloading from "../../../common/loading/Pageloading";
import { EyeOutlined } from "@ant-design/icons";
import GoBack from "../../../common/Goback";
const ShortlistedCandidates = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
    });
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                const sortedData = result.sort(
                    (a, b) =>
                        new Date(a.joining_date) - new Date(b.joining_date)
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
    }, [token]);
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, selectedJob]);

    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = data.filter(
            (item) =>
                item.candidate_name
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                item.job_title
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

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
                }
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
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
            render: (candidate, record) => (
                <span
                    style={{
                        cursor: "pointer",
                        color: "rgb(56 99 172)",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                    className="name"
                    onClick={() =>
                        navigate(`/client/application/${record.application_id}`)
                    }
                >
                    {candidate}&nbsp;&nbsp;
                    <EyeOutlined />
                </span>
            ),
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
            render: (job_title, record) => (
                <span
                    style={{
                        cursor: "pointer",
                        color: "rgb(216 70 243)",
                        fontWeight: "600",
                        fontSize: "14px",
                    }}
                    className="name"
                    onClick={() =>
                        navigate(`/client/complete_job_post/${record.job_id}`)
                    }
                >
                    {job_title}&nbsp;&nbsp;
                    <EyeOutlined />
                </span>
            ),
        },
        {
            title: "Agency",
            dataIndex: "agency",
            key: "agency",
        },
        {
            title: "Current Round ",
            dataIndex: "current_status",
            key: "current_status",
        },
        {
            title: "Next Interview",
            dataIndex: "next_interview",
            key: "next_interview",
        },
        {
            title: "Job Location",
            dataIndex: "job_location",
            key: "job_location",
        },
        {
            title: "Job Status",
            dataIndex: "location_status",
            key: "location_status",
            render: (job_status) => (
                <Tag color={job_status === "opened" ? "green" : "red"}>
                    {job_status}
                </Tag>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-1">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                <div className="mt-4 -ml-2">
                    <GoBack />
                </div>
                    <div className="flex m-2 mt-5 pl-[15px] rounded-[10px] border border-[#A2A1A866] outline-none text-[#16151C] text-sm font-light items-center h-[55px] gap-2.5">
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
                        rowKey="selected_candidate_id"
                        className="mt-5"
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
                </>
            )}
        </Main>
    );
};

export default ShortlistedCandidates;
