// frontend/src/services/protocolservice.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/protocols';

export interface ProtocolStep {
  stepNumber: number;
  title: string;
  description: string;
  duration?: string;
  equipment?: string[];
  precautions?: string[];
}

export interface Protocol {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: ProtocolStep[];
  created_by: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProtocolData {
  title: string;
  description: string;
  category: string;
  steps: ProtocolStep[];
  created_by: number;
}

export interface UpdateProtocolData {
  title: string;
  description: string;
  category: string;
  steps: ProtocolStep[];
}

// Get all protocols
export const getProtocols = async (): Promise<Protocol[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single protocol by ID
export const getProtocolById = async (id: string): Promise<Protocol> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new protocol
export const createProtocol = async (protocolData: CreateProtocolData): Promise<{ message: string; protocolId: number }> => {
  const response = await axios.post(API_URL, protocolData);
  return response.data;
};

// Update protocol
export const updateProtocol = async (id: string, protocolData: UpdateProtocolData): Promise<{ message: string }> => {
  const response = await axios.put(`${API_URL}/${id}`, protocolData);
  return response.data;
};

// Delete protocol
export const deleteProtocol = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};