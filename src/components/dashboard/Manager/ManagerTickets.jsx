import React from 'react'
import Main from './Layout'
import TicketMessages from '../../tickets/TicketMessages'
import GoBack from '../../common/Goback'
const ManagerTickets = () => {
    return (
        <Main><div className='-ml-2 mt-4'><GoBack /> </div>
            <TicketMessages></TicketMessages>
        </Main>
    )
}

export default ManagerTickets