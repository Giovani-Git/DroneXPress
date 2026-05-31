# DroneXPress

Sistema web moderno para gestão de entregas por drones autônomos. Projeto full-stack com design futurista, glassmorphism e simulação de drone em tempo real.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 19, Vite, TailwindCSS 4, React Router, Leaflet, Recharts |
| Backend | Node.js, Express, JWT, bcrypt |
| Deploy | Vercel (frontend), Render (backend) |

## Funcionalidades

- **Landing Page** — Hero, Sobre, Como Funciona, Sustentabilidade, FAQ
- **Autenticação** — Registro/login com JWT, rotas protegidas por role (user/admin)
- **Dashboard** — Stats cards, gráficos, resumo de entregas
- **Solicitar Entrega** — Wizard 3 etapas: formulário → simulação → pagamento
- **Rastreamento** — Mapa Leaflet com drone animado, progresso em tempo real, multi-perna (base → coleta → destino)
- **Cancelamento** — Taxa proporcional à distância percorrida
- **Notificações** — Sistema interno com milestones (coletado/entregue), persistência por localStorage
- **Frota** — Cards com status, bateria e especificações
- **Reports** — Problemas vinculados a entregas ou reports avulsos (suporte)
- **Admin** — Painel com overview, CRUD de usuários/drones/entregas/reports
- **Perfil** — Dados pessoais, pagamento, privacidade, segurança (exclusão de conta)

## Regiões Atendidas

Passo Fundo (base), Marau, Carazinho, Soledade, Erechim, Caxias do Sul, Porto Alegre, São Paulo

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

API em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend em `http://localhost:5173`

## Deploy

### Frontend (Vercel)
1. Conecte o repositório na Vercel
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output: `dist`
5. Adicione env var: `VITE_API_URL=https://seu-backend.onrender.com/api`
6. O `vercel.json` já faz rewrite SPA para rotas como `/dashboard`

### Backend (Render)
1. Crie um Web Service apontando para `backend/`
2. Start command: `node src/server.js`
3. O servidor já usa `process.env.PORT`

## Credenciais de Teste

- **Admin:** admin@dronexpress.com / admin123
- **Usuário:** cadastre-se na tela de registro

## Ambiente

| Variável | Onde | Valor (dev) | Valor (prod) |
|----------|------|-------------|--------------|
| `VITE_API_URL` | Frontend (Vercel) | não definir | `https://api.onrender.com/api` |
| `PORT` | Backend (Render) | `3001` | definido pela plataforma |

## Estrutura

```
dronexpress/
├── backend/
│   └── src/
│       ├── data/          # Banco JSON + database.js
│       ├── middleware/     # Autenticação JWT
│       ├── routes/        # auth, drones, deliveries, admin, reports
│       └── server.js      # Express + CORS + 404 handler
├── frontend/
│   └── src/
│       ├── components/    # Navbar, AppLayout, TrackingMap, etc.
│       ├── contexts/      # Auth, Theme, Notification
│       ├── pages/         # Landing, Dashboard, DeliveryDetail, etc.
│       ├── utils/         # Validation helpers
│       ├── api.js         # API client (usa VITE_API_URL)
│       ├── App.jsx        # Rotas com ProtectedRoute
│       └── main.jsx       # Entry point
├── frontend/vercel.json   # SPA rewrites
└── README.md
```

## Design

- **Cores:** Azul neon (#00d4ff), dark bg (#0a0a1a), glass
- **Estilo:** Glassmorphism, gradientes, sombras neon
- **Animações:** Float, pulse glow, slide-up, fade-in
- **Responsivo:** Mobile, tablet e desktop
