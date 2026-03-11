import React from "react";
import { Drawer, Tag, Divider, Avatar, Tooltip } from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    BankOutlined,
    SolutionOutlined,
    DollarOutlined,
    CalendarOutlined,
    FilePdfOutlined,
    CloseOutlined,
    GlobalOutlined,
    HistoryOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            {icon}
        </div>
        <h3 className="text-sm font-bold text-gray-800 m-0 uppercase tracking-wider">
            {title}
        </h3>
    </div>
);

const DetailCard = ({ icon, label, value, fullWidth = false }) => (
    <div
        className={`p-4 rounded-2xl bg-gray-50/50 border border-gray-100/80 hover:bg-white hover:border-indigo-200 transition-all duration-300 group ${fullWidth ? "col-span-full" : ""}`}
    >
        <div className="flex items-center gap-3 mb-1">
            <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                {icon}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {label}
            </span>
        </div>
        <div className="text-[13px] font-semibold text-gray-800 ml-7 break-words">
            {value || "Not provided"}
        </div>
    </div>
);

const CandidateDetailsDrawer = ({ open, onClose, candidateData }) => {
    const { apiurl } = useAuth();
    if (!candidateData) return null;

    const {
        candidate_name,
        candidate_email,
        contact,
        alternate_contact,
        candidate_resume,
        date_of_birth,
        current_job_location,
        current_organization,
        experience,
        currect_ctc,
        expected_ctc,
        applications_data = [],
    } = candidateData;

    return (
        <Drawer
            title={null}
            placement="right"
            width={650}
            onClose={onClose}
            open={open}
            className="modern-drawer"
            closeIcon={null}
            bodyStyle={{ padding: 0 }}
        >
            <div className="min-h-full bg-white font-['Inter',_sans-serif]">
                {/* Visual Header */}
                <div className="relative h-32 bg-gradient-to-r from-white via-blue-200 to-blue-400 p-8 flex items-end overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/20 group"
                    >
                        <CloseOutlined className="group-hover:rotate-90 transition-transform duration-300 text-red-800" />
                    </button>
                </div>

                {/* Profile Identity Bar */}
                <div className="px-8 -mt-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 mt-2">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl shadow-indigo-100">
                            <Avatar
                                shape="square"
                                size={84}
                                className="rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-3xl flex items-center justify-center"
                            >
                                {candidate_name?.[0]}
                            </Avatar>
                        </div>
                        <div className="mb-2 mt-4">
                            <h2 className="text-2xl mt-2 font-black text-gray-900 tracking-tight">
                                {candidate_name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                    Candidate Profile
                                </span>
                                {experience && (
                                    <span className="text-gray-400 text-xs font-medium">
                                        • {experience} Years Exp.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    {/* Basic Info Section */}
                    <section>
                        <SectionHeader
                            icon={<UserOutlined />}
                            title="Personal Intel"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailCard
                                icon={<MailOutlined className="text-xs" />}
                                label="Primary Email"
                                value={candidate_email}
                            />
                            <DetailCard
                                icon={<PhoneOutlined className="text-xs" />}
                                label="Contact Number"
                                value={contact}
                            />
                            <DetailCard
                                icon={
                                    <EnvironmentOutlined className="text-xs" />
                                }
                                label="Preferred Location"
                                value={current_job_location}
                            />
                            <DetailCard
                                icon={<CalendarOutlined className="text-xs" />}
                                label="Availability / DOB"
                                value={date_of_birth}
                            />
                        </div>
                    </section>

                    {/* Career Section */}
                    <section>
                        <SectionHeader
                            icon={<BankOutlined />}
                            title="Professional Status"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <DetailCard
                                icon={<BankOutlined className="text-xs" />}
                                label="Recent Organization"
                                value={current_organization}
                                fullWidth
                            />
                            <DetailCard
                                icon={<DollarOutlined className="text-xs" />}
                                label="Current Package"
                                value={
                                    currect_ctc ? `${currect_ctc} LPA` : null
                                }
                            />
                            <DetailCard
                                icon={
                                    <ArrowRightOutlined className="text-xs" />
                                }
                                label="Expected Annual"
                                value={
                                    expected_ctc ? `${expected_ctc} LPA` : null
                                }
                            />
                        </div>
                    </section>

                    {/* Resume Section */}
                    <section>
                        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 p-6 rounded-3xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <FilePdfOutlined className="text-6xl" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h4 className="text-lg font-bold m-0 flex items-center gap-2">
                                        Candidate Curriculum Vitae
                                    </h4>
                                    <p className="text-gray-400 text-xs mt-1 font-medium">
                                        Verified PDF available for download
                                    </p>
                                </div>
                                {candidate_resume ? (
                                    <a
                                        href={`${apiurl}/${candidate_resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50"
                                    >
                                        <FilePdfOutlined /> Review Resume
                                    </a>
                                ) : (
                                    <span className="text-white/30 text-[10px] font-bold uppercase italic">
                                        Not Uploaded
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Journey History */}
                    <section className="pb-8">
                        <SectionHeader
                            icon={<HistoryOutlined />}
                            title="Application History"
                        />
                        <div className="space-y-3">
                            {applications_data.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <HistoryOutlined className="text-2xl text-gray-300 mb-2" />
                                    <p className="text-gray-400 text-xs font-medium italic m-0">
                                        No historical activity recorded
                                    </p>
                                </div>
                            ) : (
                                applications_data.map((app, index) => (
                                    <div
                                        key={index}
                                        className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${getStatusBg(app.status)}`}
                                            >
                                                <SolutionOutlined />
                                            </div>
                                            <div>
                                                <h5 className="text-[13px] font-bold text-gray-800 m-0">
                                                    {app.job_title}
                                                </h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Tag
                                                        className={`border-none rounded font-bold text-[9px] uppercase px-1.5 py-0.5 m-0 ${getStatusStyles(app.status)}`}
                                                    >
                                                        {app.status}
                                                    </Tag>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <UserOutlined className="text-[8px]" />{" "}
                                                        Round {app.round_number}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest m-0">
                                                Next Stage
                                            </p>
                                            <p className="text-[11px] font-bold text-indigo-600 m-0 mt-0.5">
                                                {app.next_interview ||
                                                    "To be set"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <style jsx global>{`
                .modern-drawer .ant-drawer-content-wrapper {
                    border-radius: 40px 0 0 40px !important;
                    overflow: hidden;
                    box-shadow: -20px 0 50px rgba(0, 0, 0, 0.05) !important;
                }
                .modern-drawer .ant-drawer-content {
                    border-radius: 40px 0 0 40px !important;
                }
            `}</style>
        </Drawer>
    );
};

const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "bg-amber-100/50 text-amber-600";
        case "processing":
            return "bg-blue-100/50 text-blue-600";
        case "selected":
            return "bg-emerald-100/50 text-emerald-600";
        case "rejected":
            return "bg-rose-100/50 text-rose-600";
        default:
            return "bg-gray-100/50 text-gray-600";
    }
};

const getStatusBg = (status) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "bg-amber-50 text-amber-500";
        case "processing":
            return "bg-blue-50 text-blue-500";
        case "selected":
            return "bg-emerald-50 text-emerald-500";
        case "rejected":
            return "bg-rose-50 text-rose-500";
        default:
            return "bg-gray-50 text-gray-400";
    }
};

export default CandidateDetailsDrawer;
