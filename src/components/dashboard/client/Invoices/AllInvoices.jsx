import React, { useEffect, useState } from "react";
import { Button, message, Modal, Input, Select } from "antd";
import html2pdf from "html2pdf.js"; // Import the html2pdf library
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
// import { Option } from "antd/es/mentions"; // Removed incorrect import
import downloadinvoicebut from "../../../../images/invoice/downloadinvoicebut.svg";
// import "./AllInvoices.css";
// import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";
import AppTable from "../../../common/AppTable";

const { Option } = Select; // Added correct Option destructuring

const AllInvoices = () => {
    const { token, apiurl } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [transactionId, setTransactionId] = useState(null);
    const [payment_method, setPayment_method] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All"); // Added state
    // const [selectedInvoice, setSelectedInvoice] = useState(null);
    // const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    // const invoiceRef = useRef(null);

    // // Filter data based on search text
    // const filteredData = data.filter(item =>
    //   Object.values(item).some(
    //     value => value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    //   )
    // );

    const fetchInvoices = () => {
        setLoading(true);
        fetch(`${apiurl}/get_invoices/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.invoices) {
                    setInvoices(data.invoices);
                }
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Function to download the invoice as PDF
    const downloadInvoice = (htmlContent, invoiceCode) => {
        const invoiceElement = document.createElement("div");
        invoiceElement.innerHTML = htmlContent;
        document.body.appendChild(invoiceElement); // Append to body to ensure rendering

        const options = {
            margin: 0.5,
            filename: `Invoice_${invoiceCode || "invoice"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf()
            .from(invoiceElement)
            .set(options)
            .save()
            .then(() => {
                document.body.removeChild(invoiceElement); // Cleanup
            });
    };

    // const viewInvoice = (htmlContent) => {
    //     const newWindow = window.open();
    //     newWindow.document.write(htmlContent);
    //     newWindow.document.close();
    // };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // useEffect(() => {
    //   if (searchText) {
    //     const filteredInvoices = invoices.filter((invoice) =>
    //       Object.values(invoice).some((value) =>
    //         String(value).toLowerCase().includes(searchText.toLowerCase())
    //       )
    //     );
    //     setInvoices(filteredInvoices);
    //   } else {
    //     // Optional: If searchText is empty, reset to original invoices
    //     setInvoices(invoices); // assuming you have original data saved
    //   }
    // }, [searchText]);

    // const filteredData = invoices.filter((item) => {
    //     const matchesSearch = Object.values(item).some(
    //         (value) =>
    //             value &&
    //             value
    //                 .toString()
    //                 .toLowerCase()
    //                 .includes(searchText.toLowerCase()),
    //     );
    //     const matchesStatus =
    //         filterStatus === "All" || item.payment_status === filterStatus;
    //     return matchesSearch && matchesStatus;
    // });

    const openUpdateModal = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setUpdateModalVisible(true);
    };

    const handleUpdateInvoice = async () => {
        // Check if all fields are provided
        if (!transactionId || !newStatus || !payment_method) {
            message.error(
                "Transaction ID, Payment Method, and Status are all required.",
            );
            return;
        }
        const data = {
            invoice_id: selectedInvoiceId,
            payment_transaction_id: transactionId,
            status: newStatus,
            payment_method: payment_method,
        };
        try {
            setLoading(true);

            const response = await fetch(`${apiurl}/update_invoices/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            fetchInvoices();
            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            }

            // If successful, show success message
            message.success("Invoice updated successfully.");

            // Close the modal
            setUpdateModalVisible(false);
        } catch (error) {
            // If error occurs, show error message
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // const handleSearch = (e) => {
    //     setSearchText(e.target.value);
    // };

    // const handleFilterChange = (e) => {
    //     setFilterStatus(e.target.value);
    // };

    // const handleViewDetails = (record) => {
    //     setSelectedInvoice(record);
    //     setIsDetailModalVisible(true);
    // };

    // const handleCloseDetailModal = () => {
    //     setIsDetailModalVisible(false);
    //     setSelectedInvoice(null);
    // };

    // const handleDownloadInvoice = (invoice) => {
    //     downloadInvoice(invoice.html, invoice.id);
    // };

    // const formatDate = (dateString) => {
    //     if (!dateString) return "N/A";
    //     const options = { year: "numeric", month: "long", day: "numeric" };
    //     return new Date(dateString).toLocaleDateString(undefined, options);
    // };

    const columns = [
        {
            header: "Invoice Code",
            accessorKey: "invoice_code",
            searchField: true,
        },
        {
            header: "Status",
            accessorKey: "payment_status",
            searchField: true,
        },
        {
            header: "Organization Email",
            accessorKey: "org_email",
            searchField: true,
        },
        {
            header: "Payment Verification",
            accessorKey: "payment_verification",
            cell: ({ getValue }) => (
                <div>
                    {/* Display verification status */}
                    <span>{getValue() ? "Verified" : "Not Verified"}</span>
                </div>
            ),
        },
        {
            header: "Invoice",
            accessorKey: "actions",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <div>
                        <img
                            style={{ width: "150px", cursor: "pointer" }}
                            src={downloadinvoicebut}
                            onClick={() =>
                                downloadInvoice(
                                    record.html,
                                    record.invoice_code,
                                )
                            }
                        />
                    </div>
                );
            },
        },

        {
            header: "Update Status",
            accessorKey: "UpdateStatus",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Button
                        type="primary"
                        onClick={() => openUpdateModal(record.id)}
                        disabled={record.payment_status !== "Pending"}
                        style={{
                            backgroundColor:
                                record.payment_status === "Pending"
                                    ? "#1890ff"
                                    : "#d9d9d9",
                            borderColor:
                                record.payment_status === "Pending"
                                    ? "#1890ff"
                                    : "#d9d9d9",
                            color:
                                record.payment_status === "Pending"
                                    ? "#fff"
                                    : "#8c8c8c",
                            cursor:
                                record.payment_status === "Pending"
                                    ? "pointer"
                                    : "not-allowed",
                        }}
                    >
                        Update Status
                    </Button>
                );
            },
        },
    ];

    const filteredData = (invoices || []).filter((item) => {
        if (statusFilter === "All") return true;
        return (
            item.payment_status?.toLowerCase() === statusFilter.toLowerCase()
        );
    });

    return (
        <Main defaultSelectedKey="8">
            {/* {loading ? (
                <Pageloading />
            ) : ( */}
            <>
                {/* <div className="mt-2 -ml-4">
                    <GoBack />
                </div> */}
                <div className="m-2">
                    <h2 className="text-2xl ml-2 mt-4 font-semibold ">
                        All Invoices
                    </h2>
                    {/* <Input
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input m-2 p-2"
                            prefix={<span className="search-icon">⌕</span>}
                        /> */}
                    {/* {invoices.length > 0 ? ( */}
                    <AppTable
                        columns={columns}
                        data={filteredData}
                        rowKey="id"
                        isLoading={loading}
                        customFilters={
                            <Select
                                defaultValue="All"
                                style={{ width: 150 }}
                                onChange={(value) => setStatusFilter(value)}
                                className="custom-filter-select"
                            >
                                <Option value="All">All Status</Option>
                                <Option value="paid">Paid</Option>
                                <Option value="pending">Pending</Option>
                            </Select>
                        }
                    />
                    {/* ) : (
                            <p className="text-xl m-2">No invoices found.</p>
                        )} */}
                </div>
                <Modal
                    title="Update Invoice Status"
                    open={updateModalVisible}
                    onCancel={() => setUpdateModalVisible(false)}
                    footer={[
                        <button
                            key="cancel"
                            className="bg-red-500 text-white px-4 py-2 rounded-md m-2"
                            onClick={() => setUpdateModalVisible(false)}
                        >
                            Cancel
                        </button>,
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md m-2"
                        key="update" onClick={handleUpdateInvoice}>
                            update
                        </button>,
                    ]}
                >
                    <Input
                        placeholder="Enter Payment Method"
                        value={payment_method}
                        style={{ marginTop: "20px", height:"40px",width: "100%" }}
                        onChange={(e) => setPayment_method(e.target.value)}
                        required
                    />
                    
                    <Input
                        placeholder="Enter Transaction Id"
                        value={transactionId}
                        style={{ marginTop: "20px",height:"40px", width: "100%" }}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                    />
                    <Select
                        placeholder="Update Status"
                        style={{ marginTop: "20px",height:"40px", width: "100%" }}
                        onChange={(value) => setNewStatus(value)}
                        required
                    >
                        <Option value="Paid">Paid</Option>
                    </Select>
                </Modal>
            </>
            {/* )} */}
        </Main>
    );
};

export default AllInvoices;
