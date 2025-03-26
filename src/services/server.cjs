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

app.get('/api/:table', (req, res) => {
  const table = req.params.table;
  const db = readDB();
  if (db[table]) {
    res.json(db[table]);
  } else {
    res.status(404).send(`Table ${table} does not exist`);
  }
});

app.post('/api/:table', (req, res) => {
  const table = req.params.table;
  const newItem = req.body;
  const db = readDB();
  if (db[table]) {
    db[table].push(newItem);
    writeDB(db);
    res.status(201).send(`Item added to ${table} successfully`);
  } else {
    res.status(404).send(`Table ${table} does not exist`);
  }
});

app.put('/api/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const updatedItem = req.body;
  const db = readDB();
  if (db[table]) {
    const index = db[table].findIndex(item => item.id === id);
    if (index !== -1) {
      db[table][index] = { ...db[table][index], ...updatedItem };
      writeDB(db);
      res.send(`Item with id ${id} updated successfully`);
    } else {
      res.status(404).send(`Item with id ${id} not found`);
    }
  } else {
    res.status(404).send(`Table ${table} does not exist`);
  }
});

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





app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});