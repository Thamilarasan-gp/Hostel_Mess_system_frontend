import React, { useState } from 'react';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiThumbsUp, 
  FiThumbsDown,
  FiUser,
  FiCalendar, 
  FiAlertTriangle 
} from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './MessAnalytics.css';
import Feedback from './Feedback';
import Wastage from './Wastage';
import Attendence from './Attendence';
import TokenStatus from './TokenStatus';
import MealUsage from './MealUsage';

const MessAnalytics = () => {
  const [activeTab, setActiveTab] = useState('mealUsage');
  const [period, setPeriod] = useState('weekly');

  // Define menuRatingsData
  const menuRatingsData = {
    topDishes: [
      { name: 'Paneer Butter Masala', rating: 4.8, day: 'Wed', meal: 'Dinner' },
      { name: 'Masala Dosa', rating: 4.7, day: 'Mon', meal: 'Breakfast' },
      { name: 'Pulao', rating: 4.6, day: 'Fri', meal: 'Lunch' },
    ],
    worstDishes: [
      { name: 'Plain Khichdi', rating: 2.8, day: 'Tue', meal: 'Dinner' },
      { name: 'Veg Sandwich', rating: 3.1, day: 'Thu', meal: 'Snacks' },
      { name: 'Upma', rating: 3.3, day: 'Sat', meal: 'Breakfast' },
    ],
    averageRatings: [
      { category: 'Breakfast', rating: 3.8 },
      { category: 'Lunch', rating: 4.2 },
      { category: 'Snacks', rating: 3.6 },
      { category: 'Dinner', rating: 4.1 },
    ]
  };

  return (
    <div className="mess-analytics-container">
      <div className="section-header">
        <h2>Mess Analytics Dashboard</h2>
        <div className="period-selector">
          <button 
            className={`period-btn ${period === 'daily' ? 'active' : ''}`}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button 
            className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab-btn ${activeTab === 'mealUsage' ? 'active' : ''}`}
          onClick={() => setActiveTab('mealUsage')}
        >
          <FiPieChart />
          <span>Meal Usage</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tokenStats' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokenStats')}
        >
          <FiBarChart2 />
          <span>QR Tokens</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <FiUser />
          <span>Attendance</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wastage' ? 'active' : ''}`}
          onClick={() => setActiveTab('wastage')}
        >
          <FiAlertTriangle />
          <span>Wastage</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <FiThumbsUp />
          <span>Feedback</span>
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'mealUsage' && <MealUsage period={period} menuRatingsData={menuRatingsData} />}
        {activeTab === 'tokenStats' && <TokenStatus />}
        {activeTab === 'attendance' && <Attendence />}
        {activeTab === 'wastage' && <Wastage />}
        {activeTab === 'feedback' && <Feedback menuRatingsData={menuRatingsData} />}
      </div>
    </div>
  );
};

export default MessAnalytics;