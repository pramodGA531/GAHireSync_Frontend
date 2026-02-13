import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    SearchOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Modal, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../common/useAuth.jsx";
import Main from "../Layout";
import Pageloading from "../../../common/loading/Pageloading";
import AddRecruiters from "./AddRecruiters";
import GoBack from "../../../common/Goback";
const Profile = ({ data, handleRemoveRecruiter }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4 overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                {data.profile ? (
                    <img
                        src={data.profile}
                        alt={data.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <UserOutlined className="text-3xl text-blue-300" />
                )}
            </div>
            <h3 className="text-lg font-bold text-[#071C50] mb-1">
                {data.name}
            </h3>
            <div className="flex flex-col gap-1 mb-6 w-full">
                {data.phone && (
                    <span className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                        <PhoneOutlined className="text-blue-400" /> {data.phone}
                    </span>
                )}
                <span className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                    <MailOutlined className="text-blue-400" /> {data.email}
                </span>
            </div>
            <div className="flex flex-col w-full gap-2">
                <button
                    className="w-full py-2 bg-[#1681FF] text-white text-xs font-bold rounded-lg hover:bg-[#0061D5] transition-colors"
                    onClick={() => navigate(`/agency/recruiters/${data.id}`)}
                >
                    View Summary
                </button>
                <button
                    className="w-full py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                    onClick={() => handleRemoveRecruiter(data.id)}
                >
                    Remove Recruiter
                </button>
            </div>
        </div>
    );
};

const AllRecruiters = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { token, apiurl } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const [recJobs, setRecJobs] = useState();
    const [recruiters, setRecruiters] = useState([]);
    const [selectedReassignments, setSelectedReassignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [canAddNew, setCanAddNew] = useState(true);
    const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);

    const fetchRecruiters = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/manager/all-recruiters/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            });

            const data = await response.json();
            if (data.error) {
                console.log(data.error);
            } else {
                setData(data.data);
                setCanAddNew(data.can_add_recruiter);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecruiters();
        }
    }, [token]);

    const handleAddRecruiter = () => {
        if (!canAddNew) {
            Modal.warning({
                title: "Recruiter Limit Reached",
                content:
                    "Your current plan has reached the maximum number of recruiter slots. Please upgrade your plan to add more recruiters.",
                centered: true,
                okText: "Okay",
            });
            return;
        } else {
            setIsModalVisible(true);
        }
    };

    const fetchRecruiterJobs = async (recruiter_id) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/manager/recruiter/jobs/?rec_id=${recruiter_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setLoading(false);
                return;
            }
            setRemoveModal(true);
            setRecJobs(data.data);
            setRecruiters(data.recruiters);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRecruiter = (rec_id) => {
        fetchRecruiterJobs(rec_id);
        setSelectedRecruiterId(rec_id);
        setRemoveModal(true);
    };

    const handleRemove = async () => {
        if (!selectedRecruiterId) return;

        try {
            setButtonLoading(true);
            const response = await fetch(
                `${apiurl}/manager/remove-recruiter/?rec_id=${selectedRecruiterId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedReassignments),
                },
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }

            message.success(data.message);
            setRemoveModal(false);
            fetchRecruiters();
        } catch (e) {
            console.error(e);
        } finally {
            setButtonLoading(false);
        }
    };

    const filteredRecruiters = data.filter(
        (recruiter) =>
            recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recruiter.phone && recruiter.phone.includes(searchTerm)),
    );

    return (
        <Main defaultSelectedKey="3">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                {loading ? (
                    <Pageloading />
                ) : (
                    <div className="max-w-7xl mx-auto">
                        {/* <div className="-ml-6 -mt-1">
                        <GoBack />
                    </div> */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <div className="relative w-full md:w-96">
                                <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search recruiters by name or email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <button
                                className="w-full md:w-auto px-6 py-2.5 bg-[#1681FF] text-white font-bold rounded-xl hover:bg-[#0061D5] transition-all flex items-center justify-center gap-2"
                                onClick={handleAddRecruiter}
                            >
                                <PlusOutlined /> Add New Recruiter
                            </button>
                        </div>

                        {filteredRecruiters.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredRecruiters.map((recruiter, index) => (
                                    <Profile
                                        key={index}
                                        data={recruiter}
                                        handleRemoveRecruiter={
                                            handleRemoveRecruiter
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                                <div className="text-6xl mb-4 opacity-20">
                                    👥
                                </div>
                                <h3 className="text-lg font-bold text-gray-400">
                                    No recruiters found
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Try adjusting your search terms
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <Modal
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    className="premium-modal"
                    width={500}
                >
                    <AddRecruiters
                        onclose={() => {
                            setIsModalVisible(false);
                            fetchRecruiters();
                        }}
                    />
                </Modal>

                <Modal
                    open={removeModal}
                    onCancel={() => {
                        setRemoveModal(false);
                        setSelectedRecruiterId(null);
                    }}
                    title={
                        <span className="text-lg font-bold text-[#071C50]">
                            Reassign Recruiter's Jobs
                        </span>
                    }
                    footer={[
                        <Button
                            key="remove"
                            danger
                            type="primary"
                            className="px-8 font-bold rounded-lg"
                            onClick={handleRemove}
                            loading={buttonLoading}
                        >
                            Confirm Removal
                        </Button>,
                    ]}
                >
                    <div className="py-4">
                        <p className="text-sm text-gray-500 mb-6">
                            Before removing this recruiter, please reassign
                            their active jobs to other team members.
                        </p>
                        {recJobs && recJobs.length > 0 ? (
                            <div className="space-y-6">
                                {recJobs.map((job) => (
                                    <div
                                        key={job.job_id}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-gray-800 text-sm">
                                                {job.job_title}
                                            </h4>
                                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">
                                                {job.resumes_sent} Resumes
                                            </span>
                                        </div>

                                        <Select
                                            className="w-full h-10 rounded-lg"
                                            placeholder="Select replacement recruiter"
                                            onChange={(value) => {
                                                const updated = [
                                                    ...selectedReassignments,
                                                ];
                                                const index = updated.findIndex(
                                                    (item) =>
                                                        item.job_id ===
                                                        job.job_id,
                                                );
                                                if (index > -1) {
                                                    updated[
                                                        index
                                                    ].selected_recruiter_id =
                                                        value;
                                                } else {
                                                    updated.push({
                                                        job_id: job.job_id,
                                                        selected_recruiter_id:
                                                            value,
                                                    });
                                                }
                                                setSelectedReassignments(
                                                    updated,
                                                );
                                            }}
                                        >
                                            {recruiters?.map((recruiter) => (
                                                <Select.Option
                                                    key={recruiter.id}
                                                    value={recruiter.id}
                                                >
                                                    {recruiter.recruiter_name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-green-50 rounded-xl border border-green-100">
                                <p className="text-green-600 font-medium text-sm">
                                    This recruiter has no active jobs assigned.
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </Main>
    );
};

export default AllRecruiters;
