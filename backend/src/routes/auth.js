const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDB, save } = require('../data/database');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos sao obrigatorios' });
  }

  const db = getDB();
  const existing = db.users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email ja cadastrado' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    phone: '',
    company: '',
    address: { rua: '', numero: '', bairro: '', cidade: '', cep: '' },
    paymentMethod: 'cartao',
    password: hash,
    role: 'user',
    created_at: new Date().toISOString(),
  };

  db.users.push(user);
  save();

  const token = generateToken(user);
  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatorios' });
  }

  const db = getDB();
  const user = db.users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const token = generateToken(user);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      address: user.address || { rua: '', numero: '', bairro: '', cidade: '', cep: '' },
      paymentMethod: user.paymentMethod || 'cartao',
      role: user.role,
    },
    token,
  });
});

router.get('/profile', authMiddleware, (req, res) => {
  const db = getDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    company: user.company || '',
    address: user.address || { rua: '', numero: '', bairro: '', cidade: '', cep: '' },
    paymentMethod: user.paymentMethod || 'cartao',
    role: user.role,
    created_at: user.created_at,
  });
});

router.put('/profile', authMiddleware, (req, res) => {
  const db = getDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

  const { name, phone, company, address, paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, showName, showEmail, showPhone, notifEmail, notifSms, notifPromo, language, currentPassword, newPassword } = req.body;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (company !== undefined) user.company = company;
  if (address) user.address = { ...user.address, ...address };
  if (paymentMethod) user.paymentMethod = paymentMethod;
  if (cardNumber !== undefined) user.cardNumber = cardNumber;
  if (cardName !== undefined) user.cardName = cardName;
  if (cardExpiry !== undefined) user.cardExpiry = cardExpiry;
  if (cardCvv !== undefined) user.cardCvv = cardCvv;
  if (showName !== undefined) user.showName = showName;
  if (showEmail !== undefined) user.showEmail = showEmail;
  if (showPhone !== undefined) user.showPhone = showPhone;
  if (notifEmail !== undefined) user.notifEmail = notifEmail;
  if (notifSms !== undefined) user.notifSms = notifSms;
  if (notifPromo !== undefined) user.notifPromo = notifPromo;
  if (language !== undefined) user.language = language;

  if (currentPassword && newPassword) {
    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    user.password = bcrypt.hashSync(newPassword, 10);
  }

  save();

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    company: user.company || '',
    address: user.address || { rua: '', numero: '', bairro: '', cidade: '', cep: '' },
    paymentMethod: user.paymentMethod || 'cartao',
    cardNumber: user.cardNumber || '',
    cardName: user.cardName || '',
    cardExpiry: user.cardExpiry || '',
    cardCvv: user.cardCvv || '',
    showName: user.showName !== false,
    showEmail: user.showEmail !== false,
    showPhone: user.showPhone !== false,
    notifEmail: user.notifEmail !== false,
    notifSms: user.notifSms || false,
    notifPromo: user.notifPromo || false,
    language: user.language || 'pt-BR',
    role: user.role,
    created_at: user.created_at,
  });
});

router.delete('/profile', authMiddleware, (req, res) => {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Usuario nao encontrado' });

  db.users.splice(idx, 1);

  db.deliveries = db.deliveries.filter((d) => d.user_id !== req.user.id);

  save();
  res.json({ message: 'Conta excluida com sucesso' });
});

module.exports = router;
