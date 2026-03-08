import { useState, useEffect } from 'react';
import { loadGames, deleteGame as removeGame } from '../utils/storage';

export function useStorage() {
  const [games, setGames] = useState([]);

  const refresh = () => {
    setGames(loadGames());
  };

  useEffect(() => {
    refresh();
  }, []);

  const deleteGame = (id) => {
    removeGame(id);
    refresh();
  };

  return { games, refresh, deleteGame };
}
