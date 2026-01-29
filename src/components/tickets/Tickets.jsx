import React, { useEffect, useState } from 'react';
import ClientTickets from '../dashboard/client/ClientTickets';

import { useAuth } from '../common/useAuth';
import AccountantTickets from '../dashboard/Accountants/AccountantTickets';
import RecruiterTickets from '../dashboard/Recruiter/RecruiterTickets';
import CandidateTickets from '../dashboard/Candidate/CandidateTickets';
import ManagerTickets from '../dashboard/Manager/ManagerTickets';
import InterviewerTickets from '../dashboard/Interviewer/InterviewerTickets';
import AdminTickets from '../dashboard/Admin/AdminTickets';
import GoBack from '../common/Goback';
const Tickets = () => {
    const [role, setRole] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        console.log(userData, " is the user data")
        if (userData != null) {
            const user = userData
            if (user?.role) {
                setRole(user.role);
            }
        }
    }, [userData]);


    return (
        <div>
            {role === 'client' && <div><ClientTickets /></div>}
            {role === 'accountant' && <div><AccountantTickets /></div>}
            {role === 'recruiter' && <div><RecruiterTickets /></div>}
            {role === 'candidate' && <div><CandidateTickets /></div>}
            {role === 'manager' && <div><ManagerTickets /></div>}
            {role === 'interviewer' && <div><InterviewerTickets /></div>}
            {role === 'admin' && <div><AdminTickets /></div>}
        </div>
    );
};

export default Tickets;
