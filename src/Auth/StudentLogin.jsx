import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentLogin.css';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    roll_number: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/student/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('studentToken', response.data.token);
        localStorage.setItem('studentData', JSON.stringify({
          id: response.data.studentId,
          name: response.data.name,
          roll_number: response.data.roll_number,
          block: response.data.block,
          room_number: response.data.room_number
        }));
        
        navigate('/studentdash');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studentlogin-container">
      <div className="studentlogin-box">
        <div className="studentlogin-header">
          <h2 className="studentlogin-title">Student Login</h2>
        </div>
        
        {error && (
          <div className="studentlogin-error-message" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form className="studentlogin-form" onSubmit={handleSubmit}>
          <div className="studentlogin-form-group">
            <label htmlFor="roll_number" className="studentlogin-form-label">
              Roll Number
            </label>
            <input
              type="text"
              id="roll_number"
              name="roll_number"
              value={formData.roll_number}
              onChange={handleChange}
              className="studentlogin-form-input"
              placeholder="Enter your roll number"
              required
            />
          </div>
          
          <div className="studentlogin-form-group">
            <label htmlFor="password" className="studentlogin-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="studentlogin-form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="studentlogin-button-container">
            <button
              type="submit"
              className="studentlogin-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="studentlogin-help-text">
          <p>Forgot your password? Contact your warden.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
