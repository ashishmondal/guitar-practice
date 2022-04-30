import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';

import { Exercise, Lesson } from './lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  lessons$ = new BehaviorSubject<Lesson[]>([]);
  url$ = new BehaviorSubject<string>('');

  save$ = new Subject();

  constructor(private http: HttpClient) {
    this.save$.pipe(
      switchMap(_ => combineLatest(
        this.url$.pipe(shareReplay(1)),
        this.lessons$.pipe(shareReplay(1))
      ))
    ).subscribe(([url, lessons]) => this.saveToStorage(url, lessons));
  }

  loadFromStorage() {
    this.url$.next(window.localStorage.getItem('url') ?? '');
    this.lessons$.next(JSON.parse(window.localStorage.getItem('lessons') ?? '[]') as Lesson[]);
  }

  saveToStorage(url: string, lessons: Lesson[]) {
    console.log('saving...');
    window.localStorage.setItem('url', url);
    window.localStorage.setItem('lessons', JSON.stringify(lessons));
  }

  loadFromUrl(url: string) {
    return this.http.get<Lesson[]>(url).subscribe(lessons => {
      this.lessons$.next(this.attachId(lessons));
      this.url$.next(url);
      this.save$.next();
    });
  }

  save() {
    this.save$.next();
  }

  copyToClipboard() {
    const lessons = JSON.parse(window.localStorage.getItem('lessons') ?? '[]');

    const data = JSON.stringify(lessons, (key, value) => key === 'id' ? void 0: value, 2);

    return navigator.clipboard.writeText(data);
  }

  private attachId(lessons: Lesson[]) {
    let id = 0;

    lessons.forEach(lesson => {
      lesson.id = '' + ++id;
      lesson.exercises.forEach(ex => ex.id = '' + ++id);
    })

    return lessons;
  }

}
