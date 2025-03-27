import React from 'react'

function Tokenscanner() {
    
      useEffect(() => {
        if (!scannerRef.current) {
          scannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
          );
    
          scannerRef.current.render(
            (decodedText) => {
              scannerRef.current.clear();
              setScanResult(decodedText);
              setScanSuccess(true);
    
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
          console.log(localStorage.getItem("studentToken"));
          console.log(localStorage.getItem("studentInfo"));
        }
    
        return () => {
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
        };
      }, []);
    
      const resetScanner = () => {
        setScanResult(null);
        setScanSuccess(null);
        scannerRef.current.render();
      };
    
  return (
    <div>
      <div className="scanner-container">
              {!scanResult ? (
                <div className="token-display">
                  <h3>Today's Token: <span className="token-text">{token}</span></h3>
                  <div id="qr-reader" className="scanner-box"></div>
                </div>
              ) : (
                <div className={`scan-result ${scanSuccess ? "success" : "error"}`}>
                  <div className="result-icon">
                    {scanSuccess ? <Check size={48} /> : <X size={48} />}
                  </div>
                  <h3 className="result-title">{scanSuccess ? "Scan Successful!" : "Scan Failed"}</h3>
                  <p className="result-text">{scanResult}</p>
                  {scanSuccess && <p className="result-instruction">Show this token to the mess staff</p>}
                  <button onClick={resetScanner} className="scan-button">
                    <RefreshCw size={16} />
                    Scan Again
                  </button>
                </div>
              )}
            </div>
    </div>
  )
}

export default Tokenscanner