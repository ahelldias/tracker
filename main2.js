const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Seu código de API abaixo

let statusAtual = {
  status: 'Sem informação',
  data: new Date().toISOString()
};

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

app.get('/status', (req, res) => {
  res.json(statusAtual);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

