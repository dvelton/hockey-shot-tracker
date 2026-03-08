import HockeyRink from './HockeyRink';

export default function MiniShotMap({ shots, homeTeam, awayTeam, label }) {
  return (
    <div>
      {label && (
        <div className="text-xs font-semibold text-slate-500 text-center mb-1">{label}</div>
      )}
      <HockeyRink>
        {shots.map((shot) => {
          const cx = shot.x * 200;
          const cy = shot.y * 85;
          const isGoal = shot.result === 'goal';
          const isHome = shot.team === 'home';
          const isAway = shot.team === 'away';
          const color = isHome ? '#3b82f6' : isAway ? '#ef4444' : '#94a3b8';

          return (
            <g key={shot.id}>
              {isGoal ? (
                <circle cx={cx} cy={cy} r={2.2} fill={color} opacity={0.85} />
              ) : (
                <circle cx={cx} cy={cy} r={1.6} fill="none" stroke={color} strokeWidth={0.5} opacity={0.85} />
              )}
            </g>
          );
        })}
      </HockeyRink>
    </div>
  );
}
