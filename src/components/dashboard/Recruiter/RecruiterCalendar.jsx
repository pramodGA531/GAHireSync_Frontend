import React from "react";
import Layout from "./Layout";
import InterviewCalendar from "../../common/InterviewCalendar";

const RecruiterCalendar = () => {
    return (
        <Layout defaultSelectedKey="2" defaultSelectedChildKey="2-3">
            <InterviewCalendar />
        </Layout>
    );
};

export default RecruiterCalendar;
