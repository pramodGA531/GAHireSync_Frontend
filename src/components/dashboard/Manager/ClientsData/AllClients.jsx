import { useState, useEffect } from "react";
import { Input, Button, Dropdown, Menu, message, Modal } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
// import "./AllClients.css";
import Main from "../Layout";
import AppTable from "../../../common/AppTable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/useAuth";
import TermsModal from "./TermsModal";
import GoBack from "../../../common/Goback";

const AllClients = () => {
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("All"); // New state to store selected filter
    const navigate = useNavigate();
    const { apiurl, token } = useAuth();
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [isModalOpen, setModalOpen] = useState(false);
    const [clientsData, setClientsData] = useState([]);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [selectedNegotiation, setSelectedNegotiation] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);

    const columns = [
        {
            accessorKey: "organization_name",
            header: "Company Name",
            width: 200,
        },
        {
            accessorKey: "client_username",
            header: "Client Name",
            searchField: true,
            width: 150,
        },
        {
            accessorKey: "contact_number",
            header: "Client Phone Number",
            width: 120,
        },
        {
            accessorKey: "associated_at",
            header: "Date Associated",
            dateFilter: true,
            width: 180,
            cell: ({ row }) =>
                new Date(row.getValue("associated_at")).toLocaleDateString(),
        },
        {
            accessorKey: "negotiation_requested_on",
            header: "Negotiation Requested",
            width: 200,
            dateFilter: true,
            cell: ({ row }) =>
                row.getValue("negotiation_requested_on")
                    ? new Date(
                          row.getValue("negotiation_requested_on"),
                      ).toLocaleString()
                    : "-",
        },
        {
            accessorKey: "negotiation_accepted_on",
            header: "Negotiation Accepted",
            width: 200,
            dateFilter: true,
            cell: ({ row }) =>
                row.getValue("negotiation_accepted_on")
                    ? new Date(
                          row.getValue("negotiation_accepted_on"),
                      ).toLocaleString()
                    : "-",
        },
        {
            header: "Negotiation Details",
            accessorKey: "negotiations_request",
            width: 220,
            cell: ({ row }) => {
                const negotiation = row.original.negotiations_request;
                return (
                    <Button
                        color="blue"
                        onClick={() => handleOpenNegotiationModal(negotiation)}
                    >
                        View Details
                    </Button>
                );
            },
        },
        {
            header: "View More",
            accessorKey: "client_id",
            rightSticky: true,
            width: 150,
            cell: ({ row }) => (
                <Button
                    type="link"
                    onClick={() =>
                        navigate(`/agency/allclients/${row.original.client_id}`)
                    }
                >
                    Client Details
                </Button>
            ),
        },
    ];

    const menu = (
        <Menu onClick={(e) => setFilter(e.key)}>
            <Menu.Item key="All">All Clients</Menu.Item>
            <Menu.Item key="Active">Active Clients</Menu.Item>
            <Menu.Item key="Inactive">Inactive Clients</Menu.Item>
            <Menu.Item key="HighRevenue">High Revenue</Menu.Item>
            <Menu.Item key="LowRevenue">Low Revenue</Menu.Item>
        </Menu>
    );

    // Handle search input change
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleOpenNegotiationModal = (negotiation) => {
        setSelectedNegotiation(negotiation);
        setIsModal2Open(true);
    };

    const handleCloseModal = () => {
        setIsModal2Open(false);
        setSelectedNegotiation(null);
    };

    useEffect(() => {
        const fetchClientsData = async () => {
            try {
                const response = await fetch(
                    `${apiurl}/manager/clients-data/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setClientsData(data.data);
                setConnectionRequests(data.connection_requests);
            } catch (error) {
                console.error("Error fetching clients data:", error);
            }
        };

        fetchClientsData();
    }, [apiurl, token]);

    const handleRejectApproval = async () => {
        try {
            const res = await fetch(
                `${apiurl}/manager/reject-approval-client/?connection_id=${rejectId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        request_id: rejectId,
                        reason: rejectionReason,
                    }),
                },
            );

            const data = await res.json();
            if (res.ok) {
                message.success(`Request rejected successfully`);
                setIsRejectModalOpen(false);
                setRejectionReason("");
                // Refresh data
                const response = await fetch(
                    `${apiurl}/manager/clients-data/`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const newData = await response.json();
                setConnectionRequests(newData.connection_requests);
            } else {
                message.error(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            message.error("Network error");
        }
    };

    const openRejectModal = (id) => {
        setRejectId(id);
        setIsRejectModalOpen(true);
    };

    return (
        <Main defaultSelectedKey="5">
            {/* <div className="-ml-2 mt-4">
                <GoBack />
            </div> */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[15px] mt-6 px-4">
                {connectionRequests.map((item, index) => (
                    <div
                        className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1 flex flex-col gap-2.5 max-w-[300px]"
                        key={index}
                    >
                        <div className="text-base p-0 text-[#374151] flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1F2937]">
                                Client:
                            </span>{" "}
                            {item.client_name}
                        </div>
                        <div className="text-base p-0 text-[#374151] flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1F2937]">
                                Email:
                            </span>{" "}
                            {item.client_email}
                        </div>
                        <div className="text-base p-0 text-[#374151] flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[#1F2937]">
                                Company:
                            </span>{" "}
                            {item.company_name}
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                className="px-4 py-2 text-sm font-bold rounded-md cursor-pointer transition-colors bg-[#22C55E] text-white hover:bg-[#16A34A]"
                                onClick={() => {
                                    setModalOpen(true);
                                    setSelectedId(item.id);
                                }}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-bold rounded-md cursor-pointer transition-colors bg-[#EF4444] text-white hover:bg-[#DC2626]"
                                onClick={() => openRejectModal(item.id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-5 bg-white rounded-lg shadow-sm mt-5 overflow-x-auto">
                <AppTable
                    data={clientsData}
                    columns={columns}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                    bordered={false}
                />
            </div>
            {isModalOpen && (
                <TermsModal
                    visible={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    connection_id={selectedId}
                />
            )}

            <Modal
                title="Reject Request"
                open={isRejectModalOpen}
                onOk={handleRejectApproval}
                onCancel={() => setIsRejectModalOpen(false)}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <p>Please provide a reason for rejecting this request:</p>
                <Input.TextArea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason here..."
                />
            </Modal>

            <Modal
                title="Negotiation Details"
                open={isModal2Open}
                onCancel={handleCloseModal}
                footer={null}
            >
                {selectedNegotiation ? (
                    <div>
                        <p>
                            <strong>CTC Range:</strong>{" "}
                            {selectedNegotiation.ctc_range}
                        </p>
                        <p>
                            <strong>Service Fee:</strong>{" "}
                            {selectedNegotiation.service_fee_type ===
                            "percentage"
                                ? `${selectedNegotiation.service_fee}%`
                                : `₹${selectedNegotiation.service_fee}`}
                        </p>
                        <p>
                            <strong>Replacement Clause:</strong>{" "}
                            {selectedNegotiation.replacement_clause} Days
                        </p>
                        <p>
                            <strong>Interest:</strong>{" "}
                            {selectedNegotiation.interest_percentage}%
                        </p>
                        <p>
                            <strong>Invoice After:</strong>{" "}
                            {selectedNegotiation.invoice_after}
                        </p>
                        <p>
                            <strong>Payment Within:</strong>{" "}
                            {selectedNegotiation.payment_within}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {selectedNegotiation.status}
                        </p>
                    </div>
                ) : (
                    <p>No negotiation details available.</p>
                )}
            </Modal>
        </Main>
    );
};

export default AllClients;
