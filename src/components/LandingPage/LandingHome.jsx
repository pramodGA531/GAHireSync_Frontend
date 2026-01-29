import React, { useRef, useState, useEffect } from "react";
import TopNav from "./TopNav";
import BG1 from "../../images/LandingPage/BG1.png";
import BG2 from "../../images/LandingPage/BG2.png";
import rightArrow from "../../images/LandingPage/arrow-right.svg";
import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import person from "../../images/LandingPage/person.png";
import fe1 from "../../images/LandingPage/fe1.svg";
import fe2 from "../../images/LandingPage/fe2.svg";
import fe3 from "../../images/LandingPage/fe3.svg";
import fe4 from "../../images/LandingPage/fe4.svg";
import fe5 from "../../images/LandingPage/fe5.svg";
import fe6 from "../../images/LandingPage/fe6.svg";
import fe7 from "../../images/LandingPage/fe7.svg";
import fe8 from "../../images/LandingPage/fe8.svg";
import fe9 from "../../images/LandingPage/fe9.svg";
import fe10 from "../../images/LandingPage/fe10.svg";
import feature1 from "../../images/LandingPage/feature1.png";
import feature2 from "../../images/LandingPage/feature2change.png";
import feature3 from "../../images/LandingPage/feature3.png";
import feature4 from "../../images/LandingPage/feature4.png";
import com1 from "../../images/LandingPage/company1.png";
import com2 from "../../images/LandingPage/company2.png";

import FaqReuseComponent from "./FaqReuseComponent";
import Plans from "./Plans.json";
import { Switch } from "antd";
import { motion } from "framer-motion";
import Footer from "./Footer";
import ReviewVideo from "../../assets/review-video.mp4";



const FeatureCard = ({ item }) => {
    return (
        <div className="rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] p-[26px_28px] w-full md:w-[40%] flex flex-row items-center gap-4 hover:shadow-lg transition-shadow duration-300">
            <img src={item.image} alt="" className="h-[30px] w-auto" />
            <div className="flex flex-col gap-2">
                <div className="text-[#56A8FD] text-lg font-semibold">
                    {item.name}
                </div>
                <div className="overflow-hidden text-[#565E6C] text-sm font-normal text-ellipsis">
                    {item.description}
                </div>
            </div>
        </div>
    );
};

const PlanCard = ({ item }) => {
    return (
        <div
            className={`${
                item.active
                    ? "lg:relative lg:-top-10 bg-gradient-to-br from-[#114C68] via-[#00A7F4] to-[#114C68] text-white"
                    : "bg-white"
            } shadow-[0px_0px_3px_3px_rgb(174,171,171)] p-[15px] rounded-3xl w-[260px] pb-8 flex flex-col shrink-0 transition-transform duration-300`}
        >
            <span
                className={`text-start text-[#104259] text-2xl font-semibold ${
                    item.active ? "text-white" : ""
                }`}
            >
                {item.name}
            </span>
            <div className="mt-4 flex flex-col gap-4 text-[#d6e4ea] text-base font-normal">
                {item.features &&
                    item.features.map((feature, index) => (
                        <span
                            key={index}
                            className={`flex gap-2 items-center ${
                                feature.enabled
                                    ? item.active
                                        ? "text-white"
                                        : "text-[#104259]"
                                    : item.active
                                    ? "text-[#9ca1a3]"
                                    : "text-gray-400"
                            }`}
                        >
                            <CheckOutlined /> {feature.name}
                        </span>
                    ))}
            </div>
            <span
                className={`mt-6 opacity-95 text-[#104259] text-xl font-semibold ${
                    item.active ? "text-white" : ""
                }`}
            >
                {item.price}
            </span>
            <span className="w-full mt-5 flex justify-center">
                <button
                    className={`rounded-lg w-[80%] py-2 text-base font-semibold ${
                        item.active
                            ? "bg-[#45CAFF] text-white"
                            : "bg-[#F8F4FF] text-[#45CAFF]"
                    }`}
                >
                    Choose Plan
                </button>
            </span>
        </div>
    );
};

