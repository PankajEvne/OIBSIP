import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [faq, setFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const faqs = [
    { q: "How does the custom pizza builder work?", a: "Select your base crust, signature sauce, cheese portions, and fresh vegetables. Prices update live." },
    { q: "How long does delivery take?", a: "Typically 30-40 minutes depending on kitchen volume and distance." },
    { q: "Are all your pizzas vegetarian?", a: "Yes, our menu and kitchen toppings are 100% vegetarian with pure dairy mozzarella." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <section className="pt-28 pb-10 border-b border-slate-900 bg-slate-900/40 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Support</span>
          <h1 className="text-3xl font-extrabold text-white mt-1.5">Contact Us</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Questions regarding your order or catering? Get in touch with our kitchen team.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Kitchen Details</h2>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Address</p>
              <p className="text-xs text-slate-200 mt-0.5">PizzaHub Kitchen, Bandra West, Mumbai 400050</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Phone & Hotline</p>
              <p className="text-xs text-slate-200 mt-0.5">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Hours</p>
              <p className="text-xs text-slate-200 mt-0.5">Mon - Sun: 11:00 AM – 11:30 PM</p>
            </div>
          </div>

          <div className="md:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-3">Send a Message</h2>
            {sent && <p className="mb-3 text-xs text-emerald-400">Message sent! We'll reply shortly.</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <textarea
                required
                rows="3"
                placeholder="Message..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
              <button type="submit" className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer">
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900 pt-8 max-w-2xl mx-auto space-y-2">
          <h3 className="text-sm font-bold text-white text-center mb-4">FAQs</h3>
          {faqs.map((f, i) => (
            <div key={i} className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full px-4 py-2.5 text-left text-xs font-semibold text-white flex justify-between cursor-pointer">
                <span>{f.q}</span>
                <span>{faq === i ? "−" : "+"}</span>
              </button>
              {faq === i && <p className="px-4 pb-3 text-xs text-slate-400 border-t border-slate-800/60 pt-2">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
