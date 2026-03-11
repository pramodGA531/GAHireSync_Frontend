import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { message, Breadcrumb, Button } from "antd";
import Main from "../Layout";
import Pageloading from "../../../common/loading/Pageloading";
import ViewApplication from "../../../common/ViewApplication";
import { ArrowLeftOutlined, SolutionOutlined } from "@ant-design/icons";
import GoBack from "../../../common/Goback";

const CompleteApplication = () => {
    const [data, setData] = useState(null);
    const { apiurl, token } = useAuth();
    const { application_id, job_id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/complete-application/?application_id=${application_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                setData(data);
            }
        } catch (e) {
            console.log(e);
            message.error("Something went wrong while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token, application_id]);

    if (loading || !data)
        return (
            <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
                <div className="h-screen flex items-center justify-center bg-gray-50/30">
                    <Pageloading />
                </div>
            </Main>
        );

    const { application_data } = data;

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-1">
            {/* <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div> */}
            <div className="p-6 md:p-8">
                <div className="max-w-[1400px] mx-auto">
                    {/* Header/Navigation */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <Breadcrumb
                                items={[
                                    {
                                        title: (
                                            <span
                                                className="text-gray-400  text-[10px] cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        "/recruiter/postings/opened",
                                                    )
                                                }
                                            >
                                                Assigned jobs
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span
                                                className="text-gray-400  text-[10px] cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/recruiter/job-applications/${job_id}`,
                                                    )
                                                }
                                            >
                                                Profiles
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-gray-800 text-[10px]">
                                                Evaluation Job
                                            </span>
                                        ),
                                    },
                                ]}
                                className="mb-4"
                            />
                            <div className="flex items-center gap-4">
                                {/* <Button
                                    onClick={() => navigate(-1)}
                                    icon={<ArrowLeftOutlined />}
                                    shape="circle"
                                    className="border-none bg-white shadow-sm hover:text-[#1681FF]"
                                /> */}
                                <div>
                                    <h1 className="text-3xl font-black text-black tracking-tight">
                                        System Job
                                    </h1>
                                    <p className="text-sm text-gray-400 font-bold mt-1">
                                        Complete Candidate Insight & Historical
                                        Evaluation
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1681FF]">
                                <SolutionOutlined className="text-2xl" />
                            </div>
                            {/* <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none mb-1">
                                    Access Level
                                </p>
                                <p className="text-[#071C50] font-black text-sm uppercase tracking-tighter">
                                    Authorized Recruiter
                                </p>
                            </div> 
                        </div> */}
                    </div>

                    {/* Content Area */}
                    <div className="rounded-[40px] overflow-hidden">
                        <ViewApplication application_data={application_data} />
                    </div>

                    {/* <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                            End of Professional Job
                        </p>
                    </div> */}
                </div>
            </div>
        </Main>
    );
};

export default CompleteApplication;
