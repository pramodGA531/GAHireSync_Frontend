import React from "react";

import dummyprofile from "../../../../images/agency/job-postings/dummyprofile.svg";
import Eye from "../../../../images/agency/job-postings/Eye.svg";
import bookicon from "../../../../images/agency/job-postings/bookicon.svg";
import { useNavigate } from "react-router-dom";

const CandidatesCard = ({
    candidateName,
    resumeId,
    applicationStatus,
    jobTitle,
    jobDescription,
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex my-5 mx-auto justify-between p-5 border border-[#BCC1CA] rounded-[10px]">
            <div className="flex items-center">
                <div className="bg-[#878CED] flex items-center justify-center rounded-full h-[85px] min-w-[85px] mr-5">
                    <img src={dummyprofile} style={{ width: "35px" }} />
                </div>
                <div className="profile-content">
                    <div className="flex gap-[100px] items-center">
                        {candidateName}
                        <button className="bg-[#F2F2FD] text-[#1681FF] text-xs font-normal border-none outline-none m-0 p-0 rounded-[15px] h-[30px] w-[80px]">
                            {applicationStatus}
                        </button>
                    </div>
                    <div className="flex gap-[1px]">
                        <img src={bookicon}></img>
                        <p style={{ margin: "6px" }}>{jobTitle}</p>
                    </div>
                    <div className="w-full overflow-hidden text-sm text-[#9095A0]">
                        {/* Scoped Class Names: I added a custom prefix (e.g.,
            .job-responses-container-custom, .search-button, etc.) to ensure
            that these styles apply only to elements with the corresponding
            classes within the specific component. This will reduce the risk of
            these styles affecting other parts of your project. */}
                        {jobDescription}
                    </div>
                </div>
            </div>
            <div className="cursor-pointer w-[80px] h-[25px] bg-[#F2F2FD] flex gap-[5px] rounded border border-[#F2F2FD] px-[10px] py-[5px] justify-center items-center">
                <img src={Eye} style={{ width: "15px" }} />
                <h3
                    className="m-0 border-0 text-[#1681FF] font-normal text-[15px]"
                    onClick={() => navigate("/candidate/profile")}
                >
                    Detail
                </h3>
            </div>
        </div>
    );
};

export default CandidatesCard;
