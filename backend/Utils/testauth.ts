// Temporary authentication helper for development
export const setupTestAuth = () => {
  // Create a mock JWT token (this would normally come from your backend)
  const mockUser = {
    id: 1,
    name: "Test Admin",
    email: "admin@test.com",
    role: "admin"
  };

  // This is a mock JWT token - in production, this would come from your backend
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlRlc3QgQWRtaW4iLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEwMDAwMDAwLCJleHAiOjE3NDE1MzYwMDB9.mock-signature-do-not-use-in-production';

  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  console.log('✅ Test authentication setup complete');
  console.log('User:', mockUser);
  console.log('Token set in localStorage');
  
  return { token: mockToken, user: mockUser };
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('🔓 Authentication cleared');
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token,
    token,
    user: user ? JSON.parse(user) : null
  };
};