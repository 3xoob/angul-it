import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let fixture: ComponentFixture<ResultComponent>;
  let component: ResultComponent;
  let progressService: ProgressService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ResultComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    progressService = TestBed.inject(ProgressService);
    progressService.startSession(['math-signal']);
    progressService.recordAttempt('math-signal');
    progressService.completeChallenge('math-signal', 11);
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('summarizes total attempts', () => {
    expect(component.totalAttempts()).toBe(1);
  });

  it('restarts and returns to home', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    component.restart();

    expect(progressService.progress()).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
