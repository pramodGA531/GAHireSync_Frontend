import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Main from "../Layout";
import GoBack from "../../../common/Goback";

const EditRequests = () => {
    const navigate = useNavigate();
    // const [jobList, setJobList] = useState([]);

    // Placeholder data for visual verification
    const jobList = [
        { id: 101, job_title: "Mock Job Title", status: "Pending" },
    ];

    useEffect(() => {
        console.log("Fetching Edit Requests (Log Only)");
    }, []);

    const handleDetails = (id) => {
        // navigate(`/client/edit_job/${id}`);
        console.log("View details for", id);
        navigate(`/client/edit_job/12`); // Mock navigation
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Job Title",
            dataIndex: "job_title",
            key: "job_title",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" onClick={() => handleDetails(record.id)}>
                    View / Edit
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey="2">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div>
                <h3>My Edit Requests</h3>
                {jobList && jobList.length > 0 ? (
                    <Table columns={columns} dataSource={jobList} rowKey="id" />
                ) : (
                    <div className="no-postings">There are no editings</div>
                )}
            </div>
        </Main>
    );
};

export default EditRequests;
