// server.js

// Importa as bibliotecas necessárias
const express = require('express');
// Agora importamos 'put' para upload e 'list' para listar os arquivos
const { put, list } = require('@vercel/blob');
const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// --- ROTA DE UPLOAD (Existente) ---
app.post('/api/upload', async (req, res) => {
  const filename = req.headers['x-vercel-filename'];

  if (!filename) {
    return res.status(400).json({ message: 'O nome do arquivo é obrigatório no cabeçalho x-vercel-filename.' });
  }

  try {
    const blob = await put(filename, req, {
      access: 'public',
    });
    res.status(200).json(blob);
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro ao fazer upload do arquivo.', error: error.message });
  }
});

// --- NOVA ROTA PARA LISTAR ARQUIVOS ---
app.get('/api/files', async (req, res) => {
  try {
    // A função 'list()' busca todos os metadados dos arquivos no seu Blob store
    const { blobs } = await list();
    // Retornamos a lista de arquivos como JSON
    res.status(200).json(blobs);
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ message: 'Erro ao buscar a lista de arquivos.', error: error.message });
  }
});


// Serve os arquivos estáticos da pasta 'public' (nosso frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});