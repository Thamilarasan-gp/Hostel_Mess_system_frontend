import React, { useState, useEffect } from 'react';
import './Feedback.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { API_BASE_URL } from "../../apiurl";
function Feedback() {
  const [menuRatingsData, setMenuRatingsData] = useState({
    topDishes: [],
    worstDishes: [],
    averageRatings: [],
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [feedbackKeywords, setFeedbackKeywords] = useState([]);
  const [messId, setMessId] = useState(null); // Added state for messId
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state

  // Fetch messId from localStorage
  useEffect(() => {
    const id = localStorage.getItem('messId');
    if (id) {
      setMessId(id);
    } else {
      setError('No Mess ID found! Please log in again.');
    }
  }, []);

  // Fetch feedback data
  useEffect(() => {
    if (!messId) return; // Skip API call if messId is not available

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('wardenToken'); // Retrieve token for authentication
        const API_URL = `${API_BASE_URL}/api/reviews/mess/${messId}/food-items-reviews`;

        const response = await fetch(API_URL, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined, // Include token if available
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback data');
        }

        const data = await response.json();
        const foodItemsWithReviews = data.foodItemsWithReviews || [];

        // Process data for Top Rated and Lowest Rated Dishes
        const dishesWithRatings = foodItemsWithReviews
          .filter((item) => item.reviews?.length > 0)
          .map((item) => {
            const averageRating =
              item.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
              item.reviews.length;
            return {
              name: item.foodItem?.items?.join(', ') || 'Unknown Dish',
              day: item.foodItem?.day || 'Unknown',
              meal: item.foodItem?.slot
                ? item.foodItem.slot.charAt(0).toUpperCase() + item.foodItem.slot.slice(1)
                : 'Unknown',
              rating: averageRating.toFixed(1),
            };
          });

        // Sort for top and worst dishes
const sortedDishes = [...dishesWithRatings].sort((a, b) => b.rating - a.rating);
const topDishes = sortedDishes.slice(0, 3);
const worstDishes = sortedDishes.slice(-3).reverse();

// Process data for Average Ratings by Meal
const mealRatings = {};
foodItemsWithReviews.forEach((item) => {
  const slot = item.foodItem?.slot;
  if (slot && item.reviews?.length > 0) {
    if (!mealRatings[slot]) {
      mealRatings[slot] = { total: 0, count: 0 };
    }
    const avgRating =
      item.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
      item.reviews.length;
    mealRatings[slot].total += avgRating;
    mealRatings[slot].count += 1;
  }
});

const averageRatings = Object.keys(mealRatings).map((slot) => ({
  category: slot.charAt(0).toUpperCase() + slot.slice(1),
  rating: (mealRatings[slot].total / mealRatings[slot].count).toFixed(1),
}));

// Process Recent Student Feedback
const allReviews = foodItemsWithReviews
  .flatMap((item) =>
    item.reviews?.map((review) => ({
      user: review.user || 'Anonymous',
      rating: review.rating || 0,
      comment: review.comment || 'No comment provided',
      day: item.foodItem?.day || 'Unknown',
      meal: item.foodItem?.slot
        ? item.foodItem.slot.charAt(0).toUpperCase() + item.foodItem.slot.slice(1)
        : 'Unknown',
      createdAt: new Date(review.createdAt || Date.now()),
    }))
  )
  .sort((a, b) => b.createdAt - a.createdAt)
  .slice(0, 3);

// Process Feedback Keywords
const keywordMap = {
  delicious: 70,
  tasty: 65,
  fresh: 55,
  healthy: 50,
  sweet: 45,
  cold: 40,
  oily: 35,
  bland: 30,
  overcooked: 25,
  spicy: 60,
};

const keywords = allReviews
  .flatMap((review) => review.comment.toLowerCase().split(/\W+/))
  .filter((word) => keywordMap[word])
  .reduce((acc, word) => {
    const existing = acc.find((k) => k.text === word);
    if (!existing) {
      acc.push({ text: word, size: keywordMap[word] });
    }
    return acc;
  }, []);

setMenuRatingsData({
  topDishes,
  worstDishes,
  averageRatings,
});
setRecentFeedback(allReviews);
setFeedbackKeywords(
  keywords.length > 0
    ? keywords
    : Object.entries(keywordMap).map(([text, size]) => ({ text, size }))
);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load feedback data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [messId]); // Depend on messId to refetch if it changes

  // Helper to render star ratings
  const renderStars = (rating) => {
    return (
      <div role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${i < Math.floor(rating) ? 'filled' : i < rating ? 'half-filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading feedback data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button
          className="retry-btn"
          onClick={() => {
            setError(null);
            setIsLoading(true);
            setMessId(messId); // Trigger refetch
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-section">
      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Top Rated Dishes</h3>
          <div className="dish-rating-list">
            {menuRatingsData.topDishes.length === 0 ? (
              <p>No top-rated dishes available.</p>
            ) : (
              menuRatingsData.topDishes.map((dish, index) => (
                <div key={`${dish.name}-${index}`} className="dish-rating-item">
                  <div className="dish-info">
                    <h4>{dish.name}</h4>
                    <p>
                      {dish.day} {dish.meal}
                    </p>
                  </div>
                  <div className="dish-rating good">
                    <span className="rating-value">{dish.rating}</span>
                    <div className="rating-stars">{renderStars(dish.rating)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Lowest Rated Dishes</h3>
          <div className="dish-rating-list">
            {menuRatingsData.worstDishes.length === 0 ? (
              <p>No low-rated dishes available.</p>
            ) : (
              menuRatingsData.worstDishes.map((dish, index) => (
                <div key={`${dish.name}-${index}`} className="dish-rating-item">
                  <div className="dish-info">
                    <h4>{dish.name}</h4>
                    <p>
                      {dish.day} {dish.meal}
                    </p>
                  </div>
                  <div className="dish-rating bad">
                    <span className="rating-value">{dish.rating}</span>
                    <div className="rating-stars">{renderStars(dish.rating)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Average Ratings by Meal</h3>
          <div className="chart-container">
            {menuRatingsData.averageRatings.length === 0 ? (
              <p>No average ratings available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={menuRatingsData.averageRatings}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#4361ee" name="Avg. Rating" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Feedback Keywords</h3>
          <div className="word-cloud-container">
            <div className="word-cloud" role="region" aria-label="Feedback keywords">
              {feedbackKeywords.map((keyword, index) => (
                <span
                  key={`${keyword.text}-${index}`}
                  className="keyword"
                  style={{
                    fontSize: `${Math.max(12, keyword.size / 10)}px`,
                    opacity: keyword.size / 100 + 0.5,
                  }}
                >
                  {keyword.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card full-width">
        <h3>Recent Student Feedback</h3>
        <div className="feedback-list">
          {recentFeedback.length === 0 ? (
            <p>No recent feedback available.</p>
          ) : (
            recentFeedback.map((feedback, index) => (
              <div key={`${feedback.user}-${index}`} className="feedback-item">
                <div className="feedback-header">
                  <div className="student-info">
                    <img
                      src={`https://randomuser.me/api/portraits/men/${index + 32}.jpg`}
                      alt={`Profile picture for ${feedback.user}`}
                      onError={(e) => {
                        e.target.src = '/fallback-avatar.jpg'; // Fallback image
                      }}
                    />
                    <div>
                      <h4>{feedback.user}</h4>
                      <p>
                        S10{index + 24} • {feedback.meal} •{' '}
                        {feedback.createdAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="feedback-rating">
                    <span>{feedback.rating.toFixed(1)}</span>
                    <div className="stars">{renderStars(feedback.rating)}</div>
                  </div>
                </div>
                <p className="feedback-text">{feedback.comment}</p>
              </div>
            ))
          )}
        </div>
        <button className="view-all-btn" aria-label="View all feedback">
          View All Feedback
        </button>
      </div>
    </div>
  );
}

export default Feedback;