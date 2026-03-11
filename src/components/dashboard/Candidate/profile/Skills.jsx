import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Form, Button } from "antd";
import CreatableSelect from "react-select/creatable";
import skillsList from "../../../common/skills.jsx";

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

const Skills = () => {
    const { token, apiurl } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/profile/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!data.error) {
                let initialSkills = [];
                if (data.skills) {
                    try {
                        const parsed =
                            typeof data.skills === "string"
                                ? JSON.parse(data.skills)
                                : data.skills;
                        if (Array.isArray(parsed)) {
                            initialSkills = parsed.map((skill) => {
                                if (typeof skill === "object" && skill.label)
                                    return skill;
                                return { label: skill, value: skill };
                            });
                        }
                    } catch (e) {
                        // Parse fallback if it's comma separated string
                        if (typeof data.skills === "string") {
                            initialSkills = data.skills
                                .split(",")
                                .map((s) => ({
                                    label: s.trim(),
                                    value: s.trim(),
                                }));
                        }
                    }
                }
                form.setFieldsValue({ skills: initialSkills });
            }
        } catch (e) {
            console.error("Failed to fetch skills", e);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (values.skills) {
                formData.append("skills", JSON.stringify(values.skills));
            } else {
                formData.append("skills", "[]");
            }

            const response = await fetch(`${apiurl}/candidate/profile/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                message.success("Skills updated successfully!");
                fetchData();
            } else {
                message.error("Failed to update skills");
            }
        } catch (error) {
            message.error("An error occurred while updating skills.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-2">
            <div className="block w-[95%] mx-auto p-5 rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] bg-white">
                <h2 className="text-xl font-bold mb-4">Your Skills</h2>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="skills"
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
                            options={
                                skillsList?.map((skill) => ({
                                    label: skill,
                                    value: skill,
                                })) || []
                            }
                            placeholder="Select or type skills..."
                            styles={customStyles}
                            onChange={(newValue) => {
                                form.setFieldsValue({ skills: newValue });
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="mt-4"
                        >
                            Save Skills
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Skills;
