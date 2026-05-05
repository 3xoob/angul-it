import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProgressService } from '../services/progress.service';

export const challengeGuard: CanActivateFn = () => {
  const progressService = inject(ProgressService);
  const router = inject(Router);
  const progress = progressService.progress();

  if (!progress) {
    return router.createUrlTree(['/']);
  }

  if (progressService.isComplete()) {
    return router.createUrlTree(['/result']);
  }

  return true;
};
