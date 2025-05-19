import React, { useState, useEffect } from "react";
import "./studentlist.css";
import { API_BASE_URL } from "../apiurl";
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const wardenInfo = JSON.parse(localStorage.getItem("wardenInfo")); 
        if (!wardenInfo || !wardenInfo.id) {
          throw new Error("Warden information not found.");
        }
  
        const token = localStorage.getItem("wardenToken");
  
        const response = await fetch(`${API_BASE_URL}/api/student/under-warden?wardenId=${wardenInfo.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
  
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchStudents(); // ✅ Call the function here
  }, []);
  
  console.log(localStorage.getItem("wardenInfo"))
  if (isLoading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="students-section">
      <h2>All Students</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Year</th>
                <th>Room No</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.phone}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.room_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
