import React, { useRef, useState } from "react";
import QrScanner from "qr-scanner";
import "../style/QRReader.css"; // Ensure you have this CSS file for styling

interface QRReaderProps {
  onResult: (data: string) => void;
}

const QRReader: React.FC<QRReaderProps> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);
  const [error, setError] = useState("");

  const startCamera = () => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onResult(result.data); // ✅ pass only the string
        },
        {
          onDecodeError: (err) => {
            console.log("Decode error:", err);
          },
        }
      );

      scanner.start().catch((err) => {
        console.error("Camera error:", err);
        setError("❌ Cannot access camera. Using upload instead.");
        setMode("upload"); // fallback automatically
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    try {
      const result = await QrScanner.scanImage(e.target.files[0], { returnDetailedScanResult: true });
      onResult(result.data); // ✅ pass only the string
    } catch {
      setError("❌ Failed to decode QR image");
    }
  };

  const resetMode = () => {
    setMode(null);
    setError("");
  };

  return (
    <div className="qr-reader-container">
      {!mode && (
        <div className="qr-choice">
          <button className="qr-btn" onClick={() => { setMode("camera"); startCamera(); }}>
            📷 Use Camera
          </button>
          <button className="qr-btn" onClick={() => setMode("upload")}>
            📂 Upload Image
          </button>
        </div>
      )}

      {mode === "camera" && (
        <div className="qr-camera">
          <video ref={videoRef} className="qr-video" />
          <button className="qr-back-btn" onClick={resetMode}>
            🔙 Back
          </button>
        </div>
      )}

      {mode === "upload" && (
        <div className="qr-upload">
          <input type="file" accept="image/*" onChange={handleUpload} className="qr-file-input" />
          <button className="qr-back-btn" onClick={resetMode}>
            🔙 Back
          </button>
        </div>
      )}

      {error && <p className="qr-error">{error}</p>}
    </div>
  );
};

export default QRReader;