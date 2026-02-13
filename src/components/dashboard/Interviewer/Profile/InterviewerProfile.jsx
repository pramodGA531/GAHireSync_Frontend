import React from "react";

import Main from "../Layout";
import ProfileCard from "../../../common/CommonCards/ProfileCard/ProfileCard";
import IntProfileCard from "../../../common/CommonCards/ProfileCard/IntProfileCard";
import GoBack from "../../../common/Goback";
const InterviewerProfile = () => {
    return (
        <Main>  {/* <div className="mt-4 -mb-6 -ml-2"><GoBack />
                </div> */}
            <IntProfileCard></IntProfileCard>
        </Main>
    );
};

export default InterviewerProfile;
