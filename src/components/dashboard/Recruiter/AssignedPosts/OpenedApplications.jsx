import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import NoJobs from "../../../../images/Illustrations/NoActivities.png";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import {
    EyeOutlined,
    ProjectOutlined,
    TeamOutlined,
    CalendarOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { Tag, Button, Tooltip, Select } from "antd";
import GoBack from "../../../common/Goback";
const OpenedApplicationsRecruiter = () => {
    const [jobList, setJobList] = useState([]);
    const { apiurl, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [locationFilter, setLocationFilter] = useState("All");
    const navigate = useNavigate();

    const updateState = async () => {
        try {
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category: "assign_job" }),
                },
            );
            const data = await response.json();
            if (data.error) console.error(data.error);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchJobPosts();
        updateState();
    }, []);

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/recruiter/assigned-jobs/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setJobList(data.data);
        } catch (error) {
            console.error("Error fetching job posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = useMemo(() => {
        let result = jobList;

        // Apply Tab filtering (already done via data prop in AppTable, but moving it here for consistency)
        result = result.filter((job) => job.location_status === "opened");

        // Apply Search filter
        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            result = result.filter((job) =>
                Object.values(job).some(
                    (value) =>
                        typeof value === "string" &&
                        value.toLowerCase().includes(search),
                ),
            );
        }

        // Apply Location filter
        if (locationFilter !== "All") {
            result = result.filter((job) => job.location === locationFilter);
        }

        return result;
    }, [jobList, searchQuery, locationFilter]);

    const locationOptions = useMemo(() => {
        const locations = [
            ...new Set(jobList.map((job) => job.location).filter(Boolean)),
        ];
        return [
            { label: "All Locations", value: "All" },
            ...locations.map((loc) => ({ label: loc, value: loc })),
        ];
    }, [jobList]);

    const customFilters = (
        <Select
            value={locationFilter}
            onChange={setLocationFilter}
            options={locationOptions}
            style={{ width: 180 }}
            placeholder="Select Location"
        />
    );

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Opportunity",
            searchField: true,
            leftSticky: true,
            width: 250,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span
                        className="text-[#1681FF] font-bold text-sm cursor-pointer hover:underline flex items-center gap-2 group"
                        onClick={() =>
                            navigate(
                                `/recruiter/complete_job_post/${row.original.job_id}`,
                            )
                        }
                    >
                        <ProjectOutlined className="text-gray-400 group-hover:text-[#1681FF]" />
                        {row.getValue("job_title")}
                    </span>
                    {row.original.is_edited_by_client && (
                        <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 w-fit">
                            <InfoCircleOutlined className="text-amber-500 text-[10px]" />
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">
                                Pending Client Edit
                            </span>
                        </div>
                    )}
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                        ID: #{row.original.job_id}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "client_name",
            header: "Client",
            searchField: true,
            width: 180,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-gray-600 font-semibold text-xs">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "num_of_positions",
            header: "Positions / Location",
            sort: true,
            width: 200,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="text-gray-700 font-bold text-xs flex items-center gap-1.5">
                        <TeamOutlined className="text-blue-400" />{" "}
                        {row.original.num_of_positions} Openings
                    </span>
                    <span className="text-[10px] text-gray-400 font-black uppercase flex items-center gap-1.5">
                        <GlobalOutlined className="text-gray-300" />{" "}
                        {row.original.location}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            dateFilter: true,
            sort: true,
            width: 140,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                    <CalendarOutlined className="text-red-300" />
                    <span>{getValue()}</span>
                </div>
            ),
        },
        {
            accessorKey: "stats",
            header: "Stats",
            width: 220,
            cell: ({ row }) => (
                <div className="flex gap-1.5">
                    <Tooltip title="On Hold">
                        <div className="bg-amber-50 text-amber-600 text-[10px] font-black w-8 h-8 rounded-lg border border-amber-100 flex items-center justify-center">
                            {row.original.onhold || 0}
                        </div>
                    </Tooltip>
                    <Tooltip title="Rejected">
                        <div className="bg-red-50 text-red-600 text-[10px] font-black w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center">
                            {row.original.rejected || 0}
                        </div>
                    </Tooltip>
                    <Tooltip title="Pending">
                        <div className="bg-blue-50 text-[#1681FF] text-[10px] font-black w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center">
                            {row.original.pending || 0}
                        </div>
                    </Tooltip>
                    <Tooltip title="Selected">
                        <div className="bg-green-50 text-green-600 text-[10px] font-black w-8 h-8 rounded-lg border border-green-100 flex items-center justify-center">
                            {row.original.selected || 0}
                        </div>
                    </Tooltip>
                </div>
            ),
        },
        {
            accessorKey: "incoming",
            header: "New Candidates",
            sort: true,
            width: 180,
            cell: ({ row }) => (
                <div
                    onClick={() =>
                        navigate(
                            `/recruiter/incoming-applications/${row.original.assigned_id}/${row.original.location}`,
                        )
                    }
                    className="group cursor-pointer flex items-center gap-2"
                >
                    <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm group-hover:bg-blue-700 transition-colors">
                        {row.original.incoming || 0}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                        View Incoming
                    </span>
                </div>
            ),
        },
        {
            header: "Profiles",
            id: "resumes",
            width: 140,
            cell: ({ row }) => (
                <Button
                    size="small"
                    onClick={() =>
                        navigate(
                            `/recruiter/job-applications/${row.original.assigned_id}`,
                        )
                    }
                    className="rounded-lg bg-gray-50 border-gray-200 text-gray-500 font-bold text-[10px] uppercase hover:bg-white hover:text-[#1681FF] hover:border-[#1681FF] transition-all h-8"
                >
                    All Profiles
                </Button>
            ),
        },
        {
            header: "Actions",
            id: "actions",
            rightSticky: true,
            width: 180,
            cell: ({ row }) =>
                row.original.location_status === "opened" ? (
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(
                                `/recruiter/postings/opened/${row.original.assigned_id}`,
                            )
                        }
                        className="h-9 px-4 rounded-xl bg-[#1681FF] hover:bg-[#0061D5] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-50 border-none flex items-center gap-2"
                    >
                        Send Profiles{" "}
                        <ArrowRightOutlined className="text-[8px]" />
                    </Button>
                ) : (
                    <span className="bg-gray-100 text-gray-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-gray-200 cursor-not-allowed">
                        Location Closed
                    </span>
                ),
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            <div className="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            {/* <div className="-ml-6">
                                <GoBack />
                            </div> */}
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-[#071C50]">
                                    Active Jobs
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 font-medium tracking-tight">
                                Manage your currently assigned active job
                                postings.
                            </p>
                        </div>
                    </div>

                    {jobList.some((j) => j.is_edited_by_client) && (
                        <div className="mb-6 bg-linear-to-r from-amber-50 to-orange-50/30 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <InfoCircleOutlined className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-amber-900 font-black uppercase tracking-tight text-xs m-0">
                                    Action Required: Pending Job Edits
                                </h3>
                                <p className="text-amber-600 font-bold text-[10px] uppercase tracking-wider mt-0.5 m-0 opacity-80">
                                    Some jobs have pending client edit requests.
                                    Please hold on until the manager reacts.
                                </p>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <Pageloading />
                        </div>
                    ) : jobList && jobList.length > 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
                            <div className="flex flex-wrap gap-4 mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-amber-50 text-amber-600 text-[10px] font-black w-6 h-6 rounded-lg border border-amber-100 flex items-center justify-center">
                                        H
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        On Hold
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-red-50 text-red-600 text-[10px] font-black w-6 h-6 rounded-lg border border-red-100 flex items-center justify-center">
                                        R
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        Rejected
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-50 text-[#1681FF] text-[10px] font-black w-6 h-6 rounded-lg border border-blue-100 flex items-center justify-center">
                                        P
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        Pending
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-50 text-green-600 text-[10px] font-black w-6 h-6 rounded-lg border border-green-100 flex items-center justify-center">
                                        S
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        Selected
                                    </span>
                                </div>
                            </div>
                            <AppTable
                                data={filteredJobs}
                                columns={columns}
                                multiSelect={false}
                                onDeleteSelected={() => {}}
                                pageSize={10}
                                customFilters={customFilters}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                            <img
                                src={NoJobs}
                                alt="No Jobs"
                                className="w-64 opacity-20 mb-8 filter grayscale"
                            />
                            <h3 className="text-xl font-bold text-gray-400 mb-2">
                                No active assignments
                            </h3>
                            <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                New job opportunities will appear here once they
                                are assigned to your portfolio.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default OpenedApplicationsRecruiter;
