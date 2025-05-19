import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MessageSquare, Star, AlertCircle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../apiurl";
import "./ReviewList.css";

function ReviewList() {
  const { foodItemId } = useParams(); // Get foodItemId from URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${API_BASE_URL}/api/reviews/foodItemId/${foodItemId}`
        );
        setReviews(response.data);
      } catch (err) {
        console.error("❌ [ERROR]:", err.message);
        setError("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [foodItemId]);

  return (
    <div className="review-list">
      <div className="review-list__header">
        <h2 className="review-list__title">
          <MessageSquare size={20} className="review-list__title-icon" />
          Customer Reviews
        </h2>
        <div className="review-list__stats">
          {reviews.length > 0 && `${reviews.length} reviews`}
        </div>
      </div>

      {loading && (
        <div className="review-list__loading">
          <div className="review-list__spinner"></div>
          <p>Loading reviews...</p>
        </div>
      )}
      
      {error && (
        <div className="review-list__error">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}
      
      {reviews.length === 0 && !loading && !error && (
        <div className="review-list__empty">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="review-list__grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-card__header">
                <div>
                  <h3 className="review-card__user">
                    {review.user}
                    {review.verified && (
                      <span className="review-card__verified">
                        <CheckCircle size={12} className="review-card__verified-icon" />
                        Verified Purchase
                      </span>
                    )}
                  </h3>
                  {review.date && (
                    <div className="review-card__date">{formatDate(review.date)}</div>
                  )}
                </div>
                <div className="review-card__rating">
                  <Star size={16} className="review-card__rating-star" />
                  {review.rating}/5
                </div>
              </div>
              <p className="review-card__content">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination could be added here in the future */}
    </div>
  );
}

export default ReviewList;