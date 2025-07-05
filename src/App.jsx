// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from './api'; // Importa APENAS a nova função executeCommand

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = async (command) => {
    if (!command.trim()) return;

    setOutput(prev => [...prev, { type: 'command', text: `> ${command}` }]);
    setInput('');

    try {
      // Chama a função única do api.js, passando o comando completo
      const response = await executeCommand(command);

      // Lógica para exibir a resposta com base no que o backend retornou
      if (response.result) {
        setOutput(prev => [...prev, { type: 'response', text: `Resultado: ${response.result}` }]);
      } else if (response.answer) {
        setOutput(prev => [...prev, { type: 'ai-response', text: `AI: ${response.answer}` }]);
      } else if (response.html_code) {
        setOutput(prev => [...prev, { type: 'ai-response', text: `HTML gerado pela AI:\n${response.html_code}` }]);
      } else if (response.error) {
        setOutput(prev => [...prev, { type: 'error', text: `Erro do Backend: ${response.error}` }]);
      } else {
        setOutput(prev => [...prev, { type: 'response', text: `Resposta desconhecida: ${JSON.stringify(response)}` }]);
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      setOutput(prev => [...prev, { type: 'error', text: `Erro: ${error.message || 'Verifique o console para mais detalhes.'}` }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div className="App">
      <div className="terminal-container" ref={terminalRef}>
        {output.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        {output.length === 0 && (
          <div className="terminal-line">
            <span className="prompt">Oráculo &gt;</span> Bem-vindo ao Oráculo Terminal.
            <br />
            <span className="prompt">Oráculo &gt;</span> Comandos disponíveis:
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#FFD700'}}>exec &lt;qualquer coisa&gt;</span> - (Não executa Python, apenas envia para a IA para interpretação de código)
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>ask &lt;sua pergunta&gt;</span> - Faz uma pergunta à AI.
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#00FFFF'}}>html &lt;instruções para HTML&gt;</span> - Pede para a AI gerar HTML.
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-area">
        <span className="prompt">Oráculo &gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite seu comando..."
          autoFocus
        />
        <button type="submit">Executar</button>
      </form>
    </div>
  );
}

export default App;
