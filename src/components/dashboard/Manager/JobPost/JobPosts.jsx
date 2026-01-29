import React, { useEffect, useState } from "react";
// import "./JobPost.css";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import {
    EyeOutlined,
    SearchOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Menu, message, Spin, Tag, Button, Modal } from "antd";
import Pageloading from "../../../common/loading/Pageloading";
import { LoadingOutlined } from "@ant-design/icons";
import AppTable from "../../../common/AppTable";
import CustomDatePicker from "../../../common/CustomDatePicker";
import { Papa } from "papaparse";
import GoBack from "../../../common/Goback";

// const JobCard = ({ data, postOnLinkedIn, buttonLoading }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="card">
//       <div className="headers">
//         <div className="first">
//           <span className="role">{data.job_title}</span>
//           <span className="status">{data.status}</span>
//           <span className="recruiter-name">
//             <div style={{ display: "flex", gap: "5px" }}>
//               <span>Assigned to:</span>
//               {data.assigned_to && Object.keys(data.assigned_to).length > 0 ? (
//                 Object.entries(data.assigned_to).map(([location, recruiters]) => (
//                   <span key={location} style={{ color: "gray", marginLeft: "10px" }}>
//                     <span className="bold" style={{ fontWeight: '700', marginRight: '5px' }}>
//                       {location}:
//                     </span>{recruiters.length > 0 ? recruiters.join(", ") : "No recruiters allotted"}
//                   </span>
//                 ))
//               ) : (
//                 <span style={{ color: "gray", marginLeft: "10px" }}>
//                   No recruiters allotted
//                 </span>
//               )}
//             </div>
//           </span>
//         </div>
//         <div className="last">
//           {data.is_posted_on_linkedin ? (
//             <span className="success">
//               Posted on linkedin
//             </span>
//           ) : (
//             <span
//               className="view-job"
//               onClick={() => {
//                 postOnLinkedIn(data.id);
//               }}
//             >
//               {buttonLoading ? (
//                 <>
//                   <Spin indicator={<LoadingOutlined spin />} style={{ paddingRight: "10px" }} size="4" /> Posting
//                 </>
//               ) : (
//                 "Post On LinkedIn"
//               )}
//             </span>
//           )
//           }
//           <span
//             className="view-job"
//             onClick={() => {
//               navigate(`/agency/postings/${data.id}`);
//             }}
//           >
//             <EyeOutlined />
//             View Job Post
//           </span>
//           <span
//             className="view-candidates"
//             onClick={() => navigate(`/agency/jobresponses/${data.id}`)}
//           >
//             <SearchOutlined />
//             View Applications
//           </span>
//         </div>
//       </div>
//       <div className="main-section">
//         <div className="item">
//           <span className="client-name">{data.client_name}</span>
//           <span className="deadline">{data.deadline}</span>
//         </div>
//         <div className="boxes">
//           {data.rounds_details &&
//             data.rounds_details.map((item, index) => {
//               const key = Object.keys(item)[0];
//               const value = item[key];

//               return (
//                 <div
//                   key={index}
//                   className={`box ${key.toLowerCase() === "hired" ? "selected" : ""
//                     } ${key.toLowerCase() === "rejected" ? "rejected" : ""}`}
//                 >
//                   <span className="value">{value}</span>
//                   <span className="query">{key}</span>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </div>
//   );
// };

