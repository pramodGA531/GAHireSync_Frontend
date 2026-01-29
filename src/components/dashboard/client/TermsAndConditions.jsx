import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button, Input } from "antd";
import JobPostForm from "./PostJob";
import Main from "./Layout";
import GoBack from "../../common/Goback";
import { useAuth } from "../../common/useAuth";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { token, apiurl } = useAuth();
    const [accepted, setAccepted] = useState(false);
    const [open, setOpen] = useState(false);
    const [TandC, setTandC] = useState(null);
    const [showNegotiate, setShowNegotiate] = useState(false);
    const [negotiationText, setNegotiationText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        if (accepted) {
            setOpen((e) => !e);
        }
    };

    const handleAcceptance = () => {
        setAccepted((e) => !e);
    };

    const handleNegotiate = () => {
        setShowNegotiate(true);
    };

    const handleNegotiationSubmit = async () => {
        setLoading(true);
        console.log(negotiationText);
        try {
            const response = await fetch(
                `${apiurl}/api/client/terms_and_conditions/negotiated/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ negotiationText }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to submit negotiation");
            }
            const data = await response.json();
        } catch (error) {
            console.error("Error submitting negotiation:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            login(token);
        }
    }, [login]);

    useEffect(() => {
        fetch(`${apiurl}/api/t_and_c_for_client/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTandC(data.data[0]);
                console.log(data.data[0]);
            })
            .catch((error) =>
                console.error("Error fetching job posts:", error),
            );
    }, [token]);

    const handleSubmit = () => {
        if (accepted) {
            navigate("/client/new_job_post/terms_and_conditions/post_job");
        } else {
            setError("Accept Terms and conditions");
        }
    };

    return (
        <Main>
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-5">
                {error && <p className="text-red-500">{error}</p>}
                <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
                <div className="bg-white p-4 rounded shadow mb-4">
                    {TandC && (
                        <pre
                            className="w-full whitespace-pre-wrap text-justify font-sans text-sm text-gray-700"
                            id="TermsAndConditions"
                        >
                            {TandC.terms_and_conditions}
                        </pre>
                    )}
                </div>

                <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={handleAcceptance}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                            I accept the terms and conditions.
                        </span>
                    </label>
                </div>

                <div className="flex flex-row-reverse justify-between items-center gap-4">
                    {open && accepted ? (
                        <JobPostForm onBack={handleBack} />
                    ) : (
                        <Button
                            type="primary"
                            onClick={() => {
                                handleSubmit();
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Submit
                        </Button>
                    )}
                    <div className="flex gap-4">
                        <Button
                            danger
                            disabled={accepted}
                            onClick={handleNegotiate}
                        >
                            Negotiate with the manager
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => navigate(-1)}
                            className="bg-gray-500 hover:bg-gray-600"
                        >
                            Back
                        </Button>
                    </div>
                </div>

                {showNegotiate && (
                    <div className="mt-4 flex flex-col gap-2">
                        <Input.TextArea
                            rows={4}
                            value={negotiationText}
                            onChange={(e) => setNegotiationText(e.target.value)}
                            placeholder="Enter your negotiation text here"
                            className="w-full"
                        />
                        <Button
                            type="primary"
                            onClick={handleNegotiationSubmit}
                            loading={loading}
                            className="self-end bg-blue-600 hover:bg-blue-700"
                        >
                            Submit Negotiation
                        </Button>
                    </div>
                )}
            </div>
        </Main>
    );
};

export default TermsAndConditions;
