import {
    Steps,
    Form,
    Radio,
    Input,
    DatePicker,
    Button,
    Upload,
    message,
    Checkbox,
} from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import CreatableSelect from "react-select/creatable";
import skillsList from "../../common/skills.jsx";

const customStyles = {
    multiValue: (base) => ({
        ...base,
        display: "flex",
        minWidth: 0,
        border: "2px solid #ddd",
        borderRadius: "8px",
        margin: "2px",
        marginRight: "8px",
        boxSizing: "border-box",
        backgroundColor: "white",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "#171A1F",
        fontWeight: "400",
        fontSize: "14px",
        marginRight: "20px",
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: "red",
        ":hover": {
            backgroundColor: "red",
            color: "white",
        },
    }),
};

import { useAuth } from "../../common/useAuth";

const CandidateInfo = ({ onClose }) => {
    const { token, apiurl } = useAuth();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0); // antd starts from 0
    const experience = Form.useWatch("experience", form);

    const next = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form Validation Success:", values);

            const formData = new FormData();

            // 1. Demographic Info
            formData.append("first_name", values.firstName);
            formData.append("last_name", values.lastName);
            formData.append("phone_num", values.phone);
            formData.append(
                "dob",
                values.dob ? values.dob.format("YYYY-MM-DD") : "",
            );
            formData.append("blood_group", values.bloodGroup);

            formData.append("location", values.location);
            // formData.append("languages", values.languages); // If backend has this field
            formData.append(
                "communication_address",
                values.communicationAddress,
            );
            formData.append("permanent_address", values.permanentAddress);
            if (values.profileImage && values.profileImage[0]) {
                formData.append(
                    "profile",
                    values.profileImage[0].originFileObj,
                );
            }

            // 2. Experience
            if (values.experience === "exp") {
                formData.append("experience_years", values.years);
                formData.append("current_ctc", values.ctc);
                formData.append("expected_ctc", values.expCtc);
                formData.append("notice_period", values.notice);

                // Send organizations as JSON
                if (values.organizations) {
                    formData.append(
                        "experiences",
                        JSON.stringify(
                            values.organizations.map((org) => ({
                                organization: org.organization,
                                description: org.description,
                                startDate: org.startDate
                                    ? org.startDate.format("YYYY-MM-DD")
                                    : null,
                                endDate: org.isWorking
                                    ? null
                                    : org.endDate
                                      ? org.endDate.format("YYYY-MM-DD")
                                      : null,
                                isWorking: org.isWorking || false,
                            })),
                        ),
                    );
                }
            }

            // 3. Resume & Skills
            if (values.resume && values.resume[0]) {
                formData.append("resume", values.resume[0].originFileObj);
            }

            if (values.skills) {
                formData.append("skills", JSON.stringify(values.skills));
            }

            // API Call
            const response = await fetch(`${apiurl}/candidate/profile/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                message.success("Profile updated successfully!");
                if (onClose) onClose();
            } else {
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                message.error(
                    "Failed to update profile: " +
                        (errorData.error || "Unknown error"),
                );
            }
        } catch (error) {
            console.error("Submission failed:", error);
            message.error("Please fill all required fields correctly.");
        }
    };

    return (
        <div className="w-full p-4 flex flex-col">
            {/* <p className="font-bold text-black text-xl mb-4">
                Fill the below details to get noticed
            </p> */}

            <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Left Section - Steps */}
                <div className="w-1/4 h-[27vh] mb-2 rounded-xl border-2 border-gray-200 shadow-lg p-4">
                    <Steps
                        direction="vertical"
                        current={currentStep}
                        items={[
                            { title: "Demographic Info" },
                            { title: "Experience" },
                            { title: "Resume & Cover Letter" },
                        ]}
                    />
                </div>

                {/* Right Section - Content */}
                <div className="w-3/4 rounded-xl border-2 border-gray-200 shadow-lg p-4 overflow-hidden flex flex-col">
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex-1 overflow-hidden flex flex-col"
                    >
                        <div className="flex-1 overflow-y-auto pr-2">
                            {/* Step 0: Demographic Info */}
                            <div
                                style={{
                                    display:
                                        currentStep === 0 ? "block" : "none",
                                }}
                            >
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-black text-2xl font-semibold">
                                            Demographic Information
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Double check the info you entered.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Form.Item
                                            label="First Name"
                                            name="firstName"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your first name!",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter first name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your last name!",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter last name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Phone Number"
                                            name="phone"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your phone number!",
                                                },
                                            ]}
                                        >
                                            <Input
                                                type="tel"
                                                placeholder="Enter phone number"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Date of Birth"
                                            name="dob"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select your date of birth!",
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                format="YYYY-MM-DD"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Blood Group"
                                            name="bloodGroup"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your blood group!",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="e.g. O+, A-" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Location"
                                            name="location"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your location!",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="City, Country" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Languages Spoken"
                                            name="languages"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter languages spoken!",
                                                },
                                            ]}
                                        >
                                            <Input placeholder="English, Hindi..." />
                                        </Form.Item>

                                        <Form.Item
                                            label="Select Gender"
                                            name="gender"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select your gender!",
                                                },
                                            ]}
                                        >
                                            <Radio.Group>
                                                <Radio value="male">Male</Radio>
                                                <Radio value="female">
                                                    Female
                                                </Radio>
                                                <Radio value="other">
                                                    Other
                                                </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="Profile Image (Optional)"
                                            name="profileImage"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) =>
                                                e?.fileList
                                            }
                                        >
                                            <Upload
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                accept="image/*"
                                                className="w-full"
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="w-full"
                                                >
                                                    Upload Image
                                                </Button>
                                            </Upload>
                                        </Form.Item>
                                        <Form.Item
                                            label="Communication Address"
                                            name="communicationAddress"
                                            className="col-span-2"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your communication address!",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="Enter communication address"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Permanent Address"
                                            name="permanentAddress"
                                            className="col-span-2"
                                            required
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter your permanent address!",
                                                },
                                            ]}
                                        >
                                            <Input.TextArea
                                                rows={3}
                                                placeholder="Enter permanent address"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            {/* Step 1: Experience */}
                            <div
                                style={{
                                    display:
                                        currentStep === 1 ? "block" : "none",
                                }}
                            >
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold">
                                        Experience Form
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Double check the info you entered.
                                    </p>

                                    <Form.Item
                                        name="experience"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select your experience!",
                                            },
                                        ]}
                                    >
                                        <Radio.Group className="w-full">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Radio.Button
                                                    value="exp"
                                                    className="h-18 flex items-center justify-center rounded-lg border w-full"
                                                >
                                                    I have work experience
                                                </Radio.Button>
                                                <Radio.Button
                                                    value="fresher"
                                                    className="h-18 flex items-center justify-center rounded-lg border w-full"
                                                >
                                                    Fresher
                                                </Radio.Button>
                                            </div>
                                        </Radio.Group>
                                    </Form.Item>

                                    {experience === "exp" && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <Form.Item
                                                    name="years"
                                                    label="Years of Experience"
                                                    required
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Years of exp" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="notice"
                                                    label="Notice Period"
                                                    required
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Notice period" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="ctc"
                                                    label="Current CTC"
                                                    required
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Current CTC" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="expCtc"
                                                    label="Expected CTC"
                                                    required
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Expected CTC" />
                                                </Form.Item>
                                            </div>

                                            <h3 className="font-semibold">
                                                Organization Information
                                            </h3>

                                            <Form.List name="organizations">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(
                                                            ({
                                                                key,
                                                                name,
                                                                ...restField
                                                            }) => (
                                                                <div
                                                                    key={key}
                                                                    className="relative p-4 border border-gray-100 rounded-lg bg-gray-50/50"
                                                                >
                                                                    {fields.length >
                                                                        1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                remove(
                                                                                    name,
                                                                                )
                                                                            }
                                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )}

                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[
                                                                            name,
                                                                            "organization",
                                                                        ]}
                                                                        label="Organization Worked"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    "Missing organization name",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input placeholder="Organization worked" />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[
                                                                            name,
                                                                            "description",
                                                                        ]}
                                                                        label="Describe"
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message:
                                                                                    "Required",
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input.TextArea
                                                                            rows={
                                                                                3
                                                                            }
                                                                            placeholder="Describe your role"
                                                                        />
                                                                    </Form.Item>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <Form.Item
                                                                            {...restField}
                                                                            name={[
                                                                                name,
                                                                                "startDate",
                                                                            ]}
                                                                            label="Start Date"
                                                                        >
                                                                            <DatePicker className="w-full" />
                                                                        </Form.Item>
                                                                        <Form.Item
                                                                            noStyle
                                                                            shouldUpdate={(
                                                                                prevValues,
                                                                                currentValues,
                                                                            ) => {
                                                                                return (
                                                                                    prevValues
                                                                                        .organizations?.[
                                                                                        name
                                                                                    ]
                                                                                        ?.isWorking !==
                                                                                    currentValues
                                                                                        .organizations?.[
                                                                                        name
                                                                                    ]
                                                                                        ?.isWorking
                                                                                );
                                                                            }}
                                                                        >
                                                                            {({
                                                                                getFieldValue,
                                                                            }) => (
                                                                                <Form.Item
                                                                                    {...restField}
                                                                                    name={[
                                                                                        name,
                                                                                        "endDate",
                                                                                    ]}
                                                                                    label="End Date"
                                                                                >
                                                                                    <DatePicker
                                                                                        className="w-full"
                                                                                        disabled={getFieldValue(
                                                                                            [
                                                                                                "organizations",
                                                                                                name,
                                                                                                "isWorking",
                                                                                            ],
                                                                                        )}
                                                                                    />
                                                                                </Form.Item>
                                                                            )}
                                                                        </Form.Item>
                                                                    </div>
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[
                                                                            name,
                                                                            "isWorking",
                                                                        ]}
                                                                        valuePropName="checked"
                                                                    >
                                                                        <Checkbox
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                if (
                                                                                    e
                                                                                        .target
                                                                                        .checked
                                                                                ) {
                                                                                    const fields =
                                                                                        form.getFieldsValue();
                                                                                    const orgs =
                                                                                        fields.organizations;
                                                                                    orgs[
                                                                                        name
                                                                                    ].endDate =
                                                                                        null;
                                                                                    form.setFieldsValue(
                                                                                        {
                                                                                            organizations:
                                                                                                orgs,
                                                                                        },
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            Currently
                                                                            Working
                                                                            Here
                                                                        </Checkbox>
                                                                    </Form.Item>
                                                                </div>
                                                            ),
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                add()
                                                            }
                                                            type="button"
                                                            className="text-white font-semibold w-full bg-blue-950 p-2 rounded-lg"
                                                        >
                                                            Add organization +
                                                        </button>
                                                    </div>
                                                )}
                                            </Form.List>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Resume & Skills */}
                            <div
                                style={{
                                    display:
                                        currentStep === 2 ? "block" : "none",
                                }}
                            >
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold">
                                        Resume & Skills
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Double check the info you entered.
                                    </p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Form.Item
                                            name="resume"
                                            label="Resume"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) =>
                                                e?.fileList
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please upload your resume",
                                                },
                                            ]}
                                        >
                                            <Upload
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                accept=".pdf,.doc,.docx"
                                                className="w-full"
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="w-full"
                                                >
                                                    Click to Upload Resume
                                                </Button>
                                            </Upload>
                                        </Form.Item>

                                        <Form.Item
                                            name="coverLetter"
                                            label="Cover Letter"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) =>
                                                e?.fileList
                                            }
                                            // rules={[
                                            //     {
                                            //         required: true,
                                            //         message:
                                            //             "Please upload your cover letter",
                                            //     },
                                            // ]}
                                        >
                                            <Upload
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                accept=".pdf,.doc,.docx"
                                                className="w-full"
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    className="w-full"
                                                >
                                                    Click to Upload Cover Letter
                                                </Button>
                                            </Upload>
                                        </Form.Item>

                                        <Form.Item
                                            label="Skills"
                                            name="skills"
                                            className="col-span-2"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please select or add at least one skill",
                                                },
                                            ]}
                                        >
                                            <CreatableSelect
                                                isMulti
                                                options={skillsList.map(
                                                    (skill) => ({
                                                        label: skill,
                                                        value: skill,
                                                    }),
                                                )}
                                                placeholder="Select or type skills..."
                                                styles={customStyles}
                                                onChange={(newValue) => {
                                                    form.setFieldsValue({
                                                        skills: newValue,
                                                    });
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    onClick={currentStep === 2 ? handleSubmit : next}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {currentStep === 2 ? "Submit" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default CandidateInfo;
