import { useState } from 'react';

export default function ShotPopup({ x, y, homeTeam, awayTeam, onConfirm, onCancel }) {
  const [team, setTeam] = useState(null);
  const [result, setResult] = useState(null);
  const [playerNumber, setPlayerNumber] = useState('');

  const handleOk = () => {
    onConfirm({ team, result, playerNumber: playerNumber.trim() });
  };

  const ToggleButton = ({ active, onClick, children, color = 'blue' }) => {
    const base = 'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors';
    const colors = {
      blue: active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 text-slate-600 active:bg-slate-200',
      red: active
        ? 'bg-red-500 text-white'
        : 'bg-slate-100 text-slate-600 active:bg-slate-200',
      green: active
        ? 'bg-emerald-600 text-white'
        : 'bg-slate-100 text-slate-600 active:bg-slate-200',
      amber: active
        ? 'bg-amber-500 text-white'
        : 'bg-slate-100 text-slate-600 active:bg-slate-200',
    };
    return (
      <button onClick={onClick} className={`${base} ${colors[color]}`}>
        {children}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Record Shot</h3>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Team</label>
          <div className="flex gap-2">
            <ToggleButton active={team === 'home'} onClick={() => setTeam(team === 'home' ? null : 'home')} color="blue">
              {homeTeam}
            </ToggleButton>
            <ToggleButton active={team === 'away'} onClick={() => setTeam(team === 'away' ? null : 'away')} color="red">
              {awayTeam}
            </ToggleButton>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Result</label>
          <div className="flex gap-2">
            <ToggleButton active={result === 'goal'} onClick={() => setResult(result === 'goal' ? null : 'goal')} color="green">
              Goal
            </ToggleButton>
            <ToggleButton active={result === 'blocked'} onClick={() => setResult(result === 'blocked' ? null : 'blocked')} color="amber">
              Blocked
            </ToggleButton>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Player # (optional)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={playerNumber}
            onChange={(e) => setPlayerNumber(e.target.value)}
            placeholder="e.g. 12"
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={4}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl active:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl active:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
