// src/pages/BLEDevicesPage.tsx
import React, { useState, useEffect } from "react";
// ❌ remove this import
// import { useNavigate } from "react-router-dom";
import { useBLE } from "../services/BLEDService";
import type { BLEDevice, SensorData } from "../services/BLEDService";
import "../style/BLEDevices.css";

const BLEDevicesPage: React.FC = () => {
  // ❌ remove this unused line
  // const navigate = useNavigate();

  const {
    connectedDevice,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sensorData,
    error,
  } = useBLE();

  const [deviceHistory, setDeviceHistory] = useState<BLEDevice[]>([]);
  const [readings, setReadings] = useState<SensorData[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bleHistory");
    if (saved) setDeviceHistory(JSON.parse(saved));
  }, []);

 useEffect(() => {
  if (connectedDevice) {
    setDeviceHistory((prev) => {
      if (prev.some((d) => d.id === connectedDevice.id)) return prev;
      const newHistory = [connectedDevice, ...prev].slice(0, 5);
      localStorage.setItem("bleHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  }
}, [connectedDevice]);


  useEffect(() => {
    if (isRecording && sensorData) setReadings((prev) => [...prev, sensorData]);
  }, [sensorData, isRecording]);

  const exportCSV = () => {
    const csv =
      "Timestamp,Temperature,pH,Salinity\n" +
      readings
        .map(
          (r) =>
            `${new Date(r.timestamp).toLocaleString()},${r.temperature || ""},${r.pH || ""},${r.salinity || ""}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sensor_data.csv";
    link.click();
  };

  return (
    <div className="ble-page">
      <h1>📡 BLE Device Manager</h1>
      <p>Connect to BLE sensors and read live environmental data.</p>

      <div className="ble-card">
        {!isConnected ? (
          <button onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Scanning..." : "🔍 Scan & Connect"}
          </button>
        ) : (
          <>
            <h2>Connected: {connectedDevice?.name}</h2>
            <p>ID: {connectedDevice?.id}</p>
            <button onClick={disconnect}>🔌 Disconnect</button>
          </>
        )}
        {error && <p className="error">❌ {error}</p>}
      </div>

      {isConnected && (
        <div className="data-section">
          <h2>Live Sensor Data</h2>
          {sensorData ? (
            <div className="sensor-grid">
              {sensorData.temperature && <div>🌡️ {sensorData.temperature.toFixed(2)} °C</div>}
              {sensorData.pH && <div>⚗️ pH: {sensorData.pH.toFixed(2)}</div>}
              {sensorData.salinity && <div>🧂 {sensorData.salinity.toFixed(2)} PSU</div>}
            </div>
          ) : (
            <p>Waiting for sensor updates...</p>
          )}

          <div className="record-buttons">
            {!isRecording ? (
              <button onClick={() => setIsRecording(true)}>🔴 Start Recording</button>
            ) : (
              <button onClick={() => setIsRecording(false)}>⏹️ Stop Recording</button>
            )}
            {readings.length > 0 && (
              <button onClick={exportCSV}>📥 Export CSV ({readings.length})</button>
            )}
          </div>
        </div>
      )}

      {deviceHistory.length > 0 && (
        <div className="history">
          <h3>Recent Devices</h3>
          <ul>
            {deviceHistory.map((d) => (
              <li key={d.id}>
                {d.name} – {d.id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BLEDevicesPage;
