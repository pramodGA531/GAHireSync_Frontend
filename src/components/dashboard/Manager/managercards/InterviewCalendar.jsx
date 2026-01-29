import React, { useState } from "react";

import {
    LeftOutlined,
    RightOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import AppCalendar from "../../../common/AppCalendar";
import { useAuth } from "../../../common/useAuth";

const InterviewCalendar = ({ interviews }) => {
    const { apiurl, token } = useAuth();
    const [currentWeekStart, setCurrentWeekStart] = useState(
        dayjs().startOf("week")
    );

    // Function to get dates for the current week (7 days starting from currentWeekStart)
    const getWeekDates = () => {
        return Array.from({ length: 7 }, (_, index) =>
            currentWeekStart.add(index, "day")
        );
    };

    // Move forward by 1 day (shift calendar right)
    const nextDay = () => {
        setCurrentWeekStart(currentWeekStart.add(1, "day"));
    };

    // Move backward by 1 day (shift calendar left)
    const prevDay = () => {
        setCurrentWeekStart(currentWeekStart.subtract(1, "day"));
    };

    // Reset to the current week's start
    const resetToToday = () => {
        setCurrentWeekStart(dayjs().startOf("week"));
    };

    const convertInterviewsToEvents = (interviewData) => {
        return interviewData.map((interview) => {
            const startDateTime = new Date(
                `${interview.scheduled_date}T${interview.from_time}`
            );
            const endDateTime = new Date(
                `${interview.scheduled_date}T${interview.to_time}`
            );

            return {
                id: interview.id,
                title: `${interview.candidate_name} - ${interview.job_title} (Round ${interview.round_num})`,
                start: startDateTime,
                end: endDateTime,
                interviewer: interview.interviewer_name,
                candidate: interview.candidate_name,
                jobTitle: interview.job_title,
                profile: interview.profile,
            };
        });
    };

    return (
        <div className="w-[95%] bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            {/* <div className="events-header">
        <span className="events-title">Upcoming Events</span>
        <div className="navigation">
          <button className="nav-btn" onClick={prevDay}>
            <LeftOutlined />
          </button>
          <button className="nav-btn" onClick={nextDay}>
            <RightOutlined />
          </button>
          <button className="today-btn" onClick={resetToToday}>
            Today
          </button>
        </div>
      </div> */}
            {/* 
      <div className="week-calendar">
        {getWeekDates().map((date, index) => {
          const dayName = date.format("ddd").toUpperCase(); // MON, TUE, etc.
          const dayNumber = date.format("DD"); // Date number
          const isToday = date.isSame(dayjs(), "day");
          const currentMonthYear = date.format("YYYY-MM-DD"); // Get the month and year
          const crtDate = date.format("YYYY-MM-DD");

          return (
            <div key={index} className={`day-cell ${isToday ? "active" : ""}`}>
              <span className="day-text">{dayName}</span>
              <span className="date-text">{dayNumber}</span>

              {(() => {
                const matchingInterview = interviews?.find(
                  (obj) => obj.scheduled_date === crtDate
                );
                return matchingInterview ? (
                  <div className="event">
                    <div className="avatars">
                      <img
                        src={matchingInterview?.profile ? `${apiurl}/${matchingInterview.profile}` : "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt="avatar"
                      />

                    </div>
                    <p className="event-text">
                      {matchingInterview?.job_title}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          );
        })}
      </div> */}
            <AppCalendar events={convertInterviewsToEvents(interviews)} />
        </div>
    );
};

export default InterviewCalendar;
