import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Calendar, LogOut, QrCode, RefreshCw, Check, X } from "lucide-react";
import "./StudentDashboard.css";

const StudentDashboard = ({ studentName = "John Doe", onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [token, setToken] = useState("");
  const [tokenHistory, setTokenHistory] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const scannerRef = useRef(null);

  useEffect(() => {
    const generateToken = () => {
      const randomToken = Math.random().toString(36).substring(2, 10).toUpperCase();
      setToken(randomToken);
    };
    generateToken();

    const mockTokenHistory = {
      "2025-03-12": { used: true, token: "AB23XY78" },
      "2025-03-10": { used: true, token: "TK68LP31" },
      "2025-03-05": { used: true, token: "QR94ST26" },
      "2025-03-01": { used: true, token: "VB71MN43" },
    };
    setTokenHistory(mockTokenHistory);
  }, []);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          scannerRef.current.clear();
          setScanResult(decodedText);
          setScanSuccess(true);

          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setTokenHistory((prev) => ({
            ...prev,
            [dateStr]: { used: true, token: decodedText },
          }));
        },
        (errorMessage) => {
          console.warn("QR Scan Error:", errorMessage);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setScanSuccess(null);
    scannerRef.current.render();
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setSelectedMonth(prevMonth => {
      if (prevMonth === 0) {
        setSelectedYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => {
      if (prevMonth === 11) {
        setSelectedYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasToken = tokenHistory[dateStr];
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasToken ? 'calendar-day-token' : ''}`}
          title={hasToken ? `Token: ${hasToken.token}` : ''}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderHistorySection = () => (
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
              {new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button onClick={handleNextMonth} className="month-nav-button">&gt;</button>
          </div>
          
          <div className="calendar-days">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
          </div>
          
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
          
          <div className="calendar-legend">
            <div className="legend-indicator"></div>
            <span>Token used</span>
          </div>
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
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <button onClick={onLogout} className="logout-button">
            <LogOut size={16} />
            Logout
          </button>
          
        </div>

        <div className="welcome-section">
          <p className="welcome-text">Welcome, {studentName}</p>
          <p className="date-text">{currentDate.toDateString()}</p>
        </div>

        <div className="dashboard-grid">
          <div className="qr-scanner-section">
            <div className="section-header">
              <h2 className="section-title">
                Mess QR Scanner
                <QrCode size={24} className="section-icon" />
              </h2>
            </div>

            <div className="scanner-container">
              {!scanResult ? (
                <div className="token-display">
                  <h3>Today's Token: <span className="token-text">{token}</span></h3>
                  <div id="qr-reader" className="scanner-box"></div>
                </div>
              ) : (
                <div className={`scan-result ${scanSuccess ? "success" : "error"}`}>
                  <div className="result-icon">
                    {scanSuccess ? <Check size={48} /> : <X size={48} />}
                  </div>
                  <h3 className="result-title">{scanSuccess ? "Scan Successful!" : "Scan Failed"}</h3>
                  <p className="result-text">{scanResult}</p>
                  {scanSuccess && <p className="result-instruction">Show this token to the mess staff</p>}
                  <button onClick={resetScanner} className="scan-button">
                    <RefreshCw size={16} />
                    Scan Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {renderHistorySection()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
