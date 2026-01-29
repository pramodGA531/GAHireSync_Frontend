import React, { useEffect, useState } from "react";
import { message, Modal, Select, Button } from "antd";

import AddInterviewer from "./AddInterviewer";
import { useAuth } from "../../../common/useAuth";
import Note from "../../../../images/Client/note.svg";
import Mail from "../../../../images/Client/gmail.svg";
import Profile from "../../../../images/Client/profile.png";
import PlusIcon from "../../../../images/Client/plusicon.svg";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const InterviewerCard = ({ item, removeInterviewer }) => {
    const date = new Date(item.joining_date);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
    const navigate = useNavigate();

    return (
        <div className="bg-blue-50 w-full md:w-[300px] xl:w-[250px] shadow-sm rounded-[15px] p-5 pb-5">
            <div className="flex justify-between items-center w-full pt-2.5 pb-[5px]">
                <div className="flex gap-2.5 pt-[5px] flex-row items-center justify-center">
                    <img src={Profile} alt="" className="h-[50px] w-[50px]" />
                    <div className="flex flex-col">
                        <span className="text-[#54577A] text-base font-semibold">
                            {item.interviewer_name}
                        </span>
                        <span className="text-xs text-[#54577A] font-normal">
                            {formattedDate} (added)
                        </span>
                    </div>
                </div>
                <div
                    className="font-medium text-base text-[#54577A] cursor-pointer"
                    onClick={() => {
                        navigate(`/client/interviewer/${item.id}`);
                    }}
                >
                    View all
                </div>
            </div>
            <span className="mt-[15px] ml-2.5 flex items-center gap-2 text-[#54577A] text-sm font-normal">
                <img src={Mail} alt="" className="h-[19px]" />
                {item.interviewer_email}
            </span>
            <div className="ml-2 mt-[15px] w-full flex justify-between bg-transparent">
                <span className="flex gap-2 font-normal text-sm text-[#54577A] items-center">
                    <img src={Note} alt="" /> {item.scheduled_interviews}{" "}
                    Alloted
                </span>
                <span className="flex gap-2 font-normal text-sm text-[#54577A] items-center">
                    <img src={Note} alt="" /> {item.rounds_completed} Completed
                </span>
            </div>

            <div className="mt-[15px] flex justify-between">
                {/* <div className="view-all" onClick={() => { navigate(`/client/interviewer/${item.id}`) }}>
					View all
				</div> */}
                <div
                    className="text-xs cursor-pointer px-2.5 py-[5px] rounded-[5px] bg-[#FF8F8F] text-white"
                    onClick={() => {
                        removeInterviewer(item.id);
                    }}
                >
                    Remove Interviewer
                </div>
            </div>
        </div>
    );
};

