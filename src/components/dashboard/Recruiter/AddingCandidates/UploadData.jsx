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
    id: propId, // Accept id as prop
    primary_skills,
    secondary_skills,
    draggedId,
    resume,
    setAddApplication,
    setResume,
    setDraggedId,
    replacement_id, // New prop
    isReplacement, // Add this
}) => {
    const { token, apiurl } = useAuth();
    const { id: paramId } = useParams();
    const id = propId || paramId; // Use prop id if available, else useParams
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

            if (replacement_id) {
                formData.append("replacement_id", replacement_id);
                formData.append("is_replacement", "true");
            } else if (isReplacement) {
                formData.append("is_replacement", "true");
            }

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
        <div className="bg-white rounded-[32px]  p-6 md:p-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Form Header */}
            <div className="mb-10 pb-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                        Job #{id}
                    </p>
                    <h1 className="text-3xl font-black text-slate-800 leading-tight">
                        Add Candidate Profile
                    </h1>
                    <p className="text-slate-400 font-medium text-xs mt-1">
                        Fill in the details below to register a new candidate
                    </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-400 border border-blue-100">
                    <UserOutlined className="text-xl" />
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                className="space-y-8"
            >
                {/* 1. Personal Information Card */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                            <IdcardOutlined className="text-blue-500 text-sm" />
                        </div>
                        <h2 className="text-sm font-black text-slate-700 m-0 uppercase tracking-wider">
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Full Name</span>}
                            name="candidate_name"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-slate-300" />}
                                placeholder="e.g. John Doe"
                                className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                                disabled={!!draggedId}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Email Address</span>}
                            name="candidate_email"
                            rules={[{ required: true, type: "email", message: "Valid email required" }]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-slate-300" />}
                                placeholder="john@example.com"
                                className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                                disabled={!!draggedId}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Primary Phone Number</span>}
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
                            label={<span className="text-[11px] font-bold text-slate-500">Alternate Phone Number</span>}
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
                <div className="space-y-5">
                    <div className="flex items-center gap-2.5 px-1">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                            <RocketOutlined className="text-amber-500 text-sm" />
                        </div>
                        <h2 className="text-sm font-black text-slate-700 m-0 uppercase tracking-wider">
                            Skills Assessment
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-blue-100">
                            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-widest m-0">
                                    Primary Skills
                                </h3>
                            </div>
                            <PrimarySkillsForm primarySkills={primary_skills} />
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200">
                            <div className="px-5 pt-5 pb-1 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest m-0">
                                    Secondary Skills
                                </h3>
                            </div>
                            <SecondarySkillsForm secondarySkills={secondary_skills} />
                        </div>
                    </div>
                </div>

                {/* 3. Work Experience Card */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <TrophyOutlined className="text-emerald-500 text-sm" />
                        </div>
                        <h2 className="text-sm font-black text-slate-700 m-0 uppercase tracking-wider">
                            Work Experience
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Current Status</span>}
                            name="job_status"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select
                                className="h-12 custom-select-premium"
                                placeholder="Select status"
                                onChange={(val) => setJobStatus(val)}
                            >
                                <Option value="available">Actively Searching</Option>
                                <Option value="not_available">Currently Employed</Option>
                            </Select>
                        </Form.Item>

                        {jobStatus === "not_available" && (
                            <>
                                <Form.Item
                                    label={<span className="text-[11px] font-bold text-slate-500">Current Company</span>}
                                    name="current_organization"
                                    rules={[{ required: true, message: "Required" }]}
                                >
                                    <Input
                                        prefix={<BankOutlined className="text-slate-300" />}
                                        className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<span className="text-[11px] font-bold text-slate-500">Job Type</span>}
                                    name="current_job_type"
                                >
                                    <Select className="h-12 custom-select-premium" placeholder="Contract type">
                                        <Option value="permanent">Full-Time</Option>
                                        <Option value="contract">Contract</Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Current City</span>}
                            name="current_job_location"
                        >
                            <Input
                                prefix={<GlobalOutlined className="text-slate-300" />}
                                className="h-12 rounded-xl border-slate-200 bg-white shadow-sm"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Notice Period</span>}
                            name="notice_period"
                        >
                            <InputNumber
                                min={0}
                                addonAfter={<span className="text-[10px] font-black">Days</span>}
                                className="h-12 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Date of Birth</span>}
                            name="date_of_birth"
                        >
                            <CustomDatePicker
                                className="h-12 w-full rounded-xl"
                                disabledDate={(current) =>
                                    current && current > dayjs().subtract(10, "year")
                                }
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Total Experience</span>}
                            name="experience"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                min={0}
                                max={50}
                                addonAfter={<span className="text-[10px] font-black">Years</span>}
                                className="h-12 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Current CTC</span>}
                            name="current_ctc"
                        >
                            <InputNumber
                                precision={2}
                                min={0}
                                addonAfter={<span className="text-[10px] font-black">LPA</span>}
                                className="h-12 custom-number-premium w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Expected CTC</span>}
                            name="expected_ctc"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                precision={2}
                                min={0}
                                addonAfter={<span className="text-[10px] font-black">LPA</span>}
                                className="h-12 custom-number-premium w-full"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 4. Education & Resume Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                            <CheckCircleOutlined className="text-violet-500 text-sm" />
                        </div>
                        <h2 className="text-sm font-black text-slate-700 m-0 uppercase tracking-wider">
                            Education & Resume
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Highest Qualification</span>}
                            name="highest_qualification"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <Select className="h-12 custom-select-premium" placeholder="Select qualification">
                                {educationLevels.map((item) => (
                                    <Option key={item.value} value={item.value}>
                                        {item.text}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-[11px] font-bold text-slate-500">Notice Period (Days)</span>}
                            name="joining_days_required"
                            rules={[{ required: true, message: "Required" }]}
                        >
                            <InputNumber
                                min={0}
                                addonAfter={<span className="text-[10px] font-black">Days</span>}
                                className="h-12 custom-number-premium w-full"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={<span className="text-[11px] font-bold text-slate-500">Resume</span>}
                        name="resume"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) return e;
                            return e?.fileList;
                        }}
                        rules={[{ required: true, message: "Document required" }]}
                    >
                        <Upload.Dragger
                            beforeUpload={() => false}
                            accept=".pdf,.doc,.docx"
                            maxCount={1}
                            disabled={resumeUploadDisabled}
                            className={`!border-2 !border-dashed !rounded-2xl !bg-slate-50 ${
                                resumeUploadDisabled
                                    ? "opacity-50"
                                    : "hover:!bg-blue-50 hover:!border-blue-300"
                            } transition-all`}
                        >
                            <p className="ant-upload-drag-icon">
                                <FilePdfOutlined className="text-blue-400 text-3xl" />
                            </p>
                            <p className="text-slate-600 font-bold text-sm">
                                Upload Resume
                            </p>
                            <p className="text-slate-400 text-[10px] font-semibold mt-1">
                                PDF or Word — max 1 file
                            </p>
                        </Upload.Dragger>
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[11px] font-bold text-slate-500">Additional Details</span>}
                        name="other_details"
                    >
                        <Input.TextArea
                            rows={4}
                            className="rounded-xl border-slate-200 bg-slate-50 text-slate-600 p-4"
                            placeholder="Enter any other relevant details..."
                        />
                    </Form.Item>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end gap-4 border-t border-slate-100">
                        <Button
                            onClick={() => setAddApplication(false)}
                            className="h-12 px-8 rounded-xl border-2 border-red-200 text-red-400 hover:border-red-400 hover:text-red-600 font-black text-xs uppercase tracking-wider transition-all bg-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="h-12 px-10 rounded-xl bg-[#071C50] hover:bg-[#1681FF] border-none font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
                        >
                            Add Candidate
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
                    height: 48px !important;
                }
                .phone-input-custom {
                    width: 100% !important;
                    height: 48px !important;
                    border-radius: 12px !important;
                    border-color: #e2e8f0 !important;
                    background: white !important;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    padding-left: 58px !important;
                }
                .phone-button-custom {
                    border-radius: 12px 0 0 12px !important;
                    border-color: #e2e8f0 !important;
                    background: transparent !important;
                    width: 48px !important;
                }
                .custom-select-premium .ant-select-selector {
                    height: 48px !important;
                    border-radius: 12px !important;
                    border-color: #e2e8f0 !important;
                    align-items: center !important;
                    background: white !important;
                }
                .custom-number-premium {
                    height: 48px !important;
                    border-radius: 12px !important;
                    border-color: #e2e8f0 !important;
                }
                .custom-number-premium input {
                    height: 46px !important;
                }
                .custom-number-black {
                    height: 48px !important;
                    border-radius: 12px !important;
                    border-color: #e2e8f0 !important;
                }
                .custom-number-black input {
                    height: 46px !important;
                }
            `}</style>
        </div>
    );
};

export default UploadData;
