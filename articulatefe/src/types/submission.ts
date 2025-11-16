export interface Submission {
  id: string
  userId: string
  challengeId: string
  day: number
  audioUrl: string
  transcription: string
  duration: number
  submittedAt: string
}
