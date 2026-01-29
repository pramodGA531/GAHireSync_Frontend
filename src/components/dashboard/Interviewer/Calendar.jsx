import { useState, useEffect, useMemo } from "react";
import { Button, Typography } from "antd";
import {
    LeftOutlined,
    RightOutlined,
    ClockCircleOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;

const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const timeToMinutes = (timeStr) => {
        const [time, period] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    const getCurrentTimePosition = () => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        const startTime = 7 * 60;
        const endTime = 23 * 60;

        if (totalMinutes < startTime || totalMinutes > endTime) {
            return -1;
        }

        return ((totalMinutes - startTime) / (endTime - startTime)) * 100;
    };

    const getEventStyle = (event) => {
        const startMinutes = timeToMinutes(event.startTime);
        const endMinutes = timeToMinutes(event.endTime);

        const startTime = 7 * 60;
        const endTime = 23 * 60;

        const top = ((startMinutes - startTime) / (endTime - startTime)) * 100;
        const height =
            ((endMinutes - startMinutes) / (endTime - startTime)) * 100;

        return {
            top: `${top}%`,
            height: `${height}%`,
        };
    };

    const getEventBackground = (type) => {
        switch (type) {
            case "success":
                return "bg-[#f6ffed] border border-[#b7eb8f]";
            case "processing":
                return "bg-[#e6f7ff] border border-[#91d5ff]";
            case "warning":
                return "bg-[#fff0f6] border border-[#ffadd2]";
            default:
                return "bg-[#f5f5f5] border border-[#d9d9d9]";
        }
    };

    const timeLabels = [];
    for (let hour = 7; hour <= 23; hour++) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? "PM" : "AM";
        timeLabels.push(`${displayHour}:00 ${period}`);
    }

    const currentTimePosition = useMemo(
        () => getCurrentTimePosition(),
        [currentTime]
    );

    return (
        <div className="w-full max-h-[1020px] overflow-y-auto bg-white rounded-lg border border-[#e8e8e8] shadow-[0_2px_8px_rgba(0,0,0,0.06)] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2">
            <div className="flex justify-between items-center p-[16px_24px] border-b border-[#f0f0f0]">
                <Title level={4} style={{ margin: 0 }}>
                    Today's Interviews
                </Title>
                <div className="flex items-center">
                    {/* <Button type="text" icon={<LeftOutlined />} onClick={goToPreviousDay} className="nav-button" /> */}
                    <div className="mx-3 text-sm">
                        <Text>{formatDate(currentDate)}</Text>
                    </div>
                    {/* <Button type="text" icon={<RightOutlined />} onClick={goToNextDay} className="nav-button" /> */}
                </div>
            </div>

            <div className="flex relative h-[1020px]">
                <div className="flex-1 relative overflow-hidden">
                    <div className="w-20 shrink-0 border-r border-[#f0f0f0] bg-[#fafafa]">
                        {timeLabels.map((time, index) => (
                            <div
                                key={index}
                                className="h-[60px] flex items-start px-3 relative"
                            >
                                <span className="text-xs text-[#666] absolute -top-2.5">
                                    {time}
                                </span>
                            </div>
                        ))}
                    </div>
                    {timeLabels.map((_, index) => (
                        <div
                            key={index}
                            className="absolute left-0 right-0 h-px bg-[#f0f0f0]"
                            style={{ top: `${index * 60}px` }}
                        ></div>
                    ))}

                    {events &&
                        events.map((event) => (
                            <div
                                key={event.id}
                                className={`absolute left-[10px] right-[10px] rounded-lg px-3 flex items-center shadow-sm max-md:flex-col max-md:items-start max-md:p-3 ${getEventBackground(
                                    event.type
                                )}`}
                                style={getEventStyle(event)}
                            >
                                <div className="mr-3 text-xl text-[#1890ff] max-md:mb-2 max-md:mr-0">
                                    <VideoCameraOutlined />
                                </div>
                                <div className="flex-1 max-md:mb-2 max-md:w-full">
                                    <div className="font-normal text-sm mb-1">
                                        {event.title}
                                    </div>
                                    <div className="text-xs text-[#666]">
                                        <ClockCircleOutlined />{" "}
                                        {event.startTime} - {event.endTime}
                                    </div>
                                </div>
                                <div className="flex gap-2 max-md:w-full max-md:flex-col">
                                    <Button
                                        type="primary"
                                        className="bg-[#1890ff] border-[#1890ff]"
                                        disabled={event.endTime < currentTime}
                                    >
                                        Add Remarks
                                    </Button>
                                    <Button className="bg-white border-[#d9d9d9]">
                                        Reschedule
                                    </Button>
                                </div>
                            </div>
                        ))}

                    {currentTimePosition >= 0 && (
                        <div
                            className="absolute left-0 right-0 h-0.5 bg-[#ff4d4f] z-10 before:content-[''] before:absolute before:left-0 before:-top-1 before:w-2 before:h-2 before:rounded-full before:bg-[#ff4d4f] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-2 after:h-2 after:rounded-full after:bg-[#ff4d4f]"
                            style={{ top: `${currentTimePosition}%` }}
                        ></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
