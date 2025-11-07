export interface Challenge {
  id: string;
  difficulty: number;
  promptText: string;
  promptType: 'storytelling' | 'explanation' | 'debate' | 'description' | 'opinion';
  targetDuration: number;
  criteria: string[];
  createdAt: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  day: number;
  status: 'pending' | 'completed';
  assignedAt: string;
  completedAt?: string;
  challenge?: Challenge;
}
