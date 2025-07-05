// oraculofd/src/App.jsx (trechos adaptados)
import React, { useState, useRef, useEffect } from 'react';
import { executeCommand } from './api';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Opcional, instalar: npm install react-syntax-highlighter
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Escolha um tema

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Novo estado para carregamento
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isLoading]); // Também rola quando o estado de carregamento muda

  const handleCommand = async (command) => {
    if (!command.trim()) return;

    setOutput(prev => [...prev, { type: 'command', text: `> ${command}` }]);
    setInput('');
    setIsLoading(true); // Inicia o carregamento

    try {
      const response = await executeCommand(command);

      if (response.result) {
        // Se o backend enviar um bloco de código, formatar com <pre><code>
        // E adicionar um botão de copiar.
        // Se estiver usando react-syntax-highlighter:
        // const codeBlocks = response.result.split('```').map((part, index) => {
        //   if (index % 2 === 1) { // É um bloco de código
        //     const [lang, ...codeLines] = part.split('\n');
        //     const code = codeLines.join('\n').trim();
        //     return (
        //       <div key={index} className="code-block-wrapper">
        //         <SyntaxHighlighter language={lang} style={dark}>
        //           {code}
        //         </SyntaxHighlighter>
        //         <button onClick={() => navigator.clipboard.writeText(code)} className="copy-button">Copiar</button>
        //       </div>
        //     );
        //   }
        //   return <span key={index}>{part}</span>;
        // });
        // setOutput(prev => [...prev, { type: 'response', content: codeBlocks }]);

        // Sem SyntaxHighlighter, uma abordagem mais simples:
        const formattedText = response.result.split('\n').map((line, idx) => {
            if (line.startsWith('```')) {
                return <pre key={idx}><code className={`language-${line.substring(3).trim()}`}>{line.substring(3)}</code></pre>;
            }
            if (line.endsWith('```')) {
                return <pre key={idx}><code>{line.substring(0, line.length - 3)}</code></pre>;
            }
            if (line.startsWith('Linguagem:') || line.startsWith('Descrição:')) {
                return <p key={idx} className="meta-info">{line}</p>;
            }
            return <p key={idx}>{line}</p>;
        });

        setOutput(prev => [...prev, { type: 'response', content: formattedText }]);

      } else if (response.error) {
        setOutput(prev => [...prev, { type: 'error', text: `Erro: ${response.error}` }]);
      } else {
        setOutput(prev => [...prev, { type: 'response', text: `Resposta desconhecida: ${JSON.stringify(response)}` }]);
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      setOutput(prev => [...prev, { type: 'error', text: `Erro de comunicação: ${error.message || 'Verifique o console para mais detalhes.'}` }]);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  // ... (handleSubmit e return do JSX) ...

  return (
    <div className="App">
      <div className="terminal-container" ref={terminalRef}>
        {output.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.content || line.text} {/* Renderiza content se existir, senão text */}
          </div>
        ))}
        {isLoading && (
          <div className="terminal-line loading">
            <span className="prompt">Oráculo &gt;</span> Processando...
          </div>
        )}
        {output.length === 0 && (
          <div className="terminal-line welcome-message">
            <span className="prompt">Oráculo &gt;</span> Bem-vindo ao Oráculo Terminal.
            <br />
            <span className="prompt">Oráculo &gt;</span> Digite o que você precisa! Ex:
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#FFD700'}}>html login</span>
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#90EE90'}}>python classe</span>
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#00FFFF'}}>css botão azul</span>
            <br />
            <span className="prompt">Oráculo &gt;</span> <span style={{color: '#ADD8E6'}}>git criar branch</span>
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
          disabled={isLoading} // Desabilita input enquanto carrega
        />
        <button type="submit" disabled={isLoading}>Executar</button>
      </form>
    </div>
  );
}
