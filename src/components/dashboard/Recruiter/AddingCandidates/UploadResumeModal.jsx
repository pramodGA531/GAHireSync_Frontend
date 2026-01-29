import React, { useState } from "react";
import { Modal, Button, Upload, message, Typography } from "antd";
import {
    UploadOutlined,
    FilePdfOutlined,
    CloudUploadOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../common/useAuth";

const { Text, Title } = Typography;

const ResumeUploadModal = ({ isVisible, onClose, id }) => {
    const { apiurl, token } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const handleUpload = (info) => {
        const uploadedFile = info.file.originFileObj;
        if (uploadedFile) {
            setFile(uploadedFile);
            setResponseData(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            message.error("Document required for audit.");
            return;
        }
        const formData = new FormData();
        formData.append("resume", file);

        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/analyse-resume/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setResponseData(data);
            message.success("Resume Job formalised successfully.");
        } catch (error) {
            message.error("System Failure: Unable to upload Job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            destroyOnClose
            open={isVisible}
            onCancel={onClose}
            centered
            footer={null}
            width={600}
            className="premium-modal-v2"
            closeIcon={
                <CloseOutlined className="text-[#071C50] hover:rotate-90 transition-transform duration-300" />
            }
        >
            <div className="p-2 space-y-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1681FF] shadow-inner">
                        <CloudUploadOutlined className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#071C50] tracking-tighter uppercase m-0">
                            Asset Onboarding
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            Transfer candidate Job for diagnostic analysis
                        </p>
                    </div>
                </div>

                {/* Upload Zone */}
                <div className="bg-gray-50/50 p-10 rounded-[40px] border border-dashed border-gray-200 flex flex-col items-center justify-center gap-6 group hover:border-[#1681FF] hover:bg-blue-50/20 transition-all duration-500">
                    <Upload
                        beforeUpload={() => false}
                        onChange={handleUpload}
                        maxCount={1}
                        showUploadList={true}
                        accept=".pdf,.docx"
                        className="w-full text-center"
                    >
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <FilePdfOutlined className="text-3xl text-gray-300 group-hover:text-[#1681FF] transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-[#071C50]">
                                    Select Registry File
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                    PDF or DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>
                    </Upload>
                </div>

                {/* Feedback Section */}
                {responseData && (
                    <div className="bg-[#071C50] p-8 rounded-[32px] shadow-2xl shadow-blue-900/20 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <InfoCircleOutlined className="text-[#1681FF]" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                Diagnostic Response
                            </span>
                        </div>
                        <pre className="text-blue-200/80 text-[11px] font-medium leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 custom-scrollbar italic">
                            {typeof responseData === "string"
                                ? responseData
                                : JSON.stringify(responseData, null, 2)}
                        </pre>
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircleOutlined className="text-xs" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                Analysis logged to system audit
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Controls */}
                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        onClick={onClose}
                        className="h-14 px-8 rounded-2xl bg-gray-100 text-gray-500 border-none font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Abort Protocol
                    </Button>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                        disabled={!file}
                        className="h-14 px-12 rounded-2xl bg-[#071C50] border-none font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-[#1681FF] transition-all disabled:opacity-30 disabled:grayscale"
                    >
                        Formalise Transfer
                    </Button>
                </div>
            </div>
            <style jsx>{`
                .premium-modal-v2 .ant-modal-content {
                    border-radius: 48px !important;
                    padding: 48px !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </Modal>
    );
};

export default ResumeUploadModal;
