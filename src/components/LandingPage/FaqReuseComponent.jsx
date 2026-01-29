import React, { useEffect, useState } from "react";
import Faqs from "./Faqs.json";

import rightArrow from "../../images/LandingPage/arrow-right.svg";
import { Link } from "react-router-dom";

const FaqReuseComponent = ({ hideHeader = false }) => {
    const tabs = [
        "General",
        "Pricing and support",
        "Features and Functionality",
        "Security & Compliance",
    ];

    const [activeTab, setActiveTab] = useState("General");
    const [Faq, setFaq] = useState([]);

    useEffect(() => {
        if (activeTab == "General") {
            setFaq(Faqs.faqs);
        } else if (activeTab == "Pricing and support") {
            setFaq(Faqs.pricing);
        } else if (activeTab == "Features and Functionality") {
            setFaq(Faqs.functionality);
        } else if (activeTab == "Security & Compliance") {
            setFaq(Faqs.others);
        }
    }, [activeTab]);

    return (
        <div className="mt-5 px-[30px] py-5 flex flex-col items-center">
            {!hideHeader && (
                <>
                    <span className="w-[90vw] md:w-[30vw] text-[#4D5163] text-center text-[32px] md:text-[48px] font-semibold leading-[109%]">
                        Frequently Asked{" "}
                        <span className="text-[#F46EBE]">Questions</span>
                    </span>
                    <span className="w-[90vw] mt-2.5 text-[#4D5163] text-center text-base font-normal">
                        Get answers to all your hiring needs with our
                        comprehensive FAQs. Learn how HireSync simplifies
                        recruitment, enhances efficiency, and streamlines talent
                        acquisition for agencies and businesses alike.
                    </span>
                </>
            )}
            <div className="w-[90%] flex flex-col justify-center items-center">
                <div className="flex gap-5 mt-10 mb-5 flex-wrap justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 border border-[#56A8FD] rounded-full text-sm cursor-pointer transition-all duration-300 ${
                                activeTab === tab
                                    ? "bg-[#4096ff] text-white border-[#4096ff]"
                                    : "bg-white text-[#56A8FD] hover:bg-[#56A8FD] hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* {activeTab==} */}
                <div className="w-[90%] mt-5 flex flex-col gap-5 pb-[30px]">
                    {Faq &&
                        Faq.map((item, index) => (
                            <FaqComponent key={index} item={item} />
                        ))}
                </div>
            </div>
            <div className="flex justify-start w-[85%] mt-4">
                <span className="text-[#4D5163]">
                    for any other queries ?{" "}
                    <Link
                        to={"/contact-us"}
                        className="text-[#58A1FF] font-bold"
                    >
                        Contact us
                    </Link>
                </span>
            </div>
        </div>
    );
};

export default FaqReuseComponent;

const FaqComponent = ({ item }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[100px] p-[16px_20px] gap-5 self-stretch text-[#58A1FF] text-base font-normal">
            <div
                className="flex justify-between cursor-pointer items-center"
                onClick={() => setOpen(!open)}
            >
                <span className="question">{item.question}</span>
                <span
                    className={`transform transition-transform duration-500 ${
                        open ? "rotate-[-40deg]" : "rotate-0"
                    }`}
                >
                    <img src={rightArrow} alt="" />
                </span>
            </div>
            {open && (
                <div className="mt-2.5 text-[#727272] text-base font-normal">
                    {item.answer}
                </div>
            )}
        </div>
    );
};
