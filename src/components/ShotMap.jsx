import HockeyRink from './HockeyRink';

export default function ShotMap({ shots, homeTeam, awayTeam }) {
  return (
    <div>
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
                <circle cx={cx} cy={cy} r={2} fill={color} opacity={0.85} />
              ) : (
                <circle cx={cx} cy={cy} r={1.5} fill="none" stroke={color} strokeWidth={0.5} opacity={0.85} />
              )}
              {shot.playerNumber && (
                <text
                  x={cx}
                  y={cy - 3}
                  textAnchor="middle"
                  fontSize="2.2"
                  fill={color}
                  fontWeight="600"
                >
                  {shot.playerNumber}
                </text>
              )}
            </g>
          );
        })}
      </HockeyRink>

      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#3b82f6" /></svg>
          {homeTeam} goal
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.5" fill="none" stroke="#3b82f6" strokeWidth="1" /></svg>
          {homeTeam} blocked
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#ef4444" /></svg>
          {awayTeam} goal
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.5" fill="none" stroke="#ef4444" strokeWidth="1" /></svg>
          {awayTeam} blocked
        </span>
      </div>
    </div>
  );
}
