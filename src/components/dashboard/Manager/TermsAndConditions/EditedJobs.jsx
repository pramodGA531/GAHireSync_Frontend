import React, { useState, useEffect } from "react";
import { Button, Tag } from "antd";
import {
    EditOutlined,
    BankOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import NoDataFound from "../../../../images/Illustrations/NoDataFound-2.png";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../common/Goback";

const EditedJobs = () => {
    const [data, setData] = useState([]);
    const { apiurl, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/org-edit-jobpost/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching job edit requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            accessorKey: "client_name",
            header: "Requester",
            width: 180,
            cell: ({ row }) => (
                <span className="font-bold text-[#071C50]">
                    {row.getValue("client_name")}
                </span>
            ),
        },
        {
            accessorKey: "job_title",
            header: "Job Opportunity",
            width: 250,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[#3B82F6]">
                        {row.getValue("job_title")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
                        Pending Approval
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "organization_name",
            header: "Organization",
            width: 200,
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <BankOutlined className="text-gray-400" />
                    <span className="text-sm">
                        {row.getValue("organization_name")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            width: 150,
            cell: ({ row }) => {
                const status = row.getValue("status")?.toLowerCase();
                return (
                    <Tag
                        color={status === "pending" ? "gold" : "blue"}
                        className="rounded-full px-3 font-bold uppercase text-[10px]"
                    >
                        {row.getValue("status")}
                    </Tag>
                );
            },
        },
        {
            accessorKey: "id",
            header: "Action",
            width: 180,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    onClick={() =>
                        navigate(`/agency/postings/${row.original.id}`)
                    }
                    className="flex items-center gap-2 bg-[#1681FF] text-white border-none font-bold text-xs rounded-lg hover:bg-[#0061D5]"
                >
                    <EditOutlined /> Review Changes
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="6" defaultSelectedChildKey="6-2">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="-ml-6 -mt-2">
                    <GoBack />
                </div>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#071C50]">
                            Job Post Edit Requests
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Clients may request edits to existing job postings.
                            Review and approve these modifications here.
                        </p>
                    </div>

                    {loading ? (
                        <Pageloading />
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                            {data && data.length > 0 ? (
                                <AppTable
                                    columns={columns}
                                    data={data}
                                    rowKey="id"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-20 text-center">
                                    <img
                                        src={NoDataFound}
                                        alt="No Data"
                                        className="w-64 opacity-50 mb-6"
                                    />
                                    <h3 className="text-lg font-bold text-gray-400">
                                        No Edit Requests
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        Clients haven't requested any changes to
                                        their job postings yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default EditedJobs;
