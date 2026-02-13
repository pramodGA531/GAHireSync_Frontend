import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { message } from "antd";
import backicon from "../../../../images/agency/backbutton.svg";
import jobicon from "../../../../images/agency/jobicon.svg";
import searchicon from "../../../../images/agency/Search.svg";
import JobResponseCard from "../managercards/JobResponseCard";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Select, Breadcrumb } from "antd";

import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";

const JobResponses = () => {
    const { jobId, recruiterId } = useParams();
    const { apiurl, token } = useAuth();
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);
    const [applications, setApplications] = useState({
        pending: [],
        selected: [],
        rejected: [],
        processing: {},
    });

    const [filteredApplications, setFilteredApplications] = useState({
        pending: [],
        selected: [],
        rejected: [],
        processing: {},
    });

    const fetchData = async (url) => {
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setJobDetails(data.job_details || {});
            setApplications({
                pending: data.pending || [],
                selected: data.selected || [],
                rejected: data.rejected || [],
                hold: data.hold || [],
                processing: data.processing || {},
            });
            setFilteredApplications({
                pending: data.pending || [],
                selected: data.selected || [],
                rejected: data.rejected || [],
                hold: data.hold || [],
                processing: data.processing || {},
            });
            setLocations(data.locations);
        } catch (e) {
            message.error("Failed to fetch job responses.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const formatApplications = (location) => {
        if (location === "all") {
            setFilteredApplications(applications);
        } else {
            const filtered = {
                pending: applications.pending.filter(
                    (app) => app.location === location,
                ),
                selected: applications.selected.filter(
                    (app) => app.location === location,
                ),
                rejected: applications.rejected.filter(
                    (app) => app.location === location,
                ),
                hold:
                    applications.hold?.filter(
                        (app) => app.location === location,
                    ) || [],
                processing: {},
            };

            if (
                applications.processing &&
                typeof applications.processing === "object"
            ) {
                Object.entries(applications.processing).forEach(
                    ([round, apps]) => {
                        const matchedApps = apps.filter(
                            (app) => app.location === location,
                        );
                        filtered.processing[round] = matchedApps;
                        // if (matchedApps.length > 0) {
                        // }
                    },
                );
            }

            setFilteredApplications(filtered);
        }
    };

    useEffect(() => {
        if (token) {
            let url = `${apiurl}/view-applications/?job_id=${jobId}`;
            if (recruiterId) {
                url += `&recruiter_id=${recruiterId}`;
            }
            console.log(url);
            fetchData(url);
        }
    }, [token, jobId]);

    const renderJobCards = (list = []) =>
        list.length > 0 ? (
            list.map((item, index) => (
                <JobResponseCard key={index} data={item} />
            ))
        ) : (
            <p className="text-center text-gray-500 py-2.5 text-sm italic">
                No applications
            </p>
        );

    const navigate = useNavigate();

    return (
        <Main>
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="m-4">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <Link
                                    to="/agency/jobs"
                                    className="text-gray-400 text-sm"
                                >
                                    Job Posts
                                </Link>
                            ),
                        },
                        {
                            title: (
                                <span className="text-gray-800 text-sm">
                                    Job Responses
                                </span>
                            ),
                        },
                    ]}
                />
            </div>
            {loading ? (
                <Pageloading />
            ) : (
                <div className="flex flex-col w-full h-screen m-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2.5 flex-row items-center">
                            {/* <img
                                onClick={() => navigate(-1)}
                                style={{ cursor: "pointer" }}
                                src={backicon}
                                alt="back"
                            /> */}
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center gap-2.5">
                                    <h3 className="text-[#171A1F] text-[20px] font-semibold p-0 m-[6px]">
                                        {jobDetails.job_title || "Job Title"}
                                    </h3>
                                    <div
                                        style={{
                                            padding: "5px 15px",
                                            color: "#117B34",
                                            borderRadius: "10px",
                                            backgroundColor: "#EEFDF3",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {jobDetails.num_of_positions ||
                                            "number of positions"}{" "}
                                        job positions
                                    </div>
                                </div>
                                <div className="flex gap-2.5 text-[#565E6C] font-medium text-xs">
                                    <div className="flex gap-[5px] items-center">
                                        <img src={jobicon} alt="icon" />
                                        <span>
                                            {jobDetails.job_type || "Full Time"}
                                        </span>
                                    </div>
                                    <div className="flex gap-[5px] items-center">
                                        <img src={jobicon} alt="icon" />
                                        <span>
                                            {jobDetails.deadline || "Deadline"}
                                        </span>
                                    </div>
                                    <div className="flex gap-[5px] items-center">
                                        <img src={jobicon} alt="icon" />
                                        <span>
                                            {jobDetails.client_name || "Client"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[35px] w-[250px] flex border-none pl-[15px]">
                            <Select
                                placeholder="Select Location"
                                style={{ width: 200 }}
                                onChange={(value) => formatApplications(value)}
                            >
                                <Select.Option value="all">All</Select.Option>

                                {locations.map((loc) => (
                                    <Select.Option key={loc} value={loc}>
                                        {loc}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="mt-[50px] flex gap-2.5 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#BCC1CA] pb-4">
                        <div className="p-5 min-w-[250px] rounded-[16px] border border-[#BCC1CA] bg-white shadow-[1px_1px_2px_0px_rgba(23,26,31,0.12),0px_0px_1px_0px_rgba(23,26,31,0.07)] flex items-start flex-col gap-2.5 min-h-[70vh]">
                            <h3 className="text-[#323842] text-left font-semibold">
                                CV Review -{" "}
                                {filteredApplications?.pending?.length}
                            </h3>
                            {renderJobCards(filteredApplications.pending)}
                        </div>

                        {Object.entries(filteredApplications.processing).map(
                            ([round, applicants]) => (
                                <div
                                    key={round}
                                    className="p-5 min-w-[250px] rounded-[16px] border border-[#BCC1CA] bg-white shadow-[1px_1px_2px_0px_rgba(23,26,31,0.12),0px_0px_1px_0px_rgba(23,26,31,0.07)] flex items-start flex-col gap-2.5 min-h-[70vh]"
                                >
                                    <h3 className="text-[#323842] text-left font-semibold">
                                        {round.replace("round_", "")} Interview
                                        -{" "}
                                        {filteredApplications?.pending?.length}
                                    </h3>
                                    {renderJobCards(applicants)}
                                </div>
                            ),
                        )}

                        <div className="p-5 min-w-[250px] rounded-[16px] border border-[#BCC1CA] bg-white shadow-[1px_1px_2px_0px_rgba(23,26,31,0.12),0px_0px_1px_0px_rgba(23,26,31,0.07)] flex items-start flex-col gap-2.5 min-h-[70vh]">
                            <h3 className="text-[#323842] text-left font-semibold">
                                Hold - {filteredApplications?.hold?.length}
                            </h3>
                            {renderJobCards(filteredApplications.hold)}
                        </div>

                        <div className="p-5 min-w-[250px] rounded-[16px] border border-[#BCC1CA] bg-white shadow-[1px_1px_2px_0px_rgba(23,26,31,0.12),0px_0px_1px_0px_rgba(23,26,31,0.07)] flex items-start flex-col gap-2.5 min-h-[70vh]">
                            <h3 className="text-[#323842] text-left font-semibold">
                                Selected -{" "}
                                {filteredApplications?.selected?.length}
                            </h3>
                            {renderJobCards(filteredApplications.selected)}
                        </div>

                        <div className="p-5 min-w-[250px] rounded-[16px] border border-[#BCC1CA] bg-white shadow-[1px_1px_2px_0px_rgba(23,26,31,0.12),0px_0px_1px_0px_rgba(23,26,31,0.07)] flex items-start flex-col gap-2.5 min-h-[70vh]">
                            <h3 className="text-[#323842] text-left font-semibold">
                                Rejected -{" "}
                                {filteredApplications?.rejected?.length}
                            </h3>
                            {renderJobCards(filteredApplications.rejected)}
                        </div>
                    </div>
                </div>
            )}
        </Main>
    );
};

export default JobResponses;
