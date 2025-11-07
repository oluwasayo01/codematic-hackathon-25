'use client';

import { useAuth } from '@/src/lib/hooks/useAuth';
import { useProgress } from '@/src/lib/hooks/useProgress';
import { useEvaluations } from '@/src/lib/hooks/useEvaluation';
import { ScoreTrendChart } from '@/src/components/progress/ScoreTrendChart';
import { MetricsRadarChart } from '@/src/components/progress/MetricsRadarChart';
import { ImprovementsList } from '@/src/components/progress/ImprovementsList';
import { DownloadReportButton } from '@/src/components/progress/DownloadReportButton';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

export default function ProgressPage() {
  const { user } = useAuth();
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: evaluations, isLoading: evalsLoading } = useEvaluations(user?.id);

  if (progressLoading || evalsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <DownloadReportButton userId={user?.id} />
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Days Completed"
          value={`${progress.completedDays}/21`}
        />
        <StatCard 
          title="Current Streak"
          value={`${progress.currentStreak} days`}
        />
        <StatCard 
          title="Average Score"
          value={`${progress.averageScore}%`}
        />
        <StatCard 
          title="Improvement Rate"
          value={`+${progress.improvementRate}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Score Trend</h3>
          <ScoreTrendChart evaluations={evaluations} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Skills Breakdown</h3>
          <MetricsRadarChart evaluations={evaluations} />
        </div>
      </div>

      {/* Areas of Improvement */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Key Improvements</h3>
        <ImprovementsList progress={progress} />
      </div>
    </div>
  );
}