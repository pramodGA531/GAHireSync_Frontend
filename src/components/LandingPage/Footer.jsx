// import React from "react";
// import { RightOutlined } from "@ant-design/icons";
// import Logo from "../../images/GAHIRESYNC-LOGO.svg";
// import { GlobalOutlined } from "@ant-design/icons";
// import Twitter from "../../images/LandingPage/twitter.svg";
// import Facebook from "../../images/LandingPage/facebook.svg";
// import Instagram from "../../images/LandingPage/instagram.svg";
// import LinkedIn from "../../images/LandingPage/linkedin.svg";

// const Footer = () => {
//     return (
//         <div className="bg-[#071C50] pt-[50px] text-white">
//             <div className="flex flex-col items-center text-[48px] font-semibold mb-[60px]">
//                 <span>Work Easy</span>
//                 <span>
//                     Grow Further with{" "}
//                     <span className="text-[#F46EBE]">Hire Sync</span>
//                 </span>
//                 <div className="pb-[80px] mt-5">
//                     <button className="text-black p-[10px_20px] text-sm rounded-full bg-white flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
//                         Request a demo <RightOutlined />
//                     </button>
//                 </div>
//                 <div className="w-[84%] border-b-2 border-[rgba(255,255,255,0.16)] text-base" />
//             </div>

//             <div className="flex flex-row gap-[10vw] md:gap-[30vw] mt-0 pb-[10vh] items-start px-[4vw]">
//                 <div className="flex flex-col items-start mt-0 pt-0 pl-[4vw]">
//                     <img
//                         src={Logo}
//                         alt=""
//                         className="flex flex-col shrink-0 mb-4"
//                     />
//                     <div className="flex gap-[15px] pl-[64px] cursor-pointer">
//                         <img src={Twitter} alt="Twitter" className="w-6 h-6" />
//                         <img
//                             src={LinkedIn}
//                             alt="LinkedIn"
//                             className="w-6 h-6"
//                         />
//                         <img
//                             src={Facebook}
//                             alt="Facebook"
//                             className="w-6 h-6"
//                         />
//                         <img
//                             src={Instagram}
//                             alt="Instagram"
//                             className="w-6 h-6"
//                         />
//                     </div>
//                 </div>
//                 <div className="flex flex-col md:flex-row gap-[8vw] justify-between pr-[10vw] mt-[40px]">
//                     <div className="flex flex-col">
//                         <span className="text-white text-base font-medium leading-6">
//                             How it works
//                         </span>
//                         <div className="text-[rgba(255,255,255,0.80)] cursor-pointer text-sm font-light leading-6 mt-[25px] flex flex-col gap-[20px]">
//                             <span>For Agencies</span>
//                             <span>For Recruiter</span>
//                             <span>For Organization</span>
//                             <span>For Candidates</span>
//                         </div>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-white text-base font-medium leading-6">
//                             Resource
//                         </span>
//                         <div className="text-[rgba(255,255,255,0.80)] cursor-pointer text-sm font-light leading-6 mt-[25px] flex flex-col gap-[20px]">
//                             <span>Blog's</span>
//                             <span>FAQ's</span>
//                             <span>Use Cases</span>
//                             <span>Job Board</span>
//                         </div>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-white text-base font-medium leading-6">
//                             Company
//                         </span>
//                         <div className="text-[rgba(255,255,255,0.80)] cursor-pointer text-sm font-light leading-6 mt-[25px] flex flex-col gap-[20px]">
//                             <span>About</span>
//                             <span>Pricing</span>
//                             <span>Contact us</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-[8vw]">
//                 <div className="text-white text-sm font-medium leading-4 pb-[30px] mb-[30px] border-b-2 border-[rgba(255,255,255,0.16)]">
//                     <GlobalOutlined className="mr-2" /> English
//                 </div>
//                 <div className="flex justify-between pb-[30px] text-[#FAF4EE] text-xs font-normal leading-[18px]">
//                     <span className="text">
//                         © Copyright 2024. All Rights Reserved.
//                     </span>
//                     <div className="flex gap-[20px] text-[rgba(255,255,255,0.70)] text-xs font-normal leading-[18px] cursor-pointer">
//                         <span>Privacy Policy</span>
//                         <span>Terms of Service</span>
//                         <span>Whistleblower Policy</span>
//                         <span>Cookie Policy</span>
//                         <span>Cookie Settings</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Footer;

