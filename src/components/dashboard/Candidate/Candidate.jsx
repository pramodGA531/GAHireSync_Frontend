import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import { Button, message, Table, Tag, Modal } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Clock,
    Briefcase,
    CheckCircle,
    XCircle,
    Activity,
    MapPin,
    Building,
    User,
} from "lucide-react";

import Profile from "../../../images/Client/profile.png";
import CandidateInfo from "./CandidateInfo";

const Candidate = () => {
    const { token, apiurl } = useAuth();
    const navigate = useNavigate();
    const [candidateData, setCandidateData] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [reconfirmationData, SetReconfirmationData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/dashboard/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.candidate_data) {
                setCandidateData(data.candidate_data);
            }
            if (data.upcoming_interviews) {
                setInterviews(data.upcoming_interviews);
            }
        } catch (e) {
            message.error("Failed to fetch applications");
            console.error(e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const columns = [
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_id",
            render: (jobTitle) => (
                <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500" />
                    <span className="text-blue-600 font-semibold text-sm">
                        {jobTitle}
                    </span>
                </div>
            ),
        },
        {
            title: "Job Location",
            dataIndex: "job_location",
            key: "job_location",
            render: (loc) => (
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    {loc || "Remote"}
                </div>
            ),
        },
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
            render: (comp) => (
                <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                    <Building size={16} className="text-gray-400" />
                    {comp}
                </div>
            ),
        },
        {
            title: "Interviewer Name",
            dataIndex: "interviewer_name",
            key: "interviewer_name",
            render: (name) => (
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <User size={16} className="text-gray-400" />
                    {name || "TBA"}
                </div>
            ),
        },
        {
            title: "Scheduled Date",
            dataIndex: "scheduled_date_and_time",
            key: "scheduled_date_and_time",
            render: (date) => (
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span className="bg-blue-50 border border-blue-100 rounded-md px-2 py-1 text-xs text-blue-700 font-semibold">
                        {date}
                    </span>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fillprofile();
    }, [candidateData]);

    const fillprofile = () => {
        if (candidateData?.percentage_filled < 40) {
            // message.info("Please fill your profile to continue");
            setIsModalVisible(true);
        }
    };

    return (
        <Main defaultSelectedKey="1">
            <div className="p-4 sm:p-6 bg-[#F9FAFB] min-h-screen font-sans text-gray-800">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        Welcome back,{" "}
                        {candidateData?.candidate_name || "Candidate"} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here is an overview of your profile performance and
                        interview schedule.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Block 1: Profile Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="p-5 flex items-center gap-5">
                            <div className="flex flex-col items-center relative shrink-0">
                                <div
                                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full flex items-center justify-center rotate-180 transition-[background] duration-1000 ease-in-out"
                                    style={{
                                        background: `conic-gradient(rgba(59, 130, 246, 1) ${
                                            candidateData?.percentage_filled ||
                                            45
                                        }%, #E5E7EB 0%)`,
                                    }}
                                >
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-white -rotate-180 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-inner">
                                        <img
                                            src={
                                                candidateData?.profile
                                                    ? `${apiurl}/${candidateData.profile}`
                                                    : Profile
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="bg-blue-600 py-1 px-3 rounded-full text-xs font-bold text-white shadow-sm absolute -bottom-3">
                                    {candidateData?.percentage_filled || 0}%
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="text-gray-900 text-xl font-bold truncate pr-2">
                                    {candidateData?.candidate_name ||
                                        "Update Name"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Last Update:{" "}
                                    <span className="font-medium text-gray-700">
                                        {candidateData?.last_updated || "N/A"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-colors shadow-sm w-fit"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 rounded-b-xl">
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Make sure to update your profile everyday for
                                better results.
                            </p>
                        </div>
                    </div>

                    {/* Block 2: Viewed by Recruiter */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="p-5 flex items-center gap-5 h-full">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 rounded-full border-[3px] border-blue-100 flex justify-center items-center shrink-0 shadow-inner">
                                <span className="text-blue-600 text-[32px] font-black">
                                    {candidateData?.recruiter_shared || 0}
                                </span>
                            </div>
                            <div className="flex flex-col flex-1">
                                <div className="text-gray-900 text-lg sm:text-xl font-bold">
                                    Viewed by Recruiter
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Last Job:{" "}
                                    <span className="font-medium text-gray-700">
                                        {candidateData?.latest_job || "None"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 rounded-b-xl">
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Keep track of recruiters viewing your profile.
                            </p>
                        </div>
                    </div>

                    {/* Block 3: Applications Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CheckCircle size={80} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                Profiles Shared
                            </p>
                            <p className="text-3xl font-black text-blue-600">
                                {candidateData?.recruiter_shared || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <XCircle size={80} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                Profiles Rejected
                            </p>
                            <p className="text-3xl font-black text-red-500">
                                {candidateData?.rejected || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Activity size={80} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                Under Processing
                            </p>
                            <p className="text-3xl font-black text-orange-500">
                                {candidateData?.processing || 0}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Clock size={80} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                                On Hold
                            </p>
                            <p className="text-3xl font-black text-gray-700">
                                {candidateData?.onhold || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interviews Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 m-0">
                                Upcoming Interviews
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Your scheduled interviews with recruiters
                            </p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="p-0">
                        <Table
                            columns={columns}
                            dataSource={interviews}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-500 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:tracking-wider"
                        />
                    </div>
                </div>

                <Modal
                    title={
                        <span className="text-lg font-bold text-gray-900">
                            Complete Your Profile
                        </span>
                    }
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={1000}
                    centered
                    className="[&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:p-0 [&_.ant-modal-header]:px-6 [&_.ant-modal-header]:py-4 [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-gray-100 [&_.ant-modal-body]:p-6"
                >
                    <CandidateInfo onClose={() => setIsModalVisible(false)} />
                </Modal>
            </div>
        </Main>
    );
};

export default Candidate;
