# DroneXPress 🚁

**O futuro das entregas já começou.**

Sistema web moderno para gestão de entregas por drones autônomos. Projeto de apresentação acadêmica com design futurista, glassmorphism e animações suaves.

## Tecnologias

### Frontend
- React 19
- Vite
- TailwindCSS 4
- React Router DOM
- Leaflet (mapas)
- Recharts (gráficos)

### Backend
- Node.js
- Express
- JSON (banco de dados)

## Funcionalidades

1. **Landing Page** — Hero com animação de drone, seções: Sobre, Como Funciona, Benefícios, Sustentabilidade, Parceiros, FAQ
2. **Autenticação** — Login e cadastro de usuários
3. **Dashboard** — Painel do usuário com resumo de entregas
4. **Solicitar Entrega** — Simulação de distância, tempo e custo
5. **Histórico** — Acompanhamento de entregas com filtros
6. **Detalhes + Mapa** — Rota no mapa com Leaflet e posição do drone
7. **Frota de Drones** — Cards com status, bateria e especificações
8. **Admin** — Painel administrativo com gráficos, usuários, drones e entregas

## Regiões Atendidas

- Passo Fundo — RS
- Marau — RS

## Instalação

### Pré-requisitos
- Node.js 18+
- npm

### 1. Backend

```bash
cd backend
npm install
npm start
```

A API roda em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`

## Credenciais de Teste

- **Admin:** admin@dronexpress.com / admin123
- **Usuário:** cadastre-se na tela de registro

## Estrutura

```
dronexpress/
├── backend/
│   └── src/
│       ├── data/          # Banco JSON
│       ├── middleware/     # Autenticação JWT
│       ├── routes/        # auth, drones, deliveries, admin
│       └── server.js      # Servidor Express
├── frontend/
│   └── src/
│       ├── components/    # Navbar, Footer, Loading, TrackingMap
│       ├── contexts/      # AuthContext
│       ├── pages/        # Landing, Login, Dashboard, etc.
│       ├── api.js        # API client
│       └── App.jsx       # Rotas
└── README.md
```

## Design

- **Cores:** Azul neon (#00d4ff), preto, branco
- **Estilo:** Glassmorphism, gradientes, sombras neon
- **Animações:** Float, pulse glow, slide-up, fade-in
- **Responsivo:** Mobile, tablet e desktop
