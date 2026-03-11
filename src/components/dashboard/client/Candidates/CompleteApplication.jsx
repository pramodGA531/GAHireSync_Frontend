import React, { useEffect, useState } from "react";

import { useAuth } from "../../../common/useAuth";
import { useParams, useLocation } from "react-router-dom";
import { message, Breadcrumb } from "antd";
import Main from "../Layout";
import Pageloading from "../../../common/loading/Pageloading";
import ViewApplication from "../../../common/ViewApplication";

const ClientCompleteApplication = () => {
    const [data, setData] = useState(null);
    const { apiurl, token } = useAuth();
    const { application_id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Determine breadcrumb trail from router state (if any)
    const routerState = location.state || {};
    const fromReplacements = routerState.from === "replacements";
    const parentLabel = routerState.label || "Replacement Requests";

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${apiurl}/complete-application/?application_id=${application_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
            } else {
                setData(data);
            }
        } catch (e) {
            console.log(e);
            message.error("Something went wrong while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    if (loading || !data) return <Pageloading />;

    const { application_data } = data;

    const breadcrumbItems = fromReplacements
        ? [
              { title: "Replacements", href: "/client/replacements" },
              { title: parentLabel, href: "/client/replacements" },
              { title: "Candidate Profile" },
          ]
        : [
              { title: "Applications", href: "/client/candidates/processing" },
              { title: "Candidate Profile" },
          ];

    return (
        <Main defaultSelectedKey="3" className="complete-app-container">
            <div className="m-4">
                <Breadcrumb separator=">" items={breadcrumbItems} />
            </div>
            <ViewApplication application_data={application_data} />
        </Main>
    );
};

export default ClientCompleteApplication;
