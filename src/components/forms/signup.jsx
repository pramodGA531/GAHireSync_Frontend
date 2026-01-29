import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";

const SignupForm = ({ onToggle }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col gap-6 transform translate-x-5">
            <div className="p-9 rounded-xl border border-[#DDEEFF] bg-white shadow-lg text-center md:text-left">
                <div className="text-[#181B27] text-2xl font-semibold">
                    SignUp as
                </div>
                <span className="text-[#65676F] text-sm font-normal block mt-2">
                    Join GA HireSync and streamline your recruitment process.
                </span>
                <div className="mt-10 flex flex-col gap-2.5">
                    <button
                        onClick={() => navigate("/client/signup")}
                        className="text-[#56A8FD] rounded-lg border-2 border-blue-200 text-base font-medium hover:bg-blue-50 py-2 transition-colors text-left pl-4"
                    >
                        Enterprise
                    </button>
                    <button
                        onClick={() => navigate("/agency/signup")}
                        className="text-[#56A8FD] border-lg border-2 border-blue-200 text-base font-medium hover:bg-blue-50 py-2 rounded-lg transition-colors text-left pl-4"
                    >
                        Recruitment Agency
                    </button>
                    {/* <button type="default" onClick={() => navigate("/candidate/signup")}>
					Job Seeker
					</button> */}
                </div>
            </div>
            <p className="flex items-center justify-center gap-2.5 text-[#4D5477] text-sm font-medium">
                Already have an account?{" "}
                <span
                    className="text-[#488CD3] cursor-pointer hover:underline"
                    onClick={onToggle}
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export { SignupForm };
