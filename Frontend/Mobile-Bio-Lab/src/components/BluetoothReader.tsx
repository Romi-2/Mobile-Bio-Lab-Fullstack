// frontend/src/components/BluetoothReader.tsx
import React, { useState } from "react";
import "../style/BluetoothReader.css";
import { sendSensorData } from "../services/BLEService";

// Extend Navigator to include Bluetooth
interface NavigatorWithBluetooth extends Navigator {
  bluetooth: Bluetooth;
}

const BluetoothReader: React.FC = () => {
  const [sensorValue, setSensorValue] = useState<number | null>(null);
  const [batteryValue, setBatteryValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const connectToSensor = async () => {
    try {
      setMessage("🔍 Searching for Bluetooth device...");
      const nav = navigator as NavigatorWithBluetooth;

      if (!nav.bluetooth) {
        setMessage("❌ Bluetooth not supported in this browser.");
        return;
      }

      // Request device
      let device: BluetoothDevice;
      try {
        device = await nav.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["battery_service"], // Standard service
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "NotFoundError") {
          setMessage("❌ No device selected.");
          return;
        }
        throw error;
      }
      

      setMessage(`🔗 Connected to ${device.name || "Sensor Device"}`);
      if (!device.gatt) {
        setMessage("❌ GATT server not available on this device.");
        return;
      }

      const server = await device.gatt.connect();

      // ---- Sensor Service ----
      try {
        const sensorService = await server.getPrimaryService(
          "12345678-1234-5678-1234-56789abcdef0" // Replace with your sensor's service UUID
        );
        const sensorCharacteristic = await sensorService.getCharacteristic(
          "00002a6e-0000-1000-8000-00805f9b34fb" // Replace with your sensor's characteristic UUID
        );

        const value = await sensorCharacteristic.readValue();
        const sValue = value.getUint8(0);
        setSensorValue(sValue);

        await sendSensorData({
          temperature: sValue,
          timestamp: new Date().toISOString(),
        });

        setMessage("✅ Sensor data received and sent!");
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("Sensor service not available:", err);
          setMessage(`⚠️ Sensor service not found: ${err.message}`);
        } else {
          console.warn("Sensor service not available:", err);
          setMessage("⚠️ Sensor service not found on this device.");
        }
      }

      // ---- Battery Service ----
      try {
        const batteryService = await server.getPrimaryService("battery_service");
        const batteryCharacteristic = await batteryService.getCharacteristic("battery_level");

        const battery = await batteryCharacteristic.readValue();
        setBatteryValue(battery.getUint8(0));
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("Battery service not available:", err);
        } else {
          console.warn("Battery service not available:", err);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Bluetooth connection failed:", error);
        setMessage(`❌ Bluetooth connection failed: ${error.message}`);
      } else {
        console.error("Bluetooth connection failed:", error);
        setMessage("❌ Bluetooth connection failed.");
      }
    }
  };

  return (
    <div className="ble-container">
      <button onClick={connectToSensor}>Connect Bluetooth Device</button>
      {message && <p>{message}</p>}
      {sensorValue !== null && <h3>🔹 Sensor Value: {sensorValue}</h3>}
      {batteryValue !== null && <h3>🔋 Battery Level: {batteryValue}%</h3>}
    </div>
  );
};

export default BluetoothReader;
