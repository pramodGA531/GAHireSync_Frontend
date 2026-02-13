import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Forms from "./components/forms/forms";
import ClientSignup from "./components/forms/ClientSignup";
import ForgotPassword1 from "./components/forms/ForgotPassword";
import SetPassword from "./components/forms/SetPassword";
import { AuthRoute } from "./components/common/AuthRoute";
import MainHome from "./components/Home/Main";
import AgencySignUp from "./components/forms/AgencySignup";
import OrganizationTerms from "./components/dashboard/Manager/TermsAndConditions/TermsAndConditions";
import JobPosting from "./components/dashboard/client/PostingNewJob/PostJob";
import SeeNegotiations from "./components/dashboard/Manager/TermsAndConditions/Negotiations";
import JobPosts from "./components/dashboard/Manager/JobPost/JobPosts";
import CompleteJobPost from "./components/dashboard/Manager/JobPost/CompleteJobPost";
import CompleteJobPost_Client from "./components/dashboard/client/ViewJobPost/CompleteJobPost";
import Editjob from "./components/dashboard/Manager/EditJob/Editjob";
import ManagerJobEditRequest from "./components/dashboard/Manager/EditRequests/ManagerJobEditRequest";
import ClientEditJob from "./components/dashboard/client/EditJob/Editjob";
import AnyEditRequests from "./components/dashboard/client/EditRequests/AnyEditRequests";
import ParticularJobEdit from "./components/dashboard/client/EditRequests/JobEditRequest";
import Resumes from "./components/dashboard/client/Resumes/Resumes";
import Approvals from "./components/dashboard/client/Approvals/Approvals";
import ConductInterview from "./components/dashboard/Interviewer/ConductInterview";
import UpcomingInterviews from "./components/dashboard/Candidate/UpcomingInterviews";
import Profile from "./components/common/Profile";
// import Profile from "./components/dashboard/Candidate/profile/Profile";
import Candidate from "./components/dashboard/Candidate/Candidate";
import CandidateDetails from "./components/dashboard/Candidate/profile/CandidateProfile";
import CandidateApplications from "./components/dashboard/Candidate/MyApplications";
import RecruiterProfile from "./components/dashboard/Recruiter/Profile/RecruiterProfile";
import Invoice from "./components/dashboard/Manager/Invoices/AllInvoice";
import VerifyEmail from "./components/forms/VerifyEmail";
import ViewCandidate from "./components/dashboard/Manager/Candidate/ViewCandidate";
import JobResponseCard from "./components/dashboard/Manager/managercards/JobResponseCard";
import JobResponses from "./components/dashboard/Manager/JobResponses/JobResponses";
import CandidatesCard from "./components/dashboard/Manager/managercards/CandidatesCard";
import Candidates from "./components/dashboard/Manager/Candidates/Candidates";
import RecTaskTracking from "./components/dashboard/Manager/JobPost/RecTaskTracking";
import AllRecruiters from "./components/dashboard/Manager/Recruiter/AllRecruiters";
import ViewJobPost from "./components/common/ViewJobPost";
import Onhold from "./components/dashboard/client/Candidates/OnHold/Onhold";
import SelectedJobs from "./components/dashboard/Candidate/SelectedJobs/SelectedJobs";
import ReconfirmationCandidates from "./components/dashboard/Recruiter/Reconfirmation/ReconfirmationCandidates";
import AllInvoices from "./components/dashboard/client/Invoices/AllInvoices";
import AllInvoicesorg from "./components/dashboard/Manager/Invoices/AllInvoice";
import ReopenJobsList from "./components/dashboard/client/ReopenJobs/ReopenJobsList";
import ReopenJob from "./components/dashboard/client/ReopenJobs/ReopenJob";
import SelectedCandidates from "./components/dashboard/Manager/SelectedCandidates/SelectedCandidates";
import JoinedCandidates from "./components/dashboard/client/Candidates/JoinedCandidates/JoinedCandidates";
import Replacement from "./components/dashboard/client/Replacements/Replacement";
import ClientJobs from "./components/dashboard/client/ViewJobPost/ClientJobs";
import ViewInterviewer from "./components/dashboard/client/Interviewers/ViewInterviewer";
import Applications from "./components/dashboard/client/Resumes/Applications";
import Compare from "./components/dashboard/client/Resumes/Compare";
import CandidateClient from "./components/dashboard/client/Candidates/Candidates/CandidateClient";
import ResumeScoreCard from "./components/dashboard/Recruiter/Scorecard/ResumeScoreCard";
import FileUploadCard from "./components/dashboard/Recruiter/FileuploadCard/FileUploadCard";
import ViewTickets from "./components/tickets/ViewTickets";
import HandleTickets from "./components/tickets/HandleTickets";
import Admin from "./components/dashboard/Admin/Admin";
import AdminTickets from "./components/dashboard/Admin/AdminTickets";
import Blogs from "./components/Blogs/Blogs";
import AdminBlogs from "./components/dashboard/Admin/Blogs/AdminBlogs";
import InterviewCalendar from "./components/dashboard/Manager/managercards/InterviewCalendar";
import AnimatedDiv from "./components/animation/AnimatedDiv";
import RecruiterSummaryLayout from "./components/dashboard/Manager/Recruiter/RecruiterSummery";
import LandingHome from "./components/LandingPage/LandingHome";
import Tickets from "./components/tickets/Tickets";
import AboutUs from "./components/LandingPage/AboutUs";
import ContactUs from "./components/LandingPage/ContactUs";
import SendApplication from "./components/dashboard/Recruiter/SendApplications/SendApplication";
import ComingSoon from "./components/ComingSoon";
import { useEffect } from "react";
import Faqs from "./components/LandingPage/Faqs";
import BlogSpecificPage from "./components/Blogs/BlogSpecificPage";
import BlogPostForm from "./components/dashboard/Admin/Blogs/BlogPostForm";
import AllApplications from "./components/dashboard/Recruiter/ScheduleInterviews/AllApplications";
import AllNotifications from "./components/common/Notifications/AllNotifications";
import JobInterviews from "./components/dashboard/Interviewer/JobInterviews";
import ClientData from "./components/dashboard/Manager/ClientsData/ClientData";

