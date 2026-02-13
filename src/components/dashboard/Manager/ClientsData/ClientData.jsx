"use client";

import { useEffect, useState } from "react";
import Main from "../Layout";
import { Table, Input, Button, Dropdown, Menu, Breadcrumb } from "antd";
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
import { useParams, Link } from "react-router-dom";
import GoBack from "../../../common/Goback";
import AppTable from "../../../common/AppTable";

const ClientData = () => {
    const [searchText, setSearchText] = useState("");
    const { apiurl, token } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [terms, setTerms] = useState([]);
    const [stats, setStats] = useState(null);
    const [communications, setCommunications] = useState([]);
    const { id } = useParams();

    const formatData = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString();
    };

    const formatDateWithTime = (date) => {
        if (!date) return "";
        const newDate = new Date(date);
        return newDate.toLocaleString();
    };

    const statsData = [
        {
            icon: <UserOutlined />,
            title: "Total Job Supports",
            value: stats?.total_openings || 0,
            date: formatData(new Date()),
        },
        {
            icon: <CheckOutlined />,
            title: "No. Of Completed",
            value: stats?.total_joined || 0,
            date: formatData(new Date()),
        },
        {
            icon: <SyncOutlined />,
            title: "No. Of Replacements",
            value: stats?.total_replaced || 0,
            date: formatData(new Date()),
        },
        {
            icon: <HeartOutlined />,
            title: "Client Satisfaction",
            value: `${stats?.satisfaction || 0}%`,
            date: formatData(new Date()),
        },
    ];

    // Table columns
    const columns = [
        { header: "Role", accessorKey: "job_title", searchField: true },
        { header: "No. of openings", accessorKey: "openings" },
        { header: "Joined On", accessorKey: "joined_at" },
        { header: "No. of Pending", accessorKey: "pending" },
        {
            header: "No. of Processing",
            accessorKey: "processing",
        },
        {
            header: "Candidates Selected",
            accessorKey: "selected",
        },
        {
            header: "Candidates Rejected",
            accessorKey: "rejected",
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ getValue }) => {
                const status = getValue();
                const isProcessing = status?.toLowerCase() === "processing";
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
    const communicationColumns = [
        { header: "Type", accessorKey: "type" },
        { header: "Event", accessorKey: "subject" },
        { header: "Message", accessorKey: "message" },
        {
            header: "Date & Time",
            accessorKey: "timestamp",
            cell: (info) => formatDateWithTime(info.getValue()),
        },
        { header: "Sender", accessorKey: "sender" },
    ];

    // Terms Table columns
    const termColumns = [
        { header: "CTC Range", accessorKey: "ctc_range", key: "ctc_range" },
        {
            header: "Service Fee",
            accessorKey: "service_fee",
            key: "service_fee",
            cell: ({ row }) => {
                const record = row.original;
                const fee = record.service_fee;
                return record.service_fee_type === "percentage"
                    ? `${fee}%`
                    : `₹${fee}`;
            },
        },
        {
            header: "Replacement Clause",
            accessorKey: "replacement_clause",
            key: "replacement_clause",
            cell: ({ getValue }) => `${getValue()} Days`,
        },
        {
            header: "Invoice After",
            accessorKey: "invoice_after",
            key: "invoice_after",
            cell: ({ getValue }) => `${getValue()} Days`,
        },
        {
            header: "Payment Within",
            accessorKey: "payment_within",
            key: "payment_within",
            cell: ({ getValue }) => `${getValue()} Days`,
        },
        {
            header: "Interest",
            accessorKey: "interest_percentage",
            key: "interest_percentage",
            cell: ({ getValue }) => `${getValue()}%`,
        },
    ];

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response = await fetch(
                    `${apiurl}/agency/terms_with_client/?id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();
                setTerms(data.terms || []);
            } catch (error) {
                console.error("Error fetching terms:", error);
                setTerms([]);
            }
        };

        fetchTerms();
    }, [id, token]);

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
                    setStats(data?.stats);
                })
                .catch((error) => {
                    console.error("Error fetching client data:", error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetch(`${apiurl}/manager/client-communications/?client_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setCommunications(data?.events || []);
                })
                .catch((error) => {
                    console.error("Error fetching communications:", error);
                });
        }
    }, [id, apiurl, token]);

    return (
        <Main defaultSelectedKey="5">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="mx-6 mt-4">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <Link
                                    to="/agency/allclients"
                                    className="text-gray-400 text-sm"
                                >
                                    All Clients
                                </Link>
                            ),
                        },
                        {
                            title: (
                                <span className="text-gray-800 text-sm font-medium">
                                    Client Details
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
            <div className="p-5">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 min-w-0 flex flex-col gap-5">
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
                                        {clientData?.designation}
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
                                        {clientData?.pan}
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
                            <AppTable
                                data={jobs}
                                columns={columns}
                                pagination={false}
                                className="w-full"
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 border border-[#E8E8E8]">
                            <div className="text-2xl font-bold">
                                Terms Agreed
                            </div>
                            <div className="m-2">
                                <AppTable
                                    columns={termColumns}
                                    data={terms}
                                    pagination={false}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5 border border-[#E8E8E8]">
                            <div className="text-2xl font-bold mb-4 uppercase text-[#003366]">
                                History & Communications
                            </div>
                            <div className="m-2">
                                <AppTable
                                    columns={communicationColumns}
                                    data={communications}
                                    pagination={true}
                                    pageSize={10}
                                    className="w-full"
                                    maxHeight="400px"
                                />
                            </div>
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
