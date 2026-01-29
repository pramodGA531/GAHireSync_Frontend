import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import { Form, Input, Select, Button, Checkbox, message } from "antd";

import Main from "../Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";

const { TextArea } = Input;
const { Option } = Select;
const apiurl = import.meta.env.VITE_BACKEND_URL;

const jobLevels = ["Entry", "Mid", "Senior", "Lead"];
const jobTypeItems = ["Full Time", "Part Time", "Intern", "Consultant"];
const internTimePeriod = [
    "1 Month",
    "2 Months",
    "3 Months",
    "4 Months",
    "5 Months",
    "6 Months",
    "7 Months",
    "8 Months",
    "9 Months",
    "10 Months",
    "11 Months",
    "1 Year",
];

const probationPeriodItems = [
    "1 Month",
    "2 Months",
    "3 Months",
    "4 Months",
    "5 Months",
    "6 Months",
    "7 Months",
    "8 Months",
    "9 Months",
    "10 Months",
    "11 Months",
    "1 Year",
    "1 and half Year",
    "2 Years",
    "None",
];

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [form] = Form.useForm();
    const [probationTime, setProbationTime] = useState("");
    const [internTime, setInternTime] = useState("");
    const [consultantTime, setConsultantTime] = useState("");
    const [changes, setChanges] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    // New states for added fields
    const [noticePeriod, setNoticePeriod] = useState("");
    const [rotationalShift, setRotationalShift] = useState(false);

    const [job, setJob] = useState({
        job_id: id,
        job_title: "",
        job_description: "",
        primary_skills: "",
        secondary_skills: "",
        years_of_experience: "1,3",
        ctc: "",
        rounds_of_interview: 0,
        interviewers: [],
        interviewer_emails: [],
        job_locations: [],
        job_type: "",
        job_level: "",
        qualifications: "",
        timings: "",
        other_benefits: "",
        working_days_per_week: 5,
        interview_process: "",
        decision_maker: "",
        bond: "",
        rotational_shift: false,
        age: "",
        differently_abled: "",
        gender: "",
        languages: "",
        notice_time: "",
        notice_period: "",
        time_period: "",
        visa_status: "",
        intern_time_period: "",
        consultant_time_period: "",
        probation_time_period: "",
        job_department: "",
        industry: "",
        passport_availability: 0,
        job_close_duration: "",
        decision_maker_email: "",
    });

    const renderJobTypeFields = (jobType) => {
        switch (jobType) {
            case "Full Time":
                return (
                    <Form.Item
                        label="Probation Period"
                        name="probation_time_period"
                        rules={[
                            {
                                required: true,
                                message: "Please select the below options",
                            },
                        ]}
                    >
                        <Select
                            onChange={setProbationTime}
                            options={probationPeriodItems.map((val) => ({
                                label: val,
                                value: val,
                            }))}
                        />
                    </Form.Item>
                );
            case "Intern":
                return (
                    <Form.Item
                        label="Intern Time Period"
                        name="intern_time_period"
                        rules={[
                            {
                                required: true,
                                message: "Please select the below options",
                            },
                        ]}
                    >
                        <Select
                            onChange={setInternTime}
                            options={internTimePeriod.map((val) => ({
                                label: val,
                                value: val,
                            }))}
                        />
                    </Form.Item>
                );
            case "Consultant":
                return (
                    <Form.Item
                        label="Consultant Time Period"
                        name="consultant_time_period"
                        rules={[
                            {
                                required: true,
                                message: "Please select the below options",
                            },
                        ]}
                    >
                        <Input onChange={setConsultantTime}></Input>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            // Using Client Endpoint
            const response = await fetch(`${apiurl}/job-details?job_id=${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            // Adapt data structure if needed, assuming data.job is the object
            const jobData = data.job || data;

            if (jobData.error) {
                message.error(jobData.error);
                return navigate(-1);
            }
            setJob(jobData);
            setLocations(jobData.locations || []);

            // Set initial states
            setRotationalShift(jobData.rotational_shift || false);
            setNoticePeriod(jobData.notice_period || "");

            if (jobData.job_type === "Full Time") {
                form.setFieldsValue({
                    probation_time_period: jobData.time_period,
                });
            } else if (jobData.job_type === "Intern") {
                form.setFieldsValue({
                    intern_time_period: jobData.time_period,
                });
            } else if (jobData.job_type === "Consultant") {
                form.setFieldsValue({
                    consultant_time_period: jobData.time_period,
                });
            }

            form.setFieldsValue(jobData);
        } catch (e) {
            console.error("Error fetching job details ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChanges((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationChange = (updatedItem) => {
        setLocations((prev) => {
            const existingIndex = prev.findIndex(
                (loc) => loc.id === updatedItem.id,
            );

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = updatedItem;
                return updated;
            } else {
                return [...prev, updatedItem];
            }
        });
        console.log(locations);
    };

    const handleSubmit = async (values) => {
        console.log("Edit Job Request - Log Only");

        if (changes["job_type"]) {
            const jobType = changes["job_type"];
            const timePeriodMap = {
                Intern: internTime,
                "Full Time": probationTime,
                Consultant: consultantTime,
            };
            const time_period = timePeriodMap[jobType] || "";
            changes["time_period"] = time_period;
        }

        // Add locations to changes if modified
        if (locations.length > 0) {
            changes["job_locations"] = locations;
        }

        const payload = {
            changes: changes,
            organization_id: job.organization.id,
            // primarySkills: values.primary_skills,
            // secondarySkills: values.secondary_skills,
        };
        try {
            console.log("PAYLOAD TO BE SENT:", payload);
            message.success("Request Sent");
            // navigate(-1);
            const response = await fetch(
                `${apiurl}/job/posting/is_editted_by_client/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                },
            );
            const data = await response.json();
            console.log("Response:", data);
            const updateToggle = await fetch(
                `${apiurl}/job/posting/is_editted_by_client/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ is_editted_by_client: true }),
                },
            );
            const updateToggleData = await updateToggle.json();
            console.log("Update Toggle Response:", updateToggleData);
            navigate(-1);
            // if (data.success && updateToggleData.success) {
            //     message.success("Job Updated Successfully");
            //     navigate(-1);
            // }
        } catch (e) {
            console.log(e);
        } finally {
            setBtnLoading(false);
        }
    };

    const handleQuillChange = (value) => {
        setChanges((prev) => ({
            ...prev,
            job_description: value,
        }));
    };

    return (
        <Main defaultSelectedKey="2" className="no-overflow">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            {loading ? (
                <Pageloading />
            ) : (
                <div classname="m-8">
                    <div className="text-[#171A1F] text-[20px] font-semibold">
                        Edit job post :{" "}
                        <span className="text-blue-500">
                            {job && job?.job_title}
                        </span>
                    </div>
                    {job && (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            style={{ margin: "0 auto" }}
                            scrollToFirstError={{ behavior: "smooth" }}
                        >
                            <div className="job-details">
                                <Form.Item label="Job Title" name="job_title">
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item label="Job Code" name="jobcode">
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item
                                    label="Job Department"
                                    name="job_department"
                                    disabled
                                >
                                    <Input disabled />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Job Description"
                                name="job_description"
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={changes.job_description || ""}
                                    onChange={handleQuillChange}
                                    style={{
                                        height: "300px",
                                        overflowY: "auto",
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="Job Level" name="job_level">
                                <Select
                                    placeholder="Select job level"
                                    onChange={(value) => {
                                        setChanges((self) => ({
                                            ...self,
                                            job_level: value,
                                        }));
                                    }}
                                >
                                    {jobLevels.map((level) => (
                                        <Option key={level} value={level}>
                                            {level}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Job Type"
                                name="job_type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter job type",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Choose the job Type"
                                    onChange={(value) => {
                                        setChanges((self) => ({
                                            ...self,
                                            job_type: value,
                                        }));
                                    }}
                                >
                                    {jobTypeItems.map((val) => (
                                        <Option value={val} key={val}>
                                            {val}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prev, curr) =>
                                    prev.job_type !== curr.job_type
                                }
                            >
                                {({ getFieldValue }) =>
                                    renderJobTypeFields(
                                        getFieldValue("job_type"),
                                    )
                                }
                            </Form.Item>

                            <Form.List name="primary_skills">
                                {(fields, { add, remove }) => (
                                    <>
                                        <label>Primary Skills</label>
                                        {fields.map(
                                            (
                                                { key, name, ...restField },
                                                index,
                                            ) => (
                                                <div
                                                    key={key}
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        marginBottom: "10px",
                                                    }}
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "skill_name",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input
                                                            placeholder="Skill Name"
                                                            disabled
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "metric_type",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Select
                                                            placeholder="Select Metric Type"
                                                            disabled
                                                        >
                                                            <Select.Option value="rating">
                                                                Rating
                                                            </Select.Option>
                                                            <Select.Option value="experience">
                                                                Experience
                                                            </Select.Option>
                                                        </Select>
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "metric_value",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input
                                                            placeholder="Metric Value"
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </div>
                                            ),
                                        )}
                                    </>
                                )}
                            </Form.List>

                            <Form.List name="secondary_skills">
                                {(fields, { add, remove }) => (
                                    <>
                                        <div>Secondary Skills</div>
                                        {fields.map(
                                            ({ key, name, ...restField }) => (
                                                <div
                                                    key={key}
                                                    style={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        marginBottom: "5px",
                                                    }}
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "skill_name",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input
                                                            placeholder="Skill Name"
                                                            disabled
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "metric_type",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Select
                                                            placeholder="Select Metric Type"
                                                            disabled
                                                        >
                                                            <Select.Option value="rating">
                                                                Rating
                                                            </Select.Option>
                                                            <Select.Option value="experience">
                                                                Experience
                                                            </Select.Option>
                                                        </Select>
                                                    </Form.Item>

                                                    <Form.Item
                                                        {...restField}
                                                        name={[
                                                            name,
                                                            "metric_value",
                                                        ]}
                                                        style={{ flex: 1 }}
                                                    >
                                                        <Input
                                                            placeholder="Metric Value"
                                                            disabled
                                                        />
                                                    </Form.Item>
                                                </div>
                                            ),
                                        )}
                                    </>
                                )}
                            </Form.List>

                            <Form.Item
                                label="Qualifications"
                                name="qualifications"
                            >
                                <Input
                                    name="qualifications"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="Age" name="age">
                                <Input
                                    name="age"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="Bond" name="bond">
                                <Input
                                    name="bond"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Different Abled"
                                name="differently_abled"
                            >
                                <Select
                                    placeholder="Select below"
                                    onChange={(value) => {
                                        setChanges((self) => ({
                                            ...self,
                                            differently_abled: value,
                                        }));
                                    }}
                                >
                                    <Option key="Yes" value="Yes">
                                        Yes (Only for differently abled)
                                    </Option>
                                    <Option key="No" value="No">
                                        No
                                    </Option>
                                    <Option key="No Mention" value="No Mention">
                                        No Mention
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Gender" name="gender">
                                <Select
                                    placeholder="Select any gender requirements"
                                    onChange={(value) => {
                                        setChanges((self) => ({
                                            ...self,
                                            gender: value,
                                        }));
                                    }}
                                >
                                    <Option key="Male" value="Male">
                                        Male
                                    </Option>
                                    <Option key="Female" value="Female">
                                        Female
                                    </Option>
                                    <Option key="Others" value="Others">
                                        Others
                                    </Option>
                                    <Option key="No Mention" value="No Mention">
                                        No Mention
                                    </Option>
                                    <Option
                                        key="Both Male and Female"
                                        value="Both Male and Female"
                                    >
                                        Both Male and Female
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Industry" name="industry">
                                <Input
                                    name="industry"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Job Locations"
                                name="job_locations"
                            >
                                {job?.locations?.map((item, index) => (
                                    <Input.Group
                                        compact
                                        key={item.id || index}
                                        style={{ marginBottom: "8px" }}
                                    >
                                        {/* Location Name */}
                                        <Input
                                            style={{ width: "20%" }}
                                            placeholder="Location Name"
                                            disabled
                                            defaultValue={item.location}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...item,
                                                    location: e.target.value,
                                                };
                                                handleLocationChange(updated);
                                            }}
                                        />
                                        {/* State */}
                                        <Input
                                            style={{ width: "20%" }}
                                            placeholder="State"
                                            disabled
                                            defaultValue={item.state}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...item,
                                                    state: e.target.value,
                                                };
                                                handleLocationChange(updated);
                                            }}
                                        />

                                        {/* Country */}
                                        <Input
                                            style={{ width: "20%" }}
                                            placeholder="Country"
                                            disabled
                                            defaultValue={item.country}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...item,
                                                    country: e.target.value,
                                                };
                                                handleLocationChange(updated);
                                            }}
                                        />

                                        {/* Location Type */}
                                        <Select
                                            style={{ width: "20%" }}
                                            placeholder="Location Type"
                                            disabled
                                            defaultValue={item.job_type}
                                            onChange={(value) => {
                                                const updated = {
                                                    ...item,
                                                    job_type: value,
                                                };
                                                handleLocationChange(updated);
                                            }}
                                        >
                                            <Select.Option value="WFO">
                                                Work From Office
                                            </Select.Option>
                                            <Select.Option value="WFH">
                                                Work From Home
                                            </Select.Option>
                                            <Select.Option value="Hybrid">
                                                Hybrid
                                            </Select.Option>
                                        </Select>

                                        {/* Positions */}
                                        <Input
                                            type="number"
                                            min={1}
                                            style={{ width: "10%" }}
                                            placeholder="Positions"
                                            disabled
                                            defaultValue={item.positions}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...item,
                                                    positions: Number(
                                                        e.target.value,
                                                    ),
                                                };
                                                handleLocationChange(updated);
                                            }}
                                        />
                                    </Input.Group>
                                ))}
                            </Form.Item>

                            <Form.Item label="Languages" name="languages">
                                <Input
                                    name="languages"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Notice Period"
                                name="notice_period"
                                rules={[
                                    {
                                        required: true,
                                        message: "Select a Notice Period",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select a notice period"
                                    onChange={(e) => {
                                        setNoticePeriod(e);
                                        setChanges((self) => ({
                                            ...self,
                                            notice_period: e,
                                        }));
                                    }}
                                >
                                    <Option
                                        key="serving_notice"
                                        value="serving_notice"
                                    >
                                        Serving notice
                                    </Option>
                                    <Option
                                        key="need_to_serve_notice"
                                        value="need_to_serve_notice"
                                    >
                                        Need to serve notice
                                    </Option>
                                    <Option
                                        key="immediate_joining"
                                        value="immediate_joining"
                                    >
                                        Immediate Joining
                                    </Option>
                                </Select>
                            </Form.Item>
                            {noticePeriod === "need_to_serve_notice" && (
                                <Form.Item
                                    label="Notice Time Period"
                                    name="notice_time"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Select a Time Period",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Select a Time period"
                                        onChange={(value) => {
                                            setChanges((self) => ({
                                                ...self,
                                                notice_time: value,
                                            }));
                                        }}
                                    >
                                        <Option key="15" value="15">
                                            15 Days
                                        </Option>
                                        <Option key="30" value="30">
                                            30 Days
                                        </Option>
                                        <Option key="45" value="45">
                                            45 Days
                                        </Option>
                                        <Option key="2M" value="2M">
                                            2 Months{" "}
                                        </Option>
                                        <Option key="6M" value="6M">
                                            6 Months{" "}
                                        </Option>
                                    </Select>
                                </Form.Item>
                            )}
                            <Form.Item
                                label="Other Benefits"
                                name="other_benefits"
                            >
                                <TextArea
                                    name="other_benefits"
                                    rows={2}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Rotational Shift"
                                name="rotational_shift"
                                valuePropName="checked"
                            >
                                <Checkbox
                                    name="rotational_shift"
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setRotationalShift(checked);
                                        setChanges((prev) => ({
                                            ...prev,
                                            rotational_shift: checked,
                                        }));
                                    }}
                                >
                                    {rotationalShift ? "Yes" : "No"}
                                </Checkbox>
                            </Form.Item>
                            <Form.Item label="Timings" name="timings">
                                <Input
                                    name="timings"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Visa Status" name="visa_status">
                                <Input
                                    name="visa_status"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Passport Availability"
                                name="passport_availability"
                            >
                                <Select
                                    placeholder="Select"
                                    value={job?.passport_availability ? 1 : 0}
                                    onChange={(value) => {
                                        handleInputChange({
                                            target: {
                                                name: "passport_availability",
                                                value,
                                            },
                                        });
                                        setJob((prev) => ({
                                            ...prev,
                                            passport_availability: value,
                                        }));
                                    }}
                                >
                                    <Select.Option value={1}>Yes</Select.Option>
                                    <Select.Option value={0}>No</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Job Close Date"
                                name="job_close_duration"
                            >
                                <Input
                                    name="job_close_duration"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                ></Input>
                            </Form.Item>
                            <Form.Item
                                label="Working Days per Week"
                                name="working_days_per_week"
                            >
                                <Input
                                    type="number"
                                    min={1}
                                    max={7}
                                    name="working_days_per_week"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Decision Maker"
                                name="decision_maker"
                            >
                                <Input
                                    name="decision_maker"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Decision Maker Email"
                                name="decision_maker_email"
                            >
                                <Input
                                    name="decision_maker_email"
                                    type="email"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Years Of Experience"
                                name="years_of_experience"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please select the below options",
                                    },
                                ]}
                            >
                                <Input.Group compact>
                                    {/* Min Years */}
                                    <Input
                                        style={{ width: "20%" }}
                                        type="number"
                                        step="0.5"
                                        placeholder="Min years"
                                        suffix="Years"
                                        value={
                                            changes?.years_of_experience
                                                ? changes.years_of_experience.split(
                                                      ",",
                                                  )[0]
                                                : job?.years_of_experience?.split(
                                                      ",",
                                                  )[0] || ""
                                        }
                                        onChange={(e) => {
                                            const minValue = e.target.value;
                                            const maxValue =
                                                job?.job_title !== "" &&
                                                changes?.years_of_experience
                                                    ? changes.years_of_experience.split(
                                                          ",",
                                                      )[1]
                                                    : job?.years_of_experience?.split(
                                                          ",",
                                                      )[1] || "";

                                            const updatedValue = `${minValue},${maxValue}`;

                                            // Update changes
                                            handleInputChange({
                                                target: {
                                                    name: "years_of_experience",
                                                    value: updatedValue,
                                                },
                                            });

                                            // Update job state
                                            setJob((prev) => ({
                                                ...prev,
                                                years_of_experience:
                                                    updatedValue,
                                            }));
                                        }}
                                    />

                                    <Input
                                        style={{ width: "20%" }}
                                        type="number"
                                        step="0.5"
                                        suffix="Years"
                                        placeholder="Max years"
                                        value={
                                            job?.years_of_experience?.split(
                                                ",",
                                            )[1] || ""
                                        }
                                        onChange={(e) => {
                                            const maxValue = e.target.value;
                                            const minValue =
                                                job?.job_title !== "" &&
                                                changes?.years_of_experience
                                                    ? changes.years_of_experience?.split(
                                                          ",",
                                                      )[0]
                                                    : job?.years_of_experience?.split(
                                                          ",",
                                                      )[0] || "";

                                            const updatedValue = `${minValue},${maxValue}`;

                                            // Update changes
                                            handleInputChange({
                                                target: {
                                                    name: "years_of_experience",
                                                    value: updatedValue,
                                                },
                                            });

                                            // Update job state
                                            setJob((prev) => ({
                                                ...prev,
                                                years_of_experience:
                                                    updatedValue,
                                            }));
                                        }}
                                    />
                                </Input.Group>
                            </Form.Item>

                            <Form.Item
                                label="CTC"
                                name="ctc"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please select the below options",
                                    },
                                ]}
                            >
                                <Input.Group compact>
                                    <Input
                                        style={{ width: "20%" }}
                                        type="number"
                                        step="0.01"
                                        placeholder="Min CTC"
                                        suffix="LPA"
                                        disabled
                                        value={
                                            job.ctc ? job.ctc.split(",")[0] : ""
                                        }
                                        onChange={(e) => {
                                            const maxValue = changes.ctc
                                                ? changes.ctc.split(",")[1]
                                                : "";
                                            handleInputChange({
                                                target: {
                                                    name: "ctc",
                                                    value: `${e.target.value},${maxValue}`,
                                                },
                                            });
                                        }}
                                    />
                                    <span
                                        style={{
                                            width: "10%",
                                            textAlign: "center",
                                        }}
                                    >
                                        -
                                    </span>
                                    <Input
                                        style={{ width: "20%" }}
                                        type="number"
                                        step="0.01"
                                        suffix="LPA"
                                        placeholder="Max CTC"
                                        disabled
                                        value={
                                            job.ctc ? job.ctc.split(",")[1] : ""
                                        }
                                        onChange={(e) => {
                                            const minValue = changes.ctc
                                                ? changes.ctc.split(",")[0]
                                                : "";
                                            handleInputChange({
                                                target: {
                                                    name: "ctc",
                                                    value: `${minValue},${e.target.value}`,
                                                },
                                            });
                                        }}
                                    />
                                </Input.Group>
                            </Form.Item>

                            <Form.Item
                                label="Rounds of Interview"
                                name="rounds_of_interview"
                            >
                                <Input type="number" disabled />
                            </Form.Item>

                            <Form.Item>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Edit Request
                                </button>
                            </Form.Item>
                        </Form>
                    )}
                </div>
            )}
        </Main>
    );
};

export default EditJob;
