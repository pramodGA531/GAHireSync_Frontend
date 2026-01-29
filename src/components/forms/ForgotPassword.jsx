import React, { useState } from "react";
import { message } from "antd";

import { useNavigate } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";
import Btnloading from "../common/loading/Btnloading";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword1 = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState();

    const validateEmail = (_, value) => {
        if (!value || /\S+@\S+\.\S+/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Please enter a valid email address."));
    };

    const handleSubmit = async (e) => {
        console.log("clg");
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/forgotpassword/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            setLoading(false);

            if (response.status == 404) {
                message.error("User Not found");
            }
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    return message.error(data.error);
                }
                message.success(data.success);
            }
        } catch (error) {
            console.error(error);
            message.error("Network Error. Please Try again after sometime");
        } finally {
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
                        onClick={() => {
                            navigate("/welcome");
                        }}
                    >
                        Back to home
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full max-w-md h-full lg:h-auto">
                    <div className="w-full p-8 rounded-xl border border-[#DDEEFF] bg-white shadow-lg mt-10 md:mt-0">
                        <div className="text-[#181B27] text-2xl font-semibold">
                            Forgot Password
                        </div>
                        <span className="text-[#65676F] text-sm font-normal block mt-1">
                            We are here to help you{" "}
                        </span>
                        <form
                            action=""
                            onSubmit={handleSubmit}
                            className="mt-5 flex flex-col"
                        >
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 outline-none text-[#65676F] text-sm font-light mt-2.5"
                            />
                            <button
                                disabled={loading}
                                className="w-full mt-5 bg-[#488CD3] text-white rounded-lg py-2.5 font-medium hover:bg-[#3a76b5]"
                            >
                                {loading ? (
                                    <>
                                        Send email{" "}
                                        <Btnloading spincolor="white-spinner" />
                                    </>
                                ) : (
                                    "Send email"
                                )}
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
                    alt=""
                    className="object-cover max-w-full h-auto"
                />
            </div>
        </div>
    );
};

export default ForgotPassword1;
