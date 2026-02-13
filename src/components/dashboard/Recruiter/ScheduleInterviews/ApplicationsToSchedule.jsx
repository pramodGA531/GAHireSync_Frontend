import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Modal,
    Button,
    Input,
    Form,
    TimePicker,
    Tag,
    Tooltip,
    Divider,
    Select,
} from "antd";
import dayjs from "dayjs";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LinkOutlined,
    VideoCameraOutlined,
    SettingOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    AuditOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import CustomDatePicker from "../../../common/CustomDatePicker";
import Pageloading from "../../../common/loading/Pageloading";
import Btnloading from "../../../common/loading/Btnloading";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import AppTable from "../../../common/AppTable";
import GoBack from "../../../common/Goback";
const ApplicationsToSchedule = () => {
    const { apiurl, token } = useAuth();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [selectedDate, setSelectedDate] = useState(null);
    const [fromTime, setFromTime] = useState(null);
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/recruiter/schedule_interview/pending_application/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            if (result.error) message.error(result.error);
            else setData(result);
        } catch (e) {
            message.error("Failed to sync queue data.");
        } finally {
            setLoading(false);
        }
    };

    const updateState = async () => {
        try {
            await fetch(`${apiurl}/update-notification-seen/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category: "schedule_interview" }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            updateState();
        }
    }, [token]);

    const fetchApplicationDetails = async (application_id) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/recruiter/schedule_interview/pending_application/?application_id=${application_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            if (result.error) message.error(result.error);
            else {
                setSelectedApplication(result);
                setIsModalOpen(true);
            }
        } catch (error) {
            message.error("Failed to retrieve candidate Job.");
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleInterview = async (values) => {
        const payload = {
            scheduled_date: dayjs(values.scheduled_date).format("YYYY-MM-DD"),
            from_time: values.from_time.format("HH:mm:ss"),
            to_time: values.to_time.format("HH:mm:ss"),
            meet_link: values.meet_link,
        };

        try {
            setBtnLoading(true);
            const response = await fetch(
                `${apiurl}/recruiter/schedule_interview/pending_application/?application_id=${selectedApplication.application_id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (response.ok) {
                message.success("Operational event scheduled successfully.");
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await response.json();
                message.error(err.error || "Execution fault in scheduling.");
            }
        } catch (error) {
            message.error("Critical error in scheduling sequence.");
        } finally {
            setBtnLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        let result = data;

        // Apply Status filter
        if (statusFilter !== "All") {
            result = result.filter(
                (item) => item.location_status === statusFilter,
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
                { label: "Opened", value: "opened" },
                { label: "Closed", value: "closed" },
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
            width: 250,
            cell: ({ row }) => (
                <div
                    className="flex flex-col gap-1 cursor-pointer group"
                    onClick={() =>
                        navigate(
                            `/recruiter/complete_job_post/${row.original.job_id}`,
                        )
                    }
                >
                    <span className="text-[#1681FF] font-black text-sm tracking-tight group-hover:underline">
                        {row.getValue("job_title")}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <GlobalOutlined /> {row.original.job_location}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "candidate_name",
            header: "Candidate",
            searchField: true,
            width: 200,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#071C50] text-white flex items-center justify-center font-black text-[10px]">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-[#071C50] font-bold text-xs tracking-tight">
                        {getValue()}
                    </span>
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
                        Lead
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "round_num",
            header: "Round",
            sort: true,
            width: 100,
            cell: ({ getValue }) => (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-100 font-black text-[10px] uppercase tracking-widest">
                    Round {getValue()}
                </span>
            ),
        },
        {
            accessorKey: "location_status",
            header: "Status",
            width: 120,
            cell: ({ getValue }) => (
                <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest ${
                        getValue() === "opened"
                            ? "bg-green-50 text-green-600 border border-green-100"
                            : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${
                            getValue() === "opened"
                                ? "bg-green-600 animate-pulse"
                                : "bg-red-600"
                        }`}
                    ></div>
                    {getValue()}
                </span>
            ),
        },
        {
            header: "Actions",
            accessorKey: "location_status",
            width: 200,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    type="primary"
                    onClick={() =>
                        fetchApplicationDetails(row.original.application_id)
                    }
                    disabled={row.getValue("location_status") === "closed"}
                    className="h-10 px-6 rounded-xl bg-[#071C50] hover:bg-[#1681FF] font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-blue-50"
                >
                    Schedule <ArrowRightOutlined />
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="3" defaultSelectedChildKey="3-1">
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-8">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            {/* <div className="-ml-8">
                                <GoBack />
                                </div> */}
                            <h1 className="text-3xl font-black text-[#071C50] ">
                                New Applications
                            </h1>
                            <p className="text-sm text-gray-400 font-bold">
                                Schedule interviews for new applications
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <ClockCircleOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Backlog Status
                                </p>
                                <p className="text-[#071C50] font-black text-lg">
                                    {data.length}{" "}
                                    <span className="text-sm text-gray-400 font-bold">
                                        Pending Sessions
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
                        // <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden p-6">
                        <AppTable
                            data={filteredData}
                            columns={columns}
                            multiSelect={false}
                            pageSize={15}
                            customFilters={customFilters}
                        />
                        // </d iv>
                    )}

                    <Modal
                        title={null}
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                        width={850}
                        centered
                        className="premium-modal-v2"
                        closeIcon={
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                                <ReloadOutlined className="rotate-45" />
                            </div>
                        }
                    >
                        {selectedApplication && (
                            <div className="p-2">
                                <div className="mb-10 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[24px] bg-[#001744] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                                        <CalendarOutlined className="text-2xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-[#071C50] tracking-tighter m-0">
                                            Schedule Interview
                                        </h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            Assignment:{" "}
                                            {selectedApplication.job_title}
                                        </p>
                                    </div>
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleScheduleInterview}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {/* Interviewer Module */}
                                        <div className="space-y-6 bg-slate-50/50 p-8 rounded-[32px] border border-gray-100/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm border border-gray-100">
                                                    <SafetyCertificateOutlined />
                                                </div>
                                                <h3 className="text-[10px] font-black text-[#071C50] uppercase tracking-widest m-0">
                                                    Interviewer
                                                </h3>
                                            </div>

                                            <Form.Item
                                                label={
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Name
                                                    </span>
                                                }
                                            >
                                                <Input
                                                    prefix={
                                                        <UserOutlined className="text-gray-300" />
                                                    }
                                                    value={
                                                        selectedApplication.interviewer_name
                                                    }
                                                    disabled
                                                    className="h-12 border-gray-200 bg-white font-bold text-gray-500 rounded-xl shadow-sm"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Email
                                                    </span>
                                                }
                                            >
                                                <Input
                                                    prefix={
                                                        <MailOutlined className="text-gray-300" />
                                                    }
                                                    value={
                                                        selectedApplication.interviewer_email
                                                    }
                                                    disabled
                                                    className="h-12 border-gray-200 bg-white font-bold text-gray-500 rounded-xl shadow-sm"
                                                />
                                            </Form.Item>
                                        </div>

                                        {/* Candidate Module */}
                                        <div className="space-y-6 bg-indigo-50/20 p-8 rounded-[32px] border border-indigo-50/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-50">
                                                    <UserOutlined />
                                                </div>
                                                <h3 className="text-[10px] font-black text-[#071C50] uppercase tracking-widest m-0">
                                                    Candidate
                                                </h3>
                                            </div>

                                            <Form.Item
                                                label={
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Name
                                                    </span>
                                                }
                                            >
                                                <Input
                                                    prefix={
                                                        <UserOutlined className="text-gray-300" />
                                                    }
                                                    value={
                                                        selectedApplication.candidate_name
                                                    }
                                                    disabled
                                                    className="h-12 border-gray-100 bg-white font-bold text-slate-600 rounded-xl"
                                                />
                                            </Form.Item>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Form.Item
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Phone
                                                        </span>
                                                    }
                                                >
                                                    <Input
                                                        prefix={
                                                            <PhoneOutlined className="text-gray-300 text-[10px]" />
                                                        }
                                                        value={
                                                            selectedApplication.candidate_contact
                                                        }
                                                        disabled
                                                        className="h-10 border-gray-100 bg-white font-bold text-slate-600 text-xs rounded-lg"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Email
                                                        </span>
                                                    }
                                                >
                                                    <Input
                                                        prefix={
                                                            <MailOutlined className="text-gray-300 text-[10px]" />
                                                        }
                                                        value={
                                                            selectedApplication.candidate_email
                                                        }
                                                        disabled
                                                        className="h-10 border-gray-100 bg-white font-bold text-slate-600 text-xs rounded-lg"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Operational Details */}
                                    <div className="space-y-8 bg-blue-600 p-10 rounded-[40px] shadow-2xl shadow-blue-100 text-white">
                                        <div className="flex items-center gap-3">
                                            <SettingOutlined className="text-white animate-spin-slow" />
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest m-0">
                                                Interview Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <Form.Item
                                                    label={
                                                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                                            Job
                                                        </span>
                                                    }
                                                    className="mb-0"
                                                >
                                                    <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                                                        <AuditOutlined className="text-blue-200" />
                                                        <span className="text-white font-bold text-sm tracking-tight">
                                                            {
                                                                selectedApplication.job_title
                                                            }
                                                        </span>
                                                    </div>
                                                </Form.Item>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                                                            Type
                                                        </p>
                                                        <p className="text-white font-black text-[10px] uppercase">
                                                            {
                                                                selectedApplication.interview_type
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                                                            Mode
                                                        </p>
                                                        <p className="text-white font-black text-[10px] uppercase">
                                                            {
                                                                selectedApplication.interview_mode
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <Form.Item
                                                    name="scheduled_date"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                                            Date
                                                        </span>
                                                    }
                                                >
                                                    <CustomDatePicker
                                                        placeholder="Select chronology"
                                                        format="YYYY-MM-DD"
                                                        className="h-12 w-full custom-date-white"
                                                        startDate={yesterday}
                                                        onChange={(date) =>
                                                            setSelectedDate(
                                                                date,
                                                            )
                                                        }
                                                    />
                                                </Form.Item>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Form.Item
                                                        name="from_time"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    "Required",
                                                            },
                                                        ]}
                                                        label={
                                                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                                                Start Time
                                                            </span>
                                                        }
                                                    >
                                                        <TimePicker
                                                            placeholder="00:00"
                                                            format="HH:mm"
                                                            className="h-12 w-full custom-time-white"
                                                            minuteStep={5}
                                                            onChange={(t) =>
                                                                setFromTime(t)
                                                            }
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="to_time"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    "Required",
                                                            },
                                                            {
                                                                validator: (
                                                                    _,
                                                                    v,
                                                                ) =>
                                                                    fromTime &&
                                                                    v &&
                                                                    v.isAfter(
                                                                        fromTime,
                                                                    )
                                                                        ? Promise.resolve()
                                                                        : Promise.reject(
                                                                              "Exit must follow entry",
                                                                          ),
                                                            },
                                                        ]}
                                                        label={
                                                            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                                                End Time
                                                            </span>
                                                        }
                                                    >
                                                        <TimePicker
                                                            placeholder="00:00"
                                                            format="HH:mm"
                                                            className="h-12 w-full custom-time-white"
                                                            minuteStep={5}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedApplication.interview_mode ===
                                            "online" && (
                                            <Form.Item
                                                name="meet_link"
                                                label={
                                                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                                        Meet Link
                                                    </span>
                                                }
                                            >
                                                <Input
                                                    prefix={
                                                        <LinkOutlined className="text-blue-300" />
                                                    }
                                                    className="h-14 bg-white/10 border-white/20 text-white placeholder-white/30 rounded-2xl"
                                                    placeholder="https://meet.google.com/..."
                                                />
                                            </Form.Item>
                                        )}

                                        <div className="pt-6 flex justify-end gap-6">
                                            <Button
                                                onClick={() =>
                                                    setIsModalOpen(false)
                                                }
                                                className="h-16 px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={btnLoading}
                                                className="h-16 px-16 rounded-2xl bg-white text-[#1681FF] hover:scale-105 border-none font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900 transition-all flex items-center gap-3"
                                            >
                                                Confirm Schedule{" "}
                                                {btnLoading ? (
                                                    <Btnloading spincolor="blue-spinner" />
                                                ) : (
                                                    <CheckCircleOutlined />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </Modal>
                </div>
            </div>
            <style>{`
                .custom-date-white input { color: white !important; font-weight: 700 !important; }
                .custom-date-white .ant-picker-suffix { color: white !important; opacity: 0.5; }
                .custom-date-white { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(255, 255, 255, 0.2) !important; border-radius: 16px !important; }
                .custom-time-white input { color: white !important; font-weight: 700 !important; }
                .custom-time-white .ant-picker-suffix { color: white !important; opacity: 0.5; }
                .custom-time-white { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(255, 255, 255, 0.2) !important; border-radius: 16px !important; }
                .premium-modal-v2 .ant-modal-content { border-radius: 48px !important; padding: 40px !important; overflow: hidden !important; border: 1px solid #f3f4f6 !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </Main>
    );
};

export default ApplicationsToSchedule;
