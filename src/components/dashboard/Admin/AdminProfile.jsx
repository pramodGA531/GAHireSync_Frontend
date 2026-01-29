import React from "react";
import Layout from "./Layout";
import { Tabs } from "antd";
import ProfileCard from "../../common/CommonCards/ProfileCard/ProfileCard";
import AdminInfo from "./AdminInfo";
import GoBack from "../../common/Goback";
export default function AdminProfile() {
    const items = [
        {
            label: <span className="px-4 font-bold">Details</span>,
            key: "1",
            children: <AdminInfo />,
        },
        // Add more tabs like Security/Settings here if needed in future
    ];

    return (
        <Layout defaultSelectedKey="1">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="mb-8">
                    <GoBack />
                    <ProfileCard hideEdit={true} />
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
        </Layout>
    );
}
