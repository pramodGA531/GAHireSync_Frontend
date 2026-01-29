import React from "react";
// import './InterviewsCard.css';

const InterviewsCard = ({
    time,
    round_num,
    job_title,
    interviewer_name,
    is_highlighted,
}) => {
    return (
        <div className="flex items-center mt-2.5 bg-[#A0DBF4]/30 p-[3px_4px] rounded-lg w-[90%] max-w-[600px] border-r-[3px] border-[#1B5CBE]/30">
            <div className="text-[#1A56DB] text-xs font-medium min-w-[45px] px-[5px] flex items-center justify-center">
                {time}
            </div>
            <div className="pl-[5px] border-l border-[#1A56DB] text-[#1E429F] text-[11px] font-semibold">
                <span className="font-medium mr-1 text-sm">
                    {interviewer_name} : {job_title}; {round_num} round
                </span>
            </div>
        </div>
    );
};

export default InterviewsCard;