const VideoPlayer = ({ item }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState();
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    return (
        <div className="w-full max-w-[450px] aspect-[10/16] rounded-xl relative overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover">
                <source src={item.video_url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-2.5 left-2.5 w-[85%] p-[5px_10px] rounded-lg bg-[rgba(61,117,177,0.50)] backdrop-blur-[6.3px] flex items-center gap-1">
                <button
                    onClick={togglePlayPause}
                    className="bg-transparent border-none cursor-pointer"
                >
                    {isPlaying ? "⏸️" : "▶️"}
                </button>
                <div className="flex flex-col justify-center gap-[1px]">
                    <span className="m-0 p-0 flex justify-start text-white text-center text-xs font-normal capitalize">
                        {item.name}
                    </span>
                    <span className="text-white text-[8px] font-normal">
                        {item.profession}
                    </span>
                </div>
            </div>
        </div>
    );
};

const VideoComment = ({ item }) => {
    const videoRef = useRef();
    const [isPlaying, setIsPlaying] = useState();
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    return (
        <div className="p-5 bg-white relative rounded-2xl w-[250px]">
            <div className="relative w-full group">
                <video
                    ref={videoRef}
                    className="w-full h-auto object-cover block rounded-lg"
                >
                    <source src={item.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={togglePlayPause}
                        className="bg-black/50 text-white rounded-full p-2"
                    >
                        {isPlaying ? "⏸️" : "▶️"}
                    </button>
                </div>
            </div>
            <div className="flex flex-col text-[#4D5163] gap-1 mt-2">
                <span className="text-start text-base font-semibold uppercase">
                    {item.name}
                </span>
                <span className="text-xs font-light">{item.profession}</span>
            </div>
            <div className="mt-2 text-[#4D5163] text-ellipsis text-xs font-normal">
                {item.comment}
            </div>
        </div>
    );
};

const Comment = ({ item }) => {
    return (
        <div className="bg-white p-5 rounded-2xl w-[250px]">
            <div className="flex flex-col text-[#4D5163] gap-1">
                <span className="text-start text-base font-semibold uppercase">
                    {item.name}
                </span>
                <span className="text-xs font-light">{item.profession}</span>
            </div>
            <div className="mt-2 text-[#4D5163] text-ellipsis text-xs font-normal">
                {item.comment}
            </div>
        </div>
    );
};

const LandingHome = () => {
    const [billMonthly, setBillMonthly] = useState(false);

    const coreFeatures = [
        {
            key: "1",
            image: fe1,
            name: "Recruitment Management System",
            description:
                "Streamline hiring with an intuitive platform that automates job postings, tracks applications, schedules interviews, and manages candidate interactions for a seamless end-to-end recruitment process.",
        },
        {
            key: "2",
            image: fe2,
            name: "Candidate Pipeline Management",
            description:
                "Track candidates throughout the hiring journey with real-time updates, automated notifications, and performance insights, ensuring a structured and data-driven approach to recruitment.",
        },
        {
            key: "3",
            image: fe3,
            name: "Job Board",
            description:
                "Easily post, manage, and advertise job listings on a centralized job board, ensuring maximum visibility for employers while helping candidates discover the best opportunities effortlessly.",
        },
        {
            key: "4",
            image: fe4,
            name: "Advanced Communication Tools",
            description:
                " Facilitate seamless collaboration between recruiters, candidates, and clients with in-app messaging, automated emails, and SMS notifications, ensuring smooth and efficient communication throughout the hiring process.",
        },
        {
            key: "5",
            image: fe5,
            name: "Recruitment Agency Operations Management",
            description:
                "Optimize agency workflows with tools for recruiter task management, client coordination, performance tracking, and automated billing, making recruitment operations more efficient and scalable.",
        },
        {
            key: "6",
            image: fe6,
            name: "Analytics and Reports",
            description:
                "Gain deep insights into recruitment performance with real-time data on job postings, candidate pipelines, recruiter efficiency, and hiring trends to make data-driven decisions effortlessly.",
        },
        {
            key: "7",
            image: fe7,
            name: "AI Tools (Resume Score, Recruiter Prompts, etc.)",
            description:
                "Leverage AI-driven insights like resume scoring, recruiter prompts, and automated candidate-job matching to enhance decision-making, reduce hiring time, and improve talent acquisition outcomes.",
        },
        {
            key: "8",
            image: fe8,
            name: "Data Privacy",
            description:
                "Protect sensitive candidate and company information with robust security measures, including encrypted data storage, role-based access controls, and compliance with global privacy regulations.",
        },
        {
            key: "9",
            image: fe9,
            name: " Resume Databank",
            description:
                "Maintain a centralized, searchable database of resumes with advanced filtering, AI-powered parsing, and real-time updates, enabling recruiters to find top talent quickly and efficiently..",
        },
        {
            key: "10",
            image: fe10,
            name: "Customizable workflows & Templates",
            description:
                "Easily tailor your hiring process with customizable workflows and ready-to-use templates. Streamline tasks, standardize steps, and adapt to each client or role—without starting from scratch.",
        },
    ];

    const logos = [com1, com2];
    const [count, setCount] = useState();

    useEffect(() => {
        let start = 0;
        const end = 2;
        const duration = 2000;
        const incrementTime = duration / end;

        const counter = setInterval(() => {
            start += 1;
            setCount(start);

            if (start === end) clearInterval(counter);
        }, incrementTime);

        return () => clearInterval(counter);
    }, []);

    const sentence1 = "Effortless Hiring, Seamless Talent Acquisition";
    const wordSplit = (sentence) => {
        return sentence.split(" ");
    };

    const [activeTabRole, setActiveTabRole] = useState("clients");

    const handleTabChange = (tab) => {
        setActiveTabRole(tab);
    };

    return (
        <div className="m-0 p-0">
            <div
                className="m-0 p-0 rounded-b-[70px] bg-cover bg-center"
                style={{
                    backgroundImage: `url(${BG1})`,
                }}
            >
                <div className="block">
                    <TopNav />
                </div>
                <div className="flex flex-col lg:flex-row pb-10 lg:pb-20">
                    <div className="flex flex-col gap-2.5 mt-[30px] lg:mt-[60px] pl-[5vw] lg:pl-[5vw] w-full lg:w-1/2 px-4 lg:px-0 text-center lg:text-left">
                        <motion.div
                            className="flex flex-wrap justify-center lg:justify-start gap-2.5 text-white font-['Playfair_Display'] text-[32px] lg:text-[40px] font-bold"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 1 },
                                visible: {
                                    transition: { staggerChildren: 0.2 },
                                },
                            }}
                        >
                            {wordSplit(sentence1).map((word, index) => (
                                <motion.span
                                    key={index}
                                    className="word"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.div>
                        <span className="text-white text-[15px] font-normal">
                            Empower your agency with a smarter way to connect
                            top talent with the right companies. Post jobs,
                            manage applications, and streamline recruitment—all
                            in one place.
                        </span>
                        <span className="mt-[20px] lg:mt-[30px] flex justify-center lg:justify-start">
                            <button className="flex py-3 px-4 justify-center items-center gap-2.5 font-bold text-white bg-transparent rounded-3xl border border-white transition-all duration-300 hover:bg-white hover:text-black">
                                Book A Demo{" "}
                                <ArrowRightOutlined></ArrowRightOutlined>
                            </button>
                        </span>
                    </div>
                    <div className="relative flex justify-center items-center flex-col w-full lg:w-fit mt-10 lg:mt-0">
                        <img
                            src={person}
                            alt=""
                            className="w-full max-w-[902px] h-auto aspect-[451/340] block"
                        />
                        <div className="hidden sm:block absolute top-[1%] left-[31%] bg-[#37D15D] text-white p-[8px_15px] rounded-[15px] text-base font-normal whitespace-nowrap animate-bounce">
                            AI-Powered Recruitment
                        </div>
                         <div className="block sm:hidden absolute top-[10%] left-[5%] bg-[#37D15D] text-white p-[8px_15px] rounded-[15px] text-base font-normal whitespace-nowrap animate-bounce">
  AI-Powered <br /> Recruitment
</div>

                        <div className="hidden sm:block absolute top-[15%] left-[9%] bg-[#FFD955] text-rgba(0,0,0,0.85) p-[8px_15px] rounded-[15px] text-base font-normal whitespace-nowrap animate-pulse">
                            Expand Your Talent Pool
                        </div>
                        <div className="hidden sm:block absolute top-[29%] left-[13%] bg-[#2E9DFB] text-white p-[8px_15px] rounded-[15px] text-base font-normal whitespace-nowrap">
                            Seamless Hiring Workflow
                        </div>
                        <div className="hidden sm:block absolute top-[42%] left-[29%] bg-[#9149ED] text-white p-[8px_15px] rounded-[15px] text-base font-normal whitespace-nowrap">
                            Global Hiring Made Simple
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full">
                <div className="py-[10vh] px-0 flex flex-col items-center">
                    <div className="w-[90vw] lg:w-[50vw] text-[#8B8A8A] text-center text-[24px] lg:text-[45px] font-semibold leading-[120%] lg:leading-[110%] tracking-tight">
                        Trusted by{" "}
                        <motion.span
                            className="text-[#F46EBE] text-[28px] lg:text-[54px] font-bold tracking-tight"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: false, amount: 0.2 }}
                        >
                            {count}+
                        </motion.span>{" "}
                        companies from startups to enterprisers
                    </div>

                    <div className="w-full overflow-hidden relative flex items-center justify-center p-[20px_0] mt-5">
                        <motion.div
                            className="flex gap-[50px] whitespace-nowrap items-center"
                            animate={{ x: ["0%", "-100%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 20,
                                ease: "linear",
                            }}
                        >
                            {[...logos, ...logos].map((logo, index) => (
                                <div
                                    key={index}
                                    className="w-[120px] h-[60px] flex items-center justify-center"
                                >
                                    <img
                                        src={logo}
                                        alt={`Company logo ${index + 1}`}
                                        className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
            <div
                className="pt-[30px] flex flex-col items-center bg-cover bg-center rounded-none"
                style={{
                    backgroundImage: `url(${BG2})`,
                }}
            >
                <div className="w-[90vw] lg:w-[30vw] text-[#4D5163] text-center text-[28px] lg:text-[45px] font-semibold leading-tight">
                    You can do it all with{" "}
                    <span className="text-[#F46EBE]">Hiresync</span>
                </div>
                <div className="flex flex-col items-center gap-4 mt-5">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <img
                            src={feature1}
                            alt=""
                            className="w-full max-w-[300px]"
                        />
                        <img
                            src={feature2}
                            alt=""
                            className="w-full max-w-[600px]"
                        />
                    </div>
                    <img
                        src={feature3}
                        alt=""
                        className="w-full max-w-[800px]"
                    />
                    <img
                        src={feature4}
                        alt=""
                        className="w-full max-w-[800px]"
                    />
                </div>

                <div className="mt-2.5 flex flex-wrap justify-center lg:justify-between gap-8 lg:gap-0 p-5 lg:p-10 w-full lg:w-[80%]">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <span className="text-[40px] lg:text-[70px] text-[#4394DF] font-semibold leading-none">
                            5+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm mt-2">
                            Signed up Customers 5+
                        </span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <span className="text-[40px] lg:text-[70px] text-[#4394DF] font-semibold leading-none">
                            15+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm mt-2">
                            Recruiters 15+ using the platform{" "}
                        </span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <span className="text-[40px] lg:text-[70px] text-[#4394DF] font-semibold leading-none">
                            10+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm mt-2">
                            Positions 10+ Closed
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-[5vh_5vw] lg:p-[10vh_5vw] flex flex-col items-center">
                <div className="w-full lg:w-[20vw] text-[#4D5163] font-semibold text-[32px] lg:text-[52px] flex flex-col items-center leading-[110%] tracking-tight gap-2.5 text-center">
                    Our Core <span className="text-[#F46EBE]">Features</span>
                </div>
                <div className="mt-2.5 w-[90vw] text-[#4D5163] text-center text-base font-normal">
                    Experience next-gen hiring with AI-powered recruitment,
                    seamless job management, and data-driven insights. Optimize
                    every step, from sourcing to selection, with our intuitive
                    and secure platform.
                </div>
                <div className="mt-[26px] w-full lg:w-[80%] flex flex-wrap justify-center gap-2.5">
                    {coreFeatures.map((item, index) => (
                        <FeatureCard key={index} item={item} />
                    ))}
                </div>
            </div>
            <div
                className="flex flex-col p-[5vh_5vw] lg:p-[10vh_10vw] items-center bg-cover bg-center"
                style={{
                    backgroundImage: `url(${BG2})`,
                }}
            >
                <div className="w-full lg:w-[30vw] text-[#4D5163] text-center text-[32px] lg:text-[40px] font-normal leading-[110%] tracking-tight">
                    Right place for your{" "}
                    <span className="text-[#F46EBE]">business</span>
                </div>
                <div className="w-[90vw] lg:w-[520px] text-[#4D5163] mt-5 text-sm lg:text-base font-normal text-center">
                    We have several powerful plans to showcase your business and
                    get discovered as a creative entrepreneurs. Everything you
                    need.
                </div>
                <div className="mt-8 lg:mt-5 flex flex-col lg:flex-row gap-8 lg:gap-[600px] justify-around items-center w-full">
                    <div className="flex justify-center items-center p-1.5">
                        <div className="flex bg-white rounded-[40px] p-[5px_7px] shadow-[0_1px_4px_rgba(0,0,0,0.1)] border border-gray-100">
                            <button
                                className={`p-[8px_18px] border-none bg-none text-sm cursor-pointer rounded-[40px] transition-all duration-300 outline-none ${
                                    activeTabRole === "clients"
                                        ? "bg-[#0d6efd] text-white font-semibold"
                                        : "text-black font-normal bg-white"
                                }`}
                                onClick={() => handleTabChange("clients")}
                            >
                                Clients
                            </button>
                            <button
                                className={`p-[8px_18px] border-none bg-none text-sm cursor-pointer rounded-[40px] transition-all duration-300 outline-none ${
                                    activeTabRole === "agencies"
                                        ? "bg-[#0d6efd] text-white font-semibold"
                                        : "text-black font-normal bg-white"
                                }`}
                                onClick={() => handleTabChange("agencies")}
                            >
                                Agencies
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center -translate-x-[50%]">
                        <span className="font-bold text-[#73A1E1]">
                            Bill Annually
                        </span>
                        <Switch
                            onChange={() => setBillMonthly(!billMonthly)}
                        ></Switch>
                        <span className="font-bold text-[#73A1E1]">
                            Bill Monthly
                        </span>
                    </div>  
                </div>
                <div className="flex flex-wrap justify-center gap-5 mt-[60px] w-full">
                    {billMonthly
                        ? Plans.monthlyPlans.map((item, index) => (
                              <PlanCard key={index} item={item}></PlanCard>
                          ))
                        : Plans.annualPlans.map((item, index) => (
                              <PlanCard key={index} item={item}></PlanCard>
                          ))}
                </div>
            </div>
            <FaqReuseComponent />
            <Footer></Footer>
        </div>
    );
};

export default LandingHome;
