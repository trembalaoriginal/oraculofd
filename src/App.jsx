// oraculofd/src/App.jsx (COMPLETO E CORRIGIDO)
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

  const handleSubmit = async (e) => { // <-- Função handleSubmit estava faltando no trecho que você me enviou
    e.preventDefault();
    await handleCommand(input);
  };

  const handleCommand = async (command) => {
    if (!command.trim()) return;

    setOutput(prev => [...prev, { type: 'command', text: `> ${command}` }]);
    setInput('');
    setIsLoading(true); // Inicia o carregamento

    try {
      const response = await executeCommand(command);

      if (response.result) {
        // Sem SyntaxHighlighter, uma abordagem mais simples:
        const formattedText = response.result.split('\n').map((line, idx) => {
            if (line.startsWith('```')) {
                // Extrai a linguagem se houver (ex: ```javascript)
                const langMatch = line.match(/^```(\w+)?/);
                const lang = langMatch && langMatch[1] ? langMatch[1] : '';
                const codeContent = line.substring(langMatch ? langMatch[0].length : 3); // Remove '```' ou '```lang'
                return <pre key={idx}><code className={`language-${lang}`}>{codeContent}</code></pre>;
            }
            // Se a linha termina com ```, significa que é o final de um bloco de código.
            // A lógica aqui é um pouco simplificada e assume que blocos ```...``` são tratados linha a linha.
            // Para blocos multilinhas, o backend deve enviar o bloco completo entre ```lang\n...\n```
            // E o frontend deve renderizar o bloco inteiro de uma vez.
            // O código atual do backend já faz isso, então esta lógica de `line.endsWith('```')` talvez não seja ideal para blocos.
            // O ideal é que o backend envie um objeto com { type: 'code', lang: 'js', content: '...' }
            // ou que o split seja mais inteligente para pegar o bloco inteiro.
            // Por enquanto, vamos focar no erro atual.
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

// --- ESTA LINHA ESTAVA FALTANDO E É A CAUSA DO ERRO! ---
export default App;
