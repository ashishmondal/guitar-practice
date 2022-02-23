import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StopwatchComponent implements OnInit {
  @Input()
  play = false;
  counter = 0;

  clock$ = timer(0, 1000).pipe(
    map(_ => this.play ? this.counter++ : this.counter),
    map(sec => `${padZero(((sec / 60) | 0) % 60)}:${padZero(sec % 60)}`));
  constructor() { }

  ngOnInit(): void {
  }

  onPlayPause() {
    this.play = !this.play;
  }

}

function padZero(n: number) {
  return n < 10 ? '0' + n : n;
}
