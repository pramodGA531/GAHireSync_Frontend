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
        // Create a wrapper to hold the content
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "0";
        container.style.width = "800px"; // Fixed width for A4 consistency
        container.style.zIndex = "-1";
        container.className = "p-8 bg-white"; // Ensure some base styling
        document.body.appendChild(container);

        // 1. Clone all styles from the current document head
        // This ensures fully accurate styling matching the app
        const styles = document.head.querySelectorAll(
            'style, link[rel="stylesheet"]',
        );
        styles.forEach((styleNode) => {
            container.appendChild(styleNode.cloneNode(true));
        });

        // 2. Add extra specific print overrides
        const extraStyle = document.createElement("style");
        extraStyle.innerHTML = `
            body {
                font-family: 'Inter', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            /* Start of Fallback Tailwind for basic layout if local styles miss */
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: 700; }
            .text-gray-500 { color: #6b7280; }
            .text-sm { font-size: 0.875rem; }
            .p-4 { padding: 1rem; }
            .mb-4 { margin-bottom: 1rem; }
            .border-b { border-bottom-width: 1px; }
            /* End fallback */
        `;
        container.appendChild(extraStyle);

        // 3. Insert the content
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = htmlContent;
        container.appendChild(contentDiv);

        // Use html2pdf.js to convert the HTML to PDF
        const options = {
            margin: 0.5, // Margin for the PDF
            filename: `invoice_${invoiceId}.pdf`, // The file name
            image: { type: "jpeg", quality: 0.98 }, // Image settings
            html2canvas: { scale: 2, useCORS: true, logging: false }, // Rendering canvas scale (higher for better quality)
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }, // Paper size and orientation
        };

        // Small delay to ensure styles apply
        setTimeout(() => {
            html2pdf()
                .from(container)
                .set(options)
                .save()
                .then(() => {
                    document.body.removeChild(container); // Clean up
                })
                .catch((err) => {
                    console.error("PDF generation failed:", err);
                    document.body.removeChild(container); // Clean up even on error
                    message.error("Failed to generate PDF. Please try again.");
                });
        }, 500);
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
                            onClick={() =>
                                downloadInvoice(record.html, record.id)
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
            {/* )} */}
        </Main>
    );
};

export default AllInvoices;
