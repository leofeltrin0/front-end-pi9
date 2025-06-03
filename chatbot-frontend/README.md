# Chatbot Frontend

Interface moderna para um chatbot de IA com suporte a código Python e download de arquivos.

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Axios
- react-syntax-highlighter

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com a seguinte configuração:
```
VITE_API_URL=http://localhost:8000
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── hooks/         # Hooks personalizados
  ├── services/      # Serviços de API
  ├── types/         # Definições de tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Funcionalidades

- Interface de chat moderna e responsiva
- Suporte a modo escuro
- Exibição de código Python com syntax highlighting
- Download de arquivos .py
- Streaming de respostas
- Design adaptativo para diferentes tamanhos de tela

## Integração com Backend

O frontend espera um backend FastAPI com os seguintes endpoints:

- POST `/chat`: Recebe mensagens do usuário e retorna respostas
- GET `/download/{filename}`: Endpoint para download de arquivos

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Para construir a versão de produção:

```bash
npm run build
```
