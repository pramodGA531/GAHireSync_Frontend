import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/context";
import { useParams, useNavigate } from "react-router-dom";
import Main from "./Layout";
import { Table, Button } from "antd";
import GoBack from "../../common/Goback";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const ChangeStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { login, authToken } = useContext(AuthContext);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, [login]);

    useEffect(() => {
        setLoading(true);
        fetch(`${apiurl}/api/get_all_staff/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setStaff(data);
                setLoading(false);
            })
            .catch((e) => {
                console.log("Error fetching staff:", e);
                setLoading(false);
            });
    }, [authToken]);

    const handleSelect = async (staffUsername) => {
        try {
            const response = await fetch(`${apiurl}/api/select_staf/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    client: staffUsername,
                    id: id,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    navigate(-1);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const columns = [
        {
            title: "Staff Member",
            dataIndex: "username",
            key: "username",
            render: (text) => (
                <span className="font-bold text-[#071C50]">{text}</span>
            ),
        },
        {
            title: "Profile",
            key: "profile",
            render: () => (
                <Button className="bg-gray-100 text-gray-600 border-none hover:bg-gray-200 font-bold text-xs">
                    View Complete Profile
                </Button>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    onClick={() => handleSelect(record.username)}
                    className="bg-[#1681FF] text-white border-none hover:bg-[#0061D5] font-bold text-xs"
                >
                    Assign Staff
                </Button>
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
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#071C50]">
                            Change Staff Assignment
                        </h2>
                        <Button
                            onClick={() => navigate(-1)}
                            className="bg-gray-100 text-gray-600 border-none hover:bg-gray-200 font-bold"
                        >
                            Back
                        </Button>
                    </div>
                    <div className="p-0">
                        <Table
                            columns={columns}
                            dataSource={staff}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 15, className: "p-4" }}
                        />
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default ChangeStaff;
