import React, { useState, useEffect } from "react";
import TopNav from "./TopNav";
import BG from "../../images/LandingPage/BG2.png";
import ourStory from "../../images/LandingPage/aboutus1.png";
import Target from "../../images/LandingPage/target.svg";
import Idea from "../../images/LandingPage/idea.svg";
import feature1 from "../../images/LandingPage/feature1.png";
import feature2 from "../../images/LandingPage/feature2change.png";
import feature3 from "../../images/LandingPage/feature3.png";
import feature4 from "../../images/LandingPage/feature4.png";
import icon1 from "../../images/faqs/icon1.svg";
import icon2 from "../../images/faqs/icon2.svg";
import icon3 from "../../images/faqs/icon3.svg";
import icon4 from "../../images/faqs/icon4.svg";
import Person from "../../images/LandingPage/team.png";
import ameer from "../../images/LandingPage/ameerpic.png";
import kalki from "../../images/LandingPage/kalkipic.jpg";
import jai from "../../images/LandingPage/jaipic.jpg";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const TeamCarousel = ({ teamMembers }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const navigate = useNavigate();

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prevIndex) =>
            prevIndex === teamMembers.length - 1 ? 0 : prevIndex + 1
        );
    };

    const getVisibleMembers = () => {
        const result = [];
        const lastIndex = teamMembers.length - 1;

        const prevIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
        result.push({
            member: teamMembers[prevIndex],
            position: "prev",
            index: prevIndex,
        });

        // Active member
        result.push({
            member: teamMembers[activeIndex],
            position: "active",
            index: activeIndex,
        });

        // Next member
        const nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
        result.push({
            member: teamMembers[nextIndex],
            position: "next",
            index: nextIndex,
        });

        return result;
    };

    const variants = {
        prev: {
            x: -250,
            scale: 0.8,
            zIndex: 1,
            filter: "grayscale(100%) brightness(70%)",
            transition: { type: "tween", ease: "easeInOut", duration: 0.5 },
        },
        active: {
            x: 0,
            scale: 1,
            zIndex: 3,
            filter: "grayscale(0%) brightness(100%)",
            transition: { type: "tween", ease: "easeInOut", duration: 0.5 },
        },
        next: {
            x: 250,
            scale: 0.8,
            zIndex: 1,
            filter: "grayscale(100%) brightness(70%)",
            transition: { type: "tween", ease: "easeInOut", duration: 0.5 },
        },
    };

    return (
        <div className="relative w-full max-w-[1200px] mx-auto py-10 overflow-hidden">
            <div className="flex justify-center items-center relative h-[400px]">
                {getVisibleMembers().map((item) => (
                    <motion.div
                        key={item.index}
                        className="absolute will-change-transform"
                        initial={
                            direction > 0
                                ? "next"
                                : direction < 0
                                ? "prev"
                                : "active"
                        }
                        animate={item.position}
                        variants={variants}
                    >
                        <div className="relative w-[300px] h-[350px] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                            <img
                                src={item.member.image || "/placeholder.svg"}
                                alt={item.member.name}
                                className="w-full h-full object-cover"
                            />
                            <AnimatePresence>
                                {item.position === "active" && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 p-[15px] bg-black/60 text-white text-center rounded-b-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.3,
                                        }}
                                    >
                                        <h3 className="m-0 text-lg font-semibold">
                                            {item.member.name}
                                        </h3>
                                        <p className="m-[5px_0_0] text-sm opacity-90">
                                            {item.member.role}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center gap-5 mt-5">
                <motion.button
                    className="flex items-center justify-center w-[50px] h-[50px] border-2 border-[#3498db] rounded-full bg-white text-[#3498db] cursor-pointer transition-all duration-300 outline-none hover:bg-[#3498db] hover:text-white"
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <LeftOutlined size={24} style={{ fontSize: "24px" }} />
                </motion.button>
                <motion.button
                    className="flex items-center justify-center w-[50px] h-[50px] border-2 border-[#3498db] rounded-full bg-white text-[#3498db] cursor-pointer transition-all duration-300 outline-none hover:bg-[#3498db] hover:text-white"
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RightOutlined size={24} style={{ fontSize: "24px" }} />
                </motion.button>
            </div>
        </div>
    );
};

const AboutUs = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % team.length);
    };

    const prevSlide = () => {
        setActiveIndex(
            (prevIndex) => (prevIndex - 1 + team.length) % team.length
        );
    };

    const navigate = useNavigate();

    const team = [
        {
            image: Person,
            name: "Satyanarayana",
            role: "Developer",
        },
        {
            image: Person,
            name: "Venkat Gunnam",
            role: "GA DIGITAL SOLUTIONS CEO",
        },
        {
            image: Person,
            name: "RAJINI",
            role: "HR MANAGER",
        },
        {
            image: Person,
            name: "Arjun",
            role: "Designer",
        },
        {
            image: ameer,
            name: "Ameer",
            role: "Developer",
        },
        {
            image: jai,
            name: "Jay Tej",
            role: "Designer",
        },
        {
            image: kalki,
            name: "Kalki",
            role: "Project Manager(Developer)",
        },
    ];

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
                    About Us
                </div>
                <div className="text-center mt-2.5 pb-5 text-lg w-[60vw] mx-auto">
                    GA HireSync is committed to reshaping recruitment through
                    intelligent technology. Our platform is engineered to
                    deliver precision, speed, and ease to the hiring process.
                </div>
                <div
                    className="text-center mt-0 pb-[50px] text-lg text-[#56A8FD] cursor-pointer"
                    onClick={() => navigate("/welcome")}
                >
                    Home/about
                </div>
            </div>
            <div className="mt-5 flex flex-col md:flex-row gap-5 px-[10px] md:px-[60px]">
                <img src={ourStory} alt="" className="object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#565E6C] text-[36px] font-medium leading-normal">
                        The Story Behind GA HireSync – Built for Recruiters,
                        Perfected by Engineers
                    </span>
                    <span className="mt-2.5 text-[#565E6C] text-sm font-normal leading-normal">
                        At GA Consulting, we’ve lived the chaos of recruitment
                        firsthand—juggling multiple roles for multiple clients,
                        tracking endless job descriptions, and ensuring every
                        candidate matched the right opportunity. The process was
                        overwhelming, and we knew there had to be a better way.
                        That’s why we built GA HireSync—not as just another
                        hiring tool, but as a game-changer for recruiters.
                        Unlike platforms created by engineers with no
                        recruitment experience, GA HireSync was born out of our
                        own struggles. Our recruiters outlined the problems, and
                        our engineers ensured the technology worked seamlessly
                        to solve them. The result? A platform that remembers
                        every detail, streamlines hiring, and lets recruiters
                        focus on what truly matters—finding the perfect talent.
                        No more sifting through spreadsheets or losing track of
                        job requirements. With GA HireSync, managing multiple
                        roles for multiple clients is effortless, letting you
                        recruit smarter, faster, and without the hassle.
                        Recruitment should be about people, not paperwork. With
                        GA HireSync, it finally is.
                    </span>
                </div>
            </div>
            <div className="p-[25px_20px] md:p-[25px_60px] flex flex-col md:flex-row gap-5">
                <div className="p-[28px_26px] flex flex-col gap-2.5 rounded-xl bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[100px]">
                    <span className="flex items-center gap-2.5 text-[rgba(88,161,255,0.59)] text-24px font-medium leading-normal">
                        <img src={Target} alt="" />
                        Our Mission
                    </span>
                    <span className="text-[#727272] text-sm font-normal leading-normal">
                        At GA HireSync, our mission is to empower recruiters
                        with intelligent, seamless, and efficient hiring
                        solutions. We strive to eliminate the complexities of
                        recruitment by integrating technology with human
                        expertise, ensuring that recruiters can focus on what
                        truly matters—connecting the right talent with the right
                        opportunities.
                    </span>
                </div>
                <div className="p-[28px_26px] flex flex-col gap-2.5 rounded-xl bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[100px]">
                    <span className="flex items-center gap-2.5 text-[rgba(88,161,255,0.59)] text-24px font-medium leading-normal">
                        <img src={Idea} alt="" />
                        Our Vision
                    </span>

                    <span className="text-[#727272] text-sm font-normal leading-normal">
                        We envision a future where hiring is effortless,
                        data-driven, and human-centric. GA HireSync aims to be
                        the go-to recruitment platform, revolutionizing the
                        industry by bridging the gap between AI-driven
                        efficiency and recruiter intuition, making every hire
                        smarter and faster.
                    </span>
                </div>
            </div>
            <div
                className="pt-[30px] flex flex-col items-center"
                style={{
                    backgroundImage: `url(${BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "0px 0px 0px 0px",
                }}
            >
                <div className="w-[90vw] md:w-[30vw] text-[#4D5163] text-center text-[45px] font-semibold">
                    You can do it all with{" "}
                    <span className="text-[#F46EBE]">Hiresync</span>
                </div>
                <div className="">
                    <div className="">
                        <img src={feature1} alt="" className="hidden" />{" "}
                        {/* Original layout had complex images, preserving structure but ensuring visibility */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <img
                                src={feature1}
                                alt=""
                                className="w-[45vw] max-w-[500px]"
                            />
                            <img
                                src={feature2}
                                alt=""
                                className="w-[70vw] max-w-[790px]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-5 gap-4">
                        <img src={feature3} alt="" className="max-w-[45%]" />
                        <img src={feature4} alt="" className="max-w-[45%]" />
                    </div>
                </div>
                <div className="mt-2.5 flex flex-col md:flex-row p-10 w-[80%] justify-between">
                    <div className="flex flex-col">
                        <span className="text-[70px] text-[#4394DF] font-semibold">
                            5+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm">
                            Signed up Customers 5+
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[70px] text-[#4394DF] font-semibold">
                            15+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm">
                            Recruiters 15+ using the platform{" "}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[70px] text-[#4394DF] font-semibold">
                            10+
                        </span>
                        <span className="text-[#4D5163] font-normal text-sm">
                            Positions 10+ Closed
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-[4vh] flex flex-col justify-center items-center">
                <div className="w-[90%] md:w-[40%] text-[#4D5163] text-center text-[48px] font-semibold leading-[64px] tracking-[-1.68px]">
                    Meet the <span className="text-[#F46EBE]">Minds</span>{" "}
                    Behind the Innovation
                </div>
                <div className="w-[90%] md:w-[40%] text-[#4D5163] text-center text-[16px] font-normal leading-normal">
                    Learn more about the experts driving GA HireSync’s
                    development. A team dedicated to delivering reliable and
                    forward-thinking recruitment solutions.
                </div>
                <div className="w-full">
                    <TeamCarousel teamMembers={team} />
                </div>
            </div>
            <div
                className="pt-[30px] pb-[30px] flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `url(${BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "0px 0px 0px 0px",
                }}
            >
                <div className="text-[#4D5163] text-[48px] font-semibold leading-[64px] tracking-[-1.68px] text-center">
                    <span className="text-[#F46EBE]">Customer Centric</span>{" "}
                    Approach
                </div>
                <div className="text-[#4D5163] text-center text-base font-normal leading-normal w-[90vw] md:w-[45vw]">
                    Putting our users at the heart of every decision, we design
                    solutions that truly serve, simplify, and support their
                    hiring journey.
                </div>
                <div className="mt-[45px] flex justify-center flex-wrap gap-[25px]">
                    <div className="w-[90%] md:w-[40%] p-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex flex-col items-start">
                        <img
                            src={icon1}
                            alt=""
                            className="rounded-lg bg-[#58A1FF] p-2.5 h-[35px] w-[35px] mb-2.5"
                        />
                        <span className="text-[#56A8FD] text-xl font-medium leading-normal">
                            Built Around Real Needs
                        </span>
                        <span className="text-start overflow-hidden text-[#565E6C] text-ellipsis text-sm font-normal leading-normal">
                            We listen to recruiters, employers, and teams to
                            shape solutions that solve real-world hiring
                            challenges—not just theoretical ones.
                        </span>
                    </div>
                    <div className="w-[90%] md:w-[40%] p-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex flex-col items-start">
                        <img
                            src={icon2}
                            alt=""
                            className="rounded-lg bg-[#58A1FF] p-2.5 h-[35px] w-[35px] mb-2.5"
                        />
                        <span className="text-[#56A8FD] text-xl font-medium leading-normal">
                            Seamless User Experience{" "}
                        </span>
                        <span className="text-start overflow-hidden text-[#565E6C] text-ellipsis text-sm font-normal leading-normal">
                            Every feature is designed to be intuitive,
                            efficient, and responsive, minimizing friction so
                            users can focus on what matters most.
                        </span>
                    </div>
                    <div className="w-[90%] md:w-[40%] p-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex flex-col items-start">
                        <img
                            src={icon3}
                            alt=""
                            className="rounded-lg bg-[#58A1FF] p-2.5 h-[35px] w-[35px] mb-2.5"
                        />
                        <span className="text-[#56A8FD] text-xl font-medium leading-normal">
                            Responsible Support
                        </span>
                        <span className="text-start overflow-hidden text-[#565E6C] text-ellipsis text-sm font-normal leading-normal">
                            Whether it’s onboarding or day-to-day queries, our
                            dedicated support team ensures users feel heard and
                            helped at every stage.
                        </span>
                    </div>
                    <div className="w-[90%] md:w-[40%] p-2.5 rounded-xl bg-white shadow-[0px_0px_16px_0px_rgba(77,104,195,0.12)] flex flex-col items-start">
                        <img
                            src={icon4}
                            alt=""
                            className="rounded-lg bg-[#58A1FF] p-2.5 h-[35px] w-[35px] mb-2.5"
                        />
                        <span className="text-[#56A8FD] text-xl font-medium leading-normal">
                            Continuous Improvement
                        </span>
                        <span className="text-start overflow-hidden text-[#565E6C] text-ellipsis text-sm font-normal leading-normal">
                            We evolve with user feedback, industry trends, and
                            tech advancements—because your success drives ours.
                        </span>
                    </div>
                </div>
                <div style={{ margin: "25px" }}>
                    <button
                        className="px-5 py-2 rounded-full font-normal text-sm bg-gray-200 hover:bg-gray-300 transition-colors"
                        onClick={() => navigate("/login")}
                    >
                        connect now
                    </button>
                </div>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default AboutUs;
