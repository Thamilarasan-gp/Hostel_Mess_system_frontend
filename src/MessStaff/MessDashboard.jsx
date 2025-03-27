import React from "react";
import AddTimetable from "./AddTimetable";

const MessDashboard = () => {
  const messName = localStorage.getItem("messName");

  return (
    <div>
      <h1>Welcome to {messName} Dashboard</h1>
      <AddTimetable/>
    </div>
  );
};

export default MessDashboard;
