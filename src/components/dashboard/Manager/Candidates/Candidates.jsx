import React, { useEffect, useState } from "react";
import Main from "../Layout";
// import "./Candidates.css";
import searchicon from "../../../../images/agency/job-postings/searchicon.svg";
import { message, Select, Tag, Table, Input, Modal } from "antd";
import { useAuth } from "../../../common/useAuth";
import { CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../common/Goback";
const Candidates = () => {
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();
    const [jobTitles, setJobTitles] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [candidatesApplications, setCandidatesApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCandidatesApplications();
    }, [token]);

    useEffect(() => {
        filterCandidates();
    }, [searchQuery, selectedJobs, candidatesApplications]);

    const fetchCandidatesApplications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manger/applications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok)
                throw new Error("Failed to fetch job applications.");

            const data = await response.json();
            console.log("data", data.job_titles);
            setJobTitles(data.job_titles || []);
            setCandidatesApplications(data.applications_list || []);
        } catch (err) {
            message.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    console.log(
        jobTitles.map((obj) => {
            return obj.job_id;
        }),
    );

    jobTitles.map((obj) => {
        console.log(obj.job_id);
    });

    const handleJobTitleChange = (values) => {
        console.log("values", values);

        setSelectedJobs(values);
    };

    console.log("jobTitles", jobTitles);
    const removeSelectedJob = (jobTitle) => {
        setSelectedJobs(selectedJobs.filter((job) => job !== jobTitle));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    console.log(candidatesApplications);

    console.log("selectedJobs", selectedJobs);

    const filterCandidates = () => {
        let filtered = candidatesApplications.filter((app) => {
            console.log("app", app);
            console.log(
                "typeof app.job_id:",
                typeof app.job_id,
                "value:",
                app.job_id,
            );
            console.log("selectedJobs", selectedJobs);

            // Adjust if job_id is nested like app.job.id
            const jobId = app.job_id ?? app.job?.id;

            const jobMatches =
                selectedJobs.length === 0 || selectedJobs.includes(jobId);

            const nameMatches = app.candidate_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const jobTitleMatches = app.job_title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            return jobMatches && (nameMatches || jobTitleMatches);
        });
        setFilteredCandidates(filtered);
    };

    // const handleDeleteSelected = async () => {
    //   if (selectedRowKeys.length === 0) return;

    //   try {
    //     const response = await fetch(`${apiurl}/manger/applications/`, {
    //       method: "DELETE",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: JSON.stringify({ application_ids: selectedRowKeys }),
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to delete selected applications.");
    //     }

    //     message.success("Selected candidates deleted successfully.");

    //     // After successful deletion, remove them from state
    //     const remaining = filteredCandidates.filter(
    //       (candidate) => !selectedRowKeys.includes(candidate.application_id)
    //     );

    // setFilteredCandidates(remaining);
    // setCandidatesApplications((prev) =>
    //   prev.filter((candidate) => !selectedRowKeys.includes(candidate.application_id))
    // );

    //     setSelectedRowKeys([]);
    //   } catch (err) {
    //     message.error(err.message);
    //   }
    // };

    const columns = [
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Application ID",
            dataIndex: "application_id",
            key: "application_id",
        },

        {
            title: "Application Status",
            dataIndex: "application_status",
            key: "application_status",
            render: (text, record) => {
                if (text.toLowerCase() === "rejected") {
                    return (
                        <>
                            <span style={{ color: "red" }}>{text}</span>{" "}
                            <EyeOutlined
                                style={{ cursor: "pointer", color: "#1890ff" }}
                                onClick={() => {
                                    setShowReasonModal(true);
                                    setReason(record?.feedback);
                                }}
                            />
                        </>
                    );
                }
                return <span>{text}</span>;
            },
        },
    ];

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: (newSelectedRowKeys) => {
    //     setSelectedRowKeys(newSelectedRowKeys);
    //   },
    //   getCheckboxProps: (record) => ({
    //     name: record.candidate_name,
    //   }),
    // };

    return (
        <Main defaultSelectedKey="9">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    <div className="w-full p-2 md:pl-6 md:w-[94%]">
                        <div className="-ml-8 mt-2">
                            <GoBack />
                        </div>
                        <h2 className="text-xl font-bold mb-4">Candidates</h2>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 md:h-20 md:px-5 mb-5 rounded-lg shadow-sm gap-4 h-auto">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2.5 w-full md:w-auto">
                                <span className="font-semibold text-gray-700">
                                    Job Title
                                </span>
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    placeholder="Select Job Titles"
                                    onChange={handleJobTitleChange}
                                    value={selectedJobs}
                                    maxTagCount={1}
                                    showArrow={true}
                                    className="custom-select w-full md:w-[260px]"
                                >
                                    {jobTitles.map((job, index) => (
                                        <Select.Option
                                            value={job.job_id}
                                            key={index}
                                        >
                                            {job.job_title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="flex items-center px-2.5 bg-[#1681FF] rounded-lg h-[40px] w-full md:w-auto">
                                    <img
                                        src={searchicon}
                                        alt="Search"
                                        className="w-5 h-5 mr-2"
                                    />
                                    <Input
                                        className="bg-transparent border-none outline-none text-white placeholder:text-white/80 h-full w-full md:w-[200px]"
                                        placeholder="Search Candidates"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col p-5 bg-white rounded-lg shadow-sm">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedJobs.map((jobId) => {
                                    const job = jobTitles.find(
                                        (j) => j.job_id === jobId,
                                    );
                                    return (
                                        <Tag
                                            key={jobId}
                                            closable
                                            onClose={() =>
                                                removeSelectedJob(jobId)
                                            }
                                            className="m-1.5 px-3 py-1 rounded-full border-[#E8618C] text-[#E8618C] bg-white font-semibold text-xs transition-all hover:bg-[#E8618C] hover:text-white"
                                        >
                                            {job ? job.job_title : jobId}
                                        </Tag>
                                    );
                                })}
                            </div>
                            <div className="w-full">
                                <Table
                                    columns={columns}
                                    dataSource={filteredCandidates}
                                    rowKey="application_id"
                                    bordered
                                    pagination={{ pageSize: 8 }}
                                    className="custom-ant-table"
                                    scroll={{ x: 800 }}
                                />
                            </div>
                        </div>
                    </div>
                    <Modal
                        title="Rejection Reason"
                        open={showReasonModal}
                        onCancel={() => setShowReasonModal(false)}
                        footer={null}
                    >
                        <p>{reason || "No reason provided."}</p>
                    </Modal>
                </>
            )}
        </Main>
    );
};

export default Candidates;
