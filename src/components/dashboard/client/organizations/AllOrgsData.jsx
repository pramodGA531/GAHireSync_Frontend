import { useState, useEffect } from "react";
import { Table, Input, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import Main from "../Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import GoBack from "../../../common/Goback";

const AllOrgsData = () => {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("All"); // New state to store selected filter
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();

    const [orgsData, setOrgsData] = useState([]);

    const columns = [
        {
            title: "Organization Name",
            dataIndex: "manager_username",
            key: "manager_username",
        },
        {
            title: "Organization Phone Number",
            dataIndex: "contact_number",
            key: "contact_number",
        },
        {
            title: "Organization Name",
            dataIndex: "organization_name",
            key: "organization_name",
        },
        // {
        //   title: "Date Completed",
        //   dataIndex: "dateCompleted",
        //   key: "dateCompleted",
        //   render: (text) => text || "-",
        // },
        // {
        //   title: "Revenue by Client",
        //   dataIndex: "revenue",
        //   key: "revenue",
        //   render: (text) => text || "-",
        // },
        // {
        //   title: "Client Satisfaction",
        //   dataIndex: "satisfaction",
        //   key: "satisfaction",
        //   render: (text) => text || "-",
        // },
        {
            title: "Action",
            key: "action",
            render: (record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            navigate(`/client/organizations/${record.id}`);
                        }}
                    >
                        Organization details
                    </Button>
                );
            },
        },
    ];

    const menu = (
        <Menu onClick={(e) => setFilter(e.key)}>
            <Menu.Item key="All">All orgs</Menu.Item>
            <Menu.Item key="Active">Active orgs</Menu.Item>
            <Menu.Item key="Inactive">Inactive orgs</Menu.Item>
            <Menu.Item key="HighRevenue">High Revenue</Menu.Item>
            <Menu.Item key="LowRevenue">Low Revenue</Menu.Item>
        </Menu>
    );

    // Handle search input change
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Filter the data based on the searchText and filter
    // const getFilteredClients = () => {
    //   return orgsData
    //     .filter((client) => {
    //       const isSearchMatch = client.client_username
    //         .toLowerCase()
    //         .includes(searchText.toLowerCase());
    //       if (filter === "All") return isSearchMatch;
    //       if (filter === "Active" && client.status === "Active") return isSearchMatch;
    //       if (filter === "Inactive" && client.status === "Inactive") return isSearchMatch;
    //       if (filter === "HighRevenue" && client.revenue >= 100000) return isSearchMatch;
    //       if (filter === "LowRevenue" && client.revenue < 100000) return isSearchMatch;
    //       return false;
    //     });
    // };

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
            <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="-ml-8">
                    <GoBack />
                </div>
                <h1 className="text-2xl font-bold mb-4">All Organizations</h1>
                
                <div className="flex justify-between items-center mb-5 max-md:flex-col max-md:items-start max-md:gap-2.5">
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        className="w-[300px] rounded max-md:w-full"
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button className="flex items-center rounded">
                            Filters <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <Table
                    // dataSource={getFilteredClients()}
                    dataSource={orgsData}
                    columns={columns}
                    // pagination={{ pageSize: 10 }}
                    pagination={false}
                    className="w-full"
                    size="middle"
                    bordered={false}
                    scroll={{ x: 800 }}
                />
            </div>
        </Main>
    );
};

export default AllOrgsData;