import AllClients from "./components/dashboard/Manager/ClientsData/AllClients";
import AllOrgsData from "./components/dashboard/client/organizations/AllOrgsData";
import OrgData from "./components/dashboard/client/organizations/OrgData";
import JobApplications from "./components/dashboard/Recruiter/Applications/JobApplications";
import CompleteApplication from "./components/dashboard/Recruiter/Applications/CompleteApplication";
import CandidateCompleteApplication from "./components/dashboard/Candidate/CandidateCompleteApplication";
import CandidateCompleteJobPost from "./components/dashboard/Candidate/CandidateCompleteJobPost";
import ServerDownPage from "./components/ServerDownPage";
import LinkedinCallbackHandler from "./components/LinkedinCallBack";
import JobBoard from "./components/LandingPage/JobBoard";
import ViewJobPostOutsider from "./components/common/ViewJobPostOutsider";
import CompleteJobPostOutsider from "./components/LandingPage/CompleteJobpostOutsider";
import IncomingApplications from "./components/dashboard/Recruiter/AssignedPosts/IncomingApplications";
import AgencyResumeBank from "./components/dashboard/Manager/ResumeBank/AgencyResumeBank";
import InterviewerCompleteJobPost from "./components/dashboard/Interviewer/CompleteJobPost";
import ClientCompleteApplication from "./components/dashboard/client/Candidates/CompleteApplication";
import ClosedApplicationsRecruiter from "./components/dashboard/Recruiter/AssignedPosts/ClosedApplications";
import OpenedApplicationsRecruiter from "./components/dashboard/Recruiter/AssignedPosts/OpenedApplications";
import ApplicationsToSchedule from "./components/dashboard/Recruiter/ScheduleInterviews/ApplicationsToSchedule";
import ScheduledApplications from "./components/dashboard/Recruiter/ScheduleInterviews/ScheduledApplications";
import Recruiter from "./components/dashboard/Recruiter/Recruiter";
import ScheduledInterviews from "./components/dashboard/Interviewer/Interviews/ScheduledInterviews";
import CompletedInterviews from "./components/dashboard/Interviewer/Interviews/CompletedInterviews";
import ShortlistedCandidates from "./components/dashboard/client/Candidates/ShortlistedCandidates";
import CandidatesLeft from "./components/dashboard/client/Candidates/CandidatesLeft";
import ClientSelectedCandidates from "./components/dashboard/client/Candidates/SelectedCandidates";
import ClientInterviewersCalendar from "./components/dashboard/client/Calender/Calender";
import ScheduledInterviewsClient from "./components/dashboard/client/Interviewers/ScheduledInterviews";
import ViewInterviewerClient from "./components/dashboard/client/Interviewers/ViewInterviewer";
import ClientInterviewers from "./components/dashboard/client/Interviewers/Interviewers";
import TermsApprovals from "./components/dashboard/client/Approvals/TermsApprovals";
import TandCClient from "./components/dashboard/client/Approvals/TandCClient";
import Manager from "./components/dashboard/Manager/Manager";
import ReplacementApproval from "./components/dashboard/Manager/JobPost/ReplacementApproval";
import NotApprovedJobs from "./components/dashboard/Manager/JobPost/NotApprovedJobs";
import ClosedHoldJobs from "./components/dashboard/Manager/JobPost/ClosedHoldJobs";
import NotAssignedJobs from "./components/dashboard/Manager/JobPost/NotAssignedJobs";
import EditedJobs from "./components/dashboard/Manager/TermsAndConditions/EditedJobs";
import AccountantDashboard from "./components/dashboard/Accountants/Dashboard";
import Invoices from "./components/dashboard/Accountants/Invoices";
import AdminCompleteBlog from "./components/dashboard/Admin/Blogs/AdminCompleteBlog";
import CompleteJobPostRecruiter from "./components/dashboard/Recruiter/CompleteJobPosts";
import ReplacementsRecruiter from "./components/dashboard/Recruiter/RequestedReplacements/Replacements";
import Footer from "./components/LandingPage/Footer";
import JobEditRequests from "./components/dashboard/client/Approvals/JobEditRequests";
// import CompleteJobPosts from "./components/dashboard/manager/jobpost/CompleteJobPosts";
const App = () => {
    const now = new Date();
    const launchDate = new Date(2025, 2, 30, 10, 0, 0);
    const isLaunchReady = now >= launchDate;
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLaunchReady) {
            navigate("/coming-soon", { replace: true });
        }
    }, [isLaunchReady, navigate]);
    return (
        <>
            <Routes>
                {!isLaunchReady && (
                    <Route
                        path="*"
                        element={<Navigate to="/coming-soon" replace />}
                    />
                )}
                <Route path="/footer" element={<Footer />} />
                <Route path="/login" element={<Forms />} />
                <Route path="/forgot_password" element={<ForgotPassword1 />} />
                <Route path="/reset/:uuid/:token" element={<SetPassword />} />
                <Route
                    path="/verify-email/:uuid/:token"
                    element={<VerifyEmail />}
                />
                <Route path="/client/signup" element={<ClientSignup />} />
                <Route path="/agency/signup" element={<AgencySignUp />} />
                <Route path="/welcome" element={<LandingHome />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/server-down" element={<ServerDownPage />} />
                <Route path="/job-board" element={<JobBoard />} />
                <Route
                    path="/job-board/job-post/:id"
                    element={<CompleteJobPostOutsider />}
                />
                <Route path="/faqs" element={<Faqs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogSpecificPage />} />
                <Route
                    path="/linkedin/callback"
                    element={<LinkedinCallbackHandler />}
                />
                <Route path="/" element={<AuthRoute />}>
                    <Route path="/" element={<MainHome />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/client/mypostings" element={<ClientJobs />} />
                    <Route path="/client/postjob" element={<JobPosting />} />
                    <Route
                        path="/client/complete_job_post/:id"
                        element={<CompleteJobPost_Client />}
                    ></Route>
                    <Route
                        path="/client/edited_job_details/:id"
                        element={<ParticularJobEdit />}
                    />
                    <Route
                        path="/client/edit-requests"
                        element={<AnyEditRequests />}
                    ></Route>
                    <Route
                        path="/client/applications"
                        element={<Applications />}
                    />
                    <Route
                        path="/client/get-resumes/:id"
                        element={<Resumes />}
                    />
                    <Route
                        path="/client/get-resumes/compare/:id"
                        element={<Compare />}
                    />
                    <Route
                        path="/client/interviewers"
                        element={<ClientInterviewers />}
                    />
                    <Route
                        path="/client/interviews/scheduled"
                        element={<ScheduledInterviewsClient />}
                    />
                    <Route
                        path="/client/interviews/calendar"
                        element={<ClientInterviewersCalendar />}
                    />
                    <Route
                        path="/client/reopen-jobslist"
                        element={<ReopenJobsList />}
                    />
                    <Route
                        path="/client/reopen-job/:id"
                        element={<ReopenJob />}
                    />
                    <Route
                        path="/client/negotiated-terms"
                        element={<TermsApprovals />}
                    ></Route>
                    <Route
                        path="/client/finalized-tandc"
                        element={<TandCClient />}
                    />
                    <Route
                        path="/client/interviewer/:id"
                        element={<ViewInterviewer />}
                    />
                    <Route
                        path="/client/joined-candidates"
                        element={<JoinedCandidates />}
                    />
                    <Route
                        path="/client/replacements"
                        element={<Replacement />}
                    />
                    <Route path="/client/on-hold" element={<Onhold />} />
                    <Route path="/client/invoices" element={<AllInvoices />} />
                    <Route
                        path="/client/candidates/:id"
                        element={<CandidateClient />}
                    />
                    <Route
                        path="/client/candidates/processing"
                        element={<ShortlistedCandidates />}
                    />
                    <Route
                        path="/client/candidates/onhold"
                        element={<Onhold />}
                    />
                    <Route
                        path="/client/candidates/selected"
                        element={<ClientSelectedCandidates />}
                    />
                    <Route
                        path="/client/candidates/joined"
                        element={<JoinedCandidates />}
                    />
                    <Route
                        path="/client/candidates/candidates-left"
                        element={<CandidatesLeft />}
                    />
                    <Route
                        path="/client/organizations/"
                        element={<AllOrgsData />}
                    />
                    <Route
                        path="/client/organizations/:id"
                        element={<OrgData />}
                    />
                    <Route
                        path="/client/application/:application_id"
                        element={<ClientCompleteApplication />}
                    />

                    <Route
                        path="/interviewer/conduct-interview/:id"
                        element={<ConductInterview />}
                    />
                    <Route
                        path="/interviewer/interviews/upcoming"
                        element={<ScheduledInterviews />}
                    />
                    <Route
                        path="/interviewer/interviews/completed"
                        element={<CompletedInterviews />}
                    />
                    <Route
                        path="/interviewer/jobinterviews"
                        element={<JobInterviews />}
                    />
                    <Route
                        path="/interviewer/jobpost/:id"
                        element={<InterviewerCompleteJobPost />}
                    />

                    <Route path="/animation" element={<AnimatedDiv />} />
                    <Route path="/agency" element={<Manager />} />
                    <Route
                        path="/agency/terms"
                        element={<OrganizationTerms />}
                    />
                    <Route
                        path="/agency/reports"
                        element={<AllInvoicesorg />}
                    />
                    <Route path="/agency/jobs" element={<JobPosts />} />
                    {/* <Route path="/agency/job-posts" element={<CompleteJobPosts />} /> */}
                    <Route
                        path="/agency/jobs/not-approved"
                        element={<NotApprovedJobs />}
                    />
                    <Route
                        path="/agency/jobs/not-assigned"
                        element={<NotAssignedJobs />}
                    />
                    <Route
                        path="/agency/jobs/closed-hold"
                        element={<ClosedHoldJobs />}
                    />
                    <Route
                        path="/agency/replacement-approvals"
                        element={<ReplacementApproval />}
                    />
                    <Route
                        path="/agency/jobs/analytics"
                        element={<RecTaskTracking />}
                    />
                    <Route
                        path="/agency/jobs/client-edit-requests"
                        element={<JobPosts defaultTab="edit_requests" />}
                    />
                    <Route
                        path="/agency/postings/:id"
                        element={<CompleteJobPost />}
                    />
                    <Route path="/agency/edit_job/:id" element={<Editjob />} />
                    <Route
                        path="/client/edit_job/:id"
                        element={<ClientEditJob />}
                    />
                    <Route
                        path="/agency/job-edit-request/:id"
                        element={<ManagerJobEditRequest />}
                    />
                    <Route
                        path="/agency/negotiations"
                        element={<SeeNegotiations />}
                    />
                    <Route
                        path="/agency/negotiations/edited-jobs"
                        element={
                            <JobPosts
                                defaultTab="edit_requests"
                                hideTabs={true}
                            />
                        }
                    />
                    <Route
                        path="/agency/recruiters"
                        element={<AllRecruiters />}
                    />
                    <Route
                        path="/agency/invoices"
                        element={<Invoice />}
                    ></Route>
                    <Route
                        path="/agency/view_candidate"
                        element={<ViewCandidate />}
                    />
                    <Route
                        path="/agency/all_recruiters"
                        element={<AllRecruiters />}
                    />
                    <Route
                        path="/agency/task_tracking"
                        element={<RecTaskTracking />}
                    />
                    <Route
                        path="/agency/jobresponses/:jobId"
                        element={<JobResponses />}
                    />
                    <Route
                        path="/agency/jobresponses/:jobId/:recruiterId"
                        element={<JobResponses />}
                    />
                    {/* <Route path="/agency/card" element={<JobResponseCard />} /> */}
                    <Route path="/agency/card" element={<CandidatesCard />} />
                    <Route path="/agency/Candidates" element={<Candidates />} />
                    <Route
                        path="/agency/calender"
                        element={<InterviewCalendar />}
                    />
                    <Route
                        path="/agency/selected-candidates"
                        element={<SelectedCandidates />}
                    />
                    <Route
                        path="/agency/recruiters/:id"
                        element={<RecruiterSummaryLayout />}
                    />
                    <Route
                        path="/agency/allclients/"
                        element={<AllClients />}
                    />
                    <Route
                        path="/agency/allclients/:id"
                        element={<ClientData />}
                    />
                    <Route
                        path="/agency/resume-bank"
                        element={<AgencyResumeBank />}
                    />

                    <Route path="/recruiter" element={<Recruiter />} />
                    <Route
                        path="/recruiter/postings/opened"
                        element={<OpenedApplicationsRecruiter />}
                    />
                    <Route
                        path="/recruiter/postings/closed"
                        element={<ClosedApplicationsRecruiter />}
                    />
                    <Route
                        path="/recruiter/applications/to-schedule"
                        element={<ApplicationsToSchedule />}
                    />
                    <Route
                        path="/recruiter/applications/already-scheduled"
                        element={<ScheduledApplications />}
                    />
                    <Route
                        path="/recruiter/complete_job_post/:id"
                        element={<CompleteJobPostRecruiter />}
                    />
                    <Route
                        path="/recruiter/postings/opened/:id"
                        element={<SendApplication />}
                    />
                    <Route
                        path="/recruiter/profile"
                        element={<RecruiterProfile />}
                    />
                    <Route
                        path="/recruiter/schedule_applications"
                        element={<AllApplications />}
                    />
                    <Route
                        path="/recruiter/reconfirmation-applications"
                        element={<ReconfirmationCandidates />}
                    />
                    <Route
                        path="/recruiter/job-applications/:id"
                        element={<JobApplications />}
                    />
                    <Route
                        path="/recruiter/complete-application/:application_id/:job_id"
                        element={<CompleteApplication />}
                    />
                    <Route
                        path="/recruiter/incoming-applications/:job_id/:location"
                        element={<IncomingApplications />}
                    />
                    <Route
                        path="/recruiter/replacements"
                        element={<ReplacementsRecruiter />}
                    />

                    <Route
                        path="resumescorecard/"
                        element={<ResumeScoreCard />}
                    ></Route>
                    <Route path="upload/" element={<FileUploadCard />}></Route>

                    <Route
                        path="/candidate/profile"
                        element={<CandidateDetails />}
                    ></Route>
                    <Route
                        path="/candidate/upcoming_interviews"
                        element={<UpcomingInterviews />}
                    />
                    <Route
                        path="/candidate/applications"
                        element={<CandidateApplications />}
                    />
                    <Route
                        path="/candidate/selected_jobs"
                        element={<SelectedJobs />}
                    />
                    <Route
                        path="/candidate/complete-application/:application_id/:job_id"
                        element={<CandidateCompleteApplication />}
                    />
                    <Route
                        path="/candidate/complete-jobdetails/:job_id"
                        element={<CandidateCompleteJobPost />}
                    />

                    <Route path="/view-tickets" element={<ViewTickets />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/handle-tickets" element={<HandleTickets />} />
                    {/* <Route path="/writeblog" element={<BlogPostForm />} /> */}

                    <Route path="/admin/blogs" element={<AdminBlogs />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/tickets" element={<AdminTickets />} />
                    <Route path="/admin/add-blog" element={<BlogPostForm />} />
                    <Route
                        path="/admin/complete-blog/:id"
                        element={<AdminCompleteBlog />}
                    />

                    <Route
                        path="/accountant"
                        element={<AccountantDashboard />}
                    />
                    <Route path="/accountant/invoice" element={<Invoices />} />

                    <Route
                        path="/notifications"
                        element={<AllNotifications />}
                    />
                </Route>
            </Routes>
        </>
    );
};

export default App;
