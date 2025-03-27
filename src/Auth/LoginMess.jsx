import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginMess = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mess/login",
        credentials
      );
      console.log("Login Successful:", response.data);

      // Store mess details in localStorage (if needed)
     const messId = localStorage.getItem("messId");
const messName = localStorage.getItem("messName");

if (!messId || !messName) {
  // Redirect to login or show message
}

      // Navigate to the next component (e.g., MessDashboard)
      navigate("/mess-dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      alert(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Mess Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Mess Name"
          value={credentials.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginMess;
