import { useState, useEffect } from "react";
import axios from "axios";
import "./AddFood.css";

function AddFood() {
  const [day, setDay] = useState("Monday");
  const [slot, setSlot] = useState("breakfast");
  const [items, setItems] = useState("");
  const [timetable, setTimetable] = useState({});
  const [suggestions, setSuggestions] = useState({
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    slots: ["breakfast", "lunch", "snacks", "dinner"],
    items: []
  });

  const messid = localStorage.getItem("messId"); 
console.log(messid);
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        if (!messid) {
          alert("No Mess ID found. Please log in.");
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/timetable/getTimetable/${messid}`
        );
        setTimetable(response.data.timetable || {}); 
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  }, [messid]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (!messid) return;
        const response = await axios.get(
          `http://localhost:5000/api/timetable/getSuggestions/${messid}/${day}/${slot}`
        );
        
        const data = response.data.suggestions;
  
        let itemSuggestions = [];
        if (typeof data === "string") {
          itemSuggestions = data.split(",").map((item) => item.trim());
        } else if (Array.isArray(data)) {
          itemSuggestions = data;
        }

        setSuggestions(prev => ({
          ...prev,
          items: itemSuggestions
        }));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions(prev => ({
          ...prev,
          items: []
        }));
      }
    };
  
    fetchSuggestions();
  }, [messid, day, slot]);

  useEffect(() => {
    if (timetable[day] && timetable[day][slot]) {
      const existingItems = timetable[day][slot];
      setItems(existingItems.join(", ")); 
    } else {
      setItems(""); 
    }
  }, [day, slot, timetable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!messid) {
        alert("No Mess ID found. Please log in.");
        return;
      }
      if (items.trim() === "") {
        alert("Please add at least one food item.");
        return;
      }
      await axios.post("http://localhost:5000/api/food/addFood", {
        messId: messid,
        day,
        slot,
        items: items.split(",").map((item) => item.trim()), 
      });
      alert("Food added successfully!");
    } catch (error) {
      alert("Error adding food.");
      console.error("Submit Error:", error);
    }
  };
  

  const handleItemChange = (e) => {
    const value = e.target.value;
    const newItem = value.split(",").map((item) => item.trim());
    const uniqueItems = [...new Set(newItem)];
    setItems(uniqueItems.join(", ")); 
  };

  return (
    <div className="app-food-add-container">
      <h2 className="app-food-add-title">Add Food</h2>

      <form onSubmit={handleSubmit} className="app-food-add-form">
        <div className="app-food-form-group">
          <label className="app-food-form-label">Day:</label>
          <select 
            value={day} 
            onChange={(e) => setDay(e.target.value)}
            className="app-food-form-select"
            id="day-select"
          >
            {suggestions.days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <datalist id="day-suggestions">
            {suggestions.days.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        <div className="app-food-form-group">
          <label className="app-food-form-label">Slot:</label>
          <select 
            value={slot} 
            onChange={(e) => setSlot(e.target.value)}
            className="app-food-form-select"
            id="slot-select"
          >
            {suggestions.slots.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <datalist id="slot-suggestions">
            {suggestions.slots.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div className="app-food-form-group">
          <label className="app-food-form-label">Items (comma separated):</label>
          <input
  type="text"
  placeholder="Enter food items"
  value={items}
  onChange={handleItemChange}
  list="item-suggestions"
  className="app-food-form-input"
  id="items-input"
/>
<datalist id="item-suggestions" className="app-food-item-suggestions">
  {suggestions.items.map((item, index) => (
    <option key={index} value={item} className="app-food-select-option" />
  ))}
</datalist>
        </div>

        <button 
          type="submit" 
          className="app-food-submit-button"
        >
          Add / Update Food
        </button>
      </form>
    </div>
  );
}

export default AddFood;