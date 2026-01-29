import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import {
    message,
    Spin,
    Modal,
    Input,
    Button,
    Tag,
    Tooltip,
    Divider,
    Rate,
} from "antd";
import {
    EnvironmentOutlined,
    BankOutlined,
    DollarOutlined,
    TrophyOutlined,
    FileTextOutlined,
    CalendarOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    RocketOutlined,
    StarOutlined,
    InfoCircleOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const ViewResumeRecruiter = ({ id, job_id, onFinish }) => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState("");
    const [reason, setReason] = useState("");
    const [currentResumeId, setCurrentResumeId] = useState();
    const [primarySkills, setPrimarySkills] = useState([]);
    const [secondarySkills, setSecondarySkills] = useState([]);
    const [locationStatus, setLocationStatus] = useState("opened");

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/recruiter/incoming-applications/?job_id=${job_id}&application_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const resData = await response.json();
            if (resData.error) {
                message.error(resData.error);
            } else {
                setData(resData.data);
                setPrimarySkills(
                    resData.primary_skills.map((skill) => ({
                        ...skill,
                        rating: 0,
                    }))
                );
                setSecondarySkills(
                    resData.secondary_skills.map((skill) => ({
                        ...skill,
                        rating: 0,
                    }))
                );
                setLocationStatus(resData.location_status);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && id) fetchData();
    }, [token, id]);

    const openModal = (type, resumeId) => {
        setModalType(type);
        setCurrentResumeId(resumeId);
        setReason("");
    };

    const handleRatingChange = (type, index, value) => {
        if (type === "primary") {
            const updated = [...primarySkills];
            updated[index] = { ...updated[index], rating: value };
            setPrimarySkills(updated);
        } else {
            const updated = [...secondarySkills];
            updated[index] = { ...updated[index], rating: value };
            setSecondarySkills(updated);
        }
    };

    const allSkillsRated = () => {
        const allPrimaryRated = primarySkills.every(
            (skill) => skill.rating && skill.rating >= 1
        );
        const allSecondaryRated = secondarySkills.every(
            (skill) => skill.rating && skill.rating >= 1
        );
        return allPrimaryRated && allSecondaryRated;
    };

    const handleModalSubmit = async () => {
        setLoading(true);
        let url = "";
        let body = {};

        if (modalType === "accept") {
            url = `${apiurl}/recruiter/accept-incoming-applications/?id=${currentResumeId}`;
            const primaryRatings = primarySkills.map((skill) => ({
                skill_name: skill.skill_name,
                rating: skill.rating,
            }));
            const secondaryRatings = secondarySkills.map((skill) => ({
                skill_name: skill.skill_name,
                rating: skill.rating,
            }));
            body = {
                feedback: reason,
                round_num: 1,
                primary_skills: primaryRatings,
                secondary_skills: secondaryRatings,
            };
        } else if (modalType === "reject") {
            url = `${apiurl}/recruiter/reject-incoming-applications/?id=${currentResumeId}`;
            body = { feedback: reason };
        }

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const resData = await response.json();
            if (!response.ok) {
                message.error(resData.error || "An error occurred.");
            } else {
                message.success(resData.message);
                if (onFinish) onFinish();
                else window.location.reload();
            }
        } catch (e) {
            message.error(e.message);
        } finally {
            setLoading(false);
            setModalType("");
        }
    };

    return (
        <div className="p-6 md:p-10 bg-white rounded-3xl">
            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-4">
                    <Spin size="large" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                        Syncing Candidate Data...
                    </p>
                </div>
            ) : (
                data && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1681FF] to-[#0061D5] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100 uppercase">
                                    {data.candidate_name?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#071C50] tracking-tight">
                                        {data.candidate_name}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-wider">
                                            <CalendarOutlined />{" "}
                                            {data.date_of_birth ||
                                                "DOB Not Provided"}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                        <Tag
                                            color="blue"
                                            className="rounded-full px-3 py-0.5 border-none font-black text-[10px] uppercase tracking-widest bg-blue-50 text-[#1681FF]"
                                        >
                                            Processing Queue
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                            {data.resume && (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<FileTextOutlined />}
                                    href={`${apiurl}${data.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-14 px-8 rounded-2xl bg-[#001744] hover:bg-[#002b7a] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-50 border-none flex items-center gap-3"
                                >
                                    Detailed Resume
                                </Button>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                    <BankOutlined className="text-blue-400" />{" "}
                                    Current Firm
                                </p>
                                <p className="text-[#071C50] font-black text-sm truncate">
                                    {data.current_organization || "N/A"}
                                </p>
                            </div>
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                    <EnvironmentOutlined className="text-red-400" />{" "}
                                    Origin
                                </p>
                                <p className="text-[#071C50] font-black text-sm truncate">
                                    {data.current_job_location || "N/A"}
                                </p>
                            </div>
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                    <DollarOutlined className="text-green-400" />{" "}
                                    Remuneration
                                </p>
                                <p className="text-[#071C50] font-black text-sm truncate">
                                    {data.current_ctc
                                        ? `${data.current_ctc} LPA`
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 flex items-center gap-2">
                                    <TrophyOutlined className="text-amber-400" />{" "}
                                    Tenure
                                </p>
                                <p className="text-[#071C50] font-black text-sm truncate">
                                    {data.experience
                                        ? `${data.experience} years`
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Meta Details Row */}
                        <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50/50 flex flex-wrap gap-x-12 gap-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1681FF]">
                                    Expected CTC:
                                </span>
                                <span className="text-[#071C50] font-bold text-xs">
                                    {data.expected_ctc
                                        ? `${data.expected_ctc} LPA`
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1681FF]">
                                    Notice Period:
                                </span>
                                <span className="text-[#071C50] font-bold text-xs">
                                    {data.notice_period || "0"} Days
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#1681FF]">
                                    Specialization:
                                </span>
                                <span className="text-[#071C50] font-bold text-xs">
                                    {data.current_job_type || "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Description Section */}
                        {data.other_details && (
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Professional Summary / Notes
                                </h4>
                                <div className="p-6 bg-white rounded-3xl border border-gray-100 text-gray-600 text-sm leading-relaxed italic">
                                    " {data.other_details} "
                                </div>
                            </div>
                        )}

                        {/* Final Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                size="large"
                                onClick={() => openModal("reject", id)}
                                icon={<CloseCircleOutlined />}
                                className="h-14 px-10 rounded-2xl border-none bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                Reject Candidate
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                disabled={locationStatus === "closed"}
                                onClick={() => openModal("accept", id)}
                                icon={<CheckCircleOutlined />}
                                className={`h-14 px-12 rounded-2xl ${
                                    locationStatus === "closed"
                                        ? "bg-gray-200"
                                        : "bg-[#1681FF] hover:bg-[#0061D5] shadow-xl shadow-blue-100"
                                } font-black text-[10px] uppercase tracking-widest border-none transition-all flex items-center gap-2`}
                            >
                                Mark for Next Round
                            </Button>
                        </div>

                        {/* Decision Modal */}
                        <Modal
                            title={null}
                            open={!!modalType}
                            onOk={handleModalSubmit}
                            onCancel={() => setModalType("")}
                            footer={null}
                            width={600}
                            centered
                            className="modal-no-padding overflow-hidden"
                        >
                            <div className="flex flex-col">
                                {/* Modal Header */}
                                <div
                                    className={`p-8 ${
                                        modalType === "reject"
                                            ? "bg-red-500"
                                            : "bg-[#1681FF]"
                                    } text-white`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        {modalType === "reject" ? (
                                            <WarningOutlined className="text-2xl" />
                                        ) : (
                                            <RocketOutlined className="text-2xl" />
                                        )}
                                        <h3 className="text-2xl font-black tracking-tight text-white mb-0">
                                            {modalType === "reject"
                                                ? "Confirmation Required"
                                                : "Candidate Assessment"}
                                        </h3>
                                    </div>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                                        {modalType === "reject"
                                            ? "State the reason for non-selection"
                                            : "Perform skill-based evaluation"}
                                    </p>
                                </div>

                                <div className="p-8 space-y-8 bg-white max-h-[60vh] overflow-y-auto sidebar-scroll">
                                    {modalType === "reject" ? (
                                        <div className="space-y-4">
                                            <p className="text-gray-500 font-medium italic text-sm">
                                                Please provide a brief
                                                justification for rejecting{" "}
                                                <strong>
                                                    {data.candidate_name}
                                                </strong>
                                                . This feedback may be used for
                                                internal records.
                                            </p>
                                            <Input.TextArea
                                                rows={6}
                                                value={reason}
                                                onChange={(e) =>
                                                    setReason(e.target.value)
                                                }
                                                placeholder="Example: Experience mismatch, expected CTC exceeds budget, etc."
                                                className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white h-32 transition-all p-4"
                                                required
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                                <InfoCircleOutlined className="text-[#1681FF] text-xl" />
                                                <p className="text-xs text-blue-700 font-medium">
                                                    Evaluate the candidate on
                                                    the required tech stack. A
                                                    rating of 4 or higher is
                                                    recommended for approval.
                                                </p>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] mb-4 border-b border-blue-50 pb-2">
                                                        Primary Core
                                                        Competencies
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {primarySkills.map(
                                                            (skill, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between items-center group"
                                                                >
                                                                    <span className="text-[#071C50] font-bold text-sm">
                                                                        {
                                                                            skill.skill_name
                                                                        }
                                                                    </span>
                                                                    <Rate
                                                                        count={
                                                                            10
                                                                        }
                                                                        value={
                                                                            skill.rating
                                                                        }
                                                                        onChange={(
                                                                            val
                                                                        ) =>
                                                                            handleRatingChange(
                                                                                "primary",
                                                                                idx,
                                                                                val
                                                                            )
                                                                        }
                                                                        className="text-[#1681FF] text-sm"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-gray-50 pb-2">
                                                        Secondary Qualifications
                                                    </h4>
                                                    <div className="space-y-4">
                                                        {secondarySkills.map(
                                                            (skill, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex justify-between items-center group"
                                                                >
                                                                    <span className="text-gray-500 font-bold text-sm">
                                                                        {
                                                                            skill.skill_name
                                                                        }
                                                                    </span>
                                                                    <Rate
                                                                        count={
                                                                            10
                                                                        }
                                                                        value={
                                                                            skill.rating
                                                                        }
                                                                        onChange={(
                                                                            val
                                                                        ) =>
                                                                            handleRatingChange(
                                                                                "secondary",
                                                                                idx,
                                                                                val
                                                                            )
                                                                        }
                                                                        className="text-gray-300 group-hover:text-[#1681FF] transition-colors text-sm"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    Additional Feedback
                                                    (Optional)
                                                </h4>
                                                <Input.TextArea
                                                    rows={3}
                                                    value={reason}
                                                    onChange={(e) =>
                                                        setReason(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Any standout qualities or concerns?"
                                                    className="rounded-xl border-gray-100 bg-gray-50 p-3 text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                    <Button
                                        onClick={() => setModalType("")}
                                        className="h-12 px-8 rounded-2xl font-bold text-gray-400 border-none hover:bg-gray-100 uppercase text-[10px] tracking-widest"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        loading={loading}
                                        disabled={
                                            modalType === "accept" &&
                                            !allSkillsRated()
                                        }
                                        onClick={handleModalSubmit}
                                        className={`h-12 px-10 rounded-2xl ${
                                            modalType === "reject"
                                                ? "bg-red-500 hover:bg-red-600 shadow-red-100"
                                                : "bg-[#1681FF] hover:bg-[#0061D5] shadow-blue-100"
                                        } font-black text-[10px] uppercase tracking-widest border-none transition-all shadow-lg flex items-center gap-2`}
                                    >
                                        {modalType === "reject"
                                            ? "Confirm Rejection"
                                            : "Submit Evaluation"}
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )
            )}
        </div>
    );
};

export default ViewResumeRecruiter;
