import React, { useState } from "react";
import { 
  FiCalendar, 
  FiPlusCircle, 
  FiList, 
  FiStar, 
  FiUsers, 
  FiLogOut,
  FiMenu,
  FiChevronRight,
  FiClock,
  FiPieChart
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AddTimetable from "./AddTimetable";
import AddFood from "./AddFood";
import FoodList from "./FoodList";
import Feedback from "../warden/MessAnalytics/Feedback";

import "./MessDashboard.css";

const MessDashboard = () => {
  const messName = localStorage.getItem("messName") || "Mess";
  const [activeTab, setActiveTab] = useState("timetable");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState([
    "New review received",
    "Staff shift change tomorrow",
    "Inventory low on rice"
  ]);

  const handleLogout = () => {
    localStorage.removeItem("messId");
    localStorage.removeItem("messName");
    window.location.href = "/mess-login";
  };

  const tabs = [
    { id: "timetable", icon: <FiCalendar />, label: "Timetable" },
    { id: "addFood", icon: <FiPlusCircle />, label: "Add Food" },
    { id: "foodList", icon: <FiList />, label: "Food List" },
    { id: "reviews", icon: <FiStar />, label: "Reviews" },
  
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "timetable": return <AddTimetable />;
      case "addFood": return <AddFood />;
      case "foodList": return <FoodList />;
      case "reviews": return <Feedback/>;
   
      default: return <AddTimetable />;
    }
  };

  return (
    <div className={`messdashboard-container ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      {/* Sidebar */}
      <motion.div 
        className="messdashboard-sidebar"
        initial={{ x: 0 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          {sidebarOpen ? (
            <>
              <h2>{messName}</h2>
              <p>Mess Management System</p>
            </>
          ) : (
            <div className="collapsed-logo">
              {messName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon">{tab.icon}</span>
              {sidebarOpen && <span>{tab.label}</span>}
              {sidebarOpen && activeTab === tab.id && (
                <FiChevronRight className="active-indicator" />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          
          <div className="header-content">
            <h1>
              {tabs.find(t => t.id === activeTab)?.label || "Dashboard"}
            </h1>
            <div className="breadcrumbs">
              <span>Home</span>
              <FiChevronRight />
              <span>{tabs.find(t => t.id === activeTab)?.label || "Dashboard"}</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="notifications">
              <div className="notification-badge">3</div>
              <FiClock />
            </div>
            <div className="user-profile">
              <div className="profile-info">
                <span className="profile-name">Admin</span>
                <span className="profile-role">Manager</span>
              </div>
              <div className="profile-avatar">
                {messName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content-container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <motion.div 
              className="stat-card primary"
              whileHover={{ y: -5 }}
            >
              <FiPieChart className="stat-icon" />
              <div className="stat-content">
                <h3>Daily Meals</h3>
                <p>142 Served</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card success"
              whileHover={{ y: -5 }}
            >
              <FiStar className="stat-icon" />
              <div className="stat-content">
                <h3>Avg. Rating</h3>
                <p>4.6/5.0</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card warning"
              whileHover={{ y: -5 }}
            >
              <FiUsers className="stat-icon" />
              <div className="stat-content">
                <h3>Active Staff</h3>
                <p>8 Members</p>
              </div>
            </motion.div>
          </div>

       

          {/* Main Content */}
          <motion.div
            className="main-content-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderComponent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MessDashboard;