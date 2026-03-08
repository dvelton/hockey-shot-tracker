/* Hockey rink SVG — whiteboard / dry-erase style.
   Proportions based on NHL regulation: 200 ft x 85 ft.
   Viewbox uses a 200 x 85 coordinate system for easy math. */

export default function HockeyRink({ onTapRink, flipped = false, children }) {
  const handleClick = (e) => {
    if (!onTapRink) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;

    if (flipped) {
      x = 1 - x;
      y = 1 - y;
    }

    onTapRink(x, y);
  };

  const handleTouch = (e) => {
    if (!onTapRink) return;
    e.preventDefault();
    const touch = e.touches[0];
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    let x = (touch.clientX - rect.left) / rect.width;
    let y = (touch.clientY - rect.top) / rect.height;

    if (flipped) {
      x = 1 - x;
      y = 1 - y;
    }

    onTapRink(x, y);
  };

  return (
    <svg
      viewBox="0 0 200 85"
      className="w-full h-auto select-none"
      style={{ touchAction: 'none', maxHeight: '60vh' }}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <defs>
        <clipPath id="rink-clip">
          <rect x="0" y="0" width="200" height="85" rx="14" ry="14" />
        </clipPath>
      </defs>

      {/* Ice surface */}
      <rect x="0" y="0" width="200" height="85" rx="14" ry="14" fill="white" stroke="#94a3b8" strokeWidth="0.8" />

      <g clipPath="url(#rink-clip)">
        {/* Center red line */}
        <line x1="100" y1="0" x2="100" y2="85" stroke="#ef4444" strokeWidth="0.8" />

        {/* Blue lines */}
        <line x1="75" y1="0" x2="75" y2="85" stroke="#3b82f6" strokeWidth="0.8" />
        <line x1="125" y1="0" x2="125" y2="85" stroke="#3b82f6" strokeWidth="0.8" />

        {/* Goal lines */}
        <line x1="11" y1="0" x2="11" y2="85" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1 1" />
        <line x1="189" y1="0" x2="189" y2="85" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="1 1" />

        {/* Center circle */}
        <circle cx="100" cy="42.5" r="7.5" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        <circle cx="100" cy="42.5" r="0.8" fill="#3b82f6" />

        {/* Face-off dots — neutral zone */}
        <circle cx="80" cy="20.5" r="0.8" fill="#ef4444" />
        <circle cx="80" cy="64.5" r="0.8" fill="#ef4444" />
        <circle cx="120" cy="20.5" r="0.8" fill="#ef4444" />
        <circle cx="120" cy="64.5" r="0.8" fill="#ef4444" />

        {/* Face-off circles — left zone */}
        <circle cx="31" cy="20.5" r="7.5" fill="none" stroke="#ef4444" strokeWidth="0.4" />
        <circle cx="31" cy="20.5" r="0.8" fill="#ef4444" />
        <circle cx="31" cy="64.5" r="7.5" fill="none" stroke="#ef4444" strokeWidth="0.4" />
        <circle cx="31" cy="64.5" r="0.8" fill="#ef4444" />

        {/* Face-off circles — right zone */}
        <circle cx="169" cy="20.5" r="7.5" fill="none" stroke="#ef4444" strokeWidth="0.4" />
        <circle cx="169" cy="20.5" r="0.8" fill="#ef4444" />
        <circle cx="169" cy="64.5" r="7.5" fill="none" stroke="#ef4444" strokeWidth="0.4" />
        <circle cx="169" cy="64.5" r="0.8" fill="#ef4444" />

        {/* Goalie creases — left */}
        <path
          d="M 11 38.5 L 15 38.5 A 4 4 0 0 1 15 46.5 L 11 46.5"
          fill="rgba(59,130,246,0.08)"
          stroke="#3b82f6"
          strokeWidth="0.4"
        />

        {/* Goalie creases — right */}
        <path
          d="M 189 38.5 L 185 38.5 A 4 4 0 0 0 185 46.5 L 189 46.5"
          fill="rgba(59,130,246,0.08)"
          stroke="#3b82f6"
          strokeWidth="0.4"
        />

        {/* Goals — left (simple rectangles behind goal line) */}
        <rect x="7" y="39.5" width="4" height="6" rx="0.5" fill="none" stroke="#94a3b8" strokeWidth="0.5" />

        {/* Goals — right */}
        <rect x="189" y="39.5" width="4" height="6" rx="0.5" fill="none" stroke="#94a3b8" strokeWidth="0.5" />

        {/* Overlay children (shot markers, etc.) */}
        {children}
      </g>
    </svg>
  );
}
