const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const droneRoutes = require('./routes/drones');
const deliveryRoutes = require('./routes/deliveries');
const adminRoutes = require('./routes/admin');
const reportRoutes = require('./routes/reports');
const operationRoutes = require('./routes/operations');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} nao encontrada` });
});

app.listen(PORT, () => {
  console.log(`DroneXPress API rodando na porta ${PORT}`);
});