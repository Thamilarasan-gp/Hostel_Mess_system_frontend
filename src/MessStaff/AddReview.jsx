import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function AddReview() {
  const { foodItemId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/reviews/addReview", { foodItemId, rating, comment, user: "John Doe" });
    alert("Review added!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Review</h2>
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
      <textarea placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddReview;
