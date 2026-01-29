import agencylogo from "../../../../images/cand-accpt-offer/agency.svg";
import agreed from "../../../../images/cand-accpt-offer/agreedctc.svg";
import date from "../../../../images/cand-accpt-offer/dateicon.svg";
import actualctc from "../../../../images/cand-accpt-offer/actualctc.svg";
import View from "../../../../images/View.svg";
import { useNavigate } from "react-router-dom";

function CandAcceptJob({
    job_title,
    company,
    joining,
    org_code,
    offered_ctc,
    agreed_ctc,
    benfits,
    acceptance,
    onAccept,
    onReject,
    job_id,
    onEdit,
}) {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-[450px] bg-white rounded-xl shadow-[0_5px_10px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-4 flex justify-between items-start">
                <div className="flex-1 flex justify-between items-center w-full">
                    <h2 className="m-0 text-xl font-semibold text-[#333]">
                        {job_title}
                    </h2>
                    <p className="my-1 text-sm text-[#666]">{company}</p>
                    <div className="w-10 h-10 bg-[#f0f7ff] rounded-full flex justify-center items-center cursor-pointer">
                        <img
                            src={View}
                            alt=""
                            onClick={() =>
                                navigate(
                                    `/candidate/complete-jobdetails/${job_id}`
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="px-5 flex flex-wrap gap-1">
                <div className="flex items-center mb-2 p-2 rounded-full bg-[#1681FF0D]">
                    <div className="mr-2 flex items-center">
                        <img src={date} className="w-5 h-5"></img>
                    </div>
                    <span className="text-sm text-[#555]">
                        Date of Joining: {joining}
                    </span>
                </div>

                <div className="flex items-center mb-2 p-2 rounded-full bg-[#1681FF0D]">
                    <div className="mr-2 flex items-center">
                        <img src={agencylogo} className="w-5 h-5"></img>
                    </div>
                    <span className="text-sm text-[#555]">
                        Agency: {org_code}
                    </span>
                </div>

                <div className="flex items-center mb-2 p-2 rounded-full bg-[#1681FF0D]">
                    <div className="mr-2 flex items-center">
                        <img src={actualctc} className="w-5 h-5"></img>
                    </div>
                    <span className="text-sm text-[#555]">
                        Offered CTC: {offered_ctc}
                    </span>
                </div>

                <div className="flex items-center mb-2 p-2 rounded-full bg-[#1681FF0D]">
                    <div className="mr-2 flex items-center">
                        <img src={agreed} className="w-5 h-5"></img>
                    </div>
                    <span className="text-sm text-[#555]">
                        Accepted: {agreed_ctc}
                    </span>
                </div>
            </div>

            <div className="m-[11px_20px] bg-[#f0f7ff] p-[10px] rounded-lg">
                <h3 className="mb-2 text-base font-semibold text-[#333]">
                    Benefits
                </h3>
                {benfits ? (
                    <p className="m-0 text-sm text-[#666] leading-relaxed">
                        {benfits}
                    </p>
                ) : (
                    "N/A"
                )}
            </div>

            <div className="h-[1px] bg-[#eee] mt-[10px]"></div>

            {/* Action buttons */}
            <div className="flex p-[10px_20px] justify-around gap-[10px]">
                {acceptance === "accepted" ? (
                    <div className="text-green-600 font-medium">Accepted</div>
                ) : (
                    <>
                        <button
                            className="px-5 py-2 rounded-md text-sm font-medium cursor-pointer border-none bg-[#ffebee] text-[#f44336] hover:bg-[#ffcdd2]"
                            onClick={onReject}
                        >
                            Reject
                        </button>
                        <button
                            className="px-5 py-2 rounded-md text-sm font-medium cursor-pointer border-none bg-[#e3f2fd] text-[#2196f3] hover:bg-[#bbdefb]"
                            onClick={onAccept}
                        >
                            Accept
                        </button>
                        <button
                            className="px-5 py-2 rounded-md text-sm font-medium cursor-pointer border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={onEdit}
                        >
                            Request joining date{" "}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default CandAcceptJob;
