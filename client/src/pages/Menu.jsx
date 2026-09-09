import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_PIZZAS } from '../data/pizzas';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Menu() {
  const [pizzas, setPizzas] = useState(DEFAULT_PIZZAS);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/pizzas`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.pizzas) && data.pizzas.length > 0) {
          setPizzas(data.pizzas);
        }
      })
      .catch(() => setPizzas(DEFAULT_PIZZAS));
  }, []);

  const filtered = pizzas.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleOrder = () => {
    navigate(sessionStorage.getItem("user") ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <section className="pt-28 pb-10 border-b border-slate-900 bg-slate-900/40 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Our Fresh Menu</span>
          <h1 className="text-3xl font-extrabold text-white mt-1.5">Pizza Menu</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Freshly baked to order with 100% real dairy mozzarella cheese.
          </p>
          <div className="max-w-sm mx-auto mt-5">
            <input
              type="text"
              placeholder="Search pizzas..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-400">Showing {filtered.length} pizzas</p>
          <button onClick={handleOrder} className="text-xs font-medium text-orange-400 hover:underline cursor-pointer">
            DIY Pizza Builder →
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-sm text-slate-300">No pizzas found.</p>
            <button onClick={() => setQuery("")} className="mt-2 text-xs text-orange-400 underline">
              Show all pizzas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p._id || p.name} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="relative w-full h-44 bg-slate-850 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Pure Veg
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-800 mt-2">
                  <span className="text-lg font-bold text-white">₹{p.price}</span>
                  <button onClick={handleOrder} className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition cursor-pointer">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
