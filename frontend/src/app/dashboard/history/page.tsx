'use client';

import { useState } from 'react';
import { useAuth } from '@/src/lib/hooks/useAuth';
import { useEvaluations } from '@/src/lib/hooks/useEvaluation';
import { EvaluationCard } from '@/src/components/evaluation/EvaluationCard';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

export default function HistoryPage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { data: evaluations, isLoading } = useEvaluations(user?.id);

  if (isLoading) return <LoadingSpinner />;

  const filteredEvals = selectedDay 
    ? evaluations.filter(e => e.day === selectedDay)
    : evaluations;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Evaluation History</h1>

      {/* Day Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        <Button 
          onClick={() => setSelectedDay(null)}
          variant={selectedDay === null ? 'primary' : 'outline'}
        >
          All Days
        </Button>
        {Array.from({length: user?.currentDay || 1}, (_, i) => i + 1).map(day => (
          <Button
            key={day}
            onClick={() => setSelectedDay(day)}
            variant={selectedDay === day ? 'primary' : 'outline'}
          >
            Day {day}
          </Button>
        ))}
      </div>

      {/* Evaluations List */}
      <div className="space-y-6">
        {filteredEvals.map(evaluation => (
          <EvaluationCard 
            key={evaluation.id} 
            evaluation={evaluation}
            expandable 
          />
        ))}
      </div>
    </div>
  );
}