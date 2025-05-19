import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddTimetable.css";
import { API_BASE_URL } from "../apiurl";
function AddTimetable() {
  const [day, setDay] = useState("");
  const [activeSlots, setActiveSlots] = useState({
    breakfast: false,
    lunch: false,
    snacks: false,
    dinner: false,
  });
  const [slots, setSlots] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });
  const [currentItem, setCurrentItem] = useState({
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [messid, setMessid] = useState("");

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday",
  ];

  // Fetch Mess ID from local storage
  useEffect(() => {
    const id = localStorage.getItem("messId"); // Removed JSON.parse
    if (id) {
      setMessid(id);
    } else {
      alert("No Mess ID found! Please log in again.");
    }
  }, []);

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const toggleSlot = (slot) => {
    setActiveSlots((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  const handleItemChange = (slot, value) => {
    setCurrentItem((prev) => ({
      ...prev,
      [slot]: value,
    }));
  };

  const addItem = (slot) => {
    if (currentItem[slot].trim() === "") return;

    setSlots((prev) => ({
      ...prev,
      [slot]: [...prev[slot], currentItem[slot]],
    }));

    setCurrentItem((prev) => ({
      ...prev,
      [slot]: "",
    }));
  };

  const removeItem = (slot, index) => {
    setSlots((prev) => ({
      ...prev,
      [slot]: prev[slot].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!messid) {
      alert("No Mess ID found! Please log in again.");
      return;
    }
  
    const formattedSlots = Object.fromEntries(
      Object.entries(slots).map(([slot, items]) => [slot, items.join(", ")])
    );
  
    try {
      const response = await axios.post(
      `${API_BASE_URL}/api/timetable/createTimetable`,
        { messid, day, slots: formattedSlots }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      alert("Failed to update timetable. Please try again.");
    }
  };
  

  return (
    <div className="add-timetable-container">
      <h2 className="add-timetable-title">Add Timetable</h2>
      <form onSubmit={handleSubmit} className="add-timetable-form">
        <input
          type="text"
          list="days"
          value={day}
          onChange={handleDayChange}
          className="add-timetable-day-input"
          placeholder="Select Day"
          required
        />
        <datalist id="days">
          {days.map((dayOption) => (
            <option key={dayOption} value={dayOption} />
          ))}
        </datalist>

        {Object.keys(slots).map((slot) => (
          <div key={slot} className="add-timetable-slot">
            <label>{slot}</label>
            <input
              type="checkbox"
              checked={activeSlots[slot]}
              onChange={() => toggleSlot(slot)}
            />

            {activeSlots[slot] && (
              <div className="slot-details-container">
                <div className="slot-input-container">
                  <input
                    type="text"
                    value={currentItem[slot]}
                    onChange={(e) => handleItemChange(slot, e.target.value)}
                    className="slot-input"
                    placeholder={`Enter ${slot} item`}
                  />
                  <button
                    type="button"
                    className="add-item-button"
                    onClick={() => addItem(slot)}
                  >
                    Add Item
                  </button>
                </div>

                {slots[slot].length > 0 && (
                  <div className="added-items-list">
                    {slots[slot].map((item, index) => (
                      <div key={index} className="added-item">
                        {item}
                        <button
                          type="button"
                          className="remove-item-button"
                          onClick={() => removeItem(slot, index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button type="submit" className="add-timetable-submit">
          Add Timetable
        </button>
      </form>
    </div>
  );
}

export default AddTimetable;
