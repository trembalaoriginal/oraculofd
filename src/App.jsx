import React, { useState } from "react";
import Editor from "./Editor";
import { executeCode } from "./api";

export default function App() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRun = async (command) => {
    setLoading(true);
    setError("");
    setOutput("");

    try {
      const result = await executeCode(command);
      setOutput(result.result || "Sem saída");
    } catch (err) {
      setError("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "monospace", color: "#0f0", background: "#000", minHeight: "100vh" }}>
      <h1 style={{ color: "#0f0" }}>Oráculo IA</h1>

      <Editor onRun={handleRun} />

      {loading && <p style={{ color: "#ff0" }}>Processando...</p>}
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {output && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Saída:</h2>
          <pre style={{ background: "#111", padding: "1rem", borderRadius: "4px", color: "#0f0" }}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
