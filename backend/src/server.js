const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const droneRoutes = require('./routes/drones');
const deliveryRoutes = require('./routes/deliveries');
const adminRoutes = require('./routes/admin');
const reportRoutes = require('./routes/reports');

const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://dronexpress.vercel.app',
  'https://dronexpress-coral.vercel.app',
  'https://dronexpress-git-main.vercel.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true);
  },
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Rota ${req.method} ${req.path} nao encontrada` });
});

app.listen(PORT, () => {
  console.log(`DroneXPress API rodando na porta ${PORT}`);
});