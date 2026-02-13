import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message, Button, Table, Modal, Input } from "antd";
import Profile from "../../../../images/Client/profile.png";
import Money from "../../../../images/Client/money bag.svg";
import Note from "../../../../images/Client/note.svg";
import Mail from "../../../../images/Client/gmail.svg";
import CustomDatePicker from "../../../common/CustomDatePicker";
// import "./Replacement.css";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";
const ReplacementCard = ({ item }) => {
    const date = new Date(item.joining_date);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

    return (
        <div className="replacement-card-client">
            <div className="profile">
                <div className="details">
                    <img src={Profile} alt="" />
                    <div className="name">
                        <span className="interviewer-name">
                            {item.candidate_name}
                        </span>
                        <span className="joining-date">
                            {formattedDate} (joined)
                        </span>
                    </div>
                </div>
                {/* <div className="view-all" onClick={() => { navigate(`/client/interviewer/${item.id}`) }}>
                    View all
                </div> */}
            </div>
            <span className="mail">
                <img src={Mail} alt="" />
                {item.job_title}
            </span>
            <div className="pending">
                <span className="alloted note">
                    <img src={Money} alt="" /> {item.agreed_ctc} LPA
                </span>
                <span className="completed note">
                    <img src={Note} alt="" /> {item.organization_name}
                </span>
            </div>
            <div className="last">
                <button>Replace With</button>
            </div>
        </div>
    );
};

const Replacement = () => {
    const [data, setData] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { apiurl, token } = useAuth();
    const [selectedCandidate, setSelectedCandidate] = useState();
    const [replacementId, setReplacementId] = useState();
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [formDetails, setFormDetails] = useState({
        accepted_ctc: 0,
        joining_date: null,
        other_benefits: "",
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/client/replacements/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                setData(data || []);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async (job_id) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/on-hold/?job_id=${job_id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setCandidates(result);
            }
        } catch (e) {
            console.log(e);
            message.error("Failed to fetch candidates");
        }
        setLoading(false);
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setConfirmModalVisible(true);
    };

    console.log(selectedCandidate);

    const handleConfirmReplacement = async () => {
        if (
            !formDetails.accepted_ctc ||
            !formDetails.joining_date ||
            !selectedCandidate
        ) {
            message.error("Please fill all details.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/replace-candidate/?replacement_id=${replacementId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        new_application_id: selectedCandidate.application_id,
                        accepted_ctc: formDetails.accepted_ctc,
                        joining_date:
                            formDetails.joining_date.format("YYYY-MM-DD"),
                        other_benefits: formDetails.other_benefits,
                    }),
                }
            );

            const result = await response.json();
            if (result.success) {
                message.success("Candidate replaced successfully");
                setConfirmModalVisible(false);
                setModalVisible(false);
                fetchData();
            } else {
                message.error(result.error || "Failed to replace candidate");
            }
        } catch (e) {
            console.log(e);
            message.error("Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (fieldName, value) => {
        setFormDetails((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const formatDate = (actual_date) => {
        let date = new Date(actual_date);
        let formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
            date.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
        return formattedDate;
    };

    return (
        <Main defaultSelectedKey="6">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                {/* <div className="mt-4 -ml-2">
                    <GoBack />
                </div> */}
                   
                   <div className="m-4"> <h2 className="font-semibold text-xl text-black">
                        Replacements
                    </h2></div>
                    <div className="flex flex-wrap gap-4">
                        {data &&
                            data?.map((item, index) => (
                                <div
                                    key={index}
                                    className="px-5 pb-5 rounded-[15px] w-[300px] bg-[#1681FF0D]"
                                >
                                    <div className="flex justify-between items-center w-full pt-2.5 pb-1.5">
                                        <div className="flex gap-2.5 pt-1.5 flex-row items-center justify-center">
                                            <img
                                                src={Profile}
                                                alt=""
                                                className="h-[50px] w-[50px]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[#54577A] text-base font-semibold">
                                                    {item.candidate_name}
                                                </span>
                                                <span className="text-xs text-[#54577A] font-normal">
                                                    {formatDate(
                                                        item.joining_date
                                                    )}{" "}
                                                    (joined)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="mt-4 ml-2.5 flex items-center gap-2 text-[#54577A] text-sm font-normal">
                                        <img
                                            src={Mail}
                                            alt=""
                                            className="h-[19px]"
                                        />
                                        {item.job_title}
                                    </span>
                                    <div className="ml-2 mt-4 w-full flex justify-between bg-transparent">
                                        <span className="flex gap-2 font-normal text-sm text-[#54577A] items-center">
                                            <img src={Money} alt="" />{" "}
                                            {item.agreed_ctc} LPA
                                        </span>
                                        <span className="flex gap-2 font-normal text-sm text-[#54577A] items-center">
                                            <img src={Note} alt="" />{" "}
                                            {item.organization_name}
                                        </span>
                                    </div>
                                    <div className="mt-5">
                                        <button
                                            className="h-10 flex items-center justify-center w-full bg-[#1681FF] text-white rounded-md border-none cursor-pointer hover:bg-[#0056b3]"
                                            onClick={() => {
                                                setModalVisible(true);
                                                fetchCandidates(item.job_id);
                                                setReplacementId(
                                                    item.replacement_id
                                                );
                                            }}
                                        >
                                            Replace With
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <Modal
                        title="Candidates on hold"
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        {loading ? (
                            <p>Loading candidates...</p>
                        ) : candidates.length > 0 ? (
                            <Table
                                dataSource={candidates}
                                rowKey="id"
                                columns={[
                                    {
                                        title: "Name",
                                        dataIndex: "candidate_name",
                                        key: "name",
                                    },
                                    {
                                        title: "Email",
                                        dataIndex: "candidate_email",
                                        key: "email",
                                    },
                                    {
                                        title: "Experience",
                                        dataIndex: "experience",
                                        key: "experience",
                                    },
                                    {
                                        title: "Expected CTC",
                                        dataIndex: "expected_ctc",
                                        key: "expected_ctc",
                                    },

                                    {
                                        title: "Action",
                                        key: "action",
                                        render: (_, record) => (
                                            <Button
                                                onClick={() =>
                                                    handleSelectCandidate(
                                                        record
                                                    )
                                                }
                                            >
                                                Select
                                            </Button>
                                        ),
                                    },
                                ]}
                            />
                        ) : (
                            <p>No candidates available for replacement</p>
                        )}
                    </Modal>

                    <Modal
                        title="Confirm Replacement Details"
                        open={confirmModalVisible}
                        onCancel={() => setConfirmModalVisible(false)}
                        onOk={handleConfirmReplacement}
                    >
                        {selectedCandidate && (
                            <>
                                <p>
                                    <strong>New Candidate:</strong>{" "}
                                    {selectedCandidate.candidate_name}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedCandidate.candidate_email}
                                </p>

                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Accepted CTC (LPA)"
                                    value={formDetails.accepted_ctc}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "accepted_ctc",
                                            e.target.value
                                        )
                                    }
                                    style={{ marginBottom: 10 }}
                                />

                                <CustomDatePicker
                                    placeholder="Joining Date"
                                    value={formDetails.joining_date}
                                    onChange={(date) =>
                                        handleFormChange("joining_date", date)
                                    }
                                    style={{ width: "100%", marginBottom: 10 }}
                                />

                                <Input
                                    placeholder="Other Benefits"
                                    value={formDetails.other_benefits}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "other_benefits",
                                            e.target.value
                                        )
                                    }
                                    style={{ marginBottom: 10 }}
                                />
                            </>
                        )}
                    </Modal>
                </>
            )}
        </Main>
    );
};

export default Replacement;
