import React, { useState } from "react";

export default function Editor({ onRun }) {
  const [command, setCommand] = useState("");

  return (
    <div>
      <textarea
        rows="5"
        cols="80"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Digite seu comando para o Oráculo IA..."
        style={{ background: "#000", color: "#0f0", border: "1px solid #0f0", padding: "0.5rem", fontFamily: "monospace" }}
      />
      <br />
      <button
        style={{ background: "#0f0", color: "#000", padding: "0.5rem 1rem", marginTop: "0.5rem" }}
        onClick={() => onRun(command)}
      >
        Executar
      </button>
    </div>
  );
}
