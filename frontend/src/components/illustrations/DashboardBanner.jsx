export default function DashboardBanner({ className = '' }) {
  return (
    <svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="banner-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="banner-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
          <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#00d4ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </linearGradient>
        <filter id="banner-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="800" height="200" rx="16" fill="url(#banner-grad)" />

      <line x1="0" y1="100" x2="800" y2="100" stroke="url(#banner-line)" strokeWidth="0.5" />

      <g opacity="0.3" filter="url(#banner-glow)">
        <path d="M50 180 Q100 140 150 160 Q200 180 250 150 Q300 120 350 155 Q400 190 450 145 Q500 100 550 140 Q600 180 650 130 Q700 80 750 120" stroke="#00d4ff" strokeWidth="0.8" fill="none" opacity="0.3" />
        <path d="M50 190 Q120 160 180 175 Q240 190 300 165 Q360 140 420 170 Q480 200 540 155 Q600 110 660 150 Q720 190 750 160" stroke="#7b61ff" strokeWidth="0.6" fill="none" opacity="0.2" />
      </g>

      <g opacity="0.4">
        <circle cx="100" cy="50" r="3" fill="#00d4ff" />
        <circle cx="200" cy="80" r="2" fill="#7b61ff" />
        <circle cx="350" cy="40" r="4" fill="#00d4ff" />
        <circle cx="500" cy="70" r="2.5" fill="#7b61ff" />
        <circle cx="650" cy="45" r="3" fill="#00d4ff" />
        <circle cx="720" cy="85" r="2" fill="#7b61ff" />
      </g>

      <g opacity="0.15" filter="url(#banner-glow)">
        <circle cx="150" cy="60" r="20" fill="#00d4ff" />
        <circle cx="400" cy="50" r="15" fill="#7b61ff" />
        <circle cx="600" cy="55" r="18" fill="#00d4ff" />
      </g>

      <g filter="url(#banner-glow)">
        <circle cx="150" cy="60" r="4" fill="#00d4ff" opacity="0.6" />
        <circle cx="400" cy="50" r="3" fill="#7b61ff" opacity="0.6" />
        <circle cx="600" cy="55" r="3.5" fill="#00d4ff" opacity="0.6" />
      </g>

      <g opacity="0.2">
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((x, i) => (
          <rect key={i} x={x} y={95} width="1" height={10 + Math.random() * 20} rx="0.5" fill="#00d4ff" opacity={0.2 + Math.random() * 0.3} />
        ))}
      </g>
    </svg>
  );
}
