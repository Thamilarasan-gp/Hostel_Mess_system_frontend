import React from 'react';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MealUsage.css';

function MealUsage({ period, menuRatingsData }) {
  const weeklyMealTrendData = [
    { day: 'Mon', breakfast: 210, lunch: 350, snacks: 150, dinner: 290 },
    { day: 'Tue', breakfast: 220, lunch: 370, snacks: 160, dinner: 300 },
    { day: 'Wed', breakfast: 250, lunch: 390, snacks: 180, dinner: 320 },
    { day: 'Thu', breakfast: 240, lunch: 380, snacks: 170, dinner: 310 },
    { day: 'Fri', breakfast: 260, lunch: 400, snacks: 190, dinner: 330 },
    { day: 'Sat', breakfast: 200, lunch: 340, snacks: 130, dinner: 280 },
    { day: 'Sun', breakfast: 180, lunch: 320, snacks: 120, dinner: 260 },
  ];
  const mealDistributionData = [
    { name: 'Breakfast', value: 250, color: '#4361ee' },
    { name: 'Lunch', value: 380, color: '#4cc9f0' },
    { name: 'Snacks', value: 180, color: '#f8961e' },
    { name: 'Dinner', value: 320, color: '#3f37c9' },
  ];

  return (
    <div className="meal-usage-section">
      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Meal Distribution</h3>
          <div className="chart-container pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mealDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mealDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Meal Consumption Trend ({period})</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={weeklyMealTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="breakfast" stackId="a" name="Breakfast" fill="#4361ee" />
                <Bar dataKey="lunch" stackId="a" name="Lunch" fill="#4cc9f0" />
                <Bar dataKey="snacks" stackId="a" name="Snacks" fill="#f8961e" />
                <Bar dataKey="dinner" stackId="a" name="Dinner" fill="#3f37c9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h3>Meal Trends Analysis</h3>
        <div className="trends-summary">
          <div className="trend-stat">
            <div className="trend-icon up">
              <FiTrendingUp />
            </div>
            <div className="trend-info">
              <h4>Most Popular Meal</h4>
              <p>Lunch (38% of students)</p>
            </div>
          </div>
          <div className="trend-stat">
            <div className="trend-icon up">
              <FiTrendingUp />
            </div>
            <div className="trend-info">
              <h4>Growing Fastest</h4>
              <p>Breakfast (+5% this week)</p>
            </div>
          </div>
          <div className="trend-stat">
            <div className="trend-icon down">
              <FiTrendingUp className="down" />
            </div>
            <div className="trend-info">
              <h4>Declining</h4>
              <p>Sunday Dinner (-3%)</p>
            </div>
          </div>
          <div className="trend-stat">
            <div className="trend-icon neutral">
              <FiCalendar />
            </div>
            <div className="trend-info">
              <h4>Busiest Day</h4>
              <p>Friday (1180 meals)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealUsage;