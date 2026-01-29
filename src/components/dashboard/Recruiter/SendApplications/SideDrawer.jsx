import React from "react";
import { Drawer, Tag, Divider } from "antd";
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
} from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";

const InfoItem = ({ icon, label, value }) => (
    <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-gray-50 bg-white hover:border-blue-100 transition-colors">
        <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{icon}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {label}
            </span>
        </div>
        <span className="text-sm font-bold text-[#071C50] pl-5">
            {value || "N/A"}
        </span>
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
            width={720}
            onClose={onClose}
            open={open}
            className=""
            closeIcon={null}
            style={
                { background: "#071C50" }
            }
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-start ">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-[#1681FF] flex items-center justify-center font-black text-2xl shadow-none">
                            {candidate_name?.[0]}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter m-0 uppercase">
                                {candidate_name}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                Candidate Details
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <CloseOutlined />
                    </button>
                </div>

                {/* Main Intel Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                    <InfoItem
                        icon={<MailOutlined />}
                        label="Email"
                        value={candidate_email}
                    />
                    <InfoItem
                        icon={<PhoneOutlined />}
                        label="Phone"
                        value={contact}
                    />
                    <InfoItem
                        icon={<EnvironmentOutlined />}
                        label="Current Location"
                        value={current_job_location}
                    />
                    <InfoItem
                        icon={<BankOutlined />}
                        label="Current Organization"
                        value={current_organization}
                    />
                    <InfoItem
                        icon={<SolutionOutlined />}
                        label="Experience"
                        value={`${experience} Years`}
                    />
                    <InfoItem
                        icon={<CalendarOutlined />}
                        label="Date of Birth"
                        value={date_of_birth}
                    />
                    <InfoItem
                        icon={<DollarOutlined />}
                        label="Current CTC"
                        value={`${currect_ctc} LPA`}
                    />
                    <InfoItem
                        icon={<DollarOutlined />}
                        label="Expected CTC"
                        value={`${expected_ctc} LPA`}
                    />
                </div>

                {/* Resume Node */}
                <div className="bg-blue-50 p-8 rounded-[32px] text-blue-900 flex items-center justify-between group overflow-hidden relative border border-blue-100">
                    <div className="relative z-10">
                        <h4 className="text-lg font-black uppercase tracking-tight m-0">
                            Resume
                        </h4>
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                            PDF Document
                        </p>
                    </div>
                    {candidate_resume ? (
                        <a
                            href={`${apiurl}/${candidate_resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 flex items-center gap-3 bg-white text-[#1681FF] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
                        >
                            <FilePdfOutlined className="text-sm" /> View Resume
                        </a>
                    ) : (
                        <span className="text-white/40 font-black text-[10px] uppercase tracking-widest italic">
                            No Resume
                        </span>
                    )}
                </div>

                <Divider className="border-gray-100">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        History
                    </span>
                </Divider>

                {/* Application Activity */}
                <div className="space-y-4">
                    {applications_data.length === 0 ? (
                        <div className="text-center py-10 opacity-30">
                            <GlobalOutlined className="text-4xl mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest italic">
                                No history found
                            </p>
                        </div>
                    ) : (
                        applications_data.map((app, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-blue-100 transition-all shadow-sm"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-[#071C50] tracking-tight">
                                            {app.job_title}
                                        </span>
                                        <Tag
                                            className={`border-none rounded-md font-black text-[9px] uppercase px-2 py-0.5 ${getStatusStyles(
                                                app.status
                                            )}`}
                                        >
                                            {app.status}
                                        </Tag>
                                    </div>
                                    <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarOutlined className="text-[9px]" />{" "}
                                            Round {app.round_number}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarOutlined className="text-[9px]" />{" "}
                                            Next Interview:{" "}
                                            {app.next_interview || "None"}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                    <SolutionOutlined />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <style jsx>{``}</style>
        </Drawer>
    );
};

const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "bg-amber-50 text-amber-600";
        case "processing":
            return "bg-blue-50 text-blue-600";
        case "selected":
            return "bg-green-50 text-green-600";
        case "rejected":
            return "bg-red-50 text-red-600";
        default:
            return "bg-gray-50 text-gray-600";
    }
};

export default CandidateDetailsDrawer;
