// backend/Utils/test-sensor.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  try {
    console.log('🧪 Testing backend connection...');
    
    // Test 1: Check if server is running
    const testResponse = await axios.get(`${API_BASE}/sensor/test`);
    console.log('✅ Test endpoint:', testResponse.data);
    
    // Test 2: Send sensor data
    const sensorData = {
      temperature: 25.5,
      timestamp: new Date().toISOString()
    };
    
    const sensorResponse = await axios.post(`${API_BASE}/sensor`, sensorData);
    console.log('✅ Sensor data saved:', sensorResponse.data);
    
    // Test 3: Get latest data
    const latestResponse = await axios.get(`${API_BASE}/sensor/latest`);
    console.log('✅ Latest data:', latestResponse.data);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.response?.data || error.message);
  }
}

testBackend();