'use strict';

import api from './api';

export interface MissionReward {
  key: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
}

export interface MissionProgress {
  key: string;
  title: string;
  description: string;
  completed: boolean;
  reward: MissionReward;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
}

export interface MissionSummary {
  total: number;
  completed: number;
  decorations: MissionReward[];
}

export interface MissionProgressResponse {
  success: boolean;
  missions: MissionProgress[];
  summary: MissionSummary;
}

export interface RankingEntry {
  position: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string | null;
    banner_url?: string | null;
    selected_decoration?: MissionReward | null;
  };
  completed: number;
  decorations: MissionReward[];
}

export interface RankingResponse {
  success: boolean;
  ranking: RankingEntry[];
  you: {
    position: number;
    completed: number;
    decorations: MissionReward[];
  } | null;
  total_missions: number;
}

export const missionsService = {
  async obtenerProgreso(): Promise<MissionProgressResponse> {
    const response = await api.get<MissionProgressResponse>('/missions/progress');
    return response.data;
  },
  async obtenerRanking(): Promise<RankingResponse> {
    const response = await api.get<RankingResponse>('/missions/ranking');
    return response.data;
  },
};


