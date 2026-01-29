import React, { useState } from "react";
import BG from "../../images/LandingPage/BG2.png";
import SuitCase from "../../images/LandingPage/suitcase.svg";
import Chatting from "../../images/LandingPage/chatting.svg";
import Deal from "../../images/LandingPage/deal.svg";
import insta from "../../images/contactus/insta.svg";
import fb from "../../images/contactus/fb.svg";
import linkdin from "../../images/contactus/linkdinicon.svg";
import twitter from "../../images/contactus/twitter.svg";
import Location from "../../images/LandingPage/location 02.svg";
import TopNav from "./TopNav";
import FaqReuseComponent from "./FaqReuseComponent";
import {
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
    BankOutlined,
} from "@ant-design/icons";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        organizationType: "consultancy",
        organizationName: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // Add form submission logic here (e.g., API call)
    };
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
                <TopNav color="blue"></TopNav>
                <div className="text-center mt-5 text-[44px] font-semibold">
                    We'd <span className="text-[#f46ebe]">love</span> to here
                    from you
                </div>
                <div className="text-center mt-2.5 pb-5 text-lg w-[90vw] md:w-[45vw] mx-auto">
                    We value your inquiries and are here to support your goals.
                    Connect with our team for assistance, feedback, or
                    collaboration.
                </div>
                <div
                    className="text-center mt-0 pb-[50px] text-lg text-[#56a8fd] cursor-pointer"
                    onClick={() => navigate("/welcome")}
                >
                    Home/contact
                </div>
            </div>
            <div className="mt-[5vh] flex justify-between gap-[30px] w-[90%] mx-auto flex-col md:flex-row">
                <div className="max-w-[500px] mx-auto p-4 font-sans w-full md:w-1/2">
                    <span className="block text-sm mb-5 text-[#555]">
                        We are here to help you out
                    </span>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-4 flex-col md:flex-row">
                            <span className="flex-1 flex items-center bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                                <UserOutlined />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="border-none bg-transparent outline-none w-full text-sm"
                                />
                            </span>
                            <span className="flex-1 flex items-center bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                                <MailOutlined />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="border-none bg-transparent outline-none w-full text-sm"
                                />
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 flex-col md:flex-row">
                            <span className="flex-1 flex items-center bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                                <PhoneOutlined />
                                <input
                                    type="number"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="border-none bg-transparent outline-none w-full text-sm"
                                />
                            </span>
                            <span className="flex-1 flex items-center bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                                <BankOutlined />
                                <select
                                    name="organizationType"
                                    value={formData.organizationType}
                                    onChange={handleChange}
                                    required
                                    className="border-none bg-transparent outline-none w-full text-sm"
                                >
                                    <option value="consultancy">
                                        Consultancy
                                    </option>
                                    <option value="software">Software</option>
                                    <option value="industry">Industry</option>
                                    <option value="banking">Banking</option>
                                </select>
                            </span>
                        </div>

                        <span className="flex items-start bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                            <img src={SuitCase} alt="" />
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Organization Name"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                                className="border-none bg-transparent outline-none w-full text-sm"
                            />
                        </span>

                        <span className="flex items-start bg-[#f9f9f9] border border-[#e0e0e0] rounded-lg p-[0.6rem_0.8rem] gap-2 text-sm">
                            <textarea
                                name="description"
                                placeholder="Describe the reason"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="border-none bg-transparent outline-none w-full text-sm resize-none"
                            />
                        </span>

                        <button
                            type="submit"
                            className="self-end bg-[#dbe7ff] text-[#4a6ed6] border-none rounded-[20px] p-[0.5rem_1.2rem] text-sm cursor-pointer transition-colors duration-300 hover:bg-[#c8dbff]"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-[45%] p-[15px] rounded-2xl bg-[#f5f9ff]">
                    <div className="mt-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex gap-5 p-[10px_10px_15px]">
                        <img src={Chatting} alt="" />
                        <div className="flex flex-col gap-[5px] items-start overflow-hidden text-[#565e6c] text-sm font-normal">
                            <span className="text-[#56a8fd] text-base">
                                Contact for customer support
                            </span>
                            <span className="">Converse with our exports</span>
                            <span className="text-[#56a8fd] underline">
                                Support@gahiresync.com
                            </span>
                        </div>
                    </div>
                    <div className="mt-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex gap-5 p-[10px_10px_15px]">
                        <img src={Deal} alt="" />
                        <div className="flex flex-col gap-[5px] items-start overflow-hidden text-[#565e6c] text-sm font-normal">
                            <span className="text-[#56a8fd] text-base">
                                Contact for sales
                            </span>
                            <span className="">Queries on pricing</span>
                            <span className="text-[#56a8fd] underline">
                                sales@gahiresync.com
                            </span>
                        </div>
                    </div>
                    <div className="mt-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex gap-5 p-[10px_10px_15px]">
                        <img src={Location} alt="" />
                        <div className="flex flex-col gap-[5px] items-start overflow-hidden text-[#565e6c] text-sm font-normal">
                            <span className="text-[#56a8fd] text-base">
                                Partnership and alince
                            </span>
                            <span className="">For explore more</span>
                            <a
                                className="text-[#56a8fd] underline"
                                href="wwww.info@gahiresync.com"
                            >
                                info@gahiresync.com
                            </a>
                        </div>
                    </div>
                    <div className="mt-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex gap-5 p-[10px_10px_15px]">
                        <img src={Chatting} alt="" />
                        <div className="flex flex-col gap-[5px] items-start overflow-hidden text-[#565e6c] text-sm font-normal">
                            <span className="text-[#56a8fd] text-base">
                                Visit Us
                            </span>
                            <span className="">
                                Lorem ipsum dolor sit amet.
                            </span>
                            <a
                                className="text-[#56a8fd] underline"
                                href="https://www.google.com/maps/place/googlelocation.link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                googlelocation.link
                            </a>
                        </div>
                    </div>

                    <div className="py-5 flex gap-[25px] items-center">
                        <a href="https://www.linkedin.com/company/106440537/admin/dashboard/">
                            <img src={linkdin} />
                        </a>
                        <a href="https://x.com/hiresyncga">
                            <img src={twitter} />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61574646366813">
                            <img src={fb} />
                        </a>
                        <a href="https://www.instagram.com/gahiresync/">
                            <img src={insta} />
                        </a>
                    </div>
                </div>
            </div>
            <FaqReuseComponent />
            <Footer />
        </div>
    );
};

export default ContactUs;
