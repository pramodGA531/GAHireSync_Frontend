import React from "react";
import TopNav from "./TopNav";
import BG from "../../images/LandingPage/BG2.png";
import FaqsList from "./Faqs.json";
import { useState } from "react";
import RightArrow from "../../images/LandingPage/arrow-right.svg";
import FaqImage from "../../images/LandingPage/Faq.png";
import FaqReuseComponent from "./FaqReuseComponent";

import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const Faqs = () => {
    const navigate = useNavigate();
    return (
        <div className="">
            <div
                className="text-[#4D5163]"
                style={{
                    backgroundImage: `url(${BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "0px 0px 0px 0px",
                }}
            >
                <TopNav color="blue" />
                <div className="text-center mt-5 text-[44px] font-semibold">
                    Frequently asked questions
                </div>
                <div className="text-center mt-2.5 pb-5 text-lg w-[90%] mx-auto">
                    Get answers to all your hiring needs with our comprehensive
                    FAQs. Learn how HireSync simplifies recruitment, enhances
                    efficiency, and streamlines talent acquisition for agencies
                    and businesses alike.
                </div>
                <div
                    className="text-center mt-0 pb-[50px] text-lg text-[#56A8FD] cursor-pointer"
                    onClick={() => navigate("/welcome")}
                >
                    Home/faqs
                </div>
            </div>
            <div className="flex flex-col md:flex-row w-full mt-[30px] min-h-[600px]">
                <div className="w-full md:w-2/3">
                    <FaqReuseComponent hideHeader={true} />
                </div>
                <img
                    src={FaqImage}
                    className="w-full md:w-1/3 object-cover min-h-[500px]"
                    alt="FAQ Illustration"
                />
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Faqs;
