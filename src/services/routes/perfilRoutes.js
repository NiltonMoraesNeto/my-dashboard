import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

router.get('/filterById', (req, res) => {
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

router.get('/list', (req, res) => {
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

router.post('/new', (req, res) => {
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

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { descricao } = req.body;

  if (!descricao) {
    return res.status(400).json({ error: 'Descrição é obrigatória' });
  }

  const db = readDB();
  const perfilIndex = db.perfil.findIndex(perfil => perfil.id === parseInt(id, 10));

  if (perfilIndex === -1) {
    return res.status(404).json({ error: 'Perfil não encontrado' });
  }

  db.perfil[perfilIndex].descricao = descricao;
  writeDB(db);

  res.status(200).json({ message: 'Perfil atualizado com sucesso', perfil: db.perfil[perfilIndex] });
});

router.delete('/delete/:id', (req, res) => {
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

export default router;