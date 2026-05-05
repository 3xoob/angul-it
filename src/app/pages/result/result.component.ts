import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CaptchaService } from '../../core/services/captcha.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-result',
  imports: [DatePipe],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  private readonly captchaService = inject(CaptchaService);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  readonly progress = this.progressService.progress;
  readonly challenges = computed(() => this.captchaService.getChallenges(this.progress()?.challengeIds ?? []));
  readonly totalAttempts = computed(() => Object.values(this.progress()?.attempts ?? {}).reduce((sum, value) => sum + value, 0));
  readonly elapsedSeconds = computed(() => {
    const progress = this.progress();

    if (!progress?.completedAt) {
      return 0;
    }

    return Math.max(0, Math.round((Date.parse(progress.completedAt) - Date.parse(progress.startedAt)) / 1000));
  });

  restart(): void {
    this.progressService.restart();
    void this.router.navigate(['/']);
  }

  attemptsFor(challengeId: string): number {
    return this.progress()?.attempts[challengeId] ?? 0;
  }
}
