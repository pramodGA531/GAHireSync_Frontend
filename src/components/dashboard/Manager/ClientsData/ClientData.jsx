"use client";

import { useEffect, useState } from "react";
import Main from "../Layout";
import { Table, Input, Button, Dropdown, Menu } from "antd";
// import AllClients from "./AllClients";
import { useAuth } from "../../../common/useAuth";
import {
    SearchOutlined,
    DownOutlined,
    UserOutlined,
    CheckOutlined,
    HeartOutlined,
    SyncOutlined,
} from "@ant-design/icons";
// import "./ClientData.css";
import { useParams } from "react-router-dom";
import GoBack from "../../../common/Goback";

const ClientData = () => {
    const [searchText, setSearchText] = useState("");
    const { apiurl, token } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [jobs, setJobs] = useState([]);

    const { id } = useParams();

    const statsData = [
        {
            icon: <UserOutlined />,
            title: "Total Job Supports",
            value: "800+",
            date: "14-05-2025",
        },
        {
            icon: <CheckOutlined />,
            title: "No. Of Completed",
            value: "800+",
            date: "14-05-2025",
        },
        {
            icon: <SyncOutlined />,
            title: "No. Of Replacements",
            value: "800+",
            date: "14-05-2025",
        },
        {
            icon: <HeartOutlined />,
            title: "Client Satisfaction",
            value: "80%",
            date: "14-05-2025",
        },
    ];

    const formatData = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString();
    };

    // Table columns
    const columns = [
        { title: "Role", dataIndex: "job_title", key: "job_title" },
        { title: "No. of openings", dataIndex: "openings", key: "openings" },
        { title: "No. of completed", dataIndex: "joined", key: "joined" },
        { title: "No. of Pending", dataIndex: "pending", key: "pending" },
        {
            title: "No. of Processing",
            dataIndex: "processing",
            key: "processing",
        },
        {
            title: "Candidates Selected",
            dataIndex: "selected",
            key: "selected",
        },
        {
            title: "Candidates Rejected",
            dataIndex: "rejected",
            key: "rejected",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const isProcessing = status.toLowerCase() === "processing";
                return (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            isProcessing
                                ? "bg-[#E6F7FF] text-[#1890FF]"
                                : "bg-[#F6FFED] text-[#52C41A]"
                        }`}
                    >
                        {status}
                    </span>
                );
            },
        },
    ];

    // Filter menu
    const menu = (
        <Menu>
            <Menu.Item key="1">All</Menu.Item>
            <Menu.Item key="2">Processing</Menu.Item>
            <Menu.Item key="3">Closed</Menu.Item>
        </Menu>
    );

    useEffect(() => {
        if (id) {
            fetch(`${apiurl}/manager/clients-data/?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setClientData(data?.client_data);
                    setJobs(data?.jobs_data);
                })
                .catch((error) => {
                    console.error("Error fetching client data:", error);
                });
        }
    }, [id]);

    return (
        <Main defaultSelectedKey="5">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Client Information Card */}
                        <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 border border-[#E8E8E8]">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg text-[#333] font-semibold m-0">
                                    Client Information
                                </h2>
                                <span className="text-sm text-[#666]">
                                    Associate date:{" "}
                                    {formatData(clientData?.associated_at)}
                                </span>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Organization
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {clientData?.organization_name}
                                    </p>
                                </div>
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Designation
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        HR
                                    </p>
                                </div>
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Contact Number
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {clientData?.contact_number}
                                    </p>
                                </div>
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Website URL
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {clientData?.website_url}
                                    </p>
                                </div>
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Company pan
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        "NO PAN "
                                    </p>
                                </div>
                                <div className="basis-full sm:basis-1/2 md:basis-1/3 mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        GST Number
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {clientData?.gst_number}
                                    </p>
                                </div>
                                <div className="basis-full mb-[15px]">
                                    <h3 className="text-sm text-[#666] font-normal m-0 mb-[5px]">
                                        Company Address
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {clientData?.company_address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 border border-[#E8E8E8]">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg text-[#333] font-semibold m-0">
                                    Client Information
                                </h2>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between mb-[15px] gap-2.5">
                                <Input
                                    placeholder="Search"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    className="w-full sm:w-[300px]"
                                />
                                <Dropdown overlay={menu}>
                                    <Button className="flex items-center">
                                        Filters <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                            <Table
                                dataSource={jobs}
                                columns={columns}
                                pagination={false}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-5 lg:w-[300px]">
                        {statsData.map((stat, index) => (
                            <div
                                className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 flex flex-col items-center border border-[#E8E8E8] flex-1 min-w-[200px]"
                                key={index}
                            >
                                <div className="text-[#003366] text-xl mb-2.5">
                                    {stat.icon}
                                </div>
                                <div className="text-[#003366] text-sm mb-2.5 font-medium">
                                    {stat.title}
                                </div>
                                <div className="text-[#333] text-4xl font-bold mb-2.5">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-[#666] border-t border-[#F0F0F0] pt-2.5 w-full text-center">
                                    Day of update: {stat.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default ClientData;
