import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Calendar,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { Challenge, BrandPartner, WinnerHistoryItem } from '../types/challenge';
import { ChallengeService } from '../services/api';
import { ChallengeCard } from '../components/ChallengeCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { HowItWorksStepper } from '../components/HowItWorksStepper';
import { WinnerPopupModal } from '../components/WinnerPopupModal';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [featuredChallenges, setFeaturedChallenges] = useState<Challenge[]>([]);
  const [partners, setPartners] = useState<BrandPartner[]>([]);
  const [recentWinners, setRecentWinners] = useState<WinnerHistoryItem[]>([]);
  const [winnerPopupData, setWinnerPopupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  useEffect(() => {
    loadHomeData();
    if (isAuthenticated) {
      checkWinnerPopup();
    }
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [challengesData, partnersData, winnersData] = await Promise.allSettled([
        ChallengeService.getHomeChallenges(),
        ChallengeService.getPartners(),
        ChallengeService.getAllWinners({ page_size: 4 }),
      ]);

      if (challengesData.status === 'fulfilled') {
        let chList = challengesData.value;
        if (!chList || chList.length === 0) {
          // If no active/upcoming challenges on /home/, fallback to latest catalog challenges
          try {
            const catalogRes = await ChallengeService.getChallenges({ page_size: 6 });
            chList = catalogRes.results || [];
          } catch {
            chList = [];
          }
        }
        setFeaturedChallenges(chList);
      }
      if (partnersData.status === 'fulfilled') {
        setPartners(partnersData.value);
      }
      if (winnersData.status === 'fulfilled' && winnersData.value.winners) {
        setRecentWinners(winnersData.value.winners);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkWinnerPopup = async () => {
    try {
      const popup = await ChallengeService.getWinnerPopup();
      if (popup && popup.show_popup) {
        setWinnerPopupData(popup);
      }
    } catch (err) {
      console.error('Error checking winner popup:', err);
    }
  };

  const handleJoin = async (challengeId: number) => {
    try {
      setJoiningId(challengeId);
      await ChallengeService.joinChallenge(challengeId);
      await loadHomeData();
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Could not join challenge. Please complete the verified workout first.');
    } finally {
      setJoiningId(null);
    }
  };

  // Select top featured hero challenge
  const heroChallenge = featuredChallenges[0];

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      {/* 1. Hero Showcase Section */}
      <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-surface-900 mt-2 sm:mt-6">
        {heroChallenge ? (
          <div className="relative min-h-[460px] sm:min-h-[520px] flex items-end p-6 sm:p-12">
            {/* Background image & gradient overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={heroChallenge.banner_image || heroChallenge.thumbnail_image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600'}
                alt={heroChallenge.name}
                className="w-full h-full object-cover brightness-[0.45] scale-105 transform motion-safe:animate-pulse-subtle"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/40 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                  <Flame className="w-3.5 h-3.5 fill-current" /> Featured Challenge
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/15">
                  {heroChallenge.brand.name}
                  {heroChallenge.brand.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </span>
                {heroChallenge.remaining_seconds > 0 && (
                  <CountdownTimer initialSeconds={heroChallenge.remaining_seconds} size="sm" label="Ends in" />
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {heroChallenge.name}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 line-clamp-2 leading-relaxed">
                {heroChallenge.short_description || "Join athletes across your gym, track verified daily workouts, and unlock exclusive rewards."}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-zinc-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>{heroChallenge.joined_member_count || 0} Registered Athletes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Trainer Verified Workouts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(`/challenge/${heroChallenge.id}`)}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all"
                >
                  {heroChallenge.is_joined ? "View Your Progress" : "Participate Now"}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/explore"
                  className="px-5 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 backdrop-blur-md transition-all"
                >
                  Explore All Challenges
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center max-w-xl mx-auto space-y-4">
            <Trophy className="w-12 h-12 text-brand-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Push Your Limits with Discipl Challenges</h2>
            <p className="text-sm text-zinc-400">
              Work out at connected gyms, log verified sessions, and win real rewards from top brand partners.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* 2. Brand Sponsors Ticker */}
      {partners.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Official Brand Partners
            </span>
            <Link to="/partners" className="text-xs font-semibold text-brand-400 hover:underline">
              View All Partners →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partners.slice(0, 4).map((partner) => (
              <a
                key={partner.id}
                href={partner.website || '#'}
                target={partner.website ? '_blank' : '_self'}
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl glass-panel glass-panel-hover border border-white/5 hover:border-brand-500/30"
              >
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {partner.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{partner.name}</h4>
                  <p className="text-[10px] text-zinc-400 truncate">Official Sponsor</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 3. Live & Active Challenges Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-brand-500" />
              Active Gym Challenges
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Currently running in participating fitness centers. Complete required distinct workout days to qualify.
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl glass-panel animate-shimmer" />
            ))}
          </div>
        ) : featuredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoin}
                isJoining={joiningId === challenge.id}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 space-y-2">
            <Trophy className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">No active challenges available right now.</p>
            <p className="text-xs text-zinc-400">Check back soon or explore scheduled upcoming events.</p>
          </div>
        )}
      </section>

      {/* 4. How It Works Stepper */}
      <section className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-brand-400">
            Participation Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">How Discipl Challenges Work</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A simple, transparent 4-step process powered by trainer verification and fair random selection.
          </p>
        </div>
        <HowItWorksStepper currentStep={2} />
      </section>

      {/* 5. Recent Winners Showcase Ticker */}
      {recentWinners.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                Recent Winners Gallery
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Athletes who recently won rewards in their gym challenges.
              </p>
            </div>
            <Link to="/winners" className="text-xs font-bold text-amber-400 hover:text-amber-300">
              Hall of Fame →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentWinners.map((winner) => (
              <div
                key={winner.id}
                className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center gap-3.5 hover:border-amber-500/30 transition-all"
              >
                <img
                  src={winner.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${winner.id}`}
                  alt={winner.user_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">#1 Winner</span>
                    <span className="text-[10px] text-zinc-400">{winner.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{winner.user_name}</h4>
                  <p className="text-xs text-zinc-300 truncate font-medium mt-0.5">{winner.prize}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{winner.gym_name || winner.challenge_name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Winner Popup Celebration Modal */}
      <WinnerPopupModal data={winnerPopupData} onClose={() => setWinnerPopupData(null)} />
    </div>
  );
};
