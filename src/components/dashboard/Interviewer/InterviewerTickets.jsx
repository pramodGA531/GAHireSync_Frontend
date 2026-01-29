import React from 'react'
import Main from './Layout'
import ViewTickets from '../../tickets/ViewTickets'
import TicketMessages from '../../tickets/TicketMessages'
import GoBack from '../../common/Goback'
const InterviewerTickets = () => {
    return (
        <Main><div className='-ml-2 mt-4'><GoBack /> </div>
            <TicketMessages></TicketMessages>
        </Main>
    )
}

export default InterviewerTickets