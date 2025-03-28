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
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const db = readDB();
  const user = db.perfil.find(usuario => usuario.id === id);

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

app.post('/api/perfil/new', (req, res) => {
  const { descricao } = req.body;

  if (!descricao) {
    return res.status(400).json({ error: 'Descrição é obrigatória' });
  }

  const db = readDB();
  const newPerfil = {
    id: db.perfil.length + 1,
    descricao,
  };

  db.perfil.push(newPerfil);
  writeDB(db);

  res.status(201).json({ message: 'Perfil criado com sucesso', newPerfil });
});

app.delete('/api/perfil/delete/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const perfilIndex = db.perfil.findIndex(perfil => perfil.id === parseInt(id, 10));

  if (perfilIndex === -1) {
    return res.status(404).json({ error: 'Perfil não encontrado' });
  }

  db.perfil.splice(perfilIndex, 1);
  writeDB(db);

  res.status(200).json({ message: 'Perfil deletado com sucesso' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});