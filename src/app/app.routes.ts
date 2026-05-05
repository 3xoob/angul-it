import { Routes } from '@angular/router';
import { challengeGuard } from './core/guards/challenge.guard';
import { resultGuard } from './core/guards/result.guard';
import { CaptchaComponent } from './pages/captcha/captcha.component';
import { HomeComponent } from './pages/home/home.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Angul-It' },
  { path: 'captcha', component: CaptchaComponent, canActivate: [challengeGuard], title: 'Challenge | Angul-It' },
  { path: 'result', component: ResultComponent, canActivate: [resultGuard], title: 'Result | Angul-It' },
  { path: '**', redirectTo: '' },
];
