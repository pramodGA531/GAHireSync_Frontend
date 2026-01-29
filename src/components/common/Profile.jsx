import React from "react";
import ClientProfile from "../dashboard/client/Profile/ClientProfile";
import CandidateProfile from "../dashboard/Candidate/profile/CandidateProfile";
import InterviewerProfile from "../dashboard/Interviewer/Profile/InterviewerProfile";
import RecruiterProfile from "../dashboard/Recruiter/Profile/RecruiterProfile";
import ManagerProfile from "../dashboard/Manager/Profile/ManagerProfile";
import AdminProfile from "../dashboard/Admin/AdminProfile";
import { useAuth } from "./useAuth";
import Goback from "./Goback";
const Profile = () => {
    const { userData } = useAuth();

    let user = typeof userData === "string" ? JSON.parse(userData) : userData;

    const roleComponentMap = {
        manager: ManagerProfile,
        client: ClientProfile,
        candidate: CandidateProfile,
        recruiter: RecruiterProfile,
        interviewer: InterviewerProfile,
        admin: AdminProfile,
    };

    const ProfileComponent = roleComponentMap[user?.role] || null;

    return (
        <div>
            {/* <Goback /> */}
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> Debugging */}
            {ProfileComponent && <ProfileComponent />}
        </div>
    );
};

export default Profile;
