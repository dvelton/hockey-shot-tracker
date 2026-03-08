import { useEffect, useRef, useState } from 'react';
import { renderHeatmap } from '../utils/heatmapRenderer';
import HockeyRink from './HockeyRink';

export default function Heatmap({ shots, homeTeam, awayTeam }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [view, setView] = useState('both');

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const homeShots = shots.filter((s) => s.team === 'home');
    const awayShots = shots.filter((s) => s.team === 'away');

    if (view === 'home' || view === 'both') {
      renderHeatmap(canvas, homeShots, 'blue');
    }
    if (view === 'away' || view === 'both') {
      renderHeatmap(canvas, awayShots, 'red');
    }
  }, [shots, view]);

  return (
    <div>
      <div className="flex gap-2 mb-3 justify-center">
        {['both', 'home', 'away'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view === v
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 active:bg-slate-200'
            }`}
          >
            {v === 'both' ? 'Both Teams' : v === 'home' ? homeTeam : awayTeam}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="relative">
        <HockeyRink />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: '0.5rem' }}
        />
      </div>
    </div>
  );
}
