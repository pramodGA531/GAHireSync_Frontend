import React, { useState, useEffect } from "react";
import Main from "../Layout";
// import "./Resumes.css";
import JobDescription from "../../../../images/Client/CreateJob/Jobdescription.svg";
import Note from "../../../../images/Client/note.svg";
import Experience from "../../../../images/Client/Experience.svg";
import Notice from "../../../../images/Client/Vacancies.svg";
import Bag from "../../../../images/Client/Bag.svg";
import NoCandidates from "../../../../images/Illustrations/NoCandidates.png";
import { useAuth } from "../../../common/useAuth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Modal, Tag } from "antd";
import ViewResume from "./ViewResume";
import DOMPurify from "dompurify";
import GoBack from "../../../common/Goback";

const ApplicationCard = ({ item, handleCompareToggle, isCompared }) => {
    const [viewResume, setViewResume] = useState(false);
    const [id, setId] = useState();
    const handleViewDetails = (applicationId) => {
        setId(applicationId);
        setViewResume(true);
    };
    return (
        <div className="border border-transparent w-[330px] p-4 shadow-[0_0_5px_0.3px_rgba(0,0,0,0.5)] rounded-[10px] hover:scale-[1.01] transition-transform duration-300 ease-in-out bg-white">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[#54577A] text-base font-semibold m-0 p-0">
                        {item.candidate_name}
                    </span>
                    <span className="m-0 p-0 text-xs font-normal text-[#54577A]">
                        {item.date_of_birth}
                    </span>
                </div>
                <div className="text-xs font-normal">
                    {item?.job_application?.status === "processing" ||
                    item?.job_application?.status === "selected" ? (
                        <span className="rounded-[14px] bg-[#EEFDF3] p-2.5 text-[#117B34]">
                            {item?.job_application?.status === "processing"
                                ? "Shortlisted"
                                : "Selected"}
                        </span>
                    ) : item?.job_application?.status === "rejected" ||
                      item?.job_application?.status === "left" ? (
                        <span className="p-2.5 rounded-[14px] bg-[#FDEFF3] text-[#E8618C]">
                            {item?.job_application.status}
                        </span>
                    ) : (
                        <span>{item?.job_application?.status}</span>
                    )}
                </div>
            </div>
            <div className="flex gap-2.5 mt-2.5 items-center">
                <span className="bg-[#1681FF0D] px-2.5 py-1.5 rounded-[23px] flex items-center gap-2.5 text-[#555555] text-xs font-medium">
                    <img className="w-[25px] h-[25px]" src={Notice} alt="" />
                    {item.notice_period} Days
                </span>
                <span className="bg-[#1681FF0D] px-2.5 py-1.5 rounded-[23px] flex items-center gap-2.5 text-[#555555] text-xs font-medium">
                    <img src={Experience} alt="" />
                    {item.experience} yrs experience
                </span>
            </div>
            <div className="mt-2.5 flex gap-1.5 text-[#555555] text-xs font-medium">
                <span className="bg-[#1681FF0D] px-2.5 py-1.5 rounded-[23px] flex items-center gap-2.5 w-fit">
                    {item.current_ctc}LPA Current CTC
                </span>
                <span className="bg-[#1681FF0D] px-2.5 py-1.5 rounded-[23px] flex items-center gap-2.5 w-fit">
                    {item.expected_ctc}LPA Expected CTC
                </span>
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    className="rounded-[5px] text-[#464F59] border border-[#464F59] bg-white text-sm font-normal h-10 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewDetails(item?.job_application.id)}
                >
                    View Details
                </button>
                <button
                    className="bg-[#1681FF] text-white text-sm font-normal h-10 px-4 rounded-[5px] border-none cursor-pointer hover:bg-[#0069d9]"
                    onClick={() => handleCompareToggle(item.job_application.id)}
                >
                    {isCompared ? "Remove from Compare" : "Add to Compare"}
                </button>
            </div>
            <Modal
                open={viewResume}
                onCancel={() => setViewResume(false)}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <ViewResume id={id} onCancel={() => setViewResume(false)} />
            </Modal>
        </div>
    );
};

const Resumes = ({ isReplacement = false }) => {
    const { apiurl, token } = useAuth();
    const [job, setJob] = useState();
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const navigate = useNavigate();
    const [descriptionModalVisible, setDescriptionModalVisible] =
        useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        status: "",
        experience: "",
        noticePeriod: "",
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Filtered data logic
    const filteredData = data.filter((item) => {
        // Status Filter
        if (filters.status) {
            const status = item?.job_application?.status;
            if (status !== filters.status) return false;
        }

        // Experience Filter
        if (filters.experience) {
            const exp = parseInt(item.experience);
            if (filters.experience === "0-2" && (exp < 0 || exp > 2))
                return false;
            if (filters.experience === "3-5" && (exp < 3 || exp > 5))
                return false;
            if (filters.experience === "5-8" && (exp < 5 || exp > 8))
                return false;
            if (filters.experience === "8+" && exp <= 8) return false;
        }

        // Notice Period Filter
        if (filters.noticePeriod) {
            const np = parseInt(item.notice_period);
            if (filters.noticePeriod === "immediate" && np !== 0) return false;
            if (filters.noticePeriod === "<15" && np >= 15) return false;
            if (filters.noticePeriod === "<30" && np >= 30) return false;
            if (filters.noticePeriod === "30+" && np < 30) return false;
        }

        return true;
    });

    useEffect(() => {
        const storedData =
            JSON.parse(sessionStorage.getItem("compareList")) || {};
        const existingList = storedData[id] || [];
        setCompareList(existingList);
    }, [id]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${apiurl}/client/get-resumes/?jobid=${id}&is_replacement=${isReplacement}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setJob(data.job_data);
            setData(data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, id]);

    const handleCompareToggle = (applicationId) => {
        const storedData =
            JSON.parse(sessionStorage.getItem("compareList")) || {};
        const currentList = storedData[id] || [];

        if (currentList.includes(applicationId)) {
            const updatedList = currentList.filter(
                (id) => id !== applicationId,
            );
            storedData[id] = updatedList;
            sessionStorage.setItem("compareList", JSON.stringify(storedData));
            setCompareList(updatedList);
        } else {
            if (currentList.length >= 3) {
                alert("You can only compare up to 3 candidates!");
                return;
            }
            const updatedList = [...currentList, applicationId];
            storedData[id] = updatedList;
            sessionStorage.setItem("compareList", JSON.stringify(storedData));
            setCompareList(updatedList);
        }
    };

    return (
        <Main defaultSelectedKey="3">
            <div className="p-5">
                {/* <div className="mt-4 -ml-2 -mb-4">
                    <GoBack />
                </div> */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <Link to="/client/applications">
                                    Applications
                                </Link>
                            ),
                        },
                        {
                            title: "Responses",
                        },
                    ]}
                />

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mt-4 mb-4 items-center">
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:border-blue-500"
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                        }
                    >
                        <option value="">All Status</option>
                        <option value="processing">Shortlisted</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                        <option value="left">Left</option>
                    </select>

                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:border-blue-500"
                        value={filters.experience}
                        onChange={(e) =>
                            handleFilterChange("experience", e.target.value)
                        }
                    >
                        <option value="">All Experience</option>
                        <option value="0-2">0-2 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5-8">5-8 Years</option>
                        <option value="8+">8+ Years</option>
                    </select>

                    <select
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none bg-white focus:border-blue-500"
                        value={filters.noticePeriod}
                        onChange={(e) =>
                            handleFilterChange("noticePeriod", e.target.value)
                        }
                    >
                        <option value="">All Notice Periods</option>
                        <option value="immediate">Immediate</option>
                        <option value="<15">Less than 15 Days</option>
                        <option value="<30">Less than 30 Days</option>
                        <option value="30+">30+ Days</option>
                    </select>

                    <button
                        onClick={() =>
                            setFilters({
                                status: "",
                                experience: "",
                                noticePeriod: "",
                            })
                        }
                        className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer bg-transparent border-none"
                    >
                        Clear Filters
                    </button>
                </div>

                {job && (
                    <div className="p-1.5">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2.5 justify-center text-[22px] font-normal text-[#171A1F]">
                                <img src={JobDescription} alt="" />
                                <span className="font-semibold text-xl">
                                    Job Details
                                </span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/client/get-resumes/compare/${id}`,
                                        )
                                    }
                                    disabled={compareList.length < 2}
                                    title={
                                        compareList.length < 2
                                            ? "Select at least 2 applications to compare"
                                            : "Click to compare selected applications"
                                    }
                                    className={`bg-[#1681FF] rounded-md h-10 px-4 py-1.5 text-white border-none ${
                                        compareList.length < 2
                                            ? "cursor-not-allowed opacity-60"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    Compare List
                                    {compareList.length > 0 && (
                                        <span className="absolute -top-[5px] -right-[5px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                            {compareList.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mt-2.5 flex gap-5">
                            <span className="flex items-center gap-2.5 text-sm font-bold text-[#282E38]">
                                <img src={Note} alt="" /> {job.ctc}
                            </span>
                            <span className="flex items-center gap-2.5 text-sm font-bold text-[#282E38]">
                                <img
                                    src={Bag}
                                    alt=""
                                    className="h-7 w-7 text-black"
                                />{" "}
                                {job.job_title}
                            </span>
                            <Tag
                                color={
                                    job.location_status === "opened"
                                        ? "green"
                                        : "red"
                                }
                            >
                                {job.location_status}
                            </Tag>
                        </div>
                        <div className="mt-2.5 w-4/5 text-[#6E7787] text-sm font-normal">
                            <span
                                className="line-clamp-3 overflow-hidden text-ellipsis"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        job?.job_description,
                                    ),
                                }}
                            ></span>

                            {job?.job_description?.length > 0 && (
                                <div className="mt-2">
                                    <button
                                        onClick={() =>
                                            setDescriptionModalVisible(true)
                                        }
                                        className="bg-transparent border-none text-[#1890ff] cursor-pointer p-0"
                                    >
                                        View More
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-[#1681FF] text-[25px] font-semibold mt-[15px]">
                    {isReplacement ? "Replacement Profiles" : "Applications"}
                </div>

                <div className="mt-4 flex flex-wrap gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredData &&
                        filteredData?.map((item, index) => (
                            <ApplicationCard
                                key={index}
                                item={item}
                                handleCompareToggle={handleCompareToggle}
                                isCompared={compareList.includes(
                                    item.job_application.id,
                                )} // Check if in compare list
                            />
                        ))}
                    {filteredData.length === 0 && (
                        <div className="not-found">
                            <img src={NoCandidates} alt="No-candidates" />
                            <div className="text">
                                No Applications found matching criteria
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                title="Full Job Description"
                open={descriptionModalVisible}
                onCancel={() => setDescriptionModalVisible(false)}
                footer={null}
                width="80%"
            >
                <div>
                    <div>
                        <div
                            className="line-clamp-none"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                    job?.job_description,
                                ),
                            }}
                        ></div>
                    </div>
                </div>
            </Modal>
        </Main>
    );
};

export default Resumes;
