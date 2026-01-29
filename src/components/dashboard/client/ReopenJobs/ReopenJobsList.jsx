import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../common/Goback";

const ReopenJobsList = () => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/client/closed-jobslist/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setData(result);
            }
        } catch (e) {
            console.log(e);
            message.error("An error occurred while fetching data.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <Main defaultSelectedKey="1">
            <div className="mt-4 -ml-2 -mb-4 pl-4">
                <GoBack />
            </div>
            <div className="max-w-[80%] mx-auto p-5 bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] mt-5 mb-5">
                <h2 className="text-center text-2xl text-[#333] mb-5 font-semibold">
                    Reopen Job Posts
                </h2>
                {data.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {data.map((item, index) => (
                            <div
                                className="p-4 border border-[#ddd] rounded-lg bg-[#f9f9f9] transition-transform duration-200 hover:scale-[1.02] flex flex-col items-start gap-2"
                                key={index}
                            >
                                <h3 className="m-0 text-lg text-[#222] font-semibold">
                                    {item.job_title}
                                </h3>
                                <p className="m-0 text-[#555]">
                                    <strong>Job Department:</strong>{" "}
                                    {item.job_department}
                                </p>
                                <p className="m-0 text-[#555]">
                                    <strong>Organization:</strong>{" "}
                                    {item.organization}
                                </p>
                                <button
                                    className="bg-[#007bff] text-white border-none py-2 px-3 rounded cursor-pointer mt-2.5 text-sm hover:bg-[#0056b3]"
                                    onClick={() => {
                                        navigate(
                                            `/client/reopen-job/${item.job_id}`,
                                        );
                                    }}
                                >
                                    Renew Job
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[#888] text-base">
                        No closed job posts available.
                    </p>
                )}
            </div>
        </Main>
    );
};

export default ReopenJobsList;
