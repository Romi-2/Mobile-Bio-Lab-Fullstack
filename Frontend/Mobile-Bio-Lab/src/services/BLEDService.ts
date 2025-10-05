// services/bleService.ts

export interface BLEDevice {
  id: string;
  name: string;
  connected: boolean;
  services: string[];
  rssi?: number;
}

export interface SensorData {
  temperature?: number;
  pH?: number;
  salinity?: number;
  humidity?: number;
  pressure?: number;
  timestamp: number;
  deviceId?: string;
}

export interface CharacteristicConfig {
  service: string;
  characteristic: string;
  decoder: (data: DataView) => number | undefined;
  name: string;
}

class BLEService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristics: Map<string, BluetoothRemoteGATTCharacteristic> = new Map();
  private onDataCallback: ((data: SensorData) => void) | null = null;
  private onDeviceConnected: ((device: BLEDevice) => void) | null = null;
  private onDeviceDisconnected: (() => void) | null = null;
  private isConnecting: boolean = false;

  // Standard BLE Service UUIDs
  private readonly STANDARD_SERVICES = {
    // Environmental Sensing Service
    ENVIRONMENTAL_SENSING: '0000181a-0000-1000-8000-00805f9b34fb',
    // Device Information
    DEVICE_INFO: '0000180a-0000-1000-8000-00805f9b34fb',
    // Battery Service
    BATTERY: '0000180f-0000-1000-8000-00805f9b34fb',
    // Generic Access
    GENERIC_ACCESS: '00001800-0000-1000-8000-00805f9b34fb',
    // Generic Attribute
    GENERIC_ATTRIBUTE: '00001801-0000-1000-8000-00805f9b34fb',
  };

  // Standard Characteristic UUIDs
  private readonly STANDARD_CHARACTERISTICS = {
    // Environmental Sensing Characteristics
    TEMPERATURE: '00002a6e-0000-1000-8000-00805f9b34fb',
    HUMIDITY: '00002a6f-0000-1000-8000-00805f9b34fb',
    PRESSURE: '00002a6d-0000-1000-8000-00805f9b34fb',
    
    // Device Information Characteristics
    MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
    MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',
    SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb',
    FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',
    
    // Battery Level
    BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  };

  // Custom Service UUIDs (for proprietary devices)
  private readonly CUSTOM_SERVICES = {
    CUSTOM_ENVIRONMENTAL: '12345678-1234-5678-9abc-123456789abc',
    CUSTOM_PH_SENSOR: '12345678-1234-5678-9abc-123456789abd',
    CUSTOM_SALINITY: '12345678-1234-5678-9abc-123456789abe',
  };

  // Characteristic configurations for different sensor types
  private readonly CHARACTERISTIC_CONFIGS: CharacteristicConfig[] = [
    {
      service: this.STANDARD_SERVICES.ENVIRONMENTAL_SENSING,
      characteristic: this.STANDARD_CHARACTERISTICS.TEMPERATURE,
      decoder: this.decodeTemperature.bind(this),
      name: 'temperature'
    },
    {
      service: this.STANDARD_SERVICES.ENVIRONMENTAL_SENSING,
      characteristic: this.STANDARD_CHARACTERISTICS.HUMIDITY,
      decoder: this.decodeHumidity.bind(this),
      name: 'humidity'
    },
    {
      service: this.STANDARD_SERVICES.ENVIRONMENTAL_SENSING,
      characteristic: this.STANDARD_CHARACTERISTICS.PRESSURE,
      decoder: this.decodePressure.bind(this),
      name: 'pressure'
    },
    {
      service: this.CUSTOM_SERVICES.CUSTOM_PH_SENSOR,
      characteristic: '12345678-1234-5678-9abc-123456789abf',
      decoder: this.decodePH.bind(this),
      name: 'pH'
    },
    {
      service: this.CUSTOM_SERVICES.CUSTOM_SALINITY,
      characteristic: '12345678-1234-5678-9abc-123456789ac0',
      decoder: this.decodeSalinity.bind(this),
      name: 'salinity'
    }
  ];

  /**
   * Scan for and connect to a BLE device
   */
  async scanAndConnect(): Promise<BLEDevice> {
    if (this.isConnecting) {
      throw new Error('Connection already in progress');
    }

    if (this.device?.gatt?.connected) {
      throw new Error('Already connected to a device');
    }

    this.isConnecting = true;

    try {
      console.log('Requesting Bluetooth device...');
      
      // Request device with all possible services
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          this.STANDARD_SERVICES.ENVIRONMENTAL_SENSING,
          this.STANDARD_SERVICES.DEVICE_INFO,
          this.STANDARD_SERVICES.BATTERY,
          this.CUSTOM_SERVICES.CUSTOM_ENVIRONMENTAL,
          this.CUSTOM_SERVICES.CUSTOM_PH_SENSOR,
          this.CUSTOM_SERVICES.CUSTOM_SALINITY,
        ]
      });

      // Add event listener for disconnection
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));

      console.log('Connecting to GATT Server...');
      this.server = await this.device.gatt?.connect();
      
      if (!this.server) {
        throw new Error('Failed to connect to GATT server');
      }

      console.log('Connected to GATT server, discovering services and characteristics...');
      
      // Get all services
      const services = await this.server.getPrimaryServices();
      console.log('Found services:', services.map(s => s.uuid));

      // Setup characteristics for notifications
      await this.setupCharacteristics(services);

      const bleDevice: BLEDevice = {
        id: this.device.id,
        name: this.device.name || 'Unknown BLE Device',
        connected: true,
        services: services.map(s => s.uuid)
      };

      // Call connected callback
      if (this.onDeviceConnected) {
        this.onDeviceConnected(bleDevice);
      }

      console.log('Successfully connected to BLE device:', bleDevice);
      return bleDevice;

    } catch (error) {
      console.error('BLE connection failed:', error);
      this.isConnecting = false;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Setup characteristics for notifications
   */
  private async setupCharacteristics(services: BluetoothRemoteGATTService[]): Promise<void> {
    this.characteristics.clear();

    for (const service of services) {
      try {
        const characteristics = await service.getCharacteristics();
        
        for (const characteristic of characteristics) {
          const config = this.CHARACTERISTIC_CONFIGS.find(
            cfg => cfg.service === service.uuid && cfg.characteristic === characteristic.uuid
          );

          if (config && characteristic.properties.notify) {
            try {
              await characteristic.startNotifications();
              characteristic.addEventListener(
                'characteristicvaluechanged',
                this.handleCharacteristicValueChanged.bind(this, config)
              );
              this.characteristics.set(`${service.uuid}-${characteristic.uuid}`, characteristic);
              console.log(`Subscribed to notifications for ${config.name}`);
            } catch (error) {
              console.warn(`Failed to subscribe to ${config.name}:`, error);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to get characteristics for service ${service.uuid}:`, error);
      }
    }
  }

  /**
   * Handle characteristic value changes
   */
  private handleCharacteristicValueChanged(config: CharacteristicConfig, event: Event): void {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    
    if (value && this.onDataCallback) {
      try {
        const decodedValue = config.decoder(value);
        if (decodedValue !== undefined) {
          const sensorData: SensorData = {
            [config.name]: decodedValue,
            timestamp: Date.now(),
            deviceId: this.device?.id
          };
          this.onDataCallback(sensorData);
        }
      } catch (error) {
        console.error(`Error decoding ${config.name}:`, error);
      }
    }
  }

  /**
   * Handle device disconnection
   */
  private handleDisconnection(): void {
    console.log('BLE device disconnected');
    this.device = null;
    this.server = null;
    this.characteristics.clear();
    
    if (this.onDeviceDisconnected) {
      this.onDeviceDisconnected();
    }
  }

  /**
   * Data decoders for different sensor types
   */
  private decodeTemperature(data: DataView): number {
    // IEEE 11073 32-bit float format for temperature
    if (data.byteLength >= 4) {
      return data.getInt32(0, true) * 0.1;
    }
    // Alternative: 16-bit signed integer × 0.01 °C
    if (data.byteLength >= 2) {
      return data.getInt16(0, true) * 0.01;
    }
    throw new Error('Invalid temperature data length');
  }

  private decodeHumidity(data: DataView): number {
    // 16-bit unsigned integer × 0.01 %
    if (data.byteLength >= 2) {
      return data.getUint16(0, true) * 0.01;
    }
    throw new Error('Invalid humidity data length');
  }

  private decodePressure(data: DataView): number {
    // 32-bit unsigned integer × 0.1 Pa
    if (data.byteLength >= 4) {
      return data.getUint32(0, true) * 0.1;
    }
    throw new Error('Invalid pressure data length');
  }

  private decodePH(data: DataView): number {
    // Custom pH format: 16-bit unsigned × 0.01
    if (data.byteLength >= 2) {
      return data.getUint16(0, true) * 0.01;
    }
    throw new Error('Invalid pH data length');
  }

  private decodeSalinity(data: DataView): number {
    // Custom salinity format: 16-bit unsigned × 0.1 PSU
    if (data.byteLength >= 2) {
      return data.getUint16(0, true) * 0.1;
    }
    throw new Error('Invalid salinity data length');
  }

  /**
   * Read battery level
   */
  async readBatteryLevel(): Promise<number | null> {
    if (!this.server?.connected) {
      return null;
    }

    try {
      const service = await this.server.getPrimaryService(this.STANDARD_SERVICES.BATTERY);
      const characteristic = await service.getCharacteristic(this.STANDARD_CHARACTERISTICS.BATTERY_LEVEL);
      const value = await characteristic.readValue();
      
      if (value.byteLength > 0) {
        return value.getUint8(0);
      }
    } catch (error) {
      console.warn('Failed to read battery level:', error);
    }
    
    return null;
  }

  /**
   * Read device information
   */
  async readDeviceInfo(): Promise<{ [key: string]: string }> {
    if (!this.server?.connected) {
      return {};
    }

    const info: { [key: string]: string } = {};

    try {
      const service = await this.server.getPrimaryService(this.STANDARD_SERVICES.DEVICE_INFO);
      const characteristics = await service.getCharacteristics();

      for (const characteristic of characteristics) {
        try {
          const value = await characteristic.readValue();
          const textDecoder = new TextDecoder();
          const text = textDecoder.decode(value);
          
          switch (characteristic.uuid) {
            case this.STANDARD_CHARACTERISTICS.MANUFACTURER_NAME:
              info.manufacturer = text;
              break;
            case this.STANDARD_CHARACTERISTICS.MODEL_NUMBER:
              info.model = text;
              break;
            case this.STANDARD_CHARACTERISTICS.SERIAL_NUMBER:
              info.serial = text;
              break;
            case this.STANDARD_CHARACTERISTICS.FIRMWARE_REVISION:
              info.firmware = text;
              break;
          }
        } catch (error) {
          console.warn(`Failed to read characteristic ${characteristic.uuid}:`, error);
        }
      }
    } catch (error) {
      console.warn('Failed to read device info:', error);
    }

    return info;
  }

  /**
   * Public API
   */
  onData(callback: (data: SensorData) => void): void {
    this.onDataCallback = callback;
  }

  onDeviceConnectedCallback(callback: (device: BLEDevice) => void): void {
    this.onDeviceConnected = callback;
  }

  onDeviceDisconnectedCallback(callback: () => void): void {
    this.onDeviceDisconnected = callback;
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.device = null;
    this.server = null;
    this.characteristics.clear();
    this.onDataCallback = null;
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false;
  }

  getDeviceName(): string {
    return this.device?.name || 'No device connected';
  }

  getDeviceId(): string {
    return this.device?.id || '';
  }

  isConnectingInProgress(): boolean {
    return this.isConnecting;
  }

  /**
   * Check if Web Bluetooth API is supported
   */
  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * Get supported status message
   */
  getSupportStatus(): { supported: boolean; message: string } {
    if (!this.isSupported()) {
      return {
        supported: false,
        message: 'Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.'
      };
    }

    return {
      supported: true,
      message: 'Web Bluetooth is supported. You can connect to BLE devices.'
    };
  }
}

// Create and export a singleton instance
export const bleService = new BLEService();

// Export the class for testing or custom instances
export default BLEService;// src/services/bleService.ts
import { useState, useEffect, useCallback } from "react";

export interface BLEDevice {
  id: string;
  name: string;
  services: string[];
}

export interface SensorData {
  timestamp: number;
  temperature?: number;
  pH?: number;
  salinity?: number;
}

export const useBLE = () => {
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "environmental_sensing"],
      });

      const server = await device.gatt?.connect();
      setConnectedDevice({
        id: device.id,
        name: device.name || "Unnamed Device",
        services: ["environmental_sensing"],
      });
      setIsConnected(true);

      device.addEventListener("gattserverdisconnected", () => {
        setIsConnected(false);
        setConnectedDevice(null);
      });

      // Example: Read from "environmental_sensing" service
      const service = await server?.getPrimaryService("environmental_sensing").catch(() => null);
      if (!service) return;

      try {
        const tempChar = await service.getCharacteristic("temperature");
        tempChar.addEventListener("characteristicvaluechanged", (event: Event) => {
          const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
          if (value) {
            const tempC = value.getInt16(0, true) / 100;
            setSensorData({
              timestamp: Date.now(),
              temperature: tempC,
            });
          }
        });
        await tempChar.startNotifications();
      } catch {
        console.warn("Temperature characteristic not available");
      }

    } catch (err: any) {
      setError(err.message || "BLE connection failed");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      const device = await navigator.bluetooth.getDevices().then((devices) =>
        devices.find((d) => d.id === connectedDevice.id)
      );
      await device?.gatt?.disconnect();
      setIsConnected(false);
      setConnectedDevice(null);
    }
  }, [connectedDevice]);

  return {
    connectedDevice,
    isConnected,
    isConnecting,
    sensorData,
    connect,
    disconnect,
    error,
  };
};
