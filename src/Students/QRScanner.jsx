import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Check, X, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../apiurl';
// Import the CSS file
import './QrScanner.css';

const QRScanner = ({ setTokenHistory }) => {
  const [tokenData, setTokenData] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [tokenUsed, setTokenUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const qrScanner = useRef(null);

  // Fetch token and token history
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (!studentInfo || !studentInfo.id) {
          throw new Error('Student ID not found in localStorage');
        }

        // Fetch token
        const response = await fetch(`${API_BASE_URL}/api/token/gettokens/${studentInfo.id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch token: ${response.status}`);
        }

        const data = await response.json();
        setTokenData(data);

        // Fetch token history
        const tokenHistoryResponse = await fetch(`${API_BASE_URL}/api/tokenhistory/status/${studentInfo.id}`);
        if (tokenHistoryResponse.ok) {
          const tokenHistoryData = await tokenHistoryResponse.json();
          setTokenUsed(tokenHistoryData.tokenUseStatus);
          setTokenHistory((prev) => ({
            ...prev,
            [studentInfo.id]: {
              tokenUseStatus: tokenHistoryData.tokenUseStatus,
              tokenHistory: tokenHistoryData.tokenHistory || [],
              token: tokenHistoryData.token,
            },
          }));
        } else if (tokenHistoryResponse.status === 404) {
          setTokenUsed(false);
          setTokenHistory((prev) => ({
            ...prev,
            [studentInfo.id]: {
              tokenUseStatus: false,
              tokenHistory: [],
              token: null,
            },
          }));
        } else {
          throw new Error(`Failed to fetch token history: ${tokenHistoryResponse.status}`);
        }
      } catch (error) {
        console.error('Error fetching token or token history:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [setTokenHistory]);

  const formatDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    return isNaN(parsedDate) ? 'Invalid Date' : new Date(parsedDate).toLocaleString();
  };

  const saveTokenHistory = async (studentId, token, tokenUseStatus) => {
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const payload = {
        studentId,
        token,
        tokenUseStatus,
        dateUsed: dateStr,
      };

      const response = await fetch(`${API_BASE_URL}/api/tokenhistory/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save token history: ${response.status}`);
      }

      console.log('Token history saved successfully');
      setTokenUsed(tokenUseStatus);
      setTokenHistory((prev) => ({
        ...prev,
        [studentId]: {
          tokenUseStatus,
          tokenHistory: [
            ...(prev[studentId]?.tokenHistory || []),
            { dateUsed: dateStr, timeUsed: new Date().toTimeString().split(' ')[0] },
          ],
          token,
        },
      }));
    } catch (error) {
      console.error('Error saving token history:', error);
    }
  };

  const normalizeText = (text) =>
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\x20-\x7E]/g, '');

  const isTokenValid = () => {
    if (!tokenData) return false;
    const now = new Date();
    const validFrom = new Date(tokenData.valid_from);
    const validUntil = new Date(tokenData.valid_until);
    return now >= validFrom && now <= validUntil;
  };

  // Initialize the QR scanner
  useEffect(() => {
    if (!tokenData || tokenUsed || loading) {
      return;
    }

    if (qrScanner.current) {
      qrScanner.current.clear();
      qrScanner.current = null;
    }

    qrScanner.current = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);

    qrScanner.current.render(
      (decodedText) => {
        qrScanner.current.clear();
        
        let tokenFromQR = decodedText;
        try {
          if (decodedText.startsWith('{') || decodedText.startsWith('[')) {
            tokenFromQR = JSON.parse(decodedText).token;
          } else if (decodedText.includes('token=')) {
            tokenFromQR = new URLSearchParams(decodedText.split('?')[1]).get('token');
          }
        } catch (e) {
          console.error('Error parsing QR code:', e);
        }

        const trimmedDecodedText = normalizeText(tokenFromQR);
        const trimmedTokenText = normalizeText(tokenData?.secret_text || '');

        setScanResult(decodedText);
        const isMatch = trimmedDecodedText === trimmedTokenText && isTokenValid();
        setScanSuccess(isMatch);

        if (isMatch) {
          const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
          if (studentInfo && studentInfo.id) {
            saveTokenHistory(studentInfo.id, decodedText, true);
          } else {
            console.error('Student ID not found for saving token history');
          }
        }
      },
      (errorMessage) => {
        console.warn('QR Scan Error:', errorMessage);
      }
    );

    return () => {
      if (qrScanner.current) {
        qrScanner.current.clear();
        qrScanner.current = null;
      }
    };
  }, [tokenData, tokenUsed, loading]);

  const resetScanner = async () => {
    try {
      const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
      if (!studentInfo || !studentInfo.id) {
        console.error('Student ID not found in localStorage');
        setScanResult(null);
        setScanSuccess(null);
        return;
      }

      // Re-fetch token use status
      const tokenHistoryResponse = await fetch(`${API_BASE_URL}/api/tokenhistory/status/${studentInfo.id}`);
      let tokenHistoryData = { tokenUseStatus: false, tokenHistory: [], token: null };

      if (tokenHistoryResponse.ok) {
        tokenHistoryData = await tokenHistoryResponse.json();
      } else if (tokenHistoryResponse.status !== 404) {
        throw new Error(`Failed to fetch token history: ${tokenHistoryResponse.status}`);
      }

      setTokenUsed(tokenHistoryData.tokenUseStatus);
      setTokenHistory((prev) => ({
        ...prev,
        [studentInfo.id]: {
          tokenUseStatus: tokenHistoryData.tokenUseStatus,
          tokenHistory: tokenHistoryData.tokenHistory || [],
          token: tokenHistoryData.token,
        },
      }));
      setScanResult(null);
      setScanSuccess(null);

      // Force re-mount the scanner by clearing and setting data
      if (qrScanner.current) {
        qrScanner.current.clear();
        qrScanner.current = null;
      }
      
      // Small timeout to ensure DOM is updated before re-initializing
      setTimeout(() => {
        const tempData = tokenData;
        setTokenData(null);
        setTimeout(() => {
          setTokenData(tempData);
        }, 100);
      }, 100);
      
    } catch (error) {
      console.error('Error checking token status:', error);
      setScanResult(null);
      setScanSuccess(null);
    }
  };

  if (loading) {
    return (
      <div className="qr-scanner-section">
        <div className="section-header">
          <h2 className="section-title">
            Mess QR Scanner
            <QrCode size={24} className="section-icon" />
          </h2>
        </div>
        <div className="scanner-container">
          <div className="token-loading">
            <p>Loading token information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qr-scanner-section">
        <div className="section-header">
          <h2 className="section-title">
            Mess QR Scanner
            <QrCode size={24} className="section-icon" />
          </h2>
        </div>
        <div className="scanner-container">
          <div className="token-used-message">
            <X size={48} className="result-icon" />
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="scan-button">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-scanner-section">
      <div className="section-header">
        <h2 className="section-title">
          Mess QR Scanner
          <QrCode size={24} className="section-icon" />
        </h2>
      </div>

      <div className="scanner-container">
        {scanResult ? (
          <div className={`scan-result ${scanSuccess ? 'success' : 'error'}`}>
            <div className="result-icon">{scanSuccess ? <Check size={48} /> : <X size={48} />}</div>
            <h3 className="result-title">{scanSuccess ? 'Successfully Verified! ✅' : 'Invalid Token ❌'}</h3>
            <p className="result-text">{scanResult}</p>
            {scanSuccess && <p className="result-instruction">Show this token to the mess staff for snacks.</p>}
            <div className="debug-info">
              <p><strong>Scanned:</strong> {scanResult}</p>
              <p><strong>Expected:</strong> {tokenData?.secret_text}</p>
            </div>
            <button onClick={resetScanner} className="scan-button">
              <RefreshCw size={16} />
              Scan Again
            </button>
          </div>
        ) : tokenUsed ? (
          <div className="token-used-message">
            <X size={48} className="result-icon" />
            <h3>You have already used a ticket</h3>
            <p>Please try again tomorrow.</p>
            <button onClick={resetScanner} className="scan-button">
              <RefreshCw size={16} />
              Check Again
            </button>
          </div>
        ) : (
          <div className="token-display">
            <h3>Today's Token:</h3>
            <p className="token-text">{tokenData?.secret_text}</p>

            <div className="token-info">
              <p>
                <strong>Valid From:</strong> {formatDate(tokenData?.valid_from)}
              </p>
              <p>
                <strong>Valid Until:</strong> {formatDate(tokenData?.valid_until)}
              </p>
            </div>

            <div id="qr-reader" className="scanner-box"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;