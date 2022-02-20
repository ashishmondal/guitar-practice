import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { combineLatest, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const times: { [key: string]: number } = {
  '1/1': 1,
  '2/4': 2,
  '3/4': 3,
  '4/4': 4,
  '6/8': 6,
  '1/8': 8,
  '1/16': 16
}

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetronomeComponent implements OnInit {

  tempo$ = new Subject<number>();
  time$ = new Subject<string>();
  viz$ = new Subject<number[]>();
  play = false;

  initialized = false;

  noteA?: Howl;
  noteB?: Howl;

  @Input()
  set tempo(value: number) {
    this.tempo$.next(+value);
  }

  @Input()
  set time(value: string) {
    this.time$.next(value);
  }

  constructor() { }

  ngOnInit(): void {
    combineLatest(
      this.tempo$.pipe(switchMap(tempo => timer(0, (1000 / tempo) * 60))),
      this.time$.pipe(map(t => times[t]))
    ).subscribe(([tick, time]) => {

      const viz: number[] = new Array(time).fill(0);

      if (!this.play || !this.noteA || !this.noteB) {
        this.viz$.next(viz);
        return;
      }

      if (tick % time) {
        this.noteB.play();
      } else {
        this.noteA.play();
      }

      viz[tick % time] = 1;
      this.viz$.next(viz);
    });
  }

  getVizColor(index: number, value: number) {
    return value === 0 ? 'gray' :
      index === 0 ? 'green' : 'yellow';
  }

  onPlayPause() {

    if (!this.initialized) {
      // https://www.fesliyanstudios.com/royalty-free-sound-effects-download/drum-sticks-278
      this.noteA = new Howl({ src: ['assets/Drum-Sticks-Hit-B.mp3'] });
      this.noteB = new Howl({ src: ['assets/Drum-Sticks-Hit-C.mp3'] });

      this.initialized = true;
    }

    this.play = !this.play;
  }
}
