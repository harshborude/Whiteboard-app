// This will use the live URL in production, and localhost during local development
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030';
const API_BASE_URL = `${BACKEND_URL}/canvas`;
export const updateCanvas = async (id, elements) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ elements })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update canvas');
    }

    return data;
  } catch (error) {
    console.error('Error in updateCanvas:', error.message);
    throw error;
  }
};
