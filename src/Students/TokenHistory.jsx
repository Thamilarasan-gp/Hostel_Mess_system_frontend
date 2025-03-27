import React, { useState } from "react";
import { Calendar } from "lucide-react";
import "./StudentDashboard.css";
const TokenHistory = ({ tokenHistory }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (selectedMonth === 0) setSelectedYear((prevYear) => prevYear - 1);
  };

  const handleNextMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    if (selectedMonth === 11) setSelectedYear((prevYear) => prevYear + 1);
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasToken = tokenHistory[dateStr];

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasToken ? "calendar-day-token" : ""}`}
          title={hasToken ? `Token: ${hasToken.token}` : ""}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="history-section">
      <div className="section-header">
        <h2 className="section-title">Token History</h2>
        <button onClick={() => setShowCalendar(!showCalendar)} className="calendar-toggle">
          <Calendar size={20} />
          {showCalendar ? "Hide Calendar" : "View Calendar"}
        </button>
      </div>

      {showCalendar ? (
        <div className="calendar-container">
          <div className="calendar-nav">
            <button onClick={handlePrevMonth} className="month-nav-button">&lt;</button>
            <h3 className="month-title">
              {new Date(selectedYear, selectedMonth).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button onClick={handleNextMonth} className="month-nav-button">&gt;</button>
          </div>

          <div className="calendar-days">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
          </div>

          <div className="calendar-grid">{renderCalendar()}</div>
        </div>
      ) : (
        <div className="history-list">
          <h3 className="history-subtitle">Recent Tokens</h3>
          {Object.entries(tokenHistory)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .slice(0, 5)
            .map(([date, data]) => (
              <div key={date} className="history-item">
                <div className="history-date">
                  {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="history-token">{data.token}</div>
                <div className="history-status">
                  <div className="status-indicator used"></div>
                  Used
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TokenHistory;
