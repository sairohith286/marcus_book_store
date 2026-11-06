import React from 'react';
import { ArrowRight, Banknote, Sparkles, BookOpen } from 'lucide-react';

export default function HeroBanner({ onExploreCategory }) {
  const heroImage = '/images/hero_minimal_bookstore_1793943546877.jpg';

  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-widest font-sans">
              <span>Independent Publisher</span>
              <span aria-hidden="true">·</span>
              <span>Full-Stack MERN Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Curated 9 Volumes</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-bold text-stone-900 leading-[1.12] tracking-tight">
              Literature for the Contemplative Mind
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-sans max-w-xl leading-relaxed">
              A discerning collection of nine foundational masterworks across Philosophy, Self-Help, and Poetry. Bound in archival linen and delivered directly to your study.
            </p>

            {/* Quick Filter Buttons */}
            <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => onExploreCategory('philosophy')}
                className="px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors shadow-xs"
              >
                Philosophy (3)
              </button>
              <button
                onClick={() => onExploreCategory('self-help')}
                className="px-4 py-2 text-xs font-medium bg-white text-stone-800 border border-stone-300 rounded-md hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                Self-Help (3)
              </button>
              <button
                onClick={() => onExploreCategory('poetry')}
                className="px-4 py-2 text-xs font-medium bg-white text-stone-800 border border-stone-300 rounded-md hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                Poetry (3)
              </button>
            </div>

            {/* Quiet Trust Markers */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-6 text-xs text-stone-500 font-sans">
              <div className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-stone-600" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-stone-600" />
                <span>MongoDB Seeded Catalog</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Free Delivery Over $50</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-stone-300/80 aspect-[16/11] bg-stone-200 group">
              <img
                src={heroImage}
                alt="Marcus Book Store Reading Room"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[11px] uppercase tracking-widest text-stone-300 font-mono">
                  The Reading Salon
                </p>
                <p className="font-serif text-sm sm:text-base font-medium text-stone-100">
                  Curated physical volumes for deep reflection.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
