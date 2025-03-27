import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, Check, X, RefreshCw } from "lucide-react";

const QRScanner = ({ setTokenHistory }) => {
  const [tokenData, setTokenData] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const scannerRef = useRef(null);
  const qrScanner = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
        if (!studentInfo || !studentInfo.id) {
          console.error("Student ID not found in localStorage");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/token/gettokens/${studentInfo.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        console.log("Fetched Token Data:", data); // Debugging
        setTokenData(data);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const formatDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    return isNaN(parsedDate) ? "Invalid Date" : new Date(parsedDate).toLocaleString();
  };

  useEffect(() => {
    if (!qrScanner.current) {
      qrScanner.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      qrScanner.current.render(
        (decodedText) => {
          qrScanner.current.clear();
          console.log("Scanned QR Code:", decodedText); // Debugging

          const trimmedDecodedText = decodedText.trim().toLowerCase();
          const trimmedTokenText = tokenData?.secret_text?.trim().toLowerCase() || "";

          console.log("Trimmed Scanned:", trimmedDecodedText); // Debugging
          console.log("Trimmed Token:", trimmedTokenText); // Debugging

          setScanResult(decodedText);

          // Compare after normalizing case and removing extra spaces
          if (trimmedDecodedText === trimmedTokenText) {
            setScanSuccess(true);
          } else {
            setScanSuccess(false);
          }

          const today = new Date();
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setTokenHistory((prev) => ({
            ...prev,
            [dateStr]: { used: true, token: decodedText },
          }));
        },
        (errorMessage) => {
          console.warn("QR Scan Error:", errorMessage);
        }
      );
    }

    return () => {
      if (qrScanner.current) {
        qrScanner.current.clear();
        qrScanner.current = null;
      }
    };
  }, [tokenData]);

  const resetScanner = () => {
    setScanResult(null);
    setScanSuccess(null);

    if (qrScanner.current) {
      qrScanner.current.clear();
      qrScanner.current = null;
    }

    qrScanner.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    qrScanner.current.render(
      (decodedText) => {
        qrScanner.current.clear();
        console.log("Scanned QR Code:", decodedText); // Debugging

        const trimmedDecodedText = decodedText.trim().toLowerCase();
        const trimmedTokenText = tokenData?.secret_text?.trim().toLowerCase() || "";

        console.log("Trimmed Scanned:", trimmedDecodedText); // Debugging
        console.log("Trimmed Token:", trimmedTokenText); // Debugging

        setScanResult(decodedText);

        if (trimmedDecodedText === trimmedTokenText) {
          setScanSuccess(true);
        } else {
          setScanSuccess(false);
        }
      },
      (errorMessage) => {
        console.warn("QR Scan Error:", errorMessage);
      }
    );
  };

  return (
    <div className="qr-scanner-section">
      <div className="section-header">
        <h2 className="section-title">
          Mess QR Scanner
          <QrCode size={24} className="section-icon" />
        </h2>
      </div>

      <div className="scanner-container">
        {!scanResult ? (
          <div className="token-display">
            <h3>Today's Token:</h3>
            <p className="token-text">{tokenData ? tokenData.secret_text : "Loading..."}</p>
            
            {tokenData && (
              <div className="token-info">
                <p><strong>Valid From:</strong> {formatDate(tokenData.valid_from)}</p>
                <p><strong>Valid Until:</strong> {formatDate(tokenData.valid_until)}</p>
              </div>
            )}

            <div id="qr-reader" className="scanner-box"></div>
          </div>
        ) : (
          <div className={`scan-result ${scanSuccess ? "success" : "error"}`}>
            <div className="result-icon">
              {scanSuccess ? <Check size={48} /> : <X size={48} />}
            </div>
            <h3 className="result-title">
              {scanSuccess ? "Successfully Verified! ✅" : "Invalid Token ❌"}
            </h3>
            <p className="result-text">{scanResult}</p>
            {scanSuccess && <p className="result-instruction">Show this token to the mess staff for snacks.</p>}
            <button onClick={resetScanner} className="scan-button">
              <RefreshCw size={16} />
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
