import { useState, useEffect } from "react";
import { Button } from "antd";
import Main from "../Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import AppTable from "../../../common/AppTable";

const AllOrgsData = () => {
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();
    const [orgsData, setOrgsData] = useState([]);

    const columns = [
        {
            header: "Organization Names",
            accessorKey: "manager_username",
            searchField: true,
        },
        {
            header: "Organization Phone Number",
            accessorKey: "contact_number",
            searchField: true, // Assuming we want to filter by phone number too
        },
        {
            header: "Organization Name",
            accessorKey: "organization_name",
            searchField: true,
        },
        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            navigate(
                                `/client/organizations/${row.original.id}`,
                            );
                        }}
                    >
                        Organization details
                    </Button>
                );
            },
        },
    ];

    useEffect(() => {
        const fetchOrgsData = async () => {
            try {
                const response = await fetch(`${apiurl}/client/orgs-data/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setOrgsData(data);
            } catch (error) {
                console.error("Error fetching clients data:", error);
            }
        };

        fetchOrgsData();
    }, [apiurl, token]);

    return (
        <Main defaultSelectedKey="9">
            <h1 className="text-2xl font-bold mb-4 ml-5 mt-5">
                All Organizations
            </h1>
            <div className="p-5">
                <AppTable columns={columns} data={orgsData} />
            </div>
        </Main>
    );
};

export default AllOrgsData;
