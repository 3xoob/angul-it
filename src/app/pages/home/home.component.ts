import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CaptchaService } from '../../core/services/captcha.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly captchaService = inject(CaptchaService);
  private readonly progressService = inject(ProgressService);
  private readonly router = inject(Router);

  readonly progress = this.progressService.progress;
  readonly hasActiveSession = computed(() => Boolean(this.progress() && !this.progressService.isComplete()));
  readonly isComplete = computed(() => this.progressService.isComplete());

  startChallenge(): void {
    this.progressService.startSession(this.captchaService.createChallengeIds());
    void this.router.navigate(['/captcha']);
  }

  resetAndStart(): void {
    this.progressService.restart();
    this.startChallenge();
  }
}
