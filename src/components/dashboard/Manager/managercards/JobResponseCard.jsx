import React from "react";

import threedots from "../../../../images/agency/job-postings/threedots.svg";
import timeicon from "../../../../images/agency/job-postings/timeicon.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const JobResponseCard = ({ data }) => {
    return (
        <div className="flex pl-2.5 gap-[50px] w-full rounded-[10px] border-0 bg-[#e8ebee] shadow-[0px_0px_2px_0px_rgba(248,249,250,0.12),0px_2px_5px_0px_rgba(248,249,250,0.09)]">
            <div className="flex gap-2 items-center cursor-pointer p-2.5 pl-0.5">
                {false ? (
                    <img />
                ) : (
                    <div className="w-[35px] h-[35px] bg-blue-200 rounded-full"></div>
                )}

                <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-black font-semibold">
                        {data?.candidate_name}
                    </span>
                    <div className="flex gap-2.5">
                        <img src={timeicon} style={{ width: "13px" }} />
                        <span className="text-[#424955] text-xs">
                            {data?.last_updated
                                ? dayjs(data.last_updated).fromNow()
                                : "N/A"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="invisible">
                <img src={threedots} />
            </div>
        </div>
    );
};

export default JobResponseCard;
