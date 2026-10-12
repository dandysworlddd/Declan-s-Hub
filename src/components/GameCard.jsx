import React from 'react';
import { Play, Heart, ExternalLink, Star } from 'lucide-react';

export function GameCard({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onOpenAboutBlank,
}) {
  return (
    <div className="group relative bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-1 flex flex-col">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300">
              {game.category}
            </span>
            {game.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/90 backdrop-blur-md text-white border border-red-400/30">
                {game.badge}
              </span>
            )}
            {game.isCustom && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600/80 backdrop-blur-md text-white border border-emerald-400/30">
                Custom
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-rose-400 hover:scale-110 active:scale-95 transition"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-300'
              }`}
            />
          </button>
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={() => onPlay(game)}
            className="pointer-events-auto w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:bg-red-500 hover:scale-110 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onPlay(game)}
              className="font-bold text-base text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
            >
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{Number(game.rating).toFixed(1)}</span>
            </div>
          </div>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Card Footer: Metadata & Quick actions */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-mono text-zinc-400">
            {game.playedCount >= 1000
              ? `${(game.playedCount / 1000).toFixed(1)}k plays`
              : (Number(game.playedCount) || 0) === 1
              ? '1 play'
              : `${Number(game.playedCount) || 0} plays`}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Stealth popup */}
            <button
              onClick={() => onOpenAboutBlank(game)}
              title="Open in stealth about:blank window"
              className="p-1 rounded text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Play Button */}
            <button
              onClick={() => onPlay(game)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white font-semibold transition"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
