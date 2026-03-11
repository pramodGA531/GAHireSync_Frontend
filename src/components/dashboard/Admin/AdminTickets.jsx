import React from "react";
import Main from "./Layout";
import ExternalTicketMessages from "../../tickets/ExternalTicketMessages";

const AdminTickets = () => {
    return (
        <Main defaultSelectedKey="2">
            <ExternalTicketMessages />
        </Main>
    );
};

export default AdminTickets;
