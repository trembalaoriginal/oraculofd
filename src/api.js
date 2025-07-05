// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; // **ATENÇÃO: Porta 3001 para o novo backend Node.js localmente**

export async function executeCommand(command) { // Função única para enviar o comando
  const response = await fetch(`${API_BASE_URL}/execute`, { // Chama a rota /execute
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }), // Envia o comando completo
  });
  if (!response.ok) {
    // Tenta ler a mensagem de erro do backend se disponível
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido do servidor' }));
    throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || response.statusText}`);
  }
  return response.json();
}

// As funções askQuestion e generateHtmlFromAi não são mais necessárias aqui,
// pois a lógica de roteamento está no backend.
