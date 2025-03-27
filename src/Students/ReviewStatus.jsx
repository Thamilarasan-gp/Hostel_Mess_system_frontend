import { useState, useEffect } from "react";
import axios from "axios";

function ReviewStatus({ foodItemId }) {
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fooditemid = localStorage.getItem('currentFoodItemId');

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `http://localhost:5000/api/reviews/foodItem/${fooditemid}`
        );
        setReviewStats(response.data);
      } catch (err) {
        console.error("❌ [ERROR]:", err.message);
        setError("Failed to fetch review stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviewStats();
  }, [foodItemId]);

  if (loading) return <p>⏳ Loading review stats...</p>;
  if (error) return <p style={{ color: "red" }}>⚠️ {error}</p>;
  if (!reviewStats) return <p>No reviews available.</p>;

  const { totalReviews, averageRating, ratingBreakdown } = reviewStats;
 

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", marginTop: "10px" }}>
      <h4>📊 Review Status</h4>
      <p><strong>Average Rating:</strong> ⭐ {averageRating} / 5</p>
      <p><strong>Total Reviews:</strong> {totalReviews}</p>

      <ul>
        {Object.entries(ratingBreakdown).map(([star, count]) => (
          <li key={star}>
            {star} ⭐ - {count} reviews
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewStatus;
