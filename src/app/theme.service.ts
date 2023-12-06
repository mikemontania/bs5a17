// theme.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);

  toggleTheme() {
    this.isDarkThemeSubject.next(!this.isDarkThemeSubject.value);
  }

  getCurrentTheme(): Observable<boolean> {
    return this.isDarkThemeSubject.asObservable();
  }
}
