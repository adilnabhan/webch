import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Trophy, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Trash2,
  Edit,
  Send,
  Sparkles,
  ChevronRight,
  Flame,
  Dumbbell
} from 'lucide-react';
import { AdminChallengeService } from '../services/api';
import { AdminParticipant } from '../types/challenge';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [participants, setParticipants] = useState<AdminParticipant[]>([]);
  const [eligibleUsers, setEligibleUsers] = useState<AdminParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Winner selection modal state
  const [selectionMethod, setSelectionMethod] = useState('lucky_draw');
  const [numWinners, setNumWinners] = useState(1);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [lastSelectionResult, setLastSelectionResult] = useState<any | null>(null);

  // Create Challenge Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChallengeData, setNewChallengeData] = useState({
    name: '',
    short_description: '',
    category: 'workout',
    type: 'lucky_draw',
    brand_name: 'Discipl',
    reward_name: 'Voucher Reward',
    reward_type: 'gift_voucher',
    reward_value: 500,
    number_of_winners: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    participant_scope: 'all',
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await AdminChallengeService.getChallenges();
      const list = Array.isArray(data) ? data : (data.results || []);
      setChallenges(list);
      if (list.length > 0 && !selectedChallenge) {
        handleSelectChallenge(list[0]);
      }
    } catch (err) {
      console.error('Error fetching admin challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChallenge = async (ch: any) => {
    setSelectedChallenge(ch);
    setLastSelectionResult(null);
    try {
      setDetailsLoading(true);
      const [partsRes, eligRes] = await Promise.allSettled([
        AdminChallengeService.getParticipants(ch.id),
        AdminChallengeService.getEligibleUsers(ch.id),
      ]);

      if (partsRes.status === 'fulfilled') {
        setParticipants(partsRes.value.participants || []);
      }
      if (eligRes.status === 'fulfilled') {
        setEligibleUsers(eligRes.value.eligible_users || []);
      }
    } catch (err) {
      console.error('Error fetching challenge data collection:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleTriggerWinnerSelection = async () => {
    if (!selectedChallenge) return;
    try {
      setActionLoading(true);
      const res = await AdminChallengeService.selectWinners(selectedChallenge.id, {
        method: selectionMethod,
        number_of_winners: numWinners,
        publish: true,
      });
      setLastSelectionResult(res);
      setShowSelectModal(false);
      await loadChallenges();
      await handleSelectChallenge(selectedChallenge);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to select winners. Ensure there are verified participants.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishWinners = async () => {
    if (!selectedChallenge) return;
    try {
      setActionLoading(true);
      await AdminChallengeService.publishWinners(selectedChallenge.id);
      alert('Winners published live to customer app successfully!');
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error publishing winners.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeWinners = async () => {
    if (!selectedChallenge) return;
    if (!confirm('Are you sure you want to revoke published winners for this challenge?')) return;
    try {
      setActionLoading(true);
      await AdminChallengeService.revokeWinners(selectedChallenge.id);
      alert('Winners revoked.');
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error revoking winners.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await AdminChallengeService.createChallenge(newChallengeData);
      alert('Challenge created successfully!');
      setShowCreateModal(false);
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create challenge.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-12 text-center max-w-md mx-auto glass-panel rounded-3xl space-y-4 my-16">
        <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Admin Privileges Required</h3>
        <p className="text-xs text-zinc-400">
          You must be an authorized Discipl Administrator or Gym Mentor to access challenge creation and winner selection.
        </p>
        <p className="text-xs text-brand-400 font-semibold">
          Tip: Click "Sign In" in the navbar and choose "Admin Mode" to test the management console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fadeIn">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Challenge Data Collection & Winner Management
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time participant tracking, distinct workout day inspection, and verified winner selection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </button>
          <button
            onClick={loadChallenges}
            className="p-2.5 rounded-xl glass-panel text-zinc-300 hover:text-white border border-white/10"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left = Challenges List, Right = Selected Challenge Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Challenge Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1">
            <span>Challenges ({challenges.length})</span>
            <span>Status</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {challenges.map((ch) => {
              const isSelected = selectedChallenge?.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-surface-800 border-brand-500/50 shadow-[0_0_15px_-3px_rgba(215,25,32,0.3)]'
                      : 'glass-panel border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                      #{ch.id} • {ch.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{ch.name}</h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {ch.start_date || 'Start'} to {ch.end_date || 'End'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        ch.status === 'active' || ch.status === 'winners_announced'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {ch.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Challenge Data & Participant Inspection (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedChallenge ? (
            <div className="space-y-6">
              {/* Selected Challenge Details Bar */}
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                      Active Inspection Target
                    </span>
                    <h3 className="text-xl font-black text-white">{selectedChallenge.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{selectedChallenge.short_description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSelectModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md flex items-center gap-1.5 hover:brightness-110 transition-all"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Select Winners
                    </button>
                    {selectedChallenge.winners_published ? (
                      <button
                        onClick={handleRevokeWinners}
                        disabled={actionLoading}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-colors"
                      >
                        Revoke Winners
                      </button>
                    ) : (
                      <button
                        onClick={handlePublishWinners}
                        disabled={actionLoading}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
                      >
                        Publish Winners Live
                      </button>
                    )}
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                  <div className="p-3 rounded-xl bg-surface-900 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Total Registered</span>
                    <span className="text-lg font-bold text-white font-mono">{participants.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-900 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Verified Candidates</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">{eligibleUsers.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-900 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Target Requirement</span>
                    <span className="text-lg font-bold text-amber-300 font-mono">
                      {selectedChallenge.eligibility_conditions?.min_workout_days || 3} Distinct Days
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-900 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block font-semibold">Selection Strategy</span>
                    <span className="text-xs font-bold text-white uppercase truncate block mt-1">
                      {selectedChallenge.winner_selection_method || 'lucky_draw'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Winner Candidates Table */}
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Verified Finishers ({eligibleUsers.length})
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    Passed 1 workout/day & trainer verification check
                  </span>
                </div>

                {detailsLoading ? (
                  <div className="h-40 rounded-xl glass-panel animate-shimmer" />
                ) : eligibleUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400 font-semibold">
                          <th className="pb-3 pl-2">Athlete</th>
                          <th className="pb-3">Completed Days</th>
                          <th className="pb-3">Trainer Verified</th>
                          <th className="pb-3">Workout Dates</th>
                          <th className="pb-3 pr-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {eligibleUsers.map((item) => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 pl-2 flex items-center gap-2.5">
                              <img
                                src={item.user.profile_picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.user.id}`}
                                alt={item.user.username}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <span className="font-bold text-white">
                                {item.user.first_name} {item.user.last_name || item.user.username}
                              </span>
                            </td>
                            <td className="py-3 font-mono font-bold text-emerald-400">
                              {item.progress_data.workouts_completed || item.progress_data.workout_days_count || 1} Days
                            </td>
                            <td className="py-3">
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                              </span>
                            </td>
                            <td className="py-3 text-zinc-400 text-[11px] font-mono">
                              {(item.progress_data.workout_dates || []).join(', ') || 'Current Challenge Window'}
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Eligible for Draw
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-surface-900 border border-white/5 space-y-1">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                    <p className="text-xs font-semibold text-zinc-300">No Verified Candidates Yet</p>
                    <p className="text-[11px] text-zinc-400">
                      Athletes must log gym workouts that are marked verified by their trainer to appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* All Participants List */}
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-400" />
                    All Enrolled Participants ({participants.length})
                  </h4>
                </div>

                {participants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-surface-900 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.user.profile_picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.user.id}`}
                            alt={p.user.username}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">
                              {p.user.first_name} {p.user.last_name || p.user.username}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              Joined {new Date(p.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          {p.is_eligible_for_winner ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Qualified
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {p.progress_data?.workouts_completed || 0} Days
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 text-center py-4">No participants registered yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-16 text-center rounded-3xl glass-panel border border-white/10 space-y-2">
              <Trophy className="w-10 h-10 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">Select a Challenge</h4>
              <p className="text-xs text-zinc-400">Choose a challenge from the left to inspect participants and select winners.</p>
            </div>
          )}
        </div>
      </div>

      {/* Winner Selection Confirmation Modal */}
      {showSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg p-6 rounded-3xl glass-panel border border-amber-500/40 glow-amber text-left space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-black text-white">Trigger Winner Selection</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This executes the backend winner-selection engine. Only participants with trainer-verified workouts on distinct calendar days will be included in the draw.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Selection Strategy</label>
                <select
                  value={selectionMethod}
                  onChange={(e) => setSelectionMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="lucky_draw">🎲 Lucky Draw (Random 1 Winner from Verified Finishers)</option>
                  <option value="weekly_min_3_days_random">🎁 Weekly Gift Challenge (Random from Min 3-Day Finishers)</option>
                  <option value="scoreboard_based">🏆 Scoreboard Based (Highest Score & Rank)</option>
                  <option value="highest_workout_count">💪 Highest Workout Count</option>
                  <option value="first_n_finishers">⚡ First N Finishers</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Number of Winners</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={numWinners}
                  onChange={(e) => setNumWinners(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Currently <strong>{eligibleUsers.length}</strong> verified finishers are eligible for selection. Selecting winners will update the challenge record and announce them live to the mobile app.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowSelectModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleTriggerWinnerSelection}
                disabled={actionLoading || eligibleUsers.length === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:brightness-110 disabled:opacity-50 transition-all"
              >
                {actionLoading ? 'Selecting...' : 'Execute Draw & Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl p-6 rounded-3xl glass-panel border border-brand-500/40 text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white">Create New Challenge</h3>
            <form onSubmit={handleCreateChallenge} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Challenge Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14's Shawaya Challenge"
                  value={newChallengeData.name}
                  onChange={(e) => setNewChallengeData({ ...newChallengeData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete 3 workout days this week and win dinner!"
                  value={newChallengeData.short_description}
                  onChange={(e) => setNewChallengeData({ ...newChallengeData, short_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Category</label>
                  <select
                    value={newChallengeData.category}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="workout">Workout</option>
                    <option value="steps">Steps</option>
                    <option value="cardio">Cardio</option>
                    <option value="weight_loss">Weight Loss</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Type</label>
                  <select
                    value={newChallengeData.type}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="gift_challenge">🎁 Gift Challenge</option>
                    <option value="lucky_draw">🎲 Lucky Draw</option>
                    <option value="performance">🏆 Performance</option>
                    <option value="everyone_wins">🎁 Everyone Wins</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newChallengeData.start_date}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                  </input>
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newChallengeData.end_date}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Brand Sponsor</label>
                  <input
                    type="text"
                    value={newChallengeData.brand_name}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, brand_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Prize Title</label>
                  <input
                    type="text"
                    value={newChallengeData.reward_name}
                    onChange={(e) => setNewChallengeData({ ...newChallengeData, reward_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-white/10 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
                >
                  {actionLoading ? 'Creating...' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
