import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Challenge, BrandPartner } from '../types/challenge';
import { ChallengeService } from '../services/api';
import { ChallengeCard } from '../components/ChallengeCard';
import { FilterBar } from '../components/FilterBar';

export const ExplorePage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [partners, setPartners] = useState<BrandPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [searchQuery, selectedStatus, selectedCategory, selectedBrandId, currentPage]);

  const loadPartners = async () => {
    try {
      const data = await ChallengeService.getPartners();
      setPartners(data);
    } catch (err) {
      console.error('Error fetching partners:', err);
    }
  };

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        page_size: 12,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedBrandId) params.brand_id = selectedBrandId;

      const res = await ChallengeService.getChallenges(params);
      setChallenges(res.results);
      setTotalCount(res.count);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId: number) => {
    try {
      setJoiningId(challengeId);
      await ChallengeService.joinChallenge(challengeId);
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Could not join challenge. Please complete the verified workout first.');
    } finally {
      setJoiningId(null);
    }
  };

  const totalPages = Math.ceil(totalCount / 12) || 1;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" /> Challenge Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
          Explore All Challenges
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
          Filter by workout type, brand sponsor, or timeline status. Complete workouts to qualify for exclusive prizes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(s) => {
            setSelectedStatus(s);
            setCurrentPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(c) => {
            setSelectedCategory(c);
            setCurrentPage(1);
          }}
          selectedBrandId={selectedBrandId}
          onBrandChange={(b) => {
            setSelectedBrandId(b);
            setCurrentPage(1);
          }}
          partners={partners}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
        <span>
          Showing <span className="text-white font-bold">{challenges.length}</span> of{' '}
          <span className="text-white font-bold">{totalCount}</span> challenges
        </span>
        {selectedStatus !== 'all' && (
          <span className="px-2.5 py-1 rounded-full bg-surface-800 text-zinc-300 border border-white/5">
            Status: {selectedStatus.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Challenge Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl glass-panel animate-shimmer" />
          ))}
        </div>
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoin}
              isJoining={joiningId === challenge.id}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl glass-panel border border-white/5 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto text-zinc-500">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Challenges Found</h3>
          <p className="text-xs text-zinc-400">
            No challenges matched your search filters. Try clearing filters or checking back soon.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedCategory('all');
              setSelectedBrandId('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2.5 rounded-xl glass-panel border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-zinc-400 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2.5 rounded-xl glass-panel border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
