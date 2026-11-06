import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function DatabaseStatusFooter({
  dbStatus,
  onReseedSuccess,
  totalBooksCount,
}) {
  const [reseeding, setReseeding] = useState(false);
  const [reseedMsg, setReseedMsg] = useState('');

  const handleReseed = async () => {
    setReseeding(true);
    setReseedMsg('');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setReseedMsg('Database restored & seeded with 9 volumes.');
        if (onReseedSuccess) onReseedSuccess();
      } else {
        setReseedMsg('Re-seed failed: ' + data.error);
      }
    } catch (err) {
      setReseedMsg('Failed to re-seed database');
    } finally {
      setReseeding(false);
      setTimeout(() => setReseedMsg(''), 3000);
    }
  };

  return (
    <footer className="mt-20 border-t border-stone-200 bg-[#F4F3EF] text-stone-600 text-xs">
      {/* Upper Status & Verification Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-stone-200/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          
          {/* MongoDB & Seed Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-medium text-stone-800">
              {dbStatus?.engine || 'MERN Architecture with MongoDB'}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500 font-mono">
              {totalBooksCount} seeded works across 3 categories
            </span>
          </div>

          {/* Seed Verification & Reset Action */}
          <div className="flex items-center gap-3">
            {reseedMsg && (
              <span className="text-emerald-700 font-medium flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {reseedMsg}
              </span>
            )}
            <button
              onClick={handleReseed}
              disabled={reseeding}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-md transition-colors shadow-2xs font-mono text-[11px]"
              title="Reset and re-seed the 9 books and testing user account"
            >
              <RefreshCw className={`w-3 h-3 ${reseeding ? 'animate-spin' : ''}`} />
              <span>{reseeding ? 'Seeding...' : 'Reset & Re-seed DB'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-2 md:col-span-2">
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Marcus Book Store
            </h4>
            <p className="text-xs text-stone-500 max-w-md leading-relaxed font-sans">
              An independent digital bookseller crafted as a complete MERN stack application. Featuring curated archival bindings in Philosophy, Self-Help, and Poetry with streamlined Cash on Delivery (COD) and MongoDB persistence.
            </p>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[11px] tracking-wider text-stone-400 mb-2">
              Curated Collections
            </h5>
            <ul className="space-y-1.5 text-xs text-stone-600 font-sans">
              <li>Philosophy · 3 Volumes</li>
              <li>Self-Help · 3 Volumes</li>
              <li>Poetry · 3 Volumes</li>
              <li className="text-stone-400">Total 9 Archival Editions</li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono uppercase text-[11px] tracking-wider text-stone-400 mb-2">
              Full-Stack Verification
            </h5>
            <ul className="space-y-1.5 text-xs text-stone-600 font-sans">
              <li>MongoDB & Mongoose ODM</li>
              <li>Express.js REST Endpoints</li>
              <li>React 19 Frontend with JSX</li>
              <li>Cash on Delivery (COD) Order Engine</li>
            </ul>
          </div>

        </div>

        {/* Quiet Copyright */}
        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} Marcus Book Store. All literary rights reserved.</p>
          <p className="flex items-center gap-1 font-mono text-[10px]">
            <span>MERN Stack</span>
            <span>·</span>
            <span>Node.js</span>
            <span>·</span>
            <span>Express</span>
            <span>·</span>
            <span>React</span>
            <span>·</span>
            <span>MongoDB</span>
            <span>·</span>
            <span>Cash on Delivery</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
