export default function PeriodControls({
  game,
  currentPeriod,
  onStartPeriod,
  onEndPeriod,
  onEndGame,
}) {
  const completedPeriods = game.periods.filter((p) => p.endTime);
  const periodInProgress = currentPeriod !== null;

  const nextPeriodNumber = () => {
    const nums = game.periods.map((p) => p.number);
    if (!nums.includes(1)) return 1;
    if (!nums.includes(2)) return 2;
    if (!nums.includes(3)) return 3;
    if (!nums.includes('OT')) return 'OT';
    return null;
  };

  const periodLabel = (n) => {
    if (n === 'OT') return 'Overtime';
    if (n === 1) return '1st Period';
    if (n === 2) return '2nd Period';
    if (n === 3) return '3rd Period';
    return `Period ${n}`;
  };

  const allRegulationDone = completedPeriods.some((p) => p.number === 3);
  const overtimeDone = completedPeriods.some((p) => p.number === 'OT');
  const next = nextPeriodNumber();

  if (periodInProgress) {
    return (
      <button
        onClick={onEndPeriod}
        className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl active:bg-amber-600 transition-colors"
      >
        End {periodLabel(currentPeriod)}
      </button>
    );
  }

  // After 3rd period ends (or OT ends) — show end game
  if (allRegulationDone && !periodInProgress) {
    return (
      <div className="flex gap-3">
        {!overtimeDone && next === 'OT' && (
          <button
            onClick={() => onStartPeriod('OT')}
            className="flex-1 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl active:bg-slate-300 transition-colors"
          >
            Add Overtime
          </button>
        )}
        <button
          onClick={onEndGame}
          className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl active:bg-emerald-700 transition-colors"
        >
          End &amp; Save Game
        </button>
      </div>
    );
  }

  // Normal: show start next period
  if (next && typeof next === 'number') {
    return (
      <button
        onClick={() => onStartPeriod(next)}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl active:bg-blue-700 transition-colors"
      >
        Start {periodLabel(next)}
      </button>
    );
  }

  return null;
}
