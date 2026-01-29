import React, { useState, useEffect, useMemo } from "react";
import dashboard from "./../../../images/SideBar/dashboard.svg"
import dashboard_active from "./../../../images/SideBar/dashboard-active.svg"
import interview from "./../../../images/SideBar/interview.svg"
import interview_active from "./../../../images/SideBar/interviewer-active.svg"
import MainLayout from '../../common/Layout/MainLayout2'
import assigned from './../../../images/SideBar/assigned.svg'
import assigned_active from './../../../images/SideBar/assigned.svg'
import { useAuth } from "../../common/useAuth";
import { message } from "antd";


const Main = ({ defaultSelectedKey, children, defaultSelectedChildKey = "0" }) => {
    const [badgesData, setBadgesData] = useState()
    const { apiurl, token } = useAuth();
    const fetchBadges = async () => {
        try {
            const response = await fetch(`${apiurl}/interviewer/all-alerts`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()
            if (data.error) {
                message.error(data.error);
                console.log(data.error)
                return;
            }
            else {
                setBadgesData(data.data)
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (token) {
            fetchBadges()
        }
    }, [token])

    const interviewerOptions = useMemo(() => [
        {
            "key": "1",
            "label": "Dashboard",
            "logo": dashboard,
            "active_logo": dashboard_active,
            "path": '/'
        },
        {
            key: "2",
            label: "Interviews",
            logo: interview,
            active_logo: interview_active,
            badge: badgesData && badgesData.assign_job > 0,
            children: [
                {
                    key: '2-1',
                    label: "Upcoming",
                    path: '/interviewer/interviews/upcoming',
                    badge: false,
                },
                {
                    key: '2-2',
                    label: "Completed",
                    path: '/interviewer/interviews/completed',
                    badge: false,
                },
            ]
        },
        {
            "key": "3",
            "label": "Assigned Interviews",
            "logo": assigned,
            "active_logo": assigned_active,
            "path": '/interviewer/jobinterviews',
            "badge": (badgesData && badgesData.new_jobs > 0 ? true : false),
        },
    ], [badgesData]);

    return (
        <>
            <MainLayout children={children} defaultSelectedKey={defaultSelectedKey} defaultSelectedChildKey={defaultSelectedChildKey} options={interviewerOptions}></MainLayout>
        </>
    );
};

export default Main;

