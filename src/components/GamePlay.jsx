import { useState, useCallback, useEffect } from 'react';
import HockeyRink from './HockeyRink';
import ShotPopup from './ShotPopup';
import ShotOverlay from './ShotOverlay';
import PeriodControls from './PeriodControls';

export default function GamePlay({ gameState, onEndGame }) {
  const {
    game,
    currentPeriod,
    allShots,
    currentPeriodShots,
    shotCounts,
    startPeriod,
    endPeriod,
    addShot,
    undoLastShot,
  } = gameState;

  const [pendingShot, setPendingShot] = useState(null);
  const [fadeShot, setFadeShot] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Rink flips for period 2
  const flipped = currentPeriod === 2;

  const handleTapRink = useCallback(
    (x, y) => {
      if (currentPeriod === null) return;
      setPendingShot({ x, y });
    },
    [currentPeriod]
  );

  const handleConfirmShot = useCallback(
    ({ team, result, playerNumber }) => {
      if (!pendingShot) return;
      const shot = addShot(pendingShot.x, pendingShot.y, team, result, playerNumber);
      setPendingShot(null);

      // Show brief fade animation
      setFadeShot({ ...shot, x: pendingShot.x, y: pendingShot.y });
    },
    [pendingShot, addShot]
  );

  // Clear fade shot after animation
  useEffect(() => {
    if (!fadeShot) return;
    const timer = setTimeout(() => setFadeShot(null), 800);
    return () => clearTimeout(timer);
  }, [fadeShot]);

  const handleCancelShot = () => setPendingShot(null);

  const periodLabel = (n) => {
    if (n === 'OT') return 'OT';
    if (n === 1) return 'P1';
    if (n === 2) return 'P2';
    if (n === 3) return 'P3';
    return '';
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-4 flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-slate-800 truncate">
            {game.homeTeam} vs {game.awayTeam}
          </h1>
          {currentPeriod !== null && (
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">
              {periodLabel(currentPeriod)}
            </span>
          )}
        </div>

        {/* Shot counter */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-blue-600 font-semibold">
            {game.homeTeam}: {shotCounts.home}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-red-500 font-semibold">
            {game.awayTeam}: {shotCounts.away}
          </span>
          {shotCounts.total > shotCounts.home + shotCounts.away && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                Untagged: {shotCounts.total - shotCounts.home - shotCounts.away}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Rink */}
      <div className="flex-1 flex items-center justify-center mb-3">
        <div className="w-full relative">
          <HockeyRink onTapRink={currentPeriod !== null ? handleTapRink : null}>
            {/* Fade-out shot confirmation */}
            {fadeShot && (
              <circle
                cx={fadeShot.x * 200}
                cy={fadeShot.y * 85}
                r="2.5"
                fill={fadeShot.team === 'away' ? '#ef4444' : '#3b82f6'}
                opacity="0.7"
              >
                <animate attributeName="opacity" from="0.7" to="0" dur="0.8s" fill="freeze" />
                <animate attributeName="r" from="2.5" to="5" dur="0.8s" fill="freeze" />
              </circle>
            )}
          </HockeyRink>

          {/* Team goal labels overlaid on rink */}
          {currentPeriod !== null && (
            <>
              <div className="absolute left-1 bottom-1 px-1.5 py-0.5 rounded bg-white/70 text-[10px] font-bold leading-tight"
                style={{ color: flipped ? '#ef4444' : '#3b82f6' }}>
                {flipped ? game.awayTeam : game.homeTeam} Goal
              </div>
              <div className="absolute right-1 bottom-1 px-1.5 py-0.5 rounded bg-white/70 text-[10px] font-bold leading-tight text-right"
                style={{ color: flipped ? '#3b82f6' : '#ef4444' }}>
                {flipped ? game.homeTeam : game.awayTeam} Goal
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pb-4">
        {currentPeriod !== null && (
          <div className="flex gap-3">
            <button
              onClick={undoLastShot}
              disabled={currentPeriodShots.length === 0}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl active:bg-slate-200 transition-colors disabled:opacity-30 disabled:active:bg-slate-100"
            >
              Undo
            </button>
            <button
              onClick={() => setShowOverlay(true)}
              disabled={allShots.length === 0}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl active:bg-slate-200 transition-colors disabled:opacity-30 disabled:active:bg-slate-100"
            >
              View Shots
            </button>
          </div>
        )}

        {/* Period summaries */}
        {game.periods.filter((p) => p.endTime).length > 0 && currentPeriod === null && (
          <div className="flex flex-wrap gap-2 justify-center text-xs text-slate-500">
            {game.periods
              .filter((p) => p.endTime)
              .map((p) => (
                <span key={p.number} className="bg-slate-100 px-2.5 py-1 rounded-full">
                  {periodLabel(p.number)}: {p.shots.length} shot{p.shots.length !== 1 ? 's' : ''}
                </span>
              ))}
          </div>
        )}

        <PeriodControls
          game={game}
          currentPeriod={currentPeriod}
          onStartPeriod={startPeriod}
          onEndPeriod={endPeriod}
          onEndGame={onEndGame}
        />
      </div>

      {/* Shot detail popup */}
      {pendingShot && (
        <ShotPopup
          x={pendingShot.x}
          y={pendingShot.y}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          onConfirm={handleConfirmShot}
          onCancel={handleCancelShot}
        />
      )}

      {/* Shot overlay */}
      {showOverlay && (
        <ShotOverlay
          shots={allShots}
          homeTeam={game.homeTeam}
          awayTeam={game.awayTeam}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}
