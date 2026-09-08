import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const STATUS_COLORS = {
  "Order Received": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "In Kitchen": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Sent to Delivery": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Delivered": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Cancelled": "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "" });
  const token = sessionStorage.getItem("token");

  const api = async (url, method = "GET", body) => {
    try {
      const res = await fetch(`${API_URL}${url}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      return await res.json();
    } catch { return {}; }
  };

  const loadData = async () => {
    if (tab === "orders") {
      const d = await api("/api/admin/orders");
      setOrders(d.orders || (await api("/api/order/admin/orders")).orders || []);
    }
    if (tab === "products") setPizzas((await api("/api/pizzas")).pizzas || []);
    if (tab === "users") setUsers((await api("/api/users")).users || []);
    setNotifs((await api("/api/admin/notifications")).notifications || []);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user.role !== "admin") return navigate("/dashboard");
    loadData();
  }, [tab]);

  const updateStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    await api(`/api/admin/orders/${id}/status`, "PATCH", { status });
    await api(`/api/order/admin/orders/${id}/status`, "PATCH", { status });
    loadData();
  };

  const addPizza = async (e) => {
    e.preventDefault();
    await api("/api/pizzas", "POST", form);
    setForm({ name: "", description: "", price: "", image: "" });
    loadData();
  };

  const deletePizza = async (id) => {
    if (confirm("Delete this pizza?")) { await api(`/api/pizzas/${id}`, "DELETE"); loadData(); }
  };

  const deleteUser = async (id) => {
    if (confirm("Delete this user?")) { await api(`/api/users/${id}`, "DELETE"); loadData(); }
  };

  const toggleRole = async (id) => {
    await api(`/api/users/${id}/role`, "PATCH");
    loadData();
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-black text-white flex items-center gap-1.5">
            <span>🍕</span> Pizza<span className="text-orange-500">Hub</span>
          </Link>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => { sessionStorage.clear(); navigate("/login"); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">Total Orders</p><h3 className="text-xl font-bold text-white mt-0.5">{orders.length}</h3></div>
            <span className="text-2xl p-2 rounded-lg bg-slate-800">📦</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">Total Revenue</p><h3 className="text-xl font-bold text-orange-400 mt-0.5">₹{totalRevenue}</h3></div>
            <span className="text-2xl p-2 rounded-lg bg-slate-800">💰</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">Active Pizzas</p><h3 className="text-xl font-bold text-white mt-0.5">{pizzas.length}</h3></div>
            <span className="text-2xl p-2 rounded-lg bg-slate-800">🍕</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white">Management Dashboard</h2>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
            {["orders", "products", "users"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  tab === t ? "bg-orange-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Alert Banner */}
        {notifs.length > 0 && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex justify-between items-center">
            <span>⚠️ {notifs.length} inventory restock logs and stock alerts</span>
            <button onClick={async () => { await api("/api/admin/notifications/clear", "POST"); setNotifs([]); }} className="underline font-bold cursor-pointer">Clear</button>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? <p className="text-slate-500 text-xs py-10 text-center">No orders found.</p> : orders.map((o) => (
              <div key={o._id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-400">#{o._id.slice(-6)}</span>
                    <span className="text-sm font-bold text-white">{o.user?.name || "Customer"}</span>
                    <span className="text-xs text-slate-400">({o.user?.email})</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{o.items?.map((it) => `${it.name || "Custom"} ×${it.quantity || 1}`).join(", ")}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-base font-extrabold text-white">₹{o.totalAmount || o.price}</span>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border bg-slate-850 cursor-pointer ${STATUS_COLORS[o.status] || "border-slate-700 text-slate-300"}`}
                  >
                    {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={addPizza} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 h-fit text-xs">
              <h3 className="text-sm font-bold text-white">Add Pizza Product</h3>
              <input type="text" required placeholder="Pizza Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white" />
              <textarea required rows="2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white" />
              <input type="number" required placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white" />
              <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-white" />
              <button type="submit" className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold text-white cursor-pointer transition">Create Product</button>
            </form>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pizzas.map((p) => (
                <div key={p._id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <img src={p.image || "🍕"} alt="" className="w-14 h-14 rounded-lg object-cover bg-slate-800 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{p.description}</p>
                    <p className="text-xs text-orange-400 font-bold mt-1">₹{p.price}</p>
                  </div>
                  <button onClick={() => deletePizza(p._id)} className="text-xs text-rose-400 hover:text-rose-300 p-2 rounded-lg bg-rose-500/10 cursor-pointer">🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === "users" && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u._id} className="text-slate-300">
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 text-slate-400">{u.email}</td>
                    <td className="py-3"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === "admin" ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" : "bg-slate-800 text-slate-400"}`}>{u.role}</span></td>
                    <td className="py-3 text-right space-x-2">
                      <button onClick={() => toggleRole(u._id)} className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition cursor-pointer">Change Role</button>
                      <button onClick={() => deleteUser(u._id)} className="px-2.5 py-1 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-[11px] font-medium transition cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