const ClientInterviewers = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [interviewerData, setInterviewerData] = useState();
    const [interviewerList, setInterviewerList] = useState([]);
    const [allottedInterviewers, setAllottedInterviewers] = useState([]);
    const [removeInterviewerModal, setRemoveInterviewerModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedInterviewer, setSelectedInterviewer] = useState();

    const { apiurl, token } = useAuth();

    const { Option } = Select;

    const loadInterviewers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/client/get-interviewers/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData(data);
            setFilteredData(data); // Initialize filteredData with all data
        } catch (error) {
            console.error("Error fetching Interviewers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadInterviewers();
        }
    }, [token]);

    const fetchInterviewerDetails = async (interviewer_id) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/interviewer-details/?interviewer_id=${interviewer_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setLoading(false);
                return;
            }
            setInterviewerData(data.data);
            setInterviewerList(data.remaining_interviewers);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const removeInterviewer = (interviewer_id) => {
        setRemoveInterviewerModal(true);
        setSelectedInterviewer(interviewer_id);
        fetchInterviewerDetails(interviewer_id);
    };

    const handleRemoveInterviewer = async () => {
        try {
            const response = await fetch(
                `${apiurl}/client/remove-interviewer/?interviewer_id=${selectedInterviewer}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(allottedInterviewers),
                }
            );

            const data = await response.json();
            if (data.message) {
                message.success(data.message);
                loadInterviewers();
                setRemoveInterviewerModal(false);
            } else {
                message.error(data.error || "Something went wrong");
            }
        } catch (e) {
            console.error(e);
            message.error("Error occurred while removing interviewer");
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = data.filter((item) =>
            item.interviewer_name.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
    };

    const isDeleteDisabled =
        interviewerData &&
        Object.entries(interviewerData).some(([jobTitle, rounds]) =>
            rounds.some((round) => {
                const match = allottedInterviewers.find(
                    (item) =>
                        item.jobTitle === jobTitle &&
                        item.round_num === round.round_num
                );
                return !match || !match.selectedInterviewer; // Disable if no interviewer assigned
            })
        );

    return (
        <Main defaultSelectedKey="5" defaultSelectedChildKey="5-1">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="">
                    <div className="mt-4 -ml-2">
                        <GoBack />
                    </div>
                    <div className="pt-8 pl-8 text-2xl font-semibold">
                        All Interviewers
                    </div>
                    <div className="m-2 p-2 flex flex-col md:flex-row justify-between gap-4">
                        <div className="h-12 w-full md:w-3/4 bg-white border border-gray-200 rounded-lg flex items-center">
                            <SearchOutlined className="w-6 h-6 pl-2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-2 h-12 rounded-lg border-none outline-none focus:outline-none focus:ring-0"
                                placeholder="Search Interviewer"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalVisible(true)}
                            className="w-full md:w-36 p-2 m-0 md:m-2 bg-blue-500 text-white rounded-lg"
                        >
                            + Add Interviewer
                        </button>
                    </div>

                    <div className="flex flex-wrap m-2 p-2 gap-5 justify-center md:justify-start">
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <InterviewerCard
                                    key={index}
                                    item={item}
                                    removeInterviewer={removeInterviewer}
                                />
                            ))
                        ) : (
                            <p>No interviewers found.</p>
                        )}
                    </div>

                    <Modal
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <AddInterviewer onclose={loadInterviewers} />
                    </Modal>

                    <Modal
                        title="Assign Interviewers for Rounds"
                        open={removeInterviewerModal}
                        onCancel={() => setRemoveInterviewerModal(false)}
                        footer={[
                            <Button
                                key="cancel"
                                onClick={() => setRemoveInterviewerModal(false)}
                            >
                                Cancel
                            </Button>,
                            <Button
                                disabled={isDeleteDisabled}
                                key="delete"
                                type="primary"
                                danger
                                onClick={() =>
                                    handleRemoveInterviewer(selectedInterviewer)
                                }
                            >
                                Delete
                            </Button>,
                        ]}
                        width={800}
                    >
                        {interviewerData &&
                        Object.keys(interviewerData).length > 0 ? (
                            Object.entries(interviewerData).map(
                                ([jobTitle, rounds]) => (
                                    <div key={jobTitle} className="mb-6">
                                        <h3 className="font-semibold mb-2">
                                            {jobTitle}
                                        </h3>

                                        {rounds.map((round, index) => (
                                            <div
                                                key={`${jobTitle}_${round.round_num}_${index}`}
                                                className="p-2 border rounded mb-3"
                                            >
                                                <div>
                                                    Round: {round.round_num}
                                                </div>
                                                <div>
                                                    Type: {round.interview_type}
                                                </div>
                                                <div>
                                                    Mode: {round.interview_mode}
                                                </div>
                                                <div>
                                                    Pending Interviews:{" "}
                                                    {round.pending_interviews}
                                                </div>

                                                <div className="mt-2">
                                                    <label>
                                                        Assign Interviewer:
                                                    </label>
                                                    <Select
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        placeholder="Select Interviewer"
                                                        onChange={(value) => {
                                                            setAllottedInterviewers(
                                                                (prev) => {
                                                                    const updated =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    const index =
                                                                        updated.findIndex(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.jobTitle ===
                                                                                    jobTitle &&
                                                                                item.round_num ===
                                                                                    round.round_num
                                                                        );
                                                                    if (
                                                                        index >=
                                                                        0
                                                                    ) {
                                                                        updated[
                                                                            index
                                                                        ].selectedInterviewer =
                                                                            value;
                                                                    } else {
                                                                        updated.push(
                                                                            {
                                                                                jobTitle,
                                                                                job_id: round.job_id,
                                                                                round_num:
                                                                                    round.round_num,
                                                                                selectedInterviewer:
                                                                                    value,
                                                                            }
                                                                        );
                                                                    }
                                                                    return updated;
                                                                }
                                                            );
                                                        }}
                                                        value={
                                                            allottedInterviewers.find(
                                                                (item) =>
                                                                    item.jobTitle ===
                                                                        jobTitle &&
                                                                    item.round_num ===
                                                                        round.round_num
                                                            )
                                                                ?.selectedInterviewer
                                                        }
                                                    >
                                                        {interviewerList.map(
                                                            (interviewer) => (
                                                                <Option
                                                                    key={
                                                                        interviewer.interviewer_id
                                                                    }
                                                                    value={
                                                                        interviewer.interviewer_id
                                                                    }
                                                                >
                                                                    {
                                                                        interviewer.interviewer_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )
                        ) : (
                            <p>No interview data available.</p>
                        )}
                    </Modal>
                </div>
            )}
        </Main>
    );
};

export default ClientInterviewers;
