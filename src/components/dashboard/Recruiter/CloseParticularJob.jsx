import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/context";
import { Button, Form, Input, Select, Divider, message, Badge } from "antd";
import {
    CheckCircleOutlined,
    UserOutlined,
    GlobalOutlined,
    HomeOutlined,
    FileTextOutlined,
    LockOutlined,
    RocketOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Main from "./Layout";
import Pageloading from "../../common/loading/Pageloading";
import GoBack from "../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const splitName = (fullName) => {
    if (!fullName) return { firstName: "", middleName: "", lastName: "" };
    const nameParts = fullName.trim().split(" ");
    let firstName = "",
        middleName = "",
        lastName = "";

    if (nameParts.length === 1) {
        firstName = nameParts[0];
    } else if (nameParts.length === 2) {
        [firstName, lastName] = nameParts;
    } else {
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
        middleName = nameParts.slice(1, -1).join(" ");
    }

    return { firstName, middleName, lastName };
};

const calculateAge = (dob) => {
    if (!dob) return 0;
    return moment().diff(dob, "years");
};

const CloseParticularJob = () => {
    const { login, authToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) login(token);
    }, [login]);

    useEffect(() => {
        if (authToken) {
            setFetchLoading(true);
            fetch(
                `${apiurl}/api/recruiter/close_job/all_accepted_candidates/${id}/`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            )
                .then((res) => res.json())
                .then((resData) => {
                    setData(resData.data || []);
                })
                .catch((err) => {
                    console.error(err);
                    message.error("Registry synchronization failure.");
                })
                .finally(() => setFetchLoading(false));
        }
    }, [authToken, id]);

    const handleSubmit = async (values) => {
        setLoading(true);
        const dataToSend = values.candidates.map((candidate) => ({
            ...candidate,
            resume: `${candidate.resume}`,
            fullName: `${candidate.first_name} ${candidate.middle_name} ${candidate.last_name}`,
        }));

        try {
            const response = await fetch(
                `${apiurl}/api/recruiter/close_job/all_accepted_candidates/${id}/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        candidates: dataToSend,
                        freeze_time: values.freeze_time,
                    }),
                },
            );

            if (!response.ok) throw new Error("Operational fault");

            message.success("Asset registry finalized. Job closed.");
            form.resetFields();
            navigate("/recruiter/postings/closed");
        } catch (error) {
            message.error("Critical failure during closure sequence.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-[#071C50] tracking-tight mb-2 uppercase italic">
                                Finalize Closure
                            </h1>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Archiving Post Specification #{id}
                            </p>
                        </div>
                        <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shadow-lg shadow-red-50/50">
                                <LockOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">
                                    Status
                                </p>
                                <p className="text-[#071C50] font-black text-xs uppercase tracking-widest">
                                    Termination Phase
                                </p>
                            </div>
                        </div>
                    </div>

                    {fetchLoading ? (
                        <div className="h-96 flex items-center justify-center bg-white rounded-[40px] border border-gray-100 shadow-xl">
                            <Pageloading />
                        </div>
                    ) : data && data.length > 0 ? (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                            <div className="grid grid-cols-1 gap-10">
                                {data.map((candidate, index) => {
                                    const { firstName, middleName, lastName } =
                                        splitName(candidate.candidate_name);
                                    const age = calculateAge(
                                        candidate.date_of_birth,
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-2xl shadow-blue-900/5 space-y-8 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-8">
                                                <Badge
                                                    count={`Asset 0${
                                                        index + 1
                                                    }`}
                                                    className="custom-badge-premium"
                                                />
                                            </div>

                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 rounded-2xl bg-[#001744] flex items-center justify-center text-white">
                                                    <UserOutlined />
                                                </div>
                                                <h3 className="text-xl font-black text-[#071C50] uppercase tracking-tighter m-0">
                                                    Candidate Credentials
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "first_name",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Entry Name
                                                        </span>
                                                    }
                                                    initialValue={firstName}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input className="h-14 rounded-2xl border-gray-100 bg-gray-50/30" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "middle_name",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Mid Segment
                                                        </span>
                                                    }
                                                    initialValue={middleName}
                                                >
                                                    <Input className="h-14 rounded-2xl border-gray-100 bg-gray-50/30" />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "last_name",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Final Segment
                                                        </span>
                                                    }
                                                    initialValue={lastName}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input className="h-14 rounded-2xl border-gray-100 bg-gray-50/30" />
                                                </Form.Item>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "position",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Designated Post
                                                        </span>
                                                    }
                                                    initialValue={
                                                        candidate.job_title
                                                    }
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        prefix={
                                                            <GlobalOutlined className="text-gray-300" />
                                                        }
                                                        className="h-14 rounded-2xl border-gray-100 bg-gray-50/30"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "age",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Chronology (Age)
                                                        </span>
                                                    }
                                                    initialValue={age}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        type="number"
                                                        readOnly
                                                        className="h-14 rounded-2xl border-gray-100 bg-gray-100 text-gray-400 font-bold"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        "candidates",
                                                        index,
                                                        "gender",
                                                    ]}
                                                    label={
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                            Identity
                                                        </span>
                                                    }
                                                    initialValue={
                                                        candidate.gender
                                                    }
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Select className="h-14 custom-select-premium">
                                                        <Select.Option value="male">
                                                            Male
                                                        </Select.Option>
                                                        <Select.Option value="female">
                                                            Female
                                                        </Select.Option>
                                                        <Select.Option value="transgender">
                                                            Transgender
                                                        </Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>

                                            <Form.Item
                                                name={[
                                                    "candidates",
                                                    index,
                                                    "address",
                                                ]}
                                                label={
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Residential Node
                                                    </span>
                                                }
                                                initialValue={candidate.address}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Required",
                                                    },
                                                ]}
                                            >
                                                <Input.TextArea
                                                    rows={3}
                                                    prefix={<HomeOutlined />}
                                                    className="rounded-3xl border-gray-100 bg-gray-50/30 p-6"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name={[
                                                    "candidates",
                                                    index,
                                                    "cover_letter",
                                                ]}
                                                label={
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        Professional Narrative
                                                    </span>
                                                }
                                            >
                                                <Input.TextArea
                                                    rows={4}
                                                    prefix={
                                                        <FileTextOutlined />
                                                    }
                                                    className="rounded-3xl border-gray-100 bg-gray-50/30 p-6"
                                                    placeholder="Final professional highlights..."
                                                />
                                            </Form.Item>
                                        </div>
                                    );
                                })}

                                <div className="bg-[#071C50] p-12 rounded-[56px] shadow-2xl shadow-blue-900/20 text-white space-y-10 relative overflow-hidden">
                                    <div className="absolute left-[-20px] top-[-20px] opacity-10">
                                        <LockOutlined className="text-[120px]" />
                                    </div>

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 rounded-[20px] bg-white/10 flex items-center justify-center border border-white/20">
                                            <InfoCircleOutlined className="text-xl text-blue-200" />
                                        </div>
                                        <h3 className="text-xl font-black tracking-widest uppercase m-0 italic">
                                            System Lockdown
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                                        <Form.Item
                                            name="freeze_time"
                                            label={
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                                    Freeze Interval (Months)
                                                </span>
                                            }
                                            className="mb-0"
                                        >
                                            <Input
                                                type="number"
                                                className="h-16 bg-white/5 border-white/10 text-white text-xl font-black rounded-[24px] px-8 focus:bg-white/10 transition-all placeholder-white/20"
                                                placeholder="e.g. 06"
                                            />
                                        </Form.Item>

                                        <div className="flex justify-end gap-6">
                                            <Button
                                                onClick={() => navigate(-1)}
                                                className="h-16 px-10 rounded-[24px] bg-white/5 hover:bg-white/10 text-white border-none font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Abort Registry
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                className="h-20 px-16 rounded-[28px] bg-white text-[#071C50] hover:scale-105 border-none font-black text-[11px] uppercase tracking-[0.35em] shadow-2xl shadow-blue-950 transition-all flex items-center gap-4"
                                            >
                                                TERMINATE JOB POST{" "}
                                                {loading ? (
                                                    <RocketOutlined spin />
                                                ) : (
                                                    <CheckCircleOutlined className="text-lg" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.8em] pt-8">
                                        Tactical Operations Environment
                                    </p>
                                </div>
                            </div>
                        </Form>
                    ) : (
                        <div className="bg-white p-20 rounded-[64px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200">
                                <UserOutlined className="text-5xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">
                                    Negative Engagement Registry
                                </h3>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 italic">
                                    Zero accepted candidates found for this post
                                    specification.
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate(-1)}
                                className="h-12 px-8 rounded-xl border-gray-200 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:border-blue-400 hover:text-blue-500"
                            >
                                Go Back
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-select-premium .ant-select-selector {
                    height: 56px !important;
                    border-radius: 16px !important;
                    border-color: #F3F4F6 !important;
                    background: transparent !important;
                    align-items: center !important;
                    font-weight: 500 !important;
                }
                .custom-badge-premium .ant-badge-count {
                    background: #1681FF !important;
                    font-family: inherit !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    font-size: 8px !important;
                    border-radius: 8px !important;
                    height: 24px !important;
                    line-height: 24px !important;
                    padding: 0 12px !important;
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(22, 129, 255, 0.3) !important;
                }
            `}</style>
        </Main>
    );
};

export default CloseParticularJob;
