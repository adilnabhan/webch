import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Featured', icon: Flame },
    { path: '/explore', label: 'Explore Challenges', icon: Trophy },
    { path: '/winners', label: 'Hall of Fame', icon: Sparkles },
    { path: '/partners', label: 'Brands & Sponsors', icon: Building2 },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Portal', icon: ShieldCheck, badge: 'Staff' }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-white text-lg italic">D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-wider text-white uppercase group-hover:text-brand-400 transition-colors">
                DISCIPL
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-brand-400 -mt-1">
                CHALLENGES & REWARDS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-brand-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Login Button */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-surface-850 border border-white/10 text-xs">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px]">
                      {user.name[0]}
                    </div>
                  )}
                  <span className="font-bold text-white max-w-[120px] truncate">{user.name}</span>
                  {user.gym_name && (
                    <span className="text-[10px] text-zinc-400 max-w-[100px] truncate">
                      • {user.gym_name}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-surface-850 hover:bg-surface-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-surface-850 text-zinc-400 hover:text-white border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-surface-950 p-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-white/10">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-2">
                  <div className="text-xs">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-zinc-400 text-[11px]">{user.gym_name || user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-500 text-white text-center"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
