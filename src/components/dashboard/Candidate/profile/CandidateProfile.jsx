import React, { useState } from "react";
import CandidateDetails from "./CandidateDetails";
import { Tabs } from "antd";
import Experiences from "./Experiences";
import Certificates from "./Certificates";
import Education from "./Education";
import Main from "../Layout";
import { EditOutlined } from "@ant-design/icons";
import ProfileCard from "../../../common/CommonCards/ProfileCard/ProfileCard";
import GoBack from "../../../common/Goback";
const CandidateProfile = () => {
    const [option, setOption] = useState("basic");
    console.log("option", option);
    const items = [
        {
            key: "1",
            label: "Basic Details",
            children: <CandidateDetails />,
        },
        {
            key: "2",
            label: "Experiences",
            children: <Experiences />,
        },
        {
            key: "3",
            label: "Education",
            children: <Education />,
        },
        {
            key: "4",
            label: "Certificates",
            children: <Certificates />,
        },
    ];
    return (
        <Main defaultSelectedKey="4">
            <div className="mt-4 -mb-6 -ml-2"><GoBack />
                </div>
            <ProfileCard></ProfileCard>

            <Tabs
                className="mt-[15px] pl-[15px]"
                defaultSelectedKey="1"
                items={items}
            ></Tabs>
        </Main>
    );
};

export default CandidateProfile;
