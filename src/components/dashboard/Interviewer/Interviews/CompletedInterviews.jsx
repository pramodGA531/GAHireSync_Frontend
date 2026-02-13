import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../common/useAuth";
import { Button, message, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import AppTable from "../../../common/AppTable";
// import "./ScheduledInterviews.css";
import Pageloading from "../../../common/loading/Pageloading";
import Main from "../Layout";
import GoBack from "../../../common/Goback";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const CompletedInterviews = () => {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modeFilter, setModeFilter] = useState("All");

    const navigate = useNavigate();
    const location = useLocation();
    const parseSkills = (skills) => {
        if (typeof skills === "string") {
            try {
                // convert single quotes to double quotes
                const fixed = skills.replace(/'/g, '"');
                return JSON.parse(fixed);
            } catch (e) {
                console.error("Invalid skills format", e);
                return null;
            }
        }
        return skills;
    };

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/interviewer/completed-interviews/?page=${page}`,
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
                return;
            }
            setData(data.results);
            setTotal(data.count);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        let result = data || [];
        if (modeFilter !== "All") {
            result = result.filter(
                (item) => item.mode_of_interview === modeFilter,
            );
        }
        return result;
    }, [data, modeFilter]);

    const modeOptions = useMemo(() => {
        const modes = [
            ...new Set(
                (data || [])
                    .map((item) => item.mode_of_interview)
                    .filter(Boolean),
            ),
        ];
        return [
            { label: "All Modes", value: "All" },
            ...modes.map((mode) => ({ label: mode, value: mode })),
        ];
    }, [data]);

    const customFilters = (
        <Select
            value={modeFilter}
            onChange={setModeFilter}
            options={modeOptions}
            style={{ width: 180 }}
            placeholder="Select Mode"
        />
    );

    useEffect(() => {
        if (token) {
            fetchData(currentPage);
        }
    }, [token, currentPage]);

    const columns = [
        {
            header: "Job Title",
            accessorKey: "job_title",
            searchField: true,
            cell: ({ row }) => (
                <div
                    onClick={() => {
                        navigate(
                            `/interviewer/jobpost/${row.original.job_id}`,
                            {
                                state: { from: location.pathname },
                            },
                        );
                    }}
                    style={{
                        color: "#2C5F99",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                >
                    {row.original.job_title}
                </div>
            ),
        },
        {
            header: "Rounds Number",
            accessorKey: "round_num",
        },
        {
            header: "Mode of Interview",
            accessorKey: "mode_of_interview",
        },
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            searchField: true,
        },
        {
            header: "Scheduled Time",
            accessorKey: "scheduled_date",
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        },
    ];

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
            {loading ? (
                <Pageloading />
            ) : (
                data && (
                    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        {/* <div className="-ml-6">
                            <GoBack />
                        </div> */}
                        <h1 className="text-xl font-bold">
                            Completed Interviews
                        </h1>
                        <AppTable
                            columns={columns}
                            data={filteredData}
                            customFilters={customFilters}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                                        <div>
                                            <strong className="text-gray-700">
                                                Primary Skills Rating:
                                            </strong>{" "}
                                            {(() => {
                                                const skillsObj = parseSkills(
                                                    record.primary_skills_rating,
                                                );
                                                return skillsObj
                                                    ? Object.entries(skillsObj)
                                                          .map(
                                                              ([key, value]) =>
                                                                  `${key} : ${value}`,
                                                          )
                                                          .join(", ")
                                                    : "N/A";
                                            })()}
                                        </div>

                                        <div>
                                            <strong className="text-gray-700">
                                                Secondary Skills Rating:
                                            </strong>{" "}
                                            {(() => {
                                                const secskillsObj =
                                                    parseSkills(
                                                        record.secondary_skills_rating,
                                                    );
                                                return secskillsObj
                                                    ? Object.entries(
                                                          secskillsObj,
                                                      )
                                                          .map(
                                                              ([key, value]) =>
                                                                  `${key} : ${value}`,
                                                          )
                                                          .join(", ")
                                                    : "N/A";
                                            })()}
                                        </div>

                                        <div>
                                            <strong className="text-gray-700">
                                                Remarks:
                                            </strong>{" "}
                                            {record?.remarks || "No Remarks"}
                                        </div>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                )
            )}
        </Main>
    );
};

export default CompletedInterviews;
