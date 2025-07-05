// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { executeCode, askQuestion, generateHtmlFromAi } from './api'; // Importa as funções da API

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
      let response;
      // Verifica o tipo de comando e chama a função de API correspondente
      if (command.startsWith('exec ')) {
        const codeToExecute = command.substring(5); // Remove 'exec '
        response = await executeCode(codeToExecute);
        setOutput(prev => [...prev, { type: 'response', text: `Resultado da execução:\n${JSON.stringify(response.result, null, 2)}` }]);
      } else if (command.startsWith('ask ')) {
        const question = command.substring(4); // Remove 'ask '
        response = await askQuestion(question);
        setOutput(prev => [...prev, { type: 'ai-response', text: `AI: ${response.answer}` }]);
      } else if (command.startsWith('html ')) {
        const prompt = command.substring(5); // Remove 'html '
        response = await generateHtmlFromAi(prompt);
        setOutput(prev => [...prev, { type: 'ai-response', text: `HTML gerado pela AI:\n${response.html_code}` }]);
      } else {
        // Mensagem de erro para comandos desconhecidos
        setOutput(prev => [...prev, { type: 'error', text: `Comando desconhecido: "${command}". Use 'exec', 'ask' ou 'html'.` }]);
        return;
      }

    } catch (error) {
      // Captura e exibe erros da requisição ou API
      console.error('Erro na requisição:', error);
      setOutput(prev => [...prev, { type: 'error', text: `Erro: ${error.message || 'Verifique o console para mais detalhes.'}` }]);
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
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>exec &lt;código Python&gt;</span> - Executa código Python.
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>ask &lt;sua pergunta&gt;</span> - Faz uma pergunta à AI.
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>html &lt;instruções para HTML&gt;</span> - Pede para a AI gerar HTML.
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
