import React, { useEffect, useState, useRef, useMemo } from "react";
import CustomDatePicker from "../../../common/CustomDatePicker";
import "react-quill/dist/quill.snow.css";

import {
    Select,
    Button,
    InputNumber,
    Input,
    Radio,
    Slider,
    message,
} from "antd";

import { useForm, Controller, useWatch } from "react-hook-form";

import dayjs from "dayjs";
import {
    FlagFilled,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import PrimarySkills from "./PrimarySkills";
import SecondarySkills from "./SecondarySkills";
import { useAuth } from "../../../common/useAuth";
import jobDetailsicon from "./../../../../images/Client/CreateJob/Jobdetails.svg";
import jobDescriptionicon from "./../../../../images/Client/CreateJob/Jobdescription.svg";
import additionalInformationicon from "./../../../../images/Client/CreateJob/Additionalnformation.svg";
import ReactQuill from "react-quill";
import Locations from "./Locations";
import debounce from "lodash/debounce";
import { useCallback } from "react";
import isEqual from "lodash/isEqual";
import DescriptionFileUpload from "./DescriptionFileUpload";
import locationsList from "../../../common/locations";

const FillJobDetails = ({
    setCurrentStep,
    formValues,
    setFormValues,
    termsData,
    locationData,
    primarySkills,
    secondarySkills,
    setPrimarySkills,
    setSecondarySkills,
    setLocationData,
    connectionId,
}) => {
    const { control, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: formValues,
    });

    const { apiurl, token } = useAuth();
    const { Option } = Select;

    const prevFormValues = useRef(null);

    const [allJobs, setAllJobs] = useState([]);
    const [resetPrimary, setResetPrimary] = useState(false);
    const [resetSecondary, setResetSecondary] = useState(false);
    const [resetLocation, setResetLocation] = useState(false);

    const jobLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];

    const jobTypeItems = [
        "Full Time",
        "Part Time",
        "Intern",
        "Consultant",
        "Freelance",
    ];

    const internTimePeriod = [
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "1 Year",
    ];

    const listOfVisa = [
        "H1 Visa",
        "L1 Visa",
        "TN Permit Holder",
        "Green Card Holder",
        "US Citizen",
        "Authorized to work in US",
        "Not Required",
    ];

    const passport_availability_options = ["Required", "Not Required"];

    const probationPeriodItems = [
        "None",
        "1 Month",
        "2 Months",
        "3 Months",
        "4 Months",
        "5 Months",
        "6 Months",
        "7 Months",
        "8 Months",
        "9 Months",
        "10 Months",
        "11 Months",
        "1 Year",
        "1 and half Year",
        "2 Years",
    ];

    const probationTypeOptions = ["Paid", "Unpaid"];

    const calculateServiceFee = (minVal, maxVal, termsData) => {
        if (!termsData || !Array.isArray(termsData)) return null;

        const parsedRules = termsData.map((r) => {
            // Remove LPA and any whitespace, then split by either hyphen or comma
            const parts = r.ctc_range
                .replace(/LPA/gi, "")
                .replace(/\s+/g, "")
                .split(/[-|,]/);

            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);

            return { ...r, min, max };
        });

        const matchingRules = parsedRules.filter(
            (rule) =>
                !isNaN(rule.min) &&
                !isNaN(rule.max) &&
                maxVal >= rule.min &&
                maxVal <= rule.max,
        );

        if (matchingRules.length === 0) return null;

        matchingRules.sort((a, b) => {
            if (a.is_negotiated === b.is_negotiated) {
                return a.max - b.max;
            }
            return b.is_negotiated - a.is_negotiated;
        });

        return matchingRules[0]?.service_fee ?? null;
    };

    const fetchParticularJob = async (id) => {
        try {
            const response = await fetch(
                `${apiurl}/client/job-postings/?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }

            const jobDetails = data;

            const formattedValues = {
                description_file: jobDetails.description_file || null,
                job_title: jobDetails.job_title || "",
                job_type: jobDetails.job_type || "",
                industry: jobDetails.industry || "",
                job_department: jobDetails.job_department || "",
                job_level: jobDetails.job_level || "",
                job_description: jobDetails.job_description || "",
                ctc: jobDetails.ctc || "",
                notice_period: jobDetails.notice_period || "",
                notice_time: jobDetails.notice_time || "",
                qualifications: jobDetails.qualifications || "",
                languages: jobDetails.languages || "",
                working_days_per_week: jobDetails.working_days_per_week || 5,
                timings: jobDetails.timings || "",
                visa_status: jobDetails.visa_status || "",
                gender: jobDetails.gender || "",
                differently_abled: jobDetails.differently_abled || "",
                bond: jobDetails.bond || "",
                other_benefits: jobDetails.other_benefits || "",
                passport_availability: jobDetails.passport_availability || "",
                decision_maker: jobDetails.decision_maker || "",
                decision_maker_email: jobDetails.decision_maker_email || "",
                age: jobDetails.age || "",
                rotational_shift: jobDetails.rotational_shift || false,

                probation_period: jobDetails.probation_period || "",
                probation_type: jobDetails.probation_type || "",
                years_of_experience: jobDetails.years_of_experience || "",
                time_period: jobDetails.time_period || "",
            };

            setPrimarySkills(jobDetails.primary_skills);
            setSecondarySkills(jobDetails.secondary_skills);
            setLocationData(jobDetails.locations);
            setResetPrimary(true);
            setResetSecondary(true);
            setResetLocation(true);

            reset(formattedValues);

            setFormValues((prev) => ({
                ...prev,
                ...formattedValues,
            }));
        } catch (e) {
            console.error(e);
            message.error("Failed to fetch job details");
        }
    };

    const fetchPrevJobs = async () => {
        try {
            const response = await fetch(
                `${apiurl}/client/job-postings/?only_titles=${true}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            if (data.error) {
                message.error(data.error);
                return;
            }
            setAllJobs(data || []);
        } catch (e) {
            console.error(e);
            message.error(e);
        }
    };

    const handleNextStepSubmit = async (values) => {
        // console.log(values);
        // Validation for location
        if (!locationData || locationData.length === 0) {
            message.error("Please select at least one location.");
            return;
        }
        setFormValues((prev) => ({ ...prev, ...values }));
        setCurrentStep(4);
        // fetchInterviewers();
    };

    const lastSavedRef = useRef(formValues);

    const allValues = useWatch({ control });

    useEffect(() => {
        let parsedYears = [null, null];
        let parsedCTC = [null, null];
        try {
            const val =
                typeof formValues.years_of_experience === "string"
                    ? JSON.parse(formValues.years_of_experience)
                    : formValues.years_of_experience;

            if (Array.isArray(val) && val.length === 2) {
                parsedYears = val;
            }
        } catch (e) {}

        try {
            const val2 =
                typeof formValues.ctc === "string"
                    ? JSON.parse(formValues.ctc)
                    : formValues.ctc;
            if (Array.isArray(val2) && val2.length === 2) {
                parsedCTC = val2;
            }
        } catch (e) {}
        const { description_file, ...rest } = formValues;
        const newValues = {
            ...rest,
            years_of_experience: parsedYears,
            ctc: parsedCTC,
        };
        if (!isEqual(prevFormValues.current, newValues)) {
            reset(newValues);
            prevFormValues.current = newValues;
        }
    }, [formValues, reset]);

    const saveDraft = useCallback(
        debounce(async (current) => {
            const delta = {};
            Object.keys(current).forEach((k) => {
                if (current[k] !== lastSavedRef.current[k]) {
                    delta[k] = current[k];
                }
            });
            if (Object.keys(delta).length === 0) return;
            try {
                const response = await fetch(
                    `${apiurl}/client/save-job-draft/?connection_id=${connectionId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(delta),
                    },
                );
                const data = await response.json();

                if (data.message) {
                    lastSavedRef.current = {
                        ...lastSavedRef.current,
                        ...delta,
                    };
                }
            } catch (err) {
                console.error("Draft save failed", err);
            }
        }, 2000),
        [apiurl, token, connectionId],
    );

    useEffect(() => {
        if (allValues) {
            saveDraft(allValues);
        }
    }, [allValues, saveDraft]);

    const computedServiceFee = useMemo(() => {
        const ctcValue = allValues?.ctc;
        if (!Array.isArray(ctcValue) || ctcValue.length < 2) return undefined;
        const [min, max] = ctcValue;
        if (min === null || max === null || isNaN(min) || isNaN(max))
            return undefined;
        return calculateServiceFee(min, max, termsData);
    }, [allValues?.ctc, termsData]);

    useEffect(() => {
        fetchPrevJobs();
    }, []);

    // Helper classes for Tailwind
    const labelClass = "text-[#424955] text-sm font-semibold pt-2.5 block";
    const sectionClass =
        "mt-4 pt-1.5 rounded-xl border border-[#BCC1CA] bg-white shadow-sm";
    const headerClass =
        "flex gap-2.5 justify-start pl-2.5 text-lg text-[#171A1F] font-semibold items-center";
    const headerClassNormal =
        "flex gap-2.5 justify-start pl-2.5 text-lg text-[#171A1F] font-normal items-center";
    const formItemsClass = "ml-[50px] pr-2.5 flex flex-col gap-2.5 pb-4";
    const optionalClass = "text-xs font-semibold text-[#424955] ml-1";

    const handleJDParse = (data) => {
        if (!data) return;

        // --- Helper: Fuzzy Match ---
        const findMatch = (value, options) => {
            if (!value) return "";
            const lowerVal = value.toLowerCase();
            return (
                options.find((opt) => opt.toLowerCase() === lowerVal) ||
                options.find((opt) => opt.toLowerCase().includes(lowerVal)) ||
                options.find((opt) => lowerVal.includes(opt.toLowerCase())) ||
                ""
            );
        };

        // 1. Text Fields
        if (data.job_title) setValue("job_title", data.job_title);
        if (data.job_description)
            setValue("job_description", data.job_description);
        if (data.industry) setValue("industry", data.industry);
        if (data.job_department)
            setValue("job_department", data.job_department);
        if (data.working_days_per_week)
            setValue("working_days_per_week", data.working_days_per_week);
        if (data.languages) setValue("languages", data.languages);
        if (data.bond) setValue("bond", data.bond);
        if (data.age) setValue("age", data.age);
        if (data.decision_maker)
            setValue("decision_maker", data.decision_maker);
        if (data.decision_maker_email)
            setValue("decision_maker_email", data.decision_maker_email);
        if (data.other_benefits)
            setValue("other_benefits", data.other_benefits);
        if (data.time_period) setValue("time_period", data.time_period);

        if (data.rotational_shift) {
            const val = String(data.rotational_shift).toLowerCase();
            if (val === "yes" || val === "true") {
                setValue("rotational_shift", true);
            } else {
                setValue("rotational_shift", false);
            }
        }

        // Optional/Dropdown Fields
        if (data.timings) setValue("timings", data.timings);

        if (data.gender) {
            const match = findMatch(data.gender, [
                "Male",
                "Female",
                "Transgender",
                "No Mention",
                "Both Male and Female",
            ]);
            if (match) setValue("gender", match);
        }

        if (data.differently_abled) {
            const match = findMatch(data.differently_abled, ["Yes", "No"]);
            if (match) setValue("differently_abled", match);
        }

        if (data.visa_status) setValue("visa_status", data.visa_status);
        if (data.passport_availability)
            setValue("passport_availability", data.passport_availability);

        // Probation
        if (data.probation_period) {
            const match = findMatch(
                data.probation_period,
                probationPeriodItems,
            );
            if (match) setValue("probation_period", match);
        }
        if (data.probation_type) {
            const match = findMatch(data.probation_type, probationTypeOptions);
            if (match) setValue("probation_type", match);
        }

        // Qualifications Mapping
        if (data.qualifications) {
            const qual = data.qualifications.toLowerCase();
            let matchedQual = "";
            if (
                qual.includes("b.tech") ||
                qual.includes("bachelor") ||
                qual.includes("degree") ||
                qual.includes("bca") ||
                qual.includes("bsc")
            ) {
                matchedQual = "UG";
            } else if (
                qual.includes("m.tech") ||
                qual.includes("master") ||
                qual.includes("mba") ||
                qual.includes("mca") ||
                qual.includes("msc")
            ) {
                matchedQual = "PG";
            } else if (qual.includes("phd") || qual.includes("doctorate")) {
                matchedQual = "Doctorate";
            } else if (qual.includes("diploma")) {
                matchedQual = "Diploma";
            } else if (qual.includes("12th") || qual.includes("intermediate")) {
                matchedQual = "Intermediate";
            }

            if (matchedQual) setValue("qualifications", matchedQual);
        }

        // 2. Dropdowns Normalization

        // Job Type
        if (data.job_type) {
            const match = findMatch(data.job_type, jobTypeItems);
            // Additional mapping for common terms
            if (!match) {
                if (data.job_type.match(/contract/i))
                    setValue("job_type", "Consultant");
                else if (data.job_type.match(/permanent/i))
                    setValue("job_type", "Full Time");
                else if (data.job_type.match(/intern/i))
                    setValue("job_type", "Intern");
            } else {
                setValue("job_type", match);
            }
        }

        // Job Level
        if (data.job_level) {
            const match = findMatch(data.job_level, jobLevels);
            if (match) setValue("job_level", match);
        }

        // Notice Period & Time
        if (data.notice_period) {
            const np = data.notice_period.toLowerCase();
            if (np.includes("immediate") || np.includes("0 days")) {
                setValue("notice_period", "immediate_joining");
            } else if (np.includes("serving")) {
                setValue("notice_period", "serving_notice");
            } else {
                // Assume "need_to_serve_notice" and try to parse days
                setValue("notice_period", "need_to_serve_notice");

                // Extract number
                const daysMatch = np.match(/(\d+)/);
                if (daysMatch) {
                    const num = parseInt(daysMatch[1]);
                    // Map to closest option: 15, 30, 45, 2M (60), 6M (180)
                    if (num <= 20) setValue("notice_time", "15 Days");
                    else if (num <= 40) setValue("notice_time", "30 Days");
                    else if (num <= 50) setValue("notice_time", "45 Days");
                    else if (num <= 90) setValue("notice_time", "2 Months");
                    else setValue("notice_time", "6 Months");
                }
            }
        }

        // 3. Complex Fields (Arrays)

        // CTC: "12-15 LPA" -> [12, 15]
        if (data.ctc) {
            const numbers = data.ctc.match(/(\d+(\.\d+)?)/g);
            if (numbers && numbers.length >= 2) {
                setValue("ctc", [
                    parseFloat(numbers[0]),
                    parseFloat(numbers[1]),
                ]);
            } else if (numbers && numbers.length === 1) {
                setValue("ctc", [
                    parseFloat(numbers[0]),
                    parseFloat(numbers[0]),
                ]);
            }
        }

        // Years of Experience: "3-5 years" -> [3, 5]
        if (data.years_of_experience) {
            const numbers = data.years_of_experience.match(/(\d+(\.\d+)?)/g);
            if (numbers && numbers.length >= 2) {
                setValue("years_of_experience", [
                    parseFloat(numbers[0]),
                    parseFloat(numbers[1]),
                ]);
            } else if (numbers && numbers.length === 1) {
                setValue("years_of_experience", [
                    parseFloat(numbers[0]),
                    parseFloat(numbers[0]),
                ]);
            }
        }

        // 4. Skills Parsing
        if (data.skills) {
            message.info(
                "Skills extracted. Rate the required skills accordingly.",
            );
            // Split comma separated or newline separated
            const skillList = data.skills
                .split(/,|\n/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            const formattedSkills = skillList.map((skill) => ({
                skill_name: skill,
                metric_type: "rating", // Default
                metric_value: "5/10", // Default
            }));

            if (formattedSkills.length > 0) {
                setPrimarySkills(formattedSkills);
                setResetPrimary(true);
            }
        }

        // 5. Locations Parsing
        if (data.location) {
            const locList = data.location
                .split(/,|\n|and/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

            const formattedLocs = locList.map((loc) => {
                // Try to find a match in locationsList (e.g., "Bangalore" -> "Bangalore (560001)")
                const match = locationsList.find((l) =>
                    l.toLowerCase().includes(loc.toLowerCase()),
                );
                return {
                    location: match || loc,
                    job_type: "office", // Default
                    positions: 1,
                };
            });

            if (formattedLocs.length > 0) {
                setLocationData(formattedLocs);
                setResetLocation(true);
            }
        }
    };

    return (
        <div className="m-4">
            <label
                className={labelClass}
                style={{
                    marginBottom: "8px",
                }}
            >
                Fill From previous jobs
            </label>
            <Select
                placeholder="Select the job"
                style={{ width: "100%" }}
                onChange={(value) => {
                    fetchParticularJob(value);
                }}
            >
                {allJobs &&
                    allJobs?.length > 0 &&
                    allJobs?.map((item, index) => (
                        <Option key={item.job_id} value={item.job_id}>
                            {item.job_title}
                        </Option>
                    ))}
            </Select>
            <form onSubmit={handleSubmit(handleNextStepSubmit)}>
                {/* Job Details Section */}
                <div className={sectionClass}>
                    <div className={headerClass}>
                        <img src={jobDetailsicon} alt="" className="h-[30px]" />
                        Job Details
                    </div>
                    <div className={formItemsClass}>
                        <DescriptionFileUpload
                            control={control}
                            onJDParse={handleJDParse}
                        />
                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Job Title{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="job_title"
                                control={control}
                                rules={{ required: "Please enter job title" }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                        {error && (
                                            <p style={{ color: "red" }}>
                                                {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Job Department{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="job_department"
                                control={control}
                                rules={{
                                    required:
                                        "Please enter job job description",
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                        {error && (
                                            <p style={{ color: "red" }}>
                                                {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Notice Period{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="notice_period"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            <Option
                                                key="serving_notice"
                                                value="serving_notice"
                                            >
                                                Serving notice
                                            </Option>
                                            <Option
                                                key="need_to_serve_notice"
                                                value="need_to_serve_notice"
                                            >
                                                Need to serve notice
                                            </Option>
                                            <Option
                                                key="immediate_joining"
                                                value="immediate_joining"
                                            >
                                                Immediate Joining
                                            </Option>
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {(watch("notice_period") === "need_to_serve_notice" ||
                            watch("notice_period") === "serving_notice") && (
                            <div className="mb-4">
                                <label className={labelClass}>
                                    Notice Time Period{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </label>

                                <Controller
                                    name="notice_time"
                                    control={control}
                                    rules={{ required: "Select a time period" }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <Select
                                                {...field}
                                                className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                            >
                                                <Option value="15 Days">
                                                    15 Days
                                                </Option>
                                                <Option value="30 Days">
                                                    30 Days
                                                </Option>
                                                <Option value="45 Days">
                                                    45 Days
                                                </Option>
                                                <Option value="2 Months">
                                                    2 Months
                                                </Option>
                                                <Option value="6 Months">
                                                    6 Months
                                                </Option>
                                            </Select>

                                            {fieldState.error && (
                                                <p style={{ color: "red" }}>
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Job Level{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="job_level"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            {jobLevels.map((level) => (
                                                <Option
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </Option>
                                            ))}
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="job_type">
                                Job Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="job_type"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            {jobTypeItems.map((val) => (
                                                <Option value={val} key={val}>
                                                    {val}
                                                </Option>
                                            ))}
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {watch("job_type") === "Full Time" && (
                            <>
                                <div className="mb-4">
                                    <label className={labelClass} htmlFor="">
                                        Probation Period{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Controller
                                        name="probation_period"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                                >
                                                    {probationPeriodItems.map(
                                                        (val) => (
                                                            <Option
                                                                value={val}
                                                                key={val}
                                                            >
                                                                {val}
                                                            </Option>
                                                        ),
                                                    )}
                                                </Select>
                                                {fieldState.error && (
                                                    <p style={{ color: "red" }}>
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className={labelClass} htmlFor="">
                                        Probation Type{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Controller
                                        name="probation_type"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                                >
                                                    {probationTypeOptions.map(
                                                        (val) => (
                                                            <Option
                                                                value={val}
                                                                key={val}
                                                            >
                                                                {val}
                                                            </Option>
                                                        ),
                                                    )}
                                                </Select>
                                                {fieldState.error && (
                                                    <p style={{ color: "red" }}>
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {watch("job_type") === "Intern" && (
                            <>
                                <div className="mb-4">
                                    <label className={labelClass} htmlFor="">
                                        Intern Time Period{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Controller
                                        name="time_period"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                                >
                                                    {internTimePeriod.map(
                                                        (val) => (
                                                            <Option
                                                                value={val}
                                                                key={val}
                                                            >
                                                                {val}
                                                            </Option>
                                                        ),
                                                    )}
                                                </Select>
                                                {fieldState.error && (
                                                    <p style={{ color: "red" }}>
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {watch("job_type") === "Consultant" && (
                            <>
                                <div className="mb-4">
                                    <label className={labelClass}>
                                        Consultant Time Period{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Controller
                                        name="time_period"
                                        control={control}
                                        rules={{
                                            required:
                                                "Please select the consultant time period",
                                        }}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Slider
                                                    {...field}
                                                    min={0}
                                                    max={20}
                                                    value={field.value || 0}
                                                    onChange={(value) =>
                                                        field.onChange(value)
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p style={{ color: "red" }}>
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                    <p className="text-sm font-normal text-[#171A1F]">
                                        {watch("time_period") || 0} years
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="mb-4 flex gap-5 items-center">
                            <div>
                                <label className={labelClass}>
                                    CTC Range (LPA){" "}
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Controller
                                    name="ctc"
                                    control={control}
                                    rules={{
                                        required: "CTC range is required",
                                        validate: (value) => {
                                            const [min, max] = Array.isArray(
                                                value,
                                            )
                                                ? value
                                                : [null, null];
                                            if (min == null || max == null)
                                                return "Both Min and Max CTC are required";
                                            return (
                                                min <= max ||
                                                "Min CTC should be less than or equal to Max CTC"
                                            );
                                        },
                                    }}
                                    render={({ field, fieldState }) => {
                                        let ctcRange = [null, null];

                                        try {
                                            const val =
                                                typeof field.value === "string"
                                                    ? JSON.parse(
                                                          field.value.replace(
                                                              /\s+/g,
                                                              "",
                                                          ),
                                                      )
                                                    : field.value;

                                            if (
                                                Array.isArray(val) &&
                                                val.length === 2
                                            ) {
                                                ctcRange = val;
                                            }
                                        } catch (e) {
                                            // fallback stays [null, null]
                                        }

                                        const [min, max] = ctcRange;

                                        const handleMinChange = (minVal) => {
                                            field.onChange([minVal, max]);
                                        };

                                        const handleMaxChange = (maxVal) => {
                                            field.onChange([min, maxVal]);
                                        };

                                        return (
                                            <>
                                                <div className="flex flex-col md:flex-row gap-2.5">
                                                    <InputNumber
                                                        value={min}
                                                        onChange={
                                                            handleMinChange
                                                        }
                                                        min={1}
                                                        placeholder="Min CTC"
                                                        className="w-full"
                                                    />
                                                    <span className="self-center">
                                                        to
                                                    </span>
                                                    <InputNumber
                                                        value={max}
                                                        onChange={
                                                            handleMaxChange
                                                        }
                                                        min={min || 1}
                                                        placeholder="Max CTC"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div
                                                    className="text-sm font-normal text-[#171A1F]"
                                                    style={{
                                                        marginTop: "5px",
                                                        color: "orange",
                                                    }}
                                                >
                                                    <strong>
                                                        Selected CTC:{" "}
                                                    </strong>
                                                    {min} LPA - {max} LPA
                                                </div>
                                                {fieldState.error && (
                                                    <p style={{ color: "red" }}>
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </div>
                            {computedServiceFee !== undefined &&
                                (computedServiceFee !== null ? (
                                    <div
                                        style={{
                                            marginTop: "5px",
                                            color: "green",
                                        }}
                                    >
                                        CTC with in range
                                        
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            marginTop: "5px",
                                            color: "red",
                                        }}
                                    >
                                        CTC out of range
                                    </div>
                                ))}
                        </div>

                        <div className="mb-4">
                            <Controller
                                name="years_of_experience"
                                control={control}
                                defaultValue={[null, null]}
                                rules={{
                                    required:
                                        "Please select the years of experience",
                                    validate: (value) => {
                                        const [min, max] = Array.isArray(value)
                                            ? value
                                            : [null, null];
                                        if (min == null || max == null)
                                            return "Both Min and Max are required";
                                        return (
                                            min <= max ||
                                            "Min should be less than or equal to Max"
                                        );
                                    },
                                }}
                                render={({ field, fieldState }) => {
                                    let parsed = [null, null];

                                    if (Array.isArray(field.value)) {
                                        parsed = field.value;
                                    } else if (
                                        typeof field.value === "string"
                                    ) {
                                        try {
                                            const cleaned = field.value.replace(
                                                /\s+/g,
                                                "",
                                            );
                                            const tempParsed =
                                                JSON.parse(cleaned);
                                            if (Array.isArray(tempParsed)) {
                                                parsed = tempParsed;
                                            }
                                        } catch (e) {
                                            // parsing failed; use default [null, null]
                                        }
                                    }

                                    const [min, max] = parsed;

                                    const handleMinChange = (minVal) => {
                                        field.onChange([minVal, max]);
                                    };

                                    const handleMaxChange = (maxVal) => {
                                        field.onChange([min, maxVal]);
                                    };

                                    return (
                                        <>
                                            <label className={labelClass}>
                                                Years of Experience{" "}
                                                <span style={{ color: "red" }}>
                                                    *
                                                </span>
                                            </label>
                                            <div className="flex flex-col md:flex-row gap-2.5 items-center">
                                                <InputNumber
                                                    min={0}
                                                    max={max ?? 50}
                                                    step={1}
                                                    value={min}
                                                    onChange={handleMinChange}
                                                    placeholder="Min years"
                                                    className="w-full"
                                                />
                                                <span className="self-center">
                                                    to
                                                </span>
                                                <InputNumber
                                                    min={min ?? 0}
                                                    max={50}
                                                    step={1}
                                                    value={max}
                                                    onChange={handleMaxChange}
                                                    placeholder="Max years"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div
                                                className="text-sm font-normal text-[#171A1F]"
                                                style={{
                                                    marginTop: "5px",
                                                    color: "orange",
                                                }}
                                            >
                                                <strong>
                                                    Selected Years of
                                                    Experience:{" "}
                                                </strong>
                                                {min} - {max} Years
                                            </div>

                                            {fieldState.error && (
                                                <p style={{ color: "red" }}>
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Job Description Section */}
                <div className={sectionClass}>
                    <div className={headerClassNormal}>
                        <img
                            src={jobDescriptionicon}
                            alt=""
                            className="h-[30px]"
                        />
                        Job Description
                    </div>
                    <div className={formItemsClass}>
                        <div className="mb-4">
                            <label className={labelClass}>
                                Job Description{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="job_description"
                                control={control}
                                rules={{
                                    required: "Please enter job description",
                                }}
                                render={({ field, fieldState }) => (
                                    <div className="react-quill">
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                            <div className="mb-4" style={{ marginTop: "10px" }}>
                                <PrimarySkills
                                    primarySkills={primarySkills}
                                    setPrimarySkills={setPrimarySkills}
                                    connectionId={connectionId}
                                    resetPrimary={resetPrimary}
                                    setResetPrimary={setResetPrimary}
                                ></PrimarySkills>
                            </div>
                            <div className="mb-4" style={{ marginTop: "10px" }}>
                                <SecondarySkills
                                    secondarySkills={secondarySkills}
                                    setSecondarySkills={setSecondarySkills}
                                    connectionId={connectionId}
                                    resetSecondary={resetSecondary}
                                    setResetSecondary={setResetSecondary}
                                ></SecondarySkills>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className={sectionClass}>
                    <div className={headerClassNormal}>
                        <img
                            src={additionalInformationicon}
                            alt=""
                            className="h-[30px]"
                        />
                        Additional Information
                    </div>
                    <div className={formItemsClass}>
                        <div className="mb-4">
                            <Locations
                                locationData={locationData}
                                setLocationData={setLocationData}
                                connectionId={connectionId}
                                resetLocation={resetLocation}
                                setResetLocation={setResetLocation}
                            ></Locations>
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Timings <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                control={control}
                                name="timings"
                                rules={{
                                    required:
                                        "Please select the timings of the candidate",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            <Option
                                                key="Day Shift"
                                                value="Morning Shift (7AM to 3PM)"
                                            >
                                                First Shift (7AM to 3PM)
                                            </Option>
                                            <Option
                                                key="Day Shift"
                                                value="Day Shift (9AM to 6PM)"
                                            >
                                                Day Shift (9AM to 6PM)
                                            </Option>
                                            <Option
                                                key="Afternoon Shift"
                                                value="Afternoon Shift (12PM to 9PM)"
                                            >
                                                Afternoon Shift (12PM to 9PM)
                                            </Option>
                                            <Option
                                                key="Night Shift"
                                                value="Night Shift (9PM to 6AM)"
                                            >
                                                Night Shift (9PM to 6AM)
                                            </Option>
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Industry <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="industry"
                                control={control}
                                rules={{
                                    required: "Please enter the industry",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Bond{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="bond"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Age Limit{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            placeholder="eg: 15-20yrs"
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Decision Maker{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="decision_maker"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Decision Maker Email{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="decision_maker_email"
                                control={control}
                                rules={{ type: "email" }}
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Other benefits{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="other_benefits"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Input.TextArea
                                            rows={3}
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass}>
                                Languages{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="languages"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input.TextArea
                                            rows={3}
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal"
                                        />
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Qualifications{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                control={control}
                                name="qualifications"
                                className="w-full"
                                rules={{
                                    require:
                                        "Please select the qualifications required",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            <Option
                                                key="Doctorate"
                                                value="Doctorate"
                                            >
                                                Doctorate
                                            </Option>
                                            <Option key="UG" value="UG">
                                                Under Graduate
                                            </Option>
                                            <Option key="PG" value="PG">
                                                Post Graduate
                                            </Option>
                                            <Option
                                                key="Diploma"
                                                value="Diploma"
                                            >
                                                Diploma
                                            </Option>
                                            <Option
                                                key="Intermediate"
                                                value="Intermediate"
                                            >
                                                Intermediate
                                            </Option>
                                            <Option
                                                key="6th-10th"
                                                value="6th-10th"
                                            >
                                                6th-10th
                                            </Option>
                                            <Option
                                                key="1st-5th"
                                                value="1st-5th"
                                            >
                                                1st-5th
                                            </Option>
                                            <Option
                                                key="Uneducated"
                                                value="Uneducated"
                                            >
                                                Uneducated
                                            </Option>
                                        </Select>
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Gender Preferences{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            <Option key="Male" value="Male">
                                                Male
                                            </Option>
                                            <Option key="Female" value="Female">
                                                Female
                                            </Option>
                                            <Option
                                                key="Transgender"
                                                value="Transgender"
                                            >
                                                Transgender
                                            </Option>
                                            <Option
                                                key="No Mention"
                                                value="No Mention"
                                            >
                                                No Mention
                                            </Option>
                                            <Option
                                                key="Both Male and Female"
                                                value="Both Male and Female"
                                            >
                                                Both Male and Female
                                            </Option>
                                        </Select>
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label className={labelClass} htmlFor="">
                                Differently Abled Preferences{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>{" "}
                            </label>
                            <Controller
                                control={control}
                                name="differently_abled"
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            className="mt-1.5 rounded-md text-[#171A1F] text-sm font-normal w-full"
                                        >
                                            <Option key="Yes" value="Yes">
                                                Yes (Only for differently abled)
                                            </Option>
                                            <Option key="No" value="No">
                                                No
                                            </Option>
                                            <Option
                                                key="No Mention"
                                                value="No Mention"
                                            >
                                                No Mention
                                            </Option>
                                        </Select>
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className={labelClass}
                                style={{ marginRight: "20px" }}
                            >
                                Visa Status{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>{" "}
                            </label>
                            <Controller
                                name="visa_status"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Radio.Group {...field}>
                                            {listOfVisa.map((val, index) => (
                                                <Radio
                                                    key={index}
                                                    value={val}
                                                    onClick={() => {
                                                        if (
                                                            field.value === val
                                                        ) {
                                                            field.onChange(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {val}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className={labelClass}
                                style={{ marginRight: "20px" }}
                            >
                                Passport Availability{" "}
                                <span className={optionalClass}>
                                    (Optional)
                                </span>
                            </label>
                            <Controller
                                name="passport_availability"
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group {...field}>
                                        {passport_availability_options.map(
                                            (val, index) => (
                                                <Radio
                                                    key={index}
                                                    value={val}
                                                    onClick={() => {
                                                        if (
                                                            field.value === val
                                                        ) {
                                                            field.onChange(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {val}
                                                </Radio>
                                            ),
                                        )}
                                    </Radio.Group>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className={labelClass}
                                style={{ marginRight: "20px" }}
                            >
                                Rotational Shift{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="rotational_shift"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Radio.Group
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === "true",
                                                )
                                            }
                                            value={field.value?.toString()}
                                        >
                                            <Radio
                                                value="true"
                                                onClick={() => {
                                                    if (field.value === true) {
                                                        field.onChange(null);
                                                    }
                                                }}
                                            >
                                                Yes
                                            </Radio>
                                            <Radio
                                                value="false"
                                                onClick={() => {
                                                    if (field.value === false) {
                                                        field.onChange(null);
                                                    }
                                                }}
                                            >
                                                No
                                            </Radio>
                                        </Radio.Group>

                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                className={labelClass}
                                style={{ marginRight: "20px" }}
                            >
                                Working Days Per Week{" "}
                                <span style={{ color: "red" }}>*</span>{" "}
                            </label>
                            <Controller
                                name="working_days_per_week"
                                control={control}
                                rules={{
                                    required:
                                        "Please enter the number of working days",
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputNumber
                                            {...field}
                                            className="w-full"
                                            min={1}
                                            max={7}
                                        />
                                        {fieldState.error && (
                                            <p style={{ color: "red" }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="mb-4" style={{ marginBottom: "10px" }}>
                            <label className={labelClass} htmlFor="">
                                Job close Deadline{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Controller
                                name="job_close_duration"
                                control={control}
                                rules={{
                                    required:
                                        "Please select the last day to submit the posts",
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <CustomDatePicker
                                            {...field}
                                            defaultValue={
                                                field.value
                                                    ? dayjs.isDayjs(field.value)
                                                        ? field.value
                                                        : dayjs(field.value)
                                                    : null
                                            }
                                            onChange={(date) => {
                                                const formatted = date
                                                    ? dayjs(date).format(
                                                          "YYYY-MM-DD",
                                                      )
                                                    : null;
                                                field.onChange(formatted);
                                            }}
                                            disabledDate={(current) =>
                                                current &&
                                                current.isBefore(dayjs(), "day")
                                            }
                                            format="YYYY-MM-DD"
                                            startDate={new Date()}
                                        />
                                        {error && (
                                            <p style={{ color: "red" }}>
                                                {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center w-1/2 mt-[15px] pb-5 mx-[30px]">
                    <Button type="primary" onClick={() => setCurrentStep(2)}>
                        Previous
                    </Button>
                    <Button
                        style={{ marginLeft: 10 }}
                        type="primary"
                        htmlType="submit"
                    >
                        Next Step
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FillJobDetails;
