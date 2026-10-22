import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-surface-950 py-12 text-zinc-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-sm">
                D
              </div>
              <span className="font-display font-black text-white text-base tracking-wider uppercase">
                DISCIPL
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              The premier athletic challenge & reward platform. Push your limits, track verified gym workouts, and claim rewards from top brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">
                  Featured Challenges
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-brand-400 transition-colors">
                  All Challenges Catalog
                </Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-brand-400 transition-colors">
                  Hall of Fame & Podium
                </Link>
              </li>
              <li>
                <Link to="/partners" className="hover:text-brand-400 transition-colors">
                  Brand Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Challenge Rules
            </h4>
            <ul className="space-y-2 text-[11px] text-zinc-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>1 Distinct Workout Day max per calendar day</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-brand-400" />
                <span>Trainer-verified gym sessions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Automated Sunday rest day</span>
              </li>
            </ul>
          </div>

          {/* App Download / Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Connected Gym Ecosystem
            </h4>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Connected with over 100+ gyms and fitness centers across India.
            </p>
            <div className="p-3 rounded-xl bg-surface-900 border border-white/5 text-[11px] text-zinc-400">
              Server connected to: <span className="font-mono text-zinc-300">app.thediscipl.com</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} Discipl Health & Fitness Technologies. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for athletes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
