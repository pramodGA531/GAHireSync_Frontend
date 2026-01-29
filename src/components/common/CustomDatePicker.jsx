import { useState, useRef, useEffect } from "react";
import {
    format,
    parse,
    isValid,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    setYear,
    isBefore,
    isSameDay,
    isToday,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const CustomDatePicker = ({
    onChange,
    startDate,
    endDate,
    formatString = "yyyy-MM-dd",
    size = "md",
    defaultValue,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(defaultValue ?? null);
    const [currentMonth, setCurrentMonth] = useState(
        defaultValue ?? new Date()
    );
    const [error, setError] = useState(null);
    const datePickerRef = useRef(null);
    const [positionClass, setPositionClass] = useState("bottom-right");

    const sizeClasses = {
        sm: {
            container: "w-[200px]",
            input: "p-1 px-2 text-sm leading-[1.5]",
        },
        md: {
            container: "w-[250px]",
            input: "p-2 px-3 text-base leading-[1.6]",
        },
        lg: {
            container: "w-[300px]",
            input: "p-3 px-4 text-lg leading-[1.8]",
        },
    };

    const positionStyles = {
        "bottom-right": "top-[calc(100%+5px)] left-0",
        "bottom-left": "top-[calc(100%+5px)] right-0",
        "top-left": "bottom-[calc(100%+5px)] right-0",
        "top-right": "bottom-[calc(100%+5px)] left-0",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const validateDate = (date) => {
        try {
            const formattedDate = format(date, formatString);
            const parsedDate = parse(formattedDate, formatString, new Date());
            if (!isValid(parsedDate)) throw new Error("Invalid date format");
            return date; // Keep it as a Date object
        } catch (error) {
            setError("Selected format is invalid");
            return null;
        }
    };

    const handleInputClick = () => {
        if (datePickerRef.current) {
            const rect = datePickerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // Calendar dimensions
            const calendarHeight = 300;
            const calendarWidth = 300;

            // Check if there's enough space below
            const isBottom = rect.bottom + calendarHeight > windowHeight;

            // Check if there's enough space to the right
            const isRight = rect.right + calendarWidth > windowWidth;

            // Determine position class based on available space
            if (isBottom && isRight) {
                setPositionClass("top-left");
            } else if (isBottom && !isRight) {
                setPositionClass("top-right");
            } else if (!isBottom && isRight) {
                setPositionClass("bottom-left");
            } else {
                setPositionClass("bottom-right");
            }
        }
        setIsOpen((prev) => !prev);
    };

    const handleDateClick = (date) => {
        if (
            (startDate && isBefore(date, startDate)) ||
            (endDate && isBefore(endDate, date)) // ⬅️ Disallow dates after endDate
        )
            return;

        const validDate = validateDate(date);
        if (validDate) {
            setSelectedDate(validDate);
            setError(null);
            setIsOpen(false);
            if (onChange) onChange(validDate);
        }
    };

    const handleYearChange = (event) => {
        const newYear = Number.parseInt(event.target.value, 10);
        setCurrentMonth(setYear(currentMonth, newYear));
    };

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    useEffect(() => {
        if (defaultValue) {
            setSelectedDate(defaultValue);
            setCurrentMonth(defaultValue);
        }
    }, [defaultValue]);

    return (
        <div
            className={`relative border-none outline-none ${
                sizeClasses[size]?.container || sizeClasses.md.container
            }`}
            ref={datePickerRef}
        >
            <input
                type="text"
                readOnly
                value={selectedDate ? format(selectedDate, formatString) : ""}
                placeholder="Select Date"
                onClick={handleInputClick}
                className={`w-full border border-[#ccc] rounded-[5px] cursor-pointer outline-none ${
                    sizeClasses[size]?.input || sizeClasses.md.input
                }`}
            />
            {error && (
                <div className="text-[#dc3545] text-sm mt-[5px]">{error}</div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`absolute p-5 w-[300px] bg-white border border-[#ddd] shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-[5px] z-[1000] ${positionStyles[positionClass]}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-center pb-[10px] mb-[10px] border-b border-[#c3c3c3]">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentMonth(subMonths(currentMonth, 1))
                                }
                                className="text-[#8a8787] p-[5px_10px] cursor-pointer rounded-[3px] bg-white border border-[#eee] hover:bg-[#f5f5f5]"
                            >
                                ◀
                            </button>
                            <span>{format(currentMonth, "MMMM")}</span>
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentMonth(addMonths(currentMonth, 1))
                                }
                                className="text-[#8a8787] p-[5px_10px] cursor-pointer rounded-[3px] bg-white border border-[#eee] hover:bg-[#f5f5f5]"
                            >
                                ▶
                            </button>
                            <select
                                className="p-[5px] text-sm rounded-[3px] border border-[#ccc] bg-white cursor-pointer max-h-[30px] overflow-hidden focus:outline-none scrollbar-thin scrollbar-thumb-blue-500"
                                onChange={handleYearChange}
                                value={format(currentMonth, "yyyy")}
                            >
                                {Array.from(
                                    { length: 121 },
                                    (_, i) => 1930 + i
                                ).map((year) => (
                                    <option
                                        key={year}
                                        value={year}
                                        className="text-sm p-2"
                                    >
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-7 text-center gap-[5px]">
                            {[
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="text-[#0056b3] font-bold py-[10px]"
                                >
                                    {day}
                                </div>
                            ))}
                            {Array(getDay(startOfMonth(currentMonth)))
                                .fill(null)
                                .map((_, index) => (
                                    <div key={`empty-${index}`}></div>
                                ))}
                            {days.map((day) => {
                                const isDisabled =
                                    (startDate && isBefore(day, startDate)) ||
                                    (endDate && isBefore(endDate, day));
                                const isSelected =
                                    selectedDate &&
                                    isSameDay(selectedDate, day);
                                const isTodayDate = isToday(day);

                                return (
                                    <button
                                        key={day.toString()}
                                        type="button"
                                        onClick={() => handleDateClick(day)}
                                        className={`p-2 cursor-pointer rounded-[3px] bg-white transition-colors duration-200 border-none
                                        ${
                                            isSelected
                                                ? "!bg-[#007bff] !text-white"
                                                : "text-[#007bff] hover:bg-[#007bff] hover:text-white"
                                        }
                                        ${
                                            isTodayDate
                                                ? "border-2 border-[#007bff]"
                                                : ""
                                        }
                                        ${
                                            isDisabled
                                                ? "!text-[#413f3f] cursor-not-allowed hover:bg-[#f5f5f5] hover:text-[#413f3f]"
                                                : ""
                                        }
                                    `}
                                        disabled={isDisabled}
                                    >
                                        {format(day, "d")}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDatePicker;
