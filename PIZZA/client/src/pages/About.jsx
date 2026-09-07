import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_PIZZAS } from '../data/pizzas';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <section className="pt-28 pb-10 border-b border-slate-900 bg-slate-900/40 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Our Story</span>
          <h1 className="text-3xl font-extrabold text-white mt-1.5">About PizzaHub</h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
            Freshly prepared pizzas made with in-house dough and 100% genuine mozzarella.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white">Handcrafted Every Single Day</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We started PizzaHub to deliver pizzas that prioritize authentic taste over mass production. Every batch of dough is kneaded daily in our kitchen without artificial additives.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Whether you choose our classic Margherita or load up on grilled toppings with our custom Pizza Builder, our commitment to quality remains the same.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            <img src={DEFAULT_PIZZAS[3].image} alt="Pizza prep" className="w-full h-56 object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900 pt-8">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Daily Fresh Dough</h3>
            <p className="text-xs text-slate-400">Never frozen, hand-kneaded every morning for a light, crispy crust.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">100% Real Cheese</h3>
            <p className="text-xs text-slate-400">Pure dairy mozzarella cheese for an authentic, rich melt.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Custom Builder</h3>
            <p className="text-xs text-slate-400">Interactive DIY builder to assemble your pizza just the way you like.</p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Ready for a slice?</h3>
            <p className="text-xs text-slate-400">Browse our menu or start your custom order now.</p>
          </div>
          <Link to="/menu" className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold">
            View Menu →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
