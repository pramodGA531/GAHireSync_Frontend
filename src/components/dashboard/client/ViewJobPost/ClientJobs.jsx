import React, { useEffect, useState } from "react";
import { Table, Dropdown, Input, Select, message, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
// import "./ClientJobs.css";
import Main from "./../Layout";
import { useAuth } from "../../../common/useAuth";
import CandidateFolder from "./../../../../images/Client/Candidates_folder.svg";
import PlusOutlined from "./../../../../images/Client/plusicon.svg";
import Options from "./../../../../images/Client/options.svg";
import { useNavigate } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";
const { Option } = Select;

const ClientJobs = () => {
    const [jobsData, setJobsData] = useState([]);

    const [loading, setLoading] = useState(false);

    const [filteredData, setFilteredData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [editCount, setEditCount] = useState(0);
    const { token, apiurl } = useAuth();
    const [searchText, setSearchText] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("All Companies");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedDateFilter, setSelectedDateFilter] = useState("All Dates");

    const navigate = useNavigate();

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
                        category: ["accept_job", "reject_job"],
                    }),
                }
            );
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async (page = 1) => {
        setLoading(true);
        try {
            let url = `${apiurl}/client/job-postings/?page=${page}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setJobsData(data.results);
                setTotalItems(data.count);
                setCurrentPage(page);
                setFilteredData(data.results);
            } else {
                console.error("Failed to fetch jobs");
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    const fetchEditCount = async () => {
        const response = await fetch(`${apiurl}/client/edit-job-count/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (data.count) {
            setEditCount(data.count);
        }
    };

    useEffect(() => {
        fetchJobs(currentPage);
        updateState();
        fetchEditCount();
    }, []);

    const handleDeleteJob = async (id) => {
        try {
            setLoading(true);

            const response = await fetch(
                `${apiurl}/client/delete-job-post/?id=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else {
                message.success(data.message);
                fetchJobs(currentPage);
            }
        } catch (e) {
            message.error("An error occurred while deleting the job");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobsData) {
            let filtered = [...jobsData];

            if (searchText) {
                filtered = filtered.filter((item) =>
                    item.job_title
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                );
            }

            if (selectedCompany !== "All Companies") {
                filtered = filtered.filter(
                    (item) => item.company === selectedCompany
                );
            }

            if (selectedStatus !== "All Status") {
                filtered = filtered.filter(
                    (item) => item.status === selectedStatus
                );
            }

            if (selectedDateFilter !== "All Dates") {
                const now = new Date();
                filtered = filtered.filter((item) => {
                    const closeDate = new Date(item.job_close_duration);
                    const diffDays = Math.ceil(
                        (now - closeDate) / (1000 * 60 * 60 * 24)
                    );

                    switch (selectedDateFilter) {
                        case "Within 5 days":
                            return diffDays <= 5;
                        case "5-10 days":
                            return diffDays > 5 && diffDays <= 10;
                        case "10-20 days":
                            return diffDays > 10 && diffDays <= 20;
                        case "1 Month":
                            return diffDays > 20 && diffDays <= 30;
                        case "Above 1 Month":
                            return diffDays > 30;
                        default:
                            return true;
                    }
                });
            }

            setFilteredData(filtered);
        }
    }, [
        searchText,
        selectedCompany,
        selectedStatus,
        selectedDateFilter,
        jobsData,
    ]);

    const getMenu = (record) => ({
        items: [
            {
                key: "delete",
                label: "Delete",
                onClick: () => handleDeleteJob(record.id),
            },
            {
                key: "renew",
                label: "Reopen job",
                onClick: () => navigate(`/client/reopen-job/${record.id}`),
            },
        ],
    });

    const companyOptions = [
        "All Companies",
        ...Array.from(new Set(jobsData.map((item) => item.company))),
    ];
    const statusOptions = [
        "All Status",
        ...Array.from(new Set(jobsData.map((item) => item.status))),
    ];

    const handleApproveDeadline = async (jobId) => {
        try {
            const response = await fetch(
                `${apiurl}/client/approve-deadline/${jobId}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                message.success("Deadline extension approved");
            } else {
                message.error("Failed to approve deadline");
            }
        } catch (error) {
            message.error("Error approving deadline");
        }
    };

    const columns = [
        {
            title: "JOB",
            dataIndex: "job_title",
            key: "job_title",

            render: (text, record) => (
                <div>
                    <span
                        className="cursor-pointer text-[#3A4D62] font-bold"
                        onClick={() =>
                            navigate(`/client/complete_job_post/${record.id}`)
                        }
                    >
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: "Applications Received",
            dataIndex: "total_candidates",
            key: "total_candidates",
            render: (text) => (
                <div>
                    <img
                        src={CandidateFolder}
                        alt=""
                        className="mr-1.5 inline"
                    />{" "}
                    {text}
                </div>
            ),
        },
        { title: "Company", dataIndex: "company", key: "company" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record) => (
                <div
                    className={
                        record.approval_status === "rejected"
                            ? "text-red-600 font-bold"
                            : text.toLowerCase() === "opened"
                            ? "text-green-600"
                            : "text-red-600"
                    }
                >
                    {record.approval_status === "rejected" ? "Rejected" : text}
                </div>
            ),
        },
        {
            title: "Positions Closed",
            dataIndex: "positions_closed",
            key: "positions_closed",
            render: (text, record) => {
                const locationList = record.location_wise || [];

                const content = (
                    <div>
                        {locationList.map((loc, index) => (
                            <div key={index} className="mb-1.5">
                                <strong>{loc.location}</strong>: {loc.closed}/
                                {loc.position}
                            </div>
                        ))}
                    </div>
                );

                return (
                    <Popover
                        content={content}
                        title="Location-wise Joinings"
                        trigger="click"
                    >
                        <div className="bg-[#F1F8FD] text-[#379AE6] px-2.5 py-1 rounded-[14px] text-center inline-block min-w-[50px] cursor-pointer">
                            {text} ▼
                        </div>
                    </Popover>
                );
            },
        },
        { title: "CTC", dataIndex: "ctc", key: "ctc" },
        {
            title: "Job Closed by",
            dataIndex: "job_close_duration",
            key: "job_close_duration",
            render: (text, record) => {
                if (record.extended_deadline) {
                    return (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-orange-500 font-semibold">
                                Deadline extension requested:{" "}
                                {new Date(
                                    record.extended_deadline
                                ).toLocaleDateString()}
                            </span>
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => handleApproveDeadline(record.id)}
                            >
                                Approve
                            </Button>
                        </div>
                    );
                }
                return text || "-";
            },
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Dropdown menu={getMenu(record)} trigger={["click"]}>
                    <img
                        src={Options}
                        className="text-[15px] cursor-pointer"
                        alt=""
                    />
                </Dropdown>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        fetchJobs(pagination.current);
    };

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                <div className="mt-4 -ml-4"><GoBack /></div>
                
                    <div className="flex justify-between items-center m-2">
                        
                        <span className="text-xl font-bold ">
                            My Job Postings
                        </span>
                    </div>

                    {/* Search & Filters Section */}
                    <div className="my-4 flex flex-col md:flex-row gap-3 items-center m-2">
                        <Input
                            placeholder="Search Job Title"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full md:flex-1 mt-0 bg-[#F3F4F6]"
                            prefix={
                                <SearchOutlined className="text-[#171A1F]" />
                            }
                        />
                        <Select
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            className="w-full md:w-48 bg-[#F3F4F6]"
                        >
                            {companyOptions.map((company) => (
                                <Option key={company} value={company}>
                                    {company}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            className="w-full md:w-32 bg-[#F3F4F6]"
                        >
                            {statusOptions.map((status) => (
                                <Option key={status} value={status}>
                                    {status}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            value={selectedDateFilter}
                            onChange={setSelectedDateFilter}
                            className="w-full md:w-36"
                        >
                            <Option value="All Dates">All Dates</Option>
                            <Option value="Within 5 days">Within 5 days</Option>
                            <Option value="5-10 days">5-10 days</Option>
                            <Option value="10-20 days">10-20 days</Option>
                            <Option value="1 Month">1 Month</Option>
                            <Option value="Above 1 Month">Above 1 Month</Option>
                        </Select>
                    </div>

                    {/* Table Section */}
                    <div className="">
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            loading={loading}
                            className="custom-table"
                            rowKey="id"
                            scroll={{ x: 1000 }}
                            pagination={{
                                current: currentPage,
                                total: totalItems,
                                pageSize: 10,
                                showSizeChanger: false,
                            }}
                            onChange={handleTableChange} // handle pagination change
                        />
                    </div>
                </>
            )}
        </Main>
    );
};

export default ClientJobs;
