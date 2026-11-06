import React from 'react';
import { ShoppingBag, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({
  selectedCategory,
  onSelectCategory,
  onOpenAuth,
  onOpenOrders,
}) {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navCategories = [
    { id: 'all', label: 'All Editions' },
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'self-help', label: 'Self-Help' },
    { id: 'poetry', label: 'Poetry' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectCategory('all')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
            Marcus Book Store
          </span>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  isActive
                    ? 'text-stone-950 font-semibold border-stone-900'
                    : 'text-stone-600 border-transparent hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOrders}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors whitespace-nowrap shrink-0"
                title="View your orders"
              >
                <Package className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Orders</span>
              </button>
              
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-700 font-medium px-2 py-1 bg-stone-100 rounded-md">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span className="truncate max-w-[100px]">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 border border-stone-300 hover:border-stone-400 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums bg-stone-800 text-stone-200 text-[11px] px-1.5 py-0.2 rounded">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
