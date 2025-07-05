import React, { useState } from 'react';
import Editor from './Editor';
import { executeCommand } from './api';

export default function App() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onRun = async (cmd) => {
    setLoading(true);
    setError('');
    setOutput('');
    try {
      const { result } = await executeCommand(cmd);
      setOutput(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', background: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>Oráculo IA</h1>
      <Editor onRun={onRun} />
      {loading && <p style={{ color: '#ff0' }}>Processando...</p>}
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {output && (
        <pre style={{ background: '#111', padding: 10, marginTop: 10 }}>
          {output}
        </pre>
      )}
    </div>
  );
}
