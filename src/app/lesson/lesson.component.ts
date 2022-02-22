import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Exercise, Lesson } from '../lesson.model';
import { ExerciseList, TurnsCalculatorService } from '../turns-calculator.service';

export interface Practice extends Exercise {
  turns: number;
}

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonComponent implements OnInit {

  private _lesson?: Lesson;

  @Output() exerciseSelect = new EventEmitter<Exercise>();

  @Input() selectedExercise = '';

  @Input()
  set lesson(value: Lesson | undefined) {
    if (value) {
      this._lesson = value;

      const list = value.exercises!
        .reduce((l, c) => ({ ...l, [c.name]: c.confidence }),
          {} as ExerciseList)
      const toPlay = this.turnsCalculator.getTurns(list, value.count, value.repeat);

      this.practiceItems = Object.keys(toPlay)
        .map(n => ({
          ...value.exercises!.find(e => e.name === n)!,
          turns: toPlay[n]
        }))
    }
  }

  get lesson() {
    return this._lesson;
  }

  trackExercise(_index: number, exercise: Exercise) {
    return exercise.id;
  }

  practiceItems: Practice[] = [];

  constructor(private turnsCalculator: TurnsCalculatorService) {

  }

  ngOnInit(): void {
  }

  onPracticeSelect(practice: Practice) {
    this.exerciseSelect.emit(this.lesson?.exercises!.find(e => e.name === practice.name));
  }
}
