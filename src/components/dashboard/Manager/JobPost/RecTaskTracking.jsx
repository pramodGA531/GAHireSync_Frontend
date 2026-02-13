import React, { useState, useEffect } from "react";
// import "./RecTaskTracking.css";
import File from "../../../../images/agency/rec-dashboard/File.svg";
import Completed from "../../../../images/agency/rec-dashboard/Completed.svg";
import Incomplete from "../../../../images/agency/rec-dashboard/Incomplete.svg";
import PlayButton from "../../../../images/agency/rec-dashboard/playbutton.svg";
import DateIcon from "../../../../images/agency/rec-dashboard/Date.svg";
import NoActivities from "../../../../images/Illustrations/NoActivities.png";
import {
    FilterOutlined,
    PlusCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Tooltip, Modal, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import AddRecruiters from "../Recruiter/AddRecruiters";
import { useAuth } from "../../../common/useAuth";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const Row = ({ job }) => {
    const priorityColors = {
        high: "bg-[#FEE2E2] text-[#991B1B]",
        medium: "bg-[#FEF3C7] text-[#92400E]",
        low: "bg-[#D1FAE5] text-[#065F46]",
    };

    const statusColors =
        job["status"] < 25
            ? "bg-[#EF4444]"
            : job["status"] < 75
              ? "bg-[#F59E0B]"
              : "bg-[#10B981]";

    return (
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors gap-4">
            <div className="flex-1 font-medium text-gray-800 cursor-pointer truncate">
                {job["job_title"]}
            </div>
            <div className="w-[150px] text-sm text-gray-500 truncate">
                {job["location"]} - {job["num_of_positions"]}
            </div>
            <div
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    priorityColors[job["priority"]?.toLowerCase()] ||
                    "bg-gray-100 text-gray-600"
                }`}
            >
                {job["priority"]}
            </div>
            <div className="w-[120px] flex items-center gap-2 text-sm text-gray-500">
                <img src={DateIcon} alt="" className="w-4 h-4 opacity-60" />
                {job["due_date"]}
            </div>
            <div className="w-[150px] flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${statusColors} transition-all duration-500`}
                        style={{ width: `${job["status"]}%` }}
                    ></div>
                </div>
                <span className="text-[11px] font-bold text-gray-600 w-8">
                    {job["status"]}%
                </span>
            </div>
            <div className="flex -space-x-2">
                {job["recruiters"]?.map((item, index) => (
                    <Tooltip title={item} key={index}>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer">
                            {item?.profile ? (
                                <img
                                    src={item.profile}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserOutlined className="text-blue-500 text-[12px]" />
                            )}
                        </div>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
};

const RecTaskTracking = () => {
    const { apiurl, token } = useAuth();
    const [jobData, setJobData] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [mainComponents, setMainComponents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState("New");
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
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/recruiters-task-tracking/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (data.error) {
                console.log(data.error);
            }

            setRecruiters(data.recruiters_list);
            setJobData(data.job_data);
            setRecentActivities(data.recent_activities);
            setMainComponents(data.main_components);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleSelectedFilter = (filter) => {
        setSelectedFilter(filter);
    };

    const filteredData = jobData.filter((job) => {
        if (selectedFilter === "New") {
            // Check if created_at is within the last 5 days
            if (!job.created_at) return false;
            const createdDate = new Date(job.created_at);
            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
            return createdDate >= fiveDaysAgo;
        }
        if (selectedFilter === "In Progress") {
            return job.job_status === "opened";
        }
        if (selectedFilter === "Completed") {
            // Assuming completed means closed or 100% status
            return job.job_status === "closed";
        }
        return true;
    });

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-5">
            <div className="m-4">
                <div className="mb-4">
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
                                        Task Tracking
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>
                {loading ? (
                    <Pageloading />
                ) : (
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Left Side */}
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Main Components Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            New
                                        </span>
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <img
                                                className="w-5 h-5"
                                                src={File}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-semibold text-gray-800">
                                        {mainComponents?.new}
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            In Progress
                                        </span>
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <img
                                                className="w-5 h-5"
                                                src={PlayButton}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-semibold text-gray-800">
                                        {mainComponents?.on_going}
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Completed
                                        </span>
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <img
                                                className="w-5 h-5"
                                                src={Completed}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-semibold text-gray-800">
                                        {mainComponents?.completed_posts}
                                    </span>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Missed Deadline
                                        </span>
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <img
                                                className="w-5 h-5"
                                                src={Incomplete}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <span className="text-3xl font-semibold text-gray-800">
                                        {mainComponents?.completed_deadline}
                                    </span>
                                </div>
                            </div>

                            {/* Job Tracking Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-semibold text-gray-800">
                                        Job Tracking
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "New",
                                            "In Progress",
                                            "Completed",
                                        ].map((filter) => (
                                            <button
                                                key={filter}
                                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                                                    selectedFilter === filter
                                                        ? "bg-[#1681FF] text-white shadow-md shadow-blue-200"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                                onClick={() =>
                                                    handleSelectedFilter(filter)
                                                }
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-400 font-bold uppercase py-2">
                                        Sort by: Latest
                                    </div>
                                </div>
                                <div className="flex flex-col border border-gray-50 rounded-lg overflow-hidden">
                                    {filteredData.map((job, index) => (
                                        <Row key={index} job={job} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col gap-6 w-full xl:w-[350px]">
                            {/* Recruiters Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-semibold text-gray-800">
                                        Recruiters
                                    </span>
                                    <span className="text-xs text-[#1681FF] font-bold cursor-pointer hover:underline uppercase tracking-wider">
                                        View All
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {recruiters.map((item, index) => (
                                        <div
                                            className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group"
                                            key={index}
                                        >
                                            <div className="relative mb-2">
                                                {item.Profile ? (
                                                    <img
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white ring-1 ring-gray-100"
                                                        src={item.Profile}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-sm"
                                                        style={{
                                                            backgroundColor: [
                                                                "#379AE6",
                                                                "#22CCB2",
                                                                "#231E3B",
                                                                "#DF1C3D",
                                                            ][index % 4],
                                                        }}
                                                    >
                                                        <UserOutlined />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 group-hover:text-[#1681FF] truncate w-full text-center">
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activities Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                                <span className="text-lg font-semibold text-gray-800 mb-6 block">
                                    Recent activities
                                </span>
                                <div className="flex flex-col gap-5">
                                    {recentActivities.map((item, index) => (
                                        <div
                                            className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 group"
                                            key={index}
                                        >
                                            <div className="relative flex-shrink-0">
                                                {item.profile ? (
                                                    <img
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                                        src={item.profile}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-bold"
                                                        style={{
                                                            backgroundColor: [
                                                                "#379AE6",
                                                                "#22CCB2",
                                                                "#231E3B",
                                                                "#DF1C3D",
                                                            ][index % 4],
                                                        }}
                                                    >
                                                        <UserOutlined />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="text-[13px] font-bold text-gray-800">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-medium">
                                                        {item.thumbnail}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] leading-tight text-gray-600">
                                                    <span className="font-semibold text-blue-600 mr-1">
                                                        {item.task}
                                                    </span>
                                                    for
                                                    <span className="font-semibold text-gray-800 ml-1">
                                                        {item.job_title}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {recentActivities.length == 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                            <img
                                                src={NoActivities}
                                                alt=""
                                                className="w-32 h-32 mb-4"
                                            />
                                            <span className="text-sm font-bold text-gray-500">
                                                No recent activities
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Modal
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <AddRecruiters onclose={fetchRecruiters} />
                </Modal>
            </div>
        </Main>
    );
};

export default RecTaskTracking;
