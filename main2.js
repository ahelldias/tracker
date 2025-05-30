const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let statusAtual = {
  status: 'Sem informação',
  data: new Date().toISOString()
};

// Rota POST para atualizar status
app.post('/status', (req, res) => {
  const { status } = req.body;
  if (status) {
    statusAtual = {
      status,
      data: new Date().toISOString()
    };
    res.send('Status atualizado');
  } else {
    res.status(400).send('Faltando parâmetro "status"');
  }
});

// Rota GET para retornar status atual
app.get('/status', (req, res) => {
  res.json(statusAtual);
});

// Rota raiz
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Middleware para tratar rotas não definidas
app.use((req, res, next) => {
  if (!req.route) {
    res.status(404).send('Página não encontrada');
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
