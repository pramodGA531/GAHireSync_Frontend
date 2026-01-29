import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { Input, Button, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
import { useAuth } from "../../../common/useAuth";
import locationsList from "../../../common/locations";
import { useCallback } from "react";

const animatedComponents = makeAnimated();
const { Option } = Select;

export default function LocationsFormWithFieldArray({
    locationData,
    setLocationData,
    connectionId,
    setResetLocation,
    resetLocation,
}) {
    const initialLocations = Array.isArray(locationData) ? locationData : [];

    const { control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            locations: initialLocations,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "locations",
    });

    const selected = watch("locations");
    const selectValue = selected?.map((loc) => ({
        label: loc.location,
        value: loc.location,
    }));

    const onSelectChange = (opts) => {
        const values = opts.map((o) => o.value);

        // remove unselected
        fields.forEach((field, index) => {
            if (!values.includes(field.location)) {
                remove(index);
            }
        });

        // append new
        values.forEach((val) => {
            const exists = fields.find((f) => f.location === val);
            if (!exists) {
                append({ location: val, job_type: "", positions: 1 });
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

    const { apiurl, token } = useAuth();

    const watched = useWatch({ control, name: "locations" });

    const saveDraftToBackend = useCallback(
        debounce(async (updatedList) => {
            try {
                setLocationData(updatedList);
                await fetch(
                    `${apiurl}/client/save-location-draft/?connection_id=${connectionId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ locations: updatedList }),
                    }
                );
            } catch (err) {
                console.error("Error saving draft:", err);
            }
        }, 1000),
        [apiurl, token, connectionId]
    );

    useEffect(() => {
        if (watched && watched.length) {
            saveDraftToBackend(watched);
        }
    }, [watched, saveDraftToBackend]);

    useEffect(() => {
        if (resetLocation) {
            reset({ locations: locationData });
            setResetLocation(false);
        }
    }, [resetLocation, reset, locationData]);

    return (
        <div className="mt-4">
            <form>
                <div style={{ marginBottom: 16 }}>
                    <span className="text-[#424955] text-sm font-semibold pt-2.5 block mb-2">
                        Job Locations<span style={{ color: "red" }}>*</span>
                        <Tooltip title="Select locations, job type, and number of positions">
                            <InfoCircleOutlined
                                style={{ marginLeft: 8, color: "#1890ff" }}
                            />
                        </Tooltip>
                    </span>
                    <Controller
                        name="locations"
                        control={control}
                        render={() => (
                            <CreatableSelect
                                isMulti
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={locationsList.map((loc) => ({
                                    label: loc,
                                    value: loc,
                                }))}
                                placeholder="Select or type locations..."
                                value={selectValue}
                                onChange={onSelectChange}
                                styles={customStyles}
                                className="mt-1"
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-2.5">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="p-3 mb-4 border border-[#eee] rounded"
                        >
                            <label className="text-[#5c75a8] font-semibold text-base block mb-2">
                                Location - {field.location}
                            </label>
                            <Controller
                                name={`locations.${index}.location`}
                                control={control}
                                render={({ field }) => <></>}
                            />
                            <div className="flex flex-col md:flex-row w-full gap-2.5 mt-2.5 md:items-center">
                                <label
                                    className="text-[#424955] text-sm font-semibold w-full md:w-auto"
                                    style={{ minWidth: "80px" }}
                                >
                                    Job Type
                                </label>
                                <Controller
                                    name={`locations.${index}.job_type`}
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full md:w-[60%] p-2 rounded-[5px] border border-[#d9d9d9]"
                                            placeholder="select job type"
                                        >
                                            <option value="remote">
                                                Remote
                                            </option>
                                            <option value="hybrid">
                                                Hybrid
                                            </option>
                                            <option value="office">
                                                Office
                                            </option>
                                        </select>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row w-full gap-2.5 mt-2.5 md:items-center">
                                <label
                                    className="text-[#424955] text-sm font-semibold w-full md:w-auto"
                                    style={{ minWidth: "80px" }}
                                >
                                    Positions
                                </label>
                                <Controller
                                    name={`locations.${index}.positions`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            min={1}
                                            placeholder="Number of positions"
                                            className="rounded w-full md:w-[60%]"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}
