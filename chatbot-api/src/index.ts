import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OllamaService } from './services/ollama';
import { OpenAIService } from './services/openai';
import type { ChatRequest } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Configuração do CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Inicialização dos serviços
const ollamaService = new OllamaService(
  process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  process.env.DEFAULT_MODEL || 'llama2'
);

const openaiService = new OpenAIService(
  process.env.OPENAI_API_KEY || '',
  process.env.OPENAI_MODEL || 'gpt-4'
);

// Rota para listar modelos disponíveis
app.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({ models });
  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    res.status(500).json({ error: 'Erro ao listar modelos' });
  }
});

// Rota para chat
app.post('/chat', async (req, res) => {
  const { message, model } = req.body as ChatRequest & { model?: string };

  console.log('Modelo recebido no backend:', model);

  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }

  // Configurar headers para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Escolher o serviço baseado no modelo
    const service = model?.startsWith('gpt') ? openaiService : ollamaService;
    const modelName = model || process.env.DEFAULT_MODEL || 'llama2';

    const response = await service.chat(message, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }, modelName);

    // Enviar dados finais (codeBlocks, files, etc)
    if (response.codeBlocks || response.files) {
      res.write(`data: ${JSON.stringify({
        codeBlocks: response.codeBlocks,
        files: response.files
      })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Erro no chat:', error);
    res.write(`data: ${JSON.stringify({ error: 'Erro ao processar mensagem' })}\n\n`);
    res.end();
  }
});

// Rota para download de arquivos (ainda não implementada)
app.get('/download/:filename', (req, res) => {
  res.status(501).json({ error: 'Download ainda não implementado' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
}); 