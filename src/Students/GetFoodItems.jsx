import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReviewList from "../MessStaff/ReviewList";
import ReviewStatus from "./ReviewStatus";

const GetFoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // Function to Get Student ID from LocalStorage
  const getStudentId = () => {
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
    return studentInfo?.id || null;
  };

  // Get Current Day (e.g., Sunday, Monday)
  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  // Get Current Time Slot Based on Hour
  const getTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 9) return "breakfast";
    if (hour >= 9 && hour < 14) return "lunch";
    if (hour >= 14 && hour < 18) return "snacks";
    return "dinner";
  };

  // Fetch Food Items Function
  const fetchFoodItems = async (studentId) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `http://localhost:5000/api/food/fooditems/${studentId}`
      );

      const today = getCurrentDay();
      const timeSlot = getTimeSlot();

      // Filter by current day and time slot
      const filteredItems = response.data.filter(
        (item) => item.day === today && item.slot.toLowerCase() === timeSlot
      );
      setFoodItems(filteredItems);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Review Submission
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!selectedFood) {
      alert("⚠️ No food item selected.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/reviews/addReview", {
        foodItemId: selectedFood,
        rating,
        comment,
        user: "John Doe",
      });
      alert("✅ Review added!");
      setRating(5);
      setComment("");
      setSelectedFood(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add review.");
    }
  };

  // Store Current Food Item ID in LocalStorage
  const handleSelectFood = (foodItemId) => {
    setSelectedFood(foodItemId);
    localStorage.setItem("currentFoodItemId", foodItemId);
  };
  const fooditemid = localStorage.getItem('currentFoodItemId');
  console.log(fooditemid);

  // Navigate to Review List
  const handleViewReviews = (foodItemId) => {
    navigate(`/reviews/${foodItemId}`);
  };

  useEffect(() => {
    const studentId = getStudentId();
    if (studentId) {
      fetchFoodItems(studentId);
    } else {
      setError("⚠️ Student ID not found. Please log in.");
    }
  }, []);

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>🍽️ Today's Food Items</h2>

        {loading && <p>Loading food items...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && foodItems.length === 0 && (
          <p>No food items available for today.</p>
        )}

        {!loading && foodItems.length > 0 && (
          <ul>
            {foodItems.map((item) => (
              <li key={item._id}>
                <strong>
                  {item.day} - {item.slot.toUpperCase()}
                </strong>
                <ul>
                  {item.items.map((food, index) => (
                    <li key={index}>
                      🍴 {food}{" "}
                      <button
                        onClick={() => handleSelectFood(item._id)}
                        style={{
                          marginLeft: "10px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Add Review
                      </button>

                      <button
                        onClick={() => handleViewReviews(item._id)}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        View Reviews
                      </button>

                      {selectedFood === item._id && (
                        <form
                          onSubmit={handleAddReview}
                          style={{
                            marginTop: "10px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                          }}
                        >
                          <h4>➕ Add Review</h4>
                          <label>
                            Rating (1-5):
                            <input
                              type="number"
                              value={rating}
                              min="1"
                              max="5"
                              onChange={(e) => setRating(e.target.value)}
                              required
                            />
                          </label>
                          <br />
                          <textarea
                            placeholder="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="3"
                            style={{ width: "100%", marginTop: "10px" }}
                          />
                          <br />
                          <button
                            type="submit"
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "5px 10px",
                              marginTop: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => setSelectedFood(null)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "red",
                              color: "white",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ReviewStatus />
    </>
  );
};

export default GetFoodItems;
