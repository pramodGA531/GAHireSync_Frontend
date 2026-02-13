import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Badge,
    ConfigProvider,
    Dropdown,
    Avatar,
    Button,
    Tooltip,
    Drawer,
} from "antd";
import {
    BellOutlined,
    BankOutlined,
    ArrowRightOutlined,
    QuestionCircleOutlined,
    MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import logo from "../../../images/GAWhiteText.svg";
import support from "../../../images/SideBar/Support.svg";
import dropdown from "../../../images/SideBar/dropdown.svg";

const { Sider, Header, Content } = Layout;

const MainLayout = ({
    children,
    defaultSelectedKey,
    defaultSelectedChildKey,
    options,
}) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(defaultSelectedKey || 1);
    const [expandedKey, setExpandedKey] = useState(defaultSelectedKey);
    const { userData, token, apiurl } = useAuth();
    const [user, setUser] = useState();
    const [noteCount, SetNoteCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (userData) {
            try {
                const parsedUser =
                    typeof userData === "string"
                        ? JSON.parse(userData)
                        : userData;
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing userData:", error);
                setUser(null);
            }
        }
    }, [userData]);

    useEffect(() => {
        if (token) fetchNotificationCount();
    }, [token]);

    const fetchNotificationCount = async () => {
        try {
            const response = await fetch(
                `${apiurl}/notifications/?count=true`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.count > 0) SetNoteCount(data.count);
        } catch (error) {
            console.error("Notification error:", error);
        }
    };

    const handleNavigation = (item) => {
        if (item.Logout) return item.Logout();
        if (item.children?.length) {
            setExpandedKey(expandedKey === item.key ? null : item.key);
        } else {
            setSelected(item.key);
            setExpandedKey(null);
            navigate(item.path);
            setMobileMenuOpen(false); // Close mobile menu on navigation
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#001744]">
            {/* Logo Area */}
            <div className="p-4 mb-2">
                <a href="/welcome" className="flex items-center justify-center">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-24 -ml-6 -mb-6
                         object-contain transition-transform hover:scale-105"
                    />
                </a>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto px-4 sidebar-scroll no-scrollbar">
                <Menu
                    mode="inline"
                    selectedKeys={[
                        String(defaultSelectedChildKey || defaultSelectedKey),
                    ]}
                    openKeys={expandedKey ? [String(expandedKey)] : []}
                    expandIcon={({ isOpen }) => (
                        <img
                            src={dropdown}
                            alt="dropdown"
                            className={`w-4 h-4 transition-transform duration-300 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    )}
                    onOpenChange={(keys) => {
                        const latestOpenKey = keys.find(
                            (key) => String(key) !== String(expandedKey),
                        );
                        setExpandedKey(latestOpenKey || null);
                    }}
                    className="!border-none"
                    style={{ backgroundColor: "transparent" }}
                >
                    {options.map((item) => {
                        const isParentActive = item.children?.some(
                            (child) =>
                                String(child.key) ===
                                String(defaultSelectedChildKey),
                        );
                        const isActive =
                            String(item.key) === String(defaultSelectedKey) &&
                            (!defaultSelectedChildKey ||
                                defaultSelectedChildKey === "0");

                        if (item.children) {
                            return (
                                <Menu.SubMenu
                                    key={String(item.key)}
                                    icon={
                                        <div className="relative">
                                            <img
                                                src={
                                                    isParentActive
                                                        ? item.active_logo
                                                        : item.logo
                                                }
                                                alt="icon"
                                                className="w-5 h-5 opacity-80"
                                            />
                                            {item.badge === true && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#001744]" />
                                            )}
                                        </div>
                                    }
                                    title={
                                        <Tooltip
                                            title={item.tooltip || item.label}
                                            placement="right"
                                        >
                                            <div className="flex items-center justify-between w-full pr-2">
                                                <span
                                                    className={`text-[13px] font-bold ${
                                                        isParentActive
                                                            ? "text-blue-500"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>
                                                {item.badge &&
                                                    item.badge !== true && (
                                                        <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black min-w-[20px] text-center">
                                                            {item.badge}
                                                        </div>
                                                    )}
                                            </div>
                                        </Tooltip>
                                    }
                                    className="mb-1"
                                >
                                    {item.children.map((child) => (
                                        <Menu.Item
                                            key={String(child.key)}
                                            onClick={() => {
                                                navigate(child.path);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="!text-[12px] !h-10 !leading-10 !rounded-xl !mb-1"
                                        >
                                            {child.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            );
                        }

                        return (
                            <Menu.Item
                                key={String(item.key)}
                                icon={
                                    <div className="relative">
                                        <img
                                            src={
                                                isActive
                                                    ? item.active_logo
                                                    : item.logo
                                            }
                                            alt="icon"
                                            className="w-5 h-5 opacity-80"
                                        />
                                        {item.badge === true && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#001744]" />
                                        )}
                                    </div>
                                }
                                onClick={() => handleNavigation(item)}
                                className={`!rounded-xl mb-1 !h-12 !leading-[48px] ${
                                    isActive
                                        ? "!bg-[#1681FF1a] !text-blue-500"
                                        : ""
                                }`}
                            >
                                {/* -[#1681FF */}
                                <Tooltip
                                    title={item.tooltip || item.label}
                                    placement="right"
                                >
                                    <div className="flex items-center justify-between w-full pr-2">
                                        <span
                                            className={`text-[13px] font-bold ${
                                                isActive
                                                    ? "text-blue-500"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        {item.badge &&
                                            !isActive &&
                                            item.badge !== true && (
                                                <div className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black min-w-[20px] text-center">
                                                    {item.badge}
                                                </div>
                                            )}
                                    </div>
                                </Tooltip>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </div>

            {/* Bottom User Area */}
            <div className="p-4 mt-auto">
                <div className="bg-[#ffffff0d] rounded-2xl p-4 border border-[#ffffff1a] transition-all hover:bg-[#ffffff14]">
                    <Tooltip title="Get Support for any queries" placement="right">
                        <div
                            className="flex items-center gap-3 cursor-pointer mb-4"
                            onClick={() => navigate("/tickets")}
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#ffffff1a] flex items-center justify-center">
                                <img
                                    src={support}
                                    alt="Support"
                                    className="w-4 h-4"
                                />
                            </div>
                            <span className="text-white text-sm font-bold">
                                Help & Support
                            </span>
                        </div>
                    </Tooltip>
                    <Tooltip title="View your Profile and update your details" placement="right">
                        <div
                            className="flex items-center gap-3 cursor-pointer p-1 rounded-xl group"
                            onClick={() => navigate("/profile")}
                        >
                            <Avatar
                                size={40}
                                className="!bg-blue-500 !font-bold shadow-md transform transition-transform group-hover:scale-105"
                            >
                                {user?.username?.[0]?.toUpperCase()}
                            </Avatar>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-white text-sm font-bold truncate">
                                    {user?.username || "Account"}
                                </span>
                                <span className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">
                                    View Profile{" "}
                                    <ArrowRightOutlined className="text-[8px]" />
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1681FF",
                },
                components: {
                    Menu: {
                        itemBg: "transparent",
                        itemColor: "#94A3B8",
                        itemSelectedColor: "#1681FF",
                        itemSelectedBg: "rgba(22, 129, 255, 0.1)",
                        itemHoverColor: "#F1F5F9",
                        itemHoverBg: "rgba(255, 255, 255, 0.05)",
                        itemActiveBg: "rgba(255, 255, 255, 0.1)",
                        subMenuItemBg: "transparent",
                    },
                    Drawer: {
                        colorBgElevated: "#001744",
                    },
                },
            }}
        >
            <Layout className="min-h-screen">
                {/* Fixed Desktop Sidebar - Hidden on Mobile */}
                <Sider
                    width={280}
                    trigger={null}
                    collapsible
                    className="!bg-[#001744] !h-screen !fixed left-0 top-0 bottom-0 overflow-hidden !hidden md:!flex flex-col z-[1000] shadow-2xl"
                >
                    <SidebarContent />
                </Sider>

                {/* Mobile Drawer Sidebar */}
                <Drawer
                    placement="left"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    width={280}
                    className="md:hidden !p-0"
                    styles={{ body: { padding: 0 } }}
                    closeIcon={null}
                >
                    <SidebarContent />
                </Drawer>

                {/* Content Area */}
                <Layout className="transition-all duration-300 md:ml-[280px]">
                    {/* Header */}
                    <Header className="!bg-white/80 !backdrop-blur-md !px-4 md:!px-8 !flex !justify-between md:!justify-end !items-center !h-[72px] !fixed !w-full md:!w-[calc(100%-280px)] !top-0 !z-[1000] !shadow-sm !border-b !border-gray-100">
                        {/* Mobile Hamburger Button */}
                        <div className="md:hidden">
                            <Button
                                icon={<MenuOutlined />}
                                onClick={() => setMobileMenuOpen(true)}
                                type="text"
                                className="!text-xl"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            {user?.role === "client" && (
                                <Tooltip title="Create a new job posting">
                                    <Button
                                        type="primary"
                                        className="hidden md:flex h-10 px-6 rounded-xl bg-blue-500 hover:bg-[#0061D5] font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 border-none"
                                        onClick={() =>
                                            navigate("/client/postjob")
                                        }
                                    >
                                        Create New Job
                                    </Button>
                                </Tooltip>
                            )}

                            {user?.role === "manager" && (
                                <Tooltip title="Resume Bank">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            navigate("/agency/resume-bank")
                                        }
                                        className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center cursor-pointer transition-all hover:bg-blue-100 hover:scale-105 active:scale-95 border border-blue-100 shadow-sm"
                                    >
                                        <BankOutlined className="text-xl" />
                                    </Button>
                                </Tooltip>
                            )}

                            <div className="flex items-center gap-3">
                                {/* <Tooltip title="Help">
                                    <div className="w-10 h-10 rounded-xl text-slate-400 flex items-center justify-center cursor-pointer transition-all hover:bg-gray-50">
                                        <QuestionCircleOutlined className="text-xl" />
                                    </div>
                                </Tooltip> */}

                                <Tooltip title="Notifications">
                                    <Badge
                                        count={noteCount}
                                        size="small"
                                        offset={[-5, 5]}
                                        className="notification-badge"
                                    >
                                        <div
                                            onClick={() =>
                                                navigate("/notifications")
                                            }
                                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center cursor-pointer transition-all hover:bg-slate-100 hover:text-slate-600 border border-slate-100"
                                        >
                                            <BellOutlined className="text-xl" />
                                        </div>
                                    </Badge>
                                </Tooltip>
                            </div>
                        </div>
                    </Header>

                    {/* Main Content */}
                    <Content className="!mt-[72px] !p-0 !bg-[#F9FAFB] !overflow-y-auto !h-[calc(100vh-72px)]">
                        <div className="min-h-full">{children}</div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default MainLayout;
