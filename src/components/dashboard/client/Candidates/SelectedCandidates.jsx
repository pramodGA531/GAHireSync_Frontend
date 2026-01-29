import React, { useEffect, useState } from "react";
import { Table, message, Modal, Tag, Radio } from "antd";
import { useAuth } from "../../../common/useAuth";
import { SearchOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../../common/CustomDatePicker";
import Pageloading from "../../../common/loading/Pageloading";
import { Check, CalendarClock, UserX } from "lucide-react";
import { format } from "date-fns";
import dayjs from "dayjs";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const ClientSelectedCandidates = ({ selectedJob }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [wantNewCandidate, setWantNewCandidate] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        record: null,
        action: null,
    });
    const { apiurl, token } = useAuth();
    const [updateDateLoading, setUpdateDateLoading] = useState(false);
    const [newDate, setNewDate] = useState();
    const [loading, setLoading] = useState(false);

    const updateState = async () => {
        try {
            setLoading(true);
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
                }
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
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
            updateState();
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
                }
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
                }
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
                }
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
            title: "Joining Date",
            dataIndex: "joining_date",
            key: "joining_date",
            sorter: (a, b) =>
                new Date(a.joining_date) - new Date(b.joining_date),
        },
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
            title: "Job Location",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Job Location Status",
            dataIndex: "location_status",
            key: "location_status",
            render: (location_status) =>
                location_status === "opened" ? (
                    <div className="" style={{ color: "green" }}>
                        {location_status}
                    </div>
                ) : (
                    <div className="danger" style={{ color: "red" }}>
                        {location_status}
                    </div>
                ),
        },
        {
            title: "Joining Status",
            dataIndex: "joining_status",
            key: "joining_status",
        },

        {
            title: "Action",
            key: "action",
            render: (_, record) =>
                record.joining_status === "joined" ? (
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
                ),
        },
    ];

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-3">
            {loading ? (
                <Pageloading />
            ) : (
                
                <div className="p-6">
                    <div className="-mt-2 -ml-8">
                        <GoBack />
                    </div>
                    <div className="flex flex-col md:flex-row pl-[15px] pr-[15px] py-2 md:py-0 rounded-[10px] border border-[#A2A1A866] outline-none text-[#16151C] text-sm font-light items-center h-auto md:h-[55px] gap-2.5">
                        <SearchOutlined className="hidden md:block" />
                        <input
                            type="text"
                            placeholder="Search candidates, agency, job title..."
                            value={searchText}
                            onChange={handleSearch}
                            className="border-none outline-none text-[#16151C] w-full md:w-[90%] bg-transparent h-10 md:h-auto"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            rowKey="selected_candidate_id"
                            className="mt-5"
                            scroll={{ x: 1000 }}
                        />
                    </div>

                    <Modal
                        title="Confirm Joining"
                        open={
                            confirmModal.visible &&
                            confirmModal.action === "joined"
                        }
                        onOk={() => confirmJoining(confirmModal.record)}
                        onCancel={() =>
                            setConfirmModal({ visible: false, record: null })
                        }
                    >
                        <p>Are you sure this candidate has joined?</p>
                    </Modal>
                </div>
            )}

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
