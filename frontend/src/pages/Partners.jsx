import { Store, Pill, UtensilsCrossed, Building, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    icon: UtensilsCrossed,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    partners: [
      { name: 'Pizza Express', city: 'Passo Fundo', rating: 4.8, time: '25-40 min', deliveryFee: 7 },
      { name: 'Sushi Master', city: 'Marau', rating: 4.6, time: '20-35 min', deliveryFee: 6 },
      { name: 'Brasa Grill', city: 'Passo Fundo', rating: 4.9, time: '30-45 min', deliveryFee: 8 },
      { name: 'Tempera Arte', city: 'Marau', rating: 4.7, time: '20-30 min', deliveryFee: 5 },
    ],
  },
  {
    id: 'farmacias',
    label: 'Farmacias',
    icon: Pill,
    color: 'text-green-400',
    bg: 'bg-green-500/15',
    partners: [
      { name: 'Farma Vida', city: 'Passo Fundo', rating: 4.9, time: '10-20 min', deliveryFee: 5 },
      { name: 'Droga Rápida', city: 'Marau', rating: 4.7, time: '10-15 min', deliveryFee: 4 },
      { name: 'Farma Popular', city: 'Passo Fundo', rating: 4.8, time: '15-25 min', deliveryFee: 5 },
    ],
  },
  {
    id: 'mercados',
    label: 'Mercados',
    icon: Store,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/15',
    partners: [
      { name: 'Super Bom', city: 'Passo Fundo', rating: 4.6, time: '20-40 min', deliveryFee: 8 },
      { name: 'Mercado Fácil', city: 'Marau', rating: 4.5, time: '15-30 min', deliveryFee: 6 },
      { name: 'Atacadão Local', city: 'Passo Fundo', rating: 4.7, time: '25-45 min', deliveryFee: 10 },
    ],
  },
  {
    id: 'hospitais',
    label: 'Hospitais',
    icon: Building,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    partners: [
      { name: 'Hospital São Vicente', city: 'Passo Fundo', rating: 5.0, time: '5-15 min', deliveryFee: 0 },
      { name: 'Hospital Nossa Senhora', city: 'Marau', rating: 5.0, time: '5-15 min', deliveryFee: 0 },
    ],
  },
];

export default function Partners() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Parceiros DroneXpress</h1>
        <p className="text-gray-400">Conheca nossos parceiros e peca ja sua entrega com drone</p>
      </div>

      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <section key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <h2 className="text-xl font-bold text-white">{cat.label}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cat.partners.map((p) => (
                <div key={p.name} className="glass-card rounded-2xl p-5 hover:border-sky-500/30 transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-lg">
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-yellow-400 text-sm font-medium">★ {p.rating}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    {p.city}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>{p.time}</span>
                    <span className="text-sky-400 font-medium">{p.deliveryFee === 0 ? 'Gratuito' : `R$ ${p.deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <Link
                    to="/new-delivery"
                    state={{ partner: p.name, city: p.city }}
                    className="flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-sky-500/15 text-sky-400 text-sm font-medium hover:bg-sky-500/25 transition-colors"
                  >
                    Pedir entrega
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
