import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Table,
    Button,
    Dropdown,
    Menu,
    Modal,
    Tag,
    Progress,
} from "antd";
import {
    DownOutlined,
    ExclamationCircleOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    EditOutlined,
    HddOutlined,
} from "@ant-design/icons";
import AgencyPieChart from "./AgencyPieChart";
import GoBack from "../../../common/Goback";

const AgencyResumeBank = () => {
    const [data, setData] = useState([]);
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [storageUsed, setStorageUsed] = useState(0);
    const [storageLimit, setStorageLimit] = useState(0);
    const [recruiters, setRecruiters] = useState([]);
    const [applications, setApplications] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/fetch-resumes/?page=${page}&page_size=${pageSize}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setLoading(false);
                return;
            }
            setData(data.results.resumes);
            const storage = data.results.storage || {};
            console.log("Storage Data:", storage);
            setStorageUsed(storage.total_size_mb || 0);
            setApplications(data.results.applications);
            setRecruiters(data.results.recruiters);
            setStorageLimit(data.results.storage_limit);
            setPagination({
                current: page,
                pageSize,
                total: data.count || 0,
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Modal.confirm({
            title: <span className="font-bold">Delete Resumes</span>,
            content: `Are you sure you want to delete ${selectedRowKeys.length} selected resumes? This action cannot be undone.`,
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const response = await fetch(
                        `${apiurl}/manager/delete-resumes/`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                candidate_emails: selectedRowKeys,
                            }),
                        },
                    );
                    const result = await response.json();
                    if (result.message) {
                        message.success("Resumes deleted successfully");
                        fetchData();
                        setSelectedRowKeys([]);
                    } else {
                        message.error(result.error || "Failed to delete");
                    }
                } catch (err) {
                    console.error(err);
                    message.error("Server error while deleting");
                }
            },
        });
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const columns = [
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
            render: (text) => (
                <span className="font-bold text-[#071C50]">{text}</span>
            ),
        },
        {
            title: "Candidate Email",
            dataIndex: "candidate_email",
            key: "candidate_email",
            render: (text) => (
                <span className="text-gray-500 text-xs">{text}</span>
            ),
        },
        // {
        //     title: "Jobs Applied",
        //     dataIndex: "jobs",
        //     key: "jobs",
        //     render: (jobs) => (
        //         <Dropdown
        //             overlay={
        //                 <Menu className="rounded-xl p-2 shadow-xl border border-gray-100">
        //                     {jobs.map((job, index) => (
        //                         <Menu.Item
        //                             key={index}
        //                             className="hover:bg-gray-50 rounded-lg"
        //                         >
        //                             <div className="flex flex-col py-1">
        //                                 <span className="font-semibold text-sm">
        //                                     {job.job_title}
        //                                 </span>
        //                                 <Tag
        //                                     color={
        //                                         job.status === "selected"
        //                                             ? "green"
        //                                             : job.status === "rejected"
        //                                               ? "red"
        //                                               : "blue"
        //                                     }
        //                                     className="w-fit mt-1 text-[10px] font-bold uppercase rounded"
        //                                 >
        //                                     {job.status}
        //                                 </Tag>
        //                             </div>
        //                         </Menu.Item>
        //                     ))}
        //                 </Menu>
        //             }
        //         >
        //             {/* <Button className="rounded-lg font-bold text-xs flex items-center gap-2">
        //                 View Details <DownOutlined className="text-[10px]" />
        //             </Button> */}
        //         </Dropdown>
        //     ),
        // },
        {
            title: "Resume",
            dataIndex: "resume",
            key: "resume",
            render: (text) => (
                <Button
                    href={`${apiurl}/${text}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    type="link"
                    className="flex items-center gap-2 text-[#3B82F6] font-bold"
                >
                    <FilePdfOutlined /> View PDF
                </Button>
            ),
        },
        // {
        //     title: "Actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Button
        //             type="link"
        //             className="flex items-center gap-1.5 text-orange-500 font-bold hover:text-orange-600"
        //         >
        //             <EditOutlined /> Update
        //         </Button>
        //     ),
        // },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedKeys) => setSelectedRowKeys(newSelectedKeys),
        getCheckboxProps: (record) => ({
            disabled: !record.candidate_email,
            name: record.candidate_email,
        }),
    };

    const storagePercent = (storageUsed / storageLimit) * 100;

    return (
        <Main defaultSelectedKey="8">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Storage Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <HddOutlined className="text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#071C50]">
                                        Storage Space
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        Agency Resume Bank
                                    </p>
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-black text-[#071C50]">
                                        {storageUsed.toFixed(2)}{" "}
                                        <span className="text-xs text-gray-400 font-bold">
                                            MB
                                        </span>
                                    </span>
                                    <span className="text-xs text-gray-400 font-bold">
                                        of {storageLimit} MB
                                    </span>
                                </div>
                                <Progress
                                    percent={storagePercent}
                                    showInfo={false}
                                    strokeColor={
                                        storagePercent > 90
                                            ? "#EF4444"
                                            : "#1681FF"
                                    }
                                    trailColor="#F3F4F6"
                                    className="mb-0"
                                />
                                <p className="text-[10px] text-gray-500 mt-2">
                                    {storagePercent > 90
                                        ? "⚠️ Storage nearly full. Consider cleanup."
                                        : "Your storage is within healthy limits."}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 flex flex-col justify-center relative border-1 border-gray-100 shadow-sm overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-2xl text-black font-bold mb-2">
                                    Resume Bank
                                </h1>
                                <p className="text-black text-sm max-w-md">
                                    Manage all resumes collected across your
                                    organization. Search, view, and organize
                                    candidate data efficiently.
                                </p>
                            </div>
                            <div className="absolute right-10 bottom-10 text-9xl opacity-10">
                                <FilePdfOutlined />
                            </div>
                        </div>
                    </div>

                    <AgencyPieChart
                        applications={applications}
                        recruiters={recruiters}
                    />

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-[#071C50]">
                                Candidate Directory
                            </h3>
                            <div className="flex gap-3">
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        danger
                                        onClick={handleDelete}
                                        icon={<DeleteOutlined />}
                                        className="rounded-lg font-bold flex items-center"
                                    >
                                        Delete Selected (
                                        {selectedRowKeys.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="p-0">
                            <Table
                                rowKey="candidate_email"
                                columns={columns}
                                dataSource={data}
                                loading={loading}
                                rowSelection={rowSelection}
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    className: "p-4",
                                    onChange: (page, pageSize) => {
                                        fetchData(page, pageSize);
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default AgencyResumeBank;
