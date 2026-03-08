import { useState } from 'react';
import ShotMap from './ShotMap';
import Heatmap from './Heatmap';
import { exportToPdf } from '../utils/pdfExport';

export default function GameSummary({ game, onBack }) {
  const [exporting, setExporting] = useState(false);

  const allShots = game.periods.flatMap((p) => p.shots);
  const homeShots = allShots.filter((s) => s.team === 'home');
  const awayShots = allShots.filter((s) => s.team === 'away');
  const homeGoals = homeShots.filter((s) => s.result === 'goal').length;
  const awayGoals = awayShots.filter((s) => s.result === 'goal').length;
  const homeBlocked = homeShots.filter((s) => s.result === 'blocked').length;
  const awayBlocked = awayShots.filter((s) => s.result === 'blocked').length;

  const savePct = (blocked, total) => {
    if (total === 0) return '-';
    return ((blocked / total) * 100).toFixed(0) + '%';
  };

  const periodLabel = (n) => {
    if (n === 'OT') return 'OT';
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `P${n}`;
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  // Build player stats
  const playerStats = {};
  allShots.forEach((s) => {
    if (!s.playerNumber) return;
    const key = `${s.team || 'unknown'}-${s.playerNumber}`;
    if (!playerStats[key]) {
      playerStats[key] = {
        team: s.team,
        number: s.playerNumber,
        shots: 0,
        goals: 0,
      };
    }
    playerStats[key].shots++;
    if (s.result === 'goal') playerStats[key].goals++;
  });
  const playerList = Object.values(playerStats).sort((a, b) => b.shots - a.shots);

  const handleExport = async () => {
    setExporting(true);
    try {
      const filename = `${game.homeTeam}-vs-${game.awayTeam}-${game.date.slice(0, 10)}.pdf`;
      await exportToPdf('game-summary-report', filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
    setExporting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-blue-600 font-medium active:text-blue-800"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </button>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl active:bg-slate-900 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {exporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>

      <div id="game-summary-report" className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        {/* Game header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-800 mb-1">
            {game.homeTeam} vs {game.awayTeam}
          </h1>
          <p className="text-sm text-slate-500">
            {formatDate(game.date)} at {formatTime(game.date)}
          </p>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{homeGoals}</div>
            <div className="text-sm font-semibold text-slate-600">{game.homeTeam}</div>
            <div className="text-xs text-slate-400">{homeShots.length} shots</div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-slate-300 text-lg font-bold">FINAL</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{awayGoals}</div>
            <div className="text-sm font-semibold text-slate-600">{game.awayTeam}</div>
            <div className="text-xs text-slate-400">{awayShots.length} shots</div>
          </div>
        </div>

        {/* Period breakdown */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Shots by Period
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-600">Team</th>
                  {game.periods.map((p) => (
                    <th key={p.number} className="text-center py-2 px-2 font-semibold text-slate-600">
                      {periodLabel(p.number)}
                    </th>
                  ))}
                  <th className="text-center py-2 pl-2 font-bold text-slate-800">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-blue-600">{game.homeTeam}</td>
                  {game.periods.map((p) => (
                    <td key={p.number} className="text-center py-2 px-2">
                      {p.shots.filter((s) => s.team === 'home').length}
                    </td>
                  ))}
                  <td className="text-center py-2 pl-2 font-bold">{homeShots.length}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-red-500">{game.awayTeam}</td>
                  {game.periods.map((p) => (
                    <td key={p.number} className="text-center py-2 px-2">
                      {p.shots.filter((s) => s.team === 'away').length}
                    </td>
                  ))}
                  <td className="text-center py-2 pl-2 font-bold">{awayShots.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Save percentages */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {savePct(homeBlocked, homeShots.length)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {game.awayTeam} goalie save % vs {game.homeTeam}
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {savePct(awayBlocked, awayShots.length)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {game.homeTeam} goalie save % vs {game.awayTeam}
            </div>
          </div>
        </div>

        {/* Shot map */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Shot Map
          </h2>
          <ShotMap shots={allShots} homeTeam={game.homeTeam} awayTeam={game.awayTeam} />
        </div>

        {/* Heatmap */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Shot Density
          </h2>
          <Heatmap shots={allShots} homeTeam={game.homeTeam} awayTeam={game.awayTeam} />
        </div>

        {/* Player stats */}
        {playerList.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Player Stats
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-600">#</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-600">Team</th>
                    <th className="text-center py-2 px-2 font-semibold text-slate-600">Shots</th>
                    <th className="text-center py-2 px-2 font-semibold text-slate-600">Goals</th>
                  </tr>
                </thead>
                <tbody>
                  {playerList.map((p) => (
                    <tr key={`${p.team}-${p.number}`} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-bold">{p.number}</td>
                      <td className={`py-2 pr-4 font-medium ${p.team === 'home' ? 'text-blue-600' : p.team === 'away' ? 'text-red-500' : 'text-slate-500'}`}>
                        {p.team === 'home' ? game.homeTeam : p.team === 'away' ? game.awayTeam : '-'}
                      </td>
                      <td className="text-center py-2 px-2">{p.shots}</td>
                      <td className="text-center py-2 px-2">{p.goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
