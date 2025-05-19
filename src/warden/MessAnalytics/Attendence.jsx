import React from 'react';
import './Attendence.css';
function Attendence() {
    const studentAttendanceData = {
        topAttenders: [
          { name: 'John S.', id: 'S1021', attendance: 98 },
          { name: 'Priya M.', id: 'S1045', attendance: 97 },
          { name: 'Alex T.', id: 'S1032', attendance: 96 },
          { name: 'Sarah K.', id: 'S1018', attendance: 95 },
          { name: 'Michael P.', id: 'S1056', attendance: 94 },
        ],
        missedMeals: [
          { name: 'Robert J.', id: 'S1067', missed: 3, meals: 'Breakfast (3 days)' },
          { name: 'Emma L.', id: 'S1089', missed: 2, meals: 'Dinner (2 days)' },
          { name: 'David W.', id: 'S1042', missed: 2, meals: 'Lunch (2 days)' },
        ]
      };
  return (
    <div className="attendance-section">
    <div className="analytics-row">
      <div className="analytics-card">
        <h3>Top Attendance (Last 30 days)</h3>
        <div className="attendance-list">
          <div className="attendance-list-header">
            <span>Student</span>
            <span>ID</span>
            <span>Attendance %</span>
          </div>
          {studentAttendanceData.topAttenders.map((student, index) => (
            <div key={index} className="attendance-list-item">
              <span>{student.name}</span>
              <span>{student.id}</span>
              <span className="attendance-bar">
                <div 
                  className="attendance-fill" 
                  style={{ width: `${student.attendance}%` }}
                />
                <span className="attendance-percent">{student.attendance}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-card">
        <h3>Students Missing Meals</h3>
        <div className="missed-meals-list">
          <div className="missed-meals-header">
            <span>Student</span>
            <span>ID</span>
            <span>Missed</span>
            <span>Pattern</span>
          </div>
          {studentAttendanceData.missedMeals.map((student, index) => (
            <div key={index} className="missed-meals-item">
              <span>{student.name}</span>
              <span>{student.id}</span>
              <span className="missed-count">{student.missed}</span>
              <span>{student.meals}</span>
            </div>
          ))}
        </div>
        <button className="view-all-btn">View All</button>
      </div>
    </div>

    <div className="analytics-card full-width">
      <h3>Weekly Attendance Heatmap</h3>
      <div className="heatmap-container">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th></th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Breakfast</td>
              <td className="heat-high">92%</td>
              <td className="heat-high">90%</td>
              <td className="heat-med">85%</td>
              <td className="heat-med">87%</td>
              <td className="heat-high">91%</td>
              <td className="heat-low">70%</td>
              <td className="heat-low">65%</td>
            </tr>
            <tr>
              <td>Lunch</td>
              <td className="heat-high">95%</td>
              <td className="heat-high">96%</td>
              <td className="heat-high">94%</td>
              <td className="heat-high">93%</td>
              <td className="heat-high">92%</td>
              <td className="heat-med">88%</td>
              <td className="heat-med">85%</td>
            </tr>
            <tr>
              <td>Snacks</td>
              <td className="heat-med">82%</td>
              <td className="heat-med">80%</td>
              <td className="heat-med">81%</td>
              <td className="heat-med">83%</td>
              <td className="heat-high">90%</td>
              <td className="heat-high">92%</td>
              <td className="heat-med">84%</td>
            </tr>
            <tr>
              <td>Dinner</td>
              <td className="heat-high">94%</td>
              <td className="heat-high">93%</td>
              <td className="heat-high">91%</td>
              <td className="heat-high">92%</td>
              <td className="heat-med">85%</td>
              <td className="heat-med">80%</td>
              <td className="heat-high">90%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default Attendence