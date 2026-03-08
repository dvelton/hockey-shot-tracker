const STORAGE_KEY = 'hockey-shot-tracker-games';

export function loadGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGame(game) {
  const games = loadGames();
  const idx = games.findIndex((g) => g.id === game.id);
  if (idx >= 0) {
    games[idx] = game;
  } else {
    games.unshift(game);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function deleteGame(gameId) {
  const games = loadGames().filter((g) => g.id !== gameId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function getGame(gameId) {
  return loadGames().find((g) => g.id === gameId) || null;
}
