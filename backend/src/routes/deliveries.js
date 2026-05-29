const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDB, save } = require('../data/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const cities = {
  'passo fundo': { lat: -28.2628, lng: -52.4067 },
  'marau': { lat: -28.4494, lng: -52.1986 },
  'carazinho': { lat: -28.2833, lng: -52.7833 },
  'soledade': { lat: -28.8181, lng: -52.5103 },
  'erechim': { lat: -27.6333, lng: -52.2667 },
  'caxias do sul': { lat: -29.1667, lng: -51.1833 },
  'porto alegre': { lat: -30.0331, lng: -51.23 },
  'sao paulo': { lat: -23.5505, lng: -46.6333 },
};

function simulateDistance(originCity, destCity) {
  const o = cities[originCity.toLowerCase()];
  const d = cities[destCity.toLowerCase()];
  if (!o || !d) return Math.round((50 + Math.random() * 200) * 10) / 10;
  const R = 6371;
  const dLat = ((d.lat - o.lat) * Math.PI) / 180;
  const dLng = ((d.lng - o.lng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((o.lat * Math.PI) / 180) * Math.cos((d.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function simulateTime(distance) {
  return Math.max(10, Math.round((distance / 80) * 60));
}

function simulateCost(distance, weight) {
  return Math.round((15 + distance * 1.2 + weight * 2.5) * 100) / 100;
}

function droneCost(distance, weight, droneSpeed) {
  const baseCost = 15 + distance * 1.2 + weight * 2.5;
  const speedFactor = droneSpeed / 80;
  const adjusted = baseCost * speedFactor;
  return Math.round(adjusted * 100) / 100;
}

const statusFlow = ['pendente', 'em_andamento', 'coletado', 'em_transito', 'proximo_da_entrega', 'entregue', 'cancelado'];

function getAddressString(addr) {
  if (!addr) return '';
  return `${addr.rua || ''}, ${addr.numero || ''} - ${addr.bairro || ''}, ${addr.cidade || ''}${addr.cep ? ' - CEP ' + addr.cep : ''}`;
}

router.get('/available-drones', authMiddleware, (req, res) => {
  const db = getDB();
  const weight = parseFloat(req.query.weight);
  const available = db.drones
    .filter((d) => d.status === 'disponivel' && d.max_weight >= weight)
    .map((d) => ({
      id: d.id,
      name: d.name,
      model: d.model,
      speed: d.speed,
      battery: d.battery,
      max_weight: d.max_weight,
      category: d.category,
    }));
  res.json(available);
});

function totalRouteDist(originCity, destCity) {
  const baseCity = 'passo fundo';
  const leg1 = simulateDistance(baseCity, originCity);
  const leg2 = simulateDistance(originCity, destCity);
  return { leg1, leg2, total: leg1 + leg2 };
}

router.post('/simulate', authMiddleware, (req, res) => {
  const { origin, destination, weight } = req.body;
  if (!origin?.cidade || !destination?.cidade || !weight) {
    return res.status(400).json({ error: 'Origem, destino e peso sao obrigatorios' });
  }

  const route = totalRouteDist(origin.cidade, destination.cidade);
  const distance = Math.round(route.total * 10) / 10;
  const estimatedTime = simulateTime(distance);
  const cost = simulateCost(distance, weight);

  const db = getDB();
  let availableDrones = db.drones.filter((d) => d.status === 'disponivel' && d.max_weight >= weight);

  availableDrones.sort((a, b) => {
    const diffA = Math.abs(a.max_weight - weight);
    const diffB = Math.abs(b.max_weight - weight);
    if (diffA !== diffB) return diffA - diffB;
    return b.speed - a.speed;
  });

  const mappedDrones = availableDrones.map((d, i) => ({
    id: d.id,
    name: d.name,
    model: d.model,
    speed: d.speed,
    battery: d.battery,
    max_weight: d.max_weight,
    category: d.category,
    droneCost: droneCost(distance, weight, d.speed),
    recommended: i === 0,
  }));

  res.json({
    origin: getAddressString(origin),
    destination: getAddressString(destination),
    originCity: origin.cidade,
    destCity: destination.cidade,
    weight: parseFloat(weight),
    distance,
    estimatedTime,
    cost,
    leg1Dist: route.leg1,
    leg2Dist: route.leg2,
    availableDrones: mappedDrones,
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { origin, destination, weight, drone_id, description, company } = req.body;
  if (!origin?.cidade || !destination?.cidade || !weight) {
    return res.status(400).json({ error: 'Origem, destino e peso sao obrigatorios' });
  }

  const db = getDB();
  const route = totalRouteDist(origin.cidade, destination.cidade);
  const distance = Math.round(route.total * 10) / 10;
  const estimatedTime = simulateTime(distance);
  const cost = simulateCost(distance, weight);

  let drone = null;
  if (drone_id) {
    drone = db.drones.find((d) => d.id === drone_id && d.status === 'disponivel' && d.max_weight >= weight);
    if (!drone) {
      const exists = db.drones.find((d) => d.id === drone_id);
      if (!exists) return res.status(400).json({ error: 'Drone nao encontrado' });
      if (exists.max_weight < weight) return res.status(400).json({ error: 'Drone nao suporta esse peso' });
      return res.status(400).json({ error: 'Drone nao esta disponivel' });
    }
  } else {
    drone = db.drones.find((d) => d.status === 'disponivel' && d.max_weight >= weight) || null;
  }

  const delivery = {
    id: uuidv4(),
    user_id: req.user.id,
    origin: getAddressString(origin),
    destination: getAddressString(destination),
    originAddress: origin,
    destAddress: destination,
    weight: parseFloat(weight),
    distance,
    estimated_time: estimatedTime,
    cost,
    description: description || '',
    company: company || '',
    leg1Dist: route.leg1,
    leg2Dist: route.leg2,
    status: drone ? 'em_andamento' : 'pendente',
    drone_id: drone ? drone.id : null,
    drone_name: drone ? drone.name : null,
    drone_model: drone ? drone.model : null,
    drone_speed: drone ? drone.speed : null,
    created_at: new Date().toISOString(),
  };

  db.deliveries.push(delivery);
  if (drone) drone.status = 'em_entrega';
  save();

  res.status(201).json(delivery);
});

router.get('/', authMiddleware, (req, res) => {
  const db = getDB();
  const deliveries = db.deliveries
    .filter((d) => d.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(deliveries);
});

function freeDrone(delivery, db) {
  if (delivery.drone_id) {
    const drone = db.drones.find((d) => d.id === delivery.drone_id);
    if (drone) drone.status = 'disponivel';
  }
}

function calcProgress(status) {
  if (status === 'cancelado') return 0;
  const idx = statusFlow.indexOf(status);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / (statusFlow.length - 1)) * 100);
}

router.get('/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const delivery = db.deliveries.find((d) => d.id === req.params.id && d.user_id === req.user.id);
  if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });

  const progress = calcProgress(delivery.status);
  res.json({ ...delivery, progress });
});

router.patch('/:id', authMiddleware, (req, res) => {
  const db = getDB();
  const delivery = db.deliveries.find((d) => d.id === req.params.id && d.user_id === req.user.id);
  if (!delivery) return res.status(404).json({ error: 'Entrega nao encontrada' });

  const { status, progress: clientProgress } = req.body;
  if (status !== undefined) {
    if (status === 'cancelado') {
      if (['entregue', 'cancelado'].includes(delivery.status)) {
        return res.status(400).json({ error: 'Entrega ja finalizada nao pode ser cancelada' });
      }
      delivery.status = 'cancelado';
      const pct = Math.min(Math.max(clientProgress || 0, 0), 100);
      const baseFee = 5;
      const distanceFee = (pct / 100) * delivery.cost * 0.4;
      delivery.cancelFee = Math.round((baseFee + distanceFee) * 100) / 100;
      freeDrone(delivery, db);
    } else {
      if (!statusFlow.includes(status)) return res.status(400).json({ error: 'Status invalido' });
      const currentIdx = statusFlow.indexOf(delivery.status);
      const nextIdx = statusFlow.indexOf(status);
      if (nextIdx < currentIdx) return res.status(400).json({ error: 'Nao e possivel voltar o status' });
      delivery.status = status;
      if (status === 'entregue') freeDrone(delivery, db);
    }
  }

  save();
  const progress = calcProgress(delivery.status);
  res.json({ ...delivery, progress });
});

module.exports = router;
