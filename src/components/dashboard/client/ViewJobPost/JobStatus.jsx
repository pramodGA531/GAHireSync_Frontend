import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import { Button } from "antd";
import { useAuth } from "../../../common/useAuth";
const JobStatus = ({ job, onClose }) => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState();

    useEffect(() => {
        fetch(`${apiurl}/api/client/recruiter_data/${job.id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data.data);
                console.log(data.data);
            })
            .catch((error) => console.error(error));
    }, [token]);
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#FAFAFB]">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            Job ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            Recruiter Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            No. of Resumes Sent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            No. of Resumes Selected
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            No. of Resumes Rejected
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#565E6C] uppercase tracking-wider">
                            No. of Pending Resumes
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data && (
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {job.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.recruiter_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.resume_sent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.resume_selected}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.resume_rejected}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.resume_pending}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JobStatus;
