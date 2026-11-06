import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import BookCoverArt from './BookCoverArt.jsx';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    grandTotal,
    totalItemsCount,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 50;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FBFBFA] border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-stone-700" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Your Reading Bag
              </h2>
              <span className="text-xs font-mono text-stone-400">
                ({totalItemsCount} {totalItemsCount === 1 ? 'volume' : 'volumes'})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-100/80 px-5 py-3 border-b border-stone-200/80 text-xs text-stone-600">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">
                    You have unlocked free shipping!
                  </span>
                ) : (
                  <span>
                    Add <span className="font-mono tabular-nums font-semibold">${amountNeededForFreeShipping}.00</span> for complimentary delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-stone-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  amountNeededForFreeShipping === 0 ? 'bg-emerald-600' : 'bg-stone-800'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3 py-16">
                <ShoppingBag className="w-10 h-10 stroke-1 text-stone-300" />
                <p className="font-serif text-lg text-stone-700 font-medium">Your bag is empty</p>
                <p className="text-xs text-stone-500 max-w-xs">
                  Discover timeless works in Philosophy, Self-Help, and Poetry in our curated catalog.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-stone-200/90 rounded-lg shadow-2xs group"
                >
                  {/* Thumbnail */}
                  <div className="w-14 shrink-0">
                    <BookCoverArt book={item} size="sm" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        by {item.author}
                      </p>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
                        {item.category}
                      </span>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-200 rounded bg-stone-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono tabular-nums text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-500 hover:text-stone-900"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculations & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#F7F6F2] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-950 font-semibold text-sm pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">${grandTotal.toFixed(2)} USD</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-md shadow-sm transition-colors"
              >
                <span>Proceed to Cash on Delivery Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-stone-400 font-sans">
                Zero prepayment required · Hand cash directly to courier on delivery
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
