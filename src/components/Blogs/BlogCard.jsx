import { useNavigate } from "react-router-dom";
import { useAuth } from "../common/useAuth";

function BlogCard({ image, author, date, title, tags, id }) {
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();

    const getDate = (date) => {
        if (!date) return "Invalid Date";

        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return "Invalid Date";

        return parsedDate.toISOString().split("T")[0]; // returns "YYYY-MM-DD"
    };

    return (
        <div
            className="w-full max-w-[280px] h-[240px] rounded-[10px] overflow-hidden relative shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            onClick={() => navigate(`/blogs/${id}`)}
        >
            <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${apiurl}${image})` }}
            >
                <div className="w-full h-full bg-gradient-to-b from-[rgba(0,0,0,0.05)] to-[rgba(0,0,0,0.75)] flex flex-col justify-end">
                    <div className="p-3 text-white">
                        <div className="flex items-center mb-1 text-[11px]">
                            <span className="font-normal">{author}</span>
                            <span className="mx-1">•</span>
                            <span className="opacity-75">{getDate(date)}</span>
                        </div>
                        <h2 className="text-sm font-semibold mb-[6px] leading-[1.2]">
                            {title}
                        </h2>
                        {/* <p className="blog-card-excerpt">{excerpt}</p> */}
                        <div className="flex flex-wrap gap-1">
                            {tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-[2px] bg-[rgba(255,255,255,0.2)] rounded-[14px] text-[11px] font-normal"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
