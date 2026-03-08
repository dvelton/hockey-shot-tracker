import HockeyRink from './HockeyRink';

export default function ShotOverlay({ shots, homeTeam, awayTeam, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-800">
            Recorded Shots ({shots.length})
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <HockeyRink>
          {shots.map((shot) => {
            const cx = shot.x * 200;
            const cy = shot.y * 85;
            const isGoal = shot.result === 'goal';
            const isHome = shot.team === 'home';
            const color = isHome ? '#3b82f6' : '#ef4444';

            return (
              <g key={shot.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isGoal ? 2 : 1.5}
                  fill={isGoal ? color : 'none'}
                  stroke={color}
                  strokeWidth={0.5}
                />
                {shot.playerNumber && (
                  <text
                    x={cx}
                    y={cy - 2.5}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill={color}
                    fontWeight="bold"
                  >
                    {shot.playerNumber}
                  </text>
                )}
              </g>
            );
          })}
        </HockeyRink>

        <div className="flex items-center justify-center gap-6 mt-3 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#3b82f6" />
            </svg>
            {homeTeam}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#ef4444" />
            </svg>
            {awayTeam}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill="#22c55e" />
            </svg>
            Goal (filled)
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4" fill="none" stroke="#64748b" strokeWidth="1.5" />
            </svg>
            Blocked (open)
          </span>
        </div>
      </div>
    </div>
  );
}
