import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./signup";

import { useNavigate } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";

const Forms = () => {
    const navigate = useNavigate();

    const [signUp, setSignUp] = useState(false);

    const onToggle = () => {
        setSignUp((e) => !e);
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex flex-col items-center w-full lg:w-1/2 p-8 gap-6 justify-center bg-white">
                <div className="w-full flex justify-between items-center max-w-xl absolute top-8 left-8 right-8 lg:relative md:translate-x-10 lg:top-auto lg:left-auto lg:right-auto ">
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
                        className="text-gray-600 hover:text-blue-600  transform -translate-x-5 md:transform lg:transform lg:-translate-x-1.5 md:translate-x-10  font-medium"
                        onClick={() => {
                            navigate("/welcome");
                        }}
                    >
                        Back to home
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full max-w-md h-full lg:h-auto mt-10 md:mt-0">
                    {signUp ? (
                        <SignupForm onToggle={onToggle} />
                    ) : (
                        <LoginForm onToggle={onToggle} />
                    )}
                </div>
            </div>
            <div className="hidden lg:flex w-1/2 h-screen fixed -right-16 top-0 items-center justify-center">
                <img
                    src={Image1}
                    alt="login-quote"
                    className="object-contain h-full lg:h-screen w-auto"
                />
            </div>
        </div>
    );
};

export default Forms;
