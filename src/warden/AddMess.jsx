import { useState } from "react";
import axios from "axios";

const AddMess = () => {
  const [mess, setMess] = useState({
    name: "",
    block: "",
    capacity: "",
    incharge: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) => {
    setMess({ ...mess, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("wardenToken"); // JWT Token

      if (!token) {
        alert("No token found! Please log in again.");
        return;
      }
      // Decode JWT to extract admin ID
      const base64Url = token.split(".")[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const { id: admin_id } = JSON.parse(jsonPayload);
      console.log("Admin ID:", admin_id);

      const response = await axios.post("http://localhost:5000/api/mess/add", {
        ...mess,
        admin_id,
      });

      alert("Mess added successfully!");
      setMess({
        name: "",
        block: "",
        capacity: "",
        incharge: "",
        contact: "",
        password: "",
      });
    } catch (error) {
      console.error("Error adding mess:", error);
      alert("Failed to add mess.");
    }
  };

  return (
    <div>
      <h2>Add Mess</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Mess Name" 
          value={mess.name} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="block" 
          placeholder="Block" 
          value={mess.block} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="number" 
          name="capacity" 
          placeholder="Capacity" 
          value={mess.capacity} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="incharge" 
          placeholder="Incharge" 
          value={mess.incharge} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="text" 
          name="contact" 
          placeholder="Contact" 
          value={mess.contact} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={mess.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Add Mess</button>
      </form>
    </div>
  );
};

export default AddMess;
