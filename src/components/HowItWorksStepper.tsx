import React from 'react';
import { Flag, Target, Award, Trophy, CheckCircle2 } from 'lucide-react';
import { HowItWorksStep } from '../types/challenge';

interface HowItWorksStepperProps {
  steps?: HowItWorksStep[];
  currentStep?: number;
}

const defaultSteps: HowItWorksStep[] = [
  {
    icon: 'flag',
    title: '1. Enroll in Challenge',
    description: 'Join the challenge with one click and get ready to track your workouts.'
  },
  {
    icon: 'target',
    title: '2. Complete Daily Workouts',
    description: 'Log your workouts. Note: 1 workout per distinct calendar day counts towards your goal.'
  },
  {
    icon: 'award',
    title: '3. Trainer Verification',
    description: 'Have your trainer verify your workout at the gym to qualify for the official draw.'
  },
  {
    icon: 'trophy',
    title: '4. Win & Claim Prize',
    description: 'Winners are announced automatically on the draw date and receive exclusive rewards.'
  }
];

export const HowItWorksStepper: React.FC<HowItWorksStepperProps> = ({
  steps = defaultSteps,
  currentStep = 1,
}) => {
  const getIcon = (iconName: string, idx: number) => {
    const isCompleted = idx + 1 < currentStep;
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;

    switch (iconName.toLowerCase()) {
      case 'flag':
        return <Flag className="w-5 h-5 text-brand-400" />;
      case 'target':
        return <Target className="w-5 h-5 text-amber-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-cyan-400" />;
      case 'trophy':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isCurrent = idx + 1 === currentStep;
          const isCompleted = idx + 1 < currentStep;

          return (
            <div
              key={idx}
              className={`relative p-5 rounded-xl border transition-all ${
                isCurrent
                  ? 'glass-panel border-brand-500/50 shadow-[0_0_20px_-5px_rgba(215,25,32,0.3)]'
                  : isCompleted
                  ? 'bg-surface-850/60 border-emerald-500/20'
                  : 'bg-surface-850/40 border-white/5 opacity-80'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-brand-500/20 border-brand-500/40'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-surface-800 border-white/10'
                  }`}
                >
                  {getIcon(step.icon, idx)}
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  STEP 0{idx + 1}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
