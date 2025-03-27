import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function FoodList() {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/food/getFoodByDay/Monday").then((res) => setFoodList(res.data));
  }, []);

  return (
    <div>
      <h2>Monday Food List</h2>
      {foodList.map((food) => (
        <div key={food._id}>
          <h3>{food.slot.toUpperCase()}</h3>
          <p>{food.items.join(", ")}</p>
          <Link to={`/add-review/${food._id}`}>Add Review</Link>
          <Link to={`/reviews/${food._id}`}>View Reviews</Link>
        </div>
      ))}
    </div>
  );
}

export default FoodList;
