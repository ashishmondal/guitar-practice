import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Subject } from 'rxjs';

import { Exercise, Lesson } from './lesson.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  tempo$ = new Subject<number>();
  time$ = new Subject<string>();

  selectedExercise$ = new Subject<string>();

  session$ = this.http.get<Lesson[]>('https://gist.githubusercontent.com/ashishmondal/29f26261e786c3703833ea791cfb633a/raw/guitar-session.json');

  constructor(private http: HttpClient) {

  }

  onExerciseSelect(lesson: Lesson, exercise: Exercise) {
    this.tempo$.next(exercise.tempo);
    this.time$.next(exercise.time);
    this.selectedExercise$.next(exercise.name);
  }
}
