import { Injectable, computed, inject, signal } from '@angular/core';
 import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStatus } from '../interfaces/auth-status.enum';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { LoginResponse } from '../interfaces/login-response.interface';
import { User } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = BASE_URL;
  private http = inject( HttpClient );
  private user = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Valores publicos
  public sucursalId = computed( () => this.user()?.sucursalId );
  public numeracionPrefId = computed( () => this.user()?.numPrefId );
  public currentUser = computed( () => this.user() );
  public authStatus = computed( () => this._authStatus() );
  constructor() {

    this.checkAuthStatus().subscribe();

  }

  private setAuthentication(user: User, token:string): boolean {

    this.user.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }


  login(username: string, password: string, recordar: boolean = false): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    console.log('login2')

    // Remove token on login attempt
    localStorage.removeItem('token');

    if (recordar) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }


    return this.http.post<LoginResponse>(url, {
      username,       password,
    }).pipe(
      map((response) => {
        const decode = response.token.split('.');
        const payload = JSON.parse(window.atob(decode[1]));
        this.setAuthentication(payload.user, response.token);
        return true;
      }),
      catchError((err) => {
        // Handle different types of errors appropriately
        console.error(err)
        if (err.error && err.error.message) {
          return throwError(() => err.error.message);
        } else {
          return throwError(() => 'An unknown error occurred during login.');
        }
      })
    );
  }
  checkAuthStatus():Observable<boolean> {
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

      return this.http.get<CheckTokenResponse>(this.baseUrl + '/auth/renew')
      .pipe(
        map((response) => {
          const decode = response.token.split('.');
          const payload = JSON.parse(window.atob(decode[1]));
          this.setAuthentication(payload.user, response.token);
          return true;
        }),
        catchError((err) => {
          this._authStatus.set( AuthStatus.notAuthenticated );
          console.log(err)
          return of(false);
        })
      );


  }



  logout() {
    localStorage.removeItem('token');
    this.user.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }


}
