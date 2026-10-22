import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, setDemoUser } = useAuth();
  const [customToken, setCustomToken] = useState('');
  const [userName, setUserName] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customToken.trim()) return;

    login(customToken.trim(), {
      id: 99,
      name: userName.trim() || 'Discipl Athlete',
      email: 'athlete@thediscipl.com',
      role: 'customer',
      is_admin: false,
    });
    onClose();
  };

  const handleDemoSelect = (role: 'customer' | 'admin') => {
    setDemoUser(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-white/10 text-left overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white">Discipl Account</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-6">
          Sign in to track verified workouts, enroll in challenges, and claim prizes.
        </p>

        {/* Quick Demo Login Buttons */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Quick One-Click Access
          </div>

          <button
            onClick={() => handleDemoSelect('customer')}
            className="w-full p-3.5 rounded-xl glass-panel border border-brand-500/30 hover:border-brand-500 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-brand-400">
                  Athlete Demo Mode
                </h4>
                <p className="text-xs text-zinc-400">Mohammed Shan • Alpha Fitness Hub</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-400">Select →</span>
          </button>

          <button
            onClick={() => handleDemoSelect('admin')}
            className="w-full p-3.5 rounded-xl glass-panel border border-purple-500/30 hover:border-purple-500 flex items-center justify-between text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-400">
                  Admin & Management Mode
                </h4>
                <p className="text-xs text-zinc-400">Adil Nabhan • Challenge Orchestrator</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400">Select →</span>
          </button>
        </div>

        {/* Custom JWT Input */}
        <div className="pt-4 border-t border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
            Or Paste Custom JWT Token
          </span>
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
            <textarea
              rows={2}
              placeholder="Paste JWT Access Token..."
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-brand-500 font-mono"
            />
            <button
              type="submit"
              disabled={!customToken.trim()}
              className="w-full py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all"
            >
              Connect with Custom Token
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
