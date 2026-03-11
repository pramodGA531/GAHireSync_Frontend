import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeftOutlined,
    UserOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import { Button, Tag, message, Select, Input, Tooltip, Breadcrumb } from "antd";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";
import Pageloading from "../../../common/loading/Pageloading";

const JobApplicantsTable = () => {
    const { jobId, stage } = useParams();
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [selectedStage, setSelectedStage] = useState(stage || "Applied");
    const [searchText, setSearchText] = useState("");

    const stages = [
        { label: "Applied", display: "Profiles Sent", color: "#EAB308" },
        { label: "Shortlisted", display: "Shortlisted", color: "#22C55E" },
        { label: "Processing", display: "Processing", color: "#A855F7" },
        { label: "on-Hold", display: "on-Hold", color: "#84CC16" },
        { label: "Rejected", display: "Rejected", color: "#EF4444" },
        { label: "Selected", display: "Selected", color: "#3B82F6" },
        { label: "Joined", display: "Joined", color: "#10B981" },
        { label: "Replaced", display: "Replaced", color: "#F97316" },
    ];

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/job-applicants-details/?job_id=${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (response.ok) {
                setApplications(data.applications_list || []);
                // If we have at least one application, we can extract job title
                if (
                    data.applications_list &&
                    data.applications_list.length > 0
                ) {
                    setJobDetails({
                        title: data.applications_list[0].job_title,
                        dept: data.applications_list[0].job_department,
                    });
                }
            } else {
                message.error(data.detail || "Failed to fetch applications");
            }
        } catch (error) {
            message.error("An error occurred while fetching applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && jobId) {
            fetchApplications();
        }
    }, [token, jobId]);

    useEffect(() => {
        if (stage) {
            setSelectedStage(stage);
        }
    }, [stage]);

    const filteredData = useMemo(() => {
        return applications.filter((app) => {
            const appStatus = app.application_status?.toLowerCase() || "";
            let matchesStage = false;

            if (selectedStage === "All" || selectedStage === "Applied") {
                // 'Applied' section (Profiles Sent) should show all candidates regardless of status
                matchesStage = true;
            } else if (selectedStage === "on-Hold") {
                matchesStage = appStatus === "hold";
            } else {
                matchesStage = appStatus === selectedStage.toLowerCase();
            }

            const matchesSearch = app.candidate_name
                ?.toLowerCase()
                .includes(searchText.toLowerCase());
            return matchesStage && matchesSearch;
        });
    }, [applications, selectedStage, searchText]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                header: "candidate name",
                accessorKey: "candidate_name",
                width: 250,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                            {row.original.candidate_name.charAt(0)}
                        </div>
                        <span
                            className="font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 hover:underline"
                            onClick={() =>
                                navigate(
                                    `/agency/view_candidate?candidate_id=${row.original.candidate_id}&job_id=${jobId}`,
                                )
                            }
                        >
                            {row.original.candidate_name}
                        </span>
                    </div>
                ),
            },
            {
                header: "Delivered by",
                accessorKey: "delivered_by",
                width: 200,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-400" />
                        <span className="text-gray-600">
                            {row.original.delivered_by || "Self Applied"}
                        </span>
                    </div>
                ),
            },
        ];

        if (selectedStage === "Processing") {
            baseColumns.push({
                header: "Processing round",
                accessorKey: "round_num",
                width: 150,
                cell: ({ row }) => {
                    const round = row.original.round_num;
                    return (
                        <span className="text-gray-500 font-medium">
                            {round ? String(round).padStart(2, "0") : "01"}
                        </span>
                    );
                },
            });
        } else {
            baseColumns.push(
                {
                    header: "Stage Status",
                    accessorKey: "application_status",
                    width: 180,
                    cell: ({ row }) => {
                        const status = row.original.application_status;
                        const stageConfig = stages.find(
                            (s) =>
                                s.label.toLowerCase() === status.toLowerCase(),
                        ) || { color: "default" };
                        return (
                            <Tag
                                color={stageConfig.color}
                                className="rounded-full px-4 py-0.5 border-none font-medium uppercase text-[10px] tracking-wider"
                            >
                                {status}
                            </Tag>
                        );
                    },
                },
                {
                    header: "Last Updated",
                    accessorKey: "last_updated",
                    width: 180,
                    cell: ({ row }) => (
                        <span className="text-gray-500 text-sm">
                            {row.original.last_updated
                                ? new Date(
                                      row.original.last_updated,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </span>
                    ),
                },
            );
        }

        // Profile / Action Column
        baseColumns.push({
            header: "Profile",
            width: 180,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    className="flex items-center justify-center border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-600 rounded-md px-4 py-1 h-auto text-xs uppercase tracking-wide transition-colors"
                    onClick={() =>
                        navigate(
                            `/agency/view_candidate?candidate_id=${row.original.candidate_id}&job_id=${jobId}`,
                        )
                    }
                >
                    view Profile
                </Button>
            ),
        });

        return baseColumns;
    }, [selectedStage, navigate]);

    const HeaderSection = () => (
        <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Breadcrumb
                    items={[
                        {
                            title: "Dashboard",
                            onClick: () => navigate("/agency"),
                        },
                        {
                            title: "Jobs",
                            onClick: () => navigate("/agency/jobs"),
                        },
                        { title: jobDetails?.title || "Job Details" },
                    ]}
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/agency/jobs")}
                        className="rounded-xl h-12 w-12 flex items-center justify-center border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 m-0">
                            {jobDetails?.title || "Loading Job..."}
                        </h1>
                        <p className="text-gray-500 m-0 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            {jobDetails?.dept || "Recruitment"} • Applicants
                            Details
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        {stages.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => setSelectedStage(s.label)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    selectedStage === s.label
                                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {s.display}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
                    <HeaderSection />

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Input
                                    prefix={
                                        <SearchOutlined className="text-gray-400" />
                                    }
                                    placeholder="Search by candidate name..."
                                    className="w-80 rounded-xl border-gray-200"
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    allowClear
                                />
                                <div className="h-4 w-px bg-gray-200 mx-2" />
                                <span className="text-gray-500 text-sm font-medium">
                                    Total: {filteredData.length} Candidates
                                </span>
                            </div>
                        </div>

                        <AppTable
                            columns={columns}
                            data={filteredData}
                            pageSize={10}
                        />
                    </div>
                </div>
            )}
        </Main>
    );
};

export default JobApplicantsTable;
