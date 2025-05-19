import { useState, useEffect } from "react";
import axios from "axios";
import { Star, BarChart2, MessageSquare, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "../apiurl";
import "./ReviewStatus.css";

function ReviewStatus({ foodItemId }) {
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const fooditemid = localStorage.getItem('currentFoodItemId');

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${API_BASE_URL}/api/reviews/foodItem/${fooditemid}`
        );
        setReviewStats(response.data);
        console.log("API Response:", response.data);

      } catch (err) {
        console.error("Error fetching review stats:", err);
        setError("Failed to load review statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchReviewStats();
  }, [foodItemId]);

  const renderRatingStars = (rating) => {
    return (
      <div className="review-widget__star-display">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`review-widget__star ${i < Math.floor(rating) ? "filled" : ""} ${
              i === Math.floor(rating) && rating % 1 >= 0.5 ? "half-filled" : ""
            }`}
            size={16}
          />
        ))}
        <span className="review-widget__rating-value">
        {!isNaN(Number(rating)) ? Number(rating).toFixed(1) : "N/A"}

        </span>
      </div>
    );
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) return (
    <div className="review-widget__loading">
      <div className="review-widget__spinner"></div>
      <p>Loading review statistics...</p>
    </div>
  );

  if (error) return (
    <div className="review-widget__error">
      <p>⚠️ {error}</p>
    </div>
  );

  if (!reviewStats) return (
    <div className="review-widget__empty">
      <MessageSquare size={18} />
      <p>No reviews yet</p>
    </div>
  );

  const { totalReviews, averageRating, ratingBreakdown } = reviewStats;

  return (
    <div className={`review-widget ${expanded ? "expanded" : ""}`}>
      <div 
        className="review-widget__header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="review-widget__title">
          <BarChart2 size={20} className="review-widget__title-icon" />
          <h3>Review Summary</h3>
        </div>
        <ChevronRight className={`review-widget__expand-icon ${expanded ? "expanded" : ""}`} />
      </div>
      
      <div className="review-widget__summary">
        <div className="review-widget__metric">
          <span className="review-widget__metric-label">Average</span>
          {renderRatingStars(averageRating)}
        </div>
        <div className="review-widget__metric">
          <span className="review-widget__metric-label">Total</span>
          <span className="review-widget__metric-value">{totalReviews} reviews</span>
        </div>
      </div>

      {expanded && (
        <div className="review-widget__details">
          <div className="review-widget__distribution">
            <h4>Rating Distribution</h4>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="review-widget__bar-container">
                <div className="review-widget__bar-label">
                  <span>{star} ★</span>
                </div>
                <div className="review-widget__bar-bg">
                  <div 
                    className="review-widget__bar-fill"
                    style={{
                      width: `${calculatePercentage(ratingBreakdown[star] || 0, totalReviews)}%`
                    }}
                  ></div>
                </div>
                <div className="review-widget__bar-count">
                  {ratingBreakdown[star] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewStatus;