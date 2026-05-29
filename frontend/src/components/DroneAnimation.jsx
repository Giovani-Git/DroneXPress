export default function DroneAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-neon-blue/5 animate-pulse-glow"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-neon-blue/20 animate-spin-slow"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-40 h-40 animate-float"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <ellipse cx="100" cy="100" rx="60" ry="20" stroke="#00d4ff" strokeWidth="2" opacity="0.3" />
            <ellipse cx="100" cy="100" rx="20" ry="60" stroke="#00d4ff" strokeWidth="2" opacity="0.3" />
            <circle cx="100" cy="100" r="15" fill="none" stroke="#00d4ff" strokeWidth="2" />
            <circle cx="100" cy="100" r="6" fill="#00d4ff" opacity="0.8" />
            <line x1="50" y1="80" x2="50" y2="60" stroke="#00d4ff" strokeWidth="2" />
            <line x1="50" y1="60" x2="40" y2="55" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="50" y1="60" x2="60" y2="55" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="150" y1="80" x2="150" y2="60" stroke="#00d4ff" strokeWidth="2" />
            <line x1="150" y1="60" x2="140" y2="55" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="150" y1="60" x2="160" y2="55" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="70" y1="125" x2="60" y2="140" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="60" y1="140" x2="50" y2="135" stroke="#00d4ff" strokeWidth="1" />
            <line x1="60" y1="140" x2="55" y2="148" stroke="#00d4ff" strokeWidth="1" />
            <line x1="130" y1="125" x2="140" y2="140" stroke="#00d4ff" strokeWidth="1.5" />
            <line x1="140" y1="140" x2="150" y2="135" stroke="#00d4ff" strokeWidth="1" />
            <line x1="140" y1="140" x2="145" y2="148" stroke="#00d4ff" strokeWidth="1" />
            <circle cx="100" cy="75" r="3" fill="#00d4ff" opacity="0.6" />
            <circle cx="90" cy="90" r="2" fill="#00d4ff" opacity="0.4" />
            <circle cx="110" cy="90" r="2" fill="#00d4ff" opacity="0.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}
