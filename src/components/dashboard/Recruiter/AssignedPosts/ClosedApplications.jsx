import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import NoJobs from "../../../../images/Illustrations/NoActivities.png";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import {
    ProjectOutlined,
    TeamOutlined,
    CalendarOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
    LockOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { Tag, Button, Tooltip, Select } from "antd";
import GoBack from "../../../common/Goback";
const ClosedApplicationsRecruiter = () => {
    const [jobList, setJobList] = useState([]);
    const { apiurl, token } = useAuth();
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
                    body: JSON.stringify({
                        category: "assign_job",
                    }),
                },
            );
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
            }
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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

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

        // Apply Tab filtering (Closed/Archived)
        result = result.filter((job) => job.location_status !== "opened");

        // Apply Location filter
        if (locationFilter !== "All") {
            result = result.filter((job) => job.location === locationFilter);
        }

        return result;
    }, [jobList, locationFilter]);

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
                <div className="flex flex-col opacity-75">
                    <span
                        className="text-gray-500 font-bold text-sm cursor-pointer hover:underline flex items-center gap-2 group"
                        onClick={() =>
                            navigate(
                                `/recruiter/complete_job_post/${row.original.job_id}`,
                            )
                        }
                    >
                        <LockOutlined className="text-gray-400" />
                        {row.getValue("job_title")}
                    </span>
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
                <div className="flex items-center gap-2 opacity-75">
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
                <div className="flex flex-col gap-1 opacity-75">
                    <span className="text-gray-700 font-bold text-xs flex items-center gap-1.5">
                        <TeamOutlined className="text-gray-400" />{" "}
                        {row.original.num_of_positions} Positions
                    </span>
                    <span className="text-[10px] text-gray-400 font-black uppercase flex items-center gap-1.5">
                        <GlobalOutlined className="text-gray-300" />{" "}
                        {row.original.location}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "stats",
            header: "Stats",
            width: 220,
            cell: ({ row }) => (
                <div className="flex gap-1.5 opacity-60 grayscale-[0.5]">
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
                        <div className="bg-blue-50 text-blue-600 text-[10px] font-black w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center">
                            {row.original.pending || 0}
                        </div>
                    </Tooltip>
                    <Tooltip title="Selected">
                        <div className="bg-green-50 text-green-600 text-[10px] font-black w-8 h-8 rounded-lg border border-green-100 flex items-center justify-center text-shadow-sm">
                            {row.original.selected || 0}
                        </div>
                    </Tooltip>
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
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                    <CalendarOutlined className="text-gray-300" />
                    <span>{getValue()}</span>
                </div>
            ),
        },
        {
            accessorKey: "incoming",
            header: "Applications",
            sort: true,
            width: 180,
            cell: ({ row }) => (
                <Button
                    size="small"
                    onClick={() =>
                        navigate(
                            `/recruiter/incoming-applications/${row.original.assigned_id}/${row.original.location}`,
                        )
                    }
                    className="rounded-lg bg-gray-50 border-gray-100 text-gray-400 font-bold text-[10px] uppercase hover:bg-white hover:text-blue-600 hover:border-blue-100 transition-all h-8 flex items-center gap-2"
                >
                    Incoming ({row.original.incoming || 0})
                </Button>
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
                    className="rounded-lg bg-gray-50 border-gray-100 text-gray-400 font-bold text-[10px] uppercase hover:bg-white hover:text-blue-600 hover:border-blue-100 transition-all h-8"
                >
                    View History
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
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
                                    Job History
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500 font-medium tracking-tight">
                                Archive of closed job assignments.
                            </p>
                        </div>
                    </div>

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
                                    <div className="bg-blue-50 text-blue-600 text-[10px] font-black w-6 h-6 rounded-lg border border-blue-100 flex items-center justify-center">
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
                                No completed jobs
                            </h3>
                            <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                Closed job assignments will automatically move
                                to this archive for your reference.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default ClosedApplicationsRecruiter;
