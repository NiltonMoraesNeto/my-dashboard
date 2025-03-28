const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

// Ajuste o caminho para o arquivo db.json conforme necessário
const filePath = path.join(__dirname, 'db.json');
const secretKey = 'your-secret-key'; // Use uma chave secreta segura e armazene-a em um lugar seguro

app.use(express.json());

// Configuração do middleware CORS
app.use(cors({
  origin: 'http://localhost:5173' // Permita a origem do seu frontend
}));

function readDB() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

app.post('/api/usuarios/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.usuarios.find(
    usuario => usuario.email === email && usuario.password === password
  );
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil, cep: user.cep, nome: user.nome, avatar: user.avatar }, secretKey, { expiresIn: '1h' });
    res.json({ token, user });
  } else {
    res.status(401).send('Email ou senha inválidos');
  }
});

app.get('/api/perfil/filterById', (req, res) => {
  const { id } = req.query;
  const db = readDB();

  const user = db.perfil.find(usuario => {
    return usuario.id === id;
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
});

app.get('/api/perfil/list', (req, res) => {
  const db = readDB();
  const perfil = db.perfil;

  // Obtenha os parâmetros de consulta page, totalItemsByPage e search
  const page = parseInt(req.query.page, 10) || 1;
  const totalItemsByPage = parseInt(req.query.totalItemsByPage, 10) || 10;
  const search = req.query.search?.toLowerCase() || '';

  // Filtrar os perfis com base na consulta de pesquisa
  const filteredPerfil = perfil.filter(p => p.descricao.toLowerCase().includes(search));

  // Calcular o total de itens filtrados
  const total = filteredPerfil.length;

  // Calcular os índices de início e fim dos itens a serem retornados com base na paginação
  const startIndex = (page - 1) * totalItemsByPage;
  const endIndex = startIndex + totalItemsByPage;

  // Extrair os itens referentes à página atual
  const paginatedPerfil = filteredPerfil.slice(startIndex, endIndex);

  const response = {
    total,
    perfil: paginatedPerfil
  };

  res.json(response);
});

app.get('/api/salesData/list', (req, res) => {
  const year = parseInt(req.query.year, 10);
  const db = readDB();
  const salesData = db.salesData.filter(item => item.year === year);

  if (salesData.length > 0) {
    res.json(salesData);
  } else {
    res.status(404).send(`No sales data found for the year ${year}`);
  }
});

app.get('/api/salesDataByBuilding/list', (req, res) => {
  const buildingName = req.query.buildingName || "Edifício A";
  const db = readDB();
  const salesDataByBuilding = db.salesDataByBuilding.filter(item => item.buildingName === buildingName);

  if (salesDataByBuilding.length > 0) {
    res.json(salesDataByBuilding);
  } else {
    res.status(404).send(`No sales data found for the buildingName ${buildingName}`);
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});