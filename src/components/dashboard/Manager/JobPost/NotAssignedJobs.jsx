import React, { useEffect, useState } from "react";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";
import { Button, Modal, Input, message, Tag, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckOutlined, EditOutlined, CloseOutlined } from "@ant-design/icons";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const NotAssignedJobs = () => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recruiters, setRecruiters] = useState([]);
    const [openModal, setOpenModal] = useState();
    const [selectedId, setSelectedId] = useState();
    const [selectedRecruiters, setSelectedRecruiters] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/manager/jobs/not-assigned/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const res = await response.json();
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            message.error("Failed to fetch jobs");
        }
        setLoading(false);
    };

    const fetchRecruiters = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${apiurl}/agency/recruiters/?names=true`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setRecruiters(data);
        } catch (error) {
            console.error("Error fetching recruiters:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRecruiters = (location_id) => {
        setSelectedId(location_id);
        fetchRecruiters();
        setOpenModal(true);
    };

    const assignRecruiters = async () => {
        try {
            await fetch(
                `${apiurl}/manager/job/assign-recruiter/by-location/${selectedId}/`,
                {
                    // selectedId = joblocationId
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recruiters: selectedRecruiters }),
                },
            );
            message.success("Job post assigned to recruiters");
            setSelectedId(null);
            setSelectedRecruiters(null);
            setOpenModal(false);

            fetchData();
        } catch (err) {
            message.error("Error rejecting job");
        }
    };

    const columns = [
        {
            accessorKey: "job_title",
            header: "Job Title",
            searchField: true,
            width: 250,
            cell: ({ row }) => (
                <div
                    onClick={() => {
                        navigate(`/agency/postings/${row.original.id}`);
                    }}
                    className="font-semibold cursor-pointer text-[#3B82F6] hover:underline"
                >
                    {row.getValue("job_title")}
                </div>
            ),
        },
        {
            accessorKey: "client_name",
            header: "Client Name",
            searchField: true,
            width: 200,
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("created_at")).toLocaleString(),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("deadline")).toLocaleString(),
        },
        {
            accessorKey: "location",
            header: "Location",
            width: 120,
        },
        {
            header: "Assign to Recruiters",
            accessorKey: "location_id",
            width: 220,
            cell: ({ row }) => {
                const job = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            onClick={() =>
                                handleAssignRecruiters(job.location_id)
                            }
                            title="Assign Recruiters"
                            className="bg-[#10B981] hover:bg-[#059669] text-white border-none"
                        >
                            Assign now
                        </Button>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    return (
        <Main defaultSelectedKey="2" defaultSelectedChildKey="2-2">
            <div className="-ml-4 mt-4">
                <GoBack />
            </div>
            <AppTable
                title="Not Approved Jobs"
                columns={columns}
                data={data}
                loading={loading}
            />

            {/* Modal for Reject Feedback */}
            <Modal
                title="Assign job"
                open={openModal}
                onOk={assignRecruiters}
                onCancel={() => {
                    setOpenModal(false);
                    setSelectedRecruiters(null);
                }}
                okText="Submit"
                okButtonProps={{ disabled: selectedRecruiters?.length === 0 }}
            >
                <p>Select the recruiters from the dropdown:</p>
                <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select recruiters"
                    value={selectedRecruiters}
                    onChange={(values) => setSelectedRecruiters(values)}
                >
                    {recruiters.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
                {/* <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback here..."
                /> */}
            </Modal>
        </Main>
    );
};

export default NotAssignedJobs;
