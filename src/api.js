// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oraculobd.onrender.com';

export async function executeCommand(command) {
  const response = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    let errorMessage = `HTTP error! status: ${response.status}`;
    if (errorBody && errorBody.error) {
      errorMessage += ` - ${errorBody.error}`;
    } else if (response.statusText) {
      errorMessage += ` - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
