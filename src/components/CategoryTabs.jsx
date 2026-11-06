import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
}) {
  const tabs = [
    { id: 'all', label: 'All Works', count: counts.all || 9 },
    { id: 'philosophy', label: 'Philosophy', count: counts.philosophy || 3 },
    { id: 'self-help', label: 'Self-Help', count: counts['self-help'] || 3 },
    { id: 'poetry', label: 'Poetry', count: counts.poetry || 3 },
  ];

  return (
    <div className="space-y-4">
      {/* Category Segmented Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        
        {/* Functional segmented category filter */}
        <div className="inline-flex p-1 bg-stone-200/70 rounded-lg max-w-full overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author, or idea..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs bg-white border border-stone-200 rounded-md pl-8 pr-7 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white border border-stone-200 rounded-md px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:border-stone-400 cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
