import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
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
            fetchBadges(); // Refresh badges after marking as seen
        } catch (error) {
            console.error("Error marking notifications as seen:", error);
        }
    };

    const markClientsAsSeen = async () => {
        try {
            await fetch(`${apiurl}/agency-connection/count/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getUnseenCount(); // Refresh count
        } catch (error) {
            console.error("Error marking clients as seen:", error);
        }
    };

    const location = useLocation();

    useEffect(() => {
        if (!token) return;

        const path = location.pathname;

        if (path.startsWith("/agency/jobs")) {
            markAsSeen([
                "create_job",
                "edit_job",
                "my_jobs", // Note: my_jobs might not be a notification category, but kept if it maps to one. Checking agency_views.py... my_jobs is a count, not a category.
                // Re-checking agency_views.py ManagerAllAlerts:
                // Categories: NEGOTIATE_TERMS, CREATE_JOB, ACCEPT_JOB_EDIT, REJECT_JOB_EDIT, PARTIAL_EDIT, CANDIDATE_JOINED, CANDIDATE_LEFT, EDIT_JOB, INVOICE_GENERATED.
                // Badge logic sums: create_job + edit_job + my_jobs + not_assigned + closed_hold.
                // create_job and edit_job are from notifications.
                // my_jobs, not_assigned, closed_hold are COUNTS from DB, not notifications. NOTIFICATION logic only clears NOTIFICATIONS.
                // So I should only mark 'create_job' and 'edit_job' as seen.
                "create_job",
                "edit_job",
            ]);
        } else if (path.startsWith("/agency/negotiations")) {
            markAsSeen([
                "negotiate_terms",
                "accept_job_edit",
                "reject_job_edit",
                "partial_edit",
            ]);
        } else if (path.startsWith("/agency/reports")) {
            markAsSeen(["invoice_generated"]);
        } else if (path.startsWith("/agency/allclients")) {
            markClientsAsSeen();
        }
    }, [location.pathname, token]);

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
                tooltip:
                    "View your Dashboard and overview of your organization",
            },
            {
                key: 2,
                label: "Job Posts",
                logo: jobs,
                active_logo: jobs_active,
                path: "/agency/jobs",
                tooltip:
                    " You can view, assign, approve and manage your jobs here",
                badge:
                    badgesData &&
                    badgesData.create_job +
                        badgesData.edit_job +
                        badgesData.my_jobs +
                        badgesData.not_assigned +
                        badgesData.closed_hold >
                        0
                        ? true
                        : false,
                // children: [
                //     {
                //         key: "2-1",
                //         label: "My Jobs",
                //         path: "/agency/jobs",
                //         badge:
                //             badgesData && badgesData.my_jobs > 0 ? true : false,
                //     },
                //     {
                //         key: "2-2",
                //         label: "Not Assigned",
                //         path: "/agency/jobs/not-assigned",
                //         badge:
                //             badgesData && badgesData.not_assigned > 0
                //                 ? true
                //                 : false,
                //     },
                //     {
                //         key: "2-3",
                //         label: "Not Approved",
                //         path: "/agency/jobs/not-approved",
                //         badge: badgesData?.create_job > 0,
                //     },
                //     {
                //         key: "2-4",
                //         label: "Closed/Hold",
                //         path: "/agency/jobs/closed-hold",
                //         badge:
                //             badgesData && badgesData.closed_hold > 0
                //                 ? true
                //                 : false,
                //     },
                //     {
                //         key: "2-5",
                //         label: "Analytics",
                //         path: "/agency/jobs/analytics",
                //         badge:
                //             badgesData && badgesData.analytics > 0
                //                 ? true
                //                 : false,
                //     },
                //     {
                //         key: "2-6",
                //         label: "Replacement Approvals",
                //         path: "/agency/replacement-approvals",
                //         badge: false, // Will implement badge logic later if needed
                //     },
                // ],
            },
            {
                key: 3,
                label: "Recruiters",
                logo: recruiters,
                active_logo: recruiters_active,
                path: "/agency/recruiters/",
                tooltip: "View and manage your recruiters",
            },
            {
                key: 4,
                label: "Selected Candidates",
                logo: candidate,
                active_logo: candidate_active,
                path: "/agency/selected-candidates",
                tooltip:
                    "View and manage your selected candidates for the job posts",
            },

            {
                key: 5,
                label: "Clients",
                logo: client,
                active_logo: client_active,
                path: "/agency/allclients",
                badge: unseenCount,
                tooltip: "View and manage your clients",
            },

            {
                key: 6,
                label: "Negotiations",
                logo: negotiations,
                active_logo: negotiations_active,
                path: "/agency/negotiations",
                tooltip: "View and manage your negotiations for terms and jobs",
                badge:
                    badgesData &&
                    badgesData.negotiate_terms +
                        badgesData.accept_job_edit +
                        badgesData.reject_job_edit +
                        badgesData.partial_edit >
                        0
                        ? true
                        : false,
                children: [
                    {
                        key: "6-1",
                        label: "Terms",
                        path: "/agency/negotiations",
                        badge:
                            badgesData && badgesData.negotiate_terms > 0
                                ? true
                                : false,
                    },
                    {
                        key: "6-2",
                        label: "Jobs",
                        path: "/agency/negotiations/edited-jobs",
                        badge:
                            badgesData &&
                            badgesData.accept_job_edit +
                                badgesData.reject_job_edit +
                                badgesData.partial_edit >
                                0
                                ? true
                                : false,
                    },
                ],
            },
            {
                key: 7,
                label: "Invoices",
                logo: reports,
                active_logo: reports_active,
                path: "/agency/reports",
                tooltip: "Generate Invoices here",
                badge:
                    badgesData && badgesData.invoice_generated > 0
                        ? true
                        : false,
            },

            {
                key: 8,
                label: "Agency Resume Pool",
                logo: candidate,
                active_logo: candidate_active,
                path: "/agency/Candidates",
                tooltip: "View and manage your candidates resumes",
            },
            // {
            //     key: 9,
            //     label: "Complete Job Posts",
            //     logo: candidate,
            //     active_logo: candidate_active,
            //     path: "/agency/job-posts",
            //     tooltip:
            //         "View and manage your job posts",
            // },
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
