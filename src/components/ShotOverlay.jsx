import { useState } from 'react';
import HockeyRink from './HockeyRink';

export default function ShotOverlay({ periods, currentPeriod, homeTeam, awayTeam, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periodLabel = (n) => {
    if (n === 'OT') return 'OT';
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `P${n}`;
  };

  const allShots = periods.flatMap((p) => p.shots);
  const displayShots = selectedPeriod === 'all'
    ? allShots
    : periods.find((p) => String(p.number) === String(selectedPeriod))?.shots || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800">
            Recorded Shots ({displayShots.length})
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

        {/* Period filter */}
        {periods.length > 1 && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedPeriod === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 active:bg-slate-200'
              }`}
            >
              All ({allShots.length})
            </button>
            {periods.map((p) => (
              <button
                key={p.number}
                onClick={() => setSelectedPeriod(p.number)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  String(selectedPeriod) === String(p.number)
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                {periodLabel(p.number)} ({p.shots.length})
              </button>
            ))}
          </div>
        )}

        <HockeyRink>
          {displayShots.map((shot) => {
            const cx = shot.x * 200;
            const cy = shot.y * 85;
            const isGoal = shot.result === 'goal';
            const isHome = shot.team === 'home';
            const isAway = shot.team === 'away';
            const color = isHome ? '#3b82f6' : isAway ? '#ef4444' : '#94a3b8';

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

        {/* Legend */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-center gap-5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" fill="#3b82f6" />
              </svg>
              {homeTeam} Goal
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="5" fill="#ef4444" />
              </svg>
              {awayTeam} Goal
            </span>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              </svg>
              {homeTeam} Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 12 12">
                <circle cx="6" cy="6" r="4" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              </svg>
              {awayTeam} Blocked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
