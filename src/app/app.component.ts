import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Exercise, Lesson } from './lesson.model';
import { LessonService } from './lesson.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  tempo$ = new Subject<number>();
  time$ = new Subject<string>();

  selectedExercise$ = new BehaviorSubject<string>('');

  lessons$ = this.lessonService.lessons$;
  url$ = this.lessonService.url$;

  _currentExercise?: Exercise;

  constructor(private http: HttpClient, private lessonService: LessonService) {

  }

  trackLesson(_index: number, lesson: Lesson) {
    return lesson.id;
  }

  ngOnInit() {
    this.lessonService.loadFromStorage();
  }

  onExerciseSelect(lesson: Lesson, exercise: Exercise) {
    this.tempo$.next(exercise.tempo);
    this.time$.next(exercise.time);
    this.selectedExercise$.next(exercise.id);

    this._currentExercise = exercise;
  }

  onTempoChange(tempo: number) {
    if (!this._currentExercise) {
      return;
    }

    this._currentExercise.tempo = tempo;
    this.lessonService.save();
  }

  onLoadFromUrl(url: string) {
    this.lessonService.loadFromUrl(url);
  }
}
