import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input } from "antd";
import html2pdf from "html2pdf.js"; // Import the html2pdf library
import Main from "../Layout";
import { useAuth } from "../../../common/useAuth";
import downloadinvoicebut from "../../../../images/invoice/downloadinvoicebut.svg";
import NoData from "../../../../images/Illustrations/NoDataFound-2.png";
import GoBack from "../../../common/Goback";
import Pageloading from "../../../common/loading/Pageloading";
import Btnloading from "../../../common/loading/Btnloading";

const AllInvoices = () => {
    const { token, apiurl } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [accountants, setAccountants] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

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
                    setAccountants(data.accountants);
                    setLoading(false);
                } else {
                    // message.error("No invoices found");
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
                setLoading(false);
            });
    };
    useEffect(() => {
        if (!loading && accountants.length === 0) {
            message.warning("No accountants found");
            message.info("To view your invoices please create an accountant");
        }
    }, [accountants, loading]);

    const downloadInvoice = (htmlContent, invoiceCode) => {
        const invoiceElement = document.createElement("div");
        invoiceElement.innerHTML = htmlContent;
        document.body.appendChild(invoiceElement); // Append to body to ensure rendering

        const options = {
            margin: 0.5,
            filename: `Invoice_${invoiceCode}.pdf`,
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

    const viewInvoice = (htmlContent) => {
        const newWindow = window.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const showModal = () => {
        // console.log("acc")
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [btnLoading, setBtnLoading] = useState(false);

    const handleCreateAccountant = async (values) => {
        try {
            setBtnLoading(true);
            const response = await fetch(
                `${apiurl}/manager/create_accountant/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                },
            );
            const data = await response.json();
            if (data.success) {
                message.success("Accountant created successfully!");
                setIsModalVisible(false);
                form.resetFields();
                window.location.reload();
            } else {
                message.error(data.error || "Failed to create accountant.");
            }
        } catch (error) {
            console.error("Error creating accountant:", error);
            message.error("Error creating accountant.");
        } finally {
            setBtnLoading(false);
        }
    };

    const columns = [
        {
            title: "Invoice Code",
            dataIndex: "invoice_code",
            key: "invoice_code",
        },
        {
            title: "Scheduled Date",
            dataIndex: "scheduled_date",
            key: "scheduled_date",
        },
        {
            title: "Status",
            dataIndex: "invoice_status",
            key: "invoice_status",
        },
        {
            title: "Payment Status",
            dataIndex: "payment_status",
            key: "payment_status",
        },
        {
            title: "Organization Email",
            dataIndex: "org_email",
            key: "org_email",
        },
        {
            title: "Client Email",
            dataIndex: "client_email",
            key: "client_email",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                // <div>
                //   <Button
                //     type="primary"
                //     size="small"
                //     style={{ marginRight: 8 }}
                //     onClick={() => viewInvoice(record.html)}
                //   >
                //     View
                //   </Button>
                //   <Button
                //     type="default"
                //     size="small"
                //     onClick={() => downloadInvoice(record.html, record.id)}
                //   >
                //     Download as PDF
                //   </Button>
                // </div>

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
                            downloadInvoice(record.html, record.invoice_code)
                        }
                    />
                </div>
            ),
        },
    ];

    const acccolumns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: "Organization",
            dataIndex: "organization",
            key: "organization",
            render: (organization) =>
                organization ? `Org #${organization}` : "N/A",
        },
    ];

    return (
        <Main defaultSelectedKey="7">
            {loading ? (
                <Pageloading />
            ) : (
                <>
                    {/* <div className="-ml-1 mt-4">
                        <GoBack />
                    </div> */}
                    {accountants?.length > 0 ? (
                        <Table
                            dataSource={accountants}
                            columns={acccolumns}
                            rowKey="id"
                            pagination={false}
                        />
                    ) : (
                        <button
                            type="primary"
                            onClick={showModal}
                            // style={{
                            //     backgroundColor: "#E3E8",
                            //     padding: "10px",
                            //     outline: "none",
                            //     cursor: "pointer",
                            //     borderRadius: "8px",
                            //     fontSize: "16px",
                            // }}
                            className="bg-blue-500 p-4 text-white m-4 rounded-lg"
                        >
                            + Add Accountant
                        </button>
                    )}
                    <div className="font-semibold text-2xl mt-[30px] ml-2.5">
                        Invoices
                    </div>
                    <div
                        className=""
                        style={{ border: "none", height: "90vh" }}
                    >
                        {invoices.length > 0 ? (
                            <Table
                                dataSource={invoices}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : (
                            <div
                                style={{
                                    marginTop: "10vh",
                                }}
                                className="flex flex-col gap-5 items-center justify-center"
                            >
                                <img
                                    style={{ width: "20%" }}
                                    src={NoData}
                                    alt="No data found"
                                />
                                <span className="text-base text-gray-500">
                                    No Invoices
                                </span>
                            </div>
                        )}
                    </div>
                </>
            )}
            <Modal
                title="Create Accountant"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateAccountant}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: "Please enter a valid email!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a username!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{ display: "flex", gap: "20px" }}
                        >
                            Create Accountant
                            {btnLoading && (
                                <Btnloading spincolor={"white-spinner"} />
                            )}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Main>
    );
};

export default AllInvoices;
