import React, { useState, useEffect } from 'react';
import './Feedback.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

function Feedback() {
  const [menuRatingsData, setMenuRatingsData] = useState({
    topDishes: [],
    worstDishes: [],
    averageRatings: [],
  });
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [feedbackKeywords, setFeedbackKeywords] = useState([]);

  // API endpoint
  const API_URL = 'http://localhost:5000/api/reviews/mess/67e4359d5f086fb706b8385f/food-items-reviews';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const foodItemsWithReviews = data.foodItemsWithReviews;

        // Process data for Top Rated and Lowest Rated Dishes
        const dishesWithRatings = foodItemsWithReviews
          .filter(item => item.reviews.length > 0) // Only include items with reviews
          .map(item => {
            const averageRating =
              item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length;
            return {
              name: item.foodItem.items.join(', '), // Join items for display
              day: item.foodItem.day,
              meal: item.foodItem.slot.charAt(0).toUpperCase() + item.foodItem.slot.slice(1),
              rating: averageRating.toFixed(1),
            };
          });

        // Sort for top and worst dishes
        const sortedDishes = [...dishesWithRatings].sort((a, b) => b.rating - a.rating);
        const topDishes = sortedDishes.slice(0, 3); // Top 3 dishes
        const worstDishes = sortedDishes.slice(-3).reverse(); // Bottom 3 dishes

        // Process data for Average Ratings by Meal
        const mealRatings = {};
        foodItemsWithReviews.forEach(item => {
          const slot = item.foodItem.slot;
          if (item.reviews.length > 0) {
            if (!mealRatings[slot]) {
              mealRatings[slot] = { total: 0, count: 0 };
            }
            const avgRating =
              item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length;
            mealRatings[slot].total += avgRating;
            mealRatings[slot].count += 1;
          }
        });

        const averageRatings = Object.keys(mealRatings).map(slot => ({
          category: slot.charAt(0).toUpperCase() + slot.slice(1),
          rating: (mealRatings[slot].total / mealRatings[slot].count).toFixed(1),
        }));

        // Process Recent Student Feedback
        const allReviews = foodItemsWithReviews
          .flatMap(item =>
            item.reviews.map(review => ({
              user: review.user,
              rating: review.rating,
              comment: review.comment,
              day: item.foodItem.day,
              meal: item.foodItem.slot.charAt(0).toUpperCase() + item.foodItem.slot.slice(1),
              createdAt: new Date(review.createdAt),
            }))
          )
          .sort((a, b) => b.createdAt - a.createdAt) // Sort by latest
          .slice(0, 3); // Get top 3 recent reviews

        // Simulate Feedback Keywords (since API doesn't provide this)
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
          .flatMap(review => review.comment.toLowerCase().split(/\W+/))
          .filter(word => keywordMap[word])
          .reduce((acc, word) => {
            if (!acc.some(k => k.text === word)) {
              acc.push({ text: word, size: keywordMap[word] });
            }
            return acc;
          }, []);

        // Update state
        setMenuRatingsData({
          topDishes,
          worstDishes,
          averageRatings,
        });
        setRecentFeedback(allReviews);
        setFeedbackKeywords(keywords.length > 0 ? keywords : [
          { text: 'Delicious', size: 70 },
          { text: 'Spicy', size: 60 },
          { text: 'Fresh', size: 55 },
          { text: 'Cold', size: 40 },
          { text: 'Oily', size: 35 },
          { text: 'Tasty', size: 65 },
          { text: 'Sweet', size: 45 },
          { text: 'Bland', size: 30 },
          { text: 'Overcooked', size: 25 },
          { text: 'Healthy', size: 50 },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Helper to render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : i < rating ? 'half-filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="feedback-section">
      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Top Rated Dishes</h3>
          <div className="dish-rating-list">
            {menuRatingsData.topDishes.map((dish, index) => (
              <div key={index} className="dish-rating-item">
                <div className="dish-info">
                  <h4>{dish.name}</h4>
                  <p>{dish.day} {dish.meal}</p>
                </div>
                <div className="dish-rating good">
                  <span className="rating-value">{dish.rating}</span>
                  <div className="rating-stars">{renderStars(dish.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Lowest Rated Dishes</h3>
          <div className="dish-rating-list">
            {menuRatingsData.worstDishes.map((dish, index) => (
              <div key={index} className="dish-rating-item">
                <div className="dish-info">
                  <h4>{dish.name}</h4>
                  <p>{dish.day} {dish.meal}</p>
                </div>
                <div className="dish-rating bad">
                  <span className="rating-value">{dish.rating}</span>
                  <div className="rating-stars">{renderStars(dish.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <h3>Average Ratings by Meal</h3>
          <div className="chart-container">
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
          </div>
        </div>

        <div className="analytics-card">
          <h3>Feedback Keywords</h3>
          <div className="word-cloud-container">
            <div className="word-cloud">
              {feedbackKeywords.map((keyword, index) => (
                <span
                  key={index}
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
          {recentFeedback.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <div className="feedback-header">
                <div className="student-info">
                  <img
                    src={`https://randomuser.me/api/portraits/men/${index + 32}.jpg`} // Placeholder
                    alt="Student"
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
          ))}
        </div>
        <button className="view-all-btn">View All Feedback</button>
      </div>
    </div>
  );
}

export default Feedback;