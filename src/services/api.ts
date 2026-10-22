import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { 
  Challenge, 
  ChallengeDetail, 
  AllWinnersResponse, 
  WinnerPopupData, 
  BrandPartner, 
  AdminParticipant 
} from '../types/challenge';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://app.thediscipl.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('discipl_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for token refresh or errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optional: Handle refresh token here if refreshToken is stored
      console.warn('Unauthorized or session expired.');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// CUSTOMER CHALLENGE API SERVICES
// ==========================================

export const ChallengeService = {
  // 1. Featured active/upcoming challenges for Home Screen
  getHomeChallenges: async (): Promise<Challenge[]> => {
    const response = await apiClient.get('/api/v1/customer/challenges/home/');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data.results && Array.isArray(data.results)) return data.results;
    if (data.challenges && Array.isArray(data.challenges)) return data.challenges;
    return [];
  },

  // 2. Full challenge list with filters
  getChallenges: async (params?: {
    status?: string;
    challenge_type?: string;
    category?: string;
    brand_id?: number | string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{ results: Challenge[]; count: number; next: string | null; previous: string | null }> => {
    const response = await apiClient.get('/api/v1/customer/challenges/', { params });
    const data = response.data;
    if (Array.isArray(data)) {
      return { results: data, count: data.length, next: null, previous: null };
    }
    return {
      results: data.results || [],
      count: data.count || (data.results ? data.results.length : 0),
      next: data.next || null,
      previous: data.previous || null,
    };
  },

  // 3. Challenge Detail
  getChallengeDetail: async (id: number | string): Promise<ChallengeDetail> => {
    const response = await apiClient.get(`/api/v1/customer/challenges/${id}/`);
    return response.data;
  },

  // 4. Join / Enroll in challenge
  joinChallenge: async (id: number | string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/customer/challenges/${id}/join/`, {});
    return response.data;
  },

  // 5. User live progress
  getChallengeProgress: async (id: number | string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/customer/challenges/${id}/progress/`);
    return response.data;
  },

  // 6. Challenge Winners & Podium
  getChallengeWinners: async (id: number | string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/customer/challenges/${id}/winners/`);
    return response.data;
  },

  // 7. All Challenge Winners Gallery (Hall of Fame)
  getAllWinners: async (params?: {
    search?: string;
    challenge_id?: number | string;
    page?: number;
    page_size?: number;
  }): Promise<AllWinnersResponse> => {
    const response = await apiClient.get('/api/v1/customer/challenges/winners/', { params });
    return response.data;
  },

  // 8. Gym-specific Winners
  getGymWinners: async (params?: { gym_id?: number | string }): Promise<AllWinnersResponse> => {
    const response = await apiClient.get('/api/v1/customer/challenges/gym-winners/', { params });
    return response.data;
  },

  // 9. Winner Celebration Popup
  getWinnerPopup: async (): Promise<WinnerPopupData> => {
    try {
      const response = await apiClient.get('/api/v1/customer/challenges/winner-popup/');
      return response.data;
    } catch {
      return { show_popup: false };
    }
  },

  // 10. Mark Winner Popup as Seen
  markWinnerPopupSeen: async (challengeId: number): Promise<any> => {
    const response = await apiClient.post('/api/v1/customer/challenges/winner-popup/seen/', {
      challenge_id: challengeId,
    });
    return response.data;
  },

  // 11. Sponsor Brands & Partners
  getPartners: async (): Promise<BrandPartner[]> => {
    const response = await apiClient.get('/api/v1/customer/challenges/partners/');
    const data = response.data;
    if (data.partners && Array.isArray(data.partners)) return data.partners;
    if (data.results && Array.isArray(data.results)) return data.results;
    if (Array.isArray(data)) return data;
    return [];
  },

  // 12. User's Enrolled Challenges
  getMyChallenges: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/v1/customer/my-challenges/');
    return Array.isArray(response.data) ? response.data : (response.data.results || []);
  },
};

// ==========================================
// ADMIN CHALLENGE API SERVICES
// ==========================================

export const AdminChallengeService = {
  // List all challenges
  getChallenges: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/api/v1/admin/challenges/', { params });
    return response.data;
  },

  // Create new challenge
  createChallenge: async (challengeData: any): Promise<any> => {
    const response = await apiClient.post('/api/v1/admin/challenges/', challengeData);
    return response.data;
  },

  // Get challenge by ID
  getChallengeDetail: async (id: number | string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/admin/challenges/${id}/`);
    return response.data;
  },

  // Update challenge
  updateChallenge: async (id: number | string, challengeData: any): Promise<any> => {
    const response = await apiClient.put(`/api/v1/admin/challenges/${id}/`, challengeData);
    return response.data;
  },

  // Delete challenge
  deleteChallenge: async (id: number | string): Promise<any> => {
    const response = await apiClient.delete(`/api/v1/admin/challenges/${id}/`);
    return response.data;
  },

  // Get participants
  getParticipants: async (id: number | string): Promise<{ total_participants: number; participants: AdminParticipant[] }> => {
    const response = await apiClient.get(`/api/v1/admin/challenges/${id}/participants/`);
    return response.data;
  },

  // Get eligible users (completed & verified workout days)
  getEligibleUsers: async (id: number | string): Promise<{ eligible_count: number; eligible_users: AdminParticipant[] }> => {
    const response = await apiClient.get(`/api/v1/admin/challenges/${id}/eligible-users/`);
    return response.data;
  },

  // Trigger Winner Selection
  selectWinners: async (id: number | string, payload: {
    method?: string;
    number_of_winners?: number;
    winner_user_ids?: number[];
    publish?: boolean;
  }): Promise<any> => {
    const response = await apiClient.post(`/api/v1/admin/challenges/${id}/select-winners/`, payload);
    return response.data;
  },

  // Publish Winners Live to App
  publishWinners: async (id: number | string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/admin/challenges/${id}/publish-winners/`);
    return response.data;
  },

  // Revoke Winners
  revokeWinners: async (id: number | string): Promise<any> => {
    const response = await apiClient.post(`/api/v1/admin/challenges/${id}/revoke-winners/`);
    return response.data;
  },

  // Preview Customer App View
  previewChallenge: async (id: number | string): Promise<any> => {
    const response = await apiClient.get(`/api/v1/admin/challenges/${id}/preview/`);
    return response.data;
  },

  // Get list of gym users for custom selection
  getUsers: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/api/v1/admin/challenges/users/', { params });
    return response.data;
  },
};
