import React, { useEffect, useState } from "react";
import { message, Tabs, Button, Input, Empty } from "antd";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { useNavigate } from "react-router-dom";
import AdminBlogCard from "./AdminBlogCard";
import { PlusOutlined, SearchOutlined, BookOutlined } from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";

const AdminBlogs = () => {
    const { apiurl, token } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/myblogs/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setBlogs(result);
            }
        } catch (e) {
            message.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const filteredBlogs = blogs.filter(
        (b) =>
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.author.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Main defaultSelectedKey={3}>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-8 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-extrabold text-[#071C50] tracking-tight">
                                    Editorial Hub
                                </h1>
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-200">
                                    Admin
                                </span>
                            </div>
                            <p className="text-gray-500 font-medium">
                                Manage and publish articles to the platform-wide
                                blog.
                            </p>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/admin/add-blog")}
                            className="h-12 px-8 rounded-2xl bg-[#1681FF] hover:bg-[#0061D5] font-extrabold shadow-lg shadow-blue-100 border-none transition-all active:scale-95 flex items-center gap-2"
                        >
                            Publish New Article
                        </Button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <Input
                                placeholder="Search articles by title or author..."
                                prefix={
                                    <SearchOutlined className="text-gray-400 mr-2" />
                                }
                                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all focus:bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                            <BookOutlined className="text-[#1681FF]" />
                            <span className="text-[#1681FF] font-black text-[10px] uppercase tracking-widest">
                                {blogs.length} Total Posts
                            </span>
                        </div>
                    </div>

                    {/* Blogs Grid */}
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Pageloading />
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog) => (
                                <AdminBlogCard
                                    key={blog.id}
                                    image={blog.thumbnail}
                                    author={blog.author}
                                    date={blog.created_at}
                                    title={blog.title}
                                    id={blog.id}
                                    tags={blog.tags}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className="space-y-2">
                                        <p className="text-gray-500 font-bold text-lg">
                                            No articles found
                                        </p>
                                        <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                            Try adjusting your search or start
                                            by creating your first blog post.
                                        </p>
                                    </div>
                                }
                            />
                            <Button
                                type="link"
                                className="mt-4 text-[#1681FF] font-bold"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};

export default AdminBlogs;
