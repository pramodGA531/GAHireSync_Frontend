import React, { useEffect, useState } from "react";
import { useAuth } from "../common/useAuth";
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
    Tooltip,
    Badge,
    Empty,
} from "antd";
import {
    SearchOutlined,
    UploadOutlined,
    PlusCircleOutlined,
    SendOutlined,
    PaperClipOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    UserOutlined,
    MessageOutlined,
    InboxOutlined,
    FilterOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const { Option } = Select;

const AllTickets = ({ setTicketId, activeTicketId }) => {
    const [isSent, setIsSent] = useState(true);
    const [sentList, setSentList] = useState([]);
    const [receivedList, setReceivedList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const { token, apiurl } = useAuth();

    const fetchData = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/view-tickets/?isSent=${isSent}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                if (isSent) setSentList(data);
                else setReceivedList(data);
            }
        } catch (e) {
            message.error("Failed to fetch tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, isSent]);

    const filteredTickets = (isSent ? sentList : receivedList).filter(
        (ticket) =>
            (isSent ? ticket?.assigned_to : ticket?.raised_by)
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-full md:w-[380px] shrink-0">
            {/* Toggle Section */}
            <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            isSent
                                ? "bg-[#1681FF] text-white shadow-lg shadow-blue-100"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                        onClick={() => setIsSent(true)}
                    >
                        Outgoing
                    </button>
                    <button
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            !isSent
                                ? "bg-[#1681FF] text-white shadow-lg shadow-blue-100"
                                : "text-gray-400 hover:text-gray-600"
                        }`}
                        onClick={() => setIsSent(false)}
                    >
                        Incoming
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="p-4 border-b border-gray-50">
                <Input
                    prefix={<SearchOutlined className="text-gray-300 mr-2" />}
                    placeholder="Search by name..."
                    className="h-11 rounded-xl border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List Section */}
            <div className="flex-1 overflow-y-auto sidebar-scroll p-2 space-y-1">
                {loading ? (
                    <div className="p-10 flex flex-col items-center gap-3 opacity-30">
                        <ClockCircleOutlined className="text-3xl animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Loading Inbox...
                        </span>
                    </div>
                ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => setTicketId(ticket.id)}
                            className={`group p-4 rounded-2xl cursor-pointer transition-all border ${
                                activeTicketId === ticket.id
                                    ? "bg-blue-50 border-blue-100"
                                    : "bg-white border-transparent hover:bg-gray-50/80 hover:border-gray-100"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className={`text-sm font-bold tracking-tight ${
                                        activeTicketId === ticket.id
                                            ? "text-[#1681FF]"
                                            : "text-[#071C50]"
                                    }`}
                                >
                                    {isSent
                                        ? ticket.assigned_to
                                        : ticket.raised_by}
                                </span>
                                <span className="text-[9px] font-black text-gray-300 uppercase italic">
                                    {format(
                                        new Date(ticket.created_at),
                                        "MMM d",
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <Tag className="bg-white border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-tighter m-0 rounded-md">
                                    {ticket.category}
                                </Tag>
                                {ticket.status === "pending" && (
                                    <Badge
                                        status="processing"
                                        color="#1681FF"
                                        className="animate-pulse"
                                    />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No tickets found"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const ParticularTicket = ({ ticket_id, onBack }) => {
    const [data, setData] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [file, setFile] = useState(null);
    const [sending, setSending] = useState(false);
    const { apiurl, token } = useAuth();

    const fetchData = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/view-tickets/?ticket_id=${id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setData(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (ticket_id) fetchData(ticket_id);
    }, [ticket_id]);

    const sendReply = async () => {
        if (!replyText && !file) {
            message.error("Please enter a message or upload a file.");
            return;
        }

        setSending(true);
        const formData = new FormData();
        formData.append("ticket_id", ticket_id);
        if (replyText) formData.append("message", replyText);
        if (file) formData.append("attachment", file);

        try {
            const response = await fetch(
                `${apiurl}/ticket/send-reply/?ticket_id=${ticket_id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                },
            );
            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else {
                message.success("Reply sent successfully");
                setReplyText("");
                setFile(null);
                fetchData(ticket_id);
            }
        } catch (e) {
            message.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/ticket/update-status/?ticket_id=${id}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            if (result.error) message.error(result.error);
            else {
                message.success("Ticket marked as resolved");
                fetchData(id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!ticket_id) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 p-10 select-none">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-xl mb-6">
                    <InboxOutlined className="text-[#1681FF] text-3xl" />
                </div>
                <h3 className="text-xl font-black text-[#071C50] tracking-tight mb-2">
                    Issue Tracking Terminal
                </h3>
                <p className="text-gray-400 font-medium text-sm max-w-xs text-center">
                    Select a ticket from the sidebar to view the conversation
                    history and provide resolutions.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Area */}
            {data && (
                <>
                    <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center z-10 bg-white/80 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                shape="circle"
                                className="md:hidden border-none"
                                onClick={onBack}
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-[#071C50] leading-none mb-0">
                                        {data.assigned_to}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                                        REF: #{data.id}
                                    </span>
                                </div>
                                <span className="bg-blue-50 text-[#1681FF] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-100 w-fit">
                                    {data.category}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            {data.status !== "completed" && (
                                <div className="hidden lg:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
                                    <span className="text-[10px] text-green-700 font-black uppercase tracking-tighter">
                                        Issue Resolved?
                                    </span>
                                    <Button
                                        size="small"
                                        className="h-7 bg-green-500 hover:bg-green-600 text-white border-none font-black text-[9px] uppercase rounded-lg px-4"
                                        onClick={() => updateStatus(data.id)}
                                    >
                                        Yes, Close Now
                                    </Button>
                                </div>
                            )}
                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">
                                    System Status
                                </p>
                                <Tag
                                    className={`rounded-xl border-none font-black text-[10px] uppercase tracking-widest px-3 ${
                                        data.status === "completed"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-amber-100 text-amber-600"
                                    }`}
                                >
                                    {data.status}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto sidebar-scroll p-4 md:p-8 bg-gray-50/30">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Original Issue */}
                            <div className="flex gap-4">
                                <Avatar
                                    size={40}
                                    icon={<UserOutlined />}
                                    className="bg-[#001744] shadow-lg shrink-0"
                                />
                                <div className="space-y-3 flex-1">
                                    <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm relative group">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] font-black text-[#1681FF] uppercase tracking-[0.2em]">
                                                Initial Report
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300 italic">
                                                {data.date}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-black text-[#071C50] mb-4 tracking-tight">
                                            {data.subject}
                                        </h4>
                                        <p className="text-gray-600 font-medium leading-relaxed">
                                            {data.description}
                                        </p>

                                        {data.attachments && (
                                            <div className="mt-6 pt-4 border-t border-gray-50">
                                                <a
                                                    href={`${apiurl}/${data.attachments}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-[#1681FF] font-bold text-[10px] uppercase hover:underline"
                                                >
                                                    <PaperClipOutlined />{" "}
                                                    {data.attachment_name
                                                        ?.split("/")
                                                        .pop()}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Replies List */}
                            {data.replies_list?.map((reply, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-4 ${
                                        reply.is_staff
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                    }`}
                                >
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined />}
                                        className={`${
                                            reply.is_staff
                                                ? "bg-blue-600"
                                                : "bg-gray-800"
                                        } shadow-lg shrink-0`}
                                    />
                                    <div
                                        className={`space-y-1 flex-1 max-w-[80%]`}
                                    >
                                        <div
                                            className={`p-5 rounded-3xl border shadow-sm ${
                                                reply.is_staff
                                                    ? "bg-blue-50/50 border-blue-100 rounded-tl-none"
                                                    : "bg-white border-gray-100 rounded-tr-none"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span
                                                    className={`text-[9px] font-black uppercase tracking-widest ${
                                                        reply.is_staff
                                                            ? "text-blue-500"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {reply.name}
                                                </span>
                                                <span className="text-[8px] font-bold text-gray-300 italic uppercase">
                                                    {format(
                                                        new Date(
                                                            reply.created_at,
                                                        ),
                                                        "MMM d, h:mm a",
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                                {reply.message}
                                            </p>

                                            {reply.attachment && (
                                                <div className="mt-4 pt-3 border-t border-gray-50/50">
                                                    <a
                                                        href={`${apiurl}/${reply.attachment}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[9px] font-black uppercase text-blue-500 flex items-center gap-1.5 hover:underline"
                                                    >
                                                        <PaperClipOutlined />{" "}
                                                        Shared Asset
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Input Area */}
                    {data.status !== "completed" && (
                        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white transition-all">
                                    <Input.TextArea
                                        placeholder="Type your resolution message or update..."
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        value={replyText}
                                        onChange={(e) =>
                                            setReplyText(e.target.value)
                                        }
                                        className="border-none bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 shadow-none text-gray-700 font-medium p-4 text-sm"
                                    />

                                    <div className="flex justify-between items-center p-2 border-t border-gray-100/50">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                id="ticket-file"
                                                className="hidden"
                                                onChange={(e) =>
                                                    setFile(e.target.files[0])
                                                }
                                            />
                                            <Button
                                                icon={<PaperClipOutlined />}
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "ticket-file",
                                                        )
                                                        .click()
                                                }
                                                className={`rounded-xl border-none h-10 px-4 flex items-center gap-2 text-xs font-bold transition-all ${
                                                    file
                                                        ? "bg-amber-100 text-amber-600"
                                                        : "bg-white text-gray-400 hover:text-gray-600"
                                                }`}
                                            >
                                                {file
                                                    ? file.name.slice(0, 15) +
                                                      "..."
                                                    : "Attach Image"}
                                            </Button>
                                            {file && (
                                                <Button
                                                    shape="circle"
                                                    size="small"
                                                    className="border-none bg-red-50 text-red-500"
                                                    onClick={() =>
                                                        setFile(null)
                                                    }
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>

                                        <Button
                                            type="primary"
                                            loading={sending}
                                            onClick={sendReply}
                                            icon={<SendOutlined />}
                                            className="h-10 px-8 rounded-xl bg-[#1681FF] hover:bg-[#0061D5] font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 border-none flex items-center gap-2"
                                        >
                                            Deliver Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const TicketMessages = () => {
    const { apiurl, token } = useAuth();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ticketId, setTicketId] = useState(null);
    const [isOtherSelected, setIsOtherSelected] = useState(false);

    const raiseTicket = async (values) => {
        try {
            const formData = new FormData();
            formData.append(
                "category",
                values.category === "Other"
                    ? values.customCategory
                    : values.category,
            );
            formData.append("description", values.description);
            formData.append("subject", values.subject); // Added subject support if missing in UI but needed in API

            if (values.attachments && values.attachments.length > 0) {
                formData.append(
                    "attachment",
                    values.attachments[0].originFileObj,
                );
            }

            const response = await fetch(`${apiurl}/view-tickets/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const result = await response.json();
            if (result.error) message.error(result.error);
            else {
                message.success("Issue formalised and logged.");
                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (error) {
            message.error("Terminating: System failure in issue logging.");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-72px)] bg-gray-50/30 overflow-hidden">
            <div className="p-4 md:p-8 flex justify-between items-center bg-white border-b border-gray-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#071C50] tracking-tight mb-1">
                        Support Command
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Secure communication with technical desk
                    </p>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={
                        <PlusCircleOutlined className="text-sm sm:text-base" />
                    }
                    onClick={() => setIsModalOpen(true)}
                    className="
                        h-10 sm:h-14
                        px-4 sm:px-8
                        rounded-xl sm:rounded-2xl
                        bg-[#1681FF] hover:bg-[#0061D5]
                        font-black
                        text-[9px] sm:text-[10px]
                        uppercase tracking-widest
                        shadow-lg sm:shadow-xl shadow-blue-100
                        border-none
                        flex items-center
                        gap-2 sm:gap-3
                    "
                >
                    New Ticket
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div
                    className={`${
                        ticketId ? "hidden md:flex" : "flex"
                    } h-full w-full md:w-auto`}
                >
                    <AllTickets
                        setTicketId={setTicketId}
                        activeTicketId={ticketId}
                    />
                </div>
                <div
                    className={`${
                        !ticketId ? "hidden md:flex" : "flex"
                    } flex-1 h-full w-full`}
                >
                    <ParticularTicket
                        ticket_id={ticketId}
                        onBack={() => setTicketId(null)}
                    />
                </div>
            </div>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={550}
                style={{ maxWidth: "95vw" }}
                centered
                className="modal-no-padding rounded-3xl overflow-hidden"
            >
                <div className="flex flex-col">
                    <div className="p-8 bg-[#001744] text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <PlusCircleOutlined className="text-2xl" />
                            <h3 className="text-2xl font-black text-white mb-0 tracking-tight">
                                Technical Request
                            </h3>
                        </div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                            Document your system issue or feedback
                        </p>
                    </div>

                    <div className="p-8">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={raiseTicket}
                            className="space-y-4"
                        >
                            <Form.Item
                                label={
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Help Category
                                    </span>
                                }
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Classification required",
                                    },
                                ]}
                            >
                                <Select
                                    className="h-12 border-gray-100"
                                    placeholder="Select issue domain"
                                    onChange={(value) =>
                                        setIsOtherSelected(value === "Other")
                                    }
                                >
                                    <Option value="Support">
                                        System Support
                                    </Option>
                                    <Option value="Feature Request">
                                        Platform Feedback
                                    </Option>
                                    <Option value="Bug Report">
                                        Technical Anomaly
                                    </Option>
                                    <Option value="Access Request">
                                        Authorization Desk
                                    </Option>
                                    <Option value="Performance Issue">
                                        Latency Report
                                    </Option>
                                    <Option value="Other">Miscellaneous</Option>
                                </Select>
                            </Form.Item>

                            {isOtherSelected && (
                                <Form.Item
                                    label={
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Custom Specification
                                        </span>
                                    }
                                    name="customCategory"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please specify request type",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter request identifier"
                                        className="h-12 rounded-xl"
                                    />
                                </Form.Item>
                            )}

                            <Form.Item
                                label={
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Brief Topic
                                    </span>
                                }
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: "Subject is mandatory",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Short summary of the issue"
                                    className="h-12 rounded-xl"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Detailed Context
                                    </span>
                                }
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Full description required",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="State exactly what happened or what you need..."
                                    className="rounded-xl p-4"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Evidence Asset (Optional)
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
                                    maxCount={1}
                                    className="w-full"
                                >
                                    <Button
                                        block
                                        icon={<UploadOutlined />}
                                        className="h-12 border-dashed border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-200"
                                    >
                                        Attach Screenshots / Logs
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-50 mt-8">
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    className="h-12 px-8 rounded-2xl font-bold text-gray-400 border-none hover:bg-gray-100 text-[10px] uppercase tracking-widest"
                                >
                                    Abort
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<CheckCircleOutlined />}
                                    className="h-12 px-10 rounded-2xl bg-[#1681FF] hover:bg-[#0061D5] font-black text-[10px] uppercase tracking-widest border-none shadow-lg shadow-blue-100 flex items-center gap-2"
                                >
                                    Lodge Request
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TicketMessages;
