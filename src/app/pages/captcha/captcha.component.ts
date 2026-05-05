import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CaptchaChallenge } from '../../core/models/captcha.model';
import { CaptchaService } from '../../core/services/captcha.service';
import { ProgressService } from '../../core/services/progress.service';
import { ProgressMeter } from '../../shared/progress-meter/progress-meter';

const MAX_FAILED_ATTEMPTS = 3;

@Component({
  selector: 'app-captcha',
  imports: [ProgressMeter, ReactiveFormsModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
})
export class CaptchaComponent {
  private readonly captchaService = inject(CaptchaService);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  readonly textControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly selectedIds = signal<string[]>([]);
  readonly error = signal('');

  readonly progress = this.progressService.progress;
  readonly challenges = computed(() => this.captchaService.getChallenges(this.progress()?.challengeIds ?? []));
  readonly currentChallenge = computed(() => this.challenges()[this.progress()?.currentIndex ?? 0]);
  readonly currentPosition = computed(() => (this.progress()?.currentIndex ?? 0) + 1);
  readonly attemptsRemaining = computed(() => Math.max(0, MAX_FAILED_ATTEMPTS - this.attemptsForCurrentChallenge()));
  readonly isLocked = computed(() => this.attemptsRemaining() === 0);
  readonly total = computed(() => this.challenges().length);

  constructor() {
    effect(() => {
      const challenge = this.currentChallenge();
      const progress = this.progress();

      this.error.set('');
      this.textControl.reset('');
      this.selectedIds.set([]);

      if (!challenge || !progress) {
        return;
      }

      const savedAnswer = progress.answers[challenge.id];

      if (Array.isArray(savedAnswer)) {
        this.selectedIds.set(savedAnswer.map(String));
      } else if (typeof savedAnswer === 'string' || typeof savedAnswer === 'number') {
        if (challenge.type === 'single-choice') {
          this.selectedIds.set([String(savedAnswer)]);
        } else {
          this.textControl.setValue(String(savedAnswer));
        }
      }
    });
  }

  toggleOption(optionId: string): void {
    const challenge = this.currentChallenge();

    if (!challenge) {
      return;
    }

    this.error.set('');

    if (challenge.type === 'single-choice') {
      this.selectedIds.set([optionId]);
      return;
    }

    const selected = this.selectedIds();
    this.selectedIds.set(selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId]);
  }

  previous(): void {
    this.progressService.moveTo((this.progress()?.currentIndex ?? 0) - 1);
  }

  submit(): void {
    const challenge = this.currentChallenge();

    if (!challenge) {
      return;
    }

    if (this.isLocked()) {
      this.error.set('This stage is locked after 3 failed attempts. Restart to receive a new session.');
      return;
    }

    const answer = this.answerFor(challenge);

    if (this.isEmptyAnswer(answer)) {
      this.error.set('Complete this check before continuing.');
      this.textControl.markAsTouched();
      return;
    }

    this.progressService.recordAttempt(challenge.id);

    if (!this.captchaService.validateAnswer(challenge, answer)) {
      const remaining = Math.max(0, this.attemptsRemaining());
      this.error.set(
        remaining === 0
          ? 'This stage is locked after 3 failed attempts. Restart to receive a new session.'
          : `That does not pass validation. ${remaining} ${remaining === 1 ? 'try' : 'tries'} remaining.`,
      );
      return;
    }

    const progress = this.progressService.completeChallenge(challenge.id, answer);

    if (progress?.completedAt) {
      void this.router.navigate(['/result']);
    }
  }

  isSelected(optionId: string): boolean {
    return this.selectedIds().includes(optionId);
  }

  restart(): void {
    this.progressService.restart();
    void this.router.navigate(['/']);
  }

  private attemptsForCurrentChallenge(): number {
    const challenge = this.currentChallenge();

    if (!challenge) {
      return 0;
    }

    return this.progress()?.attempts[challenge.id] ?? 0;
  }

  private answerFor(challenge: CaptchaChallenge): string | number | string[] {
    if (challenge.type === 'image-select') {
      return this.selectedIds();
    }

    if (challenge.type === 'single-choice') {
      return this.selectedIds()[0] ?? '';
    }

    if (challenge.type === 'math') {
      const value = this.textControl.value.trim();
      return value ? Number(value) : Number.NaN;
    }

    return this.textControl.value.trim();
  }

  private isEmptyAnswer(answer: string | number | string[]): boolean {
    if (Array.isArray(answer)) {
      return answer.length === 0;
    }

    if (typeof answer === 'number') {
      return Number.isNaN(answer);
    }

    return answer.length === 0;
  }
}
