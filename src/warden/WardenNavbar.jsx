// components/WardenHeader.js
import React from 'react';
import { 
  FiRefreshCw,
  FiBell,
  FiMail,
  FiSearch
} from 'react-icons/fi';

const WardenHeader = ({ sidebarOpen }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>Warden Dashboard</h1>
        <div className="header-actions">
          <button className="icon-button">
            <FiRefreshCw />
          </button>
        </div>
      </div>
      
      <div className="header-right">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        
        <div className="header-icons">
          <button className="icon-button">
            <FiMail />
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button">
            <FiBell />
            <span className="notification-badge">5</span>
          </button>
        </div>
        
        <div className="user-profile">
          <div className="profile-avatar">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Warden" />
          </div>
          {sidebarOpen && (
            <div className="profile-info">
              <span className="profile-name">Warden Smith</span>
              <span className="profile-role">Hostel Warden</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default WardenHeader;