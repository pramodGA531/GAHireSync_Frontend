// import React, { useEffect, useState } from "react";
// import Main from "./Layout";
// import { useAuth } from "../../common/useAuth";
// import { message, Table, Modal, Button, Form, Input, Select } from "antd";

// const { TextArea } = Input;

// const AdminTickets = () => {
//     const { apiurl, token } = useAuth();
//     const [data, setData] = useState([]);
//     const [selectedTicket, setSelectedTicket] = useState(null);
//     const [openModal, setOpenModal] = useState(false);
//     const [form] = Form.useForm(); // Ant Design Form Hook

//     const fetchData = async () => {
//         try {
//             console.log("Fetching ticket data...");
//             const response = await fetch(`${apiurl}/superadmin/handle-tickets/`, {
//                 method: "GET",
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!response.ok) throw new Error("Failed to fetch tickets");

//             const responseData = await response.json();
//             if (responseData.error) {
//                 message.error(responseData.error);
//             } else {
//                 setData(responseData.map((item) => ({ ...item, key: item.id })));
//             }
//         } catch (error) {
//             message.error(error.message);
//         }
//     };

//     const fetchSelectedTicket = async (id) => {
//         try {
//             console.log(`Fetching details for ticket ID: ${id}`);
//             const response = await fetch(`${apiurl}/superadmin/handle-tickets/?ticket_id=${id}`, {
//                 method: "GET",
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!response.ok) throw new Error("Failed to fetch ticket details");

//             const responseData = await response.json();
//             if (responseData.error) {
//                 message.error(responseData.error);
//             } else {
//                 setSelectedTicket(responseData);
//                 setOpenModal(true);

//                 // Pre-fill the form with existing data
//                 form.setFieldsValue({
//                     reply: responseData.reply || "",
//                     status: responseData.status || "Hold",
//                 });
//             }
//         } catch (error) {
//             message.error(error.message);
//         }
//     };

//     useEffect(() => {
//         if (token) fetchData();
//     }, [token, apiurl]);

//     const formatDate = (date) => {
//         return new Date(date).toLocaleDateString();
//     };

//     const handleSubmit = async (values) => {
//         try {
//             console.log("Submitting form data...", values);

//             const response = await fetch(`${apiurl}/superadmin/handle-tickets/?ticket_id=${selectedTicket.id}`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     reply: values.reply,
//                     status: values.status,
//                 }),
//             });

//             if (!response.ok) throw new Error("Failed to update ticket");

//             const responseData = await response.json();
//             if (responseData.error) {
//                 message.error(responseData.error);
//             } else {
//                 message.success("Ticket updated successfully!");
//                 setOpenModal(false);
//                 fetchData();
//             }
//         } catch (error) {
//             message.error(error.message);
//         }
//     };

//     const columns = [
//         { title: "Ticket Category", dataIndex: "category", key: "category" },
//         { title: "Description", dataIndex: "description", key: "description" },
//         { title: "Raised by", dataIndex: "raised_by", key: "raised_by" },
//         {
//             title: "Raised On",
//             dataIndex: "created_at",
//             key: "created_at",
//             render: (date) => <span>{formatDate(date)}</span>,
//         },
//         { title: "Status", dataIndex: "status", key: "status" },
//         {
//             title: "Action",
//             dataIndex: "id",
//             key: "id",
//             render: (id) => (
//                 <Button type="primary" onClick={() => fetchSelectedTicket(id)}>
//                     Handle Ticket
//                 </Button>
//             ),
//         },
//     ];

//     return (
//         <Main defaultSelectedKey="2">
//             {data.length > 0 ? <Table columns={columns} dataSource={data} /> : <p>No tickets available.</p>}

//             <Modal
//                 title="Handle Ticket"
//                 open={openModal}
//                 onCancel={() => setOpenModal(false)}
//                 footer={[
//                     <Button key="cancel" onClick={() => setOpenModal(false)}>
//                         Cancel
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={() => form.submit()}>
//                         Submit
//                     </Button>,
//                 ]}
//             >
//                 {selectedTicket && (
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={handleSubmit}
//                     >
//                         <p><strong>Raised By:</strong> {selectedTicket.raised_by}</p>
//                         <p><strong>Category:</strong> {selectedTicket.category}</p>
//                         <p><strong>Description:</strong> {selectedTicket.description}</p>

//                         <p><strong>Status:</strong> {selectedTicket.status}</p>
//                         {selectedTicket.status === 'pending' ? (
//                             <div>
//                                 <Form.Item
//                                     label="Reply"
//                                     name="reply"
//                                     rules={[{ required: true, message: "Please enter a reply" }]}
//                                 >
//                                     <TextArea rows={3} placeholder="Enter your response..." />
//                                 </Form.Item>

//                                 <Form.Item
//                                     label="Status"
//                                     name="status"
//                                     rules={[{ required: true, message: "Please select a status" }]}
//                                 >
//                                     <Select>
//                                         <Select.Option value="Hold">Hold</Select.Option>
//                                         <Select.Option value="Completed">Completed</Select.Option>
//                                     </Select>
//                                 </Form.Item>
//                             </div>
//                         ) : (
//                             <div>
//                                 <p><strong>Reply:</strong> {selectedTicket.reply}</p>
//                                 <p><strong>Updated at:</strong> {formatDate(selectedTicket.updated_at)}</p>
//                             </div>
//                         )


//                         }

//                         {selectedTicket.attachments && (
//                             <p>
//                                 <strong>Attachments:</strong>{" "}
//                                 <a href={selectedTicket.attachments} target="_blank" rel="noopener noreferrer">
//                                     View Attachment
//                                 </a>
//                             </p>
//                         )}



//                     </Form>
//                 )}
//             </Modal>
//         </Main>
//     );
// };

// export default AdminTickets;


import React from 'react'
import Main from './Layout'
import TicketMessages from '../../tickets/TicketMessages'
import GoBack from '../../common/Goback'
const AdminTickets = () => {
    return (
        <Main defaultSelectedKey="2">
            {/* <div className='-ml-2 mt-4'><GoBack /> </div> */}
            <TicketMessages></TicketMessages>
        </Main>
    )
}

export default AdminTickets