import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { challengeGuard } from './challenge.guard';
import { resultGuard } from './result.guard';
import { ProgressService } from '../services/progress.service';

describe('route guards', () => {
  let progressService: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    progressService = TestBed.inject(ProgressService);
  });

  it('redirects away from challenge without a session', () => {
    const result = TestBed.runInInjectionContext(() => challengeGuard({} as never, {} as never));

    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/');
  });

  it('blocks result until the session is complete', () => {
    progressService.startSession(['first']);

    const result = TestBed.runInInjectionContext(() => resultGuard({} as never, {} as never));

    expect(result instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/captcha');
  });

  it('allows result after completion', () => {
    progressService.startSession(['first']);
    progressService.completeChallenge('first', 'answer');

    const result = TestBed.runInInjectionContext(() => resultGuard({} as never, {} as never));

    expect(result).toBe(true);
  });
});
