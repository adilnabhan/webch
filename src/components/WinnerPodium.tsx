import React from 'react';
import { Trophy, Crown, Medal, Award, Sparkles } from 'lucide-react';
import { WinnerProfile } from '../types/challenge';

interface WinnerPodiumProps {
  winners: WinnerProfile[];
  challengeName?: string;
  prizeTitle?: string;
}

export const WinnerPodium: React.FC<WinnerPodiumProps> = ({
  winners,
  challengeName,
  prizeTitle,
}) => {
  if (!winners || winners.length === 0) {
    return null;
  }

  // Find 1st, 2nd, 3rd place winners
  const firstPlace = winners.find((w) => w.rank === 1) || winners[0];
  const secondPlace = winners.find((w) => w.rank === 2);
  const thirdPlace = winners.find((w) => w.rank === 3);

  // Single winner mode (e.g. 14's Shawaya Challenge)
  if (winners.length === 1 || !secondPlace) {
    return (
      <div className="relative p-8 rounded-3xl glass-panel border border-amber-500/30 overflow-hidden text-center max-w-xl mx-auto glow-amber">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-4">
          <Crown className="w-4 h-4 text-amber-400" /> Grand Prize Winner
        </div>

        <div className="relative mx-auto w-28 h-28 mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 animate-spin-slow blur-md opacity-70" />
          <img
            src={firstPlace.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${firstPlace.id}`}
            alt={firstPlace.name}
            className="relative w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-2xl"
          />
          <div className="absolute -bottom-2 right-2 w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-extrabold text-sm border-2 border-surface-950 shadow-md">
            #1
          </div>
        </div>

        <h3 className="text-2xl font-black text-white">{firstPlace.name}</h3>
        {firstPlace.gym_name && (
          <p className="text-xs font-medium text-zinc-400 mt-1 flex items-center justify-center gap-1">
            <span>{firstPlace.gym_name}</span>
          </p>
        )}

        <div className="mt-5 p-4 rounded-xl bg-surface-800/90 border border-white/10 max-w-md mx-auto">
          <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
            Reward Awarded
          </span>
          <p className="text-sm font-extrabold text-white">
            {firstPlace.prize_title || prizeTitle || "Exclusive Reward Voucher"}
          </p>
        </div>
      </div>
    );
  }

  // 3-Person Podium Mode
  return (
    <div className="py-6 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Trophy className="w-4 h-4 text-amber-400" /> Official Winner Podium
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
          Champions & Top Finishers
        </h3>
        {challengeName && (
          <p className="text-xs text-zinc-400 mt-1">{challengeName}</p>
        )}
      </div>

      <div className="flex items-end justify-center gap-3 sm:gap-6 pt-12 pb-4">
        {/* 2nd Place (Silver) */}
        {secondPlace && (
          <div className="flex flex-col items-center flex-1 max-w-[190px]">
            <div className="relative mb-3">
              <img
                src={secondPlace.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${secondPlace.id}`}
                alt={secondPlace.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-300 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-black flex items-center justify-center font-bold text-xs border border-surface-950">
                2
              </div>
            </div>
            <div className="text-center w-full mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">{secondPlace.name}</h4>
              <p className="text-[10px] text-zinc-400 truncate">{secondPlace.gym_name || 'Discipl Gym'}</p>
            </div>
            <div className="w-full h-32 sm:h-40 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-4 border-slate-300 p-3 flex flex-col items-center justify-between shadow-xl">
              <Medal className="w-6 h-6 text-slate-300 mt-1" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center line-clamp-2">
                {secondPlace.prize_title || 'Silver Prize'}
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Gold, Elevated Center) */}
        <div className="flex flex-col items-center flex-1 max-w-[220px] -mt-8 z-10">
          <div className="relative mb-3">
            <Crown className="w-8 h-8 text-amber-400 mx-auto -mb-2 animate-bounce" />
            <img
              src={firstPlace.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${firstPlace.id}`}
              alt={firstPlace.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl ring-4 ring-amber-400/20"
            />
            <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center font-extrabold text-xs border-2 border-surface-950">
              1
            </div>
          </div>
          <div className="text-center w-full mb-3">
            <h4 className="text-sm sm:text-base font-black text-white truncate">{firstPlace.name}</h4>
            <p className="text-[11px] text-zinc-400 truncate">{firstPlace.gym_name || 'Discipl Gym'}</p>
          </div>
          <div className="w-full h-44 sm:h-52 rounded-t-2xl bg-gradient-to-t from-amber-950/80 via-amber-900/50 to-amber-700/60 border-t-4 border-amber-400 p-3 flex flex-col items-center justify-between shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <Trophy className="w-8 h-8 text-amber-400 mt-2" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Winner</span>
              <span className="text-xs font-black text-white block mt-0.5 line-clamp-2">
                {firstPlace.prize_title || prizeTitle || 'Grand Champion Prize'}
              </span>
            </div>
          </div>
        </div>

        {/* 3rd Place (Bronze) */}
        {thirdPlace && (
          <div className="flex flex-col items-center flex-1 max-w-[190px]">
            <div className="relative mb-3">
              <img
                src={thirdPlace.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${thirdPlace.id}`}
                alt={thirdPlace.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-700 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs border border-surface-950">
                3
              </div>
            </div>
            <div className="text-center w-full mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">{thirdPlace.name}</h4>
              <p className="text-[10px] text-zinc-400 truncate">{thirdPlace.gym_name || 'Discipl Gym'}</p>
            </div>
            <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-t from-amber-950/70 to-amber-900/40 border-t-4 border-amber-700 p-3 flex flex-col items-center justify-between shadow-xl">
              <Award className="w-6 h-6 text-amber-700 mt-1" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider text-center line-clamp-2">
                {thirdPlace.prize_title || 'Bronze Prize'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
