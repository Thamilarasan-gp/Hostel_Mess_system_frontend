import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ReviewList() {
  const { foodItemId } = useParams(); // Get foodItemId from URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `http://localhost:5000/api/reviews/foodItemId/${foodItemId}`
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
    <div style={{ padding: "20px" }}>
      <h2>📝 Reviews</h2>

      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {reviews.length === 0 && !loading && !error && <p>No reviews yet.</p>}

      {!loading &&
        reviews.length > 0 &&
        reviews.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>{r.user}</strong> — <i>{r.comment}</i>
            </p>
            <p>⭐ {r.rating}/5</p>
          </div>
        ))}
    </div>
  );
}

export default ReviewList;
