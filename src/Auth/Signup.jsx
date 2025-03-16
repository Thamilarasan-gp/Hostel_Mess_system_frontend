import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    block: 'A'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setMessage('');
      try {
        const response = await fetch('http://localhost:5000/api/auth/warden/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Warden registered successfully! Redirecting to login...');
          setTimeout(() => navigate('/wardendash'), 2000);
        } else {
          setMessage(data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setMessage('Server error. Try again later.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h2 className="signup-title">Warden Registration</h2>

        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="block">Block</label>
            <select
              id="block"
              name="block"
              value={formData.block}
              onChange={handleChange}
            >
              <option value="A">Block A</option>
              <option value="B">Block B</option>
              <option value="C">Block C</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="register-button" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>

            <button type="button" className="login-button" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
