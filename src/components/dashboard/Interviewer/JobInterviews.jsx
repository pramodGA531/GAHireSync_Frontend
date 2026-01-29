import { useEffect, useState } from "react";
import { Table, Input, Button, Tag, Modal } from "antd";
import Main from "./Layout";
import { message } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";

import { useAuth } from "../../common/useAuth";
import Pageloading from "../../common/loading/Pageloading";
import { useNavigate } from "react-router-dom";
import GoBack from "../../common/Goback";
const JobInterviews = () => {
    const [searchText, setSearchText] = useState("");
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);

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
                }
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
                }
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

    const renderStatusTag = (status) => {
        let color = "";
        switch (status) {
            case "Accept":
                color = "success";
                break;
            case "Reject":
                color = "error";
                break;
            case "Hold":
                color = "default";
                break;
            case "Processing":
                color = "processing";
                break;
            default:
                color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
    };

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
            title: "Job Role",
            dataIndex: "job_title",
            key: "job_title",
            width: 150,
            render: (title, record) => (
                <div
                    onClick={() => {
                        navigate(`/interviewer/jobpost/${record.job_id}`);
                    }}
                    className="text-[#2C5F99] font-bold cursor-pointer"
                >
                    {title}
                </div>
            ),
        },
        {
            title: "Job Code",
            dataIndex: "job_code",
            key: "job_code",
            width: 100,
        },
        {
            title: "Type of Interview",
            dataIndex: "type_of_interview",
            key: "type_of_interview",
            width: 150,
        },
        {
            title: "Mode of Interview",
            dataIndex: "mode_of_interview",
            key: "mode_of_interview",
            width: 150,
        },
        {
            title: "Round Number",
            dataIndex: "round_num",
            key: "round_num",
            width: 130,
        },
        {
            title: "View Schedule",
            key: "viewSchedule",
            width: 150,
            render: (record) => (
                <>
                    <Button
                        type="link"
                        className="!text-[#1890ff] !p-0"
                        onClick={() => handleOpenModal(record)}
                    >
                        View Interview Schedule
                    </Button>
                </>
            ),
        },
    ];

    const filteredData = jobs?.filter((item) => {
        return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        );
    });

    return (
        <Main defaultSelectedKey="3">
            {loading ? (
                <Pageloading></Pageloading>
            ) : (
                <div className="p-5 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#A2A1A866] mb-2.5">
                    <div className="-ml-6">
                        <GoBack />
                    </div>
                    <h1 className="text-xl font-bold mb-2">
                        Assigned Interviews
                    </h1>
                    <div className="flex flex-col md:flex-row justify-between mb-5 gap-3">
                        <Input
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            className="w-full md:w-[600px] !rounded-[4px]"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        {/* <Dropdown menu={{ items }} trigger={["click"]}>
            <Button className="filter-button">
              <Space>
                Filters
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown> */}
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={false}
                        scroll={{ x: 1000 }}
                        className="[&_.ant-table-thead>tr>th]:!bg-[#fafafa] [&_.ant-table-thead>tr>th]:!text-[#666] [&_.ant-table-thead>tr>th]:!font-medium [&_.ant-table-tbody>tr>td]:!border-b [&_.ant-table-tbody>tr>td]:!border-[#A2A1A866] [&_.ant-table-tbody>tr>td]:!p-[12px_16px]"
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
                </div>
            )}
        </Main>
    );
};

export default JobInterviews;

