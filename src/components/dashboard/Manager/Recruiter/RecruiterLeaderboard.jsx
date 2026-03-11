import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../../../common/useAuth";
import Layout from "../Layout";
import AppTable from "../../../common/AppTable";

const RecruiterLeaderboard = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [timeFilter, setTimeFilter] = useState("30days");
    const [loading, setLoading] = useState(false);
    const { token, apiurl } = useAuth();

    useEffect(() => {
        const fetchRecruiters = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${apiurl}/org/get-recruiters/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            time_filter: timeFilter,
                        },
                    },
                );
                if (response.data && response.data.data) {
                    const recruiterOnly = response.data.data.filter(
                        (r) => r.role === "recruiter",
                    );
                    setRecruiters(recruiterOnly);
                }
            } catch (error) {
                console.error("Error fetching recruiters:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRecruiters();
        }
    }, [token, apiurl, timeFilter]);

    const columns = useMemo(
        () => [
            {
                header: "S/No",
                cell: (info) => info.row.index + 1,
                width: 60,
            },
            {
                header: "Recruiter Name",
                accessorKey: "name",
                searchField: true,
                width: 180,
                cell: (info) => (
                    <span className="font-medium text-gray-800">
                        {info.getValue()}
                    </span>
                ),
            },
            {
                header: "Profile Status",
                id: "profileStatus",
                width: 380,
                cell: ({ row }) => {
                    const r = row.original;
                    const statusConfig = [
                        {
                            label: "Profiles Sent",
                            value: r.profiles_sent,
                            color: "#F59E0B",
                            bg: "#FFFBEB",
                        },
                        {
                            label: "Shortlisted (R1)",
                            value: r.shortlisted,
                            color: "#22C55E",
                            bg: "#F0FDF4",
                        },
                        {
                            label: "Processing (R2+)",
                            value: r.processing,
                            color: "#A855F7",
                            bg: "#FAF5FF",
                        },
                        {
                            label: "on-Hold",
                            value: r.on_hold,
                            color: "#84CC16",
                            bg: "#F7FEE7",
                        },
                        {
                            label: "Rejected",
                            value: r.rejected,
                            color: "#EF4444",
                            bg: "#FEF2F2",
                        },
                        {
                            label: "Selected",
                            value: r.selected,
                            color: "#3B82F6",
                            bg: "#EFF6FF",
                        },
                        {
                            label: "Replaced",
                            value: r.replaced,
                            color: "#F97316",
                            bg: "#FFF7ED",
                        },
                        {
                            label: "Joined",
                            value: r.joined,
                            color: "#14B8A6",
                            bg: "#F0FDFA",
                        },
                    ];
                    return (
                        <div className="flex flex-wrap gap-1.5">
                            {statusConfig.map((s, idx) => (
                                <span
                                    key={idx}
                                    className="w-8 h-8 flex items-center justify-center border rounded-lg font-bold text-[11px] shrink-0 transition-transform hover:scale-110 cursor-help"
                                    style={{
                                        borderColor: s.color,
                                        backgroundColor: s.bg,
                                        color: s.color,
                                    }}
                                    title={`${s.label}: ${s.value || 0}`}
                                >
                                    {s.value || 0}
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                header: "Target (INR)",
                accessorKey: "target_in_rupees",
                width: 130,
                cell: (info) => {
                    const val = info.getValue();
                    return val > 0
                        ? `₹${parseFloat(val).toLocaleString()}`
                        : "NA";
                },
            },
            {
                header: "Reached (INR)",
                accessorKey: "invoiced_amount",
                width: 130,
                cell: ({ row }) => {
                    const reached = parseFloat(
                        row.original.invoiced_amount || 0,
                    );
                    const target = parseFloat(
                        row.original.target_in_rupees || 0,
                    );

                    let textColor = "text-orange-500";
                    if (!target) textColor = "text-gray-500";
                    else if (reached > target) textColor = "text-green-600";
                    else if (reached < target) textColor = "text-red-600";

                    return (
                        <span className={`font-semibold ${textColor}`}>
                            {target > 0 ? `₹${reached.toLocaleString()}` : "NA"}
                        </span>
                    );
                },
            },
            {
                header: "Target (Profiles)",
                accessorKey: "target_in_positions",
                width: 150,
                cell: (info) => (info.getValue() > 0 ? info.getValue() : "NA"),
            },
            {
                header: "Reached (Profiles)",
                accessorKey: "reached_in_positions",
                width: 160,
                cell: ({ row }) => {
                    const reached = row.original.reached_in_positions || 0;
                    const target = row.original.target_in_positions || 0;

                    let textColor = "text-orange-500";
                    if (!target) textColor = "text-gray-500";
                    else if (reached > target) textColor = "text-green-600";
                    else if (reached < target) textColor = "text-red-600";

                    return (
                        <span className={`font-semibold ${textColor}`}>
                            {target > 0 ? reached : "NA"}
                        </span>
                    );
                },
            },
            // {
            //     header: "Invoiced (INR)",
            //     accessorKey: "invoiced_amount",
            //     width: 130,
            //     cell: (info) => (
            //         <span className="font-semibold text-blue-600">
            //             ₹{parseFloat(info.getValue() || 0).toLocaleString()}
            //         </span>
            //     ),
            // },
            {
                header: "Rank (Income)",
                accessorKey: "income_rank",
                width: 130,
                cell: (info) => {
                    const val = info.getValue();
                    if (val === "NA" || val === undefined)
                        return <span className="text-gray-400">-</span>;
                    return (
                        <div className="text-center">
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-bold">
                                {val}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: "Rank (Pos.)",
                accessorKey: "position_rank",
                width: 130,
                cell: (info) => {
                    const val = info.getValue();
                    if (val === "NA" || val === undefined)
                        return <span className="text-gray-400">-</span>;
                    return (
                        <div className="text-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">
                                {val}
                            </span>
                        </div>
                    );
                },
            },
            // {
            //     header: "Rank (Overall)",
            //     accessorKey: "overall_rank",
            //     width: 120,
            //     rightSticky: true,
            //     cell: (info) => {
            //         const val = info.getValue();
            //         if (val === "NA" || val === undefined)
            //             return <span className="text-gray-400">-</span>;
            //         return (
            //             <div className="text-center">
            //                 <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-bold shadow-sm border border-orange-200">
            //                     {val}
            //                 </span>
            //             </div>
            //         );
            //     },
            // },
        ],
        [],
    );

    return (
        <Layout defaultSelectedKey="3" defaultSelectedChildKey="3-2">
            <div className="p-6 bg-white rounded-lg shadow-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Recruiter Leaderboard
                </h2>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    {[
                        { label: "Profiles Sent", color: "#F59E0B" },
                        { label: "Shortlisted (R1)", color: "#22C55E" },
                        { label: "Processing (R2+)", color: "#A855F7" },
                        { label: "on-Hold", color: "#84CC16" },
                        { label: "Rejected", color: "#EF4444" },
                        { label: "Selected", color: "#3B82F6" },
                        { label: "Replaced", color: "#F97316" },
                        { label: "Joined", color: "#14B8A6" },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 group transition-all duration-200"
                        >
                            <div
                                className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-125"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-800 transition-colors cursor-default">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <AppTable
                    data={recruiters}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    customFilters={
                        <select
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <option value="all">All Time</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="6months">Last 6 Months</option>
                            <option value="1year">Last 1 Year</option>
                        </select>
                    }
                />
            </div>
        </Layout>
    );
};

export default RecruiterLeaderboard;
