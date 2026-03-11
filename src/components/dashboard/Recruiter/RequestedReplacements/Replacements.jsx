import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message, Tag, Select, Modal, Button } from "antd";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import UploadData from "../AddingCandidates/UploadData";
import {
    SyncOutlined,
    UserOutlined,
    CalendarOutlined,
    GlobalOutlined,
    WarningOutlined,
    SafetyCertificateOutlined,
    FieldTimeOutlined,
    SendOutlined,
} from "@ant-design/icons";
import GoBack from "../../../common/Goback";
const ReplacementsRecruiter = () => {
    const { apiurl, token } = useAuth();
    const [replacements, setReplacements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [submitModalVisible, setSubmitModalVisible] = useState(false);
    const [selectedReplacement, setSelectedReplacement] = useState(null);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);
    const [jobLoading, setJobLoading] = useState(false);
    const navigate = useNavigate();

    const fetchJobDetails = async (jobId) => {
        try {
            setJobLoading(true);
            const response = await fetch(
                `${apiurl}/job-details/recruiter/${jobId}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setSelectedJobDetails(data.jd);
        } catch (error) {
            console.error("Error fetching job details:", error);
            message.error("Failed to load skills assessment data.");
        } finally {
            setJobLoading(false);
        }
    };

    useEffect(() => {
        if (selectedReplacement?.assigned_job_id) {
            fetchJobDetails(selectedReplacement.assigned_job_id);
        }
    }, [selectedReplacement]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/recruiter/replacements/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setReplacements(data.data || []);
        } catch (e) {
            message.error("Failed to sync replacement registry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const filteredReplacements = useMemo(() => {
        let result = replacements;

        // Apply Status filter
        if (statusFilter !== "All") {
            result = result.filter(
                (item) =>
                    (item.replacement_status || "Pending").toLowerCase() ===
                    statusFilter.toLowerCase(),
            );
        }

        return result;
    }, [replacements, statusFilter]);

    const customFilters = (
        <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
                { label: "All Status", value: "All" },
                { label: "Completed", value: "completed" },
                { label: "Pending", value: "pending" },
            ]}
            style={{ width: 150 }}
            placeholder="Select Status"
        />
    );

    const columns = [
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 200,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-[10px] border border-red-100">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-[#071C50] font-bold text-xs">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "job_title",
            header: "Job",
            searchField: true,
            width: 220,
            cell: ({ getValue }) => (
                <div className="flex flex-col">
                    <span className="text-gray-600 font-bold text-[11px] tracking-tight">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "joining_date",
            header: "Timeline",
            dateFilter: true,
            width: 200,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px]">
                        <span className="text-gray-300 uppercase tracking-tighter">
                            Joined:
                        </span>{" "}
                        {row.getValue("joining_date")
                            ? new Date(
                                  row.getValue("joining_date"),
                              ).toLocaleDateString()
                            : "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-red-500 font-black text-[10px]">
                        <span className="text-red-300 uppercase tracking-tighter">
                            Left:
                        </span>{" "}
                        {row.original.left_on
                            ? new Date(
                                  row.original.left_on,
                              ).toLocaleDateString()
                            : "N/A"}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "left_reason",
            header: "Reason",
            width: 250,
            cell: ({ getValue }) => (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <WarningOutlined className="text-amber-500 mt-0.5" />
                    <p className="text-slate-500 text-[10px] font-medium leading-tight italic line-clamp-2">
                        " {getValue() || "No reason provided."} "
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "suggested_candidates",
            header: "Suggested Candidates",
            width: 300,
            cell: ({ getValue }) => {
                const candidates = getValue() || [];
                return (
                    <div className="flex flex-col gap-2">
                        {candidates.length > 0 ? (
                            candidates.map((cand) => (
                                <div
                                    key={cand.id}
                                    className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[#071C50] font-bold text-[11px]">
                                            {cand.candidate_name}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                    cand.status === "hold"
                                                        ? "bg-orange-50 text-orange-600 border border-orange-100"
                                                        : "bg-blue-50 text-blue-600 border border-blue-100"
                                                }`}
                                            >
                                                {cand.status === "hold"
                                                    ? "On Hold"
                                                    : cand.status}
                                            </span>
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                Round {cand.round_num}
                                            </span>
                                        </div>
                                    </div>
                                    {(cand.status === "hold" ||
                                        cand.status === "processing") && (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/recruiter/applications/to-schedule",
                                                )
                                            }
                                            className="px-3 py-1 bg-[#071C50] text-white text-[9px] font-black rounded-lg uppercase tracking-tight hover:bg-[#1681FF] transition-colors"
                                        >
                                            Schedule
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-300 text-[10px] font-bold italic">
                                No candidates suggested yet.
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "replacement_status",
            header: "Status",
            width: 140,
            cell: ({ getValue }) => (
                <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        getValue()?.toLowerCase() === "completed"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
                    }`}
                >
                    {getValue() || "Pending"}
                </span>
            ),
        },
        {
            header: "Action",
            width: 150,
            cell: ({ row }) => (
                <Button
                    icon={<SendOutlined />}
                    type="primary"
                    size="small"
                    className="bg-[#071C50] text-[9px] font-black rounded-lg uppercase tracking-tight hover:bg-[#1681FF]"
                    onClick={() => {
                        setSelectedReplacement(row.original);
                        setSubmitModalVisible(true);
                    }}
                    disabled={row.original.replacement_status === "completed"}
                >
                    Send Profile
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="5">
            <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            {/* <div className="-ml-8">
                                <GoBack />
                            </div> */}
                            <h1 className="text-3xl font-black text-[#071C50]">
                                Replacements
                            </h1>
                            <p className="text-sm text-gray-400 font-bold ">
                                Manage replacements for terminated candidates
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#071C50] flex items-center justify-center text-white shadow-lg shadow-blue-50">
                                <SyncOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Requests
                                </p>
                                <p className="text-[#071C50] font-black text-lg">
                                    {replacements.length}{" "}
                                    <span className="text-sm text-gray-400 font-bold">
                                        Replacements
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() =>
                                navigate("/recruiter/applications/to-schedule")
                            }
                            className="bg-[#071C50] text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#1681FF] transition-all flex items-center gap-3"
                        >
                            <CalendarOutlined className="text-lg" />
                            Schedule Interviews
                        </button>
                    </div>

                    {loading && replacements.length === 0 ? (
                        <div className="h-96 flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : (
                        // <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <AppTable
                            columns={columns}
                            data={filteredReplacements}
                            pageSize={15}
                            customFilters={customFilters}
                        />
                        // </div>
                    )}
                </div>
            </div>

            <Modal
                title={null}
                open={submitModalVisible}
                onCancel={() => {
                    setSubmitModalVisible(false);
                    setSelectedJobDetails(null);
                    setSelectedReplacement(null);
                }}
                footer={null}
                width={1000}
                style={{ maxWidth: "95vw" }}
                className="premium-modal-v2 no-padding-modal"
            >
                {selectedReplacement && (
                    <UploadData
                        id={selectedReplacement.assigned_job_id}
                        replacement_id={selectedReplacement.replacement_id}
                        setAddApplication={setSubmitModalVisible}
                        setResume={() => {}}
                        setDraggedId={() => {}}
                        primary_skills={
                            selectedJobDetails?.primary_skills || []
                        }
                        secondary_skills={
                            selectedJobDetails?.secondary_skills || []
                        }
                    />
                )}
            </Modal>
        </Main>
    );
};

export default ReplacementsRecruiter;
