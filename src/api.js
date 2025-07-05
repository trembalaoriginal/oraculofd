// src/api.js
// Define a URL base da API. Usa a variável de ambiente VITE_API_BASE_URL (para produção no Render)
// ou 'http://localhost:3001' (para desenvolvimento local, porta do backend Node.js).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Função única para enviar qualquer comando ao backend
export async function executeCommand(command) {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Adicione aqui outros cabeçalhos se o backend precisar (ex: Authorization)
    },
    body: JSON.stringify({ command }), // Envia o comando completo no corpo da requisição
  });

  if (!response.ok) {
    // Tenta ler a mensagem de erro detalhada do backend se o status não for OK
    const errorBody = await response.json().catch(() => null); // Tenta ler JSON, mas não falha se não for JSON
    let errorMessage = `HTTP error! status: ${response.status}`;
    if (errorBody && errorBody.error) {
        errorMessage += ` - ${errorBody.error}`;
    } else if (response.statusText) {
        errorMessage += ` - ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json(); // Retorna a resposta em JSON
}
