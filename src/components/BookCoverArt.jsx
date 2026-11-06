import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function BookCoverArt({ book, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(book.coverImage) && !imageError;

  // Domain styling by category for rich clothbound presentation
  const themeStyles = {
    philosophy: {
      bg: 'bg-stone-900',
      border: 'border-stone-800',
      goldText: 'text-amber-200/90',
      authorColor: 'text-stone-400',
      spineTone: 'bg-stone-950',
      motif: '◆ STOIC & MODERN INQUIRY ◆',
    },
    'self-help': {
      bg: 'bg-[#2B231F]',
      border: 'border-stone-800',
      goldText: 'text-orange-200/90',
      authorColor: 'text-stone-300',
      spineTone: 'bg-[#1E1714]',
      motif: '○ SYSTEMS & CHARACTER ○',
    },
    poetry: {
      bg: 'bg-[#1E2922]',
      border: 'border-emerald-950',
      goldText: 'text-emerald-100/90',
      authorColor: 'text-emerald-300/80',
      spineTone: 'bg-[#141C17]',
      motif: '∿ VERSE & SOLITUDE ∿',
    },
  }[book.category] || {
    bg: 'bg-stone-900',
    border: 'border-stone-800',
    goldText: 'text-stone-200',
    authorColor: 'text-stone-400',
    spineTone: 'bg-stone-950',
    motif: '◆ LITERARY EDITION ◆',
  };

  const aspectClass = size === 'lg' ? 'aspect-[3/4.2]' : 'aspect-[3/4.1]';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-md shadow-md transition-all duration-300 group-hover:shadow-xl ${className}`}
    >
      {hasImage ? (
        <div className="relative w-full h-full bg-stone-100">
          <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle cloth binding edge highlight on the left spine */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-black/15 to-transparent" />
        </div>
      ) : (
        /* Bespoke Artisan Clothbound Cover with Foil Stamp */
        <div
          className={`relative w-full h-full ${themeStyles.bg} p-6 flex flex-col justify-between select-none border ${themeStyles.border}`}
        >
          {/* Subtle linen texture simulation */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"
          />

          {/* Book Spine Shadow */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent`}
          />

          {/* Top Foil Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-stone-400">
              {book.category}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-stone-500">
              {book.year > 0 ? book.year : 'CLASSIC'}
            </span>
          </div>

          {/* Center Title & Author */}
          <div className="relative z-10 my-auto text-center px-2 py-4">
            <div className="mb-2 flex justify-center text-stone-600">
              <span className="text-[10px] tracking-widest font-mono text-stone-500">
                {themeStyles.motif}
              </span>
            </div>
            <h3 className={`font-serif text-xl sm:text-2xl font-bold tracking-tight leading-tight ${themeStyles.goldText}`}>
              {book.title}
            </h3>
            <div className="w-8 h-px bg-stone-700 mx-auto my-3" />
            <p className={`text-xs sm:text-sm font-sans tracking-wide uppercase ${themeStyles.authorColor}`}>
              {book.author}
            </p>
          </div>

          {/* Bottom Publisher Stamp */}
          <div className="relative z-10 flex items-center justify-between border-t border-stone-800 pt-2 text-[10px] text-stone-500 font-sans">
            <span className="truncate max-w-[130px]">{book.publisher || 'Marcus Press'}</span>
            <span className="font-mono tabular-nums">${book.price}</span>
          </div>
        </div>
      )}
    </div>
  );
}
