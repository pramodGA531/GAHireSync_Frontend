import React, { useState, useEffect } from "react";
import {
    message,
    Modal,
    Upload,
    List,
    Button,
    Typography,
    Breadcrumb,
    Divider,
    Tag,
    Input,
    Spin,
    Tooltip,
} from "antd";
import {
    UploadOutlined,
    EyeOutlined,
    CloudUploadOutlined,
    SolutionOutlined,
    FilePdfOutlined,
    CheckCircleOutlined,
    SearchOutlined,
    FilterOutlined,
    GlobalOutlined,
    RocketOutlined,
    QrcodeOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import ViewJobPost from "../../../common/ViewJobPost";
import Main from "../Layout";
import ResumeScoreCard from "../Scorecard/ResumeScoreCard";
import UploadData from "../AddingCandidates/UploadData";
import Pageloading from "../../../common/loading/Pageloading";
import CandidateDetailsDrawer from "./SideDrawer";
import GoBack from "../../../common/Goback";

const SendApplication = () => {
    const navigate = useNavigate();
    const [jobModalVisible, setJobModalVisible] = useState(false);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const { apiurl, token } = useAuth();
    const [fileList, setFileList] = useState([]);

    const [job, setJob] = useState(null);
    const [interviewers, setInterviewers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [resumes, setResumes] = useState(0);
    const [openQandA, setOpenQandA] = useState(false);
    const [QandALoading, setQandALoading] = useState(false);
    const [openResumeScore, setOpenResumeScore] = useState(false);
    const [resumeScore, setResumeScore] = useState(null);
    const [resume, setResume] = useState(null);
    const [scoreLoading, setScoreLoading] = useState(false);
    const [addApplication, setAddApplication] = useState(false);
    const [QandA, setQandA] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [jobStatus, setJobStatus] = useState("opened");
    const [canAddNew, setCanAddNew] = useState(true);
    const [candidateData, setCandidateData] = useState(null);
    const [viewCandidateModal, setViewCandidateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [sendQuestionsLoading, setSendQuestionsLoading] = useState(false);
    const [draggedId, setDraggedId] = useState(null);

    // AI Profile Search States
    const [fetchedSkills, setFetchedSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [customSkill, setCustomSkill] = useState("");
    const [loadingAiSearch, setLoadingAiSearch] = useState(false);
    const [aiSearchResults, setAiSearchResults] = useState(null);
    const [aiSearchTerm, setAiSearchTerm] = useState("");
    const [suggestedSkills, setSuggestedSkills] = useState([]);

    const handleGenerateSkills = async () => {
        setLoadingSkills(true);
        try {
            const response = await fetch(`${apiurl}/ai/generate-skills/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jobRole: aiSearchTerm,
                    job_id: id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setFetchedSkills(data.skills || []);
                message.success("Skills extracted from JD successfully!");
            } else {
                message.error(data.error || "Failed to extract skills.");
            }
        } catch (error) {
            message.error("System error.");
        } finally {
            setLoadingSkills(false);
        }
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim() && !fetchedSkills.includes(customSkill.trim())) {
            setFetchedSkills([...fetchedSkills, customSkill.trim()]);
            setCustomSkill("");
        }
    };

    const handleAiSearch = async () => {
        if (fetchedSkills.length === 0) {
            message.error(
                "Please ensure there are skills specified for matching.",
            );
            return;
        }
        setLoadingAiSearch(true);
        try {
            const response = await fetch(`${apiurl}/candidates/ai-search/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    requiredSkills: fetchedSkills,
                    job_id: id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setAiSearchResults(data.results || []);

                // Handle AI Rectified Skills (Auto-correction)
                if (data.rectified_skills && data.rectified_skills.length > 0) {
                    setFetchedSkills(data.rectified_skills);
                }

                // Handle AI Suggested Skills
                setSuggestedSkills(data.suggested_skills || []);

                message.success("Matches calculated successfully!");
            } else {
                message.error(data.error || "Failed finding matches.");
            }
        } catch (error) {
            message.error("System error during match.");
        } finally {
            setLoadingAiSearch(false);
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFetchedSkills(fetchedSkills.filter((s) => s !== skillToRemove));
    };

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/job-details/recruiter/${id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setJob(data.jd);
            setInterviewers(data.jd.interview_details || []);
            setSummary(data.summary || null);
            setResumes(data.count || 0);
            setJobStatus(data.job_status);
            setCanAddNew(data.can_add_new);
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/recruiter/organization-applications/?job_id=${id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                setApplications(data.results || []);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchJobDetails();
            fetchApplicationDetails();
        }
    }, [id]);

    const generateResumeScore = async () => {
        if (!resume) {
            message.error("Please upload the resume first!");
            return;
        }
        setScoreLoading(true);
        const formData = new FormData();
        formData.append("resume", resume);

        try {
            const response = await fetch(`${apiurl}/analyse-resume/${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                let jsonData =
                    typeof data === "string" ? JSON.parse(data) : data;
                setResumeScore(jsonData);
                setOpenResumeScore(true);
            }
        } catch (error) {
            console.error("Error generating resume score:", error);
        } finally {
            setScoreLoading(false);
        }
    };

    const generateQandA = async () => {
        if (QandA !== null) {
            setOpenQandA(true);
            return;
        }
        try {
            setQandALoading(true);
            const response = await fetch(
                `${apiurl}/generatequestionary/${id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                setQandA(data);
                setOpenQandA(true);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setQandALoading(false);
        }
    };

    const handleSendQuestions = async () => {
        if (!QandA || QandA.length === 0) {
            message.error("No questions generated to send.");
            return;
        }
        setSendQuestionsLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/recruiter/send-questions/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ questions: QandA }),
                },
            );
            const data = await response.json();
            if (response.ok) {
                message.success(
                    data.message ||
                        "Questions sent to interviewers successfully.",
                );
                setOpenQandA(false);
            } else {
                message.error(data.detail || "Failed to send questions.");
            }
        } catch (error) {
            console.error("Error sending questions:", error);
            message.error("System error while sending questions.");
        } finally {
            setSendQuestionsLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const data = e.dataTransfer.getData("application/json");

        if (data) {
            const droppedCandidate = JSON.parse(data);
            fetchAppDetails(droppedCandidate.application_id);
        }
    };

    const fetchAppDetails = async (draggedIdInput) => {
        setDraggedId(draggedIdInput);
        try {
            const response = await fetch(
                `${apiurl}/recruiter/organization-applications/?application_id=${draggedIdInput}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();

            if (data.error) {
                message.error(data.error);
            } else if (data.resume) {
                const resumeUrl = `${apiurl}/${data.resume}`;
                const resumeName = data.resume.split("/").pop();

                const fileBlob = await fetch(resumeUrl).then((res) =>
                    res.blob(),
                );
                const file = new File([fileBlob], resumeName, {
                    type: fileBlob.type,
                });

                const uploadObj = {
                    uid: "-1",
                    name: resumeName,
                    status: "done",
                    originFileObj: file,
                    url: resumeUrl,
                };

                message.success(
                    `${file.name} synced from registry successfully.`,
                );
                setFileList([uploadObj]);
                setResume(file);
                // setAddApplication(true);
            }
        } catch (e) {
            console.error("Error fetching application details:", e);
        }
    };

    const fetchCandidateDetails = async (selectedId) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/candidate/complete/?application_id=${selectedId}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.data) {
                setCandidateData(data.data);
                setViewCandidateModal(true);
            }
        } catch (e) {
            message.error("Unable to fetch the candidate data");
        }
    };

    const filteredData = applications.filter(
        (cand) =>
            cand.candidate_name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            cand.job_title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Main defaultSelectedKey={2} defaultSelectedChildKey="2-1">
            <div className="mt-4 ml-10 -mb-4">
                <Breadcrumb
                    className="m-2"
                    items={[
                        {
                            title: (
                                <span
                                    onClick={() => navigate(-1)}
                                    className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    Assigned Jobs
                                </span>
                            ),
                        },
                        {
                            title: (
                                <span className="text-gray-600 font-medium">
                                    Send Profile
                                </span>
                            ),
                        },
                    ]}
                />
            </div>

            <div className="min-h-screen p-4 md:p-8 font-['Inter',_sans-serif]">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="m-2">
                            <h1 className="text-2xl font-bold text-gray-900 m-0">
                                Candidate Selection
                            </h1>
                        </div>

                        <div className="flex items-center gap-4  p-3 rounded-lg border border-blue-100">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                <SolutionOutlined className="text-lg" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-blue-600 mb-0.5">
                                    Current Job Role
                                </p>
                                <p className="text-gray-900 font-bold text-sm m-0">
                                    {job?.job_title || "Loading..."}
                                </p>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => setJobModalVisible(true)}
                                    className="p-0 h-auto text-blue-500 font-medium text-xs mt-1 -ml-2 hover:text-blue-700"
                                >
                                    View Job Description
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Operational Panel */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Ingestion Zone */}
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`flex-1 min-h-[280px] rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 ${
                                            isDragging
                                                ? "bg-blue-50 border-blue-400 border-solid"
                                                : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-gray-50/50"
                                        }`}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                            <CloudUploadOutlined className="text-2xl text-blue-600" />
                                        </div>
                                        <div className="text-center mb-6">
                                            <h3 className="text-base font-bold text-gray-800 mb-1">
                                                Add Candidate Resume
                                            </h3>
                                            <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                                                Drag a profile from the bank or
                                                click to upload a local file
                                            </p>
                                        </div>

                                        <Upload
                                            accept=".pdf,.doc,.docx"
                                            fileList={fileList}
                                            beforeUpload={(f) => {
                                                const isAccepted = [
                                                    "application/pdf",
                                                    "application/msword",
                                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                ].includes(f.type);
                                                if (!isAccepted)
                                                    message.error(
                                                        "Invalid format.",
                                                    );
                                                return isAccepted;
                                            }}
                                            customRequest={({
                                                file,
                                                onSuccess,
                                            }) => {
                                                setUploading(true);
                                                setTimeout(() => {
                                                    setUploading(false);
                                                    onSuccess("ok");
                                                    setResume(file);
                                                    setFileList([
                                                        {
                                                            uid: "-1",
                                                            name: file.name,
                                                            status: "done",
                                                            originFileObj: file,
                                                        },
                                                    ]);
                                                }, 800);
                                            }}
                                            showUploadList={false}
                                        >
                                            <Button
                                                type="primary"
                                                icon={<UploadOutlined />}
                                                disabled={
                                                    uploading ||
                                                    jobStatus === "closed"
                                                }
                                                className="h-10 px-6 rounded-lg font-semibold"
                                            >
                                                {uploading
                                                    ? "Uploading..."
                                                    : "Browse Files"}
                                            </Button>
                                        </Upload>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:w-64 flex flex-col gap-3 justify-center">
                                        {fileList.length > 0 && (
                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <FilePdfOutlined className="text-red-500 shrink-0" />
                                                    <span className="text-xs font-semibold text-gray-700 truncate">
                                                        {fileList[0].name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        href={
                                                            fileList[0].url ||
                                                            (fileList[0]
                                                                .originFileObj
                                                                ? URL.createObjectURL(
                                                                      fileList[0]
                                                                          .originFileObj,
                                                                  )
                                                                : "#")
                                                        }
                                                        target="_blank"
                                                        className="p-0 text-blue-600 hover:text-blue-800 underline text-xs font-medium"
                                                    >
                                                        Review
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        danger
                                                        onClick={() => {
                                                            setFileList([]);
                                                            setResume(null);
                                                        }}
                                                        className="p-0 text-xs font-medium"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <Button
                                                block
                                                disabled={
                                                    !resume ||
                                                    jobStatus === "closed"
                                                }
                                                loading={scoreLoading}
                                                onClick={generateResumeScore}
                                                className="h-11 rounded-lg border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 font-semibold"
                                            >
                                                Scan Resume
                                            </Button>

                                            <Button
                                                block
                                                onClick={generateQandA}
                                                loading={QandALoading}
                                                className="h-11 rounded-lg border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 font-semibold"
                                            >
                                                Generate Questions
                                            </Button>

                                            <Button
                                                block
                                                type="primary"
                                                onClick={() =>
                                                    setAddApplication(true)
                                                }
                                                disabled={
                                                    !resume ||
                                                    jobStatus === "closed"
                                                }
                                                className="h-11 rounded-lg bg-green-600 hover:bg-green-700 border-none font-bold shadow-sm"
                                            >
                                                Finalize Submission
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resume Bank Pane */}
                        <div className=" mb-6 lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[345px]">
                            <div className="p-6 border-b border-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                            <SolutionOutlined />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 m-0">
                                            Candidate Registry
                                        </h3>
                                    </div>
                                    <Tag className="bg-gray-100 border-none px-2 rounded-full text-gray-500 font-medium text-[10px]">
                                        {filteredData.length} Total
                                    </Tag>
                                </div>
                                <div className="relative">
                                    <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                    <input
                                        type="text"
                                        placeholder="Quick search by name..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-400 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {filteredData.map((candidate) => (
                                    <div
                                        key={candidate.application_id}
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                                "application/json",
                                                JSON.stringify(candidate),
                                            )
                                        }
                                        className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-700 flex items-center justify-center font-bold shrink-0 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {
                                                        candidate
                                                            .candidate_name?.[0]
                                                    }
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="text-sm font-bold text-gray-900 m-0 truncate">
                                                        {
                                                            candidate.candidate_name
                                                        }
                                                    </h4>
                                                    <p className="text-[11px] text-gray-500 m-0 truncate">
                                                        {candidate.job_title}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="text"
                                                size="small"
                                                onClick={() =>
                                                    fetchCandidateDetails(
                                                        candidate.application_id,
                                                    )
                                                }
                                                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2"
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Search & Filters Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <SearchOutlined className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 m-0">
                                Smart Profile Search
                            </h3>
                            <p className="text-xs text-gray-500 m-0">
                                Search our database using automated skill
                                suggestions
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter job role (e.g. Frontend React Developer)"
                                        value={aiSearchTerm}
                                        onChange={(e) =>
                                            setAiSearchTerm(e.target.value)
                                        }
                                        className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm text-gray-800 focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:border-indigo-400 transition-all outline-none"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerateSkills}
                                    loading={loadingSkills}
                                    type="primary"
                                    className="h-12 mt-1.5 px-6 rounded-xl bg-indigo-600 flex items-center gap-2 font-bold transition-all shadow-sm"
                                >
                                    <GlobalOutlined />
                                    {loadingSkills
                                        ? "Extracting..."
                                        : "Extract Skills from JD"}
                                </Button>
                            </div>
                        </div>

                        {/* Skills Area */}
                        {fetchedSkills.length > 0 && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4 animate-in fade-in duration-300">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Selected Skills for Matching
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {fetchedSkills.map((specSkill, idx) => (
                                            <Tag
                                                key={idx}
                                                closable
                                                onClose={() =>
                                                    handleRemoveSkill(specSkill)
                                                }
                                                className="px-3 py-1.5 rounded-lg border border-indigo-100 bg-white text-indigo-700 font-semibold text-[11px] m-0"
                                            >
                                                {specSkill}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>

                                {suggestedSkills.length > 0 && (
                                    <div className="pt-2 border-t border-gray-200/50">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-1.5">
                                            <GlobalOutlined className="text-[10px]" />
                                            AI Suggested Additions
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedSkills
                                                .filter(
                                                    (s) =>
                                                        !fetchedSkills.includes(
                                                            s,
                                                        ),
                                                )
                                                .map((s, idx) => (
                                                    <Tag
                                                        key={idx}
                                                        onClick={() => {
                                                            if (
                                                                !fetchedSkills.includes(
                                                                    s,
                                                                )
                                                            ) {
                                                                setFetchedSkills(
                                                                    [
                                                                        ...fetchedSkills,
                                                                        s,
                                                                    ],
                                                                );
                                                            }
                                                        }}
                                                        className="px-3 py-1.5 rounded-lg border-dashed border-gray-300 bg-gray-50 text-gray-500 font-medium text-[10px] m-0 cursor-pointer hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1"
                                                    >
                                                        <span className="text-gray-400 text-xs">
                                                            +
                                                        </span>{" "}
                                                        {s}
                                                    </Tag>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <input
                                        type="text"
                                        placeholder="Add specific skill manually..."
                                        value={customSkill}
                                        onChange={(e) =>
                                            setCustomSkill(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleAddCustomSkill()
                                        }
                                        className="flex-1 h-11 px-4 bg-white border border-gray-200 rounded-xl font-medium text-sm text-gray-800 outline-none focus:border-indigo-300 transition-all"
                                    />
                                    <Button
                                        onClick={handleAiSearch}
                                        loading={loadingAiSearch}
                                        className="h-11 mt-1.5 px-8 rounded-xl bg-indigo-600 text-white border-none font-bold shadow-md hover:bg-indigo-700"
                                    >
                                        {loadingAiSearch
                                            ? "Searching..."
                                            : "Search Pool"}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setFetchedSkills([]);
                                            setSuggestedSkills([]);
                                            setAiSearchResults(null);
                                        }}
                                        className="h-11 mt-1.5 px-4 rounded-xl font-semibold text-gray-500 hover:text-red-500 transition-colors border-none bg-transparent"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        )}

                        {loadingAiSearch ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <Spin size="large" />
                                <p className="mt-4 text-gray-500 font-medium text-xs tracking-wide">
                                    Comparing profile signatures against
                                    requirements...
                                </p>
                            </div>
                        ) : aiSearchResults ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
                                {aiSearchResults.map((candidate) => (
                                    <div
                                        key={candidate.application_id}
                                        draggable
                                        onDragStart={(e) =>
                                            e.dataTransfer.setData(
                                                "application/json",
                                                JSON.stringify(candidate),
                                            )
                                        }
                                        className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-grab active:cursor-grabbing relative flex flex-col items-center text-center h-[280px]"
                                    >
                                        {candidate.match_percentage !==
                                            undefined && (
                                            <div
                                                className={`absolute top-2 right-2 py-0.5 px-2 rounded-lg font-bold text-[9px] uppercase tracking-wider ${
                                                    candidate.match_percentage >=
                                                    80
                                                        ? "bg-green-100 text-green-700"
                                                        : candidate.match_percentage >=
                                                            50
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {candidate.match_percentage}%
                                                Match
                                            </div>
                                        )}

                                        <div className="w-14 h-14 mb-4 rounded-xl bg-gray-50 text-indigo-600 flex items-center justify-center text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all border border-gray-100">
                                            {candidate.candidate_name?.[0]}
                                        </div>
                                        <div className="w-full">
                                            <h4 className="text-sm font-bold text-gray-900 m-0 truncate group-hover:text-indigo-600 transition-colors px-2">
                                                {candidate.candidate_name}
                                            </h4>
                                            <p className="text-[10px] font-medium text-gray-400 mt-1 mb-3 truncate px-2">
                                                {candidate.job_title}
                                            </p>
                                        </div>

                                        <div className="w-full flex-1 flex flex-col justify-center pb-4">
                                            {candidate.matched_skills &&
                                                candidate.matched_skills
                                                    .length > 0 && (
                                                    <div className="flex flex-wrap items-center justify-center gap-1.5 px-2">
                                                        {candidate.matched_skills
                                                            .slice(0, 3)
                                                            .map((skill, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 text-[8px] font-bold uppercase tracking-tight"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        {candidate
                                                            .matched_skills
                                                            .length > 3 && (
                                                            <span className="text-[8px] font-bold text-gray-400">
                                                                +
                                                                {candidate
                                                                    .matched_skills
                                                                    .length -
                                                                    3}{" "}
                                                                more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="flex gap-2 w-full mt-auto">
                                            <Button
                                                block
                                                onClick={() =>
                                                    fetchCandidateDetails(
                                                        candidate.application_id,
                                                    )
                                                }
                                                className="h-8 p-2 rounded-lg font-semibold text-[10px] text-gray-500"
                                            >
                                                View Profile
                                            </Button>
                                            <Button
                                                block
                                                type="primary"
                                                // size="small"
                                                onClick={() => {
                                                    fetchAppDetails(
                                                        candidate.application_id,
                                                    );
                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    });
                                                    message.success(
                                                        "Resume loaded for submission!",
                                                    );
                                                }}
                                                className="h-8 p-2 rounded-lg bg-indigo-600 font-bold text-[10px]"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {aiSearchResults.length === 0 && (
                                    <div className="col-span-full text-center py-10 text-gray-400 italic text-sm">
                                        No matching profiles found in the
                                        registry.
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            {/* Modals Bridge */}
            <Modal
                title={null}
                open={jobModalVisible}
                onCancel={() => setJobModalVisible(false)}
                footer={null}
                width={1000}
                style={{ maxWidth: "95vw" }}
                className="premium-modal-v2"
            >
                <ViewJobPost job={job} interviewers={interviewers} />
            </Modal>
            <Modal
                title={
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Diagnostic Q/A Registry
                    </span>
                }
                open={openQandA}
                onCancel={() => setOpenQandA(false)}
                footer={null}
                width={700}
                style={{ maxWidth: "95vw" }}
                className="premium-modal-v2"
            >
                <div className="p-4 space-y-6">
                    {QandA && QandA.length > 0 ? (
                        <>
                            <div className="space-y-6">
                                {QandA.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 space-y-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-12 h-8 rounded-lg bg-[#071C50] text-white flex items-center justify-center text-[11px] font-black uppercase">
                                                Q{index + 1}
                                            </span>
                                            <p className="text-sm font-bold text-[#071C50] m-0">
                                                {item.question_text}
                                            </p>
                                        </div>
                                        <div className="pl-8">
                                            <p className="text-xs text-gray-400 m-0 italic font-medium leading-relaxed">
                                                Response: {item.correct_answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button
                                    type="primary"
                                    onClick={handleSendQuestions}
                                    loading={sendQuestionsLoading}
                                    className="bg-[#071C50] h-10 px-6 rounded-xl hover:bg-blue-900"
                                >
                                    Send to Interviewers
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 opacity-30 italic">
                            No data available.
                        </div>
                    )}
                </div>
            </Modal>
            <Modal
                title={null}
                open={openResumeScore}
                onCancel={() => setOpenResumeScore(false)}
                footer={null}
                width={800}
                style={{ maxWidth: "95vw" }}
                centered
                className="premium-modal-v2"
            >
                <div className="p-4 space-y-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-[#071C50] tracking-tighter uppercase mb-2">
                            Diagnostic Report
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Alignment with Post Specifications
                        </p>
                    </div>

                    <div className="flex justify-center scale-110">
                        <ResumeScoreCard
                            score={parseInt(
                                String(
                                    resumeScore?.overall_resume_score?.score ||
                                        0,
                                ).match(/\d+/)?.[0] || 0,
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        {(resumeScore?.skills || []).map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:border-blue-100 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-2">
                                            {item.field_name}
                                        </p>
                                        <h4 className="text-lg font-black text-[#071C50] group-hover:text-[#1681FF] transition-colors">
                                            {item.score}
                                        </h4>
                                    </div>
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1681FF] flex items-center justify-center text-xs font-black">
                                        {idx + 1}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                                    {item.reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <CandidateDetailsDrawer
                open={viewCandidateModal}
                onClose={() => setViewCandidateModal(false)}
                candidateData={candidateData}
            />
            <Modal
                title={null}
                open={addApplication}
                onCancel={() => setAddApplication(false)}
                footer={null}
                width={1000}
                style={{ maxWidth: "95vw" }}
                className="premium-modal-v2 no-padding-modal"
            >
                <UploadData
                    primary_skills={job?.primary_skills}
                    secondary_skills={job?.secondary_skills}
                    resume={resume}
                    setAddApplication={setAddApplication}
                    setResume={setResume}
                    draggedId={draggedId}
                    setDraggedId={setDraggedId}
                />
            </Modal>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .premium-modal-v2 .ant-modal-content {
                    border-radius: 48px !important;
                    padding: 40px !important;
                }
                @media (max-width: 768px) {
                    .premium-modal-v2 .ant-modal-content {
                        padding: 24px !important;
                        border-radius: 32px !important;
                    }
                }
                .no-padding-modal .ant-modal-content {
                    padding: 0 !important;
                }
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </Main>
    );
};

export default SendApplication;
