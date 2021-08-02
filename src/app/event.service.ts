import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private _navigationDenied = new Subject<string[]>();
  private _scrollY = new Subject<number>();

  constructor() {
    fromEvent(window, 'vopNavigationDeniedNotification')
      .subscribe((e: CustomEvent) => this._navigationDenied.next(e.detail));
    fromEvent(window, 'scroll')
      .subscribe(() => this._scrollY.next(window.scrollY));
  }

  get navigationDenied(): Observable<string[]> {
    return this._navigationDenied.asObservable();
  }

  get scrollY(): Observable<number> {
    return this._scrollY.asObservable();
  }
}
