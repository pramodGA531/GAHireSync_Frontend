import React, { useState } from "react";
import logo from "../../images/GAHIRESYNC-LOGO.svg";
import { DownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const menuItems = [
    {
        label: "Features",
        key: "1",
        children: [
            { label: "Feature 1", key: "1-1", url: "/feature1" },
            { label: "Feature 2", key: "1-2", url: "/feature2" },
            { label: "Feature 3", key: "1-3", url: "/feature3" },
        ],
    },
    {
        label: "Job Board",
        key: "2",
        url: "/job-board",
    },
    { label: "Pricing", key: "3", url: "/pricing" },
    { label: "About Us", key: "4", url: "/about-us" },
    { label: "FAQs", key: "5", url: "/faqs" },
    { label: "Contact Us", key: "6", url: "/contact-us" },
];

const TopNav = ({ color }) => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div
            className={`flex justify-between items-center m-0 transition-colors duration-300 relative ${
                color === "blue" ? "text-[#71AAFF]" : ""
            }`}
        >
            <span className="logo z-50">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-[120px] md:w-[160px] cursor-pointer"
                    onClick={() => navigate("/")}
                />
            </span>

            {/* Desktop Menu */}
            <div
                className={`hidden lg:flex gap-5 text-[#D0E1FA] text-base font-medium ${
                    color === "blue" ? "text-[#71AAFF]" : ""
                }`}
            >
                {menuItems.map((item) =>
                    item.children ? (
                        <div
                            key={item.key}
                            className="relative"
                            onMouseEnter={() => setActiveDropdown(item.key)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <span
                                className={`flex gap-2 cursor-pointer p-2.5 items-center ${
                                    color === "blue" ? "text-[#71AAFF]" : ""
                                }`}
                            >
                                {item.label}
                                <DownOutlined
                                    className={`text-xs transition-transform duration-300 ${
                                        activeDropdown === item.key
                                            ? "rotate-180"
                                            : ""
                                    } ${
                                        color === "blue" ? "text-[#71AAFF]" : ""
                                    }`}
                                />
                            </span>
                            {activeDropdown === item.key && (
                                <div className="absolute top-full left-0 bg-[#071C50] border border-[#2A4E94] min-w-[180px] flex flex-col z-50 rounded-lg shadow-xl overflow-hidden py-2">
                                    {item.children.map((child) => (
                                        <div
                                            key={child.key}
                                            className="p-3 text-[#D0E1FA] text-sm hover:bg-[#2A4E94] cursor-pointer transition-colors"
                                            onClick={() => navigate(child.url)}
                                        >
                                            {child.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <span
                            key={item.key}
                            className={`flex gap-2 cursor-pointer p-2.5 hover:text-white transition-colors duration-300 ${
                                color === "blue"
                                    ? "text-[#71AAFF] hover:text-[#71AAFF]"
                                    : ""
                            }`}
                            onClick={() => navigate(item.url)}
                        >
                            {item.label}
                        </span>
                    )
                )}
            </div>

            {/* Desktop Login Button */}
            <div className="hidden lg:block mr-[30px]">
                <button
                    className={`h-[45px] border-1 border-white text-white bg-transparent rounded-lg px-5 cursor-pointer transition-all duration-300 hover:bg-white hover:text-black ${
                        color === "blue"
                            ? "text-[#71AAFF] border-[#71AAFF] hover:bg-[#71AAFF] hover:text-white"
                            : ""
                    }`}
                    onClick={() => navigate("/login")}
                >
                    Login / Signup
                </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden mr-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className={`text-2xl focus:outline-none text-white`}
                >
                    {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-[#0A2540] z-40 flex flex-col pt-24 px-6 lg:hidden overflow-y-auto">
                    {menuItems.map((item) => (
                        <div
                            key={item.key}
                            className="border-b border-gray-700 py-4"
                        >
                            {item.children ? (
                                <div>
                                    <div
                                        className="flex justify-between items-center text-white text-lg font-medium mb-2 cursor-pointer"
                                        onClick={() =>
                                            setActiveDropdown(
                                                activeDropdown === item.key
                                                    ? null
                                                    : item.key
                                            )
                                        }
                                    >
                                        {item.label}
                                        <DownOutlined
                                            className={`transition-transform ${
                                                activeDropdown === item.key
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                    {activeDropdown === item.key && (
                                        <div className="pl-4 flex flex-col gap-3 mt-2">
                                            {item.children.map((child) => (
                                                <div
                                                    key={child.key}
                                                    className="text-gray-300 text-base"
                                                    onClick={() => {
                                                        navigate(child.url);
                                                        setMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                >
                                                    {child.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="text-white text-lg font-medium cursor-pointer"
                                    onClick={() => {
                                        navigate(item.url);
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {item.label}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-8 mb-8">
                        <button
                            className="w-full h-[50px] text-white bg-[#1681FF] rounded-full text-lg font-bold"
                            onClick={() => {
                                navigate("/login");
                                setMobileMenuOpen(false);
                            }}
                        >
                            Login / Signup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopNav;
