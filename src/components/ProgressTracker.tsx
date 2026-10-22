import React from 'react';
import { CheckCircle, AlertCircle, Dumbbell, ShieldCheck, Flame, Calendar } from 'lucide-react';
import { ChallengeProgress } from '../types/challenge';

interface ProgressTrackerProps {
  progress?: ChallengeProgress | null;
  targetCount?: number;
  themeColor?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  targetCount = 3,
  themeColor = '#D71920',
}) => {
  if (!progress) {
    return (
      <div className="p-6 rounded-2xl glass-panel border border-white/10 text-center">
        <Dumbbell className="w-8 h-8 text-zinc-500 mx-auto mb-2 animate-bounce" />
        <h4 className="text-sm font-semibold text-white">Enroll to Start Tracking</h4>
        <p className="text-xs text-zinc-400 mt-1">
          Complete daily gym workouts and get them verified by your trainer to unlock prizes.
        </p>
      </div>
    );
  }

  const current = progress.current ?? progress.workouts_completed ?? 0;
  const target = progress.target ?? targetCount;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isEligible = progress.is_eligible || current >= target;
  const dates = progress.workout_dates || [];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
      {/* Background glow when eligible */}
      {isEligible && (
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
            Participant Progress
          </span>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{current} of {target} Distinct Days</span>
            {isEligible ? (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" /> Qualified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5" /> In Progress
              </span>
            )}
          </h3>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold font-mono text-white">{percentage}%</span>
          <span className="text-[11px] text-zinc-400 block font-medium">Completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-surface-950 h-3 rounded-full overflow-hidden p-0.5 border border-white/10 mb-5">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: isEligible ? '#10B981' : themeColor,
            boxShadow: `0 0 15px ${isEligible ? 'rgba(16,185,129,0.5)' : 'rgba(215,25,32,0.4)'}`,
          }}
        />
      </div>

      {/* Distinct Workout Days Stepper Cards */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-zinc-300 mb-2 flex items-center justify-between">
          <span>Required Workout Days (Max 1 per day)</span>
          <span className="text-[11px] text-zinc-400">Daily verification rule</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: target }).map((_, idx) => {
            const isDone = idx < current;
            const dateRecorded = dates[idx];

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-surface-800/60 border-white/5 text-zinc-500'
                }`}
              >
                <div className="flex justify-center mb-1">
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Dumbbell className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
                <div className="text-[11px] font-bold font-mono">Day {idx + 1}</div>
                {dateRecorded ? (
                  <div className="text-[9px] text-zinc-400 truncate mt-0.5">{dateRecorded}</div>
                ) : (
                  <div className="text-[9px] text-zinc-600 mt-0.5">Pending</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Notice Banner */}
      <div className="p-3 rounded-xl bg-surface-850/70 border border-white/5 flex items-start gap-2.5 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Trainer Verification Active:</span> Workouts must be approved by an authorized gym trainer. Multiple sessions logged on the same calendar day count as one single verified day towards the challenge.
        </div>
      </div>
    </div>
  );
};
