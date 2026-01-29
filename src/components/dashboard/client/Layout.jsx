import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../../common/Layout/MainLayout2";
import dashboard_active from "../../../images/SideBar/dashboard-active.svg";
import dashboard from "../../../images/SideBar/dashboard.svg";
import recruite_flow_active from "../../../images/SideBar/recruite-flow-active.svg";
import recriute_flow from "../../../images/SideBar/recruite-flow.svg";
import interviewer_active from "../../../images/SideBar/interviewer-active.svg";
import interviewer from "../../../images/SideBar/interviewer.svg";
import invoice_active from "../../../images/SideBar/invoice-active.svg";
import invoice from "../../../images/SideBar/invoice.svg";
import jobpostings_active from "../../../images/SideBar/jobpostings-active.svg";
import jobpostings from "../../../images/SideBar/jobpostings.svg";
import organizations_active from "../../../images/SideBar/organizations-active.svg";
import organizations from "../../../images/SideBar/organizations.svg";
import recruiter_summary_active from "../../../images/SideBar/recruiter-summary-active.svg";
import recruiter_summary from "../../../images/SideBar/recruiter-summary.svg";
import replacement_active from "../../../images/SideBar/replacement-active.svg";
import replacement from "../../../images/SideBar/replacement.svg";
import service_agreement_active from "../../../images/SideBar/service-agreement-active.svg";
import service_agreement from "../../../images/SideBar/service-agreement.svg";

// import dashboard from "./../../../images/Dashboard.svg"
// import files from "./../../../images/Files.svg"
// import candidates from "./../../../images/CandidateProfile.svg"
// import jobs from "./../../../images/Jobs.svg"
// import interviewers from "./../../../images/InterviewersProfile.svg"
// import secure from "./../../../images/Secure.svg"
// import Invoice from "./../../../images/Client/Invoices.svg"
// import Replace from "./../../../images/Replace.svg"
import { useAuth } from "../../common/useAuth";
import { message } from "antd";

const Layout = ({
    children,
    defaultSelectedKey,
    defaultSelectedChildKey = "0",
}) => {
    const { apiurl, token } = useAuth();
    const [userData, setUserData] = useState();
    const [badgesData, setBadgesData] = useState();

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiurl}/get-profile/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                // console.log(data.error)
            } else {
                setUserData(data);
            }
        } catch (e) {
            // console.log(e)
        }
    };

    const fetchBadges = async () => {
        try {
            const response = await fetch(`${apiurl}/client/all-alerts`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                // console.log(data.error)
                return;
            } else {
                setBadgesData(data.data);
            }
        } catch (e) {
            // console.log(e)
        }
    };

    useEffect(() => {
        if (token) {
            fetchBadges();
        }
    }, [token]);

    const cilentoptions = useMemo(
        () => [
            {
                key: "1",
                label: "Dashboard",
                logo: dashboard,
                active_logo: dashboard_active,
                path: "/",
                badge: false,
            },
            {
                key: "2",
                label: "Job Postings",
                active_logo: jobpostings_active,
                logo: jobpostings,
                badge: false,
                children: [
                    {
                        key: "2-1",
                        label: "My Job Posts",
                        path: "/client/mypostings",
                        badge: false,
                    },
                    {
                        key: "2-2",
                        label: "Create New Job",
                        path: "/client/postjob",
                        badge: false,
                    },
                    {
                        key: "2-3",
                        label: "Edit Requests",
                        path: "/client/edit-requests",
                        badge: false,
                    },
                ],
            },

            {
                key: "3",
                label: "Recruite Summary",
                logo: recruiter_summary,
                active_logo: recruiter_summary_active,
                path: "/client/applications",
                badge: (badgesData?.send_application || 0) > 0,
            },

            {
                key: "4",
                label: "Recruite Flow",
                logo: recriute_flow,
                active_logo: recruite_flow_active,
                badge:
                    badgesData?.onhold_candidate +
                        badgesData?.candidate_accepted +
                        badgesData?.candidate_rejected >
                    0,
                children: [
                    {
                        key: "4-1",
                        label: "Screening",
                        path: "/client/candidates/processing",
                        badge: false,
                    },
                    {
                        key: "4-2",
                        label: "On Hold",
                        path: "/client/candidates/onhold",
                        badge: false,
                    },
                    {
                        key: "4-3",
                        label: "Selected",
                        path: "/client/candidates/selected",
                        badge: false,
                    },
                    {
                        key: "4-4",
                        label: "Joined",
                        path: "/client/candidates/joined",
                        badge: false,
                    },
                    {
                        key: "4-5",
                        label: "Candidates Left",
                        path: "/client/candidates/candidates-left",
                        badge: false,
                    },
                ],
            },

            {
                key: "5",
                label: "Interviewer",
                logo: interviewer,
                active_logo: interviewer_active,
                badge: false,
                children: [
                    {
                        key: "5-1",
                        label: "Interviewer",
                        path: "/client/interviewers",
                        badge: false,
                    },
                    {
                        key: "5-2",
                        label: "Scheduled Interviews",
                        path: "/client/interviews/scheduled",
                        badge: false,
                    },
                    {
                        key: "5-3",
                        label: "Calendar",
                        path: "/client/interviews/calendar",
                        badge: false,
                    },
                ],
            },

            {
                key: "6",
                label: "Raised Replacement",
                logo: replacement,
                active_logo: replacement_active,
                path: "/client/replacements",
            },

            {
                key: "7",
                label: "Service Aggreement",
                logo: service_agreement,
                active_logo: service_agreement_active,
                badge: badgesData?.accept_terms + badgesData?.reject_terms > 0,
                children: [
                    {
                        key: "7-1",
                        label: "Finalized T&C",
                        path: "/client/finalized-tandc",
                        badge: false,
                    },
                    {
                        key: "7-2",
                        label: "T&C Negotiations",
                        path: "/client/negotiated-terms",
                        badge: false,
                    },
                ],
            },

            {
                key: "8",
                label: "Invoices",
                logo: invoice,
                active_logo: invoice_active,
                path: "/client/invoices",
                badge: false,
            },

            {
                key: "9",
                label: "Organizations",
                logo: organizations,
                active_logo: organizations_active,
                path: "/client/organizations",
                badge: false,
            },
        ],
        [badgesData]
    );

    return (
        <>
            <MainLayout
                children={children}
                defaultSelectedKey={defaultSelectedKey}
                defaultSelectedChildKey={defaultSelectedChildKey}
                options={cilentoptions}
            ></MainLayout>
        </>
    );
};

export default Layout;
