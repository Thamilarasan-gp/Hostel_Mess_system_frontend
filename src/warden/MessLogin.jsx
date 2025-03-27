import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MessLogin = () => {
  const [formData, setFormData] = useState({
    admin_id: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mess/login",
        formData
      );

      // Store token in localStorage
      localStorage.setItem("messToken", response.data.token);
      alert("Login Successful!");
      console.log("Token:", response.data.token);

      // Navigate to MessDash after success
      navigate("/messdash"); 
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div>
      <h2>Mess Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="admin_id"
          placeholder="Admin ID"
          value={formData.admin_id}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default MessLogin;
