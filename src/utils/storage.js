import fallbackGames from '../data/games.json';

const STORAGE_CUSTOM_GAMES = 'novaplay_custom_games';
const STORAGE_FAVORITES = 'novaplay_favorites';
const STORAGE_RECENT = 'novaplay_recent';
const STORAGE_PLAY_COUNTS = 'novaplay_play_counts';

export function getPlayCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_PLAY_COUNTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function incrementPlayCount(gameId) {
  const counts = getPlayCounts();
  const current = Number(counts[gameId]) || 0;
  const updated = current + 1;
  counts[gameId] = updated;
  localStorage.setItem(STORAGE_PLAY_COUNTS, JSON.stringify(counts));
  return updated;
}

export async function fetchGamesList() {
  let list = fallbackGames;
  try {
    const res = await fetch('./games.json').catch(() => fetch('/games.json'));
    if (res && res.ok) {
      list = await res.json();
    }
  } catch (err) {
    list = fallbackGames;
  }
  const counts = getPlayCounts();
  return list.map((g) => ({
    ...g,
    playedCount: counts[g.id] !== undefined ? counts[g.id] : (g.playedCount || 0),
  }));
}

export function getCustomGames() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_GAMES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomGame(game) {
  const custom = getCustomGames();
  const existingIdx = custom.findIndex((g) => g.id === game.id);
  if (existingIdx >= 0) {
    custom[existingIdx] = game;
  } else {
    custom.unshift(game);
  }
  localStorage.setItem(STORAGE_CUSTOM_GAMES, JSON.stringify(custom));
}

export function deleteCustomGame(gameId) {
  const custom = getCustomGames().filter((g) => g.id !== gameId);
  localStorage.setItem(STORAGE_CUSTOM_GAMES, JSON.stringify(custom));
}

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(gameId) {
  const favs = getFavorites();
  const index = favs.indexOf(gameId);
  let isNowFav = false;
  if (index >= 0) {
    favs.splice(index, 1);
    isNowFav = false;
  } else {
    favs.push(gameId);
    isNowFav = true;
  }
  localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favs));
  return isNowFav;
}

export function getRecentlyPlayed() {
  try {
    const raw = localStorage.getItem(STORAGE_RECENT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentlyPlayed(gameId) {
  const recent = getRecentlyPlayed().filter((id) => id !== gameId);
  recent.unshift(gameId);
  if (recent.length > 15) recent.pop();
  localStorage.setItem(STORAGE_RECENT, JSON.stringify(recent));
}

export function exportGamesAsJson(games) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'games.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
