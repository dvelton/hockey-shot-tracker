import MiniShotMap from './MiniShotMap';

export default function PeriodReport({ game, periodNumber, id }) {
  const period = game.periods.find((p) => p.number === periodNumber);
  if (!period) return null;

  const shots = period.shots;
  const homeShots = shots.filter((s) => s.team === 'home');
  const awayShots = shots.filter((s) => s.team === 'away');
  const homeGoals = homeShots.filter((s) => s.result === 'goal');
  const awayGoals = awayShots.filter((s) => s.result === 'goal');
  const homeBlocked = homeShots.filter((s) => s.result === 'blocked').length;
  const awayBlocked = awayShots.filter((s) => s.result === 'blocked').length;

  const pct = (num, denom) => {
    if (denom === 0) return '-';
    return ((num / denom) * 100).toFixed(0) + '%';
  };

  const periodLabelFull = (n) => {
    if (n === 'OT') return 'Overtime';
    if (n === 1) return '1st Period';
    if (n === 2) return '2nd Period';
    if (n === 3) return '3rd Period';
    return `Period ${n}`;
  };

  const formatElapsed = (shotTimestamp) => {
    if (!period.startTime || !shotTimestamp) return '';
    const elapsed = new Date(shotTimestamp) - new Date(period.startTime);
    if (elapsed < 0) return '';
    const totalSeconds = Math.floor(elapsed / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = () => {
    if (!period.startTime || !period.endTime) return '';
    const ms = new Date(period.endTime) - new Date(period.startTime);
    const totalMins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${totalMins}:${secs.toString().padStart(2, '0')}`;
  };

  // Zone classification (same logic as GameSummary)
  const classifyZone = (x, team) => {
    const homeAttacksRight = periodNumber !== 2;
    const isLeft = x < 0.375;
    const isRight = x > 0.625;
    if (team === 'home') {
      if (homeAttacksRight) {
        if (isRight) return 'offensive';
        if (isLeft) return 'defensive';
      } else {
        if (isLeft) return 'offensive';
        if (isRight) return 'defensive';
      }
    } else if (team === 'away') {
      if (homeAttacksRight) {
        if (isLeft) return 'offensive';
        if (isRight) return 'defensive';
      } else {
        if (isRight) return 'offensive';
        if (isLeft) return 'defensive';
      }
    }
    return 'neutral';
  };

  const zoneCount = (teamShots, team, zone) =>
    teamShots.filter((s) => classifyZone(s.x, team) === zone).length;

  const homeOffensive = zoneCount(homeShots, 'home', 'offensive');
  const homeNeutral = zoneCount(homeShots, 'home', 'neutral');
  const homeDefensive = zoneCount(homeShots, 'home', 'defensive');
  const awayOffensive = zoneCount(awayShots, 'away', 'offensive');
  const awayNeutral = zoneCount(awayShots, 'away', 'neutral');
  const awayDefensive = zoneCount(awayShots, 'away', 'defensive');

  // Running game totals through this period
  const periodsThrough = game.periods.filter((p) => {
    if (p.number === periodNumber) return true;
    if (typeof p.number === 'number' && typeof periodNumber === 'number') return p.number <= periodNumber;
    if (typeof p.number === 'number') return true;
    return false;
  });
  const cumulativeShots = periodsThrough.flatMap((p) => p.shots);
  const cumulativeHome = cumulativeShots.filter((s) => s.team === 'home');
  const cumulativeAway = cumulativeShots.filter((s) => s.team === 'away');
  const cumulativeHomeGoals = cumulativeHome.filter((s) => s.result === 'goal').length;
  const cumulativeAwayGoals = cumulativeAway.filter((s) => s.result === 'goal').length;

  // All goals sorted chronologically
  const allGoals = [
    ...homeGoals.map((s) => ({ ...s, teamName: game.homeTeam })),
    ...awayGoals.map((s) => ({ ...s, teamName: game.awayTeam })),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const duration = formatDuration();

  const ZoneBar = ({ label, count, total, color }) => {
    const width = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="w-8 text-right text-slate-500 shrink-0">{label}</span>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: color }} />
        </div>
        <span className="w-12 text-right text-slate-600">{count} ({pct(count, total)})</span>
      </div>
    );
  };

  return (
    <div id={id} className="bg-white p-5" style={{ width: '480px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800">
          {game.homeTeam} vs {game.awayTeam}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{formatDate(game.date)}</p>
        <div className="mt-2">
          <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {periodLabelFull(periodNumber)} Report
          </span>
          {duration && (
            <span className="text-xs text-slate-400 ml-2">({duration})</span>
          )}
        </div>
      </div>

      {/* Period stats table */}
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          Period Stats
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-1.5 pr-3 font-semibold text-slate-600">Team</th>
              <th className="text-center py-1.5 px-2 font-semibold text-slate-600">Shots</th>
              <th className="text-center py-1.5 px-2 font-semibold text-slate-600">Goals</th>
              <th className="text-center py-1.5 px-2 font-semibold text-slate-600">Blocked</th>
              <th className="text-center py-1.5 px-2 font-semibold text-slate-600">Sh%</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-1.5 pr-3 font-medium text-blue-600">{game.homeTeam}</td>
              <td className="text-center py-1.5 px-2">{homeShots.length}</td>
              <td className="text-center py-1.5 px-2 font-semibold">{homeGoals.length}</td>
              <td className="text-center py-1.5 px-2">{homeBlocked}</td>
              <td className="text-center py-1.5 px-2">{pct(homeGoals.length, homeShots.length)}</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 font-medium text-red-500">{game.awayTeam}</td>
              <td className="text-center py-1.5 px-2">{awayShots.length}</td>
              <td className="text-center py-1.5 px-2 font-semibold">{awayGoals.length}</td>
              <td className="text-center py-1.5 px-2">{awayBlocked}</td>
              <td className="text-center py-1.5 px-2">{pct(awayGoals.length, awayShots.length)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Goal log */}
      {allGoals.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Goals
          </h2>
          <div className="space-y-1">
            {allGoals.map((g, i) => (
              <div key={g.id || i} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${g.team === 'home' ? 'bg-blue-500' : 'bg-red-500'}`} />
                <span className="font-medium text-slate-700">{g.teamName}</span>
                {g.playerNumber && <span className="text-slate-500">#{g.playerNumber}</span>}
                {formatElapsed(g.timestamp) && (
                  <span className="text-slate-400 text-xs ml-auto">{formatElapsed(g.timestamp)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shot map */}
      {shots.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Shot Map
          </h2>
          <MiniShotMap shots={shots} homeTeam={game.homeTeam} awayTeam={game.awayTeam} />
          <div className="flex justify-center gap-4 mt-1 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span className="text-slate-500">{game.homeTeam}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-500">{game.awayTeam}</span>
            </span>
            <span className="text-slate-400">● goal / ○ blocked</span>
          </div>
        </div>
      )}

      {/* Zone breakdown */}
      {(homeShots.length > 0 || awayShots.length > 0) && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Shots by Zone
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {homeShots.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-blue-600 mb-1">{game.homeTeam}</div>
                <div className="space-y-1">
                  <ZoneBar label="Off" count={homeOffensive} total={homeShots.length} color="#3b82f6" />
                  <ZoneBar label="Neut" count={homeNeutral} total={homeShots.length} color="#3b82f6" />
                  <ZoneBar label="Def" count={homeDefensive} total={homeShots.length} color="#3b82f6" />
                </div>
              </div>
            )}
            {awayShots.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-red-500 mb-1">{game.awayTeam}</div>
                <div className="space-y-1">
                  <ZoneBar label="Off" count={awayOffensive} total={awayShots.length} color="#ef4444" />
                  <ZoneBar label="Neut" count={awayNeutral} total={awayShots.length} color="#ef4444" />
                  <ZoneBar label="Def" count={awayDefensive} total={awayShots.length} color="#ef4444" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Running game totals — only shown after 2+ periods */}
      {periodsThrough.length > 1 && (
        <div className="pt-3 border-t border-slate-200">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Game Totals Through {periodLabelFull(periodNumber)}
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-lg p-2.5 text-center">
              <div className="font-bold text-blue-600">
                {cumulativeHome.length} shots / {cumulativeHomeGoals}G
              </div>
              <div className="text-xs text-slate-500">{game.homeTeam}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-2.5 text-center">
              <div className="font-bold text-red-500">
                {cumulativeAway.length} shots / {cumulativeAwayGoals}G
              </div>
              <div className="text-xs text-slate-500">{game.awayTeam}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
