# Arachinidata IA - Frontend

Este é o repositório do frontend para a Arachinidata IA, uma aplicação de chatbot interativa capaz de monitorar preços, realizar análises de dados e gerar relatórios, incluindo a execução de código Python e a exibição de gráficos e imagens.

## Funcionalidades

*   Interface de chat interativa.
*   Suporte a mensagens de usuário e respostas da IA (Arachinidata IA).
*   Exibição de Chain of Thought durante o processo de "pensamento" da IA (simulado no mock).
*   Renderização de blocos de código Python com destaque de sintaxe.
*   Execução de código Python diretamente no interface (via Pyodide).
*   Exibição de resultados de execução de código (output e erros).
*   Exibição de gráficos gerados pelo código Python (atualmente mockado ou via Pyodide).
*   Exibição de imagens associadas às respostas (implementado via mock data).
*   Tema escuro para uma melhor experiência visual.
*   Animação temática (aranha tecendo teia) durante o estado de "pensamento" (simulado no mock).
*   Mock data configurável para simular respostas da API.

## Tecnologias Utilizadas

*   React
*   TypeScript
*   Vite
*   Tailwind CSS
*   Pyodide (para execução de código Python no navegador)
*   React Syntax Highlighter
*   Outras bibliotecas para gráficos (matplotlib, seaborn - via Pyodide)

## Instalação

Para configurar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd front-end-pi9
    ```

2.  **Navegue até a pasta do frontend:**

    ```bash
    cd chatbot-frontend
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

4.  **Configure o ambiente (opcional):**

    Se você quiser usar o mock data, crie um arquivo `.env` na raiz da pasta `chatbot-frontend` com o seguinte conteúdo:

    ```env
    VITE_USE_MOCK=true
    ```

    Se você não usar o mock data, precisará configurar o backend correspondente para que o frontend possa se comunicar com a API real.

## Uso

Para iniciar o servidor de desenvolvimento, execute o seguinte comando na pasta `chatbot-frontend`:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173/` por padrão.

## Mock Data

O projeto utiliza mock data para simular as respostas da IA quando `VITE_USE_MOCK` é definido como `true` no arquivo `.env`. O mock data está definido nos arquivos:

*   `chatbot-frontend/src/mockData.ts`: Contém as estruturas de resposta mock para diferentes comandos (ex: "monitorar preços", "análise", "relatório"), incluindo o texto da mensagem, blocos de código, e URLs de imagens.
*   `chatbot-frontend/src/services/mockData.ts`: Contém a lógica para selecionar a resposta mock apropriada com base na mensagem do usuário e formatá-la.

Você pode modificar o `mockData.ts` para alterar as respostas simuladas, adicionar novos comandos ou ajustar os dados (incluindo adicionar URLs de imagens no campo `images`).

## Estrutura do Projeto (chatbot-frontend)

```
chatbot-frontend/
├── public/
│   └── logo.jpg
├── src/
│   ├── assets/
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── FileDownload.tsx
│   │   │   ├── ModelSelect.tsx
│   │   │   └── ThinkingAnimation.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   └── usePyodide.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── mockData.ts
│   │   ├── types/
│   │   │   └── chat.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md (Este arquivo)
│   ├── tailwind.config.js
│   └── tsconfig.json
```

## Contribuição

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma sugestão de melhoria, por favor, abra uma issue ou envie um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 