import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const AppCalendar = ({ events }) => {
    return (
        <div style={{ height: 700 }}>
            <style>
                {`
                    .rbc-calendar .rbc-month-view,
                    .rbc-calendar .rbc-time-view {
                        border-radius: 10px;
                        padding: 10px;
                    }
                    .rbc-calendar .rbc-event {
                        background: #81ABFF;
                        color: white !important;
                        gap: 5px;
                    }
                    .rbc-calendar .rbc-btn-group {
                        display: flex;
                        gap: 5px;
                    }
                    .rbc-calendar .rbc-btn-group button {
                        border-radius: 8px;
                        border: 1px solid #E9E4E4;
                        font-weight: 400;
                        color: #1E1E1E;
                    }
                    .rbc-calendar .rbc-toolbar button.rbc-active {
                        background-color: #EEF2FF;
                        border: none;
                        color: #1E1E1E !important;
                    }
                `}
            </style>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                style={{
                    height: "100%",
                    background: "#fff",
                    borderRadius: "8px",
                }}
            />
        </div>
    );
};

export default AppCalendar;
