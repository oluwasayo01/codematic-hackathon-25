'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/lib/hooks/useAuth';
import { useChallenge } from '@/src/lib/hooks/useChallenge';
import { useRecorder } from '@/src/lib/hooks/useRecorder';
import { submitRecording } from '@/src/lib/api/submissions';
import { ChallengeCard } from '@/src/components/challenge/ChallengeCard';
import { AudioRecorder } from '@/src/components/challenge/AudioRecorder';
import { RecordingControls } from '@/src/components/challenge/RecordingControls';
import { TranscriptionDisplay } from '@/src/components/challenge/TranscriptionDisplay';
import { EvaluationCard } from '@/src/components/evaluation/EvaluationCard';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';

type PageState = 'challenge' | 'recording' | 'preview' | 'submitting' | 'evaluation';

export default function ChallengePage() {
  const { user } = useAuth();
  const { data: challenge, isLoading } = useChallenge(user?.id);
  const { 
    isRecording, 
    audioBlob, 
    duration,
    startRecording, 
    stopRecording,
    resetRecording 
  } = useRecorder();

  const [pageState, setPageState] = useState<PageState>('challenge');
  const [transcription, setTranscription] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');

  // Check if already completed
  useEffect(() => {
    if (challenge?.status === 'completed') {
      setPageState('evaluation');
      // Fetch existing evaluation
      fetchEvaluation(challenge.id);
    }
  }, [challenge]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setPageState('recording');
    } catch (err) {
      setError('Could not access microphone');
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setPageState('preview');
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setPageState('submitting');
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('userId', user!.id);
      formData.append('challengeId', challenge!.challenge.id);
      formData.append('day', user!.currentDay.toString());

      const response = await submitRecording(formData);
      
      setTranscription(response.transcription);
      setEvaluation(response.evaluation);
      setPageState('evaluation');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
      setPageState('preview');
    }
  };

  const handleRetry = () => {
    resetRecording();
    setPageState('challenge');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Challenge Display */}
      {pageState === 'challenge' && (
        <>
          <ChallengeCard 
            challenge={challenge?.challenge}
            day={user?.currentDay}
          />
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={handleStartRecording}
            >
              🎤 Start Recording
            </Button>
          </div>
        </>
      )}

      {/* Recording State */}
      {pageState === 'recording' && (
        <div className="text-center">
          <AudioRecorder 
            isRecording={isRecording}
            duration={duration}
          />
          <RecordingControls 
            isRecording={isRecording}
            onStop={handleStopRecording}
          />
        </div>
      )}

      {/* Preview & Submit */}
      {pageState === 'preview' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Review Your Recording</h2>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <audio 
              src={URL.createObjectURL(audioBlob!)} 
              controls 
              className="w-full mb-4"
            />
            <p className="text-gray-600">Duration: {duration}s</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleRetry}
              variant="outline"
              className="flex-1"
            >
              Re-record
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1"
            >
              Submit for Evaluation
            </Button>
          </div>
        </div>
      )}

      {/* Submitting State */}
      {pageState === 'submitting' && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold mt-6 mb-2">
            AI is Evaluating Your Speech...
          </h2>
          <p className="text-gray-600">
            This usually takes 10-15 seconds
          </p>
        </div>
      )}

      {/* Evaluation Results */}
      {pageState === 'evaluation' && evaluation && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Your Results - Day {user?.currentDay}
          </h2>

          <EvaluationCard evaluation={evaluation} />

          {transcription && (
            <TranscriptionDisplay transcription={transcription} />
          )}

          <div className="mt-8 text-center">
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}