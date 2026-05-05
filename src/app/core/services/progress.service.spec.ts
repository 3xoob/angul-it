import { TestBed } from '@angular/core/testing';
import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts and persists a new session', () => {
    const service = TestBed.inject(ProgressService);
    const progress = service.startSession(['a', 'b']);

    expect(progress.currentIndex).toBe(0);
    expect(progress.challengeIds).toEqual(['a', 'b']);
    expect(localStorage.getItem('angul-it-progress')).toContain(progress.sessionId);
  });

  it('tracks attempts and completes the final challenge', () => {
    const service = TestBed.inject(ProgressService);

    service.startSession(['first']);
    service.recordAttempt('first');
    const progress = service.completeChallenge('first', 'answer');

    expect(progress?.attempts['first']).toBe(1);
    expect(progress?.completedAt).toBeTruthy();
    expect(service.isComplete()).toBe(true);
  });

  it('clears persisted progress on restart', () => {
    const service = TestBed.inject(ProgressService);

    service.startSession(['first']);
    service.restart();

    expect(service.progress()).toBeNull();
    expect(localStorage.getItem('angul-it-progress')).toBeNull();
  });
});
