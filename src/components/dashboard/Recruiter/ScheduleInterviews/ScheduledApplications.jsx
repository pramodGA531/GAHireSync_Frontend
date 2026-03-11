import React, { useEffect, useMemo, useState } from "react";
import {
    message,
    Tag,
    Modal,
    TimePicker,
    Form,
    Button,
    Input,
    Divider,
    Select,
} from "antd";
import { useAuth } from "../../../common/useAuth";
import InterviewerReview from "./reviewcard/InterviewerReview";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import AppTable from "../../../common/AppTable";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../common/CustomDatePicker";
import dayjs from "dayjs";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    LinkOutlined,
    SyncOutlined,
    GlobalOutlined,
    UserOutlined,
    CloseCircleOutlined,
    FileSearchOutlined,
} from "@ant-design/icons";
import GoBack from "../../../common/Goback";
const ScheduledApplications = () => {
    const { apiurl, token } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openReview, setOpenReview] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [fromTime, setFromTime] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();

    const handleReview = (id) => {
        setOpenReview(true);
        setSelectedId(id);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/recruiter/all-scheduled-interviews/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) message.error(data.error);
            else setInterviews(data);
        } catch (e) {
            message.error("Log synchronization failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleReschedule = async (payload) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/reschedule_interview/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!response.ok) throw new Error("Fault in rescheduling sequence");
            message.success("Operational event successfully updated.");
            setRescheduleModalOpen(false);
            fetchData();
        } catch (error) {
            message.error("System error: Unable to update schedule.");
        }
    };

    const filteredInterviews = useMemo(() => {
        let result = interviews;

        // Apply Status filter
        if (statusFilter !== "All") {
            result = result.filter(
                (item) =>
                    item.status?.toLowerCase() === statusFilter.toLowerCase(),
            );
        }

        return result;
    }, [interviews, statusFilter]);

    const customFilters = (
        <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
                { label: "All Status", value: "All" },
                { label: "Scheduled", value: "scheduled" },
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
            ]}
            style={{ width: 150 }}
            placeholder="Select Status"
        />
    );

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job",
            searchField: true,
            leftSticky: true,
            width: 220,
            cell: ({ row }) => (
                <div
                    className="flex flex-col gap-1 cursor-pointer group"
                    onClick={() =>
                        navigate(
                            `/recruiter/complete_job_post/${row.original.job_id}`,
                        )
                    }
                >
                    <span className="text-[#1681FF] font-black text-sm tracking-tight group-hover:underline decoration-blue-200">
                        {row.getValue("job_title")}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <GlobalOutlined />{" "}
                        {row.original.job_location || "Global Hub"}
                        {row.original.is_replacement && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100">
                                Replacement
                            </span>
                        )}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 200,
            cell: ({ getValue, row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#071C50] font-black text-[10px]">
                        {getValue()?.[0]}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#071C50] font-bold text-xs tracking-tight">
                            {getValue()}
                        </span>
                        {row.original.is_replacement && (
                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100 w-fit">
                                Replacement
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "interviewer_name",
            header: "Interviewer",
            searchField: true,
            width: 180,
            cell: ({ getValue }) => (
                <div className="flex flex-col">
                    <span className="text-gray-600 font-bold text-[11px]">
                        {getValue()}
                    </span>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1 italic">
                        Interviewer
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "round_num",
            header: "Round",
            sort: true,
            width: 80,
            cell: ({ getValue }) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-black text-[10px] uppercase tracking-widest">
                    P-{getValue()}
                </span>
            ),
        },
        {
            header: "Date/Time",
            accessorKey: "scheduled_date",
            sort: true,
            width: 200,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-[11px]">
                        <CalendarOutlined className="text-blue-500" />{" "}
                        {row.getValue("scheduled_date")}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                        <ClockCircleOutlined /> {row.original.from_time} -{" "}
                        {row.original.to_time}
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            width: 140,
            cell: ({ getValue }) => {
                const status = getValue()?.toLowerCase();
                const colors = {
                    scheduled: "bg-blue-50 text-blue-600 border-blue-100",
                    pending: "bg-amber-50 text-amber-600 border-amber-100",
                    completed: "bg-green-50 text-green-600 border-green-100",
                };
                return (
                    <span
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                            colors[status] || "bg-gray-50 text-gray-400"
                        }`}
                    >
                        {status}
                    </span>
                );
            },
        },
        {
            header: "Actions",
            accessorKey: "result",
            width: 180,
            rightSticky: true,
            cell: ({ row }) => {
                const isCompleted = row.original.status === "completed";
                return isCompleted ? (
                    <Button
                        type="primary"
                        icon={<FileSearchOutlined />}
                        onClick={() => handleReview(row.original.id)}
                        className="h-10 px-5 rounded-xl bg-green-600 hover:bg-green-700 font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-green-50"
                    >
                        View Report
                    </Button>
                ) : (
                    <Button
                        icon={<SyncOutlined className="animate-spin-slow" />}
                        onClick={() => {
                            setSelectedApplication(row.original);
                            setRescheduleModalOpen(true);
                        }}
                        className="h-10 px-5 rounded-xl bg-[#071C50] text-white hover:bg-[#1681FF] font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-blue-50"
                    >
                        Reschedule
                    </Button>
                );
            },
        },
    ];

    return (
        <Main defaultSelectedKey="3" defaultSelectedChildKey="3-2">
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-8">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            {/* <div className="-ml-6">
                                <GoBack />
                            </div> */}
                            <h1 className="text-3xl font-black text-[#071C50] ">
                                Scheduled Interviews
                            </h1>
                            <p className="text-sm text-gray-400 font-bold ">
                                Manage your upcoming and completed interviews
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#071C50] flex items-center justify-center text-white">
                                <FileSearchOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Total Interviews
                                </p>
                                <p className="text-[#071C50] font-black text-lg">
                                    {interviews.length}{" "}
                                    <span className="text-sm text-gray-400 font-bold">
                                        Interviews
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {loading && interviews.length === 0 ? (
                        <div className="h-96 flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : (
                        // <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-6">
                        <AppTable
                            data={filteredInterviews}
                            columns={columns}
                            multiSelect={false}
                            pageSize={15}
                            customFilters={customFilters}
                        />
                        // </div>
                    )}

                    {selectedId && (
                        <Modal
                            open={openReview}
                            onCancel={() => setOpenReview(false)}
                            footer={null}
                            width={1000}
                            centered
                            className="premium-modal-v2"
                        >
                            <InterviewerReview id={selectedId} />
                        </Modal>
                    )}

                    <Modal
                        title={null}
                        open={rescheduleModalOpen}
                        onCancel={() => setRescheduleModalOpen(false)}
                        footer={null}
                        width={600}
                        centered
                        className="premium-modal-v2"
                        closeIcon={
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <CloseCircleOutlined />
                            </div>
                        }
                    >
                        <div className="p-2">
                            <div className="mb-10 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[24px] bg-amber-500 flex items-center justify-center text-white shadow-2xl shadow-amber-200/50">
                                    <SyncOutlined className="text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#071C50] tracking-tighter m-0 uppercase">
                                        Reschedule Interview
                                    </h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                        Rescheduling for{" "}
                                        {selectedApplication?.candidate_name}
                                    </p>
                                </div>
                            </div>

                            <Form
                                layout="vertical"
                                onFinish={(values) => {
                                    const payload = {
                                        interview_scheduled_id:
                                            selectedApplication?.id,
                                        scheduled_date: dayjs(
                                            values.scheduled_date,
                                        ).format("YYYY-MM-DD"),
                                        from_time:
                                            values.from_time.format("HH:mm"),
                                        to_time: values.to_time.format("HH:mm"),
                                        meet_link: values.meet_link || null,
                                    };
                                    handleReschedule(payload);
                                }}
                                className="space-y-8"
                            >
                                <div className="bg-slate-50/50 p-8 rounded-[32px] border border-gray-100/50 space-y-6">
                                    <Form.Item
                                        name="scheduled_date"
                                        label={
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                New Date
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: "Required",
                                            },
                                        ]}
                                    >
                                        <CustomDatePicker
                                            placeholder="Choose new registry date"
                                            format="YYYY-MM-DD"
                                            className="h-14 w-full rounded-2xl border-gray-100 shadow-sm"
                                            startDate={dayjs().subtract(
                                                1,
                                                "day",
                                            )}
                                            onChange={(date) =>
                                                setSelectedDate(date)
                                            }
                                        />
                                    </Form.Item>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Form.Item
                                            label={
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    Start Time
                                                </span>
                                            }
                                            name="from_time"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                            ]}
                                        >
                                            <TimePicker
                                                placeholder="00:00"
                                                format="HH:mm"
                                                className="h-14 w-full rounded-2xl border-gray-100 shadow-sm"
                                                minuteStep={5}
                                                onChange={(time) =>
                                                    setFromTime(time)
                                                }
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    End Time
                                                </span>
                                            }
                                            name="to_time"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Required",
                                                },
                                                {
                                                    validator: (_, value) =>
                                                        fromTime &&
                                                        value &&
                                                        value.isAfter(fromTime)
                                                            ? Promise.resolve()
                                                            : Promise.reject(
                                                                  "Sequence fault",
                                                              ),
                                                },
                                            ]}
                                        >
                                            <TimePicker
                                                placeholder="00:00"
                                                format="HH:mm"
                                                className="h-14 w-full rounded-2xl border-gray-100 shadow-sm"
                                                minuteStep={5}
                                            />
                                        </Form.Item>
                                    </div>

                                    {selectedApplication?.interview_mode ===
                                        "online" && (
                                        <Form.Item
                                            label={
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    Meet Link
                                                </span>
                                            }
                                            name="meet_link"
                                        >
                                            <Input
                                                prefix={
                                                    <LinkOutlined className="text-blue-500" />
                                                }
                                                placeholder="https://updated-link..."
                                                className="h-14 rounded-2xl border-gray-100 shadow-sm"
                                            />
                                        </Form.Item>
                                    )}
                                </div>

                                <div className="flex justify-end gap-6">
                                    <Button
                                        onClick={() =>
                                            setRescheduleModalOpen(false)
                                        }
                                        className="h-16 px-10 rounded-2xl bg-gray-100 text-gray-500 border-none font-black text-[10px] uppercase tracking-widest hover:bg-gray-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="h-16 px-16 rounded-2xl bg-[#071C50] text-white hover:bg-[#1681FF] border-none font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all"
                                    >
                                        Confirm Reschedule
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </div>
            <style>{`
                .premium-modal-v2 .ant-modal-content { border-radius: 48px !important; padding: 40px !important; overflow: hidden !important; border: 1px solid #f3f4f6 !important; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </Main>
    );
};

export default ScheduledApplications;
