import React, { useMemo } from "react";
import dashboard from "../../../images/SideBar/dashboard.svg";
import jobs from "../../../images/SideBar/jobpostings.svg";
import jobs_active from "../../../images/SideBar/jobpostings-active.svg";
import candidate from "../../../images/SideBar/interview.svg";
import candidate_active from "../../../images/SideBar/interviewer-active.svg";
import reports from "../../../images/SideBar/invoice.svg";
import reports_active from "../../../images/SideBar/invoice-active.svg";
import recruiters from "../../../images/SideBar/recruiter-summary.svg";
import recruiters_active from "../../../images/SideBar/recruiter-summary-active.svg";
import negotiations from "../../../images/SideBar/service-agreement.svg";
import negotiations_active from "../../../images/SideBar/service-agreement-active.svg";
import client from "../../../images/SideBar/organizations.svg";
import client_active from "../../../images/SideBar/organizations-active.svg";
import dashboard_active from "../../../images/SideBar/dashboard-active.svg";

import calendar from "./../../../images/agency/Calendar.svg";
import MainLayout from "../../common/Layout/MainLayout2";
import { useState, useEffect } from "react";
import { message } from "antd";
import { useAuth } from "../../common/useAuth";

const Layout2 = ({
    children,
    defaultSelectedKey,
    defaultSelectedChildKey = 0,
}) => {
    const [badgesData, setBadgesData] = useState();
    const { apiurl, token } = useAuth();
    const [unseenCount, SetUnseenCount] = useState(0);

    const fetchBadges = async () => {
        try {
            const response = await fetch(`${apiurl}/manager/all-alerts`, {
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

    async function getUnseenCount() {
        console.log("caling this funcion");
        try {
            const response = await fetch(`${apiurl}/agency-connection/count/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch unseen count");
            }

            const data = await response.json();
            console.log("Unseen Count:", data.unseen_count);

            SetUnseenCount(data.unseen_count);

            return data.unseen_count;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchBadges();
            getUnseenCount();
        }
    }, [token]);

    const options = useMemo(
        () => [
            {
                key: 1,
                label: "Dashboard",
                logo: dashboard,
                active_logo: dashboard_active,
                path: "/agency",
            },
            {
                key: 2,
                label: "Jobs",
                logo: jobs,
                active_logo: jobs_active,
                path: "/agency/jobs",
                badge:
                    badgesData &&
                    badgesData.create_job +
                        badgesData.accept_job_edit +
                        badgesData.reject_job_edit +
                        badgesData.partial_edit >
                        0
                        ? true
                        : false,
                children: [
                    {
                        key: "2-1",
                        label: "My Jobs",
                        path: "/agency/jobs",
                        badge: false,
                    },
                    {
                        key: "2-2",
                        label: "Not Assigned",
                        path: "/agency/jobs/not-assigned",
                        badge: false,
                    },
                    {
                        key: "2-3",
                        label: "Not Approved",
                        path: "/agency/jobs/not-approved",
                        badge: false,
                    },
                    {
                        key: "2-4",
                        label: "Closed/Hold",
                        path: "/agency/jobs/closed-hold",
                        badge: false,
                    },
                    {
                        key: "2-5",
                        label: "Analytics",
                        path: "/agency/jobs/analytics",
                        badge: false,
                    },
                    {
                        key: "2-6",
                        label: "Client Edit Requests",
                        path: "/agency/jobs/client-edit-requests",
                        badge: false,
                    },
                ],
            },
            {
                key: 3,
                label: "Recruiters",
                logo: recruiters,
                active_logo: recruiters_active,
                path: "/agency/recruiters/",
            },
            {
                key: 4,
                label: "Selected Candidates",
                logo: candidate,
                active_logo: candidate_active,
                path: "/agency/selected-candidates",
            },

            {
                key: 5,
                label: "Clients",
                logo: client,
                active_logo: client_active,
                path: "/agency/allclients",
                badge: unseenCount,
                onClick: () => {
                    console.log("Selected Candidates tab clicked!");
                },
            },

            {
                key: 6,
                label: "Negotiations",
                logo: negotiations,
                active_logo: negotiations_active,
                path: "/agency/negotiations",
                badge:
                    badgesData && badgesData.negotiate_terms > 0 ? true : false,
                children: [
                    {
                        key: "6-1",
                        label: "Terms",
                        path: "/agency/negotiations",
                        badge: false,
                    },
                    {
                        key: "6-2",
                        label: "Jobs",
                        path: "/agency/negotiations/edited-jobs",
                        badge: false,
                    },
                ],
            },
            {
                key: 7,
                label: "Invoices",
                logo: reports,
                active_logo: reports_active,
                path: "/agency/reports",
            },

            {
                key: 8,
                label: "Resume Bank",
                logo: candidate,
                active_logo: candidate_active,
                path: "/agency/resume-bank",
            },
            {
                key: 9,
                label: "Agency Resume Pool",
                logo: candidate,
                active_logo: candidate_active,
                path: "/agency/Candidates",
            },
        ],
        [badgesData],
    );

    return (
        <>
            <MainLayout
                children={children}
                defaultSelectedKey={defaultSelectedKey}
                options={options}
                defaultSelectedChildKey={defaultSelectedChildKey}
            />
        </>
    );
};

export default Layout2;