import React from "react";
import { RightOutlined, GlobalOutlined } from "@ant-design/icons";
import Logo from "../../images/GAHIRESYNC-LOGO.svg";
import Twitter from "../../images/LandingPage/twitter.svg";
import Facebook from "../../images/LandingPage/facebook.svg";
import Instagram from "../../images/LandingPage/instagram.svg";
import LinkedIn from "../../images/LandingPage/linkedin.svg";

const Footer = () => {
    return (
        <footer className="bg-[#071C50] pt-[50px] text-white">
            {/* Top Section */}
            <div className="flex flex-col items-center text-[32px] lg:text-[48px] font-semibold mb-[60px] text-center">
                <span>Work Easy</span>
                <span>
                    Grow Further with{" "}
                    <span className="text-[#F46EBE]">Hire Sync</span>
                </span>

                <div className="pb-[80px] mt-5">
                    <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm text-black transition-colors hover:bg-gray-200">
                        Request a demo <RightOutlined />
                    </button>
                </div>

                <div className="w-[84%] border-b-2 border-white/20" />
            </div>

            {/* Middle Section */}
            <div className="flex flex-col lg:flex-row gap-[10vw] lg:gap-[30vw] pb-[10vh] px-[4vw]">
                {/* Logo + Social */}
                <div className="flex flex-col items-center">
                    <img
                        src={Logo}
                        alt="Hire Sync Logo"
                        className="mb-4 shrink-0"
                    />

                    <div className="flex gap-[15px] pl-[32px] cursor-pointer">
                        <img src={Twitter} alt="Twitter" className="h-10 w-10" />
                        <img
                            src={LinkedIn}
                            alt="LinkedIn"
                            className="h-10 w-10"
                        />
                        <img
                            src={Facebook}
                            alt="Facebook"
                            className="h-10 w-10"
                        />
                        <img
                            src={Instagram}
                            alt="Instagram"
                            className="h-10 w-10"
                        />
                    </div>
                </div>

                {/* Menu */}
                <div className="mt-[40px] flex flex-col md:flex-row md:gap-[16vw] md:pl-[8vw] lg:flex-row lg:gap-[8vw] pr-[10vw]">
                    {/* Column 1 */}
                    <div className="flex flex-col">
                        <span className="text-base font-medium">
                            How it works
                        </span>
                        <div className="mt-[25px] flex flex-col gap-[20px] text-sm font-light text-white/80 cursor-pointer">
                            <span>For Agencies</span>
                            <span>For Recruiter</span>
                            <span>For Organization</span>
                            <span>For Candidates</span>
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col">
                        <span className="text-base font-medium">Resource</span>
                        <div className="mt-[25px] flex flex-col gap-[20px] text-sm font-light text-white/80 cursor-pointer">
                            <span>Blogs</span>
                            <span>FAQs</span>
                            <span>Use Cases</span>
                            <span>Job Board</span>
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col">
                        <span className="text-base font-medium">Company</span>
                        <div className="mt-[25px] flex flex-col gap-[20px] text-sm font-light text-white/80 cursor-pointer">
                            <span>About</span>
                            <span>Pricing</span>
                            <span>Contact us</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="px-[8vw]">
                <div className="mb-[30px] border-b-2 border-white/20 pb-[30px] text-sm font-medium">
                    <GlobalOutlined className="mr-2" />
                    English
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-4 pb-[30px] text-xs text-[#FAF4EE]">
                    <span>© Copyright 2026. All Rights Reserved.</span>

                    <div className="flex flex-wrap gap-[20px] text-white/70 cursor-pointer">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                        <span>Whistleblower Policy</span>
                        <span>Cookie Policy</span>
                        <span>Cookie Settings</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
