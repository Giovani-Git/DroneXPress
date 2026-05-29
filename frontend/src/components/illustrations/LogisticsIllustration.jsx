export default function LogisticsIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="log-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b61ff" />
        </linearGradient>
        <filter id="log-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g opacity="0.1">
        <rect x="100" y="220" width="300" height="80" rx="8" fill="url(#log-grad)" />
      </g>

      <g filter="url(#log-glow)">
        <rect x="120" y="220" width="260" height="60" rx="6" fill="url(#log-grad)" opacity="0.08" stroke="url(#log-grad)" strokeWidth="0.5" />
      </g>

      <g filter="url(#log-glow)">
        <rect x="140" y="230" width="40" height="30" rx="4" fill="#00d4ff" opacity="0.15" />
        <line x1="155" y1="235" x2="155" y2="245" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        <line x1="165" y1="235" x2="165" y2="250" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
        <rect x="200" y="235" width="140" height="8" rx="3" fill="#00d4ff" opacity="0.1" />
        <rect x="200" y="248" width="100" height="6" rx="3" fill="#7b61ff" opacity="0.08" />
      </g>

      <g filter="url(#log-glow)">
        <circle cx="360" cy="250" r="8" fill="#00d4ff" opacity="0.15" />
        <circle cx="360" cy="250" r="3" fill="#00d4ff" opacity="0.4" />
      </g>

      <g filter="url(#log-glow)">
        <line x1="200" y1="160" x2="200" y2="220" stroke="#00d4ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
        <line x1="300" y1="140" x2="300" y2="220" stroke="#7b61ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
      </g>

      <g filter="url(#log-glow)" opacity="0.8">
        <rect x="175" y="130" width="50" height="35" rx="6" fill="url(#log-grad)" opacity="0.1" stroke="url(#log-grad)" strokeWidth="0.8" />
        <rect x="182" y="137" width="14" height="12" rx="2" fill="#00d4ff" opacity="0.2" />
        <rect x="200" y="137" width="14" height="8" rx="2" fill="#00d4ff" opacity="0.15" />
        <rect x="182" y="153" width="36" height="6" rx="2" fill="#7b61ff" opacity="0.15" />
      </g>

      <g filter="url(#log-glow)" opacity="0.8">
        <rect x="275" y="110" width="50" height="35" rx="6" fill="url(#log-grad)" opacity="0.1" stroke="url(#log-grad)" strokeWidth="0.8" />
        <rect x="282" y="117" width="14" height="12" rx="2" fill="#00d4ff" opacity="0.2" />
        <rect x="300" y="117" width="14" height="8" rx="2" fill="#7b61ff" opacity="0.15" />
        <rect x="282" y="133" width="36" height="6" rx="2" fill="#7b61ff" opacity="0.15" />
      </g>

      <g filter="url(#log-glow)">
        <path d="M225 148 Q240 140 260 145 Q280 150 275 128" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.4" />
      </g>

      <g opacity="0.3">
        <circle cx="110" cy="170" r="2" fill="#00d4ff" />
        <circle cx="390" cy="150" r="2.5" fill="#7b61ff" />
        <circle cx="80" cy="250" r="1.5" fill="#00d4ff" />
        <circle cx="420" cy="240" r="2" fill="#7b61ff" />
        <circle cx="130" cy="300" r="1.5" fill="#00d4ff" />
        <circle cx="370" cy="300" r="2" fill="#7b61ff" />
      </g>

      <g opacity="0.15">
        <circle cx="250" cy="100" r="60" fill="url(#log-grad)" />
      </g>

      <g opacity="0.1">
        <rect x="340" y="260" width="30" height="40" rx="3" fill="#00d4ff" />
        <rect x="355" y="250" width="20" height="50" rx="2" fill="#7b61ff" />
        <rect x="130" y="250" width="25" height="45" rx="3" fill="#00d4ff" />
        <rect x="142" y="260" width="15" height="35" rx="2" fill="#7b61ff" />
      </g>
    </svg>
  );
}
