import React, { useState } from "react";

export default function Editor({ onRun }) {
  const [code, setCode] = useState("");

  return (
    <div>
      <textarea
        rows="10"
        cols="80"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder='Digite seu código OráculoScript aqui...'
      />
      <br />
      <button onClick={() => onRun(code)}>Executar</button>
    </div>
  );
}
