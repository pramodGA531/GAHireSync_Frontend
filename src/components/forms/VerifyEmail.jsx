import React, { useState } from "react";
import { message } from "antd";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const VerifyEmail = () => {
    const { uuid, token } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/verify-email/${uuid}/${token}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                message.error(data.error || "Something went wrong");
                return;
            }

            message.success(data.success || "Email verified successfully!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            setLoading(false);
            message.error("Network error. Please try again later.");
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
                    <div className="w-full p-8 rounded-xl border border-[#DDEEFF] bg-white shadow-lg mt-10 md:mt-0 flex flex-col items-center">
                        <div className="text-[#181B27] text-2xl font-semibold mb-6">
                            Verify Account
                        </div>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleSubmit}
                            className="w-full bg-[#488CD3] text-white rounded-lg py-2.5 font-medium hover:bg-[#3a76b5]"
                        >
                            {loading ? "Verifying....." : "Verify Account"}
                        </button>
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

export default VerifyEmail;
