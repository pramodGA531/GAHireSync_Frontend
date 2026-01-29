import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Button, Modal, Form, Input, message, Table } from "antd";
// import { useAuth } from '../../../../common/useAuth';
import { useAuth } from "../../../common/useAuth";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../../../common/CustomDatePicker";
// import "../../SelectedCandidates.css"
import Pageloading from "../../../common/loading/Pageloading";
import { title } from "framer-motion/client";
import GoBack from "../../../common/Goback";

const JoiningDateRequest = ({ selectedJob }) => {
    const { token, apiurl } = useAuth();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        console.log("running this function to get the data ");
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/client/cand-request/?job_id=${selectedJob}`,
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
            console.log("running this function to get the data ", result);
            setFilteredData(
                result.filter((record) => {
                    console.log("record.edit_request:", record.edit_request);
                    return (
                        record.edit_request != "" &&
                        !record.client_accept_request
                    );
                }),
            );
        } catch (e) {
            console.log(e);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            updateState();
        }
    }, [token, selectedJob]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = data.filter(
            (item) =>
                item.candidate_name.toLowerCase().includes(value) ||
                item.organization_name.toLowerCase().includes(value) ||
                item.job_title.toLowerCase().includes(value) ||
                (item.job_department &&
                    item.job_department.toLowerCase().includes(value)),
        );
        setFilteredData(filtered);
    };

    // Select candidate
    const handleSelect = (candidate) => {
        console.log("candidate", candidate);
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleUpdateJoiningDate = async (values) => {
        console.log("Updating joining date...");
        try {
            setLoading(true);
            const formattedDate = dayjs(values.joining_date).format(
                "YYYY-MM-DD",
            );
            console.log("selectedCandidate", selectedCandidate.select_cand_id);
            const response = await fetch(
                `${apiurl}/client/select-candidate/?id=${selectedCandidate.select_cand_id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ joining_date: formattedDate }),
                },
            );

            const result = await response.json();
            console.log("Update result", result);

            if (result.message) {
                message.success(result.message);
                fetchData(); // refresh UI if needed
            } else {
                message.error(result.error);
            }
        } catch (e) {
            console.error(e);
            message.error("Something went wrong while updating.");
        } finally {
            setLoading(false);
        }

        setIsModalOpen(false);
    };

    // Table columns
    const columns = [
        {
            title: "Candidate Name",
            dataIndex: "candidate_name",
            key: "candidate_name",
            render: (name, application) => (
                <div
                    className="name"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        navigate(
                            `/client/candidates/${application.application_id}`,
                        );
                    }}
                >
                    {name}
                </div>
            ),
        },
        {
            title: "Joining Date",
            dataIndex: "joining_date",
            key: "joining_date",
        },

        {
            title: "Agency",
            dataIndex: "organization_name",
            key: "organization_name",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Job Department",
            dataIndex: "job_department",
            key: "job_department",
            render: (text) => text || "N/A",
        },
        {
            title: "Job Status",
            dataIndex: "job_status",
            key: "job_status",
        },
        {
            title: "cand request",
            dataIndex: "edit_request",
            key: "edit_request",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) =>
                record.edit_request != "" && !record.client_accept_request ? (
                    <Button type="primary" onClick={() => handleSelect(record)}>
                        Edit
                    </Button>
                ) : (
                    <div status="closed">-</div>
                ),
        },
    ];

    return (
        <>
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    <div>
                        <div className="mt-4 -ml-2 -mb-2">
                            <GoBack />
                        </div>
                        <div className="flex m-2 mt-5 pl-[15px] rounded-[10px] border border-[#A2A1A866] outline-none text-[#16151C] text-sm font-light items-center h-[55px] gap-2.5">
                            <SearchOutlined />
                            <input
                                type="text"
                                placeholder="Search candidates, agency, job title..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="border-none m-2 outline-none text-[#16151C] w-[90%]"
                            />
                        </div>

                        <div className="custom-table-container onhold-table-wrapper">
                            <Table
                                dataSource={filteredData}
                                columns={columns}
                                rowKey="selected_candidate_id"
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
                                onFinish={handleUpdateJoiningDate}
                            >
                                {/* <Form.Item
                                    label="Agreed CTC"
                                    name="ctc"
                                    rules={[{ required: true, message: 'Please enter agreed CTC' }]}
                                >
                                    <Input type="number" step="0.01" />
                                </Form.Item> */}
                                <Form.Item
                                    label="changed Joining Date"
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
                                        style={{ width: "100%" }}
                                        disabledDate={(current) =>
                                            current &&
                                            current < dayjs().startOf("day")
                                        }
                                    />
                                </Form.Item>
                                {/* <Form.Item label="Remarks" name="remarks">
                                    <Input.TextArea placeholder="Any additional remarks" />
                                </Form.Item> */}
                                <Button type="primary" htmlType="submit" block>
                                    Submit
                                </Button>
                            </Form>
                        </Modal>
                    </div>
                </>
            )}
        </>
    );
};

export default JoiningDateRequest;
