import { useStorage } from '../hooks/useStorage';

export default function HomeScreen({ onNewGame, onViewGame }) {
  const { games, deleteGame } = useStorage();

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getShotCount = (game, team) => {
    return game.periods
      .flatMap((p) => p.shots)
      .filter((s) => s.team === team).length;
  };

  const getTotalShots = (game) => {
    return game.periods.flatMap((p) => p.shots).length;
  };

  const getGoals = (game, team) => {
    return game.periods
      .flatMap((p) => p.shots)
      .filter((s) => s.team === team && s.result === 'goal').length;
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this game? This cannot be undone.')) {
      deleteGame(id);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Hockey Shot Tracker</h1>
        <p className="text-sm text-slate-500">Track shots on goal during youth hockey games</p>
      </div>

      <button
        onClick={onNewGame}
        className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-sm active:bg-blue-700 transition-colors mb-8"
      >
        New Game
      </button>

      {games.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Saved Games
          </h2>
          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => onViewGame(game.id)}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 active:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 truncate">
                        {game.homeTeam} vs {game.awayTeam}
                      </span>
                      {game.status === 'in_progress' && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{formatDate(game.date)}</div>
                    <div className="text-sm text-slate-600 mt-1">
                      {game.status === 'completed' ? (
                        <>
                          {game.homeTeam}: {getGoals(game, 'home')}G / {getShotCount(game, 'home')}S
                          {' — '}
                          {game.awayTeam}: {getGoals(game, 'away')}G / {getShotCount(game, 'away')}S
                        </>
                      ) : (
                        <>{getTotalShots(game)} shot{getTotalShots(game) !== 1 ? 's' : ''} recorded</>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, game.id)}
                    className="ml-3 p-2 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Delete game"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {games.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No saved games yet.</p>
          <p className="text-sm mt-1">Tap "New Game" to start tracking.</p>
        </div>
      )}
    </div>
  );
}
