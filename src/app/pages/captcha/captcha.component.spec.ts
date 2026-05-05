import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CaptchaService } from '../../core/services/captcha.service';
import { ProgressService } from '../../core/services/progress.service';
import { CaptchaComponent } from './captcha.component';

describe('CaptchaComponent', () => {
  let fixture: ComponentFixture<CaptchaComponent>;
  let component: CaptchaComponent;
  let progressService: ProgressService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CaptchaComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    progressService = TestBed.inject(ProgressService);
    progressService.startSession(['math-signal']);
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows an error when submitted without input', () => {
    component.submit();

    expect(component.error()).toContain('Complete this check');
  });

  it('records an attempt when an answer fails validation', () => {
    component.textControl.setValue('12');
    component.submit();

    expect(progressService.progress()?.attempts['math-signal']).toBe(1);
    expect(component.error()).toContain('2 tries remaining');
  });

  it('locks the stage after 3 failed attempts', () => {
    component.textControl.setValue('12');
    component.submit();
    component.submit();
    component.submit();

    expect(component.isLocked()).toBe(true);
    expect(component.error()).toContain('locked after 3 failed attempts');
    expect(progressService.progress()?.currentIndex).toBe(0);
  });

  it('navigates to result when the final answer is valid', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.textControl.setValue('11');
    component.submit();

    expect(TestBed.inject(CaptchaService).validateAnswer(component.currentChallenge()!, 11)).toBe(true);
    expect(progressService.isComplete()).toBe(true);
    expect(navigate).toHaveBeenCalledWith(['/result']);
  });
});
