import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiurl";
import styles from './AddMess.module.css';

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
      const token = localStorage.getItem("wardenToken");

      if (!token) {
        alert("No token found! Please log in again.");
        return;
      }
      
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const { id: admin_id } = JSON.parse(jsonPayload);

      await axios.post(`${API_BASE_URL}/api/mess/add`, {
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
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Mess</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="name" 
            placeholder="Mess Name" 
            value={mess.name} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="block" 
            placeholder="Block" 
            value={mess.block} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="number" 
            name="capacity" 
            placeholder="Capacity" 
            value={mess.capacity} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="incharge" 
            placeholder="Incharge" 
            value={mess.incharge} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            name="contact" 
            placeholder="Contact" 
            value={mess.contact} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={mess.password} 
            onChange={handleChange} 
            required 
            className={styles.input}
          />
        </div>
        
        <button type="submit" className={styles.button}>Add Mess</button>
      </form>
    </div>
  );
};

export default AddMess;