// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Importa o seu componente App.jsx
import './app.css'; // Importa o arquivo de estilos CSS para o aplicativo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
