import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Heart,
  Keyboard,
  Info,
  Share2,
  Check,
  Expand,
  Shrink,
  Star,
  Gamepad
} from 'lucide-react';

export function GamePlayer({
  game,
  allGames,
  isFavorite,
  onBack,
  onSelectGame,
  onToggleFavorite,
  onOpenAboutBlank,
}) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const [customSrc, setCustomSrc] = useState(game.iframe.src || '');
  const [isEditingSrc, setIsEditingSrc] = useState(false);

  // Reset loading when game changes
  useEffect(() => {
    setIsLoading(true);
    setCustomSrc(game.iframe.src || '');
    setIframeKey((prev) => prev + 1);
  }, [game.id, game.iframe.src]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe data-testid="test_app_frame" id="test_app_frame" allowfullscreen="" allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" name="appFrame" scrolling="no" style="width: 100%; height: 100%; border-width: medium; border-style: none; border-color: currentcolor; border-image: none;" src="${customSrc}"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  // Find related games from the same category
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            className={`p-2 rounded-lg border transition ${
              isFavorite
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Reload Game */}
          <button
            onClick={handleReload}
            title="Reload Game"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            className="hidden sm:flex p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            {isTheater ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
          </button>

          {/* About:Blank Stealth Mode */}
          <button
            onClick={() => onOpenAboutBlank({ ...game, iframe: { ...game.iframe, src: customSrc } })}
            title="Open in stealth about:blank window"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/30 transition text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Stealth Popup</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition shadow-md shadow-red-600/20"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Game Stage / Iframe Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden bg-black border border-zinc-800/80 shadow-2xl transition-all duration-300 ${
          isTheater ? 'max-w-full' : 'max-w-6xl mx-auto'
        } ${isFullscreen ? '!border-none !rounded-none w-screen h-screen' : ''}`}
        style={{
          height: isFullscreen ? '100vh' : isTheater ? '78vh' : '620px',
        }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10 gap-3">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-mono">Loading {game.title}...</p>
          </div>
        )}

        {/* The Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          data-testid={game.iframe?.dataTestId || game.iframe?.['data-testid'] || undefined}
          id={game.iframe?.id || undefined}
          name={game.iframe?.name || undefined}
          allowFullScreen={game.iframe?.allowfullscreen !== false}
          allow={game.iframe?.allow || 'autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write'}
          scrolling={game.iframe?.scrolling || 'no'}
          data-ruffle-polyfilled={game.iframe?.dataRufflePolyfilled !== undefined ? '' : undefined}
          style={{ width: '100%', height: '100%', border: 'none', overflow: 'auto' }}
          src={customSrc}
          title={game.iframe?.title || game.title}
          sandbox={game.iframe?.sandbox || 'allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation'}
          className="w-full h-full border-0 block"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Details & Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {/* Left Column: Game Info */}
        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                {game.category}
              </span>
              {game.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {game.badge}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-950 text-zinc-400 border border-zinc-800">
                {(Number(game.playedCount) || 0) === 1 ? '1 play' : `${Number(game.playedCount) || 0} plays`}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold ml-auto">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{Number(game.rating).toFixed(1)}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {game.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Embed code and source URL controls */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <span className="font-mono text-zinc-400">src:</span>
              <input
                type="text"
                value={customSrc}
                onChange={(e) => setCustomSrc(e.target.value)}
                placeholder="Enter iframe src URL..."
                className="flex-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-200 font-mono focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => {
                  setIsLoading(true);
                  setIframeKey((prev) => prev + 1);
                }}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-red-600 text-zinc-200 font-semibold transition"
              >
                Apply
              </button>
            </div>
            <button
              onClick={handleCopyEmbed}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            >
              {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedEmbed ? 'Copied Iframe!' : 'Copy Embed Code'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Controls Cheat Sheet */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200 mb-4">
              <Keyboard className="w-4 h-4 text-red-500" />
              <span>Game Controls</span>
            </div>

            {game.controls && game.controls.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {game.controls.map((ctrl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60"
                  >
                    <span className="font-mono font-bold text-red-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {ctrl.key}
                    </span>
                    <span className="text-zinc-300">{ctrl.action}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Standard controls: Mouse clicks, arrow keys, or touch taps on screen.
              </p>
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-[11px] text-zinc-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              Tip: Click directly inside the game iframe to activate keyboard focus if keys do not respond immediately.
            </span>
          </div>
        </div>
      </div>

      {/* Related Games Row */}
      {relatedGames.length > 0 && (
        <div className="max-w-6xl mx-auto w-full pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-zinc-200">
              More in {game.category}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGames.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="group cursor-pointer bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 hover:border-red-500/40 rounded-xl p-3 flex items-center gap-3 transition"
              >
                <img
                  src={rel.thumbnail}
                  alt={rel.title}
                  className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition line-clamp-1">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-zinc-400">{rel.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
