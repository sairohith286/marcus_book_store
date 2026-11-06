import React, { useState } from 'react';
import { X, Check, ShoppingBag, Banknote, Truck, BookOpen, Quote } from 'lucide-react';
import BookCoverArt from './BookCoverArt.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function BookDetailModal({ book, isOpen, onClose, onDirectCheckout }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen || !book) return null;

  const handleAdd = () => {
    addToCart(book, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    onClose();
    if (onDirectCheckout) onDirectCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FBFBFA] rounded-xl max-w-4xl w-full border border-stone-300/80 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-700 bg-white/80 rounded-full hover:bg-white shadow-xs transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Visual Presentation */}
          <div className="md:col-span-5 bg-[#F4F3EF] p-6 sm:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-stone-200">
            <div className="w-full max-w-[260px] drop-shadow-xl">
              <BookCoverArt book={book} size="lg" />
            </div>

            {/* Availability Indicator */}
            <div className="mt-6 flex items-center gap-2 text-xs text-stone-600">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="font-medium">In Stock</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500 font-mono tabular-nums">{book.stock} copies at press</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Editorial Context */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="uppercase tracking-widest font-mono text-[11px] text-stone-600 font-semibold">
                  {book.category}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono tabular-nums">★ {book.rating} / 5.0</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono tabular-nums text-stone-400">{book.reviewsCount} reviews</span>
              </div>

              {/* Title & Author */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {book.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-600 font-sans mt-1">
                  by <span className="font-medium text-stone-800">{book.author}</span>
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                  ${book.price}.00
                </span>
                <span className="text-xs text-stone-500 font-sans">USD · Archival Clothbound</span>
              </div>

              {/* Excerpt Quote */}
              {book.quote && (
                <div className="bg-stone-100/90 rounded-md p-3.5 border-l-2 border-stone-400 text-xs italic text-stone-700 leading-relaxed">
                  "{book.quote}"
                </div>
              )}

              {/* Full Description & Editorial Notes */}
              <div className="text-xs sm:text-sm text-stone-600 space-y-2 leading-relaxed">
                <p>{book.description}</p>
                <p className="text-stone-500">{book.details}</p>
              </div>

              {/* Specifications Grid */}
              <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <span className="text-stone-400 font-mono uppercase text-[10px] block">Publisher</span>
                  <span className="text-stone-700 font-medium truncate block">{book.publisher}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono uppercase text-[10px] block">Pages / Binding</span>
                  <span className="text-stone-700 font-medium font-mono tabular-nums block">{book.pages} pages · Hardcover</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono uppercase text-[10px] block">First Edition</span>
                  <span className="text-stone-700 font-medium font-mono tabular-nums block">{book.year > 0 ? book.year : 'Ancient Classic'}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono uppercase text-[10px] block">ISBN-13</span>
                  <span className="text-stone-700 font-medium font-mono tabular-nums block">{book.isbn || '978-0140449334'}</span>
                </div>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                
                {/* Quantity Stepper */}
                <div className="flex items-center border border-stone-300 rounded-md bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-medium text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                    className="px-3 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-xs font-medium transition-all ${
                    addedSuccess
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ${(book.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Buy Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-2 text-xs font-medium text-stone-700 hover:text-stone-950 border border-stone-300 hover:border-stone-400 rounded-md bg-white hover:bg-stone-50 transition-colors"
              >
                Order with Cash on Delivery (Zero Prepayment)
              </button>

              {/* Shipping & Guarantee */}
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Free delivery over $50
                </span>
                <span className="flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-stone-400" />
                  Cash on Delivery Only
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
