const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB, save } = require('../data/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const reportTypes = {
  atraso: 'Atraso na entrega',
  extravio: 'Extravio de pacote',
  danificado: 'Pacote danificado',
  local_errado: 'Entregue no local errado',
  drone_problema: 'Problema com o drone',
  cancelar: 'Quero cancelar',
  outro: 'Outro',
};

router.post('/', authMiddleware, (req, res) => {
  const { delivery_id, type, description } = req.body;
  if (!type || !description) {
    return res.status(400).json({ error: 'Tipo e descricao sao obrigatorios' });
  }

  const db = getDB();

  if (delivery_id) {
    const delivery = db.deliveries.find((d) => d.id === delivery_id && d.user_id === req.user.id);
    if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });
  }

  const report = {
    id: uuidv4(),
    delivery_id: delivery_id || null,
    user_id: req.user.id,
    type,
    typeLabel: reportTypes[type] || type,
    description,
    status: 'aberto',
    created_at: new Date().toISOString(),
  };

  db.reports.push(report);
  save();

  res.status(201).json(report);
});

router.get('/', authMiddleware, (req, res) => {
  const db = getDB();
  let reports = db.reports;

  if (req.user.role !== 'admin') {
    reports = reports.filter((r) => r.user_id === req.user.id);
  }

  reports = reports
    .map((r) => {
      const delivery = r.delivery_id ? db.deliveries.find((d) => d.id === r.delivery_id) : null;
      const user = db.users.find((u) => u.id === r.user_id);
      return {
        ...r,
        delivery_route: delivery ? `${delivery.origin} -> ${delivery.destination}` : (r.delivery_id ? 'Desconhecida' : 'Reporte geral'),
        user_name: user ? user.name : 'Desconhecido',
      };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(reports);
});

router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const db = getDB();
  const report = db.reports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report nao encontrado' });

  const { status, response } = req.body;
  if (status !== undefined) report.status = status;
  if (response !== undefined) report.response = response;

  save();
  res.json(report);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const report = db.reports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report nao encontrado' });

  const isOwner = report.user_id === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Sem permissao para remover este report' });
  }

  if (isOwner && report.status !== 'respondido') {
    return res.status(400).json({ error: 'So e possivel remover reports respondidos' });
  }

  const idx = db.reports.findIndex((r) => r.id === req.params.id);
  db.reports.splice(idx, 1);
  save();
  res.json({ message: 'Report removido com sucesso' });
});

module.exports = router;