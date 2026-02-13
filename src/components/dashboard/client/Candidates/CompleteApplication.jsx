import React, { useEffect, useState } from "react";

import { useAuth } from "../../../common/useAuth";
import { useParams } from "react-router-dom";
import { message, Breadcrumb } from "antd";
import Main from "../Layout";
import Pageloading from "../../../common/loading/Pageloading";
import ViewApplication from "../../../common/ViewApplication";
import GoBack from "../../../common/Goback";

const ClientCompleteApplication = () => {
    const [data, setData] = useState(null);
    const { apiurl, token } = useAuth();
    const { application_id } = useParams();
    const [loading, setLoading] = useState(false);

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

    return (
        <Main defaultSelectedKey="3" className="complete-app-container">
            {/* <div className="mt-4 -ml-2 mb-4">
                <GoBack />
            </div> */}
            <div className="m-4">
            <Breadcrumb
           
                separator=">"
                items={[
                    {
                        title: "Applications",
                        href: `/client/candidates/processing`,
                    },
                    {
                        title: "Complete Application",
                    },
                ]}
            ></Breadcrumb>
</div>
            <ViewApplication application_data={application_data} />
        </Main>
    );
};

export default ClientCompleteApplication;
