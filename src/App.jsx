// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import { interpretCode, submitInput, triggerEvent } from "./api"; 
import './App.css'; 

export default function App() {
  const [code, setCode] = useState(`// Bem-vindo ao OráculoScript!
// Crie seus comandos aqui.

create title "Bem-vindo à Última Civilização"

create button "Clique Aqui" -> onClick {
    print "Você clicou no botão!"
}

ask "Qual o seu nome?" -> userName
print "Olá, \${userName}! Seja bem-vindo à OráculoScript."

if userName == "Gemini" {
    print "Reconheço sua sabedoria, Gemini."
} else {
    print "Espero que você traga grande conhecimento, \${userName}."
}

for i from 1 to 3 {
    create button "Loop Botão \${i}" -> onClick {
        print "Você clicou no Botão \${i} do loop!"
    }
}

print "Agora, vamos usar a AI para gerar algo!"
ai.craftHtml "Crie um cabeçalho H2 com o texto 'Página Gerada por AI' e abaixo dele, um parágrafo com o texto 'Este conteúdo foi gerado pelo Oráculo AI.'."
`);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null); 
  const [pendingInput, setPendingInput] = useState(null); 
  const [userInput, setUserInput] = useState(""); 
  const [activeEventHandlers, setActiveEventHandlers] = useState({}); 

  const runOrContinueCode = async (currentCode = code, currentSessionId = sessionId) => {
    setLoading(true);
    setError("");
    if (!currentSessionId || currentCode !== code) { 
        setConsoleOutput("");
        setHtmlOutput("");
    }

    try {
      const result = await interpretCode(currentCode, currentSessionId);
      
      if (result.status === "success") {
        setSessionId(result.session_id);
        setConsoleOutput(result.console_log);
        setHtmlOutput(result.html_output);
        setPendingInput(result.pending_input_request);
        setActiveEventHandlers(result.event_handlers);
      } else {
        setError(result.detail || "Erro desconhecido na interpretação.");
      }
    } catch (err) {
      setError(`Erro de comunicação com o backend: ${err.message}`);
      setSessionId(null); 
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInput = async () => {
    if (!pendingInput || !userInput.trim()) {
      setError("Por favor, insira um valor.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await submitInput(sessionId, pendingInput.variable_name, userInput);
      if (result.status === "success") {
        setConsoleOutput(result.console_log);
        setHtmlOutput(result.html_output);
        setPendingInput(result.pending_input_request); 
        setActiveEventHandlers(result.event_handlers);
        setUserInput(""); 
      } else {
        setError(result.detail || "Erro ao submeter input.");
      }
    } catch (err) {
      setError(`Erro de comunicação: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleDynamicClick = async (event) => {
      const clickedElementId = event.target.id;
      let triggeredEventId = null;
      for (const eventId in activeEventHandlers) {
        if (activeEventHandlers[eventId].element_id === clickedElementId) {
          triggeredEventId = eventId;
          break;
        }
      }

      if (triggeredEventId) {
        setLoading(true);
        setError("");
        try {
          const result = await triggerEvent(sessionId, triggeredEventId);
          if (result.status === "success") {
            setConsoleOutput(result.console_log);
            setHtmlOutput(result.html_output);
            setActiveEventHandlers(result.event_handlers); 
          } else {
            setError(result.detail || "Erro ao disparar evento.");
          }
        } catch (err) {
          setError(`Erro de comunicação ao disparar evento: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    document.addEventListener('click', handleDynamicClick);

    return () => {
      document.removeEventListener('click', handleDynamicClick);
    };
  }, [sessionId, activeEventHandlers]); 

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OráculoScript IDE (Alpha - Edição Última Civilização)</h1>
      </header>

      <div className="main-content">
        <div className="editor-panel">
          <h2>Seu Código OráculoScript</h2>
          <Editor code={code} setCode={setCode} />
          <button 
            onClick={() => runOrContinueCode(code, null)} 
            disabled={loading} 
            className="run-button"
          >
            {loading ? 'Interpretando...' : 'Interpretar OráculoScript'}
          </button>

          {pendingInput && (
            <div className="input-area">
              <h3>{pendingInput.question}</h3>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Digite sua resposta..."
                disabled={loading}
              />
              <button onClick={handleSubmitInput} disabled={loading}>
                Enviar Resposta
              </button>
            </div>
          )}
        </div>

        <div className="output-panel">
          <div className="console-output-section">
            <h2>Saída do Console:</h2>
            {error && <pre className="error-message">{error}</pre>}
            {consoleOutput && <pre className="console-log">{consoleOutput}</pre>}
            {!consoleOutput && !error && !loading && (
              <p className="placeholder-text">A saída do console aparecerá aqui.</p>
            )}
          </div>
          
          <div className="html-output-section">
            <h2>Visualização HTML:</h2>
            <div 
              className="html-preview-box" 
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            >
              {!htmlOutput && !loading && !error && (
                <p className="placeholder-text">O HTML gerado será renderizado aqui.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
