"use client";

import { useState } from "react";
import {
    InboxOutlined,
    FilePdfOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    CloudUploadOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

const FileUploadCard = ({
    handleDragOverShareResume,
    handleDropOnShareResume,
    setIsVisible,
}) => {
    const [questionaryFile, setQuestionaryFile] = useState({
        name: "Recruitment_Log_v2.pdf",
        size: 1540,
    });

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1681FF]">
                        <InboxOutlined className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#071C50] tracking-tighter uppercase m-0">
                            Asset Transfer
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            Direct Job upload node
                        </p>
                    </div>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOverShareResume}
                    onDrop={handleDropOnShareResume}
                    className="bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[24px] p-10 flex flex-col items-center justify-center gap-6 group hover:border-[#1681FF] hover:bg-blue-50/20 transition-all duration-500 cursor-copy"
                >
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <CloudUploadOutlined className="text-2xl text-gray-300 group-hover:text-[#1681FF]" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-[#071C50]">
                            Drop Registry File
                        </p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            PDF, DOCX OR IMAGE NODES
                        </p>
                    </div>
                </div>

                {/* File List */}
                <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">
                        Registry Queue
                    </p>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#071C50]">
                                <FilePdfOutlined />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#071C50] leading-none mb-1">
                                    {questionaryFile.name}
                                </p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                    {(questionaryFile.size / 1024).toFixed(2)}{" "}
                                    MB • READY
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500" />
                            <Button
                                type="text"
                                icon={
                                    <DeleteOutlined className="text-gray-300 group-hover:text-red-400 transition-colors" />
                                }
                                className="hover:bg-red-50 rounded-lg h-8 w-8 flex items-center justify-center border-none shadow-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                        Abort
                    </button>
                    <button className="flex-1 h-14 rounded-2xl bg-[#071C50] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:bg-[#1681FF] transition-all">
                        Initiate Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUploadCard;
