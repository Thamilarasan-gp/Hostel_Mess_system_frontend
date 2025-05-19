import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TokenStatus.css';

function TokenStatus() {
  const tokenStatsData = {
    totalIssued: 1130, 
    validScans: 1050,
    invalidScans: 80,
    peakTimes: [
      { time: '7:00', scans: 85 },
      { time: '8:00', scans: 120 },
      { time: '12:00', scans: 180 },
      { time: '13:00', scans: 150 },
      { time: '17:00', scans: 90 },
      { time: '19:00', scans: 170 },
      { time: '20:00', scans: 140 },
    ]
  };

  return (
    <div className="token-stats-section">
      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Token Statistics</h3>
          <div className="token-summary">
            <div className="token-stat">
              <h4>Total Tokens Issued Today</h4>
              <p className="stat-value">{tokenStatsData.totalIssued}</p>
            </div>
            <div className="token-stat">
              <h4>Valid Scans</h4>
              <p className="stat-value good">{tokenStatsData.validScans}</p>
              <p className="stat-percentage">({Math.round((tokenStatsData.validScans/tokenStatsData.totalIssued)*100)}%)</p>
            </div>
            <div className="token-stat">
              <h4>Invalid Scans</h4>
              <p className="stat-value bad">{tokenStatsData.invalidScans}</p>
              <p className="stat-percentage">({Math.round((tokenStatsData.invalidScans/tokenStatsData.totalIssued)*100)}%)</p>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Scan Distribution</h3>
          <div className="chart-container pie-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Valid', value: tokenStatsData.validScans, color: '#4cc9f0' },
                    { name: 'Invalid', value: tokenStatsData.invalidScans, color: '#f72585' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#4cc9f0" />
                  <Cell fill="#f72585" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h3>Peak Scanning Times</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={tokenStatsData.peakTimes}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="scans" stroke="#4361ee" activeDot={{ r: 8 }} name="Scans" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TokenStatus;