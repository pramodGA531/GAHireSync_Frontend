import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    message,
    Divider,
} from "antd";
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    GlobalOutlined,
    IdcardOutlined,
    CalendarOutlined,
    TrophyOutlined,
    DollarOutlined,
    RocketOutlined,
    CheckCircleOutlined,
    BankOutlined,
    InfoCircleOutlined,
    FilePdfOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";
import PrimarySkillsForm from "./PrimarySkills";
import SecondarySkillsForm from "./SecondarySkills";
import CustomDatePicker from "../../../common/CustomDatePicker";
import dayjs from "dayjs";
import Btnloading from "../../../common/loading/Btnloading";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const educationLevels = [
    { value: "associate-degree", text: "Associate Degree" },
    { value: "bachelors-degree", text: "Bachelor's Degree" },
    { value: "post-graduate-diploma", text: "Post-Graduate Diploma" },
    { value: "professional-certification", text: "Professional Certification" },
    { value: "masters-degree", text: "Master's Degree" },
    { value: "doctoral-degree", text: "Doctoral Degree (Ph.D., Ed.D., etc.)" },
    {
        value: "professional-degree",
        text: "Professional Degree (MD, JD, DDS, etc.)",
    },
    { value: "post-doctoral", text: "Post-Doctoral Studies" },
    { value: "no-formal-education", text: "No Formal Education" },
    { value: "pre-primary-education", text: "Pre-Primary Education" },
    { value: "primary-education", text: "Primary Education" },
    { value: "middle-school", text: "Middle School" },
    {
        value: "secondary-education",
        text: "Secondary Education or High School",
    },
    { value: "ged", text: "GED (General Educational Development)" },
    { value: "vocational-qualification", text: "Vocational Qualification" },
    { value: "technical-education", text: "Technical Education" },
    { value: "certificate-program", text: "Certificate Program" },

    { value: "other", text: "Other" },
];

const { Option } = Select;

const UploadData = ({
    primary_skills,
    secondary_skills,
    draggedId,
    resume,
    setAddApplication,
    setResume,
    setDraggedId,
}) => {
    const { token, apiurl } = useAuth();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [jobStatus, setJobStatus] = useState("");
    const [applicationData, setApplicationData] = useState();
    const [form] = Form.useForm();
    const [resumeUploadDisabled, setResumeUploadDisabled] = useState(false);

    useEffect(() => {
        if (draggedId) fetchApplicationDetails(draggedId);
    }, [draggedId]);

    const fetchApplicationDetails = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/recruiter/organization-applications/?application_id=${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await response.json();
            if (data.error) message.error(data.error);
            else setApplicationData(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (resume) {
            setResumeUploadDisabled(true);
            form.setFieldsValue({ resume: [resume] });
        }
    }, [resume, form]);

    useEffect(() => {
        if (applicationData && Object.keys(applicationData).length > 0) {
            form.setFieldsValue({
                ...applicationData,
                date_of_birth: applicationData.date_of_birth
                    ? dayjs(applicationData.date_of_birth)
                    : null,
                experience: applicationData.experience || 0,
                current_ctc: applicationData.current_ctc || 0,
                expected_ctc: applicationData.expected_ctc || 0,
                resume: applicationData.resume
                    ? [
                          {
                              uid: "-1",
                              name: `${applicationData.candidate_name}.pdf`,
                              status: "done",
                              url: `${apiurl}/${applicationData.resume}`,
                          },
                      ]
                    : [],
            });
            setJobStatus(applicationData.job_status || "");
        }
    }, [applicationData, form, apiurl]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();

            if (!draggedId) {
                if (values.resume && values.resume.length > 0) {
                    const file = values.resume[0];
                    if (file.originFileObj)
                        formData.append("resume", file.originFileObj);
                    else if (file instanceof File)
                        formData.append("resume", file);
                } else {
                    message.error("Resume document required.");
                    setLoading(false);
                    return;
                }
            } else {
                formData.append("application_id", draggedId);
            }

            const primarySkillsArray =
                values.primary_skills?.map((item) => [
                    item.skill_name || "",
                    item.metric_type || "",
                    item.metric_type === "rating" ? item.rating || 0 : null,
                    { is_primary: true },
                    item.metric_type === "experience"
                        ? item.experience || ""
                        : "",
                    item.metric_value || "",
                ]) || [];

            const secondarySkillsArray =
                values.secondary_skills?.map((item) => [
                    item.skill_name || "",
                    item.metric_type || "",
                    item.metric_type === "rating" ? item.rating || 0 : null,
                    { is_primary: false },
                    item.metric_type === "experience"
                        ? item.experience || ""
                        : "",
                    item.metric_value || "",
                ]) || [];

            Object.keys(values).forEach((key) => {
                if (key === "primary_skills")
                    formData.append(key, JSON.stringify(primarySkillsArray));
                else if (key === "secondary_skills")
                    formData.append(key, JSON.stringify(secondarySkillsArray));
                else if (key === "date_of_birth")
                    formData.append(
                        key,
                        values[key]
                            ? dayjs(values[key]).format("YYYY-MM-DD")
                            : "",
                    );
                else if (key !== "resume")
                    formData.append(key, values[key] || "");
            });

            const response = await fetch(
                `${apiurl}/recruiter/create-candidate/?id=${id}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                },
            );

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();

                if (!response.ok || result.error) {
                    message.error(
                        result.error ||
                            result.detail ||
                            "Server reported an error",
                    );
                    return; // ⛔ stop here on error
                }

                // ✅ success case
                message.success("Candidate profile added successfully.");
                form.resetFields();
                setAddApplication(false);
                setResume(undefined);
                setDraggedId(undefined);
            } else {
                const text = await response.text();

                if (response.status === 500) {
                    message.error(
                        "Internal Server Error (500). Please check backend logs.",
                    );
                } else if (response.status === 404) {
                    message.error("Endpoint not found (404).");
                } else {
                    message.error(
                        `Unexpected response: ${response.status} ${response.statusText}`,
                    );
                }

                console.error("Server Error Response:", text);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            message.error(`System failure: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-50 rounded-[40px] shadow-2xl p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Form Header */}
            <div className="mb-12 border-b border-gray-50 pb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-[#071C50] mb-2">
                        Add Candidate Profile
                    </h1>
                    <p className="text-gray-400 font-bold text-[10px]">
                        New Candidate Registration for Job #{id}
                    </p>
                </div>
                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[#1681FF] shadow-inner">
                    <UserOutlined className="text-2xl" />
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                className="space-y-12"
            >
                {/* 1. Primary Identification Card */}
                <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100/50 space-y-8">
                    <div className="flex items-center gap-3">
                        <IdcardOutlined className="text-blue-500" />
                        <h2 className="text-lg font-black text-[#071C50] m-0">
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Full Name
                                </span>
                            }
                            name="candidate_name"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-300" />
                                }
                                placeholder="e.g. John Doe"
                                className="h-14 rounded-2xl border-gray-100 shadow-sm focus:border-blue-400"
                                disabled={!!draggedId}
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Email Address
                                </span>
                            }
                            name="candidate_email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Valid email required",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <MailOutlined className="text-gray-300" />
                                }
                                placeholder="john@example.com"
                                className="h-14 rounded-2xl border-gray-100 shadow-sm focus:border-blue-400"
                                disabled={!!draggedId}
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Primary Phone Number
                                </span>
                            }
                            name="contact_number"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <PhoneInput
                                country={"in"}
                                containerClass="phone-container-custom"
                                inputClass="phone-input-custom"
                                buttonClass="phone-button-custom"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Alternate Phone Number
                                </span>
                            }
                            name="alternate_contact_number"
                        >
                            <PhoneInput
                                country={"in"}
                                containerClass="phone-container-custom"
                                inputClass="phone-input-custom"
                                buttonClass="phone-button-custom"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 2. Skills Assessment Card */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <RocketOutlined className="text-amber-500" />
                        <h2 className="text-lg font-black text-[#071C50] m-0">
                            Skills Assessment
                        </h2>
                    </div>

                    <div className="space-y-10">
                        <div className="bg-white p-2 rounded-[32px] border border-gray-100">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="text-[10px] font-black text-[#1681FF]">
                                    Primary Skills
                                </h3>
                            </div>
                            <PrimarySkillsForm primarySkills={primary_skills} />
                        </div>

                        <div className="bg-white p-2 rounded-[32px] border border-gray-100">
                            <div className="px-6 pt-6 pb-2">
                                <h3 className="text-[10px] font-black text-gray-400">
                                    Secondary Skills
                                </h3>
                            </div>
                            <SecondarySkillsForm
                                secondarySkills={secondary_skills}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Professional History Card */}
                <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100/50 space-y-10">
                    <div className="flex items-center gap-3">
                        <TrophyOutlined className="text-green-500" />
                        <h2 className="text-lg font-black text-[#071C50] m-0">
                            Work Experience
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Current Status
                                </span>
                            }
                            name="job_status"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select
                                className="h-14 custom-select-premium"
                                placeholder="Select status"
                                onChange={(val) => setJobStatus(val)}
                            >
                                <Option value="available">
                                    Actively Searching
                                </Option>
                                <Option value="not_available">
                                    Currently Employed
                                </Option>
                            </Select>
                        </Form.Item>

                        {jobStatus === "not_available" && (
                            <>
                                <Form.Item
                                    label={
                                        <span className="text-[10px] font-black text-gray-400">
                                            Current Company
                                        </span>
                                    }
                                    name="current_organization"
                                    rules={[
                                        { required: true, message: "Required" },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <BankOutlined className="text-gray-300" />
                                        }
                                        className="h-14 rounded-2xl border-gray-100 shadow-sm"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={
                                        <span className="text-[10px] font-black text-gray-400">
                                            Job Type
                                        </span>
                                    }
                                    name="current_job_type"
                                >
                                    <Select
                                        className="h-14 custom-select-premium"
                                        placeholder="Contract type"
                                    >
                                        <Option value="permanent">
                                            Full-Time
                                        </Option>
                                        <Option value="contract">
                                            Contract
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Current City
                                </span>
                            }
                            name="current_job_location"
                        >
                            <Input
                                prefix={
                                    <GlobalOutlined className="text-gray-300" />
                                }
                                className="h-14 rounded-2xl border-gray-100 shadow-sm"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Notice Period
                                </span>
                            }
                            name="notice_period"
                        >
                            <InputNumber
                                min={0}
                                addonAfter={
                                    <span className="text-[10px] font-black">
                                        Days
                                    </span>
                                }
                                className="h-14 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Date of Birth
                                </span>
                            }
                            name="date_of_birth"
                        >
                            <CustomDatePicker
                                className="h-14 w-full rounded-2xl"
                                disabledDate={(current) =>
                                    current &&
                                    current > dayjs().subtract(10, "year")
                                }
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Total Experience
                                </span>
                            }
                            name="experience"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                min={0}
                                max={50}
                                addonAfter={
                                    <span className="text-[10px] font-black">
                                        Years
                                    </span>
                                }
                                className="h-14 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Current CTC
                                </span>
                            }
                            name="current_ctc"
                        >
                            <InputNumber
                                precision={2}
                                min={0}
                                addonAfter={
                                    <span className="text-[10px] font-black">
                                        LPA
                                    </span>
                                }
                                className="h-14 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-gray-400">
                                    Expected CTC
                                </span>
                            }
                            name="expected_ctc"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                precision={2}
                                min={0}
                                addonAfter={
                                    <span className="text-[10px] font-black">
                                        LPA
                                    </span>
                                }
                                className="h-14 custom-number-premium w-full"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 4. Credentials & Assets Card */}
                <div className="border-2 border-gray-200 text-black p-10 rounded-[40px] shadow-2xl shadow-blue-200 space-y-10">
                    <div className="flex items-center gap-3">
                        <CheckCircleOutlined className="text-black" />
                        <h2 className="text-lg font-black text-black m-0">
                            Education & Resume
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-black ">
                                    Highest Qualification
                                </span>
                            }
                            name="highest_qualification"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select
                                className="h-14 custom-select-premium"
                                placeholder="Select qualification"
                            >
                                {educationLevels.map((item) => (
                                    <Option key={item.value} value={item.value}>
                                        {item.text}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={
                                <span className="text-[10px] font-black text-black">
                                    Notice Period (Days)
                                </span>
                            }
                            name="joining_days_required"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                min={0}
                                addonAfter={
                                    <span className="text-[10px] font-black">
                                        Days
                                    </span>
                                }
                                className="h-14 custom-number-black w-full"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={
                            <span className="text-[10px] font-black text-black">
                                Resume
                            </span>
                        }
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e?.fileList;
                        }}
                        rules={[
                            { required: true, message: "Document required" },
                        ]}
                    >
                        <Upload.Dragger
                            beforeUpload={() => false}
                            accept=".pdf,.doc,.docx"
                            maxCount={1}
                            disabled={resumeUploadDisabled}
                            className={`bg-white/10 border-dashed border-white/30 rounded-3xl ${
                                resumeUploadDisabled
                                    ? "opacity-50"
                                    : "hover:bg-white/20 hover:border-white"
                            } transition-all`}
                        >
                            <p className="ant-upload-drag-icon">
                                <FilePdfOutlined className="text-black text-3xl" />
                            </p>
                            <p className="text-black font-bold text-sm">
                                Upload Resume
                            </p>
                            <p className="text-black/40 text-[10px] font-black  mt-2 px-10">
                                Select a PDF or Word file
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        label={
                            <span className="text-[10px] font-black text-black">
                                Additional Details
                            </span>
                        }
                        name="other_details"
                    >
                        <Input.TextArea
                            rows={4}
                            className="bg-white/10 border-white/20 text-black placeholder-black/30 rounded-3xl p-6"
                            placeholder="Enter any other relevant details..."
                        />
                    </Form.Item>

                    <div className="pt-6 flex justify-end gap-6">
                        <Button
                            onClick={() => setAddApplication(false)}
                            className="h-16 px-10 rounded-2xl text-lg bg-white/10 hover:bg-white/20 border-2 border-red-500 hover:border-red-700 transition-all text-red-500 hover:text-red-700 hover:shadow-xl "
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="h-16 px-16 rounded-2xl bg-white text-[#1681FF] hover:scale-105 shadow-xl shadow-blue-900 border-none font-black text-[10px] transition-all"
                        >
                            Add Candidate profile{" "}
                            {loading ? (
                                <Btnloading spincolor="blue-spinner" />
                            ) : (
                                <RocketOutlined />
                            )}
                        </Button>
                    </div>
                </div>
            </Form>

            <style>{`
                .phone-container-custom {
                    width: 100% !important;
                    height: 56px !important;
                }
                .phone-input-custom {
                    width: 100% !important;
                    height: 56px !important;
                    border-radius: 16px !important;
                    border-color: #f3f4f6 !important;
                    background: white !important;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    padding-left: 58px !important;
                }
                .phone-button-custom {
                    border-radius: 16px 0 0 16px !important;
                    border-color: #f3f4f6 !important;
                    background: transparent !important;
                    width: 48px !important;
                }
                .custom-select-premium .ant-select-selector {
                    height: 56px !important;
                    border-radius: 16px !important;
                    border-color: #f3f4f6 !important;
                    align-items: center !important;
                }
                .custom-number-premium {
                    height: 56px !important;
                    border-radius: 16px !important;
                    border-color: #f3f4f6 !important;
                }
                .custom-number-premium input {
                    height: 54px !important;
                }
                .custom-select-white .ant-select-selector {
                   background: rgba(255, 255, 255, 0.1) !important;
                   border-color: rgba(255, 255, 255, 0.2) !important;
                   color: white !important;
                   height: 56px !important;
                   border-radius: 16px !important;
                   align-items: center !important;
                }
                .custom-number-white {
                     background: rgba(255, 255, 255, 0.1) !important;
                     border-color: rgba(255, 255, 255, 0.2) !important;
                     color: white !important;
                     height: 56px !important;
                     border-radius: 16px !important;
                }
                .custom-number-white input {
                     height: 54px !important;
                     color: white !important;
                }
                .custom-number-white .ant-input-number-group-addon {
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: white !important;
                    border-color: rgba(255, 255, 255, 0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default UploadData;
