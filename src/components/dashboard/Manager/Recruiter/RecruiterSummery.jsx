import React, { useEffect, useState } from "react";
import InterviewCalendar from "../managercards/InterviewCalendar";
import { UserOutlined } from "@ant-design/icons";
import { message, Button, Tabs } from "antd";
import RctrSummerCards from "./rctr-cards/RctrSummerCards";
import Main from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import GoBack from "../../../common/Goback";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

const RecruiterSummary = ({ tableData, cardsData, loading, id }) => {
    const navigate = useNavigate();

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job & Location",
            searchField: true,
            width: 300,
            cell: ({ row }) => (
                <div
                    onClick={() =>
                        navigate(`/agency/postings/${row.original.job_id}`)
                    }
                    className="font-bold text-[#3B82F6] hover:underline cursor-pointer flex flex-col"
                >
                    <span>{row.getValue("job_title")}</span>
                    <span className="text-xs text-gray-400 font-normal">
                        {row.original.location}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "positions",
            header: "Vacancies",
            width: 120,
            cell: ({ row }) => (
                <span className="font-semibold text-gray-700">
                    {row.getValue("positions")}
                </span>
            ),
        },
        {
            accessorKey: "application_count",
            header: "App. Sent",
            width: 150,
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
                    <UserOutlined /> {row.getValue("application_count")}
                </span>
            ),
        },
        {
            accessorKey: "joined",
            header: "Joined",
            width: 120,
            cell: ({ row }) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 font-bold text-xs">
                    {row.getValue("joined")}
                </span>
            ),
        },
        {
            accessorKey: "dead_line",
            header: "Date Expired",
            width: 180,
            cell: ({ row }) => (
                <span className="text-gray-500 text-xs">
                    {new Date(row.getValue("dead_line")).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "Action",
            accessorKey: "view_applications",
            width: 180,
            cell: ({ row }) => (
                <Button
                    className="bg-[#1681FF] text-white border-none hover:bg-[#0061D5] font-bold text-xs"
                    size="small"
                    onClick={() =>
                        navigate(
                            `/agency/jobresponses/${row.original.job_id}/${id}`,
                        )
                    }
                >
                    View Apps
                </Button>
            ),
        },
    ];

    return (
        <div className="w-full">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="flex flex-col gap-6">
                    <RctrSummerCards cardsData={cardsData} />

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#071C50]">
                                Active Assignments
                            </h3>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            {tableData && (
                                <AppTable
                                    columns={columns}
                                    data={tableData}
                                    className="job-listing-table"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RecruiterSummaryLayout = () => {
    const [tableData, setTableData] = useState(null);
    const [interviews, setInterviews] = useState(null);
    const [cardsData, setCardsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const { apiurl, token } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/recruiter-summary/?rctr_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                console.error(data.error);
                return;
            }
            setCardsData(data?.cards_data);
            setTableData(data?.jobs_data);
            setInterviews(data?.interviews);
        } catch (e) {
            console.error(e);
            message.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && id) {
            fetchData();
        }
    }, [id, token]);

    const items = [
        {
            key: "1",
            label: <span className="px-4 font-bold">Summary</span>,
            children: (
                <RecruiterSummary
                    tableData={tableData}
                    cardsData={cardsData}
                    loading={loading}
                    id={id}
                />
            ),
        },
        {
            key: "2",
            label: <span className="px-4 font-bold">Interview Calendar</span>,
            children: <InterviewCalendar interviews={interviews} />,
        },
    ];

    return (
        <Main defaultSelectedKey="3">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="mx-6 mt-4">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <Link
                                    to="/agency/recruiters"
                                    className="text-gray-400 text-sm"
                                >
                                    Recruiters
                                </Link>
                            ),
                        },
                        {
                            title: (
                                <span className="text-gray-800 text-sm font-medium">
                                    Recruiter Summary
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <Tabs
                        centered
                        defaultActiveKey="1"
                        items={items}
                        type="line"
                        className="premium-tabs"
                    />
                </div>
            </div>
        </Main>
    );
};

export default RecruiterSummaryLayout;
