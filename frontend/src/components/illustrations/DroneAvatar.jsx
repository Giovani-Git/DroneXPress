export default function DroneAvatar({ size = 80, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="avatar-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#7b61ff" />
        </linearGradient>
        <filter id="avatar-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="40" cy="40" r="38" fill="url(#avatar-grad)" opacity="0.1" stroke="url(#avatar-grad)" strokeWidth="1" />

      <g filter="url(#avatar-glow)">
        <circle cx="40" cy="35" r="14" fill="url(#avatar-grad)" opacity="0.3" />
        <circle cx="40" cy="35" r="8" fill="url(#avatar-grad)" opacity="0.5" />
        <circle cx="40" cy="35" r="3" fill="white" opacity="0.8" />
      </g>

      <g filter="url(#avatar-glow)">
        <line x1="28" y1="30" x2="33" y2="35" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
        <line x1="52" y1="30" x2="47" y2="35" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
      </g>

      <path d="M30 28 Q40 22 50 28" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.4" />

      <g filter="url(#avatar-glow)">
        <line x1="30" y1="48" x2="35" y2="52" stroke="#7b61ff" strokeWidth="1" opacity="0.5" />
        <line x1="50" y1="48" x2="45" y2="52" stroke="#7b61ff" strokeWidth="1" opacity="0.5" />
        <line x1="40" y1="52" x2="40" y2="58" stroke="#7b61ff" strokeWidth="1" opacity="0.5" />
      </g>
    </svg>
  );
}
