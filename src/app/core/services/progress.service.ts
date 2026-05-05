import { Injectable, signal } from '@angular/core';
import { CaptchaProgress } from '../models/progress.model';

const STORAGE_KEY = 'angul-it-progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly progress = signal<CaptchaProgress | null>(this.readProgress());

  startSession(challengeIds: string[]): CaptchaProgress {
    const progress: CaptchaProgress = {
      sessionId: this.createSessionId(),
      challengeIds,
      currentIndex: 0,
      completedChallengeIds: [],
      answers: {},
      attempts: {},
      startedAt: new Date().toISOString(),
    };

    this.save(progress);
    return progress;
  }

  recordAttempt(challengeId: string): void {
    const progress = this.progress();

    if (!progress) {
      return;
    }

    this.save({
      ...progress,
      attempts: {
        ...progress.attempts,
        [challengeId]: (progress.attempts[challengeId] ?? 0) + 1,
      },
    });
  }

  completeChallenge(challengeId: string, answer: unknown): CaptchaProgress | null {
    const progress = this.progress();

    if (!progress) {
      return null;
    }

    const completedChallengeIds = progress.completedChallengeIds.includes(challengeId)
      ? progress.completedChallengeIds
      : [...progress.completedChallengeIds, challengeId];
    const isFinal = completedChallengeIds.length >= progress.challengeIds.length;

    const updated: CaptchaProgress = {
      ...progress,
      currentIndex: isFinal ? progress.currentIndex : Math.min(progress.currentIndex + 1, progress.challengeIds.length - 1),
      completedChallengeIds,
      answers: {
        ...progress.answers,
        [challengeId]: answer,
      },
      completedAt: isFinal ? new Date().toISOString() : progress.completedAt,
    };

    this.save(updated);
    return updated;
  }

  moveTo(index: number): void {
    const progress = this.progress();

    if (!progress) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(index, progress.challengeIds.length - 1));
    this.save({ ...progress, currentIndex: boundedIndex });
  }

  restart(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.progress.set(null);
  }

  isComplete(): boolean {
    const progress = this.progress();
    return Boolean(progress?.completedAt && progress.completedChallengeIds.length >= progress.challengeIds.length);
  }

  private save(progress: CaptchaProgress): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    this.progress.set(progress);
  }

  private readProgress(): CaptchaProgress | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value ? (JSON.parse(value) as CaptchaProgress) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private createSessionId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
