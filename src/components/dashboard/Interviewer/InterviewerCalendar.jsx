import React from "react";
import Layout from "./Layout";
import InterviewCalendar from "../../common/InterviewCalendar";

const InterviewerCalendar = () => {
    return (
        <Layout defaultSelectedKey="calendar">
            <InterviewCalendar />
        </Layout>
    );
};

export default InterviewerCalendar;
