import React from "react";
import popularleftimg from "../../images/blogs/Popularleftimg.png";
import PopularBlogCard from "./PopularBlogCard";
import { useAuth } from "../common/useAuth";

const PopularBlogs = ({
    author,
    created_at,
    tags,
    thumbnail,
    title,
    content,
    twoblogs,
}) => {
    const { apiurl, token } = useAuth();

    const getDate = (date) => {
        if (!date) return "Invalid Date";

        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return "Invalid Date";

        return parsedDate.toISOString().split("T")[0]; // returns "YYYY-MM-DD"
    };

    return (
        <div className="w-[95%] mx-auto h-auto min-h-[900px] flex flex-col mb-10">
            <h2 className="text-[#4D5163] font-bold text-2xl mb-4 self-start">
                Popular Blogs
            </h2>
            <div className="flex w-[95%] gap-[30px] flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 relative group rounded-lg overflow-hidden">
                    {/* Wrapper for image to ensure overlay sits correctly */}
                    <div className="relative w-full h-full">
                        <img
                            src={`${apiurl}${thumbnail}`}
                            alt="blog-image"
                            className="w-full lg:w-[670px] object-cover rounded-lg h-[500px] lg:h-[720px]"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg"></div>

                        <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-1 text-white">
                            <div className="font-normal text-white text-sm w-full">
                                {author} Date : {getDate(created_at)}
                            </div>
                            <div className="font-medium text-white text-lg w-full">
                                {title}
                            </div>
                            <div className="font-normal text-sm text-white leading-[17px] w-full">
                                {/* Content placeholder if needed, current code has it commented out or empty */}
                            </div>
                            <div className="flex gap-[5px] mt-2">
                                {tags?.map((t, index) => {
                                    return (
                                        <button
                                            key={index}
                                            className="bg-transparent border border-white rounded-[50px] px-3 py-1 text-xs text-white"
                                        >
                                            {t.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full lg:w-1/2">
                    {twoblogs.slice(0, 2).map((obj, index) => (
                        <PopularBlogCard
                            key={index}
                            author={obj.author}
                            created_at={getDate(obj.created_at)}
                            tags={obj.tags}
                            thumbnail={obj.thumbnail}
                            title={obj.title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularBlogs;
