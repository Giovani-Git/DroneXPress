export default function DroneHero({ className = '' }) {
  return (
    <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="drone-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b61ff" />
        </linearGradient>
        <linearGradient id="drone-grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7b61ff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="city-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7b61ff" stopOpacity="0.05" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g opacity="0.4">
        <circle cx="300" cy="250" r="180" stroke="url(#drone-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="300" cy="250" r="140" stroke="url(#drone-grad)" strokeWidth="0.5" fill="none" opacity="0.2" />
        <circle cx="300" cy="250" r="100" stroke="url(#drone-grad)" strokeWidth="0.5" fill="none" opacity="0.15" />
      </g>

      <g filter="url(#glow)">
        <rect x="230" y="218" width="140" height="28" rx="14" fill="url(#drone-grad)" opacity="0.15" />
        <rect x="240" y="224" width="120" height="16" rx="8" fill="url(#drone-grad)" opacity="0.25" />
      </g>

      <ellipse cx="300" cy="232" rx="80" ry="8" fill="url(#drone-grad)" opacity="0.08" />

      <g filter="url(#glow)">
        <line x1="220" y1="240" x2="260" y2="240" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="340" y1="240" x2="380" y2="240" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="220" y1="248" x2="255" y2="248" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <line x1="345" y1="248" x2="380" y2="248" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </g>

      <g filter="url(#glow)">
        <circle cx="300" cy="220" r="18" fill="url(#drone-grad)" opacity="0.2" />
        <circle cx="300" cy="220" r="10" fill="url(#drone-grad)" opacity="0.4" />
        <circle cx="300" cy="220" r="4" fill="#00d4ff" opacity="0.9" />
      </g>

      <g filter="url(#glow)">
        <line x1="270" y1="195" x2="285" y2="210" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
        <line x1="330" y1="195" x2="315" y2="210" stroke="#00d4ff" strokeWidth="1.5" opacity="0.5" />
        <line x1="292" y1="192" x2="296" y2="210" stroke="#7b61ff" strokeWidth="1.5" opacity="0.4" />
        <line x1="308" y1="192" x2="304" y2="210" stroke="#7b61ff" strokeWidth="1.5" opacity="0.4" />
      </g>

      <g opacity="0.4" filter="url(#glow)">
        <path d="M268 245 Q268 260 258 268" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M332 245 Q332 260 342 268" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>

      <g filter="url(#glow)">
        <rect x="258" y="270" width="84" height="50" rx="6" fill="url(#drone-grad2)" stroke="url(#drone-grad)" strokeWidth="0.8" />
        <rect x="264" y="278" width="28" height="20" rx="3" fill="#00d4ff" opacity="0.15" />
        <rect x="264" y="278" width="20" height="20" rx="3" fill="#00d4ff" opacity="0.3" />
        <line x1="264" y1="290" x2="280" y2="290" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
        <rect x="308" y="278" width="28" height="20" rx="3" fill="#7b61ff" opacity="0.15" />
        <rect x="308" y="278" width="10" height="20" rx="3" fill="#7b61ff" opacity="0.3" />
        <line x1="296" y1="300" x2="296" y2="320" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" />
        <line x1="264" y1="306" x2="336" y2="306" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      </g>

      <g opacity="0.5" filter="url(#glow)">
        <line x1="296" y1="322" x2="296" y2="380" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        <line x1="296" y1="380" x2="260" y2="420" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
        <line x1="296" y1="380" x2="340" y2="420" stroke="#00d4ff" strokeWidth="0.8" opacity="0.3" />
      </g>

      <g opacity="0.6">
        <rect x="140" y="440" width="320" height="60" rx="4" fill="url(#city-grad)" />
        <rect x="155" y="420" width="30" height="80" rx="2" fill="url(#city-grad)" />
        <rect x="200" y="410" width="25" height="90" rx="2" fill="url(#city-grad)" />
        <rect x="240" y="430" width="35" height="70" rx="2" fill="url(#city-grad)" />
        <rect x="360" y="415" width="28" height="85" rx="2" fill="url(#city-grad)" />
        <rect x="400" y="425" width="32" height="75" rx="2" fill="url(#city-grad)" />
        <rect x="445" y="435" width="22" height="65" rx="2" fill="url(#city-grad)" />
      </g>

      <g opacity="0.3" filter="url(#glow)">
        {[180, 210, 260, 320, 370, 420, 460].map((x, i) => (
          <rect key={i} x={x} y={458 - Math.random() * 15} width="2" height={8 + Math.random() * 12} rx="1" fill="#00d4ff" opacity={0.3 + Math.random() * 0.4} />
        ))}
      </g>

      <g opacity="0.2">
        <circle cx="180" cy="200" r="2" fill="#00d4ff" />
        <circle cx="420" cy="180" r="1.5" fill="#7b61ff" />
        <circle cx="150" cy="300" r="1.5" fill="#00d4ff" />
        <circle cx="450" cy="280" r="2" fill="#7b61ff" />
        <circle cx="500" cy="220" r="1" fill="#00d4ff" />
        <circle cx="100" cy="240" r="1" fill="#7b61ff" />
      </g>
    </svg>
  );
}
