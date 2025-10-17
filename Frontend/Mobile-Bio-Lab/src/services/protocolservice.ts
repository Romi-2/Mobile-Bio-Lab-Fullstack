// frontend/src/services/protocolservice.ts
import axios from 'axios';
import type { AxiosError } from "axios";

const API_URL = 'http://localhost:5000/api/protocols';

// Interfaces
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
}

export interface UpdateProtocolData {
  title: string;
  description: string;
  category: string;
  steps: ProtocolStep[];
}

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add auth header to requests and better error handling
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No authentication token found');
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Access forbidden - check authentication');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Get all protocols (public - no auth required)
export const getProtocols = async (): Promise<Protocol[]> => {
  try {
    const response = await axios.get(API_URL); // Use axios directly, not api (no auth needed)
    return response.data;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw error;
  }
};

// Get single protocol by ID (public - no auth required)
export const getProtocolById = async (id: string): Promise<Protocol> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProtocol = async (
  protocolData: CreateProtocolData
): Promise<{ message: string; protocolId?: number }> => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("Unauthorized");
  }

  try {
    const response = await axios.post(`${API_URL}`, protocolData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response?.status === 403) {
      console.error("Access forbidden - check authentication");
    }
    console.error("Failed to save protocol:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Failed to save protocol");
  }
};
// Update protocol (requires auth)
export const updateProtocol = async (id: string, protocolData: UpdateProtocolData): Promise<{ message: string }> => {
  const response = await api.put(`/${id}`, protocolData);
  return response.data;
};

// Delete protocol (requires auth)
export const deleteProtocol = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

// Get current user protocols (requires auth)
export const getMyProtocols = async (): Promise<Protocol[]> => {
  const response = await api.get('/my-protocols');
  return response.data;
};

// Check if user is authenticated
export const checkAuth = () => {
  return !!getAuthToken();
};