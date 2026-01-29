import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const Goback = () => {
    const navigate = useNavigate();

    return (
        <div
            className="w-full px-6 pb-[15px] text-black text-sm font-bold leading-[22px] cursor-pointer flex items-center transition-colors duration-200"
            onClick={() => navigate(-1)}
        >
            <LeftOutlined style={{ marginRight: "4px" }} />
            Go back
        </div>
    );
};

export default Goback;
