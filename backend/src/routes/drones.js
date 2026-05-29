const express = require('express');
const { getDB } = require('../data/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const db = getDB();
  res.json(db.drones);
});

router.get('/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const drone = db.drones.find((d) => d.id === req.params.id);
  if (!drone) return res.status(404).json({ error: 'Drone nao encontrado' });
  res.json(drone);
});

module.exports = router;
