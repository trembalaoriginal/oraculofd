// src/api.js

// Para produção usa o backend do Render, para dev local usa localhost:3001
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://oraculobd.onrender.com';

// Função para enviar qualquer comando ao backend
export async function executeCommand(command) {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Aqui você pode adicionar cabeçalhos extras se necessário
    },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    let errorMessage = `Erro HTTP: ${response.status}`;
    if (errorBody && errorBody.error) {
      errorMessage += ` - ${errorBody.error}`;
    } else if (response.statusText) {
      errorMessage += ` - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
