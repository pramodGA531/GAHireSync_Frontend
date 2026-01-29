import React, { useState, useEffect } from "react";
import { Select } from "antd";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const { Option } = Select;

const statusColors = {
    pending: "#3B82F6", // blue-500
    processing: "#06B6D4", // cyan-500
    selected: "#10B981", // emerald-500
    shortlisted: "#F59E0B", // amber-500
    rejected: "#EF4444", // red-500
    joined: "#8B5CF6", // violet-500
    left: "#94A3B8", // slate-400
    hold: "#6B7280", // gray-500
    closed: "#1F2937", // gray-800
};

const statusList = [
    "pending",
    "processing",
    "selected",
    "shortlisted",
    "rejected",
    "joined",
    "left",
    "hold",
    "closed",
];

const AgencyPieChart = ({ applications, recruiters }) => {
    const [selectedRecruiter, setSelectedRecruiter] = useState("all");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        console.log("AgencyPieChart Applications:", applications);
        if (selectedRecruiter === "all") {
            setFilteredData(applications);
        } else {
            setFilteredData(
                applications.filter(
                    (app) => app.attached_to === selectedRecruiter,
                ),
            );
        }
    }, [selectedRecruiter, applications]);

    // Count statuses
    const statusCounts = statusList.reduce((acc, status) => {
        acc[status] = filteredData.filter((app) => {
            const appStatus = (app.status || "").toLowerCase();
            // Map statuses
            if (status === "pending" && appStatus === "applied") return true;
            if (status === "closed" && appStatus === "job_closed") return true;
            return appStatus === status;
        }).length;
        return acc;
    }, {});

    console.log("Status Counts:", statusCounts);

    const chartData = Object.entries(statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            key: status,
        }));

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-[#071C50]">
                        Application Status Analytics
                    </h3>
                    <p className="text-sm text-gray-400">
                        Distribution of candidates across various stages
                    </p>
                </div>
                <Select
                    className="w-full md:w-80 h-10"
                    value={selectedRecruiter}
                    onChange={setSelectedRecruiter}
                    placeholder="Filter by Recruiter"
                >
                    <Option value="all">All Recruiters</Option>
                    {recruiters.map(([email, name]) => (
                        <Option key={email} value={email}>
                            {name} ({email})
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="h-[350px] w-full flex items-center justify-center">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            statusColors[entry.key] || "#8884d8"
                                        }
                                        className="outline-none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-gray-400 font-medium">
                        No data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgencyPieChart;
