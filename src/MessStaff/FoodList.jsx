import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiurl";
import styles from './FoodList.module.css';

function  FoodList() {
  const [foodList, setFoodList] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [error, setError] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/timetable/getTimetable/67e4359d5f086fb706b8385f`)
      .then((res) => {
        // Extract the timetable for the selected day
        const dayTimetable = res.data.timetable.timetable[selectedDay] || {};
        // Transform into an array of { slot, items }
        const formattedFoodList = Object.entries(dayTimetable).map(([slot, items]) => ({
          slot,
          items: [items], // Convert string to array for consistency
        }));
        setFoodList(formattedFoodList);
      })
      .catch((err) => {
        console.error("Error fetching timetable:", err);
        setError("Failed to load the timetable. Please try again later.");
      });
  }, [selectedDay]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>Food List</h2>
        <div className={styles.daySelector}>
          <label htmlFor="daySelect" className={styles.dayLabel}>Select Day: </label>
          <select 
            id="daySelect" 
            value={selectedDay} 
            onChange={handleDayChange}
            className={styles.select}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <h3 className={styles.dayHeader}>{selectedDay} Menu</h3>
        {foodList.length === 0 ? (
          <p className={styles.emptyMessage}>No food items available for {selectedDay}.</p>
        ) : (
          <div className={styles.menuContainer}>
            {foodList.map((food) => (
              <div key={food.slot} className={styles.menuItem}>
                <h4 className={styles.slotHeader}>{food.slot.toUpperCase()}</h4>
                <p className={styles.items}>{food.items.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  export default FoodList;