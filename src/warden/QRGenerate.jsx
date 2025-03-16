import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./QRGenerate.css"; // Import CSS

export default function QRGenerate() {
  const [month, setMonth] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const monthName = today.toLocaleString("default", { month: "long" });

    const firstDay = `${year}-${today.getMonth() + 1}-01`;
    const lastDay = new Date(year, today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setMonth(`${monthName} ${year}`);
    setValidFrom(firstDay);
    setValidUntil(lastDay);
  }, []);

  const generateQR = () => {
    const qrContent = `Month: ${month}\nValid From: ${validFrom}\nValid Until: ${validUntil}`;
    setQrData(qrContent);
  };

  const downloadQR = () => {
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "qr_code.png";
      link.click();
    };
  };

  return (
    <div className="qr-container">
      <div className="qr-card">
        <h2 className="qr-title">QR Code Generator</h2>
        <p className="qr-text">Month: {month}</p>
        <p className="qr-text">Valid From: {validFrom}</p>
        <p className="qr-text">Valid Until: {validUntil}</p>
        
        <button onClick={generateQR} className="qr-button generate-btn">
          Generate QR Code
        </button>

        {qrData && (
          <div className="qr-code">
            <QRCode value={qrData} size={200} />
            <button onClick={downloadQR} className="qr-button download-btn">
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
