import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, X, Sparkles, Gift } from 'lucide-react';
import { WinnerPopupData } from '../types/challenge';
import { ChallengeService } from '../services/api';

interface WinnerPopupModalProps {
  data: WinnerPopupData | null;
  onClose: () => void;
}

export const WinnerPopupModal: React.FC<WinnerPopupModalProps> = ({ data, onClose }) => {
  if (!data || !data.show_popup || !data.winner) {
    return null;
  }

  const { winner } = data;

  useEffect(() => {
    // Launch festive confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#D71920', '#F59E0B', '#10B981'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#FFFFFF', '#F59E0B'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#D71920', '#EF4444'],
    });
  }, []);

  const handleDismiss = async () => {
    try {
      if (winner.challenge_id) {
        await ChallengeService.markWinnerPopupSeen(winner.challenge_id);
      }
    } catch (err) {
      console.error('Error marking winner popup as seen:', err);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-amber-500/40 glow-amber text-center overflow-hidden animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Sponsor Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {winner.brand_name || 'Discipl Platform'}
        </div>

        {/* Center Trophy Graphic */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-60" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-xl border-4 border-amber-300">
            <Trophy className="w-12 h-12 text-black" />
          </div>
        </div>

        {/* Titles */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {winner.title || 'Congratulations!'}
        </h2>
        <p className="text-sm font-bold text-amber-400 mt-1">
          {winner.subtitle || 'You are a Lucky Winner!'}
        </p>
        <p className="text-xs text-zinc-300 mt-2 max-w-sm mx-auto leading-relaxed">
          {winner.message || `You won a prize in the ${winner.challenge_name}.`}
        </p>

        {/* Reward Card */}
        {winner.reward && (
          <div className="my-6 p-4 rounded-2xl bg-surface-900 border border-white/10 flex items-center gap-4 text-left">
            {winner.reward.image ? (
              <img
                src={winner.reward.image}
                alt={winner.reward.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Gift className="w-8 h-8 text-amber-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-amber-400 block tracking-wider">
                {winner.reward.type || 'Prize Reward'}
              </span>
              <h4 className="text-sm font-extrabold text-white truncate">
                {winner.reward.title}
              </h4>
              {winner.reward.value && (
                <span className="text-xs text-zinc-400 mt-0.5 block font-mono">
                  Value: ₹{winner.reward.value}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-sm text-black bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all"
          >
            Claim & Celebrate 🎉
          </button>
        </div>
      </div>
    </div>
  );
};
