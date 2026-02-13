import React, { useEffect, useState } from "react";

import Main from "../Layout";
import ProfileCard from "../../../common/CommonCards/ProfileCard/ProfileCard";
import { useAuth } from "../../../common/useAuth";
import { message, Tabs } from "antd"; // import Tabs from Ant Design
import ClientInfo from "./ClientInfo";
import GoBack from "../../../common/Goback";
const { TabPane } = Tabs; // Destructure TabPane

const ClientProfile = () => {
    const { apiurl, token } = useAuth();

    return (
        <Main>
            {/* <div className="mt-4 -mb-6 -ml-2">
                <GoBack />
            </div> */}
            <ProfileCard />
            <div className="m-2">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Profile Info" key="1">
                        <ClientInfo />
                    </TabPane>
                    <TabPane tab="Settings" key="2">
                        <p>Here you can change your settings.</p>
                    </TabPane>
                </Tabs>
            </div>
        </Main>
    );
};

export default ClientProfile;
