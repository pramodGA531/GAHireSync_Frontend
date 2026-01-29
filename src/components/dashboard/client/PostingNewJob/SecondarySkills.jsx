import React, { useEffect } from "react";
import { Input, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import skillsList from "../../../common/skills";
import { Controller, useWatch, useForm, useFieldArray } from "react-hook-form";
import debounce from "lodash.debounce";
import { useAuth } from "../../../common/useAuth";
import { useCallback } from "react";

const SecondarySkills = ({
    secondarySkills,
    setSecondarySkills,
    connectionId,
    resetSecondary,
    setResetSecondary,
}) => {
    const { control, watch, reset } = useForm({
        defaultValues: {
            skills: secondarySkills || [],
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
                setSecondarySkills(updatedSkills);
                await fetch(
                    `${apiurl}/client/save-skill-draft/?is_primary=${false}&connection_id=${connectionId}`,
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
        if (resetSecondary) {
            reset({ skills: secondarySkills });
            setResetSecondary(false);
        }
    }, [secondarySkills, reset, resetSecondary]);

    return (
        <div className="mt-4">
            <span className="text-[#424955] text-sm font-semibold pt-2.5 block mb-2">
                Secondary Skills
                <Tooltip title="Secondary skills are core technical skills required for the job.">
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
                        className="mt-1"
                    />
                )}
            />

            {/* Skill Details */}
            <div className="flex flex-col gap-2.5 mt-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="p-3 mb-4 border border-[#eee] rounded"
                    >
                        {field.is_others ? (
                            <>
                                <h4 className="text-[#5c75a8] font-bold text-lg mb-1">
                                    Enter the skill name
                                </h4>

                                <Controller
                                    name={`skills.${index}.skill_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter skill name"
                                            className="text-[#5c75a8] font-semibold text-base mb-2"
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                />
                            </>
                        ) : (
                            <label className="text-[#5c75a8] font-semibold text-base block mb-2">
                                Skill – {field.skill_name}
                            </label>
                        )}

                        {!field.is_others && (
                            <Controller
                                name={`skills.${index}.skill_name`}
                                control={control}
                                render={({ field }) => <></>}
                            />
                        )}

                        <div className="flex flex-col md:flex-row w-full gap-2.5 mt-2.5 md:items-center">
                            <label
                                className="text-[#424955] text-sm font-semibold w-full md:w-auto"
                                style={{ minWidth: "100px" }}
                            >
                                Metric Type
                            </label>
                            <Controller
                                name={`skills.${index}.metric_type`}
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full md:w-[40%] p-2 rounded-[5px] border border-[#d9d9d9]"
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

                        <div className="flex flex-col md:flex-row w-full gap-2.5 mt-2.5 md:items-center">
                            <label
                                htmlFor=""
                                className="text-[#424955] text-sm font-semibold w-full md:w-auto"
                                style={{ minWidth: "100px" }}
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
                                            <div className="flex w-full md:w-[60%] gap-2 items-center">
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
                                            <div className="flex w-full md:w-[60%] gap-2 items-center">
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
                                            className="w-full md:w-[60%]"
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

export default SecondarySkills;
