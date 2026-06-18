const express = require('express');
const { getDB } = require('../data/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const statusFlow = ['pedido_criado', 'aguardando_aprovacao', 'drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino', 'entregue', 'cancelado'];

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

function getDronePosition(drone, deliveries) {
  if (drone.status !== 'em_entrega') return null;
  const active = deliveries.find((d) => d.drone_id === drone.id && !['entregue', 'cancelado'].includes(d.status));
  if (!active) return null;
  const idx = statusFlow.indexOf(active.status);
  const progress = idx > 0 ? Math.min((idx / (statusFlow.indexOf('entregue'))) * 100, 99) : 0;
  const base = cities['passo fundo'] || { lat: -28.2628, lng: -52.4067 };
  const oCity = active.originAddress?.cidade || active.origin || 'passo fundo';
  const dCity = active.destAddress?.cidade || active.destination || 'marau';
  const origin = cities[oCity.toLowerCase()] || base;
  const dest = cities[dCity.toLowerCase()] || base;
  const lat = origin.lat + (dest.lat - origin.lat) * (progress / 100);
  const lng = origin.lng + (dest.lng - origin.lng) * (progress / 100);
  return { lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000, deliveryId: active.id, progress: Math.round(progress) };
}

function calcProgress(status) {
  if (status === 'cancelado') return 0;
  const idx = statusFlow.indexOf(status);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / (statusFlow.indexOf('entregue'))) * 100);
}

router.get('/', (req, res) => {
  const db = getDB();
  const activeStatuses = ['drone_selecionado', 'preparando_coleta', 'coleta_realizada', 'em_rota', 'proximo_ao_destino'];
  const activeDeliveries = db.deliveries.filter((d) => activeStatuses.includes(d.status));
  const availableDrones = db.drones.filter((d) => d.status === 'disponivel').length;
  const inMaintenance = db.drones.filter((d) => d.status === 'manutencao').length;
  const inTransit = db.drones.filter((d) => d.status === 'em_entrega').length;
  const alerts = [];

  for (const d of db.drones) {
    if (d.battery <= 10) alerts.push({ type: 'critical', icon: 'battery', message: `Drone ${d.name} com bateria critica (${d.battery}%)`, droneId: d.id });
    else if (d.battery <= 20) alerts.push({ type: 'warning', icon: 'battery', message: `Drone ${d.name} com bateria baixa (${d.battery}%)`, droneId: d.id });
  }

  for (const d of activeDeliveries) {
    const created = new Date(d.created_at).getTime();
    const elapsed = Date.now() - created;
    if (elapsed > d.estimated_time * 60 * 1000 * 1.5) {
      alerts.push({ type: 'warning', icon: 'delay', message: `Entrega #${d.id.slice(0, 8)} com atraso`, deliveryId: d.id });
    }
  }

  for (const r of db.reports) {
    if (r.status === 'aberto') {
      alerts.push({ type: 'info', icon: 'report', message: `Reporte pendente de ${r.user_name || 'usuario'}`, reportId: r.id });
    }
  }

  const dronePositions = db.drones.map((d) => ({
    id: d.id,
    name: d.name,
    model: d.model,
    status: d.status,
    battery: d.battery,
    speed: d.speed,
    max_weight: d.max_weight,
    position: getDronePosition(d, db.deliveries),
  }));

  res.json({
    stats: {
      totalDrones: db.drones.length,
      availableDrones,
      inMaintenance,
      inTransit,
      activeDeliveries: activeDeliveries.length,
      totalDeliveries: db.deliveries.length,
      fleetUtilization: db.drones.length > 0 ? Math.round(((db.drones.length - availableDrones) / db.drones.length) * 100) : 0,
      alertsCount: alerts.length,
    },
    drones: dronePositions,
    activeDeliveries: activeDeliveries.map((d) => {
      const user = db.users.find((u) => u.id === d.user_id);
      return { ...d, user_name: user?.name || 'Desconhecido', progress: calcProgress(d.status) };
    }),
    alerts,
  });
});

router.get('/financial', (req, res) => {
  const db = getDB();
  const now = Date.now();
  const dayMs = 86400000;

  const daily = [];
  for (let i = 29; i >= 0; i--) {
    const start = new Date(now - i * dayMs);
    const end = new Date(now - (i - 1) * dayMs);
    const dayDeliveries = db.deliveries.filter((d) => {
      const c = new Date(d.created_at).getTime();
      return c >= start.getTime() && c < end.getTime() && d.status === 'entregue';
    });
    const revenue = dayDeliveries.reduce((s, d) => s + (d.cost || 0), 0);
    daily.push({ date: start.toISOString().slice(0, 10), revenue: Math.round(revenue * 100) / 100, count: dayDeliveries.length });
  }

  const weekly = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now - i * 7 * dayMs);
    const end = new Date(now - (i - 1) * 7 * dayMs);
    const weekDeliveries = db.deliveries.filter((d) => {
      const c = new Date(d.created_at).getTime();
      return c >= start.getTime() && c < end.getTime() && d.status === 'entregue';
    });
    const revenue = weekDeliveries.reduce((s, d) => s + (d.cost || 0), 0);
    weekly.push({ week: `Semana ${i + 1}`, revenue: Math.round(revenue * 100) / 100, count: weekDeliveries.length });
  }

  const monthly = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now - i * 30 * dayMs);
    const end = new Date(now - (i - 1) * 30 * dayMs);
    const monthDeliveries = db.deliveries.filter((d) => {
      const c = new Date(d.created_at).getTime();
      return c >= start.getTime() && c < end.getTime() && d.status === 'entregue';
    });
    const revenue = monthDeliveries.reduce((s, d) => s + (d.cost || 0), 0);
    monthly.push({ month: start.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }), revenue: Math.round(revenue * 100) / 100, count: monthDeliveries.length });
  }

  const totalRevenue = db.deliveries.filter((d) => d.status === 'entregue').reduce((s, d) => s + (d.cost || 0), 0);
  const totalCost = totalRevenue * 0.6;
  const estimatedProfit = totalRevenue - totalCost;

  const thisMonthDeliveries = db.deliveries.filter((d) => {
    const c = new Date(d.created_at).getTime();
    return c >= Date.now() - 30 * dayMs && d.status === 'entregue';
  });
  const thisMonthRevenue = thisMonthDeliveries.reduce((s, d) => s + (d.cost || 0), 0);
  const projectedAnnual = (thisMonthRevenue || 0) * 12;

  res.json({
    daily,
    weekly,
    monthly,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    estimatedProfit: Math.round(estimatedProfit * 100) / 100,
    projectedAnnual: Math.round(projectedAnnual * 100) / 100,
    thisMonthRevenue: Math.round(thisMonthRevenue * 100) / 100,
    thisMonthDeliveries: thisMonthDeliveries.length,
  });
});

