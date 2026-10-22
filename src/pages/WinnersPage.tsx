import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Trophy, 
  Search, 
  Sparkles, 
  Users, 
  Building2, 
  Calendar,
  Medal,
  Award
} from 'lucide-react';
import { WinnerHistoryItem, AllWinnersResponse } from '../types/challenge';
import { ChallengeService } from '../services/api';
import { WinnerPodium } from '../components/WinnerPodium';
import { useAuth } from '../context/AuthContext';

export const WinnersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const challengeIdParam = searchParams.get('challenge_id') || '';

  const { isAuthenticated, user } = useAuth();
  const [winners, setWinners] = useState<WinnerHistoryItem[]>([]);
  const [stats, setStats] = useState({ total_winners: 0, total_challenges: 0, total_participants: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeMode, setScopeMode] = useState<'all' | 'my_gym'>('all');

  useEffect(() => {
    loadWinners();
  }, [searchQuery, scopeMode, challengeIdParam]);

  const loadWinners = async () => {
    try {
      setLoading(true);
      let data: AllWinnersResponse;

      if (scopeMode === 'my_gym' && isAuthenticated && user?.gym_id) {
        data = await ChallengeService.getGymWinners({ gym_id: user.gym_id });
      } else {
        const params: any = {
          search: searchQuery.trim() || undefined,
          challenge_id: challengeIdParam || undefined,
        };
        data = await ChallengeService.getAllWinners(params);
      }

      setWinners(data.winners || []);
      setStats({
        total_winners: data.total_winners || (data.winners ? data.winners.length : 0),
        total_challenges: data.total_challenges || 0,
        total_participants: data.total_participants || 0,
      });
    } catch (err) {
      console.error('Error fetching winners:', err);
      setWinners([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert top 3 items to WinnerProfile format for WinnerPodium
  const topPodiumWinners = winners.slice(0, 3).map((w, idx) => ({
    id: w.user_id,
    name: w.user_name,
    profile_image: w.profile_pic,
    gym_name: w.gym_name,
    gym_logo: w.gym_logo,
    rank: w.rank || (idx + 1),
    prize_title: w.prize,
    selection_method: w.selection_method_display,
    awarded_at: w.awarded_at,
  }));

  return (
    <div className="space-y-12 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Trophy className="w-4 h-4 text-amber-400" />
          Hall of Fame
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Champions & Challenge Winners
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Celebrating athletes who showed up, put in the reps, and took home official rewards.
        </p>
      </div>

      {/* Platform Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-white block">{stats.total_winners}</span>
            <span className="text-xs text-zinc-400">Official Winners</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
            <Medal className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-white block">{stats.total_challenges}</span>
            <span className="text-xs text-zinc-400">Completed Challenges</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/5 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black font-mono text-white block">{stats.total_participants}</span>
            <span className="text-xs text-zinc-400">Athletes Competed</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      {topPodiumWinners.length > 0 && (
        <section className="p-6 sm:p-10 rounded-3xl glass-panel border border-amber-500/30 glow-amber">
          <WinnerPodium winners={topPodiumWinners} />
        </section>
      )}

      {/* Search & Scope Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by athlete name, gym, or prize..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        {isAuthenticated && user?.gym_name && (
          <div className="flex items-center gap-1 bg-surface-900 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setScopeMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scopeMode === 'all' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Winners
            </button>
            <button
              onClick={() => setScopeMode('my_gym')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scopeMode === 'my_gym' ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {user.gym_name} Only
            </button>
          </div>
        )}
      </div>

      {/* Winners List / Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            All Time Winners Record
          </h3>
          <span className="text-xs text-zinc-400">{winners.length} athletes listed</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-32 rounded-2xl glass-panel animate-shimmer" />
            ))}
          </div>
        ) : winners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="p-5 rounded-2xl glass-panel glass-panel-hover border border-white/5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={winner.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${winner.id}`}
                    alt={winner.user_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                        Rank #{winner.rank || 1}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">{winner.date}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white truncate mt-0.5">{winner.user_name}</h4>
                    {winner.gym_name && (
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-brand-400 shrink-0" />
                        {winner.gym_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-900 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Prize Won:</span>
                    <span className="text-amber-300 font-bold truncate max-w-[150px]">{winner.prize}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Challenge:</span>
                    <span className="text-zinc-300 truncate max-w-[150px]">{winner.challenge_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl glass-panel border border-white/5 space-y-2 max-w-md mx-auto">
            <Trophy className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No Winners Found</h4>
            <p className="text-xs text-zinc-400">
              No published winners match your filter. Check back once active challenges complete.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
