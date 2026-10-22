import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Challenge } from '../types/challenge';
import { CountdownTimer } from './CountdownTimer';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: number) => void;
  isJoining?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  isJoining = false,
}) => {
  const navigate = useNavigate();

  const themeColor = challenge.theme_color || '#D71920';
  const isEndingSoon = challenge.is_ending_soon || (challenge.remaining_seconds > 0 && challenge.remaining_seconds <= 48 * 3600);
  const isClosed = ['winner_selection', 'winners_announced', 'reward_distributed', 'completed'].includes(challenge.status);
  const isUpcoming = challenge.status === 'upcoming';
  const hasWinners = challenge.status === 'winners_announced' || challenge.status === 'reward_distributed';

  const progress = challenge.progress;
  const currentDays = progress?.current ?? 0;
  const targetDays = progress?.target ?? 1;
  const progressPercent = Math.min(100, Math.round((currentDays / targetDays) * 100));

  const handleCardClick = () => {
    navigate(`/challenge/${challenge.id}`);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasWinners) {
      navigate(`/winners?challenge_id=${challenge.id}`);
    } else if (challenge.is_joined) {
      navigate(`/challenge/${challenge.id}`);
    } else if (onJoin) {
      onJoin(challenge.id);
    } else {
      navigate(`/challenge/${challenge.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl glass-panel glass-panel-hover cursor-pointer border border-white/10 hover:border-brand-500/40 transition-all duration-300"
      style={{
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-900">
        <img
          src={challenge.thumbnail_image || challenge.banner_image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800'}
          alt={challenge.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />

        {/* Sponsor Brand Badge (Top-Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
          {challenge.brand.logo ? (
            <img src={challenge.brand.logo} alt={challenge.brand.name} className="w-4 h-4 rounded-full object-cover" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          )}
          <span className="truncate max-w-[120px]">{challenge.brand.name}</span>
          {challenge.brand.verified && (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>

        {/* Category Pill / Urgency Badge (Top-Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isEndingSoon && !isClosed && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-600/90 text-white shadow-lg animate-pulse">
              <Flame className="w-3 h-3 fill-current" />
              Ending Soon
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 backdrop-blur-md border border-white/15 text-zinc-200">
            {challenge.category}
          </span>
        </div>

        {/* Floating countdown inside thumbnail bottom */}
        <div className="absolute bottom-3 right-3">
          {challenge.remaining_seconds > 0 && !isClosed && (
            <CountdownTimer 
              initialSeconds={challenge.remaining_seconds} 
              size="sm"
              label={isUpcoming ? "Starts in" : "Ends in"}
              isUrgent={isEndingSoon}
            />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
            >
              {challenge.challenge_type}
            </span>
            {challenge.is_joined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" />
                Joined
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {challenge.name}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {challenge.short_description || "Join this challenge, record workouts, and win rewards."}
          </p>
        </div>

        {/* Target Progress Bar (If joined or user has progress) */}
        {challenge.is_joined && progress ? (
          <div className="my-3 p-3 rounded-xl bg-surface-800/80 border border-white/5">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="text-zinc-400">Target Progress</span>
              <span className="text-white font-mono font-bold">
                {currentDays} / {targetDays} {progress.title || 'Days'} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-surface-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent >= 100 ? '#10B981' : themeColor,
                }}
              />
            </div>
            {progress.is_eligible && (
              <p className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" /> Qualified for winner draw!
              </p>
            )}
          </div>
        ) : (
          <div className="my-2" />
        )}

        {/* Card Footer Info */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          {/* Joined Members Avatars & Count */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {challenge.joined_members && challenge.joined_members.length > 0 ? (
                challenge.joined_members.slice(0, 3).map((m, idx) => (
                  <img
                    key={m.id || idx}
                    src={m.profile_image || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.id}`}
                    alt="participant"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-900 object-cover"
                  />
                ))
              ) : (
                <div className="h-6 w-6 rounded-full bg-surface-800 flex items-center justify-center text-[10px] text-zinc-400">
                  <Users className="w-3 h-3" />
                </div>
              )}
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              {challenge.joined_member_count || 0} joined
            </span>
          </div>

          {/* Action CTA Button */}
          <div>
            {hasWinners ? (
              <button
                onClick={handleActionClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Winners
              </button>
            ) : challenge.is_joined ? (
              <button
                onClick={handleActionClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15 border border-white/15 transition-colors"
              >
                View
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-800 text-zinc-400 border border-white/5">
                <Calendar className="w-3 h-3" /> Upcoming
              </span>
            ) : isClosed ? (
              <span className="text-xs font-semibold text-zinc-400">Challenge Ended</span>
            ) : (
              <button
                onClick={handleActionClick}
                disabled={isJoining}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: themeColor }}
              >
                {isJoining ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Join
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
