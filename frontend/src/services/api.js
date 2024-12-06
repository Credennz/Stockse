const API_URL = 'http://localhost:5000';

export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};