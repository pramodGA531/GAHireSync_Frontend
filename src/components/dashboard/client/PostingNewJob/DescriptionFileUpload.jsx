import React, { useState, useRef } from "react";
import { Controller, useWatch } from "react-hook-form";

import { useAuth } from "../../../common/useAuth";
import { message } from "antd";

const DescriptionFileUpload = ({ control, onJDParse }) => {
    const { apiurl, token } = useAuth();
    const descriptionFile = useWatch({ control, name: "description_file" });
    const [localFileName, setLocalFileName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const dropRef = useRef();

    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const handleDrop = (e, field) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && allowedTypes.includes(file.type)) {
            field.onChange(file);
            setLocalFileName(file.name);
            uploadAndParse(file);
        } else {
            alert("Only PDF and DOCX files are allowed.");
        }
    };

    const uploadAndParse = async (file) => {
        if (!onJDParse) return;

        const hide = message.loading("Parsing JD...", 0);

        try {
            const formData = new FormData();
            formData.append("description_file", file);

            const response = await fetch(`${apiurl}/client/parse-jd/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            hide();

            if (response.ok) {
                message.success("JD Parsed Successfully!");
                onJDParse(data.data);
            } else {
                message.error(data.error || "Failed to parse JD");
            }
        } catch (error) {
            hide();
            console.error(error);
            message.error("Error parsing JD");
        }
    };

    return (
        <div className="mb-4">
            <label
                className="text-[#424955] text-sm font-semibold pt-2.5 block mb-2"
                htmlFor="description_file"
            >
                Description File
            </label>

            <Controller
                name="description_file"
                control={control}
                render={({ field }) => (
                    <>
                        <div
                            ref={dropRef}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => handleDrop(e, field)}
                            style={{
                                border: isDragging
                                    ? "2px dashed #1890ff"
                                    : "2px dashed #ccc",
                                backgroundColor: isDragging
                                    ? "#f0faff"
                                    : "#fafafa",
                                padding: "20px",
                                textAlign: "center",
                                borderRadius: "8px",
                                transition: "0.2s ease",
                                marginBottom: "10px",
                            }}
                        >
                            <p style={{ margin: 0 }}>
                                Drag & Drop PDF/DOCX here or{" "}
                                <label
                                    htmlFor="description_file"
                                    style={{
                                        color: "#1890ff",
                                        cursor: "pointer",
                                    }}
                                >
                                    click to browse
                                </label>
                            </p>
                            <input
                                id="description_file"
                                type="file"
                                accept=".pdf,.docx"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (
                                        file &&
                                        allowedTypes.includes(file.type)
                                    ) {
                                        field.onChange(file);
                                        setLocalFileName(file.name);
                                        uploadAndParse(file);
                                    } else {
                                        alert(
                                            "Only PDF and DOCX files are allowed.",
                                        );
                                    }
                                }}
                            />
                        </div>

                        {field.value instanceof File ? (
                            <div style={{ marginTop: "8px" }}>
                                <p>
                                    <strong>Selected File:</strong>{" "}
                                    {localFileName || field.value.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = URL.createObjectURL(
                                            field.value,
                                        );
                                        window.open(url, "_blank");
                                    }}
                                    style={{
                                        backgroundColor: "#1890ff",
                                        color: "#fff",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        marginBottom: "6px",
                                    }}
                                >
                                    View File
                                </button>
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        fontSize: "12px",
                                    }}
                                >
                                    Uploading a new file will replace the
                                    current one.
                                </p>
                            </div>
                        ) : (
                            <p style={{ color: "#999", fontStyle: "italic" }}>
                                No file selected
                            </p>
                        )}
                    </>
                )}
            />
        </div>
    );
};

export default DescriptionFileUpload;
