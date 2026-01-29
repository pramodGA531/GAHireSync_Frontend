import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { Button, message, Input, Tooltip, Upload, Space } from "antd";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeftOutlined,
    UploadOutlined,
    InfoCircleOutlined,
    DeleteOutlined,
    CopyOutlined,
    SendOutlined,
} from "@ant-design/icons";
import GoBack from "../../../common/Goback";

function BlogPostForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [blogImages, setBlogImages] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

    const { token, apiurl } = useAuth();

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
            [{ align: [] }],
            ["code-block"],
        ],
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImages = async () => {
        if (blogImages.length === 0) {
            message.warning("Please select images first");
            return;
        }

        const formData = new FormData();
        blogImages.forEach((img) => {
            formData.append("images", img);
        });

        try {
            const response = await fetch(
                `${apiurl}/admin-site/blogs/upload-images/`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                },
            );

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setUploadedImageUrls(data.urls || []);
            message.success("Images uploaded successfully");
        } catch (error) {
            console.error(error);
            message.error("Error uploading images");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !author || !content) {
            message.warning("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        const tagsArray = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("content", content);
        formData.append("tags", JSON.stringify(tagsArray));

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        try {
            const response = await fetch(`${apiurl}/user/blogs/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                message.error(
                    `Error: ${response.status} ${response.statusText}`,
                );
                return;
            }

            message.success("Post Published Successfully.");
            navigate("/admin/blogs");
        } catch (error) {
            console.error("Error submitting the form:", error);
            message.error("Failed to publish post.");
        } finally {
            setIsLoading(false);
        }
    };

    const quillRef = useRef(null);

    return (
        <Main defaultSelectedKey={3}>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="bg-[#F9FAFB] min-h-screen p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <Button
                            onClick={() => navigate(-1)}
                            icon={<ArrowLeftOutlined />}
                            className="bg-white rounded-xl font-bold flex items-center h-10 border-gray-100 shadow-sm"
                        >
                            Back to Blogs
                        </Button>
                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-[#071C50]">
                                New Article
                            </h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Draft Generation
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                        {/* Basic Info Card */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1681FF]">
                                        Article Title *
                                    </label>
                                    <Input
                                        size="large"
                                        placeholder="Enter a catchy title..."
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="rounded-xl border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white h-12 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Author Name *
                                    </label>
                                    <Input
                                        size="large"
                                        placeholder="Who's writing this?"
                                        value={author}
                                        onChange={(e) =>
                                            setAuthor(e.target.value)
                                        }
                                        className="rounded-xl border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white h-12 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Tags
                                </label>
                                <Input
                                    size="large"
                                    placeholder="Career, AI, Recruitment (separated by commas)"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="rounded-xl border-gray-100 bg-gray-50/50 hover:bg-gray-50 focus:bg-white h-12 transition-all"
                                />
                                <p className="text-[10px] text-gray-300 italic font-bold">
                                    Try to use relevant keywords for better
                                    search visibility.
                                </p>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Thumbnail */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] block mb-4">
                                    Article Thumbnail
                                </label>
                                <div className="flex flex-col items-center">
                                    {previewUrl ? (
                                        <div className="relative group w-full h-48 rounded-2xl overflow-hidden mb-4 border border-gray-100 bg-gray-50">
                                            <img
                                                src={previewUrl}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    danger
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        setPreviewUrl("");
                                                        setThumbnail(null);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="thumbnail"
                                            className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all mb-4"
                                        >
                                            <UploadOutlined className="text-3xl text-gray-300 mb-2" />
                                            <span className="text-gray-400 font-bold text-sm">
                                                Upload Thumbnail
                                            </span>
                                            <input
                                                type="file"
                                                id="thumbnail"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleThumbnailChange}
                                            />
                                        </label>
                                    )}
                                    <p className="text-[10px] text-gray-400 text-center font-medium">
                                        Recommended size: 1200x630px (Max 5MB)
                                    </p>
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] mb-4 flex justify-between items-center">
                                    Content Assets
                                    <Tooltip title="Upload images to use within your article content.">
                                        <InfoCircleOutlined className="text-blue-300" />
                                    </Tooltip>
                                </label>

                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        id="blog-images"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) =>
                                            setBlogImages((prev) => [
                                                ...prev,
                                                ...Array.from(e.target.files),
                                            ])
                                        }
                                    />
                                    <label
                                        htmlFor="blog-images"
                                        className="flex items-center justify-center h-12 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all font-bold text-gray-400 text-sm"
                                    >
                                        <PlusOutlined className="mr-2" /> Select
                                        Asset Images
                                    </label>

                                    {blogImages.length > 0 && (
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {blogImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(
                                                            img,
                                                        )}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                                                        onClick={() =>
                                                            setBlogImages(
                                                                blogImages.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        idx,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <DeleteOutlined className="text-white text-xs" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        block
                                        disabled={blogImages.length === 0}
                                        onClick={handleUploadImages}
                                        className="h-10 rounded-xl font-bold bg-[#F1F5F9] text-gray-600 border-none hover:bg-gray-200"
                                    >
                                        Upload Assets for URLs
                                    </Button>

                                    {uploadedImageUrls.length > 0 && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] mb-2">
                                                Asset URLs (Click to copy)
                                            </p>
                                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                                {uploadedImageUrls.map(
                                                    (url, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex gap-2"
                                                        >
                                                            <input
                                                                readOnly
                                                                value={url}
                                                                className="flex-1 text-[10px] bg-white border border-blue-100 rounded-md p-1 truncate cursor-pointer"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.target.select();
                                                                    navigator.clipboard.writeText(
                                                                        url,
                                                                    );
                                                                    message.success(
                                                                        "URL Copied!",
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Editor Card */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] block mb-4">
                                Article Content *
                            </label>
                            <div className="quill-wrapper rounded-2xl overflow-hidden border border-gray-100">
                                <ReactQuill
                                    ref={quillRef}
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    className="min-h-[400px]"
                                    placeholder="Start writing your amazing story here..."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                size="large"
                                className="h-12 px-8 rounded-2xl border-gray-200 font-bold text-gray-400 hover:text-gray-600"
                                onClick={() => navigate(-1)}
                            >
                                Discard Draft
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                icon={<SendOutlined />}
                                className="h-12 px-10 rounded-2xl bg-[#1681FF] hover:bg-[#0061D5] font-black shadow-xl shadow-blue-100 flex items-center gap-2"
                            >
                                {isLoading
                                    ? "Publishing..."
                                    : "Publish Article Now"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Main>
    );
}

export default BlogPostForm;
