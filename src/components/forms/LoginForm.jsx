import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";

import { useAuth } from "../common/useAuth";
import { MailOutlined } from "@ant-design/icons";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Btnloading from "../common/loading/Btnloading";

export const LoginForm = ({ onToggle }) => {
    const { apiurl, token } = useAuth();

    const [searchParams] = useSearchParams();
    const inValidToken = searchParams.get("inValidToken") === "true";

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(true);
    const [resendTimer, setResendTimer] = useState(0);
    const [showPass, setShowPass] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        try {
            setLoading(true);

            const response = await fetch(`${apiurl}/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            console.log("data", data);

            if (data.error && !data.not_verified) {
                message.error(data.error);
                setLoading(false);
            }
            if (data.not_verified) {
                setVerified(false);
                setLoading(false);
                message.error(
                    "Your account is not verified, please verify your account to login",
                );
                return;
            }

            if (data.error) {
                message.error(data.error);
                setLoading(false);
                return;
            }

            if (response.ok) {
                handleLogin(data.access_token, data.user_details);
                message.success("Login successful");
                if (data.user_details.is_first_login) {
                    navigate("/profile");
                } else {
                    navigate("/");
                }
            } else {
                message.error(data.error);
            }
        } catch (error) {
            message.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(
                () => setResendTimer(resendTimer - 1),
                1000,
            );
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleVerifySubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/send-verification-email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            });

            const data = await response.json();
            if (response.ok) {
                message.success(data.message);
                setVerified(true);
                setResendTimer(60);
            } else {
                message.error(data.error);
            }
        } catch (error) {
            message.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && !inValidToken) {
            navigate("/");
        }
    }, [token]);

    return (
        <div className="w-full flex flex-col gap-6 transform translate-x-5">
            <>
                <div className="mt-5 p-6 md:p-9 w-full rounded-xl border border-[#DDEEFF] bg-white shadow-lg text-center md:text-left">
                    <div className="text-[#181B27] text-2xl font-semibold">
                        Login Form
                    </div>
                    <span className="text-[#65676F] text-sm font-normal block mt-2">
                        Access your recruiter dashboard to manage jobs and
                        candidate pipelines.
                    </span>
                    <div className="mt-8 flex flex-col gap-5">
                        <form
                            action=""
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            className="flex flex-col gap-5"
                        >
                            <div className="flex p-2.5 px-4 justify-between items-center rounded-lg border border-[#A2A1A866] text-[#909297] bg-white">
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="border-none outline-none w-full text-[#65676F]"
                                />
                                <MailOutlined className="text-gray-400" />
                            </div>
                            <div className="flex p-2.5 px-4 justify-between items-center rounded-lg border border-[#A2A1A866] text-[#909297] bg-white">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={user.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="border-none outline-none w-full text-[#65676F]"
                                />
                                <span
                                    onClick={() => setShowPass(!showPass)}
                                    className="cursor-pointer text-gray-500 hover:text-blue-500"
                                >
                                    {showPass ? (
                                        <EyeInvisibleOutlined />
                                    ) : (
                                        <EyeOutlined />
                                    )}
                                </span>
                            </div>

                            <div
                                className="text-right text-xs text-[#65676F] -mt-4 cursor-pointer hover:text-[#488CD3]"
                                onClick={() => navigate("/forgot_password")}
                            >
                                Forgot password?
                            </div>

                            {verified && (
                                <>
                                    <button
                                        className="rounded-lg bg-[#488CD3] text-white text-sm font-semibold py-2 hover:bg-white hover:text-[#488CD3] hover:border hover:border-[#488CD3] border border-transparent transition-all duration-300"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                Login{" "}
                                                <Btnloading spincolor="white-spinner" />
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                </>
                            )}

                            {!verified && (
                                <button
                                    type="button"
                                    onClick={handleVerifySubmit}
                                    className="rounded-lg bg-[#488CD3] text-white text-sm font-semibold py-2 hover:bg-white hover:text-[#488CD3] hover:border hover:border-[#488CD3] border border-transparent transition-all duration-300"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            Verify Account{" "}
                                            <Btnloading spincolor="white-spinner" />
                                        </>
                                    ) : (
                                        "Verify Account"
                                    )}
                                </button>
                            )}
                        </form>
                    </div>
                </div>
                <div className="mt-2.5 text-center text-sm text-[#4D5477] font-medium">
                    Don't have an account?{" "}
                    <span
                        className="text-[#488CD3] ml-1.5 text-[15px] cursor-pointer hover:underline"
                        onClick={() => {
                            onToggle();
                        }}
                    >
                        Signup
                    </span>
                </div>
            </>
        </div>
    );
};

export default LoginForm;
