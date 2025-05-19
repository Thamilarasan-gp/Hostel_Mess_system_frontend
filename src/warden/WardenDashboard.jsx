import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WardenDashboard.module.css';
import IssueToken from './IssueToken';
import StudentList from './StudentList';
import TokenRecords from './TokenRecords';
import MessAnalytics from './MessAnalytics/MessAnalytics';
import Feedback from './MessAnalytics/Feedback';

// Import icons - replace with your preferred icon library import
// This example assumes you're using react-icons/fi as in your original code
import { 
  FiUserPlus,
  FiSettings,
  FiUsers,
  FiCamera,
  FiMenu,
  FiHome,
  FiChevronDown,
  FiChevronRight,
  FiKey,
  FiPieChart,
  FiLogOut,
  FiCoffee,
  FiBell,
  FiDownload,
  FiUpload
} from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 248,
    tokensIssued: 156,
    messAttendance: 198,
    pendingRequests: 12,
    studentsUnderWarden: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
const [wardenInfo, setWardenInfo] = useState(null);
  useEffect(() => {
    // Simulating data loading
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Your API fetch logic here
        // Example:
      
        // const response = await fetch(`${API_BASE_URL}/api/student/count?wardenId=${wardenId}`);
        // const data = await response.json();
 setIsLoading(true);
    try {
      const storedInfo = JSON.parse(localStorage.getItem("wardenInfo"));
      setWardenInfo(storedInfo);
      setTimeout(() => setIsLoading(false), 800);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }

        // Simulated response
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
const wardenName = wardenInfo?.name || "Warden";

  const navigateToQRDownload = () => navigate('/qr');
  const navigateToAddStudent = () => navigate('/addstudent');
  const navigateToAddMess = () => navigate('/addMess');

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
        {/* Logo Section */}
        <div className={styles.sidebarHeader}>
          {sidebarOpen && <h1 className={styles.logo}>HostelWarden</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={styles.toggleButton}
          >
            <FiMenu />
          </button>
        </div>
        
        {/* Navigation */}
        <div className={styles.navMenu}>
          {[
            { icon: <FiHome />, text: 'Dashboard', id: 'dashboard' },
            { icon: <FiUsers />, text: 'Students', id: 'students' },
            { icon: <FiKey />, text: 'Tokens', id: 'tokens' },
            { icon: <FiPieChart />, text: 'Analytics', id: 'analytics' },
            { icon: <FiBell />, text: 'Notifications', id: 'notifications' },
            { icon: <FiSettings />, text: 'Settings', id: 'settings' }
          ].map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navText}>{item.text}</span>}
            </button>
          ))}
        </div>

        {/* User Profile Section */}
        <div className={styles.profileSection}>
          {sidebarOpen ? (
            <div className={styles.profileFull}>
              <div className={styles.profileAvatar}>{wardenName[0]}</div>
              <div className={styles.profileInfo}>
                <p className={styles.profileName}>{wardenName}</p>
                <button className={styles.logoutButton}>
                  <FiLogOut className={styles.logoutIcon} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.profileAvatar}>{wardenName[0]}</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${!sidebarOpen ? styles.mainContentExpanded : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'students' && 'Student Management'}
            {activeTab === 'tokens' && 'Token Management'}
            {activeTab === 'analytics' && 'Mess Analytics'}
            {activeTab === 'notifications' && 'Notifications Center'}
            {activeTab === 'settings' && 'Settings & Configuration'}
          </h2>
          <div className={styles.headerRight}>
            <button className={styles.notificationButton}>
              <FiBell />
            </button>
            <div className={styles.headerAvatar}>{wardenName[0]}</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <>
                  {/* Stats Cards */}
                  <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                      <div className={styles.statContent}>
                        <div>
                          <p className={styles.statTitle}>Total Students</p>
                          <h3 className={styles.statValue}>{dashboardData.totalStudents}</h3>
                          <p className={styles.statChange}>+5 this week</p>
                        </div>
                        <div className={styles.statIconWrapper}>
                          <FiUsers className={styles.statIcon} />
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardPurple}`}>
                      <div className={styles.statContent}>
                        <div>
                          <p className={styles.statTitle}>Tokens Issued</p>
                          <h3 className={styles.statValue}>{dashboardData.tokensIssued}</h3>
                          <p className={styles.statChange}>+23 today</p>
                        </div>
                        <div className={styles.statIconWrapper}>
                          <FiKey className={styles.statIcon} />
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                      <div className={styles.statContent}>
                        <div>
                          <p className={styles.statTitle}>Mess Attendance</p>
                          <h3 className={styles.statValue}>{dashboardData.messAttendance}</h3>
                          <p className={styles.statChange}>80% of students</p>
                        </div>
                        <div className={styles.statIconWrapper}>
                          <FiCoffee className={styles.statIcon} />
                        </div>
                      </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardAmber}`}>
                      <div className={styles.statContent}>
                        <div>
                          <p className={styles.statTitle}>Pending Requests</p>
                          <h3 className={styles.statValue}>{dashboardData.pendingRequests}</h3>
                          <p className={styles.statChange}>Requires attention</p>
                        </div>
                        <div className={styles.statIconWrapper}>
                          <FiBell className={styles.statIcon} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.primaryButton}
                      onClick={navigateToAddStudent}
                    >
                      <FiUserPlus />
                      Add New Student
                    </button>
                    <button 
                      className={styles.secondaryButton}
                      onClick={navigateToAddMess}
                    >
                      <FiCoffee />
                      Manage Mess
                    </button>
                    <button 
                      className={styles.secondaryButton}
                      onClick={navigateToQRDownload}
                    >
                      <FiDownload />
                      Download QR
                    </button>
                  </div>

              <MessAnalytics/>

                </>
              )}

              {activeTab === 'students' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Student Management</h2>
                    <button 
                      className={styles.primaryButton} 
                      onClick={navigateToAddStudent}
                    >
                      <FiUserPlus />
                      Add Student
                    </button>
                  </div>
                  <StudentList />
                </div>
              )}

              {activeTab === 'tokens' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Token Management</h2>
                  </div>
                  <IssueToken />
                  <TokenRecords />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Mess Analytics</h2>
                  </div>
                  <Feedback />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <FiBell />
                  </div>
                  <h3 className={styles.emptyStateTitle}>Notification Center</h3>
                  <p className={styles.emptyStateText}>
                    Your notification center is where you'll receive updates about students, tokens, and system alerts.
                  </p>
                  <button className={styles.primaryButton}>
                    Configure Notifications
                  </button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <FiSettings />
                  </div>
                  <h3 className={styles.emptyStateTitle}>Settings & Configuration</h3>
                  <p className={styles.emptyStateText}>
                    Manage system settings, user permissions, and customize your dashboard experience.
                  </p>
                  <button className={styles.primaryButton}>
                    System Preferences
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;