router.get('/rankings', (req, res) => {
  const db = getDB();

  const droneUsage = {};
  for (const d of db.deliveries) {
    if (d.drone_name) {
      droneUsage[d.drone_name] = (droneUsage[d.drone_name] || 0) + 1;
    }
  }
  const topDrones = Object.entries(droneUsage)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const cityCount = {};
  for (const d of db.deliveries) {
    const city = d.destAddress?.cidade || d.destination || 'desconhecida';
    cityCount[city] = (cityCount[city] || 0) + 1;
  }
  const topCities = Object.entries(cityCount)
    .map(([city, count]) => ({ city: city.charAt(0).toUpperCase() + city.slice(1), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const userOrders = {};
  for (const d of db.deliveries) {
    userOrders[d.user_id] = (userOrders[d.user_id] || 0) + 1;
  }
  const topUsers = Object.entries(userOrders)
    .map(([uid, count]) => {
      const u = db.users.find((x) => x.id === uid);
      return { name: u?.name || 'Desconhecido', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dronePerformance = db.drones.map((d) => {
    const completed = db.deliveries.filter((x) => x.drone_id === d.id && x.status === 'entregue').length;
    const total = db.deliveries.filter((x) => x.drone_id === d.id).length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: d.name, model: d.model, completed, total, successRate, battery: d.battery };
  }).sort((a, b) => b.completed - a.completed);

  res.json({ topDrones, topCities, topUsers, dronePerformance });
});

router.get('/sustainability', (req, res) => {
  const db = getDB();
  const delivered = db.deliveries.filter((d) => d.status === 'entregue');
  const totalDistance = delivered.reduce((s, d) => s + (d.distance || 0), 0);

  const avgCarEmissionPerKm = 0.12;
  const co2Saved = Math.round(totalDistance * avgCarEmissionPerKm * 100) / 100;
  const fuelSaved = Math.round(totalDistance * 0.08 * 100) / 100;
  const treesEquivalent = Math.round(co2Saved / 21 * 100) / 100;

  res.json({
    totalDeliveriesByDrone: delivered.length,
    totalDistanceKm: Math.round(totalDistance * 100) / 100,
    co2EconomizadoKg: co2Saved,
    combustivelEconomizadoL: fuelSaved,
    arvoresEquivalentes: treesEquivalent,
    impactoAmbiental: 'positivo',
  });
});

router.get('/export/:type', (req, res) => {
  const db = getDB();
  const { type } = req.params;

  let data = [];
  let header = [];

  if (type === 'deliveries') {
    header = ['ID', 'Origem', 'Destino', 'Distancia', 'Custo', 'Status', 'Drone', 'Data'];
    data = db.deliveries.map((d) => [d.id, d.origin, d.destination, `${d.distance} km`, `R$ ${d.cost?.toFixed(2)}`, d.status, d.drone_name || '-', new Date(d.created_at).toLocaleDateString('pt-BR')]);
  } else if (type === 'drones') {
    header = ['Nome', 'Modelo', 'Velocidade', 'Bateria', 'Status', 'Carga Max'];
    data = db.drones.map((d) => [d.name, d.model, `${d.speed} km/h`, `${d.battery}%`, d.status, `${d.max_weight} kg`]);
  } else if (type === 'users') {
    header = ['Nome', 'Email', 'Empresa', 'Tipo', 'Cadastro'];
    data = db.users.map(({ password, ...u }) => [u.name, u.email, u.company || '-', u.role === 'admin' ? 'Admin' : 'Usuario', new Date(u.created_at).toLocaleDateString('pt-BR')]);
  } else if (type === 'financial') {
    header = ['Total Entregas', 'Receita Total', 'Custo Total', 'Lucro Estimado', 'Projecao Anual'];
    const delivered = db.deliveries.filter((d) => d.status === 'entregue');
    const totalRevenue = delivered.reduce((s, d) => s + (d.cost || 0), 0);
    data = [[delivered.length, `R$ ${totalRevenue.toFixed(2)}`, `R$ ${(totalRevenue * 0.6).toFixed(2)}`, `R$ ${(totalRevenue * 0.4).toFixed(2)}`, `R$ ${(totalRevenue * 12 / Math.max(1, new Date().getMonth() + 1)).toFixed(2)}`]];
    res.json({ header, data });
    return;
  } else {
    return res.status(400).json({ error: 'Tipo invalido. Use: deliveries, drones, users, financial' });
  }

  res.json({ header, data });
});

module.exports = router;
