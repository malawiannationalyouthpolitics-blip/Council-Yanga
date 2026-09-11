export function PartnerLogo({ className = 'h-12' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 620 100"
        className="h-full w-auto max-w-full object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Digital Democracy Initiative"
      >
        {/* Left Emblem: Circular Cluster of Colorful Dots */}
        <g transform="translate(50, 50)">
          {/* Row 1 (y = -36) */}
          <circle cx="-23" cy="-36" r="4.3" fill="#38bdf8" />
          <circle cx="-11.5" cy="-36" r="4.3" fill="#1d4ed8" />
          <circle cx="0" cy="-36" r="4.3" fill="#b45309" />
          <circle cx="11.5" cy="-36" r="4.3" fill="#ef4444" />
          <circle cx="23" cy="-36" r="4.3" fill="#10b981" />

          {/* Row 2 (y = -24) */}
          <circle cx="-34.5" cy="-24" r="4.3" fill="#0ea5e9" />
          <circle cx="-23" cy="-24" r="4.3" fill="#f97316" />
          <circle cx="-11.5" cy="-24" r="4.3" fill="#ec4899" />
          <circle cx="0" cy="-24" r="4.3" fill="#a855f7" />
          <circle cx="11.5" cy="-24" r="4.3" fill="#eab308" />
          <circle cx="23" cy="-24" r="4.3" fill="#f43f5e" />
          <circle cx="34.5" cy="-24" r="4.3" fill="#38bdf8" />

          {/* Row 3 (y = -12) */}
          <circle cx="-34.5" cy="-12" r="4.3" fill="#dc2626" />
          <circle cx="-23" cy="-12" r="4.3" fill="#d946ef" />
          <circle cx="-11.5" cy="-12" r="4.3" fill="#f59e0b" />
          <circle cx="0" cy="-12" r="4.3" fill="#b45309" />
          <circle cx="11.5" cy="-12" r="4.3" fill="#0284c7" />
          <circle cx="23" cy="-12" r="4.3" fill="#fb7185" />
          <circle cx="34.5" cy="-12" r="4.3" fill="#8b5cf6" />

          {/* Row 4 (y = 0) */}
          <circle cx="-34.5" cy="0" r="4.3" fill="#0284c7" />
          <circle cx="-23" cy="0" r="4.3" fill="#a16207" />
          <circle cx="-11.5" cy="0" r="4.3" fill="#8b5cf6" />
          <circle cx="0" cy="0" r="4.3" fill="#c084fc" />
          <circle cx="11.5" cy="0" r="4.3" fill="#facc15" />
          <circle cx="23" cy="0" r="4.3" fill="#059669" />
          <circle cx="34.5" cy="0" r="4.3" fill="#ef4444" />

          {/* Row 5 (y = 12) */}
          <circle cx="-34.5" cy="12" r="4.3" fill="#10b981" />
          <circle cx="-23" cy="12" r="4.3" fill="#2563eb" />
          <circle cx="-11.5" cy="12" r="4.3" fill="#eab308" />
          <circle cx="0" cy="12" r="4.3" fill="#ec4899" />
          <circle cx="11.5" cy="12" r="4.3" fill="#14b8a6" />
          <circle cx="23" cy="12" r="4.3" fill="#f97316" />
          <circle cx="34.5" cy="12" r="4.3" fill="#a78bfa" />

          {/* Row 6 (y = 24) */}
          <circle cx="-34.5" cy="24" r="4.3" fill="#b45309" />
          <circle cx="-23" cy="24" r="4.3" fill="#38bdf8" />
          <circle cx="-11.5" cy="24" r="4.3" fill="#1d4ed8" />
          <circle cx="0" cy="24" r="4.3" fill="#a855f7" />
          <circle cx="11.5" cy="24" r="4.3" fill="#d946ef" />
          <circle cx="23" cy="24" r="4.3" fill="#dc2626" />
          <circle cx="34.5" cy="24" r="4.3" fill="#10b981" />

          {/* Row 7 (y = 36) */}
          <circle cx="-23" cy="36" r="4.3" fill="#10b981" />
          <circle cx="-11.5" cy="36" r="4.3" fill="#b45309" />
          <circle cx="0" cy="36" r="4.3" fill="#1d4ed8" />
          <circle cx="11.5" cy="36" r="4.3" fill="#8b5cf6" />
          <circle cx="23" cy="36" r="4.3" fill="#65a30d" />
        </g>

        {/* Right Typography: Digital Democracy Initiative */}
        <text
          x="108"
          y="59"
          fontFamily="'Courier Prime', 'Courier New', Courier, 'Liberation Mono', 'Roboto Slab', serif"
          fontSize="28"
          fontWeight="700"
          fill="#0a0a0a"
          letterSpacing="0.4px"
        >
          Digital Democracy Initiative
        </text>
      </svg>
    </div>
  );
}

export default PartnerLogo;
