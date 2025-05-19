import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginMess.css";
import { API_BASE_URL } from "../apiurl";
import authImage from "../assets/mess_login_man.jpg"; // Replace with your image

const LoginMess = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/mess/login`,
        credentials
      );
      
      if (response.data?.mess?.id && response.data?.mess?.name) {
        localStorage.setItem("messId", response.data.mess.id);
        localStorage.setItem("messName", response.data.mess.name);
      }
      
      navigate("/mess-dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to log in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <div className="logo">YourLogo</div>
          <h1>Welcome back</h1>
          <p className="subtext">Log in to your mess account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Mess Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter mess name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              "Log in"
            )}
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </form>
      </div>

      <div className="auth-image-container">
        <img src={authImage} alt="Authentication visual" className="auth-image" />
        <div className="image-overlay">
          <h2>Manage your mess efficiently</h2>
          <p>Streamline your operations with our comprehensive solution</p>
        </div>
      </div>
    </div>
  );
};

export default LoginMess;