import { apiClient } from './apiClient';
import { mockStakeholderPersonas, mockPfzData, mockSarData } from '../mockData/stakeholderData';
import { StakeholderPersona, PotentialFishingZone, SarDriftForecast, StakeholderPersonaId } from '../types/stakeholder';

export const stakeholderService = {
  async getPersonas(): Promise<StakeholderPersona[]> {
    const res = await apiClient.get<StakeholderPersona[]>('/api/stakeholders/personas', mockStakeholderPersonas);
    return res.data;
  },

  async getPersonaById(id: StakeholderPersonaId): Promise<StakeholderPersona | undefined> {
    const personas = await this.getPersonas();
    return personas.find((p) => p.id === id);
  },

  async getPfzAdvisories(): Promise<PotentialFishingZone[]> {
    const res = await apiClient.get<PotentialFishingZone[]>('/api/stakeholders/pfz', mockPfzData);
    return res.data;
  },

  async getSarForecasts(): Promise<SarDriftForecast[]> {
    const res = await apiClient.get<SarDriftForecast[]>('/api/stakeholders/sar', mockSarData);
    return res.data;
  },
};
