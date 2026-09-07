import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-8 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍕</span>
          <span className="text-base font-bold text-white">
            Pizza<span className="text-orange-500">Hub</span>
          </span>
          <span className="text-slate-500 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-5 text-slate-400">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/menu" className="hover:text-white transition">Menu</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        <p className="text-slate-500 text-[11px]">Bandra West, Mumbai | Support: +91 98765 43210</p>
      </div>
    </footer>
  );
}
