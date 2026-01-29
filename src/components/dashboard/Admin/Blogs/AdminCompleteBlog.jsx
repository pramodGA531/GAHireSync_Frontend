import React, { useState, useEffect } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message, Button, Skeleton } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import he from "he";
import RecentBlog from "../../../Blogs/RecentBlog";
import {
    ArrowLeftOutlined,
    EditOutlined,
    ShareAltOutlined,
} from "@ant-design/icons";

const AdminCompleteBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, apiurl } = useAuth();
    const [cleanContent, setCleanContent] = useState("");
    const [blog, setBlog] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchParticularBlog = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/myblogs/?blog_id=${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (result.error) {
                message.error(result.error);
            } else {
                setBlog(result);

                // Decode HTML entities
                const decodedContent = he.decode(result.content || "");
                const hasHTML = /<\/?[a-z][\s\S]*>/i.test(decodedContent);

                // Clean <pre> tags only if it's HTML
                const finalContent = hasHTML
                    ? decodedContent.replace(/<\/?pre[^>]*>/g, "")
                    : `<p>${decodedContent}</p>`;

                setCleanContent(finalContent);
            }
        } catch (e) {
            message.error("Failed to fetch blog details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchParticularBlog();
    }, [token, id]);

    return (
        <Main defaultSelectedKey={3}>
            <div className="bg-white min-h-screen pb-20">
                {/* Fixed Top Action Bar */}
                <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        icon={<ArrowLeftOutlined />}
                        className="rounded-xl font-bold h-10 border-gray-100 shadow-sm flex items-center"
                    >
                        Back
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            icon={<ShareAltOutlined />}
                            className="rounded-xl h-10 w-10 flex items-center justify-center border-gray-100"
                        />
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/admin/edit-blog/${id}`)}
                            className="bg-[#1681FF] rounded-xl h-10 px-6 font-bold shadow-lg shadow-blue-100 border-none"
                        >
                            Edit Article
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto pt-8 px-6">
                    {loading ? (
                        <div className="space-y-8">
                            <Skeleton active paragraph={{ rows: 2 }} />
                            <Skeleton.Image className="w-full !h-[400px] !rounded-3xl" />
                            <Skeleton active paragraph={{ rows: 15 }} />
                        </div>
                    ) : (
                        <>
                            <RecentBlog
                                author={blog.author}
                                created_at={blog.created_at}
                                tags={blog.tags}
                                thumbnail={blog.thumbnail}
                                title={blog.title}
                            />

                            <div className="mt-12 max-w-4xl mx-auto">
                                <article
                                    className="blog-content prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanContent,
                                    }}
                                />

                                <style
                                    dangerouslySetInnerHTML={{
                                        __html: `
                                    .blog-content h1 { font-size: 2.5rem; font-weight: 800; color: #071C50; margin-bottom: 2rem; line-height: 1.2; }
                                    .blog-content h2 { font-size: 1.875rem; font-weight: 700; color: #071C50; margin-top: 2.5rem; margin-bottom: 1.25rem; }
                                    .blog-content h3 { font-size: 1.5rem; font-weight: 700; color: #071C50; margin-top: 2rem; margin-bottom: 1rem; }
                                    .blog-content p { margin-bottom: 1.5rem; }
                                    .blog-content img { border-radius: 1.5rem; margin: 2.5rem 0; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05); }
                                    .blog-content ul, .blog-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
                                    .blog-content li { margin-bottom: 0.5rem; }
                                    .blog-content a { color: #1681FF; text-decoration: underline; font-weight: 700; }
                                    .blog-content blockquote { border-left: 4px solid #1681FF; padding-left: 1.5rem; font-style: italic; color: #475569; margin: 2rem 0; }
                                    .blog-content code { background: #F1F5F9; padding: 0.2rem 0.4rem; rounded: 0.375rem; font-family: monospace; font-size: 0.875rem; }
                                `,
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default AdminCompleteBlog;
