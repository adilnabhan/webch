import React from 'react';
import { Search, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';
import { BrandPartner } from '../types/challenge';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrandId: string;
  onBrandChange: (brandId: string) => void;
  partners: BrandPartner[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedBrandId,
  onBrandChange,
  partners,
}) => {
  const statusOptions = [
    { id: 'all', label: 'All Challenges' },
    { id: 'ongoing', label: '⚡ Ongoing' },
    { id: 'ending_soon', label: '🔥 Ending Soon', isUrgent: true },
    { id: 'upcoming', label: '📅 Upcoming' },
    { id: 'completed', label: '🏆 Completed / Winners' },
  ];

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'workout', label: '🏋️ Workout' },
    { id: 'steps', label: '👟 Steps' },
    { id: 'gift_challenge', label: '🎁 Gift Challenge' },
    { id: 'lucky_draw', label: '🎲 Lucky Draw' },
    { id: 'cardio', label: '🏃 Cardio' },
  ];

  return (
    <div className="space-y-4 w-full">
      {/* Top Search & Partner Dropdown */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Box */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search challenges or brands..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-900 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-brand-500/60 transition-colors"
          />
        </div>

        {/* Brand Partner Filter Dropdown */}
        {partners.length > 0 && (
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Brand:
            </span>
            <select
              value={selectedBrandId}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand-500/60 transition-colors cursor-pointer"
            >
              <option value="">All Brands</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((opt) => {
          const isSelected = selectedStatus === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onStatusChange(opt.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? opt.isUrgent
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold'
                    : 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 font-bold'
                  : 'bg-surface-850/80 text-zinc-400 hover:text-white hover:bg-surface-800 border border-white/5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-zinc-500 text-[11px] font-medium mr-1 flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3 h-3" /> Type:
        </span>
        {categoryOptions.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-white/15 text-white border border-white/30 font-semibold'
                  : 'bg-surface-900/60 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
