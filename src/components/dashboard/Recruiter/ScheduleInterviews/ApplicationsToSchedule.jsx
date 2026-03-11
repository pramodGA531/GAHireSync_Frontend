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
    Typography,
} from "antd";
const { Title, Text } = Typography;
import dayjs from "dayjs";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LinkOutlined,
    VideoCameraOutlined,
    SafetyCertificateOutlined,
    GlobalOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    AuditOutlined,
    ReloadOutlined,
    ScheduleOutlined,
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

    useEffect(() => {
        if (token) {
            fetchData();
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
            width: 170,
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            {/* <div className="w-8 h-8 rounded-lg bg-[#071C50] text-white flex items-center justify-center font-black text-[10px]">
                                {row.original.candidate_name?.[0]}
                            </div> */}
                            <span className="text-[#071C50] font-bold text-xs tracking-tight">
                                {row.original.candidate_name}
                            </span>
                        </div>
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
                    {/* <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1 italic">
                        Lead
                    </span> */}
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
            accessorKey: "status",
            header: "App Status",
            width: 120,
            cell: ({ getValue }) => (
                <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest ${
                        getValue() === "hold"
                            ? "bg-orange-50 text-orange-600 border border-orange-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${
                            getValue() === "hold"
                                ? "bg-orange-600 animate-pulse"
                                : "bg-blue-600"
                        }`}
                    ></div>
                    {getValue() === "hold" ? "On Hold" : "Processing"}
                </span>
            ),
        },
        {
            accessorKey: "location_status",
            header: "Job Status",
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
                    className="h-10 px-6 rounded-xl bg-[#071C50] hover:bg-[#1681FF] font-black text-[10px] border-none shadow-lg shadow-blue-50"
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
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        footer={null}
                        width={900}
                        centered
                        className="premium-schedule-modal"
                        closeIcon={null}
                    >
                        {selectedApplication && (
                            <div className="relative overflow-hidden">
                                {/* Decorative background elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none"></div>

                                <div className="relative p-1">
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-start mb-8 px-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1681FF]">
                                                <ScheduleOutlined className="text-xl" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-[#071C50] tracking-tight leading-none mb-1.5">
                                                    Schedule Interview
                                                </h2>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Assignment:
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {
                                                            selectedApplication.job_title
                                                        }
                                                    </span>
                                                    {selectedApplication.is_replacement && (
                                                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-100">
                                                            Replacement
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all border border-gray-100"
                                        >
                                            <ReloadOutlined className="rotate-45 text-xs" />
                                        </button>
                                    </div>

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleScheduleInterview}
                                        className="space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Interviewer Section */}
                                            <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100">
                                                <div className="flex items-center gap-2.5 mb-5">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm border border-gray-50">
                                                        <SafetyCertificateOutlined />
                                                    </div>
                                                    <h3 className="text-[10px] font-black text-[#071C50] uppercase tracking-widest m-0">
                                                        Interviewer Details
                                                    </h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <Form.Item label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Name</span>} className="mb-0">
                                                        <Input 
                                                            prefix={<UserOutlined className="text-gray-300" />}
                                                            value={selectedApplication.interviewer_name}
                                                            disabled
                                                            className="h-10 rounded-xl bg-white border-gray-200 font-bold text-gray-600"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Email Address</span>} className="mb-0">
                                                        <Input 
                                                            prefix={<MailOutlined className="text-gray-300" />}
                                                            value={selectedApplication.interviewer_email}
                                                            disabled
                                                            className="h-10 rounded-xl bg-white border-gray-200 font-bold text-gray-600"
                                                        />
                                                    </Form.Item>
                                                </div>
                                            </div>

                                            {/* Candidate Section */}
                                            <div className="bg-blue-50/30 p-6 rounded-[24px] border border-blue-100/50">
                                                <div className="flex items-center gap-2.5 mb-5">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-blue-50">
                                                        <UserOutlined />
                                                    </div>
                                                    <h3 className="text-[10px] font-black text-[#071C50] uppercase tracking-widest m-0">
                                                        Candidate Details
                                                    </h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <Form.Item label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Name</span>} className="mb-0">
                                                        <Input 
                                                            prefix={<UserOutlined className="text-gray-300" />}
                                                            value={selectedApplication.candidate_name}
                                                            disabled
                                                            className="h-10 rounded-xl bg-white border-blue-100 font-bold text-gray-600"
                                                        />
                                                    </Form.Item>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Form.Item label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Phone</span>} className="mb-0">
                                                            <Input 
                                                                prefix={<PhoneOutlined className="text-gray-300" />}
                                                                value={selectedApplication.candidate_contact}
                                                                disabled
                                                                className="h-10 rounded-xl bg-white border-blue-100 font-bold text-gray-600 text-[10px]"
                                                            />
                                                        </Form.Item>
                                                        <Form.Item label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Email</span>} className="mb-0">
                                                            <Input 
                                                                prefix={<MailOutlined className="text-gray-300" />}
                                                                value={selectedApplication.candidate_email}
                                                                disabled
                                                                className="h-10 rounded-xl bg-white border-blue-100 font-bold text-gray-600 text-[10px]"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-9 h-9 rounded-xl bg-[#071C50] flex items-center justify-center text-white">
                                                    <CalendarOutlined className="text-lg" />
                                                </div>
                                                <h3 className="text-xs font-black text-[#071C50] uppercase tracking-widest m-0">
                                                    Interview Schedule
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-5">
                                                    <Form.Item
                                                        name="scheduled_date"
                                                        rules={[{ required: true, message: "Required" }]}
                                                        label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Date</span>}
                                                        className="mb-0"
                                                    >
                                                        <CustomDatePicker
                                                            placeholder="Select Date"
                                                            format="YYYY-MM-DD"
                                                            // className=""
                                                            startDate={yesterday}
                                                            className="w-full h-12"
                                                            popupClassName="large-calendar"
                                                            onChange={(date) => setSelectedTime(date)}
                                                        />
                                                    </Form.Item>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Form.Item
                                                            name="from_time"
                                                            rules={[{ required: true, message: "Required" }]}
                                                            label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Start Time</span>}
                                                            className="mb-0"
                                                        >
                                                            <TimePicker
                                                                placeholder="00:00"
                                                                format="HH:mm"
                                                                className="h-12 w-full custom-white-time"
                                                                minuteStep={5}
                                                                needConfirm={false}
                                                                onChange={(t) => setFromTime(t)}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name="to_time"
                                                            rules={[
                                                                { required: true, message: "Required" },
                                                                {
                                                                    validator: (_, v) =>
                                                                        fromTime && v && v.isAfter(fromTime)
                                                                            ? Promise.resolve()
                                                                            : Promise.reject("Must follow start"),
                                                                },
                                                            ]}
                                                            label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">End Time</span>}
                                                            className="mb-0"
                                                        >
                                                            <TimePicker
                                                                placeholder="00:00"
                                                                format="HH:mm"
                                                                className="h-12 w-full custom-white-time"
                                                                minuteStep={5}
                                                                needConfirm={false}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>

                                                <div className="space-y-5">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 leading-none">
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight">Mode</span>
                                                            <p className="mt-1 text-[11px] font-black text-[#071C50] uppercase">{selectedApplication.interview_mode}</p>
                                                        </div>
                                                        <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 leading-none">
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight">Type</span>
                                                            <p className="mt-1 text-[11px] font-black text-[#071C50] uppercase">{selectedApplication.interview_type}</p>
                                                        </div>
                                                    </div>

                                                    {selectedApplication.interview_mode === "online" ? (
                                                        <Form.Item
                                                            name="meet_link"
                                                            label={<span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meeting Link</span>}
                                                            className="mb-0"
                                                        >
                                                            <Input
                                                                prefix={<LinkOutlined className="text-blue-400" />}
                                                                className="h-12 bg-white border-gray-200 text-gray-700 placeholder-gray-300 rounded-xl"
                                                                placeholder="Paste meeting URL here"
                                                            />
                                                        </Form.Item>
                                                    ) : (
                                                        <div className="h-12 flex items-center px-4 bg-orange-50 border border-orange-100 rounded-xl">
                                                            <p className="text-[10px] font-bold text-orange-600 m-0">In-person interview at office location</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 px-2">
                                            <Button
                                                onClick={() => setIsModalOpen(false)}
                                                className="h-12 px-8 rounded-xl bg-white hover:bg-gray-50 text-gray-400 border-gray-200 font-black text-[10px] transition-all"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={btnLoading}
                                                className="h-12 px-12 rounded-xl bg-[#071C50] hover:bg-[#1681FF] border-none font-black text-[10px] shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                                            >
                                                Confirm Schedule
                                                {!btnLoading && <CheckCircleOutlined />}
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            </div>
            <style>{`
                .premium-schedule-modal .ant-modal-content {
                    border-radius: 32px !important;
                    padding: 24px !important;
                    background: #ffffff !important;
                    border: 1px solid #f3f4f6 !important;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.08) !important;
                }
                .custom-white-picker {
                    background: #f9fafb !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 12px !important;
                }
                .custom-white-picker input {
                    color: #111827 !important;
                    font-weight: 700 !important;
                    font-size: 13px !important;
                }
                .custom-white-picker input::placeholder {
                    color: #9ca3af !important;
                }
                .custom-white-picker .ant-picker-suffix {
                    color: #6b7280 !important;
                }
                .custom-white-time {
                    background: #f9fafb !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 12px !important;
                }
                .custom-white-time input {
                    color: #111827 !important;
                    font-weight: 700 !important;
                    font-size: 13px !important;
                }
                .custom-white-time input::placeholder {
                    color: #9ca3af !important;
                }
                .custom-white-time .ant-picker-suffix {
                    color: #6b7280 !important;
                }
            `}</style>
        </Main>
    );
};

export default ApplicationsToSchedule;
