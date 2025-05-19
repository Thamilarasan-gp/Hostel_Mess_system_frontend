import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import "./AddReview.module.css"; // Don't forget to create this CSS file with the styles below
import { API_BASE_URL } from "../apiurl";
function AddReview() {
  const { foodItemId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API_BASE_URL}/api/reviews/addReview`, {
        foodItemId,
        rating,
        comment,
        user: "John Doe" // In a real app, this would come from authentication
      });
      
      setSuccess(true);
      setComment("");
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit} className="review-form">
        <h2 className="review-title">Share Your Experience</h2>
        
        <div className="rating-container">
          <p className="rating-label">Your Rating</p>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= rating ? "active" : ""}`}
                onClick={() => handleStarClick(star)}
                aria-label={`Rate ${star} stars`}
              >
                <Star className="star-icon" size={24} fill={star <= rating ? "#FFD700" : "none"} color={star <= rating ? "#FFD700" : "#CCCCCC"} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="comment-container">
          <label htmlFor="review-comment" className="comment-label">
            Your Review
          </label>
          <textarea
            id="review-comment"
            className="comment-textarea"
            placeholder="Tell us what you liked or didn't like about this dish..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
        
        {success && (
          <div className="success-message">
            Thank you for your review! Your feedback helps improve our service.
          </div>
        )}
      </form>
    </div>
  );
}

export default AddReview;