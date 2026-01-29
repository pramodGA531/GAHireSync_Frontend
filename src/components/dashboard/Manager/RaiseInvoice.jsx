import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import Main from "./Layout";
import GoBack from "../../common/Goback";
const RaiseInvoice = () => {
    const [jobList, setJobList] = useState([]);

    const authToken = sessionStorage.getItem("authToken");

    useEffect(() => {
        fetchJobPosts();
    }, []);

    const fetchJobPosts = () => {
        fetch(`${apiurl}/api/get_all_job_posts/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setJobList(data.data);
            })
            .catch((error) =>
                console.error("Error fetching job posts:", error),
            );
    };
    const handleRaiseInvoiceWithPayment = (record) => {
        console.log("Raise invoice with payment for record:", record);
    };

    const handleRaiseInvoiceWithPaymentLink = (record) => {
        console.log("Raise invoice with payment link for record:", record);
    };

    const columns = [
        {
            title: "Client Name",
            dataIndex: "username",
            key: "username",
            render: (text) => (
                <span className="font-bold text-[#071C50]">{text}</span>
            ),
        },
        {
            title: "Role",
            dataIndex: "job_title",
            key: "job_title",
            render: (text) => (
                <span className="font-medium text-gray-700">{text}</span>
            ),
        },
        {
            title: "Invoice Actions",
            key: "actions",
            render: (text, record) => (
                <div className="flex gap-3">
                    <Button
                        onClick={() => handleRaiseInvoiceWithPayment(record)}
                        className="bg-[#10B981] text-white border-none hover:bg-[#059669] font-bold text-xs"
                    >
                        Raise with Payment
                    </Button>
                    <Button
                        onClick={() =>
                            handleRaiseInvoiceWithPaymentLink(record)
                        }
                        className="bg-[#3B82F6] text-white border-none hover:bg-[#2563EB] font-bold text-xs"
                    >
                        Raise with Link
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Invoicing & Payments
                        </h2>
                    </div>
                    <div className="p-0">
                        {jobList && jobList.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={jobList}
                                rowKey="id"
                                pagination={{ pageSize: 10, className: "p-4" }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white">
                                <div className="text-5xl mb-4 opacity-20">
                                    📄
                                </div>
                                <span className="text-lg font-bold text-gray-400">
                                    No jobs available for invoicing
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default RaiseInvoice;
