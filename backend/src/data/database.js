const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'db.json');

const defaultData = {
  users: [
    {
      id: 'admin-001',
      name: 'Admin',
      email: 'admin@dronexpress.com',
      phone: '(54) 99999-0000',
      company: 'DroneXPress',
      address: { rua: 'Rua das Tecnologias', numero: '100', bairro: 'Centro', cidade: 'Passo Fundo', cep: '99010-000' },
      paymentMethod: 'cartao',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      created_at: new Date().toISOString(),
    },
  ],
  drones: [
    { id: uuidv4(), name: 'DJI FlyCart 30', model: 'FC30', speed: 80, battery: 100, status: 'disponivel', max_weight: 30, category: 'medio' },
    { id: uuidv4(), name: 'DJI FlyCart 100', model: 'FC100', speed: 95, battery: 100, status: 'disponivel', max_weight: 50, category: 'medio' },
    { id: uuidv4(), name: 'Wingcopter 198', model: 'WC198', speed: 110, battery: 100, status: 'disponivel', max_weight: 75, category: 'pesado' },
    { id: uuidv4(), name: 'Zipline P2', model: 'P2 Zip', speed: 70, battery: 100, status: 'disponivel', max_weight: 10, category: 'leve' },
    { id: uuidv4(), name: 'Matternet M2', model: 'M2', speed: 85, battery: 100, status: 'disponivel', max_weight: 25, category: 'medio' },
    { id: uuidv4(), name: 'DHL Parcelcopter', model: 'PC-4000', speed: 130, battery: 100, status: 'disponivel', max_weight: 100, category: 'pesado' },
  ],
  deliveries: [],
  reports: [],
};

let data = null;

function load() {
  if (data) return data;
  try {
    if (fs.existsSync(DB_PATH)) {
      data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      for (const key of Object.keys(defaultData)) {
        if (!(key in data)) data[key] = JSON.parse(JSON.stringify(defaultData[key]));
      }
    } else {
      data = JSON.parse(JSON.stringify(defaultData));
      save();
    }
  } catch {
    data = JSON.parse(JSON.stringify(defaultData));
    save();
  }

  // Reset drones stuck in 'em_entrega' with no active delivery
  if (data.drones && data.deliveries) {
    const activeStatuses = ['em_andamento', 'coletado', 'em_transito', 'proximo_da_entrega'];
    const activeDroneIds = new Set(
      data.deliveries.filter((d) => activeStatuses.includes(d.status) && d.drone_id).map((d) => d.drone_id)
    );
    for (const drone of data.drones) {
      if (drone.status === 'em_entrega' && !activeDroneIds.has(drone.id)) {
        drone.status = 'disponivel';
      }
    }
  }

  return data;
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getDB() {
  return load();
}

module.exports = { getDB, save };
