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

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Valores publicos
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );


  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token:string): boolean {

    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);

    return true;
  }




  login( email: string, password: string ): Observable<boolean> {

    const url  = `${ this.baseUrl }/login/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  checkAuthStatus():Observable<boolean> {

    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);


      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ user, token }) => this.setAuthentication( user, token )),
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );


  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }


}
