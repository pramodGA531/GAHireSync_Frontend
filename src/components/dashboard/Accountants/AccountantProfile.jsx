import React from "react";
import ProfileCard from "../../common/CommonCards/ProfileCard/ProfileCard";
import Main from "./Layout";
import { Tabs } from "antd";
import AccountantInfo from "./AccountantInfo";

const AccountantProfile = () => {
    const items = [
        {
            label: <span className="px-4 font-bold">Details</span>,
            key: "1",
            children: <AccountantInfo />,
        },
    ];

    return (
        <Main defaultSelectedKey="3">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="mb-8">
                    <ProfileCard />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <Tabs
                        items={items}
                        defaultActiveKey="1"
                        type="line"
                        className="premium-tabs"
                    />
                </div>
            </div>
        </Main>
    );
};

export default AccountantProfile;
