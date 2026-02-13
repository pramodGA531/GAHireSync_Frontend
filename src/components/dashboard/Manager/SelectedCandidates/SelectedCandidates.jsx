import React, { useState, useEffect } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message, Select } from "antd";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    CalendarOutlined,
    BankOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";
import GoBack from "../../../common/Goback";

const SelectedCandidates = () => {
    const [data, setData] = useState([]);
    const { token, apiurl } = useAuth();
    const [loading, setLoading] = useState(false);
    const [acceptanceFilter, setAcceptanceFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = React.useMemo(() => {
        if (acceptanceFilter === "All") return data;
        return data.filter(
            (item) =>
                item.candidate_acceptance?.toLowerCase() ===
                acceptanceFilter.toLowerCase(),
        );
    }, [data, acceptanceFilter]);

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Opportunity",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div
                    onClick={() =>
                        navigate(`/agency/postings/${row.original.id}`)
                    }
                    className="font-bold text-[#3B82F6] hover:underline cursor-pointer flex flex-col"
                >
                    {row.getValue("job_title")}
                </div>
            ),
        },
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            width: 200,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                        <UserOutlined />
                    </div>
                    <span className="font-semibold text-gray-700">
                        {row.getValue("candidate_name")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "client_name",
            header: "Client",
            searchField: true,
            width: 150,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <BankOutlined className="text-gray-400" />
                    <span className="text-sm">
                        {row.getValue("client_name")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "actual_ctc",
            header: "Offered CTC",
            width: 150,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-green-600 font-bold">
                    <DollarCircleOutlined />
                    <span>{row.getValue("actual_ctc")}</span>
                </div>
            ),
        },
        {
            accessorKey: "accepted_ctc",
            header: "Agreed CTC",
            width: 150,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                    <DollarCircleOutlined />
                    <span>{row.getValue("accepted_ctc")}</span>
                </div>
            ),
        },
        {
            accessorKey: "joining_date",
            header: "Joining Date",
            width: 180,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-gray-500">
                    <CalendarOutlined className="text-blue-400" />
                    <span className="text-sm">
                        {new Date(
                            row.getValue("joining_date"),
                        ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "candidate_acceptance",
            header: "Acceptance Status",
            width: 180,
            cell: ({ row }) => {
                const val = row.getValue("candidate_acceptance")?.toLowerCase();
                return (
                    <span
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                            val === "accepted"
                                ? "bg-green-50 text-green-600"
                                : val === "pending"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-red-50 text-red-600"
                        }`}
                    >
                        {val || "Unknown"}
                    </span>
                );
            },
        },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/selected-candidates/`,
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
                setData(result);
            }
        } catch (e) {
            message.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Main defaultSelectedKey="4">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                {/* <div className="-ml-6 -mt-1">
                    <GoBack />
                </div> */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#071C50]">
                                Success Placements
                            </h1>
                            <p className="text-sm text-gray-500">
                                Overview of candidates who have accepted offers
                                and their joining details.
                            </p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                            <UserOutlined className="text-blue-500" />
                            <span className="text-sm font-bold text-gray-700">
                                {data.length} Total Placements
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <Pageloading />
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-0">
                                <AppTable
                                    columns={columns}
                                    data={filteredData}
                                    customFilters={
                                        <Select
                                            value={acceptanceFilter}
                                            onChange={setAcceptanceFilter}
                                            style={{ width: 180 }}
                                            options={[
                                                {
                                                    label: "All Acceptance",
                                                    value: "All",
                                                },
                                                {
                                                    label: "Accepted",
                                                    value: "accepted",
                                                },
                                                {
                                                    label: "Pending",
                                                    value: "pending",
                                                },
                                                {
                                                    label: "Rejected",
                                                    value: "rejected",
                                                },
                                            ]}
                                        />
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default SelectedCandidates;
