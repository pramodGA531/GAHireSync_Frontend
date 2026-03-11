import React from "react";
import Layout from "./Layout";
import InterviewCalendar from "../../common/InterviewCalendar";

const ManagerCalendar = () => {
    return (
        <Layout defaultSelectedKey="6">
            <InterviewCalendar />
        </Layout>
    );
};

export default ManagerCalendar;
