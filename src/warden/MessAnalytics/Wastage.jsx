import React from 'react';
import { FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Wastage.css';

function Wastage() {
  const wastageData = {
    estimated: 1050,
    actual: 920,
    wastage: 130,
    costImpact: 6500,
    dailyWastage: [
      { day: 'Mon', kg: 15 },
      { day: 'Tue', kg: 20 },
      { day: 'Wed', kg: 18 },
      { day: 'Thu', kg: 25 },
      { day: 'Fri', kg: 22 },
      { day: 'Sat', kg: 16 },
      { day: 'Sun', kg: 14 },
    ]
  };

  return (
    <div className="wastage-section">
      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Today's Wastage Summary</h3>
          <div className="wastage-summary">
            <div className="wastage-stat">
              <div className="wastage-icon">
                <FiBarChart2 />
              </div>
              <div className="wastage-info">
                <h4>Estimated Meals</h4>
                <p className="wastage-value">{wastageData.estimated}</p>
              </div>
            </div>
            <div className="wastage-stat">
              <div className="wastage-icon">
                <FiBarChart2 />
              </div>
              <div className="wastage-info">
                <h4>Actual Consumption</h4>
                <p className="wastage-value">{wastageData.actual}</p>
              </div>
            </div>
            <div className="wastage-stat">
              <div className="wastage-icon">
                <FiAlertTriangle />
              </div>
              <div className="wastage-info">
                <h4>Wastage</h4>
                <p className="wastage-value bad">{wastageData.wastage} meals</p>
              </div>
            </div>
            <div className="wastage-stat">
              <div className="wastage-icon">
                <FiAlertTriangle />
              </div>
              <div className="wastage-info">
                <h4>Cost Impact</h4>
                <p className="wastage-value bad">₹{wastageData.costImpact}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Weekly Food Wastage (kg)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={wastageData.dailyWastage}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kg" fill="#f72585" name="Wastage (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h3>Wastage Reduction Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Highest Wastage Meal</h4>
            <p>Lunch on Thursdays (25 kg)</p>
            <div className="insight-recommendation">
              <strong>Recommendation:</strong> Reduce portion size or adjust menu items
            </div>
          </div>
          <div className="insight-card">
            <h4>Lowest Attended Meal</h4>
            <p>Sunday Breakfast (65% attendance)</p>
            <div className="insight-recommendation">
              <strong>Recommendation:</strong> Consider reducing preparation quantity
            </div>
          </div>
          <div className="insight-card">
            <h4>Most Wasted Dish</h4>
            <p>Plain Khichdi (Tuesday Dinner)</p>
            <div className="insight-recommendation">
              <strong>Recommendation:</strong> Consider menu rotation or improvement
            </div>
          </div>
          <div className="insight-card">
            <h4>Monthly Trend</h4>
            <p>12% reduction from last month</p>
            <div className="insight-recommendation">
              <strong>Recommendation:</strong> Continue implementing feedback-based improvements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wastage;