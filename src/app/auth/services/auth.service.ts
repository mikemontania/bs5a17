import { Injectable, computed, inject, signal } from '@angular/core';
 import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStatus } from '../interfaces/auth-status.enum';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { LoginResponse } from '../interfaces/login-response.interface';
import { User } from '../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../config';
import { Router  } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = BASE_URL;
  private http = inject( HttpClient );
  private router = inject( Router );
  public _token = signal<string|null>(null);
  private user = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Valores publicos
  public currentUser = computed( () => this.user() );
  public authStatus = computed( () => this._authStatus() );
  public token = computed( () => this._token() );

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



  cargarStorage() {
    localStorage.getItem('token')? this._token.set(localStorage.getItem('token')):null ;
    localStorage.getItem('user')? this.user.set(JSON.parse((localStorage.getItem('user')!))):null ;
  }

  login(email: string, password: string, recordar: boolean = false): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    console.log('login2')

    // Remove token on login attempt
    localStorage.removeItem('token');

    if (recordar) {
      localStorage.setItem('username', email);
    } else {
      localStorage.removeItem('username');
    }

    const body = JSON.stringify({
      username: email,
      password: password,
    });

    return this.http.post<LoginResponse>(url, body).pipe(
      map((response) => {
        const decode = response.token.split('.');
        this.setAuthentication(JSON.parse(window.atob(decode[1])), response.token);
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

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }




      return this.http.get<CheckTokenResponse>(this.baseUrl + 'auth/token')
      .pipe(
        map((response: any) => {
        const decode = response.token.split('.');
        this.setAuthentication(JSON.parse(window.atob(decode[1])), response.token);
          console.log('tokenRenovado:');
          return true;
        }),

        catchError((err) => {
          // Handle different types of errors appropriately
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
