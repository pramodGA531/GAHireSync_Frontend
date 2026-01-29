import React, { useEffect, useState } from "react";
import { Steps, message, Tooltip } from "antd";
import {
    InfoCircleOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";
import Btnloading from "../common/loading/Btnloading";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const AgencySignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setConfirmShowPass] = useState(false);
    const [plans, setPlans] = useState([]);

    const steps = [
        {
            title: "Account Details",
            fields: [
                {
                    name: "username",
                    placeholder: "Enter your username",
                    icon: <UserOutlined />,
                    required: true,
                    pattern: "^[a-zA-Z0-9_]+$",
                    errorMsg:
                        "Username should contain only letters, numbers, and underscores.",
                },
                {
                    name: "email",
                    placeholder: "Enter your email",
                    icon: <MailOutlined />,
                    required: true,
                    type: "email",
                },
                {
                    name: "name",
                    placeholder: "Name of Organization",
                    required: true,
                },
                // {
                //     name: "org_code",
                //     placeholder: "company code",
                //     required: true,
                // },
                {
                    name: "contact_number",
                    placeholder: "Contact Number",
                    required: true,
                },
                {
                    name: "website_url",
                    placeholder: "Website URL(Optional)",
                    required: false,
                },
            ],
        },
        {
            title: "Company Information",
            fields: [
                { name: "gst", placeholder: "GST" },
                {
                    name: "company_pan",
                    placeholder: "Company PAN",
                    required: true,
                },
                {
                    name: "company_address",
                    placeholder: "Company Address",
                    required: true,
                    type: "textarea",
                },
                {
                    name: "password",
                    placeholder: "Password",
                    type: "password",
                    required: true,
                },
                {
                    name: "confirm_password",
                    placeholder: "Confirm Password",
                    type: "password",
                    required: true,
                },
            ],
        },
        {
            title: "Choose the Plan",
            render: "planSelection",
        },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        const currentFields = steps[currentStep].fields;
        for (let field of currentFields) {
            const value = formData[field.name];
            if (field.required && !value) {
                message.error(`Please input your ${field.placeholder}`);
                return;
            }
            if (field.pattern && !new RegExp(field.pattern).test(value)) {
                message.error(field.errorMsg || `Invalid ${field.name}`);
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(0);
    };

    const loadPlans = async () => {
        try {
            const response = await fetch(`${apiurl}/get-plans/`, {
                method: "GET",
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            }
            setPlans(data.data);
        } catch (e) {
            message.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            message.error("Passwords do not match");
            return;
        }
        if (formData.gst === formData.company_pan) {
            message.error("GST and Company PAN should not be same");
            return;
        }
        if (formData.contact_number.length < 10) {
            message.error("Contact number should be at least 10 digits");
            return;
        } else if (formData.contact_number.length > 10) {
            message.error("Contact number should be at most 10 digits");
            return;
        }
        setLoading(true);
        if (!formData.selectedPlanId) {
            alert("Please select a plan.");
            return;
        }
        const payload = {
            ...formData,
            selected_plan: formData.selectedPlanId,
        };

        try {
            const response = await fetch(`${apiurl}/signup/agency/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                if (data.error && typeof data.error === "string") {
                    throw new Error(data.error);
                }
                throw data;
            }

            message.success(
                "Signup successfull, verification link sent to your email - verify and login",
            );
            navigate("/login");
        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else if (typeof error === "object" && error !== null) {
                Object.keys(error).forEach((key) => {
                    const messages = error[key];
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => message.error(msg));
                    } else {
                        message.error(messages);
                    }
                });
            } else {
                message.error("An unexpected error occurred during signup");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex flex-col items-center w-full lg:w-1/2 p-8 gap-6">
                <div className="w-full flex justify-between items-center max-w-xl">
                    <div className="logo">
                        <img
                            src={Logo}
                            alt="Home page img"
                            width={90}
                            height={70}
                            className="ml-0 mt-1"
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
                <div className="flex flex-col items-center justify-center w-full max-w-xl gap-2 mt-2">
                    <Steps className="w-full" current={currentStep}>
                        {steps.map((step, index) => (
                            <Steps.Step key={index} title={step.title} />
                        ))}
                    </Steps>
                    <div className="w-full mt-5 p-6 md:p-9 rounded-xl border border-[#DDEEFF] bg-white shadow-lg">
                        <div className="text-[#181B27] text-2xl font-semibold">
                            Signup here for Recruiter Agency
                        </div>
                        <span className="text-[#65676F] text-sm font-normal block mt-1">
                            Enter your details to create an account to explore✨
                        </span>

                        <form
                            className="w-full mt-5"
                            onSubmit={
                                currentStep === steps.length - 1
                                    ? handleSubmit
                                    : handleNext
                            }
                        >
                            {steps[currentStep].render === "planSelection" ? (
                                <div className="flex flex-col gap-4">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`p-4 rounded-lg cursor-pointer border ${
                                                formData.selectedPlanId ===
                                                plan.id
                                                    ? "border-[#488CD3] bg-blue-50"
                                                    : "border-gray-300 bg-white"
                                            }`}
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    selectedPlanId: plan.id,
                                                })
                                            }
                                        >
                                            <h3 className="font-semibold text-lg m-0">
                                                {plan.name}
                                            </h3>
                                            <p
                                                className={`mt-1 text-sm ${
                                                    formData.selectedPlanId ===
                                                    plan.id
                                                        ? "text-blue-700"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                <strong>Price:</strong> ₹
                                                {plan.price}
                                            </p>
                                            <p
                                                className={`text-sm ${
                                                    formData.selectedPlanId ===
                                                    plan.id
                                                        ? "text-blue-700"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                <strong>Duration:</strong>{" "}
                                                {plan.duration} days
                                            </p>
                                            <p
                                                className={`text-sm ${
                                                    formData.selectedPlanId ===
                                                    plan.id
                                                        ? "text-blue-700"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                <strong>Features:</strong>
                                                {/* <div className="flex flex-col gap-1 ml-20 text-sm text-gray-700"> */}
                                                {plan.features.map(
                                                    (feature, index) => (
                                                        <span
                                                            key={index}
                                                            className={`leading-relaxed ${
                                                                index === 0
                                                                    ? "ml-1"
                                                                    : "ml-18"
                                                            }`}
                                                        >
                                                            {feature.feature} :{" "}
                                                            {feature.limit}
                                                            {index !==
                                                                plan.features
                                                                    .length -
                                                                    1 && ","}
                                                            <br />
                                                        </span>
                                                    ),
                                                )}
                                                {/* </div> */}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                steps[currentStep].fields.map((field) => (
                                    <div key={field.name} className="mt-2.5">
                                        {field.type === "textarea" ? (
                                            <textarea
                                                name={field.name}
                                                value={
                                                    formData[field.name] || ""
                                                }
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                rows={5}
                                                className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 outline-none resize-none"
                                            />
                                        ) : field.name === "username" ? (
                                            <div className="relative w-full">
                                                <input
                                                    name={field.name}
                                                    type="text"
                                                    value={
                                                        formData[field.name] ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    required={field.required}
                                                    pattern={field.pattern}
                                                    className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 outline-none pr-8"
                                                />
                                                <Tooltip title="Username should contain only letters, numbers, and underscores">
                                                    <InfoCircleOutlined className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                                                </Tooltip>
                                            </div>
                                        ) : 
                                        // field.name === "org_code" ? (
                                        //     <div className="relative w-full">
                                        //         <input
                                        //             name={field.name}
                                        //             type="text"
                                        //             value={
                                        //                 formData[field.name] ||
                                        //                 ""
                                        //             }
                                        //             onChange={handleChange}
                                        //             placeholder={
                                        //                 field.placeholder
                                        //             }
                                        //             required={field.required}
                                        //             pattern={field.pattern}
                                        //             className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 outline-none pr-8"
                                        //         />
                                        //         <Tooltip title="Company is the unique code that should be used by clients to connect with your agency">
                                        //             <InfoCircleOutlined className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
                                        //         </Tooltip>
                                        //     </div>
                                        // ) :
                                         field.name === "password" ? (
                                            <div className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 flex items-center justify-between mt-2.5">
                                                <input
                                                    name={field.name}
                                                    type={
                                                        showPass
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        formData[field.name] ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className="flex-1 outline-none"
                                                    style={{
                                                        border: "none",
                                                        padding: "0px",
                                                        margin: "0",
                                                    }}
                                                    required={field.required}
                                                    pattern={field.pattern}
                                                />
                                                <span
                                                    onClick={() =>
                                                        setShowPass(!showPass)
                                                    }
                                                    className="cursor-pointer text-gray-500"
                                                >
                                                    {showPass ? (
                                                        <EyeInvisibleOutlined />
                                                    ) : (
                                                        <EyeOutlined />
                                                    )}
                                                </span>
                                            </div>
                                        ) : field.name ===
                                          "confirm_password" ? (
                                            <div className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 flex items-center justify-between mt-2.5">
                                                <input
                                                    name={field.name}
                                                    type={
                                                        showConfirmPass
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        formData[field.name] ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    className="flex-1 outline-none"
                                                    style={{
                                                        border: "none",
                                                        padding: "0px",
                                                        margin: "0",
                                                    }}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    required={field.required}
                                                    pattern={field.pattern}
                                                />

                                                <span
                                                    onClick={() =>
                                                        setConfirmShowPass(
                                                            !showConfirmPass,
                                                        )
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
                                        ) : (
                                            <input
                                                name={field.name}
                                                type={field.type || "text"}
                                                value={
                                                    formData[field.name] || ""
                                                }
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                pattern={field.pattern}
                                                className="w-full rounded-[10px] border border-[#A2A1A866] p-3.5 outline-none mt-2.5"
                                            />
                                        )}
                                    </div>
                                ))
                            )}

                            <div className="mt-5 flex justify-between">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-8 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                                    >
                                        Previous
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="px-8 py-2 rounded-lg bg-[#488CD3] text-white font-medium hover:bg-[#3a76b5] ml-auto"
                                >
                                    {currentStep < steps.length - 1
                                        ? "Next"
                                        : "Signup"}
                                    {loading && (
                                        <Btnloading
                                            spincolor={"white-spinner"}
                                        />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="text-center mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-[#488CD3] cursor-pointer hover:underline"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
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

export default AgencySignUp;
