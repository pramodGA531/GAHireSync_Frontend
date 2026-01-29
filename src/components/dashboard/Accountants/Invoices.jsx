import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Input, Select } from "antd";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import html2pdf from "html2pdf.js";
import { Option } from "antd/es/mentions";
import viewicon from "../../../images/invoice/view.svg";
import invoiceicon from "../../../images/invoice/downloadinvoicebut.svg";
import GoBack from "../../common/Goback";
const Invoices = () => {
    const { token, apiurl } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [transactionId, setTransactionId] = useState(null);
    const [payment_verified, SetPayment_verified] = useState(null);
    const [searchText, setSearchText] = useState("");

    // Fetch invoices from the API
    const fetchInvoices = () => {
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
                    setInvoices(data.invoices); // Store invoices in state
                } else {
                    message.error("No invoices found or error fetching data.");
                }
            })
            .catch((error) => {
                message.error("Error fetching invoices.");
                console.error("Error fetching invoices:", error);
            });
    };

    // Function to download the invoice as PDF
    const downloadInvoice = (htmlContent, invoiceId) => {
        // Create a new HTML element to pass into the html2pdf function
        const invoiceElement = document.createElement("div");
        invoiceElement.innerHTML = htmlContent;

        // Use html2pdf.js to convert the HTML to PDF
        const options = {
            margin: 0.5, // Margin for the PDF
            filename: `invoice_${invoiceId}.pdf`, // The file name
            image: { type: "jpeg", quality: 0.98 }, // Image settings
            html2canvas: { scale: 2 }, // Rendering canvas scale (higher for better quality)
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" }, // Paper size and orientation
        };

        html2pdf().from(invoiceElement).set(options).save(); // Trigger PDF download
    };

    // View the invoice HTML in a new window
    const viewInvoice = (htmlContent) => {
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const updatePaymentVerification = async (id, verification) => {
        // Check if both fields are provided
        if (!id) {
            message.error(" ID is required.");
            return;
        }

        const data = {
            invoice_id: id,
            payment_verification: verification,
            // status: newStatus,
        };

        try {
            const response = await fetch(`${apiurl}/update_invoices/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Replace with your auth token if necessary
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
            // setLoading(false);
        }
    };

    const columns = [
        {
            title: "Invoice ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <span
                    style={{
                        color: text === "Paid" ? "#4A6E98" : "#FF8082",
                        fontWeight: "bold",
                    }}
                >
                    {text}
                </span>
            ),
        },
        {
            title: "Verify payment",
            // dataIndex: "payment_verification",
            // key: "payment_verification",
            render: (payment_verification, record) => (
                <Select
                    defaultValue={
                        payment_verification ? "Verified" : "Not Verified"
                    }
                    style={{ width: 120 }}
                    onMouseEnter={(e) => (
                        (e.currentTarget.style.outline = "none"),
                        (e.currentTarget.style.border = "none"),
                        (e.currentTarget.style.margin = "none")
                    )}
                    onChange={(value) => {
                        const isVerified = value === "Verified";
                        console.log(
                            "here i need to send the isVerified to the backend ",
                            isVerified,
                            record.id,
                        );
                        updatePaymentVerification(record.id, isVerified);
                    }}
                >
                    <Option value="Not Verified">Not Verify</Option>
                    <Option value="Verified">Verified</Option>
                </Select>
            ),
        },

        {
            title: "Client Email",
            dataIndex: "client_email",
            key: "client_email",
        },
        {
            title: "Organization Email",
            dataIndex: "org_email",
            key: "org_email",
        },

        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {/* View Invoice Button */}
                    {/* <Button
            type="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => viewInvoice(record.html)}
          >
            viewicon
          </Button> */}
                    <img
                        src={invoiceicon}
                        onClick={() => downloadInvoice(record.html, record.id)}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                    ></img>
                    <img
                        src={viewicon}
                        onClick={() => viewInvoice(record.html)}
                        style={{
                            marginRight: 8,
                            width: "20px",
                            cursor: "pointer",
                        }}
                    ></img>
                    {/* Download Invoice Button */}

                    {/* <Button
            type="default"
            size="small"
            onClick={() => downloadInvoice(record.html, record.id)}
          >
            Download as PDF
          </Button> */}
                </div>
            ),
        },
    ];

    const filteredData = invoices.filter((item) =>
        Object.values(item).some(
            (value) =>
                value &&
                value
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
        ),
    );
    return (
        <Main defaultSelectedKey="2">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div>Invoices</div>

            <div className="invoices-table">
                {/* <h2>All Invoices</h2> */}
                <Input
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                    prefix={<span className="search-icon">⌕</span>}
                    style={{ marginBottom: "20px" }}
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
                    <p>No invoices found.</p>
                )}
            </div>
        </Main>
    );
};

export default Invoices;

/* <div className="">
        <h2>All Invoices</h2>
        {invoices.length > 0 ? (
          <Table
            dataSource={invoices}
            columns={columns}
            className=""
            rowKey="id"
            pagination={false} // You can enable pagination if necessary
          />
        ) : (
          <p>No invoices found.</p>
        )}
      </div>*/
