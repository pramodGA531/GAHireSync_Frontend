import React, { useState, useEffect, useRef } from "react";
import TopNav from "./TopNav";
import BG from "../../images/LandingPage/BG2.png";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Location from "../../images/JobDetails/location.svg";
import MoneyBag from "../../images/Client/money bag.svg";
import Experience from "../../images/Client/Experience.svg";
import Note from "../../images/Client/note.svg";
import Building from "../../images/LandingPage/ph_buildings-light.svg";
import JobPost from "../../images/LandingPage/jobpost.jpg";
import Suitcase from "../../images/LandingPage/suitcase.svg";
import { useAuth } from "../common/useAuth";
import { message } from "antd";
import { Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ApplyJobOutsider from "./ApplyJobOutsider";

const JobCard = ({ job_data }) => {
    const navigate = useNavigate();
    const [fillApplication, setFillApplication] = useState(false);
    console.log("job locations are ", job_data.job_locations);
    const handleApply = () => {
        setFillApplication(true);
    };

    return (
        <div className="rounded-lg border border-[rgba(52,78,93,0.22)] w-full max-w-[350px] min-h-[300px] relative p-4 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
                <div className="mt-2.5 flex justify-between">
                    <div className="flex gap-2.5">
                        <div className="shrink-0">
                            <img
                                src={job_data?.image ? job_data.image : JobPost}
                                alt=""
                                className="rounded bg-cover bg-no-repeat bg-[#AAA1A1] w-[53px] h-[46px] object-cover"
                            />
                        </div>
                        <div>
                            <div className="text-[#4D5F6E] text-lg font-medium mb-0 leading-tight">
                                {job_data?.job_title}{" "}
                            </div>
                            <div className="m-0 flex gap-1.5 items-center text-sm text-gray-500">
                                {" "}
                                <img src={Building} alt="" />{" "}
                                {job_data.agency_name}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span
                            className={`text-xs font-normal px-2.5 py-1.5 rounded-[10px] ${
                                job_data.status === "opened"
                                    ? "bg-[#ecf4ec] text-green-700"
                                    : "bg-[#f4ecec] text-red-700"
                            }`}
                        >
                            {job_data.status}
                        </span>
                    </div>
                </div>
                <div className="mt-2.5 gap-2.5 flex flex-wrap pb-2.5">
                    <div className="flex flex-wrap gap-1.5 items-center justify-center text-[#4D5F6E] text-sm font-semibold">
                        <img src={Location} alt="" className="w-4 h-4" />{" "}
                        {job_data.job_locations.map((item, index) => (
                            <span key={index} className="mr-1">
                                {item}
                                {index < job_data.job_locations.length - 1 &&
                                    ","}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-1.5 items-center justify-center text-[#4D5F6E] text-sm font-semibold">
                        <img src={Suitcase} alt="" className="w-4 h-4" />{" "}
                        {job_data?.job_type}
                    </div>
                    <div className="flex gap-1.5 items-center justify-center text-[#4D5F6E] text-sm font-semibold">
                        <img src={Experience} alt="" className="w-4 h-4" />{" "}
                        {job_data?.experience}{" "}
                    </div>
                    <div className="flex gap-1.5 items-center justify-center text-[#4D5F6E] text-sm font-semibold">
                        <img src={MoneyBag} alt="" className="w-4 h-4" />{" "}
                        {job_data?.ctc}{" "}
                    </div>
                    <div className="flex gap-1.5 items-center justify-center text-[#4D5F6E] text-sm font-semibold">
                        <img src={Note} alt="" className="w-4 h-4" />{" "}
                        {job_data?.job_level}{" "}
                    </div>
                </div>
                <div className="pt-2.5 border-t border-[rgba(210,216,219,0.49)] line-clamp-[6] overflow-hidden text-ellipsis text-[#2F373E] text-[15px] font-normal mb-12">
                    {job_data?.job_description}
                </div>
            </div>

            <div className="w-[90%] left-[5%] flex items-center justify-between mt-[15px] absolute bottom-2.5">
                <div
                    className="rounded-[28px] border border-[#8BB9FF] bg-[#F5F9FF] text-[#8AB9FF] text-center px-4 py-1.5 text-sm font-medium cursor-pointer hover:bg-[#8BB9FF] hover:text-white transition-colors"
                    onClick={() => handleApply()}
                >
                    Apply
                </div>
                <div
                    className="rounded-[28px] border border-[#8BB9FF] bg-[#F5F9FF] text-[#8AB9FF] text-center px-4 py-1.5 text-sm font-medium cursor-pointer hover:bg-[#8BB9FF] hover:text-white transition-colors"
                    onClick={() =>
                        navigate(`/job-board/job-post/${job_data.id}`)
                    }
                >
                    View
                </div>
            </div>

            {fillApplication && (
                <ApplyJobOutsider
                    job_locations={job_data?.job_locations}
                    fillApplication={fillApplication}
                    setFillApplication={setFillApplication}
                    job_id={job_data.id}
                />
            )}
        </div>
    );
};

const JobBoard = () => {
    const navigate = useNavigate();

    const typesOfEmployment = [
        "Full Time",
        "Part Time",
        "Freelance",
        "Intern",
        "Consultant",
    ];
    const experience = ["0 years", "1 - 3 years", "3 - 10 years", "10+ years"];

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [minCTC, setMinCTC] = useState("");
    const [maxCTC, setMaxCTC] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            let filtered = [...data];

            if (selectedTypes.length > 0) {
                filtered = filtered.filter((job) =>
                    selectedTypes.includes(job.job_type)
                );
            }

            if (selectedExperience.length > 0) {
                filtered = filtered.filter((job) =>
                    selectedExperience.includes(job.experience)
                );
            }

            if (minCTC) {
                filtered = filtered.filter(
                    (job) => parseInt(job.ctc) >= parseInt(minCTC)
                );
            }

            if (maxCTC) {
                filtered = filtered.filter(
                    (job) => parseInt(job.ctc) <= parseInt(maxCTC)
                );
            }

            if (searchQuery.trim()) {
                filtered = filtered.filter(
                    (job) =>
                        job.job_title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        job.job_description
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                );
            }

            setFilteredData(filtered);
        }, 300);
    }, [data, selectedTypes, selectedExperience, minCTC, maxCTC, searchQuery]);

    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const { apiurl } = useAuth();
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/landing-page/fetchjobs/`, {
                method: "GET",
            });
            const jobs = await response.json();
            if (jobs.error) {
                message.error("Failed to fetch jobs");
            }
            setData(jobs.jobs_data);
            setFilteredData(jobs.jobs_data);
        } catch (e) {
            message.error(e.message);
        }
    };

    const onChangeFilter = (checkedValues, type) => {
        if (type === "type") {
            setSelectedTypes(checkedValues);
        } else if (type === "experience") {
            setSelectedExperience(checkedValues);
        }
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                    Career Opportunities
                </div>
                <div className="text-center mt-2.5 pb-5 text-lg w-[90vw] md:w-[60vw] mx-auto">
                    Effortlessly post and manage job openings across multiple
                    channels. Reach a broader talent pool and centralize your
                    application workflow
                </div>
                <div
                    className="text-center mt-0 pb-[50px] text-lg text-[#56A8FD] cursor-pointer"
                    onClick={() => navigate("/welcome")}
                >
                    Home/Career Opportunities
                </div>
                <div className="w-full flex items-center justify-center pb-5 gap-2.5">
                    <div className="flex gap-[15px] items-center justify-center">
                        <span className="text-[#807777] text-center text-lg font-medium flex">
                            Job openings
                        </span>
                        <span className="text-[#1681FF] text-center text-xl font-medium flex">
                            150
                        </span>
                    </div>
                    <span className="bg-[#979494] h-[25px] w-[2px]"></span>
                    <div className="flex gap-[15px] items-center justify-center">
                        <span className="text-[#807777] text-center text-lg font-medium flex">
                            No of companies
                        </span>
                        <span className="text-[#1681FF] text-center text-xl font-medium flex">
                            80
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex p-2.5 mt-8 items-center gap-2.5 rounded-md border border-[#9EAEB7] w-[90%] md:w-[45%] mx-auto mb-2.5">
                <SearchOutlined></SearchOutlined>
                <input
                    type="text"
                    onChange={handleSearch}
                    className="outline-none border-none w-full bg-transparent"
                    placeholder="Search jobs..."
                />
            </div>
            <div className="flex gap-[15px] items-start mx-5 flex-col md:flex-row">
                <div className="mt-2.5 ml-0 md:ml-5 p-[15px] rounded-lg border border-[rgba(52,78,93,0.22)] w-full md:min-w-[250px] md:w-[20%] mb-2.5 bg-white">
                    <div className="mt-[15px]">
                        <div className="mb-2.5 text-[#5A717B] text-base font-semibold">
                            Type of employment
                        </div>
                        <Checkbox.Group
                            className="flex gap-2.5 flex-col text-black text-[15px] font-light"
                            options={typesOfEmployment}
                            defaultValue={[]}
                            onChange={(checkedValues) =>
                                onChangeFilter(checkedValues, "type")
                            }
                        />
                    </div>

                    <div className="mt-[15px]">
                        <div className="mb-2.5 text-[#5A717B] text-base font-semibold">
                            Experience
                        </div>

                        <Checkbox.Group
                            className="flex gap-2.5 flex-col text-black text-[15px] font-light"
                            options={experience}
                            defaultValue={[]}
                            onChange={(checkedValues) =>
                                onChangeFilter(checkedValues, "experience")
                            }
                        />
                    </div>

                    <div className="mt-[15px]">
                        <div className="text-[#5A717B] text-base font-semibold">
                            CTC Range
                        </div>
                        <div className="flex p-1.5 items-center gap-2.5 border rounded-md border-[#9EAEB7] mt-2.5">
                            <span>$</span>
                            <input
                                type="text"
                                placeholder="min-ctc"
                                onChange={(e) => setMinCTC(e.target.value)}
                                className="outline-none border-none w-[60%] bg-transparent"
                            />
                        </div>
                        <div className="flex p-1.5 items-center gap-2.5 border rounded-md border-[#9EAEB7] mt-2.5">
                            <span>$</span>
                            <input
                                type="text"
                                placeholder="max-ctc"
                                onChange={(e) => setMaxCTC(e.target.value)}
                                className="outline-none border-none w-[60%] bg-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="m-0 md:m-2.5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-start items-start">
                    {filteredData && filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <React.Fragment key={index}>
                                <JobCard job_data={item} />
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-[1.2rem] text-[#666] py-10">
                            No job openings available at the moment.
                        </div>
                    )}
                </div>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default JobBoard;
