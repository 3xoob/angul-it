export interface CaptchaProgress {
  sessionId: string;
  challengeIds: string[];
  currentIndex: number;
  completedChallengeIds: string[];
  answers: Record<string, unknown>;
  attempts: Record<string, number>;
  startedAt: string;
  completedAt?: string;
}
