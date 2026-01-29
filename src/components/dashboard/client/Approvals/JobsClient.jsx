import React, { useEffect, useState } from "react";
import { Table, message, Modal } from "antd";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import { InfoCircleOutlined } from "@ant-design/icons";

const JobsClient = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [viewRejectReason, setViewRejectReason] = useState(false);

    const fetchData = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/client/job-postings?page=${page}&search=${search}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setData(result.results);
                setPagination({ ...pagination, current: page, total: result.count });
            }
        } catch (error) {
            message.error("Failed to fetch job postings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleTableChange = (pagination) => {
        fetchData(pagination.current, searchTerm);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchData(1, value);
    };

    const columns = [
        { title: "Job Title", dataIndex: "job_title", key: "job_title" },
        { title: "Company", dataIndex: "company", key: "company" },
        { title: "Total Candidates", dataIndex: "total_candidates", key: "total_candidates" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Positions Closed", dataIndex: "positions_closed", key: "positions_closed" },
        { title: "CTC", dataIndex: "ctc", key: "ctc" },
        { title: "Job Close Duration", dataIndex: "job_close_duration", key: "job_close_duration" },
        {
            title: "Approval Status",
            dataIndex: "approval_status",
            key: "approval_status",
            render: (status, record) => {
                let color = "";
                if (status === "pending") color = "gold"; // Yellow
                else if (status === "rejected") color = "red";
                else if (status === "accepted") color = "green";

                return (
                    <span style={{ color, fontWeight: "bold" }}>
                        {status}
                        {status === "rejected" && (
                            <InfoCircleOutlined
                                style={{ marginLeft: 8, cursor: "pointer" }}
                                onClick={() => {
                                    setViewRejectReason(true);
                                    setRejectReason(record?.reason)
                                }}
                            />
                        )}
                    </span>
                );
            },
        },
    ];

    return (
        <>
            {loading ? (
                <Pageloading />
            ) : (
                <div>
                    {/* 
                    <Input.Search
                        placeholder="Search by job title"
                        allowClear
                        onChange={handleSearch}
                        style={{ marginBottom: 16, width: 300 }}
                    /> 
                    */}
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="id"
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                    <Modal
                        title="Rejection Reason"
                        open={viewRejectReason}
                        onCancel={() => {
                            setViewRejectReason(false)
                            setRejectReason(false)
                        }}
                        footer={null}
                    >
                        <p>{rejectReason}</p>
                    </Modal>
                </div>
            )}
        </>
    );

};

export default JobsClient;
