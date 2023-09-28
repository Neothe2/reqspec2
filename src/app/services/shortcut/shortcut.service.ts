import { Injectable } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {
  private shortcutSubject: Subject<string> = new Subject();
  public shortcut$: Observable<string> = this.shortcutSubject.asObservable();

  constructor() {
    fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event) => {
      event.stopPropagation();
      this.handleKeyEvent(event);
    });
  }

  private handleKeyEvent(event: KeyboardEvent): void {
    let keyInfo = '';
    if (event.altKey || event.ctrlKey) {
      if (event.key != 'Control' && event.key != 'Alt') {
        if (event.ctrlKey) {
          keyInfo += 'Ctrl ';
        }
        if (event.altKey) {
          keyInfo += 'Alt ';
        }

        keyInfo += event.key;
        this.shortcutSubject.next(keyInfo);
      }
    }
  }
}
