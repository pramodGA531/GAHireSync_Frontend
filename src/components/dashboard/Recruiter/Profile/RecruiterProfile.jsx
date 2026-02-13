import React from "react";
import Main from "../Layout";
import IntProfileCard from "../../../common/CommonCards/ProfileCard/IntProfileCard";
import GoBack from "../../../common/Goback";
const RecruiterProfile = () => {
    return (
        <Main>
            <div className="p-6 md:p-10 animate-in fade-in duration-500">
                {/* <div className="mt-4 -mb-6 -ml-2">
                    <GoBack />
                </div> */}
                <div className="max-w-4xl mx-auto">
                    <IntProfileCard />
                </div>
            </div>
        </Main>
    );
};

export default RecruiterProfile;
