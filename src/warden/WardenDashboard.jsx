import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WardenDashboard.css';
import IssueToken from './IssueToken';
import StudentList from './Studentlist';

const WardenDashboard = () => {
  const navigate = useNavigate();
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    qrCodeStatus: 'active',
    attendanceLogs: [],
    tokensUsedToday: 0,
    studentsUnderWarden: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const wardenInfo = JSON.parse(localStorage.getItem("wardenInfo"));
        const wardenId = wardenInfo ? wardenInfo.id : null;

        if (!wardenId) {
          console.error("Warden ID not found");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/student/count?wardenId=${wardenId}`);
        const data = await response.json();

        if (!data.success) {
          console.error("Failed to fetch student count");
          setIsLoading(false);
          return;
        }

        // Set the dashboard data, ensuring student count is correctly updated
        setDashboardData(prevState => ({
          ...prevState,
          totalStudents: data.studentCount || 0, // Ensure fallback to 0 if student count is not available
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student count:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to format date/time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + 
           date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Navigate to QR download page
  const navigateToQRDownload = () => {
    navigate('/qr');
  };

  // Navigate to Add Student page
  const navigateToAddStudent = () => {
    navigate('/addstudent');
  };
  const navigateToAddMess = () => {
    navigate('/addMess');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Warden Dashboard</h1>
        <div className="user-info">
          <span className="user-name">Welcome, Warden</span>
          <button className="logout-button">Logout</button>
          <button className="Addmess-button"  onClick={navigateToAddMess}>Add Mess</button>
        </div>
      </header>

      {/* Add student button */}
      <img 
        src="https://icons.iconarchive.com/icons/custom-icon-design/flatastic-4/512/Male-user-add-icon.png" 
        alt="Add Student" 
        className="warden-addstudent-icon" 
        onClick={navigateToAddStudent}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-cards">
            <div className="dashboard-card students-card">
              <div className="card-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="card-content">
                <h3>Total Students</h3>
                <p className="card-value">{dashboardData.totalStudents}</p>
              </div>
            </div>

            <div className="dashboard-card qr-download-card">
              <div className="card-icon">
                <i className="fas fa-qrcode"></i>
              </div>
              <div className="card-content">
                <h3>QR Code</h3>
                <button 
                  className="download-qr-button" 
                  onClick={navigateToQRDownload}
                >
                  Download QR Code
                </button>
              </div>
            </div>

            <div className="dashboard-card tokens-used-card">
              <div className="card-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="card-content">
                <h3>Today's Tokens</h3>
                <p className="card-value">{dashboardData.tokensUsedToday}</p>
              </div>
            </div>
          </div>

          {/* Additional components */}
          <IssueToken />
          <StudentList />
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;
