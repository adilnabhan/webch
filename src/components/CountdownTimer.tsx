import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialSeconds: number;
  label?: string;
  isUrgent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  label = 'Ends in',
  isUrgent,
  size = 'md',
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(Math.max(0, initialSeconds));

  useEffect(() => {
    setSecondsLeft(Math.max(0, initialSeconds));
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const urgentThreshold = isUrgent || secondsLeft <= 48 * 3600;

  if (secondsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
        <Clock className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium font-mono ${
          urgentThreshold
            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
            : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
        }`}
      >
        <Clock className="w-3 h-3 text-brand-500 animate-pulse" />
        {days > 0 ? `${days}d ` : ''}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center gap-2">
        {label && <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">{label}</span>}
        <div className="flex items-center gap-3">
          {days > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-surface-800 border border-white/10 px-3.5 py-2 rounded-xl shadow-lg">
                {pad(days)}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase mt-1 font-semibold">Days</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-surface-800 border border-white/10 px-3.5 py-2 rounded-xl shadow-lg">
              {pad(hours)}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase mt-1 font-semibold">Hours</span>
          </div>
          <span className="text-2xl font-bold text-brand-500 animate-pulse -mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-surface-800 border border-white/10 px-3.5 py-2 rounded-xl shadow-lg">
              {pad(minutes)}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase mt-1 font-semibold">Mins</span>
          </div>
          <span className="text-2xl font-bold text-brand-500 animate-pulse -mt-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white bg-surface-800 border border-brand-500/40 px-3.5 py-2 rounded-xl shadow-lg text-brand-400">
              {pad(seconds)}
            </span>
            <span className="text-[10px] text-brand-400 uppercase mt-1 font-semibold">Secs</span>
          </div>
        </div>
      </div>
    );
  }

  // Medium (standard card view)
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-tight transition-all ${
        urgentThreshold
          ? 'bg-red-500/15 text-red-300 border border-red-500/30 shadow-[0_0_15px_-3px_rgba(239,68,68,0.25)]'
          : 'bg-surface-800/90 text-zinc-200 border border-white/10'
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${urgentThreshold ? 'text-red-400 animate-pulse' : 'text-brand-500'}`} />
      <span>{label}</span>
      <span className="font-bold text-white">
        {days > 0 ? `${days}d ` : ''}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
};
