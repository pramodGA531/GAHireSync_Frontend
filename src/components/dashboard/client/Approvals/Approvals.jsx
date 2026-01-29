import React from "react";
import Main from "../Layout";
import { Tabs } from "antd";
import JobsClient from "./JobsClient";
import TandCClient from "./TandCClient";
import JobEditRequests from "./JobEditRequests";
import TermsApprovals from "./TermsApprovals";
import GoBack from "../../../common/Goback";

const items = [
    {
        key: "1",
        label: "JobPosts",
        children: <JobsClient />,
    },
    {
        key: "2",
        label: "Job Edit Requests",
        children: <JobEditRequests />,
    },
    {
        key: "3",
        label: "T & c Approvals",
        children: <TermsApprovals />,
    },
    {
        key: "4",
        label: "Terms and Conditions",
        children: <TandCClient />,
    },
];

const Approvals = () => {
    return (
        <Main defaultSelectedKey="5">
            <div className="mt-4 -ml-2 -mb-4 pl-4">
                <GoBack />
            </div>
            <Tabs items={items} defaultActiveKey="1"></Tabs>
        </Main>
    );
};

export default Approvals;
