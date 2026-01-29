import poprightimg from "../../images/blogs/popularblogrightimg.png";
import { useAuth } from "../common/useAuth";

function PopularBlogCard({ author, created_at, tags, thumbnail, title }) {
    const { apiurl, token } = useAuth();

    return (
        <div className="flex overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-400 rounded-[10px] bg-white font-sans">
            {/* <div className="image-container"> */}
            <img
                src={`${apiurl}${thumbnail}`}
                alt="Profile"
                className="min-w-[300px] min-h-[350px] object-cover"
            />
            {/* </div> */}
            <div className="w-[250px] p-5 flex flex-col">
                <div className="flex items-center m-[5px] text-left gap-[5px]">
                    <span className="font-bold text-[#333] mr-2.5 text-sm">
                        {author}
                    </span>
                    <span className="text-[#666] text-sm">• {created_at}</span>
                </div>
                <div className="text-base font-bold text-[#333] mb-[15px] leading-[1.4] text-left">
                    {title}
                </div>
                <div className="text-sm text-[#666] leading-[1.5] mb-5">
                    Lorem ipsum dolor sit amet consectetur. Turpis viverra
                    mattis felis in id et. Orci
                </div>
                <div className="flex gap-2 mt-auto">
                    {tags?.length ? (
                        tags.slice(0, 2).map((t, idx) => (
                            <button
                                key={idx}
                                className="px-[15px] py-[5px] rounded-[20px] text-xs border border-[#ddd] text-[#666] bg-transparent cursor-pointer"
                            >
                                {t.name}
                            </button>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">No tags</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PopularBlogCard;
