import React, { useState, useEffect, useRef, useContext } from "react";
// import "./Layout.css";
import logo from "./../../../images/GAHIRESYNC-LOGO.svg";
import { useNavigate } from "react-router-dom";
import { CaretDownOutlined } from "@ant-design/icons";
import { useAuth } from "../useAuth";
import Ticket from "../../../images/ticket.svg";
import { BellOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { BankOutlined } from "@ant-design/icons";
import { NotificationContext } from "../NotificationsContext";

const MainLayout = ({ children, defaultSelectedKey, options }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(defaultSelectedKey || 1);
    const { count, markAsSeen } = useContext(NotificationContext);
    const hasFetchedNotificationCount = useRef(false);
    const [user, setUser] = useState();
    const { userData, token, apiurl } = useAuth();
    useEffect(() => {
        if (userData) {
            try {
                const parsedUser =
                    typeof userData === "string"
                        ? JSON.parse(userData)
                        : userData;
                setUser(parsedUser);
                // console.log(parsedUser, "is the parsed user");
            } catch (error) {
                console.error("Error parsing userData:", error);
                setUser(null);
            }
        }
    }, [userData]);

    useEffect(() => {
        if (token && !hasFetchedNotificationCount.current) {
            hasFetchedNotificationCount.current = true;
            fetchNotificationCount();
        }
    }, [token]);

    const handleNavigation = (item) => {
        if (item.Logout) {
            item.Logout();
        } else {
            setSelected(item.key);
            navigate(item.path);
        }
    };

    const [noteCount, SetNoteCount] = useState(0);
    const fetchNotificationCount = async () => {
        try {
            const response = await fetch(
                `${apiurl}/notifications/?count=true`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            if (data.count > 0) {
                SetNoteCount(data.count);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-[60px] bg-white flex items-center justify-between pl-5 fixed top-0 z-[1000] shadow-[0_4px_10px_rgba(91,91,91,0.13)]">
                <div className="flex gap-[5vw] items-center fixed justify-center right-[5vw]">
                    {user?.role === "manager" && (
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate("/agency/resume-bank")}
                        >
                            <BankOutlined
                                style={{ fontSize: "25px", color: "#1890ff" }}
                            />
                        </div>
                    )}

                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            navigate("/notifications");
                        }}
                    >
                        <Badge count={noteCount} size="small" offset={[-5, 5]}>
                            <BellOutlined
                                style={{ fontSize: "25px", color: "#1890ff" }}
                            />
                        </Badge>
                    </div>

                    <div
                        className="flex items-center p-2 cursor-pointer bg-[#3393FF] rounded-full"
                        onClick={() => {
                            navigate("/tickets");
                        }}
                    >
                        <img src={Ticket} alt="Ticket " />
                    </div>

                    <div
                        className="h-10 cursor-pointer"
                        onClick={() => {
                            navigate("/profile");
                        }}
                    >
                        <span className="flex gap-2.5 cursor-pointer">
                            {" "}
                            {user ? user.username : "Loading..."}{" "}
                            <CaretDownOutlined />{" "}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-[100px] bg-[#001744] h-screen fixed left-0 top-0 flex flex-col items-center shadow-md rounded-r-[3px] z-[1001] overflow-y-hidden">
                <a href="/welcome" className="mt-0">
                    <img alt="logo" src={logo} className="h-[84px]"></img>
                </a>
                {options.map((item, index) => (
                    <div
                        key={index}
                        className={`${
                            selected == item.key
                                ? "opacity-100 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[5px] before:bg-[#ff9cab] before:rounded-r-[10px]"
                                : ""
                        } flex relative flex-col items-center mt-5 cursor-pointer rounded transition-colors duration-300 w-full`}
                        onClick={() => handleNavigation(item)}
                    >
                        <img
                            src={item.logo}
                            alt={item.label}
                            className={`h-[25px] ${
                                selected == item.key
                                    ? "opacity-100"
                                    : "opacity-60"
                            }`}
                        />
                        <span className="text-[13px] text-[#cfd8dc] mt-[2px] text-center">
                            {item.label}
                        </span>
                        {item?.badge && (
                            <span className="absolute -top-2.5 right-[23px] bg-[#c312ff] h-4 w-4 p-0 rounded-full" />
                        )}
                    </div>
                ))}
            </div>

            <div className="ml-[120px] mt-[85px] mr-[30px] overflow-x-hidden flex-grow bg-white">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
