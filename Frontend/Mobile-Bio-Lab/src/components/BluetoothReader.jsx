// src/components/BluetoothReader.jsx
import React, { useState } from "react";
import "../style/BluetoothReader.css";


const BluetoothReader = () => {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  async function connectToSensor() {
    try {
      setMessage("🔍 Searching for Bluetooth device...");

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"] // change to your sensor’s UUID later
      });

      setMessage(`🔗 Connected to ${device.name || "Unnamed Device"}`);

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("battery_service");
      const characteristic = await service.getCharacteristic("battery_level");

      // Read sensor value once
      const value = await characteristic.readValue();
      const sensorValue = value.getUint8(0);
      setData(sensorValue);

      setMessage("✅ Data received. Sending to server...");

      // ⬇️ Send sensor data to your backend API
      await fetch("http://localhost:5000/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: sensorValue, // change key name based on your sensor
          timestamp: new Date().toISOString()
        }),
      });

      setMessage("✅ Sensor data saved to database!");

    } catch (error) {
      console.error(error);
      setMessage("❌ Bluetooth connection failed.");
    }
  }

  return (
    <div className="ble-container">
      <button onClick={connectToSensor}>Connect Bluetooth Device</button>
      {message && <p>{message}</p>}
      {data !== null && <h3>🔹 Sensor Value: {data}</h3>}
    </div>
  );
};

export default BluetoothReader;
