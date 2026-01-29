import React, { useEffect, useState } from "react";
import { Button, Modal, message, Form, Input, Spin, Select, Table } from "antd";
import { useAuth } from "../../../common/useAuth";
import { useNavigate } from "react-router-dom";
import Terms from "../../../../images/Client/Terms.svg";
import { WarningOutlined } from "@ant-design/icons";

const OrganizationTerms = ({
    setCurrentStep,
    termsData,
    setTermsData,
    connectionId,
    setPrimarySkills,
    setSecondarySkills,
    setLocationData,
    setFormValues,
    setInterviewRounds,
}) => {
    const { token, apiurl } = useAuth();
    const [loading, setLoading] = useState(false);
    const [negotiatedTerms, setNegotiatedTerms] = useState(false);
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [isDraftExists, setIsDraftExists] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [agree, setAgree] = useState(true);
    const [organizationTerms, setOrganizationTerms] = useState([]);
    const serviceFeeType = Form.useWatch("service_fee_type", form);

    const fetchOrganizationTerms = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiurl}/get-organization-terms/?connection_id=${connectionId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setOrganizationTerms(data.data);
            setLoading(false);
            if (data.negotiation_request) {
                setAgree(false);
                setNegotiatedTerms(data.negotiation_request);
            }
            setIsDraftExists(data.isDraftExists);
        } catch (error) {
            message.error(`Failed to fetch terms: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const lastTerm = organizationTerms[organizationTerms.length - 1];

    const columns = [
        {
            title: "CTC Range",
            dataIndex: "ctc_range",
            key: "ctc_range",
        },
        {
            title: "Service Fee",
            dataIndex: "service_fee",
            key: "service_fee",
            render: (value, record) => {
                return record.service_fee_type === "percentage"
                    ? `${value}%`
                    : `₹${value}`;
            },
        },
        {
            title: "Replacement Clause (Days)",
            dataIndex: "replacement_clause",
            key: "replacement_clause",
            render: (value) => `${value} days`,
        },
        {
            title: "Invoice After (Days)",
            dataIndex: "invoice_after",
            key: "invoice_after",
            render: (value) => `${value} days`,
        },
        {
            title: "Payment Within (Days)",
            dataIndex: "payment_within",
            key: "payment_within",
            render: (value) => `${value} days`,
        },
        {
            title: "Interest Percentage (%)",
            dataIndex: "interest_percentage",
            key: "interest_percentage",
            render: (value) => `${value}%`,
        },
    ];

    useEffect(() => {
        if (token) {
            fetchOrganizationTerms();
        }
    }, [token, connectionId]);

    const handleNegotiateTerms = () => {
    if (organizationTerms && organizationTerms.length > 0) {
        const lastTerm =
            organizationTerms[organizationTerms.length - 1];

        form.setFieldsValue({
            ctc_range: lastTerm.ctc_range,
            service_fee_type: lastTerm.service_fee_type,
            service_fee: lastTerm.service_fee,
            replacement_clause: lastTerm.replacement_clause,
            invoice_after: lastTerm.invoice_after,
            payment_within: lastTerm.payment_within,
            interest_percentage: lastTerm.interest_percentage,
        });
    }

    setIsNegotiating(true);
};


    const handleStartNew = async (values) => {
        try {
            const response = await fetch(
                `${apiurl}/client/jobpost/create-new-draft/?connection_id=${connectionId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                setIsDraftExists(false);
                return;
            }
        } catch (e) {
            message.error(e.message || "Failed to continue draft");
        } finally {
            setIsDraftExists(false);
        }
    };

    const ctcRegex = /^\s*\d+(\.\d+)?\s*-\s*\d+(\.\d+)?\s+LPA\s*$/i;

    const extractFormValues = (data) => {
        return {
            job_code: data.jobcode || "",
            description_file: data.description_file || null,
            job_title: data.job_title || "",
            job_department: data.job_department || "",
            job_description: data.job_description || "",
            years_of_experience: data.years_of_experience || "",
            ctc: data.ctc || "",
            job_type: data.job_type || "",
            job_level: data.job_level || "",
            qualifications: data.qualifications || "",
            timings: data.timings || "",
            other_benefits: data.other_benefits || "",
            working_days_per_week: data.working_days_per_week || "",
            notice_time: data.notice_time || "",
            decision_maker: data.decision_maker || "",
            decision_maker_email: data.decision_maker_email || "",
            bond: data.bond || "",
            rotational_shift: data.rotational_shift || false,
            notice_period: data.notice_period || "",
            age: data.age || "",
            gender: data.gender || "",
            industry: data.industry || "",
            differently_abled: data.differently_abled || "",
            languages: data.languages || "",
            visa_status: data.visa_status || "",
            probation_type: data.probation_type || "",
            probation_period: data.probation_period || "",
            time_period: data.time_period || "",
            passport_availability: data.passport_availability || "",
            job_close_duration: data.job_close_duration || null,
        };
    };

    const handleDeleteNegotiation = async () => {
        try {
            const response = await fetch(
                `${apiurl}/client/delete-negotiation/?connection_id=${connectionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error.message);
                return;
            }
            setAgree(true);
        } catch (e) {
            message.error(e);
        } finally {
            setIsDraftExists(false);
        }
    };

    const handleContinueDraft = async (values) => {
        try {
            const response = await fetch(
                `${apiurl}/client/jobpost/continue-draft/?connection_id=${connectionId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error.message);
                setIsDraftExists(false);
                return;
            }
            if (data.data) {
                const draft = data.data;

                const extracted = extractFormValues(draft);
                setFormValues(extracted);

                setPrimarySkills(
                    draft.skill_metrics?.filter((s) => s.is_primary)
                );
                setSecondarySkills(
                    draft.skill_metrics?.filter((s) => !s.is_primary)
                );
                setLocationData(draft.locations || []);
                setTermsData(organizationTerms);
                setInterviewRounds(draft.interviewers || []);

                if (draft.current_step) {
                    setCurrentStep(draft.current_step + 1);
                }
            } else {
                message.error("Send the data to continue the draft");
            }
        } catch (e) {
            message.error(e);
        } finally {
            setIsDraftExists(false);
        }
    };

    const handleNegotiationSubmit = async (values) => {
        try {
            const response = await fetch(
                `${apiurl}/negotiate-terms/?connection_id=${connectionId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || "Failed to create job posting");
            }
            message.success("Negotiation raised successfully!");
            navigate("/");
            setIsNegotiating(false);
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <div>
            <div>
                <div className="mt-5">
                    <h3 className="text-[#71102F] font-semibold text-base flex gap-2.5 items-center">
                        <img src={Terms} alt="" />
                        Terms and conditions
                    </h3>

                    <div className="mt-2.5 rounded-md bg-[#DEEDFF] inline-flex p-2.5 justify-center items-center gap-2.5 text-xs mb-4">
                        <div>
                            {" "}
                            <WarningOutlined />{" "}
                            <span className="text-[#253446] text-xs font-bold">
                                Note :{" "}
                            </span>{" "}
                            Accept these terms and conditions from the
                            organization to create a Job Post
                        </div>
                    </div>

                    {!negotiatedTerms && agree && organizationTerms && (
                        <Table
                            columns={columns}
                            dataSource={organizationTerms}
                            rowKey={(record, index) => index}
                            pagination={false}
                            rowClassName={(record) =>
                                record.is_negotiated ? "bg-[#e6f7ff]" : ""
                            }
                            bordered
                        />
                    )}
                </div>
                {negotiatedTerms && !agree && (
                    <div className="flex flex-col items-center text-center mt-[30px] mb-[10px]">
                        <span className="font-semibold text-lg text-[#171A11F]">
                            Your previous negotiation is not yet accepted by the
                            agency
                        </span>
                        <span className="font-normal text-base text-[#171A1F] mt-2">
                            Do you want to continue with organization terms?
                        </span>
                        <div className="mt-[15px] flex gap-[20px]">
                            <button
                                className="px-5 py-2.5 rounded bg-white border border-gray-300 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleDeleteNegotiation()}
                            >
                                Yes
                            </button>
                            <button
                                className="px-5 py-2.5 rounded border-2 border-[#F45B69] bg-[#F45B691A] text-[#F45B69] cursor-pointer hover:bg-[#F45B6933]"
                                onClick={() => navigate(-1)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )}

                {organizationTerms && (
                    <div className="mt-5 border border-[#DEE1E6] mb-[50px] shadow-[3px_3px_#171A1F1C] p-[10px_15px] rounded-[3px] flex justify-between items-center">
                        <button
                            className="bg-white border-none text-[#9095A0] font-normal text-sm cursor-pointer hover:text-gray-600"
                            onClick={() => {
                                setCurrentStep(1);
                            }}
                        >
                            Back{" "}
                        </button>
                        <div className="flex items-center gap-2.5">
                            <button
                                disabled={organizationTerms?.some(
                                    (r) => r.is_negotiated === true
                                )}
                                style={{
                                    backgroundColor: organizationTerms?.some(
                                        (r) => r.is_negotiated === true
                                    )
                                        ? "#ccc"
                                        : "#fff",
                                    color: organizationTerms?.some(
                                        (r) => r.is_negotiated === true
                                    )
                                        ? "#666"
                                        : "#1681FF",
                                    cursor: organizationTerms?.some(
                                        (r) => r.is_negotiated === true
                                    )
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                                className={`border-2 border-[#1681FF] px-[15px] py-[10px] rounded-md h-[40px] flex items-center justify-center font-bold transition-colors ${
                                    !organizationTerms?.some(
                                        (r) => r.is_negotiated === true
                                    )
                                        ? "hover:bg-blue-50"
                                        : ""
                                }`}
                                onClick={handleNegotiateTerms}
                            >
                                Negotiate
                            </button>
                            <Button
                                className="h-[40px] rounded-[6px]"
                                type="primary"
                                onClick={() => {
                                    setCurrentStep(3);
                                    handleStartNew();
                                    setTermsData(organizationTerms);
                                }}
                            >
                                Agree Terms
                            </Button>
                        </div>
                    </div>
                )}

                <Modal
                    title="Negotiate Terms"
                    open={isNegotiating}
                    onCancel={() => setIsNegotiating(false)}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleNegotiationSubmit}
                    >
                        <Form.Item
                            label="CTC Range"
                            name="ctc_range"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the range of CTC",
                                },
                                {
                                    validator: (_, value) => {
                                        if (!value || ctcRegex.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "CTC must be in the format like 1-10 LPA"
                                            )
                                        );
                                    },
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Service Fee Type"
                            name="service_fee_type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select service fee type",
                                },
                            ]}
                        >
                            <Select placeholder="Select fee type">
                                <Select.Option value="percentage">
                                    Percentage
                                </Select.Option>
                                <Select.Option value="fixed">
                                    Fixed
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Service Fee"
                            name="service_fee"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter service fee",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                suffix={
                                    serviceFeeType === "percentage"
                                        ? "%"
                                        : serviceFeeType === "fixed"
                                        ? "₹"
                                        : ""
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label="Replacement Clause"
                            name="replacement_clause"
                            initialValue={termsData?.replacement_clause}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter replacement clause",
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Invoice After"
                            name="invoice_after"
                            initialValue={termsData?.invoice_after}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter invoice after",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Payment Within"
                            name="payment_within"
                            initialValue={termsData?.payment_within}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter payment within",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Interest Percentage"
                            name="interest_percentage"
                            initialValue={termsData?.interest_percentage}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter interest percentage",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Button type="primary" htmlType="submit">
                            Submit Negotiated Terms
                        </Button>
                    </Form>
                </Modal>

                <Modal
                    title="Draft exists"
                    open={isDraftExists}
                    onCancel={() => setIsDraftExists(false)}
                    footer={null}
                >
                    <div className="text-center p-4">
                        A Draft exists with this company, would you like to
                        continue or start a new one?
                        <div className="flex justify-center gap-4 mt-5">
                            <Button
                                type="primary"
                                onClick={handleContinueDraft}
                            >
                                Continue
                            </Button>
                            <Button danger onClick={handleStartNew}>
                                Start New
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default OrganizationTerms;
