import React, { useEffect, useState } from "react";
import { Button, message, Select } from "antd"; // Added Select
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import Main from "../Layout";
// import "./Applications.css";
// import Pageloading from "../../../common/loading/Pageloading";
// import GoBack from "../../../common/Goback"
import AppTable from "../../../common/AppTable";

const apiurl = import.meta.env.VITE_BACKEND_URL;
const { Option } = Select;

const Applications = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token } = useAuth();
    const [locationFilter, setLocationFilter] = useState("All");

    const getData = async () => {
        setLoading(true);
        try {
            // Fetching all data for client-side pagination/filtering in AppTable
            const response = await fetch(
                `${apiurl}/client/get-resumes/?page_size=1000`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const result = await response.json();
            // Assuming result.results contains the array if paginated, or result if list
            setData(result.results || result);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            message.error("Failed to fetch applications.");
        } finally {
            setLoading(false);
        }
    };

    const updateState = async () => {
        try {
            // setLoading(true); // Don't block UI for this background update
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
                },
            );
            const data = response.json();
            if (data.error) {
                console.error(data.error);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (token) {
            getData();
            updateState();
        }
    }, [token]);

    const handleResumes = (id) => {
        navigate(`/client/get-resumes/${id}`);
    };

    const columns = [
        {
            header: "Job Title",
            accessorKey: "job_title",
            searchField: true,
        },
        {
            header: "Organization",
            accessorKey: "organization",
            cell: ({ getValue }) => getValue() || "N/A",
            searchField: true,
        },
        {
            header: "Num Of Positions",
            accessorKey: "num_of_postings",
        },
        {
            header: "Location Status",
            accessorKey: "location_status",
            searchField: true,
        },
        {
            header: "Last Date to Submit",
            accessorKey: "last_date",
            dateFilter: true, // Enable date filter
        },
        {
            header: "Applications Received",
            accessorKey: "applications_sent",
        },
        {
            header: "View Resume",
            id: "view_resume",
            cell: ({ row }) => (
                <button
                    className="px-2.5 py-[2px] bg-[#1681FF0D] text-[#1681FF] border-none h-10 rounded-[10px] cursor-pointer transition-colors duration-300 text-sm hover:bg-[#40a9ff] hover:text-white"
                    onClick={() => handleResumes(row.original.job_id)}
                >
                    View Resumes
                </button>
            ),
        },
    ];

    // Filter data based on location_status
    const filteredData = (data || []).filter((item) => {
        if (locationFilter === "All") return true;
        return (
            item.location_status?.toLowerCase() === locationFilter.toLowerCase()
        );
    });

    return (
        <Main defaultSelectedKey="3">
            <div className="p-5">
                {/* <div className="-ml-6 -mt-1"><GoBack /></div> */}
                <AppTable
                    columns={columns}
                    data={filteredData}
                    isLoading={loading}
                    customFilters={
                        <Select
                            defaultValue="All"
                            style={{ width: 170 }}
                            onChange={(value) => setLocationFilter(value)}
                            className="custom-filter-select"
                        >
                            <Option value="All">All Locations</Option>
                            <Option value="Remote">Remote</Option>
                            <Option value="Hybird">Hybrid</Option>
                            <Option value="On-Site">On-Site</Option>
                        </Select>
                    }
                />
            </div>
        </Main>
    );
};

export default Applications;
