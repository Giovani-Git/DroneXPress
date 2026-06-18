const express = require('express');
const { getDB, save } = require('../data/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/users', (req, res) => {
  const db = getDB();
  const users = db.users.map(({ password, ...u }) => u);
  res.json(users);
});

router.get('/drones', (req, res) => {
  const db = getDB();
  res.json(db.drones);
});

router.put('/drones/:id', (req, res) => {
  const db = getDB();
  const drone = db.drones.find((d) => d.id === req.params.id);
  if (!drone) return res.status(404).json({ error: 'Drone nao encontrado' });

  const { name, model, speed, battery, status, max_weight } = req.body;
  if (name !== undefined) drone.name = name;
  if (model !== undefined) drone.model = model;
  if (speed !== undefined) drone.speed = speed;
  if (battery !== undefined) drone.battery = battery;
  if (status !== undefined) drone.status = status;
  if (max_weight !== undefined) drone.max_weight = max_weight;

  save();
  res.json({ message: 'Drone atualizado com sucesso' });
});

router.post('/drones/:id/maintenance', (req, res) => {
  const db = getDB();
  const drone = db.drones.find((d) => d.id === req.params.id);
  if (!drone) return res.status(404).json({ error: 'Drone nao encontrado' });

  const { action } = req.body;
  if (action === 'start') {
    if (drone.status === 'em_entrega') return res.status(400).json({ error: 'Drone em entrega nao pode ir para manutencao' });
    drone.status = 'manutencao';
  } else if (action === 'end') {
    drone.status = 'disponivel';
    drone.battery = 100;
  } else {
    return res.status(400).json({ error: 'Acao invalida. Use start ou end' });
  }

  save();
  res.json({ message: `Manutencao ${action === 'start' ? 'iniciada' : 'finalizada'}`, drone });
});

router.put('/deliveries/:id', (req, res) => {
  const db = getDB();
  const delivery = db.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });

  const { status } = req.body;
  if (status !== undefined) {
    delivery.status = status;
    if (['entregue', 'cancelado'].includes(status)) freeDrone(delivery, db);

    if (delivery.drone_id) {
      const drone = db.drones.find((d) => d.id === delivery.drone_id);
      if (drone && drone.status !== 'manutencao') {
        const progressMap = ['pedido_criado', 'aguardando_aprovacao', 'drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue', 'cancelado'];
        const idx = progressMap.indexOf(status);
        const progressPct = idx >= 0 ? Math.round((idx / (progressMap.indexOf('entregue'))) * 100) : 0;
        const batteryDrain = Math.round((progressPct / 100) * 30);
        drone.battery = Math.max(5, 100 - batteryDrain);
      }
    }
  }

  save();
  const user = db.users.find((u) => u.id === delivery.user_id);
  res.json({ ...delivery, user_name: user ? user.name : 'Desconhecido' });
});

router.get('/deliveries', (req, res) => {
  const db = getDB();
  const deliveries = db.deliveries
    .map((d) => {
      const user = db.users.find((u) => u.id === d.user_id);
      return { ...d, user_name: user ? user.name : 'Desconhecido' };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(deliveries);
});

router.put('/users/:id', (req, res) => {
  const db = getDB();
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

  const { name, email, role, phone, company } = req.body;
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (phone !== undefined) user.phone = phone;
  if (company !== undefined) user.company = company;

  save();
  res.json({ message: 'Usuario atualizado com sucesso' });
});

router.delete('/users/:id', (req, res) => {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' });
  if (db.users[idx].role === 'admin') return res.status(400).json({ error: 'Nao e possivel remover um administrador' });

  db.users.splice(idx, 1);
  save();
  res.json({ message: 'Usuario removido com sucesso' });
});

function freeDrone(delivery, db) {
  if (delivery.drone_id) {
    const drone = db.drones.find((d) => d.id === delivery.drone_id);
    if (drone) drone.status = 'disponivel';
  }
}

router.put('/deliveries/:id', (req, res) => {
  const db = getDB();
  const delivery = db.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });

  const { status } = req.body;
  if (status !== undefined) {
    delivery.status = status;
    if (['entregue', 'cancelado'].includes(status)) freeDrone(delivery, db);
  }

  save();
  const user = db.users.find((u) => u.id === delivery.user_id);
  res.json({ ...delivery, user_name: user ? user.name : 'Desconhecido' });
});

router.delete('/deliveries/:id', (req, res) => {
  const db = getDB();
  const delivery = db.deliveries.find((d) => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });

  freeDrone(delivery, db);
  db.deliveries.splice(db.deliveries.indexOf(delivery), 1);
  save();
  res.json({ message: 'Entrega removida com sucesso' });
});

router.get('/stats', (req, res) => {
  const db = getDB();

  const totalUsers = db.users.length;
  const totalDrones = db.drones.length;
  const totalDeliveries = db.deliveries.length;
  const activeDeliveries = db.deliveries.filter((d) => d.status !== 'entregue' && d.status !== 'cancelado').length;
  const availableDrones = db.drones.filter((d) => d.status === 'disponivel').length;

  const statusCounts = {};
  for (const d of db.deliveries) {
    statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
  }

  const recentDeliveries = db.deliveries
    .map((d) => {
      const user = db.users.find((u) => u.id === d.user_id);
      return { ...d, user_name: user ? user.name : 'Desconhecido' };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  res.json({
    totalUsers,
    totalDrones,
    totalDeliveries,
    activeDeliveries,
    availableDrones,
    deliveriesByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    recentDeliveries,
  });
});

module.exports = router;
