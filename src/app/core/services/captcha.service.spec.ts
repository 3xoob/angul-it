import { TestBed } from '@angular/core/testing';
import { CaptchaService } from './captcha.service';

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptchaService);
  });

  it('creates one randomized challenge id for each challenge type', () => {
    const ids = service.createChallengeIds();
    const challenges = service.getChallenges(ids);

    expect(ids.length).toBe(4);
    expect(new Set(challenges.map((challenge) => challenge.type)).size).toBe(4);
  });

  it('validates image answers independent of selection order', () => {
    const challenge = service.getChallenge('image-cats');

    expect(challenge).toBeTruthy();
    expect(service.validateAnswer(challenge!, ['cat-moon', 'cat-sphinx', 'cat-tabby'])).toBe(true);
    expect(service.validateAnswer(challenge!, ['cat-moon'])).toBe(false);
  });

  it('validates text and math answers strictly', () => {
    expect(service.validateAnswer(service.getChallenge('text-checkpoint')!, 'ANGUL7')).toBe(true);
    expect(service.validateAnswer(service.getChallenge('text-checkpoint')!, 'angul7')).toBe(false);
    expect(service.validateAnswer(service.getChallenge('math-signal')!, 11)).toBe(true);
    expect(service.validateAnswer(service.getChallenge('math-signal')!, 12)).toBe(false);
  });
});
