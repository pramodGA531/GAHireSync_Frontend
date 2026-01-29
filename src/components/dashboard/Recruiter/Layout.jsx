import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../common/Layout/MainLayout2";
import dashboard from "./../../../images/SideBar/dashboard.svg";
import dashboard_active from "./../../../images/SideBar/dashboard-active.svg";
import jobposts from "./../../../images/SideBar/jobpostings.svg";
import jobposts_active from "./../../../images/SideBar/jobpostings-active.svg";
import scheduled from "./../../../images/SideBar/interviewer.svg";
import secheduled_active from "./../../../images/SideBar/interviewer-active.svg";
import replacement from "./../../../images/SideBar/replacement.svg";
import replacement_active from "./../../../images/SideBar/replacement-active.svg";
import reconfirmed from "./../../../images/SideBar/organizations.svg";
import reconfirmed_active from "./../../../images/SideBar/organizations-active.svg";
import { message } from "antd";
import { useAuth } from "../../common/useAuth";

const Layout = ({
    children,
    defaultSelectedKey,
    defaultSelectedChildKey = "0",
}) => {
    const [badgesData, setBadgesData] = useState();
    const { apiurl, token } = useAuth();

    const fetchBadges = async () => {
        try {
            const response = await fetch(`${apiurl}/recruiter/all-alerts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!data.error) setBadgesData(data.data);
        } catch (e) {
            console.error("Alert aggregation failure", e);
        }
    };

    useEffect(() => {
        if (token) fetchBadges();
    }, [token]);

    const recruiterOptions = useMemo(
        () => [
            {
                key: "1",
                label: "Dashboard",
                logo: dashboard,
                active_logo: dashboard_active,
                path: "/recruiter",
            },
            {
                key: "2",
                label: "Jobs",
                logo: jobposts,
                active_logo: jobposts_active,
                badge: badgesData?.assign_job > 0,
                children: [
                    {
                        key: "2-1",
                        label: "Active",
                        path: "/recruiter/postings/opened",
                        badge: false,
                    },
                    {
                        key: "2-2",
                        label: "History",
                        path: "/recruiter/postings/closed",
                        badge: false,
                    },
                ],
            },
            {
                key: "3",
                label: "Applications",
                logo: scheduled,
                active_logo: secheduled_active,
                badge: badgesData?.schedule_interview > 0,
                children: [
                    {
                        key: "3-1",
                        label: "New Jobs",
                        path: "/recruiter/applications/to-schedule",
                        badge: false,
                    },
                    {
                        key: "3-2",
                        label: "Scheduled",
                        path: "/recruiter/applications/already-scheduled",
                        badge: false,
                    },
                ],
            },
            {
                key: "4",
                label: "Reconfirmations",
                logo: reconfirmed,
                active_logo: reconfirmed_active,
                path: "/recruiter/reconfirmation-applications",
                badge: badgesData?.reconfirm > 0,
            },
            {
                key: "5",
                label: "Replacements",
                logo: replacement,
                active_logo: replacement_active,
                path: "/recruiter/replacements",
                badge: badgesData?.replacement > 0,
            },
        ],
        [badgesData]
    );

    return (
        <MainLayout
            defaultSelectedKey={defaultSelectedKey}
            defaultSelectedChildKey={defaultSelectedChildKey}
            options={recruiterOptions}
        >
            {children}
        </MainLayout>
    );
};

export default Layout;
