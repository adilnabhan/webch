import React, { useState, useEffect } from 'react';
import { Building2, ExternalLink, ShieldCheck, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { BrandPartner } from '../types/challenge';
import { ChallengeService } from '../services/api';
import { Link } from 'react-router-dom';

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<BrandPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await ChallengeService.getPartners();
      setPartners(data);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-400 border border-brand-500/30">
          <Building2 className="w-4 h-4" />
          Partner Ecosystem
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Official Challenge Sponsors
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Partnering with premium lifestyle, fitness, and dining brands to bring exclusive rewards to Discipl athletes.
        </p>
      </div>

      {/* Partner Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl glass-panel animate-shimmer" />
          ))}
        </div>
      ) : partners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/10 flex items-center justify-center p-2 overflow-hidden shadow-lg">
                    {partner.logo ? (
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-lg font-black text-brand-400">{partner.name[0]}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{partner.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Proud sponsor providing complimentary dining vouchers, premium fitness merchandise, and rewards for daily gym achievers.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                {partner.website ? (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-zinc-500">Official Discipl Brand</span>
                )}

                <Link
                  to={`/explore?brand_id=${partner.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
                >
                  View Challenges <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl glass-panel border border-white/5 space-y-2 max-w-md mx-auto">
          <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Partners Listed</h4>
          <p className="text-xs text-zinc-400">Partner information will be populated as new brands sponsor challenges.</p>
        </div>
      )}

      {/* Become a Sponsor Section */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-brand-500/30 glow-brand text-center max-w-2xl mx-auto space-y-4">
        <Sparkles className="w-8 h-8 text-brand-400 mx-auto" />
        <h3 className="text-2xl font-black text-white">Want to Sponsor a Challenge?</h3>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Connect your brand directly with thousands of engaged gym athletes across India. Reward consistency and gain authentic brand recognition.
        </p>
        <div className="pt-2">
          <a
            href="mailto:partners@thediscipl.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/30 transition-all"
          >
            Contact Partner Desk →
          </a>
        </div>
      </div>
    </div>
  );
};
