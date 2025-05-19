import React, { useState, useEffect } from "react";
import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import "./TokenHistory.css";
import { API_BASE_URL } from "../apiurl";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, we want to hide calendar by default
      if (window.innerWidth >= 768) {
        setShowCalendar(true);
      } else {
        setShowCalendar(false);
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get unique used dates for calendar marking
  const usedDates = tokenHistory.reduce((acc, entry) => {
    const dateStr = entry.dateUsed;
    if (dateStr) {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      acc.add(key);
    }
    return acc;
  }, new Set());

  // Function to calculate relative time
  const getRelativeTime = (dateUsed, timeUsed) => {
    try {
      const dateTimeStr = `${dateUsed}T${timeUsed}`;
      const usageDate = new Date(dateTimeStr);
      const now = new Date();
      const diffMs = now - usageDate;

      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSeconds < 60) {
        return `${diffSeconds} sec${diffSeconds === 1 ? "" : "s"} ago`;
      } else if (diffMinutes < 60) {
        return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
      } else if (diffDays < 30) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
      } else {
        return usageDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch (e) {
      console.error("Error parsing date/time:", e);
      return "Unknown time";
    }
  };

  // Fetch token history
  useEffect(() => {
    const fetchTokenHistory = async () => {
      try {
        const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
        if (!studentInfo || !studentInfo.id) {
          throw new Error("Student ID not found in localStorage");
        }

        const response = await fetch(`${API_BASE_URL}/api/tokenhistory/status/${studentInfo.id}`);
        if (response.status === 404) {
          setTokenHistory([]);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch token history: ${response.status}`);
        }

        const data = await response.json();
        setTokenHistory(data.tokenHistory || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token history:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTokenHistory();
  }, []);

  // Calendar navigation
  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${currentMonth}-${day}`;
      const isUsed = usedDates.has(dateKey);
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isUsed ? "used" : ""}`}
        >
          {day}
          {isUsed && <div className="used-marker"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="history-container">
      <div className="history-section">
        <div className="section-header">
          <h2 className="section-title">
            <Clock size={20} className="section-icon" />
            Token History
          </h2>
          <button 
            className="calendar-toggle"
            onClick={() => setShowCalendar(!showCalendar)}
            aria-label={showCalendar ? "Hide calendar" : "Show calendar"}
          >
            <Calendar size={18} />
            {!isMobile && (showCalendar ? "Hide Calendar" : "Show Calendar")}
          </button>
        </div>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            Loading token history...
          </div>
        ) : error ? (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            Error: {error}
          </div>
        ) : tokenHistory.length === 0 ? (
          <div className="no-history">
            <span className="info-icon">ℹ️</span>
            No token usage history found.
          </div>
        ) : (
          <div className="history-content">
            <div className="history-list-container">
              <h3 className="history-subtitle">Recent Token Usage</h3>
              <div className="history-list">
                {tokenHistory
                  .sort((a, b) => new Date(`${b.dateUsed}T${b.timeUsed}`) - new Date(`${a.dateUsed}T${a.timeUsed}`))
                  .map((entry, index) => (
                    <div key={index} className="history-item">
                      <div className="history-details">
                        <div className="history-date-token">
                          <div className="history-date">
                            {new Date(`${entry.dateUsed}T${entry.timeUsed}`).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                      <div className="history-time">
    {new Date(`${entry.dateUsed}T${entry.timeUsed}`).toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
  </div>

                        </div>
                        <div className="history-status">
                          <div className="status-indicator used"></div>
                          <span>Used {getRelativeTime(entry.dateUsed, entry.timeUsed)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {(showCalendar || !isMobile) && (
              <div className={`calendar-container ${showCalendar ? 'visible' : ''}`}>
                <div className="calendar-view">
                  <div className="calendar-header">
                    <button 
                      onClick={() => navigateMonth("prev")} 
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <h3>
                      {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button 
                      onClick={() => navigateMonth("next")} 
                      aria-label="Next month"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="calendar-weekdays">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>
                  <div className="calendar-days">
                    {generateCalendarDays()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenHistory;