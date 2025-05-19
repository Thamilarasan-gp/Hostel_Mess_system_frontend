import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Utensils, X, ChevronRight, MessageSquare } from "lucide-react";
import ReviewStatus from "./ReviewStatus";
import { API_BASE_URL } from "../apiurl";
import "./FoodReview.css";

const GetFoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [studentName, setStudentName] = useState("");
  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'all'
  const navigate = useNavigate();

  // Get Student ID from LocalStorage
  const getStudentId = () => {
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
    return studentInfo?.id || null;
  };

  // Fetch the student's name by ID
  const fetchStudentName = async (studentId) => {
    try {
      const resp = await axios.get(
        `${API_BASE_URL}/api/student/student-name/${studentId}`
      );
      setStudentName(resp.data.name);
    } catch (err) {
      console.error("Failed to fetch student name:", err);
      setStudentName("Unknown Student");
    }
  };

  // Get current day and timeslot
  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  };

  const getTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 9) return "breakfast";
    if (hour >= 9 && hour < 14) return "lunch";
    if (hour >= 14 && hour < 18) return "snacks";
    return "dinner";
  };

  // Fetch food items
  const fetchFoodItems = async (studentId) => {
    try {
      setLoading(true);
      setError("");
      const resp = await axios.get(
        `${API_BASE_URL}/api/food/fooditems/${studentId}`
      );
      const today = getCurrentDay();
      const slot = getTimeSlot();
      
      // For current tab, filter today's items
      const currentItems = resp.data.filter(
        (item) => item.day === today && item.slot.toLowerCase() === slot
      );
      
      // For all tab, show all items grouped by day
      const allItems = resp.data.reduce((acc, item) => {
        const dayIndex = acc.findIndex(d => d.day === item.day);
        if (dayIndex === -1) {
          acc.push({ day: item.day, slots: [item] });
        } else {
          acc[dayIndex].slots.push(item);
        }
        return acc;
      }, []);
      
      setFoodItems({
        current: currentItems,
        all: allItems
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch food items.");
    } finally {
      setLoading(false);
    }
  };

  // Review submission
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!selectedFood) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/reviews/addReview`, {
        foodItemId: selectedFood.id,
        rating,
        comment,
        user: studentName,
      });
      setRating(5);
      setComment("");
      setSelectedFood(null);
      // Show success feedback
    } catch (err) {
      console.error(err);
      // Show error feedback
    }
  };

  // Select food
  const handleSelectFood = (foodItem) => {
    setSelectedFood(foodItem);
  };

  // Navigate to reviews page
  const handleViewReviews = (foodItemId) => {
    navigate(`/reviews/${foodItemId}`);
  };

  // Initial load
  useEffect(() => {
    const sid = getStudentId();
    if (sid) {
      fetchFoodItems(sid);
      fetchStudentName(sid);
    } else {
      setError("Please log in to view food items.");
    }
  }, []);

  // Star rating component
  const StarRating = ({ value, onChange }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star ${star <= value ? "filled" : ""}`}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="food-review-container">
      <div className="food-review-header">
        <h1>
          <Utensils size={24} /> Food Menu
          {studentName && <span className="student-name">for {studentName}</span>}
        </h1>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            <Clock size={16} /> Current
          </button>
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Items
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading food items...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {activeTab === "current" && (
            <div className="current-food-section">
              <h2>
                {getCurrentDay()} - {getTimeSlot().charAt(0).toUpperCase() + getTimeSlot().slice(1)}
              </h2>
              
              {foodItems.current?.length === 0 ? (
                <div className="empty-state">
                  <p>No food items available for this time slot.</p>
                </div>
              ) : (
                <div className="food-grid">
                  {foodItems.current?.map((item) => (
                    <div key={item._id} className="food-card">
                      <div className="food-header">
                        <h3>{item.slot.toUpperCase()}</h3>
                        <span className="food-time">{item.time}</span>
                      </div>
                      
                      <ul className="food-items">
                        {item.items.map((food, idx) => (
                          <li key={idx} className="food-item">
                            <span className="food-name">{food}</span>
                            <div className="food-actions">
                              <button 
                                className="review-btn"
                                onClick={() => handleSelectFood({ id: item._id, name: food })}
                              >
                                <Star size={16} /> Rate
                              </button>
                              <button 
                                className="view-reviews-btn"
                                onClick={() => handleViewReviews(item._id)}
                              >
                                <MessageSquare size={16} /> Reviews
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "all" && (
            <div className="all-food-section">
              {foodItems.all?.map((dayGroup) => (
                <div key={dayGroup.day} className="day-group">
                  <h2>{dayGroup.day}</h2>
                  <div className="food-grid">
                    {dayGroup.slots.map((item) => (
                      <div key={item._id} className="food-card">
                        <div className="food-header">
                          <h3>{item.slot.toUpperCase()}</h3>
                          <span className="food-time">{item.time}</span>
                        </div>
                        
                        <ul className="food-items">
                          {item.items.map((food, idx) => (
                            <li key={idx} className="food-item">
                              <span className="food-name">{food}</span>
                              <div className="food-actions">
                                <button 
                                  className="review-btn"
                                  onClick={() => handleSelectFood({ id: item._id, name: food })}
                                >
                                  <Star size={16} /> Rate
                                </button>
                                <button 
                                  className="view-reviews-btn"
                                  onClick={() => handleViewReviews(item._id)}
                                >
                                  <MessageSquare size={16} /> Reviews
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {selectedFood && (
        <div className="review-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedFood(null)}>
              <X size={20} />
            </button>
            
            <h2>Review for {selectedFood.name}</h2>
            
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              
              <div className="form-group">
                <label>Your Comments</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this food..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Submit Review
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedFood(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReviewStatus />
    </div>
  );
};

export default GetFoodItems;