import React, { useEffect, useState, useCallback } from "react";
import { Select, Input, message, Modal } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import debounce from "lodash.debounce";
import { useAuth } from "../../../common/useAuth";
import AddInterviewer from "../Interviewers/AddInterviewer";
import PlusIcon from "../../../../images/Client/plusicon.svg";

const FillIntervieweDetails = ({
    interviewRounds,
    setInterviewRounds,
    connectionId,
}) => {
    const { token, apiurl } = useAuth();
    const [interviewers, setInterviewers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [numRounds, setNumRounds] = useState(interviewRounds?.length || 0);

    const { control, setValue, reset } = useForm({
        defaultValues: {
            rounds: interviewRounds?.length
                ? interviewRounds
                : Array.from({ length: numRounds }, (_, index) => ({
                      round_num: index + 1,
                      name: "",
                      email: "",
                      type_of_interview: "",
                      mode_of_interview: "",
                  })),
        },
    });

    const formValues = useWatch({ control });

    const interviewModes = [
        { value: "face_to_face", label: "Face-to-Face" },
        { value: "online", label: "Online" },
        { value: "telephone", label: "Telephone" },
    ];

    const interviewTypes = [
        { value: "non-technical", label: "Non Tech" },
        { value: "technical", label: "Tech" },
        { value: "assignment", label: "Assignment" },
    ];

    const fetchInterviewers = async () => {
        try {
            const response = await fetch(`${apiurl}/client/get-interviewers/`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!data || data.error) {
                message.error(data?.error || "Failed to fetch interviewers");
                return;
            }
            const formattedData = data.map((item) => ({
                interviewer_name: item.interviewer_name,
                designation: item.designation,
                id: item.id,
            }));
            setInterviewers(formattedData);
        } catch (e) {
            console.error(e);
            message.error("Error fetching interviewers");
        }
    };

    const saveDraftToApi = useCallback(
        debounce(async (rounds) => {
            try {
                await fetch(
                    `${apiurl}/client/save-interview-draft/?connection_id=${connectionId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            interview_rounds: rounds,
                        }),
                    },
                );
            } catch (err) {
                console.error("Draft save failed:", err);
            }
        }, 1000),
        [token, apiurl, connectionId],
    );

    useEffect(() => {
        if (formValues?.rounds) {
            setInterviewRounds(formValues.rounds);
            saveDraftToApi(formValues.rounds);
        }
    }, [formValues, setInterviewRounds, saveDraftToApi]);

    useEffect(() => {
        fetchInterviewers();
    }, []);

    useEffect(() => {
        const existingRounds = interviewRounds?.length ? interviewRounds : [];

        let updatedRounds = [...existingRounds];

        if (numRounds > existingRounds.length) {
            const additionalRounds = Array.from(
                { length: numRounds - existingRounds.length },
                (_, idx) => ({
                    round_num: existingRounds.length + idx + 1,
                    name: "",
                    email: "",
                    type_of_interview: "",
                    mode_of_interview: "",
                    id: "",
                }),
            );
            updatedRounds = [...existingRounds, ...additionalRounds];
        }

        if (numRounds < existingRounds.length) {
            updatedRounds = existingRounds.slice(0, numRounds);
        }

        reset({ rounds: updatedRounds });
        setInterviewRounds(updatedRounds);
    }, [numRounds, reset]);

    useEffect(() => {
        if (interviewers.length > 0 && interviewRounds?.length > 0) {
            let changed = false;
            const hydrated = interviewRounds.map((r) => {
                if (r.name) {
                    const found = interviewers.find((i) => i.id == r.name);
                    if (found) {
                        // Ensure both interviewer_name AND id are synced with the actual interviewer user
                        if (
                            r.interviewer_name !== found.interviewer_name ||
                            r.id !== r.name
                        ) {
                            changed = true;
                            return {
                                ...r,
                                interviewer_name: found.interviewer_name,
                                id: r.name, // Crucial: use the interviewer user id
                            };
                        }
                    }
                }
                return r;
            });

            if (changed) {
                setInterviewRounds(hydrated);
                reset({ rounds: hydrated });
            }
        }
    }, [interviewers, interviewRounds, reset, setInterviewRounds]);

    return (
        <div className="m-4 p-5 rounded-md border border-[#BCC1CA] bg-white shadow-sm">
            <button
                onClick={() => setIsModalVisible(true)}
                className="mb-5 h-[30px]  gap-2.5 bg-white px-3  border border-[#BCC1CA] rounded-md cursor-pointer hover:bg-gray-100"
            >
                + Add Interviewer
            </button>

            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <AddInterviewer onclose={fetchInterviewers} />
            </Modal>

            <label className="text-[#424955] text-sm font-semibold block mb-2">
                Number of Interview Rounds
            </label>
            <Input
                type="number"
                min={0}
                value={numRounds}
                onChange={(e) => setNumRounds(Number(e.target.value))}
                placeholder="Enter number of rounds"
                className="w-[200px] mb-5 rounded-md"
            />

            {formValues?.rounds?.map((round, index) => (
                <div
                    key={index}
                    className="mb-5 p-4 border border-[#eee] rounded-md bg-[#fafafa]"
                >
                    <h4 className="mb-3 text-[#171A1F] font-semibold">
                        Round {index + 1}
                    </h4>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-[#424955] text-sm font-semibold block mb-1">
                                Interviewer Name
                            </label>
                            <Controller
                                name={`rounds.${index}.name`} // stores interviewer ID
                                control={control}
                                render={({ field }) => {
                                    // Get the current selected interviewer object (if any)
                                    const selectedInterviewer =
                                        interviewers.find(
                                            (i) => i.id === field.value,
                                        );

                                    return (
                                        <Select
                                            {...field}
                                            showSearch
                                            placeholder="Select Interviewer"
                                            optionFilterProp="label"
                                            value={
                                                selectedInterviewer?.id ||
                                                undefined
                                            }
                                            onChange={(val) => {
                                                field.onChange(val);
                                                setValue(
                                                    `rounds.${index}.id`,
                                                    val,
                                                );
                                                const selected =
                                                    interviewers.find(
                                                        (i) => i.id === val,
                                                    );
                                                setValue(
                                                    `rounds.${index}.interviewer_name`,
                                                    selected?.interviewer_name,
                                                );
                                            }}
                                            allowClear
                                            className="w-full"
                                        >
                                            {interviewers.map((i) => (
                                                <Select.Option
                                                    key={i.id}
                                                    value={i.id}
                                                    label={`${i.interviewer_name} (${i.designation})`}
                                                >
                                                    <div className="flex justify-between items-center w-full">
                                                        <span>
                                                            {i.interviewer_name}-{i.designation?i.designation:"N/A"}
                                                        </span>
                                                        <span className="text-gray-400 text-[11px] bg-gray-100 px-1.5 py-0.5 rounded ml-2">
                                                            {i.designation}
                                                        </span>
                                                    </div>
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    );
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-[#424955] text-sm font-semibold block mb-1">
                                Type of Interview
                            </label>
                            <Controller
                                name={`rounds.${index}.type_of_interview`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Type"
                                        className="w-full"
                                    >
                                        {interviewTypes.map((t) => (
                                            <Select.Option
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <label className="text-[#424955] text-sm font-semibold block mb-1">
                                Mode of Interview
                            </label>
                            <Controller
                                name={`rounds.${index}.mode_of_interview`}
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Select Mode"
                                        className="w-full"
                                    >
                                        {interviewModes.map((m) => (
                                            <Select.Option
                                                key={m.value}
                                                value={m.value}
                                            >
                                                {m.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FillIntervieweDetails;
