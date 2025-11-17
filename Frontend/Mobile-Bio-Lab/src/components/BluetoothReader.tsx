// frontend/src/components/BluetoothReader.tsx
import React, { useState, useEffect, useRef } from "react";
import "../style/BluetoothReader.css";

interface NavigatorWithBluetooth extends Navigator {
  bluetooth: Bluetooth;
}

interface SensorReading {
  type: string;
  value: number | null;
  unit: string;
  icon: string;
  name: string;
}

const SERVICE_UUIDS = {
  BATTERY: 'battery_service',
  HEALTH_THERMOMETER: '00001809-0000-1000-8000-00805f9b34fb',
  ENVIRONMENTAL_SENSING: '0000181a-0000-1000-8000-00805f9b34fb',
  CUSTOM_PH: '0000ff00-0000-1000-8000-00805f9b34fb',
};

const BluetoothReader: React.FC = () => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState<string>("");
  const [primaryDeviceType, setPrimaryDeviceType] = useState<string>("unknown");
  const [availableServices, setAvailableServices] = useState<string[]>([]); // Used in JSX now

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const serverRef = useRef<BluetoothRemoteGATTServer | null>(null);
  const characteristicRefs = useRef<Map<string, BluetoothRemoteGATTCharacteristic>>(new Map());

  const getSensorIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      temperature: '🌡️',
      battery: '🔋',
      environmental: '🌍',
      ph_meter: '🧪',
      generic: '📊',
    };
    return icons[type] || '📊';
  };

  const getDeviceDisplayName = (type: string) => {
    const names: { [key: string]: string } = {
      temperature: 'Temperature',
      battery: 'Battery Level',
      environmental: 'Environmental Sensor',
      ph_meter: 'pH Level',
      generic: 'Sensor Reading',
    };
    return names[type] || 'Sensor Reading';
  };

  useEffect(() => {
    return () => disconnectDevice();
  }, []);

  const updateSensorReading = (type: string, value: number | null, unit: string) => {
    setSensorReadings(prev => {
      const existing = prev.find(r => r.type === type);
      if (existing) {
        return prev.map(r => r.type === type ? { ...r, value, unit } : r);
      } else {
        return [
          ...prev,
          { type, value, unit, icon: getSensorIcon(type), name: getDeviceDisplayName(type) }
        ];
      }
    });
  };

  const getSensorUnit = (type: string) => {
    switch (type) {
      case 'temperature': return '°C';
      case 'ph_meter': return ' pH';
      case 'battery': return '%';
      case 'environmental': return ' units';
      default: return ' units';
    }
  };

  const parseSensorData = (value: DataView, type: string): number => {
    try {
      const bytes = Array.from(new Uint8Array(value.buffer));
      console.log(`Parsing ${type} data, bytes:`, value.byteLength, 'hex:', bytes.map(b => b.toString(16).padStart(2, '0')).join(' '));

      switch (type) {
        case 'temperature':
          if (value.byteLength >= 2) return parseFloat((value.getInt16(0, true) / 100).toFixed(2));
          return value.getUint8(0);

        case 'ph_meter':
          if (value.byteLength >= 4) return parseFloat(value.getFloat32(0, true).toFixed(2));
          if (value.byteLength >= 2) return parseFloat((value.getUint16(0, true) / 100).toFixed(2));
          if (value.byteLength >= 1) return parseFloat((value.getUint8(0) / 10).toFixed(1));
          return 7.0;

        case 'battery': return value.getUint8(0);
        case 'environmental':
          if (value.byteLength >= 2) return parseFloat((value.getInt16(0, true) / 100).toFixed(2));
          return value.getUint8(0);
        default:
          if (value.byteLength >= 2) return value.getUint16(0, true);
          return value.getUint8(0);
      }
    } catch (error) {
      console.error('Error parsing sensor data:', error);
      return 0;
    }
  };

  const handleCharacteristicNotification = (event: Event, sensorType: string) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (value) {
      const parsedValue = parseSensorData(value, sensorType);
      updateSensorReading(sensorType, parsedValue, getSensorUnit(sensorType));
      setMessage(`✅ ${getDeviceDisplayName(sensorType)}: ${parsedValue}${getSensorUnit(sensorType)} (${new Date().toLocaleTimeString()})`);
    }
  };

  const readSensorValue = async (sensorType: string) => {
    const char = characteristicRefs.current.get(sensorType);
    if (!char || !char.properties.read) return;
    try {
      const value = await char.readValue();
      const parsedValue = parseSensorData(value, sensorType);
      updateSensorReading(sensorType, parsedValue, getSensorUnit(sensorType));
      console.log(`✅ Read ${sensorType}: ${parsedValue}${getSensorUnit(sensorType)}`);
    } catch (error) {
      console.error(`Failed to read ${sensorType}:`, error);
    }
  };

  const startMonitoringSensor = async (sensorType: string) => {
    const char = characteristicRefs.current.get(sensorType);
    if (!char || !char.properties.notify) return;

    try {
      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', (event) => handleCharacteristicNotification(event, sensorType));
      console.log(`📡 Started monitoring ${sensorType}`);
    } catch (error) {
      console.error(`Failed to start monitoring ${sensorType}:`, error);
    }
  };

  const startMonitoring = async () => {
    for (const sensorType of characteristicRefs.current.keys()) {
      const char = characteristicRefs.current.get(sensorType);
      if (char?.properties.notify) await startMonitoringSensor(sensorType);
    }
    setIsMonitoring(true);
    setMessage("📡 Real-time monitoring started for all sensors!");
  };

  const stopMonitoring = async () => {
    characteristicRefs.current.forEach((char, sensorType) => {
      try {
        char.stopNotifications();
        char.removeEventListener('characteristicvaluechanged', (event) => handleCharacteristicNotification(event, sensorType));
      } catch (error) {
        console.warn(`Failed to stop notifications for ${sensorType}:`, error);
      }
    });
    setIsMonitoring(false);
    setMessage("⏸️ Monitoring stopped for all sensors");
  };

  const readAllSensors = async () => {
    await Promise.all(Array.from(characteristicRefs.current.keys()).map(readSensorValue));
    setMessage("✅ Read all sensor values");
  };

  const disconnectDevice = () => {
    if (serverRef.current?.connected) serverRef.current.disconnect();
    deviceRef.current = null;
    serverRef.current = null;
    characteristicRefs.current.clear();
    setIsConnected(false);
    setIsMonitoring(false);
    setSensorReadings([]);
    setPrimaryDeviceType("unknown");
    setMessage("🔌 Disconnected from device");
  };

  const connectToAnyDevice = async () => {
    try {
      setMessage("🔍 Searching for ANY Bluetooth device...");
      const nav = navigator as NavigatorWithBluetooth;
      if (!nav.bluetooth) {
        setMessage("❌ Bluetooth not supported. Use Chrome, Edge, or Opera.");
        return;
      }

      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'battery_service',
          SERVICE_UUIDS.HEALTH_THERMOMETER,
          SERVICE_UUIDS.ENVIRONMENTAL_SENSING,
          SERVICE_UUIDS.CUSTOM_PH
        ]
      });

      deviceRef.current = device;
      setDeviceName(device.name || device.id || "Unnamed Device");

      if (!device.gatt) return;

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setIsMonitoring(false);
        setMessage("⚠️ Device disconnected");
      });

      const server = await device.gatt.connect();
      serverRef.current = server;
      setIsConnected(true);

      const services = await server.getPrimaryServices();
      const serviceUUIDs = services.map(s => s.uuid);
      setAvailableServices(serviceUUIDs);

      for (const service of services) {
        const characteristics = await service.getCharacteristics();

        for (const char of characteristics) {
          let sensorType: string | null = null;
          switch (service.uuid) {
            case SERVICE_UUIDS.CUSTOM_PH: sensorType = 'ph_meter'; break;
            case SERVICE_UUIDS.HEALTH_THERMOMETER: sensorType = 'temperature'; break;
            case SERVICE_UUIDS.ENVIRONMENTAL_SENSING: sensorType = 'environmental'; break;
            case SERVICE_UUIDS.BATTERY: sensorType = 'battery'; break;
            default: sensorType = 'generic';
          }

          if (sensorType && !characteristicRefs.current.has(sensorType)) {
            characteristicRefs.current.set(sensorType, char);

            if (char.properties.read) await readSensorValue(sensorType);
            if (char.properties.notify) await startMonitoringSensor(sensorType);

            console.log(`✅ Found characteristic for ${sensorType}: ${char.uuid}`);
          }
        }
      }

      setPrimaryDeviceType(characteristicRefs.current.size > 0 ? Array.from(characteristicRefs.current.keys())[0] : 'generic');
      setMessage(`✅ Connected! Found ${characteristicRefs.current.size} sensors.`);

    } catch (error) {
      console.error("Connection failed:", error);
      setMessage(`❌ Connection failed: ${(error as Error).message}`);
      setIsConnected(false);
    }
  };

  return (
    <div className="ble-container">
      <h2>Bluetooth Low Energy Reader</h2>
      <p className="subtitle">Connect to ANY BLE device for testing</p>

      <div className="ble-controls">
        {!isConnected ? (
          <button className="btn-connect" onClick={connectToAnyDevice}>
            🔍 Connect to Any BLE Device
          </button>
        ) : (
          <>
            <button className="btn-disconnect" onClick={disconnectDevice}>🔌 Disconnect</button>
            <button className="btn-read" onClick={readAllSensors}>📖 Read All Sensors</button>
            {Array.from(characteristicRefs.current.values()).some(c => c.properties.notify) && (
              !isMonitoring ? (
                <button className="btn-monitor" onClick={startMonitoring}>📡 Start Monitoring All</button>
              ) : (
                <button className="btn-stop" onClick={stopMonitoring}>⏸️ Stop Monitoring All</button>
              )
            )}
          </>
        )}
      </div>

      {message && <div className={`message ${isConnected ? 'success' : 'info'}`}>{message}</div>}

      {deviceName && (
        <div className="device-info">
          <h3>📱 Device: {deviceName}</h3>
          <p>{getSensorIcon(primaryDeviceType)} Primary: {getDeviceDisplayName(primaryDeviceType)}</p>
        </div>
      )}

      {availableServices.length > 0 && (
        <div className="services-info">
          <h4>🔧 Available Services ({availableServices.length}):</h4>
          <ul>
            {availableServices.map(uuid => (
              <li key={uuid}><code>{uuid}</code></li>
            ))}
          </ul>
        </div>
      )}

      <div className="sensor-data">
        {sensorReadings.map(r => (
          <div key={r.type} className="data-card">
            <h3>{r.icon} {r.name}</h3>
            <div className="value">{r.value !== null ? r.value : '--'}<span className="unit">{r.unit}</span></div>
            {isMonitoring && <span className="live-indicator">🔴 LIVE</span>}
          </div>
        ))}
        {sensorReadings.length === 0 && isConnected && (
          <div className="data-card">
            <h3>📊 No Sensor Data</h3>
            <div className="value">--</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BluetoothReader;
