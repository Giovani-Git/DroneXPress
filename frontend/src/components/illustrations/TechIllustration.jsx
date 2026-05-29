export default function TechIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="tech-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b61ff" />
        </linearGradient>
        <linearGradient id="tech-grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7b61ff" stopOpacity="0.05" />
        </linearGradient>
        <filter id="tech-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="250" cy="200" r="160" stroke="url(#tech-grad)" strokeWidth="0.5" opacity="0.15" />
      <circle cx="250" cy="200" r="120" stroke="url(#tech-grad)" strokeWidth="0.5" opacity="0.1" />

      <g filter="url(#tech-glow)">
        <rect x="160" y="170" width="180" height="100" rx="12" fill="url(#tech-grad2)" stroke="url(#tech-grad)" strokeWidth="0.8" opacity="0.9" />
        <rect x="175" y="185" width="60" height="40" rx="6" fill="#00d4ff" opacity="0.1" />
        <rect x="175" y="185" width="35" height="40" rx="6" fill="#00d4ff" opacity="0.2" />
        <rect x="250" y="185" width="75" height="18" rx="4" fill="#7b61ff" opacity="0.15" />
        <rect x="250" y="210" width="60" height="14" rx="3" fill="#7b61ff" opacity="0.1" />
      </g>

      <g filter="url(#tech-glow)">
        <rect x="190" y="285" width="120" height="8" rx="4" fill="url(#tech-grad)" opacity="0.2" />
        <rect x="210" y="300" width="80" height="6" rx="3" fill="url(#tech-grad)" opacity="0.15" />
      </g>

      <g opacity="0.5" filter="url(#tech-glow)">
        <line x1="200" y1="135" x2="200" y2="325" stroke="#00d4ff" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        <line x1="300" y1="135" x2="300" y2="325" stroke="#7b61ff" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      </g>

      <g opacity="0.4" filter="url(#tech-glow)">
        <circle cx="200" cy="135" r="6" fill="#00d4ff" opacity="0.3" />
        <circle cx="200" cy="135" r="2" fill="#00d4ff" opacity="0.8" />
        <circle cx="300" cy="325" r="6" fill="#7b61ff" opacity="0.3" />
        <circle cx="300" cy="325" r="2" fill="#7b61ff" opacity="0.8" />
      </g>

      <g opacity="0.3">
        <circle cx="130" cy="130" r="3" fill="#00d4ff" />
        <circle cx="370" cy="120" r="2" fill="#7b61ff" />
        <circle cx="110" cy="280" r="2.5" fill="#00d4ff" />
        <circle cx="390" cy="290" r="2" fill="#7b61ff" />
        <circle cx="150" cy="340" r="1.5" fill="#00d4ff" />
        <circle cx="350" cy="100" r="2" fill="#7b61ff" />
      </g>

      <g filter="url(#tech-glow)">
        <path d="M230 160 L230 150" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
        <path d="M270 160 L270 150" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
        <path d="M250 160 L250 145" stroke="#7b61ff" strokeWidth="1.5" opacity="0.4" />
      </g>

      <g opacity="0.15" filter="url(#tech-glow)">
        <rect x="95" y="140" width="50" height="120" rx="8" fill="url(#tech-grad2)" stroke="url(#tech-grad)" strokeWidth="0.5" />
        <rect x="355" y="160" width="50" height="80" rx="8" fill="url(#tech-grad2)" stroke="url(#tech-grad)" strokeWidth="0.5" />
      </g>

      <g opacity="0.2">
        <rect x="105" y="150" width="12" height="18" rx="2" fill="#00d4ff" opacity="0.3" />
        <rect x="125" y="150" width="12" height="12" rx="2" fill="#00d4ff" opacity="0.2" />
        <rect x="365" y="170" width="10" height="14" rx="2" fill="#7b61ff" opacity="0.3" />
        <rect x="383" y="185" width="10" height="10" rx="2" fill="#7b61ff" opacity="0.2" />
      </g>
    </svg>
  );
}
