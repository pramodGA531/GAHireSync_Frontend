import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import { Tag, Breadcrumb, Modal, message, Button, Tooltip, Empty } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import AppTable from "../../../common/AppTable";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    EyeOutlined,
    ReloadOutlined,
    ArrowLeftOutlined,
    SolutionOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import GoBack from "../../../common/Goback";

const JobApplications = () => {
    const [loading, setLoading] = useState(false);
    const [jobApplications, setJobApplications] = useState([]);
    const [isEditedByClient, setIsEditedByClient] = useState(false);
    const { apiurl, token } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchData = () => {
        if (!token) return;
        setLoading(true);
        fetch(`${apiurl}/recruiter/resumesent/?job_id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch resumes.");
                return response.json();
            })
            .then((data) => {
                setJobApplications(
                    Array.isArray(data.applications) ? data.applications : [],
                );
                setIsEditedByClient(data.is_edited_by_client || false);
            })
            .catch((error) => console.error("Error fetching resumes:", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [token, id]);

    const handleReopen = (record) => {
        Modal.confirm({
            title: "Reopen Application Account?",
            content:
                "This will restore the candidate's journey and allow further interview rounds. Proceed with restoration?",
            okText: "Yes, Reopen",
            cancelText: "Cancel",
            centered: true,
            okButtonProps: {
                className: "bg-green-600 hover:bg-green-700 font-bold",
            },
            onOk: async () => {
                try {
                    const response = await fetch(
                        `${apiurl}/recruiter/application/reopen/?application_id=${record.application_id}`,
                        {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        },
                    );

                    const data = await response.json();
                    if (data.error) message.error(data.error);
                    else {
                        message.success(
                            "Record successfully restored to active state.",
                        );
                        fetchData();
                    }
                } catch (err) {
                    message.error("System failure: Unable to restore record.");
                }
            },
        });
    };

    const columns = [
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 220,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#071C50] font-black text-xs">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-[#071C50] font-bold text-sm tracking-tight">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Communication",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 font-medium text-xs flex items-center gap-2">
                        <MailOutlined className="text-gray-300" />{" "}
                        {row.getValue("email")}
                    </span>
                    <span className="text-gray-400 font-bold text-[10px] flex items-center gap-2 uppercase tracking-tighter">
                        <PhoneOutlined className="text-gray-300" />{" "}
                        {row.getValue("contact_number")}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "app_sent_date",
            header: "Log Date",
            dateFilter: true,
            width: 140,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <CalendarOutlined className="text-gray-300" />
                    {getValue()
                        ? format(new Date(getValue()), "MMM d, yyyy")
                        : "-"}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Pipeline Status",
            width: 160,
            cell: ({ getValue }) => {
                const status = getValue();
                const colors = {
                    pending: "bg-amber-50 text-amber-600 border-amber-100",
                    left: "bg-red-50 text-red-600 border-red-100",
                    processing: "bg-blue-50 text-blue-600 border-blue-100",
                    selected: "bg-green-50 text-green-600 border-green-100",
                    rejected: "bg-red-50 text-red-600 border-red-100",
                    hold: "bg-orange-50 text-orange-600 border-orange-100",
                };
                return (
                    <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-widest ${
                            colors[status] ||
                            "bg-gray-50 text-gray-400 border-gray-100"
                        }`}
                    >
                        {status || "Archived"}
                    </span>
                );
            },
        },
        {
            accessorKey: "application_closed",
            header: "Ops Control",
            width: 140,
            cell: ({ row }) => {
                const closed = row.getValue("application_closed");
                return closed ? (
                    <Button
                        size="small"
                        onClick={() => handleReopen(row.original)}
                        icon={<ReloadOutlined />}
                        className="h-8 rounded-lg bg-green-50 text-green-600 border-green-100 font-black text-[10px] uppercase hover:bg-green-100 hover:text-green-700"
                    >
                        Restore
                    </Button>
                ) : (
                    <span className="text-gray-300 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>{" "}
                        Active
                    </span>
                );
            },
        },
        {
            header: "Job",
            id: "view_application",
            width: 160,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    type="primary"
                    onClick={() =>
                        navigate(
                            `/recruiter/complete-application/${row.original.application_id}/${id}`,
                        )
                    }
                    className="h-10 px-2 rounded-xl bg-[#001744] hover:bg-[#002b7a] font-black text-[10px] shadow-lg shadow-blue-50 border-none flex items-center gap-2"
                >
                    Complete Profile
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey={2} defaultSelectedChildKey="2-1">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <Breadcrumb
                            items={[
                                {
                                    title: (
                                        <span
                                            className="text-gray-400 font-bold text-[10px] cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    "/recruiter/postings/opened",
                                                )
                                            }
                                        >
                                            Assigned jobs
                                        </span>
                                    ),
                                },
                                {
                                    title: (
                                        <span className="text-gray-800 font-black text-[10px]">
                                            Candidate Archive
                                        </span>
                                    ),
                                },
                            ]}
                            className="mb-4"
                        />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                               
                                <div>
                                    <h1 className="text-2xl font-bold text-[#071C50]">
                                        Candidate Repository
                                    </h1>
                                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                                        Full historical log of submissions for
                                        Job Assignment #{id}
                                    </p>
                                </div>
                            </div>

                            {isEditedByClient && (
                                <div className="bg-linear-to-r from-amber-50 to-orange-50/30 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                        <InfoCircleOutlined className="text-white text-lg" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-amber-900 font-black uppercase tracking-tight text-xs m-0">
                                            Pending Client Edit Request
                                        </h3>
                                        <p className="text-amber-600 font-bold text-[10px] uppercase tracking-wider mt-0.5 m-0 opacity-80">
                                            Please hold on until the manager
                                            reacts to the client edit request.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <SolutionOutlined className="text-blue-500 text-xl" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                        Total Logs
                                    </p>
                                    <p className="text-[#071C50] font-black text-sm">
                                        {jobApplications.length} Submissions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <Pageloading />
                        </div>
                    ) : jobApplications.length > 0 ? (
                        // <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
                            <AppTable
                                columns={columns}
                                data={jobApplications}
                                pageSize={15}
                            />
                        // </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-400">
                                            No submission history
                                        </h3>
                                        <p className="text-sm text-gray-300 max-w-xs mx-auto">
                                            Candidates linked to this job
                                            posting will appear here in the
                                            system records.
                                        </p>
                                    </div>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default JobApplications;
