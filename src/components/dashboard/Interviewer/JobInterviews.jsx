import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Input, Button, Tag, Modal } from "antd";
import Main from "./Layout";
import { message } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";

import { useAuth } from "../../common/useAuth";
import Pageloading from "../../common/loading/Pageloading";
import AppTable from "../../common/AppTable";
import { Select } from "antd";
const JobInterviews = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [modeFilter, setModeFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    async function fetchJobsInterviews() {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/interviewer/jobs-interviews/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setJobs(data);
            console.log("Fetched Jobs and Interviews:", typeof data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const updateState = async () => {
        try {
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: "assign_interviewer",
                    }),
                },
            );
            const data = response.json();
            if (data.error) {
                message.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        if (token) {
            updateState();
        }
    }, []);

    useEffect(() => {
        fetchJobsInterviews();
    }, []);

    const items = [
        {
            key: "1",
            label: "All",
        },
        {
            key: "2",
            label: "Job Role",
        },
        {
            key: "3",
            label: "Status",
        },
    ];

    const filteredData = useMemo(() => {
        let result = jobs || [];
        if (modeFilter !== "All") {
            result = result.filter(
                (item) => item.mode_of_interview === modeFilter,
            );
        }
        if (typeFilter !== "All") {
            result = result.filter(
                (item) => item.type_of_interview === typeFilter,
            );
        }
        return result;
    }, [jobs, modeFilter, typeFilter]);

    const modeOptions = useMemo(() => {
        const modes = [
            ...new Set(
                (jobs || [])
                    .map((item) => item.mode_of_interview)
                    .filter(Boolean),
            ),
        ];
        return [
            { label: "All Modes", value: "All" },
            ...modes.map((mode) => ({ label: mode, value: mode })),
        ];
    }, [jobs]);

    const typeOptions = useMemo(() => {
        const types = [
            ...new Set(
                (jobs || [])
                    .map((item) => item.type_of_interview)
                    .filter(Boolean),
            ),
        ];
        return [
            { label: "All Types", value: "All" },
            ...types.map((type) => ({ label: type, value: type })),
        ];
    }, [jobs]);

    const customFilters = (
        <div className="flex gap-3">
            <Select
                value={modeFilter}
                onChange={setModeFilter}
                options={modeOptions}
                style={{ width: 160 }}
                placeholder="Select Mode"
            />
            <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                style={{ width: 160 }}
                placeholder="Select Type"
            />
        </div>
    );

    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleOpenModal = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const columns = [
        {
            header: "Job Role",
            accessorKey: "job_title",
            width: 200,
            searchField: true,
            cell: ({ row }) => (
                <div
                    onClick={() => {
                        navigate(
                            `/interviewer/jobpost/${row.original.job_id}`,
                            {
                                state: { from: location.pathname },
                            },
                        );
                    }}
                    className="text-[#2C5F99] font-bold cursor-pointer"
                >
                    {row.original.job_title}
                </div>
            ),
        },
        {
            header: "Job Code",
            accessorKey: "job_code",
            width: 120,
            searchField: true,
        },
        {
            header: "Type of Interview",
            accessorKey: "type_of_interview",
            width: 150,
        },
        {
            header: "Mode of Interview",
            accessorKey: "mode_of_interview",
            width: 150,
        },
        {
            header: "Round Number",
            accessorKey: "round_num",
            width: 130,
        },
        {
            header: "View Schedule",
            id: "viewSchedule",
            width: 180,
            cell: ({ row }) => (
                <Button
                    type="link"
                    className="!text-[#1890ff] !p-0"
                    onClick={() => handleOpenModal(row.original)}
                >
                    View Interview Schedule
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="3">
            {loading ? (
                <Pageloading></Pageloading>
            ) : (
                <>
                    <AppTable
                        columns={columns}
                        data={filteredData}
                        customFilters={customFilters}
                    />
                    <Modal
                        title="Interview Schedule"
                        open={isModalOpen}
                        onCancel={handleCloseModal}
                        footer={null}
                    >
                        {selectedRecord ? (
                            selectedRecord.scheduled ? (
                                <>
                                    <p>
                                        <strong>Scheduled Date:</strong>{" "}
                                        {selectedRecord.scheduled_date}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {selectedRecord.status}
                                    </p>
                                    <div className="flex gap-5">
                                        <p>
                                            <strong>From:</strong>{" "}
                                            {selectedRecord.from_time}
                                        </p>
                                        <p>
                                            <strong>To:</strong>{" "}
                                            {selectedRecord.to_time}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p>Interview is not scheduled.</p>
                            )
                        ) : null}
                    </Modal>
                </>
            )}
        </Main>
    );
};

export default JobInterviews;
