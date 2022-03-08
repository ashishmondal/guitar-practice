import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

import { Exercise, Lesson } from './lesson.model';
import { LessonService } from './lesson.service';
import { TurnsCalculatorService } from './turns-calculator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  date = new Date().toLocaleDateString();

  tempo$ = new Subject<number>();
  time$ = new Subject<string>();

  selectedExercise$ = new BehaviorSubject<string>('');

  lessons$ = this.lessonService.lessons$;
  url$ = this.lessonService.url$;

  _currentExercise?: Exercise;

  constructor(
    private lessonService: LessonService,
    private turnsCalculator: TurnsCalculatorService,
    private snackBar: MatSnackBar
  ) {

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
    this.turnsCalculator.reSeed();
    this.lessonService.loadFromUrl(url);
  }

  onCopyToClipboard() {
    this.lessonService.copyToClipboard()
      .then(_ => this.snackBar.open('Session copied successfully!', 'OK'))
      .catch(_ => this.snackBar.open('Error copying session.', 'OK'))
  }
}
