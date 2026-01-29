import React, { useEffect, useState, Suspense } from "react";
import { useAuth } from "../useAuth";
import {
    FilterOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    MailOutlined,
    BankOutlined,
    InfoCircleOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import logo from "../../../images/notificatons/notficationlog.svg";
import NoMessages from "../../../images/Illustrations/NoMessages.png";
import NotificationMessage from "./NotificationMessage";
import CustomDatePicker from "../CustomDatePicker";
import Pageloading from "../loading/Pageloading";
import SearchIcon from "../../../images/agency/Search.svg";
import { format } from "date-fns";
import { Badge, Button, Input, Tooltip, Empty } from "antd";

const AllNotifications = () => {
    const [Layout, setLayout] = useState(null);
    const [user, setUser] = useState(null);
    const [key, setKey] = useState(1);
    const [seenIds, setSeenIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentAlert, setCurrentAlert] = useState();
    const { userData, token, apiurl } = useAuth();
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/notifications/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (card) => {
        if (!card.seen && !seenIds.includes(card.id)) {
            setSeenIds((prev) => [...prev, card.id]);
        }
        setSelectedInfo(card);
    };

    const updateSeen = async () => {
        try {
            const response = await fetch(`${apiurl}/notifications/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ notification_ids: seenIds }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setSeenIds([]);
            fetchData();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSeenAll = () => {
        const unseenIds = data
            .filter((note) => !note.seen)
            .map((note) => note.id);
        if (unseenIds.length > 0) {
            setSeenIds(unseenIds);
        }
    };

    useEffect(() => {
        if (seenIds.length > 0) {
            updateSeen();
        }
    }, [seenIds]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (userData) {
            const parsedUser =
                typeof userData === "string" ? JSON.parse(userData) : userData;
            setUser(parsedUser);

            const role = parsedUser?.role;

            const loadLayout = async () => {
                switch (role) {
                    case "manager":
                        const { default: ManagerLayout } = await import(
                            "../../dashboard/Manager/Layout"
                        );
                        setLayout(() => ManagerLayout);
                        setKey(8);
                        break;
                    case "client":
                        const { default: ClientLayout } = await import(
                            "../../dashboard/client/Layout"
                        );
                        setLayout(() => ClientLayout);
                        setKey(9);
                        break;
                    case "recruiter":
                        const { default: RecruiterLayout } = await import(
                            "../../dashboard/Recruiter/Layout"
                        );
                        setLayout(() => RecruiterLayout);
                        break;
                    case "accountant":
                        const { default: AccountantLayout } = await import(
                            "../../dashboard/Accountants/Layout"
                        );
                        setLayout(() => AccountantLayout);
                        break;
                    case "candidate":
                        const { default: CandidateLayout } = await import(
                            "../../dashboard/Candidate/Layout"
                        );
                        setLayout(() => CandidateLayout);
                        break;
                    case "interviewer":
                        const { default: InterviewerLayout } = await import(
                            "../../dashboard/Interviewer/Layout"
                        );
                        setLayout(() => InterviewerLayout);
                        break;
                    case "admin":
                        const { default: AdminLayout } = await import(
                            "../../dashboard/Admin/Layout"
                        );
                        setLayout(() => AdminLayout);
                        break;
                    default:
                        setLayout(() => ({ children }) => <>{children}</>);
                }
            };

            if (role) {
                loadLayout();
            }
        }
    }, [userData]);

    if (!Layout || !user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Pageloading />
            </div>
        );
    }

    const filteredNotifications = data
        ?.filter((obj) => {
            const senderMatch = obj.sender?.username
                ?.toLowerCase()
                .includes(searchTerm.trim().toLowerCase());
            const dateMatch = selectedDate
                ? obj.created_at.slice(0, 10) ===
                  format(selectedDate, "yyyy-MM-dd")
                : true;
            return senderMatch && dateMatch;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const unseenCount = data.filter((n) => !n.seen).length;

    return (
        <Suspense fallback={<Pageloading />}>
            <Layout defaultSelectedKey={key}>
                <div className="bg-[#F9FAFB] min-h-screen p-6">
                    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-[#071C50]">
                                        Inbox
                                    </h1>
                                    {unseenCount > 0 && (
                                        <span className="bg-[#1681FF] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-blue-100">
                                            {unseenCount} New
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 font-medium tracking-tight">
                                    Manage your system alerts and communications
                                    in one place.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm gap-2 w-full sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <CalendarOutlined className="text-blue-500" />
                                        <div className="custom-datepicker-container scale-90 origin-left">
                                            <CustomDatePicker
                                                endDate={new Date()}
                                                onChange={(dateObj) =>
                                                    setSelectedDate(dateObj)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {selectedDate && (
                                        <Tooltip title="Clear Date Filter">
                                            <DeleteOutlined
                                                onClick={() =>
                                                    setSelectedDate(null)
                                                }
                                                className="text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                                            />
                                        </Tooltip>
                                    )}
                                </div>

                                <Button
                                    type="dashed"
                                    disabled={unseenCount === 0}
                                    onClick={handleSeenAll}
                                    className="h-10 px-4 rounded-xl border-blue-200 text-blue-600 font-bold text-xs hover:border-blue-500 hover:text-blue-700 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <CheckCircleOutlined /> Mark All Read
                                </Button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex flex-1 gap-6 min-h-0">
                            {/* Left Column: Notification List */}
                            <div
                                className={`${
                                    selectedInfo ? "hidden md:flex" : "flex"
                                } w-full md:w-[400px] flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full`}
                            >
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                    <Input
                                        placeholder="Search by sender..."
                                        prefix={
                                            <SearchOutlined className="text-slate-400" />
                                        }
                                        className="h-11 rounded-xl border-gray-200 focus:border-blue-500 transition-all shadow-none"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto sidebar-scroll p-2 space-y-2">
                                    {loading ? (
                                        <div className="p-10 flex justify-center">
                                            <Pageloading />
                                        </div>
                                    ) : filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((note) => (
                                            <div
                                                key={note.id}
                                                onClick={() => {
                                                    handleCardClick(note);
                                                    setCurrentAlert(note.id);
                                                }}
                                                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                                    currentAlert === note.id
                                                        ? "bg-blue-50/50 border-blue-100 ring-1 ring-blue-100 shadow-sm"
                                                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                                                } relative`}
                                            >
                                                {!note.seen && (
                                                    <div className="absolute top-4 left-0 w-1 h-10 bg-[#1681FF] rounded-r-full"></div>
                                                )}
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3
                                                        className={`text-sm font-bold truncate pr-8 ${
                                                            !note.seen
                                                                ? "text-[#071C50]"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {note.sender?.username}
                                                    </h3>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {format(
                                                            new Date(
                                                                note.created_at
                                                            ),
                                                            "dd MMM"
                                                        )}
                                                    </span>
                                                </div>
                                                <p
                                                    className={`text-xs truncate ${
                                                        !note.seen
                                                            ? "text-blue-600 font-bold"
                                                            : "text-gray-400 font-medium"
                                                    }`}
                                                >
                                                    {note.subject ||
                                                        note.message.slice(
                                                            0,
                                                            40
                                                        ) + "..."}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
                                            <Empty
                                                image={
                                                    Empty.PRESENTED_IMAGE_SIMPLE
                                                }
                                                description="No notifications found"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Message Detail */}
                            <div
                                className={`${
                                    selectedInfo ? "flex" : "hidden"
                                } md:flex flex-1 flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full`}
                            >
                                {selectedInfo ? (
                                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                        {/* Message Header */}
                                        <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    icon={<ArrowLeftOutlined />}
                                                    className="md:hidden mr-2"
                                                    onClick={() =>
                                                        setSelectedInfo(null)
                                                    }
                                                />
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1681FF] text-xl">
                                                    <MailOutlined />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-[#071C50]">
                                                        {
                                                            selectedInfo.sender
                                                                ?.username
                                                        }
                                                    </h2>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <ClockCircleOutlined className="text-[10px]" />{" "}
                                                            {format(
                                                                new Date(
                                                                    selectedInfo.created_at
                                                                ),
                                                                "hh:mm a"
                                                            )}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <CalendarOutlined className="text-[10px]" />{" "}
                                                            {format(
                                                                new Date(
                                                                    selectedInfo.created_at
                                                                ),
                                                                "dd MMMM, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Tooltip title="Delete (Placeholder)">
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    shape="circle"
                                                    type="text"
                                                    className="text-gray-300 hover:text-red-500"
                                                />
                                            </Tooltip>
                                        </div>

                                        {/* Message Body */}
                                        <div className="flex-1 overflow-y-auto p-8 sidebar-scroll">
                                            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 relative max-w-3xl">
                                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-md border border-gray-50 flex items-center justify-center">
                                                    <img
                                                        src={logo}
                                                        alt="logo"
                                                        className="w-6 h-6"
                                                    />
                                                </div>
                                                <div className="mb-4 pb-4 border-b border-gray-100">
                                                    <h4 className="text-[#071C50] font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                                                        Subject
                                                    </h4>
                                                    <h3 className="text-lg font-bold text-gray-700">
                                                        {selectedInfo.subject ||
                                                            "System Notification"}
                                                    </h3>
                                                </div>
                                                <NotificationMessage
                                                    message={
                                                        selectedInfo.message
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Footer (Optional) */}
                                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">
                                                Sync Logic HRM Alert System
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                        <img
                                            src={NoMessages}
                                            alt="No selection"
                                            className="w-64 opacity-50 mb-8 filter grayscale"
                                        />
                                        <h3 className="text-xl font-bold text-gray-300 mb-2">
                                            Select a notification
                                        </h3>
                                        <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                            Click on a message from the sidebar
                                            to view full details and take
                                            actions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </Suspense>
    );
};

export default AllNotifications;
