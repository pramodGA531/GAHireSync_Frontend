import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../common/useAuth";
import { ticketService } from "../../service/TicketsService";
import {
    message,
    Form,
    Modal,
    Input,
    Select,
    Upload,
    Button,
    Tag,
    Avatar,
    Empty,
} from "antd";
import {
    SearchOutlined,
    PlusCircleOutlined,
    PaperClipOutlined,
    ClockCircleOutlined,
    UserOutlined,
    InboxOutlined,
    ArrowLeftOutlined,
    TagOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const { Option } = Select;
const { TextArea } = Input;

const AllExternalTickets = ({
    tickets,
    setTicket,
    activeTicketId,
    loading,
    searchTerm,
    setSearchTerm,
}) => {
    const filteredTickets = tickets.filter(
        (ticket) =>
            ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.task_code?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-full md:w-[350px] shrink-0">
            {/* Header Section */}
            <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                <h3 className="text-sm font-bold text-gray-800 mb-0">
                    My Tickets
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                    Track and manage your requests
                </p>
            </div>

            {/* Search Section */}
            <div className="p-4 border-b border-gray-50">
                <Input
                    prefix={<SearchOutlined className="text-gray-400 mr-2" />}
                    placeholder="Search tickets..."
                    className="h-10 rounded-xl border-gray-200 bg-white hover:border-gray-300 focus:border-blue-400 transition-all text-sm shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto sidebar-scroll p-3 space-y-2">
                {loading ? (
                    <div className="p-10 flex flex-col items-center gap-3 opacity-50">
                        <ClockCircleOutlined className="text-2xl animate-spin text-blue-400" />
                        <span className="text-xs text-gray-400 font-medium">
                            Syncing with helpdesk...1
                        </span>
                    </div>
                ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket.task_code}
                            onClick={() => setTicket(ticket)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                activeTicketId === ticket.task_code
                                    ? "bg-blue-50/50 border-blue-200 shadow-sm ring-1 ring-blue-100"
                                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 shadow-sm"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                    {ticket.task_code}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {ticket.created_at
                                        ? format(
                                              new Date(ticket.created_at),
                                              "MMM d, yyyy",
                                          )
                                        : "N/A"}
                                </span>
                            </div>
                            <h4
                                className={`text-sm font-bold truncate mb-2 ${
                                    activeTicketId === ticket.task_code
                                        ? "text-blue-700"
                                        : "text-gray-800"
                                }`}
                            >
                                {ticket.title}
                            </h4>
                            <div className="flex items-center justify-between">
                                <Tag
                                    className={`text-[10px] m-0 border-none px-2 py-0.5 rounded-lg capitalize font-semibold shadow-sm ${
                                        ticket.current_status ===
                                            "Processing" ||
                                        ticket.current_status === "In Progress"
                                            ? "bg-orange-100 text-orange-600"
                                            : ticket.current_status ===
                                                    "Closed" ||
                                                ticket.current_status ===
                                                    "Completed"
                                              ? "bg-green-100 text-green-600"
                                              : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    {ticket.current_status ||
                                        ticket.status ||
                                        "Received"}
                                </Tag>
                                {ticket.attachments?.length > 0 && (
                                    <PaperClipOutlined className="text-gray-300 text-xs" />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-xs font-medium text-gray-400">
                                    No tickets found
                                </span>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ParticularExternalTicket = ({ ticket, onBack }) => {
    if (!ticket) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/20 p-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-xl mb-6">
                    <InboxOutlined className="text-gray-200 text-4xl" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">
                    Select a Conversation
                </h3>
                <p className="text-gray-400 text-sm max-w-xs text-center leading-relaxed">
                    Click on a ticket from the sidebar to view detailed status
                    and attachments from our Digital Operations team.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Header Area */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        shape="circle"
                        className="md:hidden border-none text-gray-400 hover:bg-gray-50"
                        onClick={onBack}
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                {ticket.task_code}
                            </span>
                            <h3 className="text-xl font-black text-gray-900 mb-0 leading-none">
                                {ticket.title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5">
                                <CalendarOutlined className="text-gray-400 text-xs" />
                                <span className="text-[11px] text-gray-500 font-medium tracking-tight">
                                    Raised on{" "}
                                    {ticket.created_at
                                        ? format(
                                              new Date(ticket.created_at),
                                              "MMMM d, yyyy",
                                          )
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <TagOutlined className="text-gray-400 text-xs" />
                                <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border-none shadow-sm capitalize ${
                                        ticket.current_status === "Processing"
                                            ? "bg-orange-50 text-orange-600"
                                            : ticket.current_status === "Closed"
                                              ? "bg-green-50 text-green-600"
                                              : "bg-blue-50 text-blue-600"
                                    }`}
                                >
                                    Status: {ticket.current_status || "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto sidebar-scroll p-8 bg-gray-50/30">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-xl shadow-blue-50/50 mb-8 relative overflow-hidden">
                        {/* Gradient Badge */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-50 to-transparent -mr-12 -mt-12 rounded-full"></div>

                        <div className="flex items-center gap-3 mb-6">
                            <Avatar
                                size={40}
                                icon={<UserOutlined />}
                                className="bg-blue-600 shadow-lg"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-0">
                                    Ticket Details
                                </h4>
                                <p className="text-[10px] text-gray-400 font-medium">
                                    Primary inquiry information
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    Issue Description
                                </label>
                                <p className="text-gray-700 text-sm leading-8 font-medium">
                                    {ticket.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            {ticket.attachments &&
                                ticket.attachments.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-50">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">
                                            Attachments
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {ticket.attachments.map(
                                                (file, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={file.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <PaperClipOutlined className="text-lg" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-bold text-gray-800 truncate">
                                                                {file.file
                                                                    ?.split("/")
                                                                    .pop()}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400 font-medium">
                                                                Uploaded on{" "}
                                                                {new Date(
                                                                    file.uploaded_at,
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Timeline placeholder / Note */}
                    {/* <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                                <ClockCircleOutlined className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black mb-1">
                                    External Operations Policy
                                </h4>
                                <p className="text-sm text-blue-50/80 font-medium leading-relaxed mb-0">
                                    This ticket is managed by the GA Digital
                                    Operations team. Updates to the status will
                                    reflect here in real-time. For urgent
                                    inquiries, please contact our support desk
                                    directly.
                                </p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

const ExternalTicketMessages = () => {
    const { apiurl, token, userData } = useAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [fullUserDetails, setFullUserDetails] = useState(null);

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await fetch(`${apiurl}/get-user-details/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.data) {
                setFullUserDetails(result.data);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [apiurl, token]);

    const fetchTickets = useCallback(async () => {
        if (!userData?.user_id) return;
        setLoading(true);
        try {
            // Admin role sees all tickets by not providing an emp_id
            const empId = userData?.role === "admin" ? null : userData.user_id;
            const data = await ticketService.getTickets(empId);
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error("Unable to sync tickets from the external system.");
        } finally {
            setLoading(false);
        }
    }, [userData?.user_id, userData?.role]);

    useEffect(() => {
        fetchTickets();
        fetchUserDetails();
    }, [fetchTickets, fetchUserDetails]);

    const handleCreateTicket = async (values) => {
        if (!fullUserDetails?.email) {
            message.error("User email is required to raise a ticket.");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description || "");
            formData.append("raised_by_id", userData.user_id);
            formData.append("raised_by_email", fullUserDetails.email);

            if (values.attachments && values.attachments.length > 0) {
                values.attachments.forEach((file) => {
                    formData.append("attachments", file.originFileObj);
                });
            }

            await ticketService.createTicket(formData);
            message.success(
                "Ticket submitted successfully to Digital Operations.",
            );
            setIsModalOpen(false);
            form.resetFields();
            fetchTickets();
        } catch (error) {
            message.error(
                "Submission failed. Please check your network and try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-72px)] bg-white overflow-hidden">
            {/* Main Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-0 tracking-tight">
                        Help & Support
                    </h1>
                    <p className="text-gray-400 text-[11px] font-bold mt-1 uppercase tracking-widest">
                        Digital Operations Portal
                    </p>
                </div>
                {userData?.role !== "admin" && (
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => setIsModalOpen(true)}
                        className="h-11 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-xs border-none shadow-xl shadow-blue-100 flex items-center gap-2 transform active:scale-95 transition-all"
                    >
                        New Request
                    </Button>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div
                    className={`${
                        activeTicket ? "hidden md:flex" : "flex"
                    } h-full w-full md:w-auto`}
                >
                    <AllExternalTickets
                        tickets={tickets}
                        setTicket={setActiveTicket}
                        activeTicketId={activeTicket?.task_code}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>
                <div
                    className={`${
                        !activeTicket ? "hidden md:flex" : "flex"
                    } flex-1 h-full w-full`}
                >
                    <ParticularExternalTicket
                        ticket={activeTicket}
                        onBack={() => setActiveTicket(null)}
                    />
                </div>
            </div>

            {/* Create Ticket Modal */}
            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={550}
                centered
                className="premium-modal"
                styles={{ body: { padding: 0 } }}
            >
                <div className="p-10">
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">
                            Raise Support Ticket
                        </h3>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">
                            Describe your issue clearly. Our operations team
                            usually responds within 24-48 business hours.
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateTicket}
                        requiredMark={false}
                        className="space-y-6"
                    >
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Inquiry Subject
                                </span>
                            }
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "A concise title is required",
                                },
                            ]}
                        >
                            <Input
                                placeholder="What can we help you with?"
                                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 focus:bg-white transition-all text-sm font-medium"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Detailed Explanation
                                </span>
                            }
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Please provide more details",
                                },
                            ]}
                        >
                            <TextArea
                                rows={5}
                                placeholder="Tell us more about the issue, including steps to reproduce if applicable..."
                                className="rounded-3xl p-4 border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 focus:bg-white transition-all text-sm font-medium leading-relaxed"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Supporting Documents (PDF/Images)
                                </span>
                            }
                            name="attachments"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload
                                beforeUpload={() => false}
                                multiple
                                listType="picture"
                            >
                                <Button className="h-12 w-full rounded-2xl border-dashed border-gray-200 text-gray-500 font-bold text-xs hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                                    <PaperClipOutlined /> click to upload files
                                </Button>
                            </Upload>
                        </Form.Item>

                        <div className="flex gap-4 mt-12">
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 h-12 rounded-2xl font-black text-xs border-gray-100 text-gray-500 hover:text-gray-800"
                            >
                                DISCARD
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                className="flex-2 h-12 px-10 rounded-2xl font-black text-xs bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-100"
                            >
                                SUBMIT TICKET
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default ExternalTicketMessages;
