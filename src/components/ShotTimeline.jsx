export default function ShotTimeline({ periods, homeTeam, awayTeam }) {
  // Build cumulative shot counts over time across all periods
  const events = [];
  let homeTotal = 0;
  let awayTotal = 0;

  periods.forEach((period) => {
    const sorted = [...period.shots].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    sorted.forEach((shot) => {
      if (shot.team === 'home') homeTotal++;
      else if (shot.team === 'away') awayTotal++;
      events.push({
        home: homeTotal,
        away: awayTotal,
        period: period.number,
        isGoal: shot.result === 'goal',
        team: shot.team,
      });
    });
  });

  if (events.length === 0) return null;

  const maxShots = Math.max(homeTotal, awayTotal, 1);
  const chartW = 400;
  const chartH = 120;
  const padX = 32;
  const padY = 16;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const toX = (i) => padX + (i / Math.max(events.length - 1, 1)) * plotW;
  const toYHome = (v) => padY + plotH - (v / maxShots) * plotH;
  const toYAway = (v) => padY + plotH - (v / maxShots) * plotH;

  // Build SVG path strings
  let homePath = `M ${toX(0)} ${toYHome(events[0].home)}`;
  let awayPath = `M ${toX(0)} ${toYAway(events[0].away)}`;
  events.forEach((e, i) => {
    if (i === 0) return;
    homePath += ` L ${toX(i)} ${toYHome(e.home)}`;
    awayPath += ` L ${toX(i)} ${toYAway(e.away)}`;
  });

  // Period divider positions
  const periodDividers = [];
  let shotIdx = 0;
  periods.forEach((period, pi) => {
    shotIdx += period.shots.length;
    if (pi < periods.length - 1 && shotIdx > 0 && shotIdx < events.length) {
      periodDividers.push({ x: toX(shotIdx - 0.5), label: period.number });
    }
  });

  // Y-axis labels
  const yTicks = [];
  const step = maxShots <= 5 ? 1 : maxShots <= 15 ? 5 : 10;
  for (let v = 0; v <= maxShots; v += step) {
    yTicks.push(v);
  }
  if (!yTicks.includes(maxShots)) yTicks.push(maxShots);

  // Goal markers
  const goalMarkers = events
    .map((e, i) => ({ ...e, i }))
    .filter((e) => e.isGoal && e.team);

  return (
    <div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={padX} y1={toYHome(v)} x2={chartW - padX} y2={toYHome(v)}
              stroke="#e2e8f0" strokeWidth={0.5}
            />
            <text x={padX - 4} y={toYHome(v) + 1.5} textAnchor="end" fontSize="6" fill="#94a3b8">
              {v}
            </text>
          </g>
        ))}

        {/* Period dividers */}
        {periodDividers.map((d) => (
          <g key={d.label}>
            <line x1={d.x} y1={padY} x2={d.x} y2={chartH - padY}
              stroke="#cbd5e1" strokeWidth={0.5} strokeDasharray="2 2"
            />
          </g>
        ))}

        {/* Lines */}
        <path d={homePath} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        <path d={awayPath} fill="none" stroke="#ef4444" strokeWidth={1.5} />

        {/* Goal markers */}
        {goalMarkers.map((g, idx) => {
          const x = toX(g.i);
          const y = g.team === 'home' ? toYHome(g.home) : toYAway(g.away);
          const color = g.team === 'home' ? '#3b82f6' : '#ef4444';
          return (
            <circle key={idx} cx={x} cy={y} r={2.5} fill={color} stroke="white" strokeWidth={0.8} />
          );
        })}

        {/* Axis line */}
        <line x1={padX} y1={chartH - padY} x2={chartW - padX} y2={chartH - padY}
          stroke="#cbd5e1" strokeWidth={0.5}
        />
      </svg>

      <div className="flex items-center justify-center gap-4 mt-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="#3b82f6" strokeWidth="2" /></svg>
          {homeTeam}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="#ef4444" strokeWidth="2" /></svg>
          {awayTeam}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="#64748b" /></svg>
          Goal scored
        </span>
      </div>
    </div>
  );
}
