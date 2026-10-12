import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Clock,
  Heart,
  Gamepad2,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
  Shuffle
} from 'lucide-react';
import {
  fetchGamesList,
  getFavorites,
  toggleFavorite,
  getRecentlyPlayed,
  addRecentlyPlayed,
  incrementPlayCount,
} from './utils/storage.js';
import {
  getSavedCloak,
  applyCloak,
  openAboutBlank,
  triggerPanic,
} from './utils/cloak.js';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import fallbackGames from './data/games.json';

const CATEGORIES = [
  'All',
  'Favorites',
  'Recent',
  'Arcade',
  'Puzzle',
  'Action',
  'Retro',
  'Sports',
  'Casual',
];

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [currentCloak, setCurrentCloak] = useState('default');

  // Modals
  const [isCloakOpen, setIsCloakOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    // Cloak
    const saved = getSavedCloak();
    setCurrentCloak(saved);
    applyCloak(saved);

    // Favorites & Recent
    setFavorites(getFavorites());
    setRecent(getRecentlyPlayed());

    // Fetch games from JSON
    fetchGamesList().then((data) => {
      setGames(data);
    });

    // Panic Key Listener (press ']' to panic)
    const handleKeyDown = (e) => {
      if (e.key === ']') {
        triggerPanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectGame = (game) => {
    const updatedCount = incrementPlayCount(game.id);
    const updatedGame = { ...game, playedCount: updatedCount };
    setSelectedGame(updatedGame);
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, playedCount: updatedCount } : g))
    );
    addRecentlyPlayed(game.id);
    setRecent(getRecentlyPlayed());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    setFavorites(getFavorites());
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const random = games[Math.floor(Math.random() * games.length)];
    handleSelectGame(random);
  };

  // Filtered and Sorted Games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory === 'Favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (activeCategory === 'Recent') {
      result = result.filter((g) => recent.includes(g.id));
    } else if (activeCategory !== 'All') {
      result = result.filter((g) => g.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'popular') return b.playedCount - a.playedCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [games, searchQuery, activeCategory, sortBy, favorites, recent]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentCloak={currentCloak}
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onRandomGame={handleRandomGame}
        onPanic={triggerPanic}
        gameCount={games.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {selectedGame ? (
          /* Game Player View */
          <GamePlayer
            game={selectedGame}
            allGames={games}
            isFavorite={favorites.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onSelectGame={handleSelectGame}
            onToggleFavorite={handleToggleFavorite}
            onOpenAboutBlank={openAboutBlank}
          />
        ) : (
          /* Catalog / Lobby View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col gap-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Unblocked Games Portal</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                    Declan's Hub
                  </span>
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Fast, lightweight, ad-free browser games stored cleanly as iframe embeds in a JSON database. Includes tab cloaking, panic redirection, and stealth window mode.
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleRandomGame}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/25 transition active:scale-95"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Play Random Game</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter, Search & Categories Bar */}
            <div className="flex flex-col gap-4">
              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search games by title, category, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown & Stats */}
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-semibold"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="title">Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  let icon = null;
                  if (cat === 'Favorites') icon = <Heart className="w-3.5 h-3.5 mr-1 fill-current" />;
                  if (cat === 'Recent') icon = <Clock className="w-3.5 h-3.5 mr-1" />;
                  if (cat === 'All') icon = <Layers className="w-3.5 h-3.5 mr-1" />;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex items-center whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      {icon}
                      <span>{cat}</span>
                      {cat === 'Favorites' && favorites.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300">
                          {favorites.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onPlay={handleSelectGame}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenAboutBlank={openAboutBlank}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-16 text-center flex flex-col items-center justify-center gap-3 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-zinc-200">
                  {games.length === 0 ? 'No games in library' : 'No games found'}
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  {games.length === 0
                    ? 'All games have been deleted. Add game entries to games.json to display them.'
                    : searchQuery
                    ? `No games matching "${searchQuery}". Try a different keyword.`
                    : activeCategory === 'Favorites'
                    ? 'You have not favorited any games yet.'
                    : 'No games currently in this category.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-bold text-red-400 hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-red-500" />
            <span className="font-bold text-zinc-200">Declan's Hub</span>
            <span>&bull;</span>
            <span>Ad-free instant browser games</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>Panic Hotkey: <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-red-400 font-bold">]</kbd></span>
          </div>
        </div>
      </footer>

      {/* Cloak Modal */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        currentCloak={currentCloak}
        onSelectCloak={(preset) => setCurrentCloak(preset)}
      />
    </div>
  );
}
