// frontend/src/api.js
const API_BASE_URL = 'http://localhost:8000'; 

export async function interpretCode(code, sessionId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, session_id: sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Erro do servidor: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao interpretar código:", error);
    return { status: "error", detail: `Falha na comunicação com o servidor: ${error.message}` };
  }
}

export async function submitInput(sessionId, variableName, inputValue) {
    try {
        const response = await fetch(`${API_BASE_URL}/submit_input`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, variable_name: variableName, input_value: inputValue })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Erro do servidor ao submeter input: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao submeter input:", error);
        return { status: "error", detail: `Falha ao submeter input: ${error.message}` };
    }
}

export async function triggerEvent(sessionId, eventId) {
  try {
      const response = await fetch(`${API_BASE_URL}/trigger_event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, event_id: eventId })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Erro do servidor ao disparar evento: ${response.status} ${response.statusText}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Erro ao disparar evento:", error);
      return { status: "error", detail: `Falha ao disparar evento: ${error.message}` };
  }
}
