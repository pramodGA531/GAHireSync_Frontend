import React, { Children } from "react";
import ProfileCard from "../../../common/CommonCards/ProfileCard/ProfileCard";
import Main from "../Layout";
import OrganizationTerms from "../TermsAndConditions/TermsAndConditions";
import { Tabs } from "antd";
import MangerInfo from "./MangerInfo";
import LinkedinIntegration from "./LinkedinIntegration";
import Pricing from "./Pricing";
import BankDetails from "./BankDetails";
import GoBack from "../../../common/Goback";
const ManagerProfile = () => {
    const items = [
        {
            label: <span className="px-4 font-bold">Details</span>,
            key: "1",
            children: <MangerInfo />,
        },
        {
            label: <span className="px-4 font-bold">Bank Details</span>,
            key: "2",
            children: <BankDetails />,
        },
        {
            label: <span className="px-4 font-bold">LinkedIn Integration</span>,
            key: "3",
            children: <LinkedinIntegration />,
        },
        {
            label: <span className="px-4 font-bold">Pricing</span>,
            key: "4",
            children: <Pricing />,
        },
        {
            label: <span className="px-4 font-bold">Terms and Conditions</span>,
            key: "5",
            children: <OrganizationTerms />,
        },
    ];

    return (
        <Main>
            <div className="mt-4 -mb-6 -ml-2">
                <GoBack />
            </div>
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

export default ManagerProfile;
