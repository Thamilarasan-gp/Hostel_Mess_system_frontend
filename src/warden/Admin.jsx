import React, { useState } from 'react';
import './Admin.css';
import { Bell, Mail, Search, Home, RefreshCw, User, BarChart2, Settings } from 'lucide-react';

const Admin = () => {
  // Stats for dashboard
  const stats = {
    studentsToday: 120,
    successfulScans: 110,
    tokenUsage: '92%',
    failedScans: 10,
    currentToken: 'ABC12345',
    validFrom: '10:00 AM',
    validUntil: '2:00 PM'
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">🍽️</div>
          <span>Inntegrate</span>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item">
            <RefreshCw size={20} />
            <span>Token Management</span>
          </a>
          <a href="#" className="nav-item">
            <User size={20} />
            <span>Student Management</span>
          </a>
          <a href="#" className="nav-item">
            <BarChart2 size={20} />
            <span>Scan Reports</span>
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h1>Restaurant Admin Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="icon-button">
              <Search size={20} />
            </button>
            <button className="icon-button">
              <Mail size={20} />
            </button>
            <button className="icon-button">
              <Bell size={20} />
            </button>
            <button className="user-profile">
              <img src="/api/placeholder/32/32" alt="User profile" />
            </button>
            <button className="settings-button">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-title">Students Today</div>
            <div className="stat-value">{stats.studentsToday}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Successful Scans</div>
            <div className="stat-value">{stats.successfulScans}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Token Usage</div>
            <div className="stat-value">{stats.tokenUsage}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Failed Scans</div>
            <div className="stat-value">{stats.failedScans}</div>
          </div>
        </div>

        {/* Token management section */}
        <div className="token-management">
          <h2>Token Management</h2>
          <div className="token-section">
            <div className="token-details">
              <div className="token-label">Today's Token</div>
              <div className="token-value">{stats.currentToken}</div>
              
              <div className="token-times">
                <div className="token-time">
                  <span>Valid From</span>
                  <span>{stats.validFrom}</span>
                </div>
                <div className="token-time">
                  <span>Valid Until</span>
                  <span>{stats.validUntil}</span>
                </div>
              </div>
              
              <button className="generate-token-btn">Generate New Token</button>
            </div>
            
            <div className="scan-reports">
              <h3>Daily Scan Log</h3>
              <div className="scan-chart">
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '70%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '65%' }}></div>
                <div className="chart-bar" style={{ height: '85%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Student list */}
        <div className="student-list-section">
          <h2>Student List</h2>
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Tokens Used</th>
                <th>Tokens Remaining</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1001</td>
                <td>John Doe</td>
                <td>Computer Science</td>
                <td>5</td>
                <td>5</td>
                <td><a href="#" className="view-link">View</a></td>
              </tr>
              <tr>
                <td>1002</td>
                <td>Jane Smith</td>
                <td>Electrical Engineering</td>
                <td>4</td>
                <td>6</td>
                <td><a href="#" className="view-link">View</a></td>
              </tr>
              <tr>
                <td>1003</td>
                <td>Alice Johnson</td>
                <td>Mechanical Engineering</td>
                <td>6</td>
                <td>4</td>
                <td><a href="#" className="view-link">View</a></td>
              </tr>
              <tr>
                <td>1004</td>
                <td>Bob Brown</td>
                <td>Civil Engineering</td>
                <td>3</td>
                <td>7</td>
                <td><a href="#" className="view-link">View</a></td>
              </tr>
              <tr>
                <td>1005</td>
                <td>Charlie Davis</td>
                <td>Computer Science</td>
                <td>2</td>
                <td>8</td>
                <td><a href="#" className="view-link">View</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;