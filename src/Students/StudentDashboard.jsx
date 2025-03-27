import React, { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import TokenHistory from "./TokenHistory";
import { LogOut } from "lucide-react";
import "./StudentDashboard.css";

const StudentDashboard = ({ studentName = "John Doe", onLogout }) => {
  const [token, setToken] = useState("");
  const [tokenHistory, setTokenHistory] = useState({});

  useEffect(() => {
    setToken(Math.random().toString(36).substring(2, 10).toUpperCase());
  }, []);

  return (
    <div className="dashboard-container">
      <button onClick={onLogout} className="logout-button">
        <LogOut size={16} />
        Logout
      </button>
      <QRScanner token={token} setTokenHistory={setTokenHistory} />
      <TokenHistory tokenHistory={tokenHistory} />
    </div>
  );
};

export default StudentDashboard;
