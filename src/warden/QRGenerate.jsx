import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../apiurl';
import styles from './QRGenerate.module.css';

const QRGenerate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [qrCode, setQrCode] = useState(null); // Store base64 qr_code
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQrCode = async () => {
      const wardenInfo = JSON.parse(localStorage.getItem('wardenInfo'));
      const token = localStorage.getItem('wardenToken');

      if (!wardenInfo || !wardenInfo.id) {
        setError('Warden information not found.');
        setIsLoading(false);
        return;
      }

      console.log('Token:', token);
      console.log('Fetching from:', `${API_BASE_URL}/api/token/gettokens/warden/${wardenInfo.id}`);

      try {
        const response = await fetch(`${API_BASE_URL}/api/token/gettokens/warden/${wardenInfo.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Handle object response with qr_code
        if (data && data.qr_code) {
          setQrCode(data.qr_code);
        } else {
          setError('No QR code found in response.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCode();
  }, []);

  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode; // Use the base64 data directly
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading QR Code...</div>;
  }

  return (
    <div className={styles.qrContainer}>
      <h2 className={styles.title}>Generated QR Code</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {qrCode ? (
        <div className={styles.qrImageContainer}>
          <img src={qrCode} alt="QR Code" className={styles.qrImage} />
          <button onClick={handleDownload} className={styles.downloadButton}>
            Download QR Code
          </button>
        </div>
      ) : (
        <p className={styles.noQrMessage}>No QR Code available</p>
      )}
    </div>
  );
};

export default QRGenerate;