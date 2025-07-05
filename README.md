# OráculoScript Frontend

Este repositório contém o código-fonte do frontend do OráculoScript, uma aplicação web para executar e interagir com o Oráculo AI.

## Visão Geral

O OráculoScript é uma ferramenta que permite aos usuários escrever e executar scripts simples, interagir com um modelo de linguagem AI (Gemini) para gerar conteúdo HTML dinamicamente e visualizar os resultados em tempo real no navegador.

## Tecnologias Utilizadas

-   **Frontend:** React (com Vite)
-   **Interpretação de Script:** JavaScript
-   **Comunicação com Backend:** Fetch API
-   **Estilização:** CSS

## Estrutura do Projeto

-   `public/`: Arquivos estáticos que são copiados diretamente para o diretório de build.
-   `src/`: Contém o código-fonte principal do aplicativo React.
    -   `App.jsx`: O componente principal do React.
    -   `api.js`: Lógica para interagir com a API do backend.
    -   `main.jsx`: Ponto de entrada do aplicativo React.
    -   `App.css`: Estilos globais para o aplicativo.
-   `index.html`: O arquivo HTML principal que carrega o aplicativo React.
-   `package.json`: Configurações de dependências e scripts do projeto Node.js/Vite.
-   `vite.config.js`: Configurações específicas do Vite.

## Como Executar Localmente (Desenvolvimento)

1.  **Pré-requisitos:** Certifique-se de ter o Node.js e o npm (ou yarn) instalados em sua máquina.
2.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/trembalaoriginal/oraculofd.git](https://github.com/trembalaoriginal/oraculofd.git)
    cd oraculofd
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, conforme indicado pelo Vite).

## Deploy no Render

Este frontend é projetado para ser deployado no Render.com.

### Variáveis de Ambiente no Render

Para que o frontend se comunique corretamente com o backend, é necessário configurar a seguinte variável de ambiente no serviço do Render para o frontend:

-   `VITE_API_BASE_URL`: A URL completa do seu serviço de backend deployado (ex: `https://seu-backend.onrender.com/`).

---

**Lembre-se da estrutura de pastas:**
