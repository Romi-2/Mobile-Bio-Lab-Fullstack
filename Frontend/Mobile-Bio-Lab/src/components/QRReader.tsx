import React, { useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface QRReaderProps {
  onResult: (data: string) => void;
}

const QRReader: React.FC<QRReaderProps> = ({ onResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"camera" | "upload" | null>(null);
  const [error, setError] = useState("");

  const startCamera = () => {
    if (videoRef.current) {
      const scanner = new QrScanner(videoRef.current, (result) => {
        onResult(result);
      });
      scanner.start().catch(() => {
        setError("❌ Cannot access camera. Use upload instead.");
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    try {
      const result = await QrScanner.scanImage(e.target.files[0]);
      onResult(result);
    } catch {
      setError("❌ Failed to decode QR image");
    }
  };

  return (
    <div className="qr-reader">
      {!mode && (
        <div className="qr-choice">
          <button onClick={() => { setMode("camera"); startCamera(); }}>
            📷 Use Camera
          </button>
          <button onClick={() => setMode("upload")}>
            📂 Upload Image
          </button>
        </div>
      )}

      {mode === "camera" && (
        <div>
          <video ref={videoRef} style={{ width: "100%", border: "1px solid #ccc" }} />
        </div>
      )}

      {mode === "upload" && (
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QRReader;
