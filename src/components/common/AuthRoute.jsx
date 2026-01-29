import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate, } from "react-router-dom";
import { useAuth } from "./useAuth";
import Pageloading from "./loading/Pageloading";
import { message } from "antd";


export const AuthRoute = () => {
	const { token, apiurl } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [isValidToken, setIsValidToken] = useState(false);
	const navigate = useNavigate()

	const verifyToken = async (token) => {
		try {
			const response = await fetch(`${apiurl}/verify-token/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
					"ngrok-skip-browser-warning": "69420",
				},
				body: JSON.stringify({ token }),
			});
			if (!response.ok) {
				throw new Error("Failed to verify token");
			}
			const data = await response.json();
			return data.valid === true;
		} catch (error) {
			if (error.name === "AbortError" || error.message === "Failed to fetch" || error.message.includes("NetworkError")) {
				message.error("Server is down. Try again later.");
				navigate("/server-down");
			} else {
				message.error("Token expired! Please Login again.");
				navigate('/login?inValidToken=true');
			}
			return false;
		}
	};

	useEffect(() => {
		const checkTokenValidity = async () => {
			if (token && token !== "undefined" && token !== "null") {
				const isValid = await verifyToken(token);
				setIsValidToken(isValid);
			} else {
				setIsValidToken(false);
			}
			setIsLoading(false);
		};

		checkTokenValidity();
	}, [token]);

	if (isLoading) {
		return <Pageloading />;
	}

	// If there's no valid token, redirect to landing page first
	if (!token || token === "undefined" || token === "null") {
		return <Navigate to="/welcome" replace />;
	}

	// If token is invalid, redirect to login page
	if (!isValidToken) {
		return (
			<Navigate
				to="/login"
				state={{ error: "Token expired. Please login again." }}
				replace
			/>
		);
	}

	return <Outlet />;
};
