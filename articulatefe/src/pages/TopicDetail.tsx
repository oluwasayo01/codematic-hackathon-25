import { useEffect, useState } from "react";
import {
  Content,
  Grid,
  Column,
  Tile,
  Breadcrumb,
  BreadcrumbItem,
  ProgressBar,
} from "@carbon/react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchTopicDetail } from "../stores/topic.actions";
import { AudioRecorderCard } from "../components/recorder/AudioRecorderCard";
import { uploadAudio, evaluateSubmission } from "../stores/submission.actions";
import { CheckmarkFilled } from "@carbon/icons-react";
import { MetricsOverview } from "../components/topic/MetricsOverview";
import { DaysList } from "../components/topic/DaysList";
import { ChallengeCard } from "../components/topic/ChallengeCard";
import { PreviousSubmissions } from "../components/topic/PreviousSubmissions";
import { DetailedMetrics } from "../components/topic/DetailedMetrics";

export function TopicDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { current, isLoading: loading, error } = useAppSelector((s) => s.topic);
  const topics = useAppSelector((s) => s.topic.topics);
  const user = useAppSelector((s) => s.auth.user);
  
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'metrics'>('record');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch<any>(fetchTopicDetail(id));
  }, [id, dispatch]);

  // Get current day's challenge (backend determines this)
  const currentDayChallenge = current?.currentDay;
  const completedDays = current?.days?.filter(d => d.completed) || [];
  const progressPercentage = (completedDays.length / 21) * 100;

  // Client-side fallback to ensure UI is visible even if backend status fails
  const effectiveChallenge = currentDayChallenge ?? {
    day: 1,
    challengeId: undefined as string | undefined,
    promptText: 'Demo: Speak about your favorite book for 30 seconds. Focus on clarity and pacing.',
    promptType: 'free_speech',
    targetDuration: 30,
    difficulty: 2,
    completed: false,
  };

  async function submitBlob(blob: Blob) {
    if (!user?.id || !id) return;
    
    setSubmitting(true);
    try {
      const submissionId = await dispatch<any>(
        uploadAudio(user.id, id, blob, effectiveChallenge.challengeId)
      );
      await dispatch<any>(evaluateSubmission(submissionId));
      
      // Refresh topic data after submission
      if (id) dispatch<any>(fetchTopicDetail(id));
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Content style={{ padding: "2rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
          <div style={{ color: '#a8a8a8' }}>Loading...</div>
        </div>
      </Content>
    );
  }

  const title = current?.topic?.title || topics.find((t) => t.id === id)?.title || 'Topic';

  return (
    <Content id="main-content" style={{ padding: "2rem", background: "#161616" }}>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to="/topics">Topics</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          {title}
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontWeight: 400, color: '#f4f4f4', marginBottom: 8 }}>
              {title}
            </h2>
            <p style={{ fontSize: 14, color: '#a8a8a8' }}>
              {current?.topic?.description}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#0f62fe', marginBottom: 4 }}>
              {completedDays.length}/21
            </div>
            <div style={{ fontSize: 12, color: '#a8a8a8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Days Complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: '#262626', padding: 16, borderRadius: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#a8a8a8', textTransform: 'uppercase' }}>Progress</span>
            <span style={{ fontSize: 14, color: '#e0e0e0' }}>{Math.round(progressPercentage)}%</span>
          </div>
          <ProgressBar 
            value={progressPercentage} 
            label=""
            size="big"
          />
        </div>
      </div>

      <Grid condensed>
        {/* Left Column - Main Content */}
        <Column lg={10} md={8} sm={4}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #393939' }}>
            <button
              onClick={() => setActiveTab('record')}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === 'record' ? '#0f62fe' : '#a8a8a8',
                borderBottom: activeTab === 'record' ? '2px solid #0f62fe' : '2px solid transparent',
                background: 'transparent'
              }}
            >
              Today's Challenge
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === 'history' ? '#0f62fe' : '#a8a8a8',
                borderBottom: activeTab === 'history' ? '2px solid #0f62fe' : '2px solid transparent',
                background: 'transparent'
              }}
            >
              Previous Submissions
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === 'metrics' ? '#0f62fe' : '#a8a8a8',
                borderBottom: activeTab === 'metrics' ? '2px solid #0f62fe' : '2px solid transparent',
                background: 'transparent'
              }}
            >
              Detailed Metrics
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'record' && (
            <div style={{ display: 'grid', gap: 24 }}>
              {/* If backend failed, show a small note and the demo challenge */}
              {error && (
                <Tile style={{ background: '#262626', borderLeft: '4px solid #f1c21b' }}>
                  <div style={{ color: '#f4f4f4' }}>Showing demo challenge (status unavailable).</div>
                </Tile>
              )}
              <>
                <ChallengeCard challenge={effectiveChallenge} />
                
                {effectiveChallenge.completed ? (
                  <Tile style={{ background: 'rgba(16,185,129,0.12)', borderLeft: '4px solid #42be65' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckmarkFilled size={24} />
                      <div>
                        <p style={{ color: '#f4f4f4', fontWeight: 500 }}>
                          Challenge Completed!
                        </p>
                        <p style={{ color: '#a8a8a8', fontSize: 12, marginTop: 4 }}>
                          Come back tomorrow for your next challenge
                        </p>
                      </div>
                    </div>
                  </Tile>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <h4 style={{ color: '#f4f4f4' }}>
                      Record Your Response
                    </h4>
                    <AudioRecorderCard 
                      onSubmit={submitBlob} 
                    />
                    {submitting && (
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ display: 'inline-block', borderRadius: '999px', height: 32, width: 32, borderBottom: '2px solid #0f62fe', animation: 'spin 1s linear infinite' }} />
                        <p style={{ fontSize: 12, color: '#a8a8a8', marginTop: 8 }}>
                          Evaluating your submission...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            </div>
          )}

          {activeTab === 'history' && (
            <PreviousSubmissions 
              submissions={current?.submissions || []}
              topicId={id!}
            />
          )}

          {activeTab === 'metrics' && (
            <DetailedMetrics 
              evaluations={current?.evaluations || []}
              days={current?.days || []}
            />
          )}
        </Column>

        {/* Right Column - Sidebar */}
        <Column lg={6} md={8} sm={4} style={{ borderLeft: '1px solid #393939', paddingLeft: 24, marginTop: 0 }}>
          {/* Overall Metrics Card */}
          <MetricsOverview 
            completedDays={completedDays.length}
            averageScore={current?.averageScore || 0}
            improvementRate={current?.improvementRate || 0}
            currentStreak={current?.currentStreak || 0}
          />

          {/* Days Grid */}
          <div style={{ marginTop: "1.5rem" }}>
            <h4 style={{ color: '#f4f4f4', marginBottom: 12 }}>
              21-Day Progress
            </h4>
            <DaysList 
              days={current?.days || []} 
              currentDay={currentDayChallenge?.day}
            />
          </div>

          {/* Quick Stats */}
          <Tile style={{ marginTop: "1.5rem", background: "#262626" }}>
            <h5 style={{ fontSize: 12, color: '#e0e0e0', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              Recent Performance
            </h5>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#a8a8a8' }}>Last 7 Days</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f4' }}>
                  {current?.recentPerformance?.last7Days ? Math.round(current.recentPerformance.last7Days) : 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#a8a8a8' }}>Best Score</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#42be65' }}>
                  {current?.bestScore ?? 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#a8a8a8' }}>Total Time</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f4' }}>
                  {current?.totalTime || 'N/A'}
                </span>
              </div>
            </div>
          </Tile>
        </Column>
      </Grid>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </Content>
  );
}
