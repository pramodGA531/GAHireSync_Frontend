import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useAuth } from "../common/useAuth";
import Client from "../dashboard/client/Client";
import Manager from "../dashboard/Manager/Manager";
import Recruiter from "../dashboard/Recruiter/Recruiter";
import Interviewer from "../dashboard/Interviewer/Interviewer";
import Candidate from "../dashboard/Candidate/Candidate";
import Dashboard from "../dashboard/Accountants/Dashboard";
import Admin from "../dashboard/Admin/Admin";
import { useNavigate } from "react-router-dom"; // if using react-router

const MainHome = () => {
	const { apiurl, token } = useAuth();
	const [userDetails, setUserDetails] = useState(null);
	const [backendDown, setBackendDown] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (token && !backendDown) {
			fetchUserDetails();
		}
	}, [token]);

	const fetchUserDetails = async () => {
		try {
			const response = await fetch(`${apiurl}/get-user-details/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setUserDetails(data.data);
			} else {
				const data = await response.json();
				message.error(data.error || "Failed to fetch user details");
			}
		} catch (error) {
			setBackendDown(true);
			message.error("Server is currently down");
			navigate("/server-down");
		}
	};

	switch (userDetails?.role) {
		case "client":
			return <Client />;
		case "manager":
			return <Manager />;
		case "recruiter":
			return <Recruiter />;
		case "interviewer":
			return <Interviewer />;
		case "candidate":
			return <Candidate />;
		case "accountant":
			return <Dashboard />;
		case "admin":
			return <Admin />;
		default:
			return null;
	}
};

export default MainHome;
