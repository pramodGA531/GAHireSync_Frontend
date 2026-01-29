import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/useAuth';
import { message, Table } from 'antd';

const PrevInterviewRes = ({ ApplicationId }) => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiurl}/interviewer/prev-interview-remarks/?id=${ApplicationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (result.error) {
                message.error("There is an error in this section");
            } else {
                setData(result.data); // Assuming API response has a `data` key
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch data");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [token, ApplicationId]);

    const columns = [
        {
            title: 'Interview ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Interview Schedule ID',
            dataIndex: 'interview_schedule',
            key: 'interview_schedule',
        },
        {
            title: 'Job Application ID',
            dataIndex: 'job_application',
            key: 'job_application',
        },
        {
            title: 'Job ID',
            dataIndex: 'job_id',
            key: 'job_id',
        },
        {
            title: 'Round Number',
            dataIndex: 'round_num',
            key: 'round_num',
        },
        {
            title: 'Primary Skills Rating',
            dataIndex: 'primary_skills_rating',
            key: 'primary_skills_rating',
            render: (text) => {
                try {
                    const parsed = JSON.parse(text.replace(/'/g, '"')); // Fix single quotes
                    return Object.entries(parsed).map(([key, value]) => `${key}: ${value}`).join(", ");
                } catch (error) {
                    console.error("JSON Parsing Error:", error);
                    return text; // Return raw text if parsing fails
                }
            },
        },
        {
            title: 'Secondary Skills Rating',
            dataIndex: 'secondary_skills_ratings',
            key: 'secondary_skills_ratings',
            render: (text) => {
                try {
                    const parsed = JSON.parse(text.replace(/'/g, '"')); // Fix single quotes
                    return Object.entries(parsed).map(([key, value]) => `${key}: ${value}`).join(", ");
                } catch (error) {
                    console.error("JSON Parsing Error:", error);
                    return text; // Return raw text if parsing fails
                }
            },
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{ color: status === 'SELECTED' ? 'green' : 'red' }}>
                    {status}
                </span>
            ),
        },
    ];

    return (
        <div>
            <h2>Previous Interview Remarks</h2>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                bordered
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default PrevInterviewRes;
