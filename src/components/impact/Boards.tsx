/** Simplified drawings of the two boards AIO9 Devices is built on. Decorative. */
const GOLD = "#D9B45A";

export function Esp32Board({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 210 330" className={className} aria-hidden>
      <rect x="25" y="5" width="160" height="320" rx="10" fill="#15171c" stroke="#3a3f4a" strokeWidth="2" />
      {Array.from({ length: 15 }, (_, i) => (
        <g key={i}>
          <rect x="8" y={44 + i * 18} width="22" height="9" rx="2" fill={GOLD} />
          <rect x="180" y={44 + i * 18} width="22" height="9" rx="2" fill={GOLD} />
        </g>
      ))}
      <rect x="52" y="60" width="106" height="130" rx="6" fill="#B9BEC7" />
      <rect x="60" y="68" width="90" height="114" rx="3" fill="#D3D7DE" />
      <text x="105" y="130" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="15" fill="#3a3f4a">
        ESP32
      </text>
      <path d="M60 22 h16 v18 h16 v-18 h16 v18 h16 v-18 h16 v18 h10" stroke={GOLD} strokeWidth="4" fill="none" />
      <rect x="62" y="214" width="36" height="36" rx="4" fill="#2b2f38" />
      <rect x="112" y="214" width="36" height="22" rx="3" fill="#2b2f38" />
      <circle cx="130" cy="258" r="5" fill="#D4FF3A" />
      <rect x="80" y="286" width="50" height="34" rx="4" fill="#9AA0AB" />
    </svg>
  );
}

export function RaspberryBoard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 430 290" className={className} aria-hidden>
      <rect x="5" y="5" width="420" height="280" rx="16" fill="#1E7A46" stroke="#135a31" strokeWidth="2" />
      {[
        [20, 20],
        [410, 20],
        [20, 270],
        [410, 270],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="7" fill={GOLD} />
          <circle cx={x} cy={y} r="3" fill="#0A0A12" />
        </g>
      ))}
      <rect x="40" y="14" width="250" height="26" rx="3" fill="#15171c" />
      {Array.from({ length: 20 }, (_, i) => (
        <g key={i}>
          <circle cx={52 + i * 12} cy="22" r="3" fill={GOLD} />
          <circle cx={52 + i * 12} cy="33" r="3" fill={GOLD} />
        </g>
      ))}
      <rect x="110" y="96" width="92" height="92" rx="6" fill="#15171c" />
      <rect x="122" y="108" width="68" height="68" rx="3" fill="#B9BEC7" />
      <rect x="232" y="104" width="62" height="62" rx="5" fill="#15171c" />
      <rect x="350" y="52" width="80" height="62" rx="4" fill="#B9BEC7" />
      <rect x="350" y="128" width="80" height="62" rx="4" fill="#B9BEC7" />
      <rect x="340" y="204" width="90" height="66" rx="4" fill="#C9CDD4" />
      <rect x="60" y="250" width="50" height="40" rx="3" fill="#B9BEC7" />
      <rect x="140" y="252" width="60" height="38" rx="3" fill="#9AA0AB" />
      <rect x="228" y="252" width="44" height="38" rx="3" fill="#B9BEC7" />
      <rect x="26" y="110" width="20" height="74" rx="3" fill="#15171c" />
      <text x="302" y="218" fontFamily="var(--font-mono)" fontSize="12" fill="#CFF5DD" textAnchor="end">
        RASPBERRY PI
      </text>
      <circle cx="64" cy="70" r="5" fill="#D4FF3A" />
      <circle cx="82" cy="70" r="5" fill="#FF5A4F" />
    </svg>
  );
}

/** Both boards floating in perspective. */
export function Boards({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className} style={{ perspective: 1500 }}>
      <div className="relative mx-auto aspect-[5/4] w-full max-w-[640px]">
        <RaspberryBoard className="absolute bottom-[6%] left-0 w-[72%] drop-shadow-[0_50px_50px_rgba(0,0,0,0.8)] motion-safe:[transform:rotateX(38deg)_rotateZ(-14deg)]" />
        <Esp32Board className="absolute top-0 right-[4%] w-[30%] drop-shadow-[0_50px_50px_rgba(0,0,0,0.8)] motion-safe:[transform:rotateX(32deg)_rotateZ(16deg)]" />
      </div>
    </div>
  );
}
