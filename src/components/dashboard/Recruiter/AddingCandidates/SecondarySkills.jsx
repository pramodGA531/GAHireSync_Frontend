import React from "react";
import { Form, Input, Select, InputNumber, Badge } from "antd";
import { StarOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Option } = Select;

const SecondarySkillsForm = ({ secondarySkills }) => {
    return (
        <div className="space-y-6">
            {secondarySkills && secondarySkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/20 p-8 rounded-3xl border border-slate-50 shadow-inner">
                    {secondarySkills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <AppstoreOutlined className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                                        Secondary Support
                                    </span>
                                </div>
                                <Badge status="default" />
                            </div>

                            <Form.Item
                                name={["secondary_skills", index, "skill_name"]}
                                initialValue={skill.skill_name}
                                label={
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Skill Set
                                    </span>
                                }
                                className="mb-0"
                            >
                                <Input
                                    disabled
                                    className="font-bold text-slate-500 bg-gray-50 border-gray-100 rounded-xl h-11"
                                />
                            </Form.Item>

                            <Form.Item
                                name={[
                                    "secondary_skills",
                                    index,
                                    "metric_type",
                                ]}
                                initialValue={skill.metric_type}
                                className="hidden"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.secondary_skills?.[index]
                                        ?.metric_type !==
                                    currentValues.secondary_skills?.[index]
                                        ?.metric_type
                                }
                                className="mb-0"
                            >
                                {({ getFieldValue }) => {
                                    const metricType = getFieldValue([
                                        "secondary_skills",
                                        index,
                                        "metric_type",
                                    ]);

                                    if (metricType === "rating") {
                                        return (
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Proficiency Rating (1-10)
                                                </span>
                                                <Form.Item
                                                    name={[
                                                        "secondary_skills",
                                                        index,
                                                        "rating",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Rating is required",
                                                        },
                                                    ]}
                                                    className="mb-0"
                                                >
                                                    <InputNumber
                                                        min={1}
                                                        max={10}
                                                        placeholder="Enter rating"
                                                        className="w-full h-11 rounded-xl border-gray-200 pt-1"
                                                    />
                                                </Form.Item>
                                            </div>
                                        );
                                    }

                                    if (metricType === "experience") {
                                        return (
                                            <Form.Item
                                                label={
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Relevant Experience
                                                    </span>
                                                }
                                                name={[
                                                    "secondary_skills",
                                                    index,
                                                    "experience",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Experience is required",
                                                    },
                                                ]}
                                                className="mb-0"
                                            >
                                                <Select
                                                    placeholder="Select experience"
                                                    className="h-11 rounded-xl"
                                                >
                                                    <Option value="0">
                                                        0 years
                                                    </Option>
                                                    <Option value="1-2">
                                                        1-2 years
                                                    </Option>
                                                    <Option value="2-3">
                                                        2-3 years
                                                    </Option>
                                                    <Option value="3-4">
                                                        3-4 years
                                                    </Option>
                                                    <Option value="4-5">
                                                        4-5 years
                                                    </Option>
                                                    <Option value="5+">
                                                        5+ years
                                                    </Option>
                                                    <Option value="N/A">
                                                        N/A
                                                    </Option>
                                                </Select>
                                            </Form.Item>
                                        );
                                    }

                                    return (
                                        <Form.Item
                                            label={
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Metric Output
                                                </span>
                                            }
                                            name={[
                                                "secondary_skills",
                                                index,
                                                "metric_value",
                                            ]}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Metric value is required",
                                                },
                                            ]}
                                            className="mb-0"
                                        >
                                            <Input
                                                placeholder="Enter specific metric"
                                                className="h-11 rounded-xl"
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50/50">
                    <p className="text-gray-300 font-bold uppercase tracking-widest text-[10px] italic underline decoration-gray-100 underline-offset-4">
                        Secondary skill evaluation not mandated
                    </p>
                </div>
            )}
        </div>
    );
};

export default SecondarySkillsForm;
