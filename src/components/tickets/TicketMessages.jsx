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
    Badge,
    Empty,
} from "antd";
import {
    SearchOutlined,
    PlusCircleOutlined,
    SendOutlined,
    PaperClipOutlined,
    ClockCircleOutlined,
    UserOutlined,
    InboxOutlined,
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
        <div className="flex flex-col h-full bg-white border-r border-gray-100 w-full md:w-[320px] shrink-0">
            {/* Toggle Section */}
            <div className="p-4 border-b border-gray-50">
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <button
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ease-in-out duration-300 ${
                            isSent
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setIsSent(true)}
                    >
                        Outgoing
                    </button>
                    <button
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ease-in-out duration-300 ${
                            !isSent
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
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
                    prefix={<SearchOutlined className="text-gray-400 mr-2" />}
                    placeholder="Search by name..."
                    className="h-10 rounded-lg border-gray-200 bg-white hover:border-gray-300 focus:border-blue-400 transition-all text-sm"
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
                            Loading tickets...
                        </span>
                    </div>
                ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            onClick={() => setTicketId(ticket.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                                activeTicketId === ticket.id
                                    ? "bg-blue-50/50 border-blue-200 shadow-sm"
                                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span
                                    className={`text-sm font-semibold truncate pr-2 ${
                                        activeTicketId === ticket.id
                                            ? "text-blue-600"
                                            : "text-gray-800"
                                    }`}
                                >
                                    {isSent
                                        ? ticket.assigned_to
                                        : ticket.raised_by}
                                </span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {format(
                                        new Date(ticket.created_at),
                                        "MMM d",
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {ticket.category}
                                </span>
                                {ticket.status === "pending" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No tickets"
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
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/20 p-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm mb-4">
                    <InboxOutlined className="text-gray-300 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Select a Ticket
                </h3>
                <p className="text-gray-400 text-sm max-w-xs text-center">
                    Choose a conversation from the list to view details and provide resolution.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Header Area */}
            {data && (
                <>
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                shape="circle"
                                className="md:hidden border-none text-gray-400"
                                onClick={onBack}
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-0 leading-tight">
                                        {data.assigned_to}
                                    </h3>
                                    <span className="text-[11px] text-gray-400 font-medium">
                                        #{data.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Tag className="text-[10px] m-0 border-gray-100 bg-gray-50 text-gray-500 rounded px-1.5">
                                        {data.category}
                                    </Tag>
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                        data.status === "completed"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-blue-50 text-blue-600"
                                    }`}>
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {data.status !== "completed" && (
                            <Button
                                size="small"
                                className="h-8 border-green-200 text-green-600 font-medium hover:bg-green-50 text-xs rounded-lg px-4"
                                onClick={() => updateStatus(data.id)}
                            >
                                Mark Resolved
                            </Button>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto sidebar-scroll p-6 bg-gray-50/10">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Original Issue */}
                            <div className="flex gap-4">
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    className="bg-gray-100 text-gray-400 shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[10px] font-medium text-blue-500 uppercase tracking-wider">
                                                Created Ticket
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {data.date}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-semibold text-gray-800 mb-2">
                                            {data.subject}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-0">
                                            {data.description}
                                        </p>

                                        {data.attachments && (
                                            <div className="mt-4 pt-3 border-t border-gray-50">
                                                <a
                                                    href={`${apiurl}/${data.attachments}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-blue-500 font-medium text-[11px] hover:underline"
                                                >
                                                    <PaperClipOutlined className="text-xs" />
                                                    {data.attachment_name?.split("/").pop()}
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
                                    className={`flex gap-3 ${
                                        reply.is_staff
                                            ? "flex-row"
                                            : "flex-row-reverse"
                                    }`}
                                >
                                    <Avatar
                                        size={32}
                                        icon={<UserOutlined />}
                                        className={`${
                                            reply.is_staff
                                                ? "bg-blue-100 text-blue-500"
                                                : "bg-gray-100 text-gray-400"
                                        } shrink-0`}
                                    />
                                    <div className="max-w-[80%]">
                                        <div
                                            className={`p-4 rounded-xl border shadow-sm ${
                                                reply.is_staff
                                                    ? "bg-blue-50/30 border-blue-100 rounded-tl-none"
                                                    : "bg-white border-gray-100 rounded-tr-none"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center gap-4 mb-2">
                                                <span className={`text-[10px] font-semibold ${
                                                    reply.is_staff ? "text-blue-600" : "text-gray-700"
                                                }`}>
                                                    {reply.name}
                                                </span>
                                                <span className="text-[9px] text-gray-400">
                                                    {format(new Date(reply.created_at), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-0">
                                                {reply.message}
                                            </p>

                                            {reply.attachment && (
                                                <div className="mt-3 pt-2 border-t border-gray-50">
                                                    <a
                                                        href={`${apiurl}/${reply.attachment}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] font-medium text-blue-500 flex items-center gap-1.5 hover:underline"
                                                    >
                                                        <PaperClipOutlined className="text-xs" />
                                                        Shared File
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
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-2 focus-within:bg-white focus-within:border-blue-200 transition-all">
                                    <Input.TextArea
                                        placeholder="Type your reply here..."
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="border-none bg-transparent hover:bg-transparent focus:bg-transparent focus:ring-0 shadow-none text-gray-700 text-sm p-3"
                                    />

                                    <div className="flex justify-between items-center px-2 py-1.5 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                id="ticket-file"
                                                className="hidden"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <Button
                                                icon={<PaperClipOutlined />}
                                                onClick={() => document.getElementById("ticket-file").click()}
                                                className={`h-8 px-3 rounded-lg border-none text-[11px] font-medium transition-all ${
                                                    file
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-transparent text-gray-400 hover:text-gray-600"
                                                }`}
                                            >
                                                {file ? file.name.slice(0, 15) + "..." : "Attach File"}
                                            </Button>
                                            {file && (
                                                <button
                                                    className="text-gray-400 hover:text-red-500 text-lg leading-none"
                                                    onClick={() => setFile(null)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>

                                        <Button
                                            type="primary"
                                            loading={sending}
                                            onClick={sendReply}
                                            className="h-8 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs border-none flex items-center gap-2"
                                        >
                                            Send reply
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
            formData.append("subject", values.subject);

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
                message.success("Ticket raised successfully.");
                setIsModalOpen(false);
                form.resetFields();
            }
        } catch (error) {
            message.error("Error raising ticket.");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-72px)] bg-white overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
                <div>
                    <h1 className="text-2xl font-bold text-black mb-0 leading-tight">
                        Support Tickets
                    </h1>
                    <p className="text-gray-400 text-xs mt-1">
                        View and manage your technical support requests
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs border-none"
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
                width={500}
                style={{ maxWidth: "95vw" }}
                centered
                className="modal-custom rounded-2xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            New Support Ticket
                        </h3>
                        <p className="text-gray-400 text-xs">
                            Please provide details about your issue
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={raiseTicket}
                        className="space-y-4"
                        requiredMark={false}
                    >
                        <Form.Item
                            label={<span className="text-xs font-semibold text-gray-700">Category</span>}
                            name="category"
                            rules={[{ required: true, message: "Category required" }]}
                        >
                            <Select placeholder="Select category" className="h-10">
                                <Option value="Support">System Support</Option>
                                <Option value="Feature Request">Feature Request</Option>
                                <Option value="Bug Report">Bug Report</Option>
                                <Option value="Access Request">Access Request</Option>
                                <Option value="Performance Issue">Performance Issue</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Form.Item>

                        {isOtherSelected && (
                            <Form.Item
                                label={<span className="text-xs font-semibold text-gray-700">Specify Category</span>}
                                name="customCategory"
                                rules={[{ required: true, message: "Please specify" }]}
                            >
                                <Input placeholder="Enter category" className="h-10 rounded-lg" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label={<span className="text-xs font-semibold text-gray-700">Subject</span>}
                            name="subject"
                            rules={[{ required: true, message: "Subject required" }]}
                        >
                            <Input placeholder="Issue summary" className="h-10 rounded-lg" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-semibold text-gray-700">Description</span>}
                            name="description"
                            rules={[{ required: true, message: "Description required" }]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Describe the problem in detail..."
                                className="rounded-lg p-3"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-semibold text-gray-700">Attachments (Optional)</span>}
                            name="attachments"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                        >
                            <Upload beforeUpload={() => false} maxCount={1}>
                                <Button icon={<PaperClipOutlined />} className="rounded-lg text-xs">
                                    Choose file
                                </Button>
                            </Upload>
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                            <Button onClick={() => setIsModalOpen(false)} className="rounded-lg h-10 px-6 font-medium text-xs border-gray-100">
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" className="rounded-lg h-10 px-8 font-semibold text-xs bg-blue-600 hover:bg-blue-700 border-none">
                                Create Ticket
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default TicketMessages;
