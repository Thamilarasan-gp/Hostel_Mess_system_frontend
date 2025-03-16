import { useState } from "react";
import axios from "axios";
import "./AddStudent.css";  // Import CSS file

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    roll_number: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    block: "",
    room_number: "",
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("wardenToken");  // Get stored warden token

      if (!token) {
        alert("No token found! Please log in again.");
        return;
      }
      console.log(localStorage.getItem("wardenToken"));


      const response = await axios.post(
        "http://localhost:5000/api/warden/add-student",
        { ...student, assigned_token: `MARCH${new Date().getFullYear()}` },
        { headers: { Authorization: `Bearer ${token}` } } // Pass token
      );

      alert("Student added successfully!");
      setStudent({
        name: "",
        roll_number: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        block: "",
        room_number: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized! Please log in again.");
      } else {
        alert("Failed to add student.");
      }
    }
  };

  return (
    <div className="add-student-container">
      <h2 className="add-student-title">Add Student</h2>
      <form onSubmit={handleSubmit} className="add-student-form">
        <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} required className="add-student-input" />
        <input type="text" name="roll_number" placeholder="Roll Number" value={student.roll_number} onChange={handleChange} required className="add-student-input" />
        <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} required className="add-student-input" />
        <input type="text" name="phone" placeholder="Phone" value={student.phone} onChange={handleChange} required className="add-student-input" />
        <input type="text" name="department" placeholder="Department" value={student.department} onChange={handleChange} required className="add-student-input" />
        <input type="number" name="year" placeholder="Year" value={student.year} onChange={handleChange} required className="add-student-input" />
        <input type="text" name="block" placeholder="Block" value={student.block} onChange={handleChange} required className="add-student-input" />
        <input type="text" name="room_number" placeholder="Room Number" value={student.room_number} onChange={handleChange} required className="add-student-input" />
<input type="text" name="password" placeholder="Password" value={student.password} onChange={handleChange} required className="add-student-input" />
        <button type="submit" className="add-student-btn">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
