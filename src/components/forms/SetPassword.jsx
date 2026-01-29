import React, { useState } from "react";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";
import { useAuth } from "../common/useAuth";

const SetPassword = () => {
    const { apiurl } = useAuth();
    const { uuid, token } = useParams();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setConfirmShowPass] = useState(false);

    const navigate = useNavigate();
    const [data, setData] = useState({
        password: "",
        confirm_password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (data.password === data.confirm_password) {
            try {
                const response = await fetch(
                    `${apiurl}/resetpassword/${uuid}/${token}/`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );

                const resData = await response.json();
                setLoading(false);

                if (!response.ok) {
                    message.error(resData.error || "Something went wrong.");
                } else {
                    message.success(
                        resData.success || "Password reset successfully!"
                    );
                    navigate("/login");
                }
            } catch (error) {
                console.error(error);
                message.error("Network error. Please try again later.");
                setLoading(false);
            }
        } else {
            message.error("Passwords do not match.");
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex flex-col items-center w-full lg:w-1/2 p-8 gap-6 justify-center">
                <div className="w-full flex justify-between items-center max-w-xl absolute top-8 left-8 right-8 lg:relative lg:top-auto lg:left-auto lg:right-auto">
                    <div className="logo">
                        <img
                            src={Logo}
                            alt="Home page img"
                            width={90}
                            height={70}
                            className="mt-1"
                        />
                    </div>
                    <button
                        className="text-gray-600 hover:text-blue-600 font-medium"
                        onClick={() => navigate("/welcome")}
                    >
                        Back to home
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center w-full max-w-md h-full lg:h-auto">
                    <div className="w-full p-8 rounded-xl border border-[#DDEEFF] bg-white shadow-lg mt-10 md:mt-0">
                        <div className="text-[#181B27] text-2xl font-semibold">
                            Reset Password
                        </div>
                        <span className="text-[#65676F] text-sm font-normal block mt-1">
                            We are here to help you
                        </span>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-5 flex flex-col gap-4"
                        >
                            <div className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 flex items-center justify-between">
                                <input
                                    className="flex-1 outline-none text-[#65676F]"
                                    style={{
                                        border: "none",
                                        padding: "0px",
                                        margin: "0",
                                    }}
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <span
                                    onClick={() => setShowPass(!showPass)}
                                    className="cursor-pointer text-gray-500"
                                >
                                    {showPass ? (
                                        <EyeInvisibleOutlined />
                                    ) : (
                                        <EyeOutlined />
                                    )}
                                </span>
                            </div>

                            <div className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 flex items-center justify-between">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={data.confirm_password}
                                    className="flex-1 outline-none text-[#65676F]"
                                    style={{
                                        border: "none",
                                        padding: "0px",
                                        margin: "0",
                                    }}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            confirm_password: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <span
                                    onClick={() =>
                                        setConfirmShowPass(!showConfirmPass)
                                    }
                                    className="cursor-pointer text-gray-500"
                                >
                                    {showConfirmPass ? (
                                        <EyeInvisibleOutlined />
                                    ) : (
                                        <EyeOutlined />
                                    )}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-[#488CD3] text-white rounded-lg py-2.5 font-medium hover:bg-[#3a76b5]"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                    <div className="text-center mt-4 text-[#65676F] text-sm">
                        Back to{" "}
                        <span
                            className="text-[#488CD3] cursor-pointer hover:underline"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex w-1/2 bg-gray-100 items-center justify-center">
                <img
                    src={Image1}
                    alt="Visual"
                    className="object-cover max-w-full h-auto"
                />
            </div>
        </div>
    );
};

export default SetPassword;
