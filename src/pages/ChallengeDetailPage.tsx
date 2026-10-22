import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  Users, 
  Calendar, 
  ExternalLink,
  Gift,
  AlertTriangle,
  ChevronDown,
  Share2,
  Clock
} from 'lucide-react';
import { ChallengeDetail } from '../types/challenge';
import { ChallengeService } from '../services/api';
import { CountdownTimer } from '../components/CountdownTimer';
import { HowItWorksStepper } from '../components/HowItWorksStepper';
import { ProgressTracker } from '../components/ProgressTracker';
import { WinnerPodium } from '../components/WinnerPodium';
import { useAuth } from '../context/AuthContext';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [showDisqualify, setShowDisqualify] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (id) {
      loadDetail(id);
    }
  }, [id]);

  const loadDetail = async (challengeId: string | number) => {
    try {
      setLoading(true);
      const data = await ChallengeService.getChallengeDetail(challengeId);
      setChallenge(data);
    } catch (err: any) {
      console.error('Error fetching challenge detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!id || !challenge) return;
    try {
      setIsJoining(true);
      await ChallengeService.joinChallenge(id);
      await loadDetail(id);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Could not join challenge. Please complete your verified workout first.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: challenge?.name || 'Discipl Challenge',
        text: challenge?.short_description || 'Check out this challenge on Discipl!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Challenge link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="h-64 sm:h-96 rounded-3xl glass-panel animate-shimmer" />
        <div className="h-40 rounded-2xl glass-panel animate-shimmer" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-md mx-auto p-12 text-center rounded-3xl glass-panel space-y-4 my-12">
        <Trophy className="w-12 h-12 text-zinc-600 mx-auto" />
        <h3 className="text-xl font-bold text-white">Challenge Not Found</h3>
        <p className="text-xs text-zinc-400">This challenge may have expired, or is restricted to members of specific gyms.</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const themeColor = challenge.theme_color || '#D71920';
  const hasWinners = challenge.status === 'winners_announced' || challenge.status === 'reward_distributed' || (challenge.winners && challenge.winners.length > 0);
  const isClosed = ['winner_selection', 'winners_announced', 'reward_distributed', 'completed'].includes(challenge.status);
  const isUpcoming = challenge.status === 'upcoming';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fadeIn">
      {/* Top Back & Share Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Challenge
        </button>
      </div>

      {/* Hero Banner Showcase */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-2xl">
        <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full min-h-[260px] max-h-[420px] overflow-hidden">
          <img
            src={challenge.banner_image || challenge.thumbnail_image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600'}
            alt={challenge.name}
            className="w-full h-full object-cover brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/80 via-transparent to-transparent" />

          {/* Floating Brand Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
            {challenge.brand.logo ? (
              <img src={challenge.brand.logo} alt={challenge.brand.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <Sparkles className="w-4 h-4 text-brand-400" />
            )}
            <span>{challenge.brand.name}</span>
            {challenge.brand.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {challenge.brand.website && (
              <a
                href={challenge.brand.website}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white ml-1"
                title="Visit brand website"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Countdown timer badge inside banner bottom-right */}
          {challenge.remaining_seconds > 0 && !isClosed && (
            <div className="absolute bottom-4 right-4">
              <CountdownTimer
                initialSeconds={challenge.remaining_seconds}
                size="md"
                label={isUpcoming ? "Starts in" : "Challenge ends in"}
              />
            </div>
          )}
        </div>

        {/* Hero Title & Description Bar */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded"
              style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
            >
              {challenge.challenge_type}
            </span>
            <span className="text-xs font-medium text-zinc-300 bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
              {challenge.category}
            </span>
            {challenge.is_joined && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle className="w-3.5 h-3.5" /> Enrolled
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {challenge.name}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
            {challenge.description || challenge.short_description}
          </p>

          {/* Quick Info Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-medium border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-400" />
              <span>{challenge.joined_member_count || 0} Registered Athletes</span>
            </div>
            {challenge.timeline?.starts_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>
                  {new Date(challenge.timeline.starts_at).toLocaleDateString()} - {challenge.timeline.ends_at ? new Date(challenge.timeline.ends_at).toLocaleDateString() : 'Ongoing'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Winners Podium (If winners have been announced) */}
      {hasWinners && challenge.winners && challenge.winners.length > 0 && (
        <section className="space-y-4 p-6 sm:p-8 rounded-3xl glass-panel border border-amber-500/30 glow-amber">
          <WinnerPodium
            winners={challenge.winners}
            challengeName={challenge.name}
            prizeTitle={challenge.reward?.title}
          />
        </section>
      )}

      {/* Main Grid: Left = Progress & Steps, Right = Reward & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live User Progress Tracker */}
          <section>
            <ProgressTracker
              progress={challenge.progress}
              targetCount={challenge.progress?.target || 3}
              themeColor={themeColor}
            />
          </section>

          {/* How It Works Stepper */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              How It Works
            </h3>
            <HowItWorksStepper steps={challenge.how_it_works} currentStep={challenge.is_joined ? 2 : 1} />
          </section>

          {/* Rules & Guidelines Accordion */}
          <section className="space-y-3">
            {/* Challenge Rules */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowRules(!showRules)}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:bg-white/5 transition-colors"
              >
                <span>Challenge Rules & Verification</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showRules ? 'rotate-180' : ''}`} />
              </button>
              {showRules && (
                <div className="p-4 pt-0 text-xs text-zinc-300 space-y-2 border-t border-white/5">
                  {challenge.rules && challenge.rules.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                      {challenge.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-400">Complete required daily workouts and ensure your gym trainer marks them verified in the app.</p>
                  )}
                </div>
              )}
            </div>

            {/* Disqualification Rules */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowDisqualify(!showDisqualify)}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-amber-300 hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Disqualification Criteria
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showDisqualify ? 'rotate-180' : ''}`} />
              </button>
              {showDisqualify && (
                <div className="p-4 pt-0 text-xs text-zinc-300 space-y-2 border-t border-white/5">
                  {challenge.disqualification_rules && challenge.disqualification_rules.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-red-300/90">
                      {challenge.disqualification_rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-400">Unverified workouts, fraudulent check-ins, or workouts logged outside gym opening hours will be disqualified.</p>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              <button
                onClick={() => setShowTerms(!showTerms)}
                className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-zinc-300 hover:bg-white/5 transition-colors"
              >
                <span>Terms & Sponsor Conditions</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showTerms ? 'rotate-180' : ''}`} />
              </button>
              {showTerms && (
                <div className="p-4 pt-0 text-xs text-zinc-400 space-y-2 border-t border-white/5 leading-relaxed">
                  {challenge.terms_and_conditions && challenge.terms_and_conditions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {challenge.terms_and_conditions.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Prize redemption is governed by the sponsor brand's standard vouchers policy. Prizes must be claimed within 14 days of draw announcement.</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Reward Card & Join Action */}
        <div className="space-y-6">
          {/* Reward Card */}
          <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Gift className="w-4 h-4" /> Prize Package
            </span>

            {challenge.reward?.image ? (
              <img
                src={challenge.reward.image}
                alt={challenge.reward.title}
                className="w-full h-44 rounded-2xl object-cover border border-white/10 shadow-lg"
              />
            ) : (
              <div className="w-full h-36 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Gift className="w-12 h-12 text-amber-400" />
              </div>
            )}

            <div>
              <h4 className="text-lg font-black text-white">
                {challenge.reward?.title || "Exclusive Reward Voucher"}
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {challenge.reward?.description || "Awarded to the official verified winner of this challenge."}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Winners Selected:</span>
              <span className="font-bold text-white font-mono">{challenge.reward?.winner_count || 1} Winner(s)</span>
            </div>

            {challenge.reward?.value && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Prize Value:</span>
                <span className="font-extrabold text-amber-400 font-mono text-sm">
                  ₹{challenge.reward.value}
                </span>
              </div>
            )}
          </div>

          {/* Action Join Box */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 text-center space-y-4">
            {hasWinners ? (
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-2">Winners Live!</span>
                <Link
                  to={`/winners?challenge_id=${challenge.id}`}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" /> View Winner Podium
                </Link>
              </div>
            ) : challenge.is_joined ? (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">You Are Enrolled</h4>
                <p className="text-xs text-zinc-400">
                  Log your daily workouts at the gym. Complete the required days to be placed in the random winner draw.
                </p>
              </div>
            ) : isUpcoming ? (
              <div className="space-y-2">
                <Clock className="w-8 h-8 text-zinc-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Upcoming Challenge</h4>
                <p className="text-xs text-zinc-400">This challenge has not started yet. Check back when the countdown finishes.</p>
              </div>
            ) : isClosed ? (
              <div className="space-y-2">
                <p className="text-sm font-bold text-zinc-300">Challenge Closed</p>
                <p className="text-xs text-zinc-400">Winner selection in progress. Results will be published shortly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: themeColor }}
                >
                  {isJoining ? "Enrolling..." : "Join Challenge Now"}
                </button>
                <p className="text-[11px] text-zinc-400">
                  Instant enrollment. Only verified gym workouts are counted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
