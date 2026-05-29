import { Star } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20 animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-t-2 border-neon-blue animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="w-6 h-6 text-neon-blue" />
          </div>
        </div>
        <p className="text-neon-blue animate-pulse-glow">Carregando...</p>
      </div>
    </div>
  );
}
