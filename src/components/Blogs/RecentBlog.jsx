import React from "react";
import { useAuth } from "../common/useAuth";
import { format } from "date-fns";
import {
    UserOutlined,
    CalendarOutlined,
    TagsOutlined,
} from "@ant-design/icons";

const RecentBlog = ({ author, created_at, tags, thumbnail, title }) => {
    const { apiurl } = useAuth();

    const formattedDate = created_at
        ? format(new Date(created_at), "MMMM d, yyyy")
        : "Date Unavailable";

    return (
        <div className="w-full relative group">
            {/* Background Image Container */}
            <div className="relative w-full aspect-[21/9] md:aspect-[24/10] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                <img
                    src={`${apiurl}${thumbnail}`}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
                    <div className="max-w-4xl space-y-6">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {tags?.map((t, index) => (
                                    <span
                                        key={index}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                                    >
                                        {t.name}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight text-shadow-lg">
                                {title}
                            </h1>
                        </div>

                        {/* Meta Section */}
                        <div className="flex flex-col md:flex-row gap-8 md:items-center pt-4 border-t border-white/10 w-fit">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold">
                                    {author?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">
                                        Primary Author
                                    </p>
                                    <p className="text-white font-bold text-sm md:text-base">
                                        {author}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-lg">
                                    <CalendarOutlined />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">
                                        Published Date
                                    </p>
                                    <p className="text-white font-bold text-sm md:text-base">
                                        {formattedDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purely Decorative Badge */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#1681FF] rounded-full flex items-center justify-center shadow-xl transform rotate-12 border-4 border-white z-10 hidden lg:flex">
                <span className="text-white text-[10px] font-black uppercase tracking-tighter text-center leading-none">
                    Latest
                    <br />
                    Article
                </span>
            </div>
        </div>
    );
};

export default RecentBlog;