const JobsDetails = ({ details, handleExportCSV }) => {
    if (!details) return null;

    return (
        <div className="bg-white p-5 rounded-lg border border-[#BADAFF] mb-5">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-xl font-bold text-[#071C50] m-0">Jobs</h5>
                <button
                    className="px-4 py-2 bg-[#1681FF] text-white rounded-md hover:bg-[#0056b3] transition-colors font-semibold"
                    onClick={handleExportCSV}
                >
                    Export CSV
                </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {Object.entries(details).map(([key, value], index, array) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center justify-center p-2.5 min-w-[120px] rounded-md bg-white border border-[#D1E5FF] shadow-sm ${
                            index === 0 ? "border-[#1681FF] bg-[#F0F7FF]" : ""
                        }`}
                    >
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">
                            {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-lg font-bold text-[#071C50]">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const JobPosts = ({ defaultTab = "all" }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [orgJobs, setOrgJobs] = useState(null);
    const [current, setCurrent] = useState(defaultTab);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newDeadline, setNewDeadline] = useState(null);

    const { apiurl, token } = useAuth();

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
                        category: [
                            "create_job",
                            "accept_job_edit",
                            "reject_job_edit",
                            "partial_job_edit",
                        ],
                    }),
                },
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        if (token) {
            if (defaultTab === "edit_requests") {
                fetchEditRequests();
            } else {
                fetchJobPosts();
            }
            updateState();
        }
    }, [token, defaultTab]);

    const postOnLinkedIn = async (job_id) => {
        try {
            setButtonLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job/post_on_linkedin/?job_id=${job_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setButtonLoading(false);
                return;
            } else {
                message.success(data.message);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setButtonLoading(false);
        }
    };

    const handleOpenModal = (jobId) => {
        setSelectedJob(jobId);
        setIsModalOpen(true);
    };

    const fetchJobPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/job-posts/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setData(data.data || []);
            setOrgJobs(data.org_jobs || {});
            setFilteredData(data.data || []);
        } catch (error) {
            console.error("Error fetching job posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await fetch(`${apiurl}/manager/jobs/export-csv/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "clients.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error("Error fetching job posts:", e);
        }
    };

    const items = [
        { label: "All", key: "all" },
        { label: "Open", key: "open" },
        { label: "Pending Approval", key: "pending_approval" },
        { label: "Expired", key: "expired" },
        { label: "Client Edit Requests", key: "edit_requests" },
    ];

    const handleMenuClick = (e) => {
        setCurrent(e.key);
        if (e.key === "edit_requests") {
            fetchEditRequests();
        } else {
            filterJobs(e.key);
        }
    };

    const fetchEditRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/job-edit-requests/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const res = await response.json();
            // Assuming res.data is the array of requests
            setData(res.data || []);
            setFilteredData(res.data || []);
        } catch (error) {
            console.error("Error fetching edit requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDeadline = async () => {
        if (!newDeadline) {
            message.warning("Please select a new deadline");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/manager/update-deadline/${selectedJob}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ new_deadline: newDeadline }),
                },
            );
            if (response.ok) {
                message.success("Deadline updated successfully");
                setIsModalOpen(false);
            } else {
                message.error("Failed to update deadline");
            }
        } catch (error) {
            message.error("Error updating deadline");
        }
    };

    const filterJobs = (key) => {
        // Need to re-fetch original jobs if we switched away from "edit_requests"
        // But optimization: store jobs in a separate state 'allJobs'
        // For now, simpler: re-fetch if we came from edit_requests, OR just fetch requests separately.
        // Let's modify fetchJobPosts to store in 'allJobs'.
        // Actually, existing code uses 'data' for storing fetch result and 'filteredData' for display.
        // When switching tabs, we filter 'data'.
        // BUT "Edit Requests" is a different API.
        // So we should have separate states or fetch on switch.
        // Current implementation: fetchJobPosts sets 'data'.

        if (current === "edit_requests" && key !== "edit_requests") {
            fetchJobPosts(); // reload normal jobs
            return;
        }

        if (key === "all") {
            setFilteredData(data);
        } else if (key === "open") {
            setFilteredData(data.filter((job) => job.status === "opened"));
        } else if (key === "pending_approval") {
            setFilteredData(
                data.filter((job) => job.approval_status === "pending"),
            );
        } else if (key === "expired") {
            setFilteredData(
                data.filter((job) => {
                    const deadline = new Date(job.deadline);
                    deadline.setDate(deadline.getDate() + 1);
                    return deadline < new Date();
                }),
            );
        }
    };

    const handleHold = async (job_id) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/job/hold/${job_id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            }
            message.success(data.message);
            fetchJobPosts();
        } catch (error) {
            message.error(
                error.message || "Something went wrong, please try again.",
            );
        }
    };

    const handleRemoveFromHold = async (job_id) => {
        try {
            const response = await fetch(
                `${apiurl}/manager/job/remove-hold/${job_id}/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            }
            message.success(data.message);
            fetchJobPosts();
        } catch (error) {
            message.error(
                error.message || "Something went wrong, please try again.",
            );
        }
    };

    const editRequestColumns = [
        {
            accessorKey: "job_id",
            header: "Job ID",
            width: 100,
        },
        {
            accessorKey: "edit_reason",
            header: "Reason",
            width: 250,
        },
        {
            accessorKey: "edit_status",
            header: "Status",
            width: 150,
            cell: ({ row }) => (
                <Tag
                    color={
                        row.original.edit_status === "pending"
                            ? "orange"
                            : "green"
                    }
                >
                    {row.original.edit_status}
                </Tag>
            ),
        },
        {
            accessorKey: "edited_at", // Check model field name: edited_at or created_at
            header: "Requested At",
            width: 180,
            cell: ({ row }) =>
                row.original.edited_at
                    ? new Date(row.original.edited_at).toLocaleString()
                    : "-",
        },
        {
            header: "Action",
            accessorKey: "id",
            width: 150,
            cell: ({ row }) =>
                row.original.edit_status === "pending" ? (
                    <Button
                        type="primary"
                        onClick={() =>
                            navigate(
                                `/agency/job-edit-request/${row.original.id}`,
                            )
                        }
                    >
                        View Request
                    </Button>
                ) : (
                    <Tag
                        color={
                            row.original.edit_status === "accepted"
                                ? "green"
                                : "red"
                        }
                    >
                        {row.original.edit_status.toUpperCase()}
                    </Tag>
                ),
        },
    ];

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Title",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div
                    onClick={() =>
                        navigate(`/agency/postings/${row.original.id}`)
                    }
                    className="font-semibold cursor-pointer underline hover:text-blue-600"
                >
                    {row.getValue("job_title")}
                </div>
            ),
        },
        {
            accessorKey: "client_name",
            header: "Client Name",
            searchField: true,
            width: 200,
            cell: ({ row }) => (
                <span>
                    {`${row.original.organization_name || ""} - ${row.getValue(
                        "client_name",
                    )}`}
                </span>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("created_at")).toLocaleString(),
            dateFilter: true,
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            width: 180,
            cell: ({ row }) => {
                const deadline = new Date(row.getValue("deadline"));
                const now = new Date();
                const diffDays = Math.ceil(
                    (deadline - now) / (1000 * 60 * 60 * 24),
                );
                const isWarning = diffDays <= 5;

                return (
                    <div className="flex flex-col gap-1">
                        <span
                            style={{
                                color: isWarning ? "orange" : "inherit",
                                fontWeight: isWarning ? 600 : 400,
                            }}
                        >
                            {deadline.toLocaleString()}
                            {isWarning && (
                                <Tag color="orange" style={{ marginLeft: 5 }}>
                                    <ExclamationCircleOutlined /> {diffDays}{" "}
                                    days left
                                </Tag>
                            )}
                        </span>
                        {isWarning && (
                            <Button
                                type="link"
                                size="small"
                                onClick={() => handleOpenModal(row.original.id)}
                            >
                                Update Deadline
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "location",
            header: "Location",
            width: 120,
        },
        {
            header: "Assigned Recruiters",
            accessorKey: "assigned_to",
            width: 200,
            cell: ({ row }) => {
                const assignedObj = row.original.assigned_to || {};

                if (Object.keys(assignedObj).length === 0) {
                    return (
                        <span className="text-red-500">
                            No recruiter is assigned
                        </span>
                    );
                }

                return (
                    <div className="flex flex-col gap-1.5">
                        {Object.entries(assignedObj).map(
                            ([city, recruiters]) => (
                                <div key={city}>
                                    <strong>{city}:</strong>
                                    <div
                                        style={{
                                            marginLeft: 10,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {recruiters.map(
                                            ([recruiter, resumes], index) => (
                                                <span key={index}>
                                                    {recruiter}
                                                    <Tag
                                                        color="blue"
                                                        style={{
                                                            marginLeft: 5,
                                                        }}
                                                    >
                                                        {resumes}
                                                    </Tag>
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            width: 200,
            cell: ({ row }) => {
                const status = row.getValue("status");
                const jobId = row.original.id;

                const color =
                    status === "opened"
                        ? "green"
                        : status === "closed"
                          ? "red"
                          : status === "hold"
                            ? "orange"
                            : "default";

                return (
                    <div className="flex items-center gap-2">
                        <Tag color={color}>{status.toUpperCase()}</Tag>
                        {status === "hold" ? (
                            <Button
                                size="small"
                                color="green"
                                onClick={() => handleRemoveFromHold(jobId)}
                            >
                                Remove from Hold
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                color="orange"
                                onClick={() => handleHold(jobId)}
                            >
                                Hold
                            </Button>
                        )}
                    </div>
                );
            },
        },

        {
            header: "Posted on LinkedIn",
            accessorKey: "is_posted_on_linkedin",
            width: 150,
            cell: ({ row }) => {
                const status = row.getValue("is_posted_on_linkedin");

                return (
                    <>
                        {status === true ? (
                            <span className="success">Posted on linkedin</span>
                        ) : (
                            <span
                                className="view-job"
                                onClick={() => {
                                    postOnLinkedIn(row.original.id);
                                }}
                            >
                                {buttonLoading ? (
                                    <>
                                        <Spin
                                            indicator={<LoadingOutlined spin />}
                                            style={{ paddingRight: "10px" }}
                                            size="4"
                                        />{" "}
                                        Posting
                                    </>
                                ) : (
                                    <Tag
                                        color="yellow"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Post On LinkedIn
                                    </Tag>
                                )}
                            </span>
                        )}
                    </>
                );
            },
        },
        {
            header: "View Applications",
            accessorKey: "id",
            width: 200,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    type="default"
                    onClick={() =>
                        navigate(`/agency/jobresponses/${row.original.id}`)
                    }
                    className="bg-white hover:bg-gray-50 border-blue-100 text-blue-600 shadow-sm"
                >
                    View Applications
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-5">
                    <div className="-ml-6">
                        <GoBack />
                    </div>
                    {!loading && orgJobs && current !== "edit_requests" && (
                        <JobsDetails
                            details={orgJobs}
                            handleExportCSV={handleExportCSV}
                        />
                    )}
                    <Menu
                        onClick={handleMenuClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                        style={{ marginBottom: "20px" }}
                    />
                    <div className="mt-5 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <AppTable
                            columns={
                                current === "edit_requests"
                                    ? editRequestColumns
                                    : columns
                            }
                            data={filteredData}
                        />
                    </div>
                </div>
            )}

            <Modal
                title="Update Deadline"
                open={isModalOpen}
                onOk={handleUpdateDeadline}
                onCancel={() => setIsModalOpen(false)}
                okText="Update"
            >
                <CustomDatePicker
                    onChange={(date) => setNewDeadline(date)}
                    startDate={new Date()} // prevents past dates
                    formatString="yyyy-MM-dd"
                    size="md"
                />
            </Modal>
        </Main>
    );
};

export default JobPosts;
