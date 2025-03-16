import React, { useState } from "react";
import "./TokenRecords.css";

const TokenRecords = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      studentName: "John Doe",
      rollNumber: "A12345",
      date: "2025-03-15",
      time: "09:30 AM",
      qrCodeUsed: true,
    },
    {
      id: 2,
      studentName: "Jane Smith",
      rollNumber: "B67890",
      date: "2025-03-15",
      time: "10:15 AM",
      qrCodeUsed: false,
    },
    // Add more sample records as needed
  ]);

  const exportData = () => {
    const csvContent = [
      ["Student Name", "Roll Number", "Date", "Time", "QR Code Used"],
      ...records.map((record) => [
        record.studentName,
        record.rollNumber,
        record.date,
        record.time,
        record.qrCodeUsed ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "token_records.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="token-records-container">
      <h1 className="token-records-title">Token Records</h1>

      <div className="table-container">
        <table className="token-records-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>QR Code Used</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.studentName}</td>
                <td>{record.rollNumber}</td>
                <td>{record.date}</td>
                <td>{record.time}</td>
                <td className={record.qrCodeUsed ? "qr-used" : "qr-not-used"}>
                  {record.qrCodeUsed ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={exportData} className="export-button">
        Export Data
      </button>
    </div>
  );
};

export default TokenRecords;
