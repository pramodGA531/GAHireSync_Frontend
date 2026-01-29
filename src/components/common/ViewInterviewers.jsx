import React from "react";

const InterviewersTable = ({ interviewers }) => {
    return (
        <div className="mt-5 p-5 bg-white shadow-[0px_4px_8px_rgba(0,0,0,0.1)] rounded-lg text-base">
            {interviewers && interviewers.length > 0 ? (
                <table className="w-full border-collapse mt-2.5">
                    <thead>
                        <tr>
                            <th className="border border-[#ddd] p-2.5 text-left bg-[#f4f4f4] font-bold uppercase">
                                Round
                            </th>
                            <th className="border border-[#ddd] p-2.5 text-left bg-[#f4f4f4] font-bold uppercase">
                                Interviewer Name
                            </th>
                            <th className="border border-[#ddd] p-2.5 text-left bg-[#f4f4f4] font-bold uppercase">
                                Interviewer Email
                            </th>
                            <th className="border border-[#ddd] p-2.5 text-left bg-[#f4f4f4] font-bold uppercase">
                                Mode of Interview
                            </th>
                            <th className="border border-[#ddd] p-2.5 text-left bg-[#f4f4f4] font-bold uppercase">
                                Type of Interview
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {interviewers.map((interviewer, index) => (
                            <tr
                                key={index}
                                className="even:bg-[#f9f9f9] hover:bg-[#f1f1f1]"
                            >
                                <td className="border border-[#ddd] p-2.5 text-left">
                                    {interviewer.round_num}
                                </td>
                                <td className="border border-[#ddd] p-2.5 text-left">
                                    {interviewer.name.username}
                                </td>
                                <td className="border border-[#ddd] p-2.5 text-left">
                                    {interviewer.name.email}
                                </td>
                                <td className="border border-[#ddd] p-2.5 text-left">
                                    {interviewer.mode_of_interview}
                                </td>
                                <td className="border border-[#ddd] p-2.5 text-left">
                                    {interviewer.type_of_interview}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center italic text-gray-500 mt-2.5">
                    No interviewers data available
                </p>
            )}
        </div>
    );
};

export default InterviewersTable;
