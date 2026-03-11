import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Select } from "antd"; // Added Select
import { useAuth } from "../../../../common/useAuth";
import dayjs from "dayjs";
// import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../../common/CustomDatePicker";

import Pageloading from "../../../../common/loading/Pageloading";
// import { EyeOutlined } from "@ant-design/icons";
import Main from "../../Layout";
// import Goback from "../../../../common/Goback";
import AppTable from "../../../../common/AppTable";

const { Option } = Select; // Destructure Option

const Onhold = ({ selectedJob }) => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const yesterday = new Date();
    const [jobStatusFilter, setJobStatusFilter] = useState("All"); // Add filter state
    yesterday.setDate(yesterday - 1);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/on-hold/?job_id=${selectedJob}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
                console.log("dataaa", result);
                return;
            }

            setData(result);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const updateState = async () => {
        try {
            // setLoading(true); // Don't block UI
            const response = await fetch(
                `${apiurl}/update-notification-seen/`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: "onhold_candidate",
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
            fetchData();
            updateState();
        }
    }, [token, selectedJob]);

    // Select candidate
    const handleSelect = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleSubmitSelection = async (values) => {
        try {
            setLoading(true);
            const formattedDate = dayjs(values.joining_date).format(
                "YYYY-MM-DD",
            );
            const payload = {
                ...values,
                joining_date: formattedDate,
            };

            const response = await fetch(
                `${apiurl}/client/select-candidate/?id=${selectedCandidate.application_id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                },
            );
            const result = await response.json();
            console.log("result", result);
            if (result.message) {
                message.success(result.message);
                fetchData();
            } else {
                message.error(result.error);
            }
        } catch (e) {
            console.log(e);
            message.error(e);
        } finally {
            setLoading(false);
        }

        setIsModalOpen(false);
    };

    // Table columns
    const columns = [
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            cell: ({ row }) => (
                <div
                    className="name"
                    style={{
                        color: "#2C5F99",
                        fontWeight: "600",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate(
                            `/client/application/${row.original.application_id}`,
                        );
                    }}
                >
                    {row.original.candidate_name}
                </div>
            ),
            searchField: true,
        },
        {
            header: "Agency",
            accessorKey: "organization_name",
            searchField: true,
        },
        {
            header: "Job Title",
            accessorKey: "job_title",
            width: 220,
            searchField: true,
        },
        {
            header: "Location",
            accessorKey: "location",
            width: 220,
            searchField: true,
        },
        {
            header: "Job Department",
            accessorKey: "job_department",
            cell: ({ getValue }) => getValue() || "N/A",
            searchField: true,
        },
        {
            header: "Job Status",
            accessorKey: "job_status",
            searchField: true,
        },
        {
            header: "Job Location Status",
            accessorKey: "location_status",
            width: 180,
            searchField: true,
        },
        {
            header: "Action",
            accessorKey: "action",
            width: 120,
            cell: ({ row }) =>
                row.original.job_status === "opened" ? (
                    <Button
                        disabled={row.original.location_status === "closed"}
                        type="primary"
                        onClick={() => handleSelect(row.original)}
                    >
                        Select
                    </Button>
                ) : (
                    <div status="closed">Job post closed</div>
                ),
        },
    ];

    const filteredData = (data || []).filter((item) => {
        if (jobStatusFilter === "All") return true;
        return item.job_status?.toLowerCase() === jobStatusFilter.toLowerCase();
    });

    return (
        <Main defaultSelectedKey="4" defaultSelectedChildKey="4-2">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    <div>
                        {/* <div className="mt-4 -ml-2"> 
                            <Goback />
                        </div> */}
                        <div className="p-5">
                            <AppTable
                                data={filteredData}
                                columns={columns}
                                customFilters={
                                    <Select
                                        defaultValue="All"
                                        style={{ width: 150 }}
                                        onChange={(value) =>
                                            setJobStatusFilter(value)
                                        }
                                        className="custom-filter-select"
                                    >
                                        <Option value="All">
                                            All Job Status
                                        </Option>
                                        <Option value="opened">Opened</Option>
                                        <Option value="closed">Closed</Option>
                                    </Select>
                                }
                            />
                        </div>

                        <Modal
                            title={`Select Candidate: ${selectedCandidate?.candidate_name}`}
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            footer={null}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmitSelection}
                            >
                                <Form.Item
                                    label="Agreed CTC"
                                    name="ctc"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter agreed CTC",
                                        },
                                    ]}
                                >
                                    <Input type="number" step="0.01" />
                                </Form.Item>
                                <Form.Item
                                    label="Agreed Joining Date"
                                    name="joining_date"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select joining date",
                                        },
                                    ]}
                                >
                                    <CustomDatePicker
                                        size="sm"
                                        startDate={yesterday}
                                        style={{ width: "100%" }}
                                        disabledDate={(current) =>
                                            current &&
                                            current < dayjs().startOf("day")
                                        }
                                    />
                                </Form.Item>
                                <Form.Item label="Remarks" name="remarks">
                                    <Input.TextArea placeholder="Any additional remarks" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Submit
                                </Button>
                            </Form>
                        </Modal>
                    </div>
                </>
            )}
        </Main>
    );
};

export default Onhold;
