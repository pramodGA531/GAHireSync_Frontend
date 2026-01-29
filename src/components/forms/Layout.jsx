import React from "react";

import { useNavigate } from "react-router-dom";
import Logo from "../../images/GAHIRESYNC-LOGO-DARK.svg";
import Image1 from "../../images/authentication/Image1.png";

const Layout = ({ Component }) => {
    const navigate = useNavigate();

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
                <div className="flex flex-col items-center justify-center w-full max-w-md h-full lg:h-auto mt-10 md:mt-0">
                    <Component />
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

export default Layout;
