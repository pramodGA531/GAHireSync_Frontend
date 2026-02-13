import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../../common/Layout/MainLayout2";
import dashboard from "./../../../images/SideBar/dashboard.svg";
import interview from "./../../../images/SideBar/interview.svg";
import interview_active from "./../../../images/SideBar/interview.svg";
import applications from "./../../../images/SideBar/jobpostings.svg";
import applications_active from "./../../../images/SideBar/jobpostings-active.svg";
import selected from "./../../../images/SideBar/recruiter-summary.svg";
import selected_active from "./../../../images/SideBar/recruiter-summary-active.svg";
import dashboard_active from "./../../../images/SideBar/dashboard-active.svg";
import { useAuth } from "../../common/useAuth";
import { message } from "antd";

const Layout = ({ children, defaultSelectedKey }) => {
    const [badgesData, setBadgesData] = useState();
    const { apiurl, token } = useAuth();
    const fetchBadges = async () => {
        try {
            const response = await fetch(`${apiurl}/candidate/all-alerts`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                console.log(data.error);
                return;
            } else {
                setBadgesData(data.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const markAsSeen = async (categories) => {
        try {
            await fetch(`${apiurl}/update-notification-seen/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category: categories }),
            });
            fetchBadges();
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    const location = useLocation();

    useEffect(() => {
        if (!token) return;
        const path = location.pathname;

        if (path.startsWith("/candidate/applications")) {
            markAsSeen(["promote_candidate", "reject_candidate"]);
        } else if (path.startsWith("/candidate/upcoming_interviews")) {
            markAsSeen(["schedule_interview"]);
        } else if (path.startsWith("/candidate/selected_jobs")) {
            markAsSeen(["select_candidate", "accepted_ctc"]);
        }
    }, [location.pathname, token]);

    useEffect(() => {
        if (token) {
            fetchBadges();
        }
    }, [token]);
    const cilentoptions = useMemo(
        () => [
            {
                key: 1,
                label: "Dashboard",
                logo: dashboard,
                active_logo: dashboard_active,
                tooltip:"View your Insights",
                path: "/",
            },
            {
                key: 2,
                label: "Applications",
                logo: applications,
                active_logo: applications_active,
                tooltip:"View your Applications",
                path: "/candidate/applications",
                badge:
                    badgesData &&
                    badgesData.promote_candidate + badgesData.reject_candidate >
                        0
                        ? true
                        : false,
            },
            {
                key: 3,
                label: "Interviews",
                logo: interview,
                active_logo: interview_active,
                tooltip:"View your Interviews",
                path: "/candidate/upcoming_interviews",
                badge:
                    badgesData && badgesData.schedule_interview > 0
                        ? true
                        : false,
            },
            {
                key: 4,
                label: "Selected Applications",
                logo: selected,
                active_logo: selected_active,
                tooltip:"View your Selected Applications",
                path: "/candidate/selected_jobs",
                badge:
                    badgesData &&
                    badgesData.select_candidate + badgesData.accepted_ctc > 0
                        ? true
                        : false,
            },
        ],
        [badgesData],
    );

    return (
        <>
            <MainLayout
                children={children}
                defaultSelectedKey={defaultSelectedKey}
                options={cilentoptions}
            ></MainLayout>
        </>
    );
};

export default Layout;
