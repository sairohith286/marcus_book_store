import React, { useState } from 'react';
import { X, User, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose, onSuccess = () => {} }) {
  const { login, register, loginDemoAccount } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
        setSuccessMsg('Welcome back to Marcus Book Store.');
      } else {
        await register(name, email, password);
        setSuccessMsg('Account created successfully.');
      }
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginDemoAccount();
      setSuccessMsg('Signed in as demo reader: Julian Vane');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FBFBFA] rounded-xl max-w-md w-full border border-stone-300/80 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-widest font-mono text-stone-400 block mb-1">
            Member Sanctuary
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            {tab === 'login' ? 'Sign In to Marcus' : 'Create Reader Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Access past orders, digital invoices, and curated volume deliveries.
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="mb-6 p-3.5 bg-stone-100/90 rounded-lg border border-stone-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              Seeded Demo Account
            </span>
            <span className="font-mono text-[10px] text-stone-500">MongoDB Seeded</span>
          </div>
          <div className="text-[11px] text-stone-500 font-mono mb-2.5">
            reader@marcusbookstore.com · password123
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors shadow-xs"
          >
            {loading ? 'Authenticating...' : '1-Click Sign In with Demo Account'}
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-200 mb-5">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-medium text-center border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-medium text-center border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-white border border-stone-300 rounded-md pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-md pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-md pl-8 pr-3 py-2 text-stone-900 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium transition-colors shadow-xs mt-2 disabled:opacity-60"
          >
            {loading
              ? 'Processing...'
              : tab === 'login'
              ? 'Sign In to Account'
              : 'Create Marcus Account'}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-center text-stone-400">
          Encrypted credentials verified with Express & MongoDB backend.
        </p>
      </div>
    </div>
  );
}
