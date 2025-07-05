// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { executeCode, askQuestion, generateHtmlFromAi } from './api'; // Suas funções da API

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const terminalRef = useRef(null);

  // Função para rolar para o final do terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]); // Rola sempre que o output muda

  const handleCommand = async (command) => {
    if (!command.trim()) return;

    // Adiciona o comando ao histórico
    setOutput(prev => [...prev, { type: 'command', text: `> ${command}` }]);
    setInput(''); // Limpa a entrada

    try {
      let response;
      if (command.startsWith('exec ')) {
        const codeToExecute = command.substring(5);
        response = await executeCode(codeToExecute);
        setOutput(prev => [...prev, { type: 'response', text: `Resultado da execução: ${JSON.stringify(response.result)}` }]);
      } else if (command.startsWith('ask ')) {
        const question = command.substring(4);
        response = await askQuestion(question);
        setOutput(prev => [...prev, { type: 'ai-response', text: `AI: ${response.answer}` }]);
      } else if (command.startsWith('html ')) {
        const prompt = command.substring(5);
        response = await generateHtmlFromAi(prompt);
        // Aqui você pode decidir como exibir o HTML.
        // Por simplicidade, vamos mostrar o código HTML como texto.
        // Para renderizar HTML real, você precisaria de um `dangerouslySetInnerHTML`
        // mas isso requer cuidado de segurança.
        setOutput(prev => [...prev, { type: 'ai-response', text: `HTML gerado pela AI:\n${response.html_code}` }]);
      } else {
        setOutput(prev => [...prev, { type: 'error', text: `Comando desconhecido: "${command}". Use 'exec', 'ask' ou 'html'.` }]);
        return;
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
        {/* Mensagem de boas-vindas inicial */}
        {output.length === 0 && (
          <div className="terminal-line">
            <span className="prompt">Oráculo &gt;</span> Bem-vindo ao Oráculo Terminal.
            <br />
            <span className="prompt">Oráculo &gt;</span> Comandos disponíveis:
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>exec &lt;código Python&gt;</span>
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>ask &lt;sua pergunta&gt;</span>
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>html &lt;instruções para HTML&gt;</span>
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
