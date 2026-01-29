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

    const fetchAppDetails = async (draggedId) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/organization-applications/?application_id=${draggedId}`,
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
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-12">
                <div className="max-w-[1600px] mx-auto">
                    {/* Header Bridge */}
                    <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="space-y-4">
                            <Breadcrumb
                                separator={
                                    <span className="text-gray-300">/</span>
                                }
                                items={[
                                    {
                                        title: (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Assigned Jobs
                                            </span>
                                        ),
                                        href: "/recruiter/postings/opened",
                                    },
                                    {
                                        title: (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1681FF]">
                                                Send Profile
                                            </span>
                                        ),
                                    },
                                ]}
                            />
                        </div>

                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 min-w-full md:min-w-[300px]">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <SolutionOutlined className="text-xl" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Target Spec
                                </p>
                                <p className="text-[#071C50] font-black text-sm max-w-[180px] truncate">
                                    {job?.job_title || "N/A"}
                                </p>
                                <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    onClick={() => setJobModalVisible(true)}
                                    className="p-0 h-auto text-[#1681FF] text-[10px] font-black uppercase tracking-widest hover:text-blue-700"
                                >
                                    View Full JD
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Operational Panel */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="bg-white rounded-[48px] border border-gray-100 shadow-xl overflow-hidden p-6 md:p-10 animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        {/* Ingestion Zone */}
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`flex-1 min-h-[300px] rounded-[40px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 group cursor-copy ${
                                                isDragging
                                                    ? "bg-blue-50 border-[#1681FF] scale-[0.98]"
                                                    : "bg-gray-50 border-gray-100 hover:border-blue-200 hover:bg-white"
                                            }`}
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <CloudUploadOutlined className="text-3xl text-gray-300 group-hover:text-[#1681FF]" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-black text-[#071C50] tracking-tight mb-2 uppercase">
                                                    Upload Resume
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                                    Drag from Resume Bank <br />
                                                    or Choose local Candidate
                                                </p>
                                            </div>

                                            <div className="mt-8">
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
                                                                    originFileObj:
                                                                        file,
                                                                },
                                                            ]);
                                                        }, 800);
                                                    }}
                                                    showUploadList={false}
                                                >
                                                    <Button
                                                        icon={
                                                            <UploadOutlined />
                                                        }
                                                        disabled={
                                                            uploading ||
                                                            jobStatus ===
                                                                "closed"
                                                        }
                                                        className="h-12 px-8 rounded-xl bg-white border-gray-100 text-[#071C50] font-black text-[10px] uppercase tracking-widest shadow-sm hover:border-blue-500 hover:text-blue-500"
                                                    >
                                                        {uploading
                                                            ? "Transferring..."
                                                            : "Manual Upload"}
                                                    </Button>
                                                </Upload>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="md:w-64 flex flex-col justify-center space-y-4">
                                            {fileList.length > 0 && (
                                                <div className=" p-6 rounded-[32px] bg-blue-50 text-black border-2 border-blue-200 space-y-4 shadow-xl shadow-blue-900/20 animate-in zoom-in-95">
                                                    <div className="flex items-center gap-3">
                                                        <FilePdfOutlined className="text-xl" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                                            {fileList[0].name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Button
                                                            type="text"
                                                            href={
                                                                fileList[0]
                                                                    .url ||
                                                                (fileList[0]
                                                                    .originFileObj
                                                                    ? URL.createObjectURL(
                                                                          fileList[0]
                                                                              .originFileObj,
                                                                      )
                                                                    : "#")
                                                            }
                                                            target="_blank"
                                                            className="text-white hover:text-blue-200 text-[9px] uppercase font-sans font-bold p-0 h-auto underline"
                                                        >
                                                            Verify
                                                        </Button>
                                                        <Button
                                                            type="text"
                                                            onClick={() => {
                                                                setFileList([]);
                                                                setResume(null);
                                                            }}
                                                            className="text-white/60 hover:text-red-400 text-[9px] font-black uppercase p-0 h-auto"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                disabled={
                                                    !resume ||
                                                    jobStatus === "closed"
                                                }
                                                loading={scoreLoading}
                                                onClick={generateResumeScore}
                                                className="h-14 rounded-2xl bg-[#FB8F44] border-none text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-900/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                                            >
                                                Diagnostic Score
                                            </Button>

                                            <Button
                                                onClick={generateQandA}
                                                loading={QandALoading}
                                                className="h-14 rounded-2xl bg-[#1681FF] border-none text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Generate Q/A
                                            </Button>

                                            <Button
                                                onClick={() =>
                                                    setAddApplication(true)
                                                }
                                                disabled={
                                                    !resume ||
                                                    jobStatus === "closed"
                                                }
                                                className="h-16 rounded-2xl bg-green-500 border-none text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-green-900/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Placeholder */}
                        </div>

                        {/* Resume Bank Pane */}
                        <div className="lg:col-span-5 bg-white rounded-[48px] border border-gray-100 shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-8 duration-1000">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1681FF] flex items-center justify-center">
                                        <SolutionOutlined />
                                    </div>
                                    <h3 className="text-lg font-black text-[#071C50] uppercase tracking-tighter m-0">
                                        Resume Bank
                                    </h3>
                                </div>
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {filteredData.length} Candidates
                                </span>
                            </div>

                            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
                                {/* Search Bridge */}
                                <div className="relative group">
                                    <SearchOutlined className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1681FF] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Scan Registry"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full h-14 pl-14 pr-14 bg-gray-50 border-none rounded-2xl font-bold text-sm text-[#071C50] focus:ring-2 ring-blue-100 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-4">
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
                                            className="group bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-grab active:cursor-grabbing"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-[#071C50] flex items-center justify-center font-black group-hover:bg-[#071C50] group-hover:text-white transition-all">
                                                        {
                                                            candidate
                                                                .candidate_name?.[0]
                                                        }
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-[#071C50] m-0 group-hover:text-[#1681FF] transition-colors">
                                                            {
                                                                candidate.candidate_name
                                                            }
                                                        </h4>
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5 truncate max-w-[150px]">
                                                            {
                                                                candidate.job_title
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="text"
                                                    onClick={() =>
                                                        fetchCandidateDetails(
                                                            candidate.application_id,
                                                        )
                                                    }
                                                    className="h-10 px-4 rounded-xl text-gray-400 font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 hover:text-[#1681FF]"
                                                >
                                                    Info
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                                    Response:{" "}
                                                    {item.correct_answer}
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
                                        resumeScore?.overall_resume_score
                                            ?.score || 0,
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
                        //  job_id={id}
                        //     onFinish={() => setAddApplication(false)}
                        //     resumeFromParent={resume}
                        primary_skills={job?.primary_skills}
                        secondary_skills={job?.secondary_skills}
                        resume={resume}
                        setAddApplication={setAddApplication}
                        setResume={setResume}
                        setDraggedId={() => {}}
                    />
                </Modal>
            </div>
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
