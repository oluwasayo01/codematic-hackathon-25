import api from './axios';
import { UserProgress } from '@/src/types/progress';


export const progressAPI = {
  getUserProgress: async (userId: string): Promise<UserProgress> => {
    const response = await api.get(`/progress/${userId}`);
    return response.data;
  },

  downloadReport: async (userId: string) => {
    const response = await api.get(`/progress/${userId}/report/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `articulation_report_${userId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
