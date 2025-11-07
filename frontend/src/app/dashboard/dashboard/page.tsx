'use client';

import { useAuth } from '@/src/lib/hooks/useAuth';
import { useProgress } from '@/src/lib/hooks/useProgress';
import { useChallenge } from '@/src/lib/hooks/useChallenge';
import { StatsCard } from '@/src/components/dashboard/StatsCard';
import { StreakDisplay } from '@/src/components/dashboard/StreakDisplay';
import { ProgressOverview } from '@/src/components/dashboard/ProgressOverview';
import { QuickActions } from '@/src/components/dashboard/QuickActions';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: progress, isLoading: progressLoading } = useProgress(user?.id);
  const { data: todayChallenge, isLoading: challengeLoading } = useChallenge(user?.id);

  if (progressLoading || challengeLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
        <p className="text-gray-600 mt-2">Day {user?.currentDay} of 21</p>
      </div>

      {/* Streak & Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StreakDisplay streak={progress?.currentStreak || 0} />
        <StatsCard 
          title="Completed Days" 
          value={progress?.completedDays || 0}
          icon="✅"
        />
        <StatsCard 
          title="Average Score" 
          value={`${progress?.averageScore || 0}%`}
          icon="📊"
        />
        <StatsCard 
          title="Improvement" 
          value={`+${progress?.improvementRate || 0}%`}
          icon="📈"
        />
      </div>

      {/* Today's Challenge Status */}
      <div className="mb-8">
        {todayChallenge?.status === 'completed' ? (
          <div className="bg-green-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-green-800 mb-2">
              🎉 Day {user?.currentDay} Complete!
            </h2>
            <p className="text-green-700 mb-4">
              Great work today! Come back tomorrow for your next challenge.
            </p>
            <Button onClick={() => router.push('/progress')}>
              View Today's Feedback
            </Button>
          </div>
        ) : (
          <div className="bg-blue-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              Today's Challenge Awaits
            </h2>
            <p className="text-blue-700 mb-4">
              {todayChallenge?.challenge?.promptText}
            </p>
            <Button onClick={() => router.push('/challenge')}>
              Start Challenge
            </Button>
          </div>
        )}
      </div>

      {/* Progress Overview Chart */}
      <ProgressOverview userId={user?.id} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}