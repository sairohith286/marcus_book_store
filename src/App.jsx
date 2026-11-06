import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import BookCard from './components/BookCard.jsx';
import BookDetailModal from './components/BookDetailModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import AuthModal from './components/AuthModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import OrdersModal from './components/OrdersModal.jsx';
import DatabaseStatusFooter from './components/DatabaseStatusFooter.jsx';
import { BookOpen } from 'lucide-react';
function BookstoreMain() {
    const [books, setBooks] = useState([]);
    const [dbStatus, setDbStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // Filtering & Sorting
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    // Modals & Drawers
    const [selectedBookForDetail, setSelectedBookForDetail] = useState(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    // Fetch status and books
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [statusRes, booksRes] = await Promise.all([
                fetch('/api/status'),
                fetch('/api/books'),
            ]);
            if (statusRes.ok) {
                const sData = await statusRes.json();
                setDbStatus(sData);
            }
            if (booksRes.ok) {
                const bData = await booksRes.json();
                setBooks(bData);
            }
            else {
                throw new Error('Failed to fetch books from Express API');
            }
        }
        catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Unable to connect to backend server');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    // Category Counts
    const counts = useMemo(() => {
        return {
            all: books.length,
            philosophy: books.filter((b) => b.category === 'philosophy').length,
            'self-help': books.filter((b) => b.category === 'self-help').length,
            poetry: books.filter((b) => b.category === 'poetry').length,
        };
    }, [books]);
    // Filtered & Sorted books
    const processedBooks = useMemo(() => {
        let result = [...books];
        // Category filter
        if (selectedCategory !== 'all') {
            result = result.filter((b) => b.category === selectedCategory);
        }
        // Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((b) => b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                b.description.toLowerCase().includes(q) ||
                b.details.toLowerCase().includes(q));
        }
        // Sorting
        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        }
        else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }
        else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }
        return result;
    }, [books, selectedCategory, searchQuery, sortBy]);
    // Grouped by Category for "All Works" view
    const categoryGroups = useMemo(() => {
        return [
            {
                id: 'philosophy',
                title: 'Philosophy & Classical Inquiry',
                description: 'Three foundational works on Stoic duty, morality, and the absurd condition.',
                books: processedBooks.filter((b) => b.category === 'philosophy'),
            },
            {
                id: 'self-help',
                title: 'Self-Help & Intentional Psychology',
                description: 'Three transformative texts exploring habit formation, courage, and finding purpose.',
                books: processedBooks.filter((b) => b.category === 'self-help'),
            },
            {
                id: 'poetry',
                title: 'Poetry & Lyrical Solitude',
                description: 'Three transcendent verse collections on beauty, democracy, and the resilient human heart.',
                books: processedBooks.filter((b) => b.category === 'poetry'),
            },
        ].filter((group) => group.books.length > 0);
    }, [processedBooks]);
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-[#FBFBFA] text-[#1C1917]", children: [_jsx(Navbar, { selectedCategory: selectedCategory, onSelectCategory: (cat) => setSelectedCategory(cat), onOpenAuth: () => setIsAuthOpen(true), onOpenOrders: () => setIsOrdersOpen(true) }), _jsxs("main", { className: "flex-1", children: [_jsx(HeroBanner, { onExploreCategory: (cat) => {
                            setSelectedCategory(cat);
                            const el = document.getElementById('catalog-section');
                            if (el)
                                el.scrollIntoView({ behavior: 'smooth' });
                        } }), _jsxs("section", { id: "catalog-section", className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsxs("div", { className: "mb-10", children: [_jsxs("div", { className: "mb-4", children: [_jsx("span", { className: "text-[11px] font-mono uppercase tracking-widest text-stone-500 block", children: "The Permanent Collection" }), _jsx("h2", { className: "font-serif text-2xl sm:text-3xl font-bold text-stone-900", children: selectedCategory === 'all'
                                                    ? 'All Nine Curated Editions'
                                                    : selectedCategory === 'philosophy'
                                                        ? 'Philosophy Collection (3 Volumes)'
                                                        : selectedCategory === 'self-help'
                                                            ? 'Self-Help Collection (3 Volumes)'
                                                            : 'Poetry Collection (3 Volumes)' })] }), _jsx(CategoryTabs, { selectedCategory: selectedCategory, onSelectCategory: setSelectedCategory, searchQuery: searchQuery, onSearchChange: setSearchQuery, sortBy: sortBy, onSortChange: setSortBy, counts: counts })] }), loading ? (_jsxs("div", { className: "py-24 flex flex-col items-center justify-center space-y-3 text-stone-400", children: [_jsx("div", { className: "w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" }), _jsx("p", { className: "text-xs font-sans text-stone-500", children: "Loading archival volumes from MongoDB database..." })] })) : error ? (_jsxs("div", { className: "p-8 text-center bg-rose-50 border border-rose-200 rounded-xl max-w-lg mx-auto", children: [_jsx("p", { className: "text-sm text-rose-800 font-medium mb-3", children: error }), _jsx("button", { onClick: fetchData, className: "px-4 py-2 text-xs font-medium bg-rose-900 text-white rounded-md hover:bg-rose-800 transition-colors", children: "Retry Connection" })] })) : processedBooks.length === 0 ? (_jsxs("div", { className: "py-20 text-center text-stone-400 space-y-3 max-w-md mx-auto", children: [_jsx(BookOpen, { className: "w-10 h-10 mx-auto text-stone-300 stroke-1" }), _jsx("h3", { className: "font-serif text-lg font-bold text-stone-700", children: "No volumes match your search" }), _jsx("p", { className: "text-xs text-stone-500", children: "Try searching for \"Marcus\", \"Habits\", \"Rilke\", or clear your filter to browse all 9 books." }), _jsx("button", { onClick: () => {
                                            setSelectedCategory('all');
                                            setSearchQuery('');
                                        }, className: "mt-2 px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors", children: "Reset Catalog Filters" })] })) : selectedCategory === 'all' && !searchQuery ? (
                            /* Categorized Editorial Layout for All 9 Books */
                            _jsx("div", { className: "space-y-16", children: categoryGroups.map((group) => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-serif text-xl sm:text-2xl font-bold text-stone-900", children: group.title }), _jsx("p", { className: "text-xs text-stone-500 font-sans mt-0.5", children: group.description })] }), _jsx("button", { onClick: () => setSelectedCategory(group.id), className: "text-xs font-medium text-stone-600 hover:text-stone-950 transition-colors whitespace-nowrap self-start sm:self-auto", children: "Focus Collection (3) \u2192" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: group.books.map((book) => (_jsx(BookCard, { book: book, onQuickView: (b) => setSelectedBookForDetail(b) }, book.id || book._id))) })] }, group.id))) })) : (
                            /* Single Category or Filtered View (3 Books Grid) */
                            _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8", children: processedBooks.map((book) => (_jsx(BookCard, { book: book, onQuickView: (b) => setSelectedBookForDetail(b) }, book.id || book._id))) }))] })] }), _jsx(DatabaseStatusFooter, { dbStatus: dbStatus, onReseedSuccess: fetchData, totalBooksCount: books.length }), _jsx(BookDetailModal, { book: selectedBookForDetail, isOpen: Boolean(selectedBookForDetail), onClose: () => setSelectedBookForDetail(null), onDirectCheckout: () => setIsCheckoutOpen(true) }), _jsx(CartDrawer, { onProceedToCheckout: () => setIsCheckoutOpen(true) }), _jsx(AuthModal, { isOpen: isAuthOpen, onClose: () => setIsAuthOpen(false) }), _jsx(CheckoutModal, { isOpen: isCheckoutOpen, onClose: () => setIsCheckoutOpen(false), onOrderPlaced: () => {
                    // Keep checkout open on success screen; user can browse from there
                } }), _jsx(OrdersModal, { isOpen: isOrdersOpen, onClose: () => setIsOrdersOpen(false) })] }));
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(CartProvider, { children: _jsx(BookstoreMain, {}) }) }));
}
