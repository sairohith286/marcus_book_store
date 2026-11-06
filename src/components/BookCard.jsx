import React from 'react';
import { Eye, Plus, Check } from 'lucide-react';
import BookCoverArt from './BookCoverArt.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function BookCard({ book, onQuickView }) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  const cartItem = items.find((i) => i.id === book.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(book, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      onClick={() => onQuickView(book)}
      className="group relative flex flex-col justify-between bg-white rounded-lg p-4 sm:p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Book Cover Image Area */}
      <div className="relative mb-4">
        <BookCoverArt book={book} size="md" />

        {/* Floating Quick Action overlay on hover */}
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(book);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900/90 hover:bg-stone-950 text-white text-xs font-medium rounded-md backdrop-blur-xs transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine</span>
          </button>
        </div>
      </div>

      {/* Book Metadata & Title */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-mono text-[10px] text-stone-500">
              {book.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-[11px] font-mono tabular-nums">{book.pages} pages</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-[11px] font-mono tabular-nums">★ {book.rating}</span>
          </div>

          {/* Book Title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-stone-600 font-sans mt-0.5 line-clamp-1">
            by {book.author}
          </p>
        </div>

        {/* Short Excerpt */}
        <p className="text-xs text-stone-500 font-sans line-clamp-2 leading-relaxed pt-1">
          {book.description}
        </p>

        {/* Card Footer: Price & Add to Bag */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Archival Edition</span>
            <span className="font-mono text-base font-semibold text-stone-900 tabular-nums">
              ${book.price}.00
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-900 hover:text-white'
            }`}
            aria-label={`Add ${book.title} to Bag`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
