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
import { Tag, Button, Tooltip, Select, Modal, message } from "antd";
import { format } from "date-fns";
import CustomDatePicker from "../../../common/CustomDatePicker";
import GoBack from "../../../common/Goback";
const stages = [
    {
        label: "Profiles Sent",
        key: "profiles_sent",
        color: "#F59E0B",
        bg: "#FFFBEB",
    },
    {
        label: "Shortlisted (R1)",
        key: "shortlisted_r1",
        color: "#22C55E",
        bg: "#F0FDF4",
    },
    {
        label: "Processing (R2+)",
        key: "processing_r2_plus",
        color: "#A855F7",
        bg: "#FAF5FF",
    },
    { label: "on-Hold", key: "onhold", color: "#84CC16", bg: "#F7FEE7" },
    { label: "Rejected", key: "rejected", color: "#EF4444", bg: "#FEF2F2" },
    { label: "Selected", key: "selected", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Replaced", key: "replaced", color: "#F97316", bg: "#FFF7ED" },
    { label: "Joined", key: "joined", color: "#14B8A6", bg: "#F0FDFA" },
];

const OpenedApplicationsRecruiter = () => {
    const [jobList, setJobList] = useState([]);
    const { apiurl, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [locationFilter, setLocationFilter] = useState("All");
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newDeadline, setNewDeadline] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);

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

    const handleUpdateDeadline = async () => {
        if (!newDeadline) {
            message.warning("Please select a new deadline");
            return;
        }
        setButtonLoading(true);

        const formattedDeadline =
            typeof newDeadline === "string"
                ? newDeadline
                : format(newDeadline, "yyyy-MM-dd");

        try {
            const response = await fetch(
                `${apiurl}/manager/update-deadline/${selectedJob}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ new_deadline: formattedDeadline }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                message.success("Deadline updated successfully");
                fetchJobPosts();
                setIsModalOpen(false);
            } else {
                message.error(data.error || "Error updating deadline");
            }
        } catch (e) {
            console.error("Error updating deadline:", e);
            message.error("Error updating deadline");
        } finally {
            setButtonLoading(false);
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
            cell: ({ row }) => {
                const deadline = row.original.deadline;
                const extended = row.original.extended_deadline;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                            <CalendarOutlined className="text-red-300" />
                            <span
                                className={
                                    extended ? "line-through opacity-50" : ""
                                }
                            >
                                {deadline}
                            </span>
                        </div>
                        {extended && (
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase">
                                <CalendarOutlined className="text-blue-400" />
                                <span>Ext: {extended}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "stats",
            header: "Application Status",
            width: 320,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    {stages.map((stage, i) => (
                        <Tooltip key={i} title={stage.label}>
                            <div
                                className="text-[10px] font-black w-7 h-7 rounded flex items-center justify-center transition-transform hover:scale-110 cursor-help"
                                style={{
                                    backgroundColor: stage.bg,
                                    color: stage.color,
                                    border: `1px solid ${stage.color}`,
                                }}
                            >
                                {row.original[stage.key] || 0}
                            </div>
                        </Tooltip>
                    ))}
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
                    <div className="flex flex-col gap-2">
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
                        <Button
                            onClick={() => {
                                setSelectedJob(row.original.job_id);
                                setNewDeadline(
                                    row.original.extended_deadline ||
                                        row.original.deadline,
                                );
                                setIsModalOpen(true);
                            }}
                            className="h-8 px-4 rounded-xl bg-white text-gray-400 hover:text-blue-600 font-black text-[9px] uppercase tracking-wider border-gray-100 flex items-center gap-2"
                        >
                            Update Deadline
                        </Button>
                    </div>
                ) : (
                    <span className="bg-gray-100 text-gray-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-gray-200 cursor-not-allowed text-center">
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
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6 pb-4 border-b border-gray-50">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">
                                    Status Legend:
                                </span>
                                {stages.map((stage, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 group cursor-default"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-110"
                                            style={{
                                                backgroundColor: stage.bg,
                                                border: `1.5px solid ${stage.color}`,
                                            }}
                                        />
                                        <span className="text-[11px] font-bold text-gray-500 transition-colors group-hover:text-gray-900">
                                            {stage.label}
                                        </span>
                                    </div>
                                ))}
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

            <Modal
                title={
                    <div className="flex items-center gap-2 text-[#071C50] font-bold">
                        <CalendarOutlined />
                        <span>Update Job Deadline</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-lg font-bold"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={buttonLoading}
                        onClick={handleUpdateDeadline}
                        className="rounded-lg bg-[#1681FF] font-bold"
                    >
                        Update Deadline
                    </Button>,
                ]}
                centered
                width={400}
                className="custom-modal"
            >
                <div className="py-6 flex flex-col items-center">
                    <p className="text-gray-500 mb-6 text-sm text-center font-medium">
                        Select a new deadline for this job posting.
                    </p>
                    <CustomDatePicker
                        style={{ width: "100%" }}
                        onChange={setNewDeadline}
                        startDate={new Date()}
                        formatString="yyyy-MM-dd"
                        size="md"
                        defaultValue={
                            newDeadline ? new Date(newDeadline) : null
                        }
                    />
                </div>
            </Modal>
        </Main>
    );
};

export default OpenedApplicationsRecruiter;
