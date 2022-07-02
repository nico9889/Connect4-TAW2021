import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import jwtDecode from 'jwt-decode';
import {baseUrl} from '../../constants';

interface TokenData {
  username: string;
  roles: string[];
  id: string;
  enabled: boolean;
  last_password_change: Date;
  registered_on: Date;
  exp: number;
}


@Injectable()
export class AuthService {
  private token = '';

  @Output() logged = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    console.log('User service instantiated');

    this.token = localStorage.getItem('connect4_874273_token') || '';
    if (!this.token || this.token.length < 1) {
      console.log('No token found in local storage');
      this.token = '';
    } else {
      console.log('JWT loaded from local storage.');
    }
  }

  login(username: string, password: string): Observable<{error: boolean, message: string, token: string}> {
    this.token = '';
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(username + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    return this.http.get<{error: boolean, message: string, token: string}> (baseUrl + '/v1/login', options).pipe(
      tap((data) => {
        this.token = data.token;
        localStorage.setItem('connect4_874273_token', this.token);
        this.logged.emit(true);
      }));
  }

  logout(): void {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('connect4_874273_token', this.token);
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.get(baseUrl + '/v1/logout', options).pipe(
      tap((data) => {
        this.logged.emit(false);
        console.log(JSON.stringify(data));
      }));
  }

  register(user: { username: string, password: string, moderator: boolean }): Observable<any> {
    const endpoint = (user.moderator) ? '/v1/moderator/register' : '/v1/register';

    return this.http.post(baseUrl + endpoint, user).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );
  }

  isLoggedIn(): boolean {
    return this.token !== '' && !this.isTokenExpired();
  }

  getToken(): string {
    return this.token;
  }

  isTokenExpired(): boolean {
    if (this.token !== '') {
      return new Date(((jwtDecode(this.token) as TokenData).exp * 1000)) < new Date();
    }else{
      return false;
    }
  }

  getUsername(): string {
    if (this.isLoggedIn()) {
      return (jwtDecode(this.token) as TokenData).username;
    } else {
      return '';
    }
  }

  getId(): string {
    if (this.isLoggedIn()) {
      return (jwtDecode(this.token) as TokenData).id;
    } else {
      return '';
    }
  }

  hasRole(role: string): boolean {
    if (this.isLoggedIn()) {
      return (jwtDecode(this.token) as TokenData).roles.includes(role);
    } else {
      return false;
    }
  }

  isEnabled(): boolean {
    return !this.hasRole('MODERATOR') ||
      (jwtDecode(this.token) as TokenData).last_password_change !== (jwtDecode(this.token) as TokenData).registered_on;
  }
}
