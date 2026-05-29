export default function ProfileCover({ className = '' }) {
  return (
    <svg viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="cover-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="cover-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
          <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7b61ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </linearGradient>
        <filter id="cover-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="600" height="120" rx="12" fill="url(#cover-grad)" />

      <g opacity="0.3" filter="url(#cover-glow)">
        <path d="M0 100 Q80 70 160 90 Q240 110 320 80 Q400 50 480 75 Q560 100 600 85" stroke="url(#cover-line)" strokeWidth="1" fill="none" />
        <path d="M0 110 Q100 85 200 100 Q300 115 400 90 Q500 65 600 95" stroke="#7b61ff" strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>

      <g opacity="0.3">
        <circle cx="80" cy="30" r="2" fill="#00d4ff" />
        <circle cx="200" cy="45" r="1.5" fill="#7b61ff" />
        <circle cx="350" cy="25" r="2.5" fill="#00d4ff" />
        <circle cx="500" cy="35" r="1.5" fill="#7b61ff" />
        <circle cx="550" cy="50" r="2" fill="#00d4ff" />
      </g>

      <g opacity="0.1" filter="url(#cover-glow)">
        <circle cx="120" cy="35" r="15" fill="#00d4ff" />
        <circle cx="320" cy="30" r="12" fill="#7b61ff" />
        <circle cx="480" cy="40" r="10" fill="#00d4ff" />
      </g>
    </svg>
  );
}
