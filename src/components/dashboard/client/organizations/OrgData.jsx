"use client";

import { useEffect, useState } from "react";
import Main from "../Layout";
import { Table, Input, Button, Dropdown, Menu, Breadcrumb } from "antd";
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
import { useParams, Link } from "react-router-dom";
import GoBack from "../../../common/Goback";
const OrgData = () => {
    const [searchText, setSearchText] = useState("");

    const { apiurl, token } = useAuth();
    const [totalData, setTotalData] = useState(null);

    const { id } = useParams();

    // Stats data
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

    // Table columns
    const columns = [
        { title: "Role", dataIndex: "job_title", key: "job_title" },
        {
            title: "No. of openings",
            dataIndex: "number_of_openings",
            key: "number_of_openings",
        },
        {
            title: "No. of completed",
            dataIndex: "candidates_selected",
            key: "candidates_selected",
        },
        {
            title: "No. of Processing",
            dataIndex: "candidates_processing",
            key: "candidates_processing",
        },
        { title: "No. of Pending", dataIndex: "pending", key: "pending" },
        {
            title: "Candidates Rejected",
            dataIndex: "rejected",
            key: "rejected",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span
                    className={`px-2 py-1 rounded text-xs ${
                        status?.toLowerCase() === "processing"
                            ? "bg-[#e6f7ff] text-[#1890ff]"
                            : status?.toLowerCase() === "closed"
                              ? "bg-[#f6ffed] text-[#52c41a]"
                              : ""
                    }`}
                >
                    {status}
                </span>
            ),
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
            fetch(`${apiurl}/client/orgs-data/?id=${id}`, {
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
                    setTotalData(data);
                })
                .catch((error) => {
                    console.error("Error fetching client data:", error);
                });
        }
    }, [id]);

    return (
        <Main defaultSelectedKey="9">
            
            <div className="p-5">
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <Link to="/client/organizations">
                                        Organizations
                                    </Link>
                                ),
                            },
                            {
                                title: "Organization Details",
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-row gap-5 max-lg:flex-col">
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Client Information Card */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg text-[#333] font-semibold m-0">
                                    Organization Information
                                </h2>
                                <span className="text-sm text-[#666]">
                                    Associate date: "20-10-2025"
                                </span>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Organization
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.organization_name}
                                    </p>
                                </div>
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Designation
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        CEO
                                    </p>
                                </div>
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Contact Number
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.contact_number}
                                    </p>
                                </div>
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Website URL
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.website_url}
                                    </p>
                                </div>
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Company pan
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.pan}
                                    </p>
                                </div>
                                <div className="basis-1/3 mb-4 max-md:basis-1/2 max-sm:basis-full text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        GST Number
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.gst}
                                    </p>
                                </div>
                                <div className="basis-full mb-4 text-left">
                                    <h3 className="text-sm text-[#666] mb-1 font-normal">
                                        Company Address
                                    </h3>
                                    <p className="text-sm text-[#333] m-0">
                                        {totalData?.company_address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg text-[#333] font-semibold m-0">
                                    Organization Information
                                </h2>
                            </div>
                            <div className="flex justify-between mb-4 max-sm:flex-col max-sm:gap-2.5">
                                <Input
                                    placeholder="Search"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    className="w-[300px] max-sm:w-full"
                                />
                                <Dropdown overlay={menu}>
                                    <Button className="flex items-center rounded">
                                        Filters <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </div>
                            <Table
                                dataSource={totalData?.jobs}
                                columns={columns}
                                pagination={false}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex flex-col gap-5 w-[300px] max-lg:w-full max-lg:flex-row max-lg:flex-wrap max-md:flex-col">
                        {statsData.map((stat, index) => (
                            <div
                                className="bg-white rounded-lg shadow-sm p-5 flex flex-col items-center border border-gray-200 max-lg:flex-1 max-lg:min-w-[200px]"
                                key={index}
                            >
                                <div className="text-[#003366] text-xl mb-2.5">
                                    {stat.icon}
                                </div>
                                <div className="text-[#003366] text-sm mb-2.5 font-medium text-center">
                                    {stat.title}
                                </div>
                                <div className="text-[#333] text-4xl font-bold mb-2.5">
                                    {stat.value}
                                </div>
                                <div className="text-[#666] text-xs border-t border-[#f0f0f0] pt-2.5 w-full text-center">
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

export default OrgData;
