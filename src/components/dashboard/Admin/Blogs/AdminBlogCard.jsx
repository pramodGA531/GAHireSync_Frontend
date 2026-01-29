import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import {
    ClockCircleOutlined,
    UserOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { Tag } from "antd";

function AdminBlogCard({ image, author, date, title, tags, id }) {
    const navigate = useNavigate();
    const { apiurl } = useAuth();

    const formattedDate = date
        ? format(new Date(date), "MMM d, yyyy")
        : "No Date";

    return (
        <div
            onClick={() => navigate(`/admin/complete-blog/${id}`)}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${apiurl}${image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Author Tag on Image (Mobile/Small screens) */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                    {tags?.slice(0, 2).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/30"
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-[#1681FF]">
                    <span className="flex items-center gap-1">
                        <UserOutlined className="text-xs" /> {author}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1">
                        <ClockCircleOutlined className="text-xs" />{" "}
                        {formattedDate}
                    </span>
                </div>

                <h2 className="text-xl font-bold text-[#071C50] mb-4 group-hover:text-[#1681FF] transition-colors leading-tight line-clamp-2">
                    {title}
                </h2>

                <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
                    <div className="flex -space-x-2">
                        {/* Placeholder for more avatars if needed, or just a decorative element */}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {author?.[0]?.toUpperCase()}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#1681FF] font-black text-[10px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        Read Article <ArrowRightOutlined />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminBlogCard;
