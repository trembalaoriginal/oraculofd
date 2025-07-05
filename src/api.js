// src/api.js
// Define a URL base da API. Usa a variável de ambiente VITE_API_BASE_URL (para produção no Render)
// ou 'http://localhost:8000' (para desenvolvimento local).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Função para executar código Python no backend
export async function executeCode(code) {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  // Se a resposta não for bem-sucedida (status 2xx), lança um erro
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json(); // Retorna a resposta em JSON
}

// Função para fazer uma pergunta à AI no backend
export async function askQuestion(question) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Função para pedir à AI para gerar HTML no backend
export async function generateHtmlFromAi(prompt) {
  const response = await fetch(`${API_BASE_URL}/craft-html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
