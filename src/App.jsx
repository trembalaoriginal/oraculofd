// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from './api'; // Importa a função única do api.js

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const terminalRef = useRef(null);

  // Efeito para rolar automaticamente para o final do terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]); // Rola sempre que o 'output' é atualizado

  const handleCommand = async (command) => {
    if (!command.trim()) return; // Ignora comandos vazios

    // Adiciona o comando do usuário ao histórico do terminal
    setOutput(prev => [...prev, { type: 'command', text: `> ${command}` }]);
    setInput(''); // Limpa a caixa de entrada

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
        // Exibe erros específicos do backend
        setOutput(prev => [...prev, { type: 'error', text: `Erro do Backend: ${response.error}` }]);
      } else {
        // Para qualquer outra resposta inesperada
        setOutput(prev => [...prev, { type: 'response', text: `Resposta desconhecida: ${JSON.stringify(response)}` }]);
      }

    } catch (error) {
      // Captura e exibe erros de rede ou outros erros JavaScript
      console.error('Erro na requisição:', error);
      setOutput(prev => [...prev, { type: 'error', text: `Erro de comunicação: ${error.message || 'Verifique o console para mais detalhes.'}` }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    handleCommand(input);
  };

  return (
    <div className="App">
      {/* Container principal do terminal com scroll */}
      <div className="terminal-container" ref={terminalRef}>
        {/* Renderiza cada linha do histórico de comandos e respostas */}
        {output.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        {/* Mensagem de boas-vindas e instruções iniciais (só aparece se o output estiver vazio) */}
        {output.length === 0 && (
          <div className="terminal-line">
            <span className="prompt">Oráculo &gt;</span> Bem-vindo ao Oráculo Terminal.
            <br />
            <span className="prompt">Oráculo &gt;</span> Comandos disponíveis:
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#FFD700'}}>exec &lt;código ou instrução&gt;</span> - (Não executa Python, apenas envia para a IA para interpretação de código)
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>ask &lt;sua pergunta&gt;</span> - Faz uma pergunta à AI.
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#00FFFF'}}>html &lt;instruções para HTML&gt;</span> - Pede para a AI gerar HTML.
          </div>
        )}
      </div>
      {/* Área de entrada de comando */}
      <form onSubmit={handleSubmit} className="input-area">
        <span className="prompt">Oráculo &gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite seu comando..."
          autoFocus // Foca automaticamente na caixa de texto
        />
        <button type="submit">Executar</button>
      </form>
    </div>
  );
}

export default App; // Exporta o componente App como padrão
