const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://oraculobd.onrender.com';

export async function executeCommand(command) {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    let msg = `HTTP ${res.status}`;
    if (err?.error) msg += ` – ${err.error}`;
    throw new Error(msg);
  }
  return res.json(); // { result: string }
}
