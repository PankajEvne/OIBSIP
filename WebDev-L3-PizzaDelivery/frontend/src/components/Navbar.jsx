import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = sessionStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-3.5">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🍕</span>
          <span className="text-xl font-bold text-white">
            Pizza<span className="text-orange-500">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              to={l.path}
              className={`text-sm font-medium transition ${
                location.pathname === l.path ? "text-orange-500 font-semibold" : "text-slate-300 hover:text-white"
              }`}
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3.5 py-2 text-sm text-slate-300 hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300">
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-2 bg-slate-900 border-t border-slate-800">
          {navLinks.map((l) => (
            <Link key={l.name} to={l.path} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-slate-300">
              {l.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="w-full py-1.5 bg-slate-800 text-slate-300 rounded text-xs">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-1.5 bg-slate-800 text-slate-300 rounded text-xs">
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-1.5 bg-orange-600 text-white rounded text-xs font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
