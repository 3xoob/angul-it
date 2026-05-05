import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-meter',
  imports: [DecimalPipe],
  templateUrl: './progress-meter.html',
  styleUrl: './progress-meter.scss',
})
export class ProgressMeter {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
}
