import React, { useEffect, useState, useCallback } from "react";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import { ticketService } from "../../../service/TicketsService";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
    ContainerOutlined,
    CheckCircleOutlined,
    // TicketOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { Tag, Spin, Empty, Button } from "antd";

const Admin = () => {
    const { userData } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ticketService.getTickets(null);
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Unable to sync tickets", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const stats = {
        total: tickets.length,
        closed: tickets.filter((t) =>
            ["Closed", "Completed"].includes(t.current_status),
        ).length,
        processing: tickets.filter((t) =>
            ["Processing", "In Progress"].includes(t.current_status),
        ).length,
        pending: tickets.filter(
            (t) =>
                !["Processing", "In Progress", "Closed", "Completed"].includes(
                    t.current_status,
                ),
        ).length,
    };

    const recentTickets = [...tickets]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    return (
        <Main defaultSelectedKey={1}>
            <div className="p-6 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        Welcome back, {userData?.username || "Admin"} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here is an overview of the support tickets and system
                        status.
                    </p>
                </div>

                {loading && tickets.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {/* Stats Widgets */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <p className="text-[12px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                                        Total Tickets
                                    </p>
                                    <p className="text-[32px] font-black text-gray-900 leading-none">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <ContainerOutlined className="text-xl text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <p className="text-[12px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                                        Pending
                                    </p>
                                    <p className="text-[32px] font-black text-gray-900 leading-none">
                                        {stats.pending}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                    <ClockCircleOutlined className="text-xl text-red-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <p className="text-[12px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                                        Processing
                                    </p>
                                    <p className="text-[32px] font-black text-gray-900 leading-none">
                                        {stats.processing}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                    <SyncOutlined className="text-xl text-orange-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <p className="text-[12px] text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                                        Closed
                                    </p>
                                    <p className="text-[32px] font-black text-gray-900 leading-none">
                                        {stats.closed}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                    <CheckCircleOutlined className="text-xl text-green-500" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Tickets Section */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 m-0">
                                        Recent Tickets
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Latest support requests from the
                                        external system
                                    </p>
                                </div>
                                <Button
                                    type="link"
                                    onClick={() => navigate("/admin/tickets")}
                                    className="text-blue-600 font-semibold p-0 flex items-center gap-1 hover:text-blue-700"
                                >
                                    View All{" "}
                                    <ArrowRightOutlined className="text-xs" />
                                </Button>
                            </div>

                            <div className="p-0">
                                {recentTickets.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {recentTickets.map((ticket, index) => (
                                            <div
                                                key={ticket.task_code || index}
                                                className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1">
                                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-wider border border-blue-100">
                                                            {ticket.task_code}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-gray-900 mb-1">
                                                            {ticket.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <ClockCircleOutlined />
                                                                {ticket.created_at
                                                                    ? format(
                                                                          new Date(
                                                                              ticket.created_at,
                                                                          ),
                                                                          "MMM d, yyyy h:mm a",
                                                                      )
                                                                    : "N/A"}
                                                            </span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="truncate max-w-xs">
                                                                {ticket.description ||
                                                                    "No description provided"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center md:justify-end shrink-0 pl-16 md:pl-0">
                                                    <Tag
                                                        className={`text-xs m-0 border-none px-3 py-1 rounded-lg capitalize font-bold shadow-sm ${
                                                            [
                                                                "Processing",
                                                                "In Progress",
                                                            ].includes(
                                                                ticket.current_status,
                                                            )
                                                                ? "bg-orange-100 text-orange-700"
                                                                : [
                                                                        "Closed",
                                                                        "Completed",
                                                                    ].includes(
                                                                        ticket.current_status,
                                                                    )
                                                                  ? "bg-green-100 text-green-700"
                                                                  : "bg-blue-100 text-blue-700"
                                                        }`}
                                                    >
                                                        {ticket.current_status ||
                                                            ticket.status ||
                                                            "Received"}
                                                    </Tag>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center">
                                        <Empty
                                            description={
                                                <span className="text-gray-400 font-medium text-sm">
                                                    No recent tickets available
                                                </span>
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Main>
    );
};

export default Admin;
