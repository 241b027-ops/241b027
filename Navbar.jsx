import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-stone-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-semibold text-moss">Wayfare</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/80">
          <Link to="/" className="hover:text-moss transition-colors">
            Explore stays
          </Link>
          {user?.isHost && (
            <Link to="/dashboard" className="hover:text-moss transition-colors">
              Host dashboard
            </Link>
          )}
          {user && (
            <Link to="/my-bookings" className="hover:text-moss transition-colors">
              My trips
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-stone-line pl-3 pr-1 py-1 hover:shadow-card transition-shadow"
              >
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <span className="h-7 w-7 rounded-full bg-moss text-paper flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 card p-1.5 text-sm">
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-moss-50"
                  >
                    Host dashboard
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-md hover:bg-moss-50"
                  >
                    My trips
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-moss-50 text-red-700"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-line px-4 py-3 space-y-2 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-1.5">
            Explore stays
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block py-1.5">
                Host dashboard
              </Link>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="block py-1.5">
                My trips
              </Link>
              <button onClick={handleLogout} className="block py-1.5 text-red-700">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-1.5">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-1.5">
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
