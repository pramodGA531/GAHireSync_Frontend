import React, { useEffect, useState } from "react";
import { message, Modal, Tag, Radio, Select } from "antd"; // Added Select
import { useAuth } from "../../../common/useAuth";
import { SearchOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../../common/CustomDatePicker";
// import Pageloading from "../../../common/loading/Pageloading";
import { Check, CalendarClock, UserX } from "lucide-react";
import { format } from "date-fns";
import dayjs from "dayjs";
import Main from "../Layout";
// import GoBack from "../../../common/Goback";
import AppTable from "../../../common/AppTable";

const { Option } = Select;

const ClientSelectedCandidates = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [wantNewCandidate, setWantNewCandidate] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
        action: null,
    });
    const { apiurl, token } = useAuth();
    const [updateDateLoading, setUpdateDateLoading] = useState(false);
    const [newDate, setNewDate] = useState();
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    console.log(data);

    const updateState = async () => {
        try {
            // setLoading(true); // Don't block UI
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: ["candidate_accepted", "candidate_rejected"],
                    }),
                },
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/selected-candidates/?job_id=${selectedJob}`,
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
                // AppTable handles sorting
                setData(result);
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
            updateState();
        }
    }, [token, selectedJob]);

    const confirmJoining = async (record) => {
        try {
            setLoading(true);
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
                setConfirmModal(false);
            }
        } catch (e) {
            message.error("Failed to update joining status.");
        } finally {
            setLoading(false);
        }
    };

    const updateJoiningDate = async (record) => {
        if (!newDate) {
            message.warning("Please select a date.");
            return;
        }

        const formattedDate = format(newDate, "yyyy-MM-dd");

        try {
            setUpdateDateLoading(true);

            const response = await fetch(
                `${apiurl}/application/update-joining/?candidate_id=${record.selected_candidate_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ updated_date: formattedDate }),
                },
            );

            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else {
                message.success(data.message);
                fetchData();
            }
        } catch (e) {
            console.error(e);
            message.error("Failed to update joining status.");
        } finally {
            setUpdateDateLoading(false);
            setConfirmModal({ visible: false, record: null, action: null });
            setNewDate(null);
        }
    };

    const handleCandidateLeft = async (record) => {
        try {
            setUpdateDateLoading(true);

            const response = await fetch(
                `${apiurl}/application/candidate-left/?candidate_id=${record.selected_candidate_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        want_new_candidate: wantNewCandidate,
                    }),
                },
            );

            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else {
                message.success(data.message);
                fetchData();
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to update candidate status.");
        } finally {
            setUpdateDateLoading(false);
            setConfirmModal({ visible: false, record: null, action: null });
            setWantNewCandidate(false);
        }
    };

    const columns = [
        {
            header: "Joining Date",
            accessorKey: "joining_date",
            dateFilter: true,
        },
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
            header: "Job Location",
            accessorKey: "location",
            searchField: true,
        },
        {
            header: "Job Location Status",
            accessorKey: "location_status",
            cell: ({ getValue }) =>
                getValue() === "opened" ? (
                    <div className="" style={{ color: "green" }}>
                        {getValue()}
                    </div>
                ) : (
                    <div className="danger" style={{ color: "red" }}>
                        {getValue()}
                    </div>
                ),
            searchField: true,
        },
        {
            header: "Joining Status",
            accessorKey: "joining_status",
            searchField: true,
        },

        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => {
                const record = row.original;
                return record.joining_status === "joined" ? (
                    <Tag color="green">Joined</Tag>
                ) : record.joining_status === "left" ? (
                    <Tag color="red">Left</Tag>
                ) : (
                    <div className="flex gap-[3px] flex-wrap">
                        <button
                            className="flex items-center gap-[5px] px-2.5 py-1 text-xs border-2 border-[#2ecc71] rounded-md cursor-pointer transition-colors duration-300 bg-white text-[#2ecc71] hover:bg-white hover:border-[#27ae60] hover:text-[#27ae60]"
                            onClick={() =>
                                setConfirmModal({
                                    visible: true,
                                    record,
                                    action: "joined",
                                })
                            }
                        >
                            <Check size={16} /> Joined
                        </button>

                        <button
                            className="flex items-center gap-[5px] px-2.5 py-1 text-xs border-2 border-[#3498db] rounded-md cursor-pointer transition-colors duration-300 bg-white text-[#3498db] hover:bg-white hover:border-[#2980b9] hover:text-[#2980b9]"
                            onClick={() =>
                                setConfirmModal({
                                    visible: true,
                                    record,
                                    action: "update",
                                })
                            }
                        >
                            <CalendarClock size={16} /> Update Joining Date
                        </button>
                        <button
                            className="flex items-center gap-[5px] px-2.5 py-1 text-xs border-2 border-[#e74c3c] rounded-md cursor-pointer transition-colors duration-300 bg-white text-[#e74c3c] hover:bg-white hover:border-[#c0392b] hover:text-[#c0392b]"
                            onClick={() =>
                                setConfirmModal({
                                    visible: true,
                                    record,
                                    action: "left",
                                })
                            }
                        >
                            <UserX size={16} /> Candidate Left
                        </button>
                    </div>
                );
            },
        },
    ];

    const filteredData = (data || []).filter((item) => {
        if (statusFilter === "All") return true;
        return (
            item.joining_status?.toLowerCase() === statusFilter.toLowerCase()
        );
    });

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-3">
            <div className="p-6">
                <AppTable
                    columns={columns}
                    data={filteredData}
                    isLoading={loading}
                    customFilters={
                        <Select
                            defaultValue="All"
                            style={{ width: 150 }}
                            onChange={(value) => setStatusFilter(value)}
                            className="custom-filter-select"
                        >
                            <Option value="All">All Status</Option>
                            <Option value="joined">Joined</Option>
                            <Option value="not_joined">Not Joined</Option>
                            <Option value="pending">Pending</Option>
                        </Select>
                    }
                />

                <Modal
                    title="Confirm Joining"
                    open={
                        confirmModal.visible && confirmModal.action === "joined"
                    }
                    onOk={() => confirmJoining(confirmModal.record)}
                    onCancel={() =>
                        setConfirmModal({ visible: false, record: null })
                    }
                >
                    <p>Are you sure this candidate has joined?</p>
                </Modal>
            </div>

            <Modal
                open={confirmModal.visible && confirmModal.action === "update"}
                onCancel={() => {
                    setConfirmModal({
                        visible: false,
                        record: null,
                        action: null,
                    });
                    setNewDate(null);
                }}
                onOk={() => updateJoiningDate(confirmModal.record)}
                okText="Update"
                confirmLoading={updateDateLoading}
                title="Update Joining Date"
            >
                <CustomDatePicker
                    size="sm"
                    value={newDate ? dayjs(newDate) : null}
                    onChange={(date) => {
                        setNewDate(date);
                        console.log(date);
                    }}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                />
            </Modal>

            <Modal
                open={confirmModal.visible && confirmModal.action === "left"}
                title="Candidate Left"
                onCancel={() => {
                    setConfirmModal({
                        visible: false,
                        record: null,
                        action: null,
                    });
                    setWantNewCandidate(false);
                }}
                onOk={() => handleCandidateLeft(confirmModal.record)}
                confirmLoading={updateDateLoading}
                okText="Confirm"
            >
                <p>Do you want to open this position for a new candidate?</p>
                <Radio.Group
                    onChange={(e) => setWantNewCandidate(e.target.value)}
                    value={wantNewCandidate}
                >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                </Radio.Group>
            </Modal>
        </Main>
    );
};

export default ClientSelectedCandidates;
