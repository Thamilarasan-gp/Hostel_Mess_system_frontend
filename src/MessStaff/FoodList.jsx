import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiurl";
import styles from './FoodList.module.css';

function FoodList() {
  const [foodList, setFoodList] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [messId, setMessId] = useState(null); // Added state for messId
  const [error, setError] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Fetch messId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("messId");
    if (id) {
      setMessId(id);
    } else {
      setError("No Mess ID found! Please log in again.");
    }
  }, []);

  // Fetch timetable when messId or selectedDay changes
  useEffect(() => {
    if (!messId) return; // Skip API call if messId is not available

    setError(null); // Clear previous errors
    axios
      .get(`${API_BASE_URL}/api/timetable/getTimetable/${messId}`)
      .then((res) => {
        // Safely access timetable data
        const timetable = res.data?.timetable?.timetable?.[selectedDay] || {};
        // Transform into an array of { slot, items }
        const formattedFoodList = Object.entries(timetable).map(([slot, items]) => ({
          slot,
          items: Array.isArray(items) ? items : items ? [items] : [], // Handle string or array
        }));
        setFoodList(formattedFoodList);
      })
      .catch((err) => {
        console.error("Error fetching timetable:", err);
        setError("Failed to load the timetable. Please try again later.");
      });
  }, [messId, selectedDay]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  if (error) {
    return (
      <div className={styles.error}>
        {error}
        <button
          className={styles.retryButton}
          onClick={() => setSelectedDay(selectedDay)} // Trigger refetch
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Food List</h2>
      <div className={styles.daySelector}>
        <label htmlFor="daySelect" className={styles.dayLabel}>
          Select Day:
        </label>
        <select
          id="daySelect"
          value={selectedDay}
          onChange={handleDayChange}
          className={styles.select}
          aria-label="Select a day to view the menu"
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
              <p className={styles.items}>
                {food.items.length > 0 ? food.items.join(", ") : "No items available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodList;