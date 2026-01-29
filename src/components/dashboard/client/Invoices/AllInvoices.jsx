import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Input, Select } from "antd";
import html2pdf from "html2pdf.js"; // Import the html2pdf library
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import { Option } from "antd/es/mentions";
import downloadinvoicebut from "../../../../images/invoice/downloadinvoicebut.svg";
// import "./AllInvoices.css";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";
const AllInvoices = () => {
    const { token, apiurl } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [transactionId, setTransactionId] = useState(null);
    const [payment_method, setPayment_method] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

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
                    console.log("data.invoice", data.invoices);
                    setInvoices(data.invoices);
                } else {
                    // message.error("No invoices found or error fetching data.");
                }
            })
            .catch((error) => {
                // message.error("Error fetching invoices.");
                console.error("Error fetching invoices:", error);
            })
            .finally(() => {
                setLoading(false); // This ensures loading is set to false after the fetch completes
            });
    };

    // Function to download the invoice as PDF
    const downloadInvoice = (htmlContent, invoiceId) => {
        // Create a new HTML element to pass into the html2pdf function
        const invoiceElement = document.createElement("div");

        // Add Tailwind CSS styles if they are not included externally
        const tailwindStyles = `
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.3/dist/tailwind.min.css" rel="stylesheet">
    `;
        invoiceElement.innerHTML = tailwindStyles + htmlContent; // Inject Tailwind CSS into the HTML content

        // Use html2pdf.js to convert the HTML to PDF
        const options = {
            margin: 0, // Margin for the PDF
            filename: `invoice_${invoiceId}.pdf`, // The file name
            image: { type: "jpeg", quality: 0.98 }, // Image settings
            html2canvas: { scale: 3 }, // Rendering canvas scale (higher for better quality)
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }, // Paper size and orientation
        };

        html2pdf().from(invoiceElement).set(options).save(); // Trigger PDF download
    };

    const viewInvoice = (htmlContent) => {
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    };

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

    const filteredData = invoices.filter((item) => {
        const matchesSearch = Object.values(item).some(
            (value) =>
                value &&
                value
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        );
        const matchesStatus =
            filterStatus === "All" || item.payment_status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const openUpdateModal = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setUpdateModalVisible(true);
    };

    const handleUpdateInvoice = async () => {
        // Check if both fields are provided
        if (!transactionId || !newStatus) {
            message.error("Both transaction ID and status are required.");
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

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleViewDetails = (record) => {
        setSelectedInvoice(record);
        setIsDetailModalVisible(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalVisible(false);
        setSelectedInvoice(null);
    };

    const handleDownloadInvoice = (invoice) => {
        downloadInvoice(invoice.html, invoice.id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const columns = [
        {
            title: "Invoice Code",
            dataIndex: "invoice_code",
            key: "invoice_code",
        },
        {
            title: "Status",
            dataIndex: "payment_status",
            key: "payment_status",
        },
        {
            title: "Organization Email",
            dataIndex: "org_email",
            key: "org_email",
        },
        {
            title: "Payment Verification",
            dataIndex: "payment_verification",
            key: "payment_verification",
            render: (payment_verification) => (
                <div>
                    {/* Display verification status */}
                    <span>
                        {payment_verification ? "Verified" : "Not Verified"}
                    </span>
                </div>
            ),
        },
        {
            title: "Invoice",
            key: "actions",
            render: (_, record) => (
                <div>
                    {/* <Button
            type="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => viewInvoice(record.html)}
          >
            View
          </Button> */}
                    {/* Download Invoice Button */}

                    <img
                        style={{ width: "150px", cursor: "pointer" }}
                        src={downloadinvoicebut}
                        onClick={() => downloadInvoice(record.html, record.id)}
                    />
                </div>
            ),
        },

        {
            title: "Update Status",
            key: "UpdateStatus",
            render: (_, record) => {
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

    return (
        <Main defaultSelectedKey="8">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                <div className="mt-2 -ml-4">
                    <GoBack />
                </div>
                    <div className="invoices-table">
                        {/* <h2>All Invoices</h2> */}
                        <Input
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input m-2 p-2"
                            prefix={<span className="search-icon">⌕</span>}
                        />
                        {invoices.length > 0 ? (
                            <Table
                                dataSource={filteredData}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                className="candidate-table"
                            />
                        ) : (
                            <p className="text-xl m-2">No invoices found.</p>
                        )}
                    </div>
                    <Modal
                        title="Update Invoice Status"
                        visible={updateModalVisible}
                        onCancel={() => setUpdateModalVisible(false)}
                        footer={[
                            <Button
                                key="cancel"
                                onClick={() => setUpdateModalVisible(false)}
                            >
                                Cancel
                            </Button>,
                            <Button key="update" onClick={handleUpdateInvoice}>
                                update
                            </Button>,
                        ]}
                    >
                        <Input
                            placeholder="Enter Payment Method"
                            value={payment_method}
                            onChange={(e) => setPayment_method(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Enter Transaction Id"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                        />
                        <Select
                            placeholder="Update Status"
                            style={{ marginTop: "20px", width: "100%" }}
                            onChange={(value) => setNewStatus(value)}
                            required
                        >
                            <Option value="Paid">Paid</Option>
                        </Select>
                    </Modal>
                </>
            )}
        </Main>
    );
};

export default AllInvoices;
