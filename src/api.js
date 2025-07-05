// pega a URL do backend no Render ou fallback para localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://oraculobd.onrender.com';

export async function executeCommand(command) {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    let msg = `HTTP ${res.status}`;
    if (errorBody?.error) msg += ` – ${errorBody.error}`;
    else if (res.statusText) msg += ` – ${res.statusText}`;
    throw new Error(msg);
  }
  return res.json(); // { result: "..." }
}
