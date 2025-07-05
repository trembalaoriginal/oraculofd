export async function runCode(command) {
  const res = await fetch("https://oraculobd.onrender.com/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command }),
  });

  if (!res.ok) {
    throw new Error("Erro ao conectar com o servidor");
  }

  return await res.json();
}
