import React, { useState } from 'react';

export default function Editor({ onRun }) {
  const [cmd, setCmd] = useState('');
  return (
    <div>
      <textarea
        rows={5}
        cols={80}
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        placeholder="Digite seu comando..."
        style={{ background: '#000', color: '#0f0', border: '1px solid #0f0', padding: 8 }}
      />
      <br />
      <button
        onClick={() => onRun(cmd)}
        style={{ marginTop: 8, padding: '8px 16px', background: '#0f0', color: '#000' }}
      >
        Executar
      </button>
    </div>
  );
}
