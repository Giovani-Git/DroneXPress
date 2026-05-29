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

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`DroneXPress API rodando na porta ${PORT}`);
});