import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Button, Modal, Input, Tag, Select } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    DollarOutlined,
    CalendarOutlined,
    GlobalOutlined,
    AuditOutlined,
} from "@ant-design/icons";
import Main from "../Layout";
import Pageloading from "../../../common/loading/Pageloading";
import AppTable from "../../../common/AppTable";
import GoBack from "../../../common/Goback";
const ReconfirmationCandidates = () => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectFeedback, setRejectFeedback] = useState("");
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/recruiter/candidate-selected-jobs/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            // console.log(result[0].selected_candidate_id);
            //  setSelectedCandidateId(result[0].selected_candidate_id);
            if (result.error) message.error(result.error);
            else setData(result);
        } catch (e) {
            message.error("Failed to sync reconfirmation registry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleAccept = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/reconfirmation-accept/?selected_candidate_id=${id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            const data = result.ok;
            // console.log(result.ok)
            if (result.error) message.error(result.error);
            else {
                message.success(
                    result.message || "Offer reconfirmed successfully.",
                );
                fetchData();
            }
        } catch (e) {
            message.error("Execution failure: Unable to reconfirm.");
        }
    };

    const openRejectModal = (id) => {
        setSelectedCandidateId(id);
        setIsRejectModalOpen(true);
    };

    const handleReject = async () => {
        if (!rejectFeedback.trim()) {
            message.error("Feedback is required for rejection protocol.");
            return;
        }
        try {
            const response = await fetch(
                `${apiurl}/recruiter/reconfirmation-reject/?selected_candidate_id=${selectedCandidateId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ feedback: rejectFeedback }),
                },
            );
            const result = await response.json();

            if (result.error) message.error(result.error);
            else {
                message.success(result.message || "Rejection protocol logged.");
                setIsRejectModalOpen(false);
                setRejectFeedback("");
                fetchData();
            }
        } catch (e) {
            message.error("System error: Rejection update failed.");
        }
    };

    const filteredData = useMemo(() => {
        let result = data;

        // Apply Status filter
        if (statusFilter !== "All") {
            result = result.filter(
                (item) => item.candidate_acceptance === statusFilter,
            );
        }

        return result;
    }, [data, statusFilter]);

    const customFilters = (
        <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
                { label: "All Status", value: "All" },
                { label: "Accepted", value: "Accepted" },
                { label: "Pending", value: "Pending" },
            ]}
            style={{ width: 150 }}
            placeholder="Select Status"
        />
    );

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job",
            searchField: true,
            leftSticky: true,
            width: 200,
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-[#071C50] font-black text-sm tracking-tight">
                        {row.getValue("job_title")}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <GlobalOutlined className="text-[8px]" />{" "}
                        {row.original.client_name}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "actual_ctc",
            header: "Compensation",
            sort: true,
            width: 180,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">
                            Offer:
                        </span>
                        <span className="text-[#071C50] font-bold text-xs">
                            {row.getValue("actual_ctc")} LPA
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase">
                            Agreed:
                        </span>
                        <span className="text-blue-600 font-black text-xs">
                            {row.original.accepted_ctc} LPA
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 180,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] border border-indigo-100">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-[#071C50] font-bold text-xs">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "joining_date",
            header: "Joining Date",
            dateFilter: true,
            sort: true,
            width: 140,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-gray-600 font-bold text-[11px]">
                    <CalendarOutlined className="text-blue-500" /> {getValue()}
                </div>
            ),
        },
        {
            accessorKey: "candidate_acceptance",
            header: "Status",
            width: 180,
            cell: ({ getValue }) => (
                <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        getValue() === "Accepted"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                >
                    {getValue()}
                </span>
            ),
        },
        {
            header: "Actions",
            accessorKey: "selected_candidate_id",
            width: 250,
            rightSticky: true,
            cell: ({ row }) => {
                const {
                    selected_candidate_id,
                    recruiter_acceptance,
                    reconfirmed_by_recruiter,
                } = row.original;

                if (reconfirmed_by_recruiter) {
                    return (
                        <Tag
                            color="success"
                            className="px-4 py-1.5 bg-white rounded-lg font-black text-[10px] uppercase tracking-widest border-none shadow-sm flex items-center gap-2 w-fit"
                        >
                            <CheckCircleOutlined /> Confirmed
                        </Tag>
                    );
                }

                if (recruiter_acceptance === false) {
                    return (
                        <Tag
                            color="error"
                            className="px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest border-none shadow-sm flex items-center gap-2 w-fit"
                        >
                            <CloseCircleOutlined /> Rejected
                        </Tag>
                    );
                }

                return (
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleAccept(selected_candidate_id)}
                            className="h-8 px-4 rounded-xl bg-green-200 border-2 border-green-500 hover:bg-green-300 font-black text-[10px] text-green-600 uppercase tracking-widest shadow-lg shadow-green-50 cursor-pointer flex items-center gap-2"
                        >
                            <CheckCircleOutlined className="text-sm" />
                            Confirm
                        </button>

                        <button
                            onClick={() =>
                                openRejectModal(selected_candidate_id)
                            }
                            className="h-8 px-4 rounded-xl border-2 border-red-600 bg-red-200 text-red-600 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-50 hover:bg-red-300 cursor-pointer flex items-center gap-2"
                        >
                            <CloseCircleOutlined className="text-sm" />
                            Reject
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <Main defaultSelectedKey="4">
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-8">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            {/* <div className="-ml-8">
                                <GoBack />
                            </div> */}
                            <h1 className="text-3xl font-black text-[#071C50] ">
                                Reconfirmations
                            </h1>
                            <p className="text-sm text-gray-400 font-bold ">
                                Manage candidate employment offer acceptances
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                <SafetyCertificateOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Pending
                                </p>
                                <p className="text-[#071C50] font-black text-lg">
                                    {data.length}{" "}
                                    <span className="text-sm text-gray-400 font-bold">
                                        Candidates
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading && data.length === 0 ? (
                        <div className="h-96 flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : (
                        // <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <AppTable
                            columns={columns}
                            data={filteredData}
                            pageSize={15}
                            customFilters={customFilters}
                        />
                        // </div>
                    )}

                    <Modal
                        title={null}
                        open={isRejectModalOpen}
                        onCancel={() => setIsRejectModalOpen(false)}
                        onOk={handleReject}
                        centered
                        className="premium-modal-v2"
                        footer={null}
                    >
                        <div className="p-2 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                                    <CloseCircleOutlined className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-[#071C50] uppercase tracking-tighter m-0">
                                        Reject
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        Please provide a reason for rejection.
                                    </p>
                                </div>
                            </div>

                            <Input.TextArea
                                value={rejectFeedback}
                                onChange={(e) =>
                                    setRejectFeedback(e.target.value)
                                }
                                placeholder="Enter feedback..."
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                className="rounded-2xl border-gray-100 bg-gray-50/50 p-6 text-slate-600 italic focus:bg-white transition-all"
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="h-12 px-8 rounded-xl bg-gray-100 text-gray-500 border-none font-black text-[10px] uppercase tracking-widest"
                                >
                                    Back
                                </Button>
                                <Button
                                    danger
                                    type="primary"
                                    onClick={handleReject}
                                    className="h-12 px-10 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100"
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <style>{`
                .premium-modal-v2 .ant-modal-content { border-radius: 40px !important; padding: 40px !important; border: 1px solid #f3f4f6 !important; }
            `}</style>
        </Main>
    );
};

export default ReconfirmationCandidates;
