import { useLocation } from "react-router-dom";

const QRGenerate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qrCode = queryParams.get("qrCode");

  return (
    <div>
      <h2>Generated QR Code</h2>
      {qrCode ? (
        <img src={qrCode} alt="QR Code" />
      ) : (
        <p>No QR Code available</p>
      )}
    </div>
  );
};

export default QRGenerate;
