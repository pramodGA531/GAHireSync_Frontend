import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { message, Card, Button, Modal, Empty, Tag, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import Pageloading from "../../../common/loading/Pageloading";

const ApproveBlogs = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [approving, setApproving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/superadmin/approve-blogs/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setData(result);
            }
        } catch (e) {
            message.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const fetchParticularBlog = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/superadmin/approve-blogs/?blog_id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setBlogData(result);
                setModalVisible(true);
            }
        } catch (e) {
            message.error("Failed to fetch blog details");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleApproveBlog = async (id) => {
        try {
            setApproving(true);
            const response = await fetch(
                `${apiurl}/superadmin/approve-blogs/?blog_id=${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Blog approved and published successfully");
                fetchData();
                setModalVisible(false);
                setBlogData(null);
            }
        } catch (e) {
            message.error("Failed to approve blog");
        } finally {
            setApproving(false);
        }
    };

    return (
        <div className="p-6 md:p-10 bg-white rounded-3xl border border-gray-100 shadow-sm mt-6">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-[#071C50]">
                            Pending Approvals
                        </h2>
                        <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-orange-100">
                            Review Required
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">
                        System-wide editorial queue for moderator verification.
                    </p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2">
                    <span className="text-[#1681FF] font-black text-xs uppercase tracking-widest">
                        {data.length} Submissions
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <Pageloading />
                </div>
            ) : data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => fetchParticularBlog(item.id)}
                            className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden bg-gray-50">
                                <img
                                    alt="thumbnail"
                                    src={`${apiurl}${item.thumbnail}`}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg">
                                        <EyeOutlined className="text-[#1681FF] text-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-2 py-0.5 rounded border-blue-100 m-0">
                                        Recent
                                    </Tag>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                        Article Review
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#071C50] mb-3 group-hover:text-[#1681FF] transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium line-clamp-3 mb-6">
                                    {item.description ||
                                        "No description provided for this submission."}
                                </p>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter italic">
                                        Review Details →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center opacity-40">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No submissions in the queue"
                    />
                </div>
            )}

            <Modal
                title={null}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setBlogData(null);
                }}
                footer={null}
                width={800}
                className="modal-no-padding overflow-hidden"
                centered
            >
                {blogData ? (
                    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300">
                        {/* Modal Hero */}
                        <div className="relative h-64 overflow-hidden bg-[#001744]">
                            {blogData.thumbnail && (
                                <img
                                    src={`${apiurl}${blogData.thumbnail}`}
                                    alt="Blog Thumbnail"
                                    className="w-full h-full object-cover opacity-60"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001744] via-[#001744]/40 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <Tag className="bg-[#1681FF] border-none text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-4">
                                    Verification Mode
                                </Tag>
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                                    {blogData.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-8 bg-white max-h-[50vh] overflow-y-auto sidebar-scroll">
                            <div className="flex gap-8 items-center py-4 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-gray-300" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-none mb-1">
                                            Author
                                        </p>
                                        <p className="text-[#071C50] font-bold text-sm">
                                            {blogData.author || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined className="text-gray-300" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-none mb-1">
                                            Submitted
                                        </p>
                                        <p className="text-[#071C50] font-bold text-sm">
                                            {blogData.created_at
                                                ? format(
                                                      new Date(
                                                          blogData.created_at
                                                      ),
                                                      "MMM d, yyyy"
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-medium">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1681FF] mb-4">
                                    Content Preview
                                </h4>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: blogData.content,
                                    }}
                                />
                            </div>

                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                                <WarningOutlined className="text-amber-500 text-xl" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800">
                                        Verification Required
                                    </h4>
                                    <p className="text-xs text-amber-700/80 font-medium">
                                        Please ensure the content adheres to
                                        platform guidelines before approving for
                                        public distribution.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <Button
                                onClick={() => setModalVisible(false)}
                                className="h-12 px-8 rounded-2xl font-bold text-gray-400 border-none hover:bg-gray-100"
                            >
                                Close Preview
                            </Button>
                            <Button
                                type="primary"
                                loading={approving}
                                onClick={() => handleApproveBlog(blogData.id)}
                                icon={<CheckCircleOutlined />}
                                className="h-12 px-10 rounded-2xl bg-green-500 hover:bg-green-600 font-black shadow-lg shadow-green-100 border-none transition-all flex items-center gap-2"
                            >
                                Approve & Publish
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 flex justify-center">
                        <Pageloading />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ApproveBlogs;
