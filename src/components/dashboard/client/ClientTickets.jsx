import React from "react";
import Main from "./Layout";
import ExternalTicketMessages from "../../tickets/ExternalTicketMessages";
import GoBack from "../../common/Goback";

/**
 * Client-specific tickets view integrating with the External Ticket API.
 */
const ClientTickets = () => {
    return (
        <Main>
            <ExternalTicketMessages />
        </Main>
    );
};

export default ClientTickets;
