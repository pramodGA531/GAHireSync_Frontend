import React, { useEffect, useState } from "react";
import TopNav from "../LandingPage/TopNav";
import BG from "../../images/LandingPage/BG2.png";
import { useNavigate } from "react-router-dom";
import RecentBlog from "./RecentBlog";
import PopularBlogs from "./PopularBlogs";
import BlogCard from "./BlogCard";
import { useAuth } from "../common/useAuth";
import { message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Blogs = () => {
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();

    const [Blogs, setBlogs] = useState([]);
    const [recentBlog, SetRecentBlog] = useState({});

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/myblogs/`, {
                method: "GET",
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                console.log(result);
                setBlogs(result);
            }
        } catch (e) {
            message.error("Failed to fetch blogs");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (Blogs.length > 0) {
            SetRecentBlog(Blogs[1]);
        }
    }, [Blogs]);

    return (
        <>
            <div className="">
                <div
                    className="text-[#4D5163] pb-10"
                    style={{
                        backgroundImage: `url(${BG})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "0px 0px 0px 0px",
                    }}
                >
                    <TopNav color="blue"></TopNav>
                    <div className="text-center mt-5 text-[44px] font-semibold">
                        Blogs
                    </div>
                    <div className="text-center mt-2.5 pb-5 text-lg w-[90vw] md:w-[60vw] mx-auto">
                        Access industry insights, thought leadership, and hiring
                        best practices.<br></br>
                        Our blog is your resource for staying informed in a
                        competitive landscape.
                    </div>
                    <div
                        className="text-center mt-0 pb-[15px] text-lg text-[#56A8FD] cursor-pointer"
                        onClick={() => navigate("/welcome")}
                    >
                        Home/Blogs
                    </div>
                    <div className="flex items-center bg-white px-5 py-2.5 mx-auto rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.05)] w-fit">
                        <SearchOutlined className="text-[20px] text-[#2c3e50]" />
                        <input
                            type="text"
                            placeholder="Search for the blog.."
                            className="border-none outline-none text-base text-[#333] w-[200px] md:w-[250px] bg-transparent mx-2.5 placeholder-gray-400 focus:ring-0"
                        />
                        <button className="bg-transparent border border-[#91caff] text-[#4a90e2] text-base px-4 py-[5px] rounded-[20px] cursor-pointer hover:bg-[#e6f4ff] transition-colors">
                            Search
                        </button>
                    </div>
                </div>
                {/* <RecentBlog /> */}
                {recentBlog && (
                    <>
                        <RecentBlog
                            author={recentBlog.author}
                            created_at={recentBlog.created_at}
                            tags={recentBlog.tags}
                            thumbnail={recentBlog.thumbnail}
                            title={recentBlog.title}
                        />
                        <PopularBlogs
                            author={recentBlog.author}
                            created_at={recentBlog.created_at}
                            tags={recentBlog.tags}
                            thumbnail={recentBlog.thumbnail}
                            title={recentBlog.title}
                            content={recentBlog.content}
                            twoblogs={Blogs}
                        />
                    </>
                )}
            </div>
            <div>
                <div className="">
                    <h2 className="text-[#4D5163] font-bold text-left w-[80%] mx-auto md:ml-[50px] mb-5 text-2xl">
                        All Blogs
                    </h2>
                    <div className="flex flex-wrap gap-10 mx-auto w-[90%] justify-center mb-20">
                        {Blogs.map((blog, index) => (
                            <BlogCard
                                key={index}
                                image={blog.thumbnail}
                                author={blog.author}
                                date={blog.created_at}
                                title={blog.title}
                                id={blog.id}
                                // excerpt={blog.excerpt}
                                tags={blog.tags}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blogs;
