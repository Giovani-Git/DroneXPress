export default function SustainabilityIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="leaf-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#00ff88" />
        </linearGradient>
        <linearGradient id="leaf-grad2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1" />
        </linearGradient>
        <filter id="leaf-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g opacity="0.15">
        <circle cx="200" cy="180" r="140" fill="#00ff88" />
      </g>

      <g filter="url(#leaf-glow)">
        <path d="M200 300 C160 260 130 220 140 180 C150 140 180 120 200 100 C220 120 250 140 260 180 C270 220 240 260 200 300Z" fill="url(#leaf-grad2)" stroke="url(#leaf-grad)" strokeWidth="1.5" opacity="0.9" />
        <path d="M200 280 C170 250 150 220 155 190 C160 160 180 140 200 125 C220 140 240 160 245 190 C250 220 230 250 200 280Z" fill="url(#leaf-grad2)" stroke="url(#leaf-grad)" strokeWidth="0.8" opacity="0.6" />
      </g>

      <line x1="200" y1="300" x2="200" y2="330" stroke="#00ff88" strokeWidth="1.5" opacity="0.4" />
      <line x1="185" y1="330" x2="215" y2="330" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="190" y1="315" x2="210" y2="315" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />

      <g opacity="0.5" filter="url(#leaf-glow)">
        <path d="M160 175 Q180 165 185 145" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M240 175 Q220 165 215 145" stroke="#00ff88" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M175 160 Q200 150 200 130" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M225 160 Q200 150 200 130" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.5" />
      </g>

      <g opacity="0.4">
        <circle cx="140" cy="185" r="3" fill="#00ff88" />
        <circle cx="260" cy="185" r="3" fill="#00ff88" />
        <circle cx="175" cy="145" r="2" fill="#00d4ff" />
        <circle cx="225" cy="145" r="2" fill="#00d4ff" />
        <circle cx="200" cy="115" r="2.5" fill="#00ff88" />
      </g>

      <g opacity="0.15">
        <circle cx="110" cy="240" r="50" fill="#00ff88" />
        <circle cx="290" cy="240" r="40" fill="#00d4ff" />
      </g>

      <g opacity="0.3" filter="url(#leaf-glow)">
        <path d="M85 240 Q95 220 110 215 Q125 220 135 240" stroke="#00ff88" strokeWidth="1" fill="none" />
        <path d="M90 245 Q105 230 110 225" stroke="#00ff88" strokeWidth="0.8" fill="none" />
        <path d="M275 230 Q280 215 290 210 Q300 215 305 230" stroke="#00d4ff" strokeWidth="1" fill="none" />
      </g>

      <g opacity="0.08">
        <circle cx="60" cy="160" r="25" fill="#00ff88" />
        <circle cx="340" cy="170" r="20" fill="#00d4ff" />
      </g>
    </svg>
  );
}
