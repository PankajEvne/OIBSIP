import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_PIZZAS } from '../data/pizzas';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

export default function Home() {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState(DEFAULT_PIZZAS);

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

  const handleOrder = () => {
    navigate(sessionStorage.getItem("user") ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
              Freshly Baked on Order
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Hot & Crispy Pizzas, <span className="text-orange-500">Delivered Fast.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
              Made with fresh dough, rich mozzarella, and real toppings. Order classic recipes or build your own custom pizza.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button onClick={handleOrder} className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition cursor-pointer">
                Order Online
              </button>
              <button onClick={handleOrder} className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition cursor-pointer">
                Pizza Builder
              </button>
              <Link to="/menu" className="px-3 py-2.5 text-slate-300 hover:text-white text-sm transition">
                View Menu →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              <img src={DEFAULT_PIZZAS[2].image} alt={DEFAULT_PIZZAS[2].name} className="w-full h-64 object-cover" />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{DEFAULT_PIZZAS[2].name}</p>
                  <p className="text-xs text-slate-400">{DEFAULT_PIZZAS[2].description}</p>
                </div>
                <span className="text-base font-bold text-orange-400">₹{DEFAULT_PIZZAS[2].price}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pizzas List */}
      <section className="py-14 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Our Pizzas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Prepared fresh with pure mozzarella</p>
          </div>
          <Link to="/menu" className="text-xs font-semibold text-orange-400 hover:underline">
            View All ({pizzas.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((p) => (
            <div key={p._id || p.name} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="relative w-full h-44 bg-slate-850 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-700 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
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
      </section>

      {/* Pizza Builder Banner */}
      <section className="py-12 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Create Your Custom Pizza</h3>
            <p className="text-xs text-slate-400 mt-1">Pick your crust, sauces, cheeses, and vegetables with our interactive pizza builder.</p>
          </div>
          <button onClick={handleOrder} className="shrink-0 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition cursor-pointer">
            Open Pizza Builder →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
