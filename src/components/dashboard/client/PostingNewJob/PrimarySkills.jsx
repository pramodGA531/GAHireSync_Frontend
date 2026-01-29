import React, { useEffect } from "react";
import { Input, Tooltip, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import CreatableSelect from "react-select/creatable";
import skillsList from "../../../common/skills";
import { Controller, useWatch, useForm, useFieldArray } from "react-hook-form";
import debounce from "lodash.debounce";
import { useAuth } from "../../../common/useAuth";
import { useCallback } from "react";

const PrimarySkills = ({
    primarySkills,
    setPrimarySkills,
    connectionId,
    resetPrimary,
    setResetPrimary,
}) => {
    const { control, watch, reset } = useForm({
        defaultValues: {
            skills: primarySkills || [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "skills",
    });

    const { apiurl, token } = useAuth();

    const watchedSkills = useWatch({
        control,
        name: "skills",
    });
    const selected = watch("skills");
    const selectValue = selected.map((s) => ({
        label: s.skill_name,
        value: s.skill_name,
    }));

    const onSelectChange = (opts) => {
        const values = opts.map((o) => o.value);

        fields.forEach((field, index) => {
            if (!values.includes(field.skill_name)) {
                remove(index);
            }
        });

        values.forEach((val) => {
            const exists = fields.find((f) => f.skill_name === val);
            if (!exists) {
                if (val === "Others") {
                    append({
                        skill_name: val,
                        metric_type: "",
                        metric_value: "",
                        is_others: true,
                    });
                } else {
                    append({
                        skill_name: val,
                        metric_type: "",
                        metric_value: "",
                    });
                }
            }
        });
    };

    const customStyles = {
        multiValue: (base) => ({
            ...base,
            display: "flex",
            minWidth: 0,
            border: "2px solid #ddd",
            borderRadius: "8px",
            margin: "2px",
            marginRight: "8px",
            boxSizing: "border-box",
            backgroundColor: "white",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "#171A1F",
            fontWeight: "400",
            fontSize: "14px",
            marginRight: "20px",
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "red",
            ":hover": {
                backgroundColor: "red",
                color: "white",
            },
        }),
    };

    const saveDraftToBackend = useCallback(
        debounce(async (updatedSkills) => {
            try {
                setPrimarySkills(updatedSkills);
                await fetch(
                    `${apiurl}/client/save-skill-draft/?is_primary=${true}&connection_id=${connectionId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ skills: updatedSkills }),
                    },
                );
            } catch (error) {
                console.error("Error saving draft:", error);
            }
        }, 1000),
        [apiurl, token, connectionId], // memoize properly
    );

    useEffect(() => {
        if (watchedSkills && watchedSkills.length) {
            saveDraftToBackend(watchedSkills);
        }
    }, [watchedSkills, saveDraftToBackend]);

    useEffect(() => {
        return () => {
            saveDraftToBackend.cancel();
        };
    }, [saveDraftToBackend]);

    useEffect(() => {
        if (resetPrimary) {
            reset({ skills: primarySkills });
            setResetPrimary(false);
        }
    }, [primarySkills, reset, resetPrimary]);

    return (
        <div className="w-full">
            <span className="block mb-2 font-medium text-gray-700">
                Primary Skills
                <Tooltip title="Primary skills are core technical skills required for the job.">
                    <InfoCircleOutlined
                        style={{ marginLeft: "5px", color: "#1890ff" }}
                    />
                </Tooltip>
            </span>

            <Controller
                name="skills"
                control={control}
                render={() => (
                    <CreatableSelect
                        isMulti
                        closeMenuOnSelect={false}
                        options={skillsList.map((skill) => ({
                            label: skill,
                            value: skill,
                        }))}
                        placeholder="Select or type skills..."
                        value={selectValue}
                        onChange={onSelectChange}
                        styles={customStyles}
                        onInputChange={(inputValue, { action }) => {
                            if (
                                action === "input-change" &&
                                inputValue.length > 100
                            ) {
                                message.warning(
                                    "Skill name cannot exceed 100 characters",
                                );
                                return inputValue.slice(0, 100);
                            }
                            return inputValue;
                        }}
                    />
                )}
            />

            {/* Skill Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="border border-[#060a0c] rounded-lg p-4 bg-[#f9f9f9] flex flex-col gap-3"
                    >
                        {field.is_others ? (
                            <Controller
                                name={`skills.${index}.skill_name`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter skill name"
                                    />
                                )}
                            />
                        ) : (
                            <label className="font-semibold text-gray-800">
                                {field.skill_name}
                            </label>
                        )}

                        {!field.is_others && (
                            <Controller
                                name={`skills.${index}.skill_name`}
                                control={control}
                                render={({ field }) => <></>}
                            />
                        )}

                        <div className="w-full">
                            <label className="block text-sm text-gray-600 mb-1">
                                Metric Type
                            </label>
                            <Controller
                                name={`skills.${index}.metric_type`}
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full p-2 border border-[#ccc] rounded-[5px] bg-white outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select</option>
                                        <option value="rating">Rating</option>
                                        <option value="experience">
                                            Experience
                                        </option>
                                        <option value="custom">Custom</option>
                                    </select>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <label
                                htmlFor=""
                                className="block text-sm text-gray-600 mb-1"
                            >
                                Metric Value
                            </label>
                            {watch(`skills.${index}.metric_type`) ===
                                "rating" && (
                                <Controller
                                    name={`skills.${index}.metric_value`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => {
                                        let [rating, maxRaw] =
                                            field.value?.split("/") || ["", ""];
                                        let max = maxRaw || "10";

                                        const updateRating = (newRating) => {
                                            field.onChange(
                                                `${newRating || ""}/${max}`,
                                            );
                                        };

                                        const updateMax = (newMax) => {
                                            field.onChange(
                                                `${rating}/${newMax || ""}`,
                                            );
                                        };

                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    gap: 8,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Input
                                                    type="number"
                                                    value={rating}
                                                    onChange={(e) =>
                                                        updateRating(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Rating"
                                                    min={0}
                                                />
                                                <span>/</span>
                                                <Input
                                                    type="number"
                                                    value={max}
                                                    defaultValue={10}
                                                    onChange={(e) =>
                                                        updateMax(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Max"
                                                    min={1}
                                                />
                                            </div>
                                        );
                                    }}
                                />
                            )}

                            {watch(`skills.${index}.metric_type`) ===
                                "experience" && (
                                <Controller
                                    name={`skills.${index}.metric_value`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => {
                                        let [min, max] = field.value?.split(
                                            " - ",
                                        ) || ["", ""];

                                        const updateMin = (val) =>
                                            field.onChange(
                                                `${val || ""} - ${max}`,
                                            );
                                        const updateMax = (val) =>
                                            field.onChange(
                                                `${min} - ${val || ""}`,
                                            );

                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "100%",
                                                    gap: 8,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Input
                                                    type="number"
                                                    placeholder="Min years"
                                                    value={min}
                                                    onChange={(e) =>
                                                        updateMin(
                                                            e.target.value,
                                                        )
                                                    }
                                                    min={0}
                                                />
                                                <span>-</span>
                                                <Input
                                                    type="number"
                                                    placeholder="Max years"
                                                    value={max}
                                                    onChange={(e) =>
                                                        updateMax(
                                                            e.target.value,
                                                        )
                                                    }
                                                    min={min || 0}
                                                />
                                            </div>
                                        );
                                    }}
                                />
                            )}

                            {watch(`skills.${index}.metric_type`) ===
                                "custom" && (
                                <Controller
                                    name={`skills.${index}.metric_value`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Custom value"
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrimarySkills;
