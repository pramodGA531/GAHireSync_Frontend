import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message, Tag } from "antd";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import {
    SyncOutlined,
    UserOutlined,
    CalendarOutlined,
    GlobalOutlined,
    WarningOutlined,
    SafetyCertificateOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons";
import GoBack from "../../../common/Goback";
const ReplacementsRecruiter = () => {
    const { apiurl, token } = useAuth();
    const [replacements, setReplacements] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/recruiter/replacements/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setReplacements(data.data || []);
        } catch (e) {
            message.error("Failed to sync replacement registry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const columns = [
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 200,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-[10px] border border-red-100">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-[#071C50] font-bold text-xs">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "job_title",
            header: "Job",
            searchField: true,
            width: 220,
            cell: ({ getValue }) => (
                <div className="flex flex-col">
                    <span className="text-gray-600 font-bold text-[11px] tracking-tight">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "joining_date",
            header: "Timeline",
            dateFilter: true,
            width: 200,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px]">
                        <span className="text-gray-300 uppercase tracking-tighter">
                            Joined:
                        </span>{" "}
                        {row.getValue("joining_date")
                            ? new Date(
                                  row.getValue("joining_date")
                              ).toLocaleDateString()
                            : "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-red-500 font-black text-[10px]">
                        <span className="text-red-300 uppercase tracking-tighter">
                            Left:
                        </span>{" "}
                        {row.original.left_on
                            ? new Date(
                                  row.original.left_on
                              ).toLocaleDateString()
                            : "N/A"}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "left_reason",
            header: "Reason",
            width: 250,
            cell: ({ getValue }) => (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <WarningOutlined className="text-amber-500 mt-0.5" />
                    <p className="text-slate-500 text-[10px] font-medium leading-tight italic line-clamp-2">
                        " {getValue() || "No reason provided."} "
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "replacement_status",
            header: "Status",
            width: 160,
            cell: ({ getValue }) => (
                <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        getValue()?.toLowerCase() === "completed"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
                    }`}
                >
                    {getValue() || "Pending"}
                </span>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="5">
            <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="-ml-8">
                                <GoBack />
                            </div>
                            <h1 className="text-3xl font-black text-[#071C50] tracking-tight mb-2 uppercase">
                                Replacements
                            </h1>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Manage replacements for terminated candidates
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#071C50] flex items-center justify-center text-white shadow-lg shadow-blue-50">
                                <SyncOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Requests
                                </p>
                                <p className="text-[#071C50] font-black text-lg">
                                    {replacements.length}{" "}
                                    <span className="text-sm text-gray-400 font-bold">
                                        Replacements
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading && replacements.length === 0 ? (
                        <div className="h-96 flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <AppTable
                                columns={columns}
                                data={replacements}
                                pageSize={15}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default ReplacementsRecruiter;
