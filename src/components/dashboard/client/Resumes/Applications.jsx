import {
    SearchOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import { Button, Input, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Main from "../Layout";
// import "./Applications.css";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback"
const apiurl = import.meta.env.VITE_BACKEND_URL;

const Applications = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { token } = useAuth();

    const getData = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/client/get-resumes/?page=${page}&page_size=${pageSize}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const result = await response.json();
            setData(result.results);
            setFilteredData(result.results);
            setTotal(result.count);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateState = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: "send_application",
                    }),
                }
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getData(currentPage);
            updateState();
        }
    }, [token, currentPage]);

    const handleResumes = (id) => {
        navigate(`/client/get-resumes/${id}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSort = () => {
        const sorted = [...filteredData].sort((a, b) => {
            const dateA = new Date(a.last_date);
            const dateB = new Date(b.last_date);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setFilteredData(sorted);
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = data.filter(
            (job) =>
                job.job_title.toLowerCase().includes(value) ||
                (job.organization &&
                    job.organization.toLowerCase().includes(value))
        );
        setFilteredData(filtered);
    };

    return (
        <Main defaultSelectedKey="3">
            {loading ? (
                <Pageloading />
            ) : (
                <div className="p-5">
                    <div className="-ml-6 -mt-1"><GoBack /></div>
                    
                    <div className="flex justify-between items-center mb-5">
                        <div className="w-[40%] bg-white p-0 m-0">
                            <Input
                                placeholder="Search Jobs"
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full"
                            />
                        </div>
                        <div className="p-0 m-0">
                            <Button
                                icon={
                                    sortOrder === "asc" ? (
                                        <SortAscendingOutlined />
                                    ) : (
                                        <SortDescendingOutlined />
                                    )
                                }
                                onClick={handleSort}
                                className="bg-white border hover:border-blue-500 hover:text-blue-500"
                            >
                                Sort by Last Date
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-5">
                        {loading ? (
                            <div className="text-center p-5 text-[#565E6C] text-base font-medium">
                                Loading data...
                            </div>
                        ) : filteredData?.length > 0 ? (
                            <>
                                <table className="w-full min-w-[800px] mt-5 border-collapse">
                                    <thead className="bg-[#FAFAFB] border-y border-[#F3F4F6]">
                                        <tr>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Job Title
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Organization
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Num Of Positions
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Location Status
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Last Date to Submit
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                Applications Received
                                            </th>
                                            <th className="p-4 text-left font-semibold text-sm text-[#565E6C]">
                                                View Resume
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((job) => (
                                            <tr
                                                key={job.job_id}
                                                className="hover:bg-[#f9f9f9] transition-colors duration-300"
                                            >
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.job_title}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.organization || "N/A"}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.num_of_postings}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.location_status}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.last_date}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    {job.applications_sent}
                                                </td>
                                                <td className="p-[10px_16px] border-b border-[#eee] text-[#171A1F] text-sm font-normal whitespace-nowrap">
                                                    <button
                                                        className="px-2.5 py-[2px] bg-[#1681FF0D] text-[#1681FF] border-none h-10 rounded-[10px] cursor-pointer transition-colors duration-300 text-sm hover:bg-[#40a9ff] hover:text-white"
                                                        onClick={() =>
                                                            handleResumes(
                                                                job.job_id
                                                            )
                                                        }
                                                    >
                                                        View Resumes
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={handlePageChange}
                                    style={{
                                        marginTop: 20,
                                        textAlign: "center",
                                    }}
                                />
                            </>
                        ) : (
                            <div className="p-5 text-center text-[#565E6C] text-base font-medium">
                                There are no applications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Main>
    );
};

export default Applications;
