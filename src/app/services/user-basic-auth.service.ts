import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import jwtDecode from 'jwt-decode';

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
export class UserBasicAuthService {
  private token = '';
  public url = 'http://192.168.1.119:8080';

  @Output() logged = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
    console.log('User service instantiated');

    this.token = localStorage.getItem('connect4_874273_token');
    if (!this.token || this.token.length < 1) {
      console.log('No token found in local storage');
      this.token = '';
    } else {
      console.log('JWT loaded from local storage.');
    }
  }

  // tslint:disable-next-line: typedef
  public createOptions(params = {}) {
    return {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.getToken(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({fromObject: params})
    };
  }

  login(username: string, password: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        authorization: 'Basic ' + btoa(username + ':' + password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    return this.http.get(this.url + '/v1/login', options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
        this.token = data.token;
        localStorage.setItem('connect4_874273_token', this.token);
        this.logged.emit(true);
      }));
  }

  logout(): void {
    console.log('Logging out');
    this.token = '';
    localStorage.setItem('connect4_874273_token', this.token);
    this.logged.emit(false);
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };

    this.http.get(this.url + '/v1/logout', options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      }));
  }

  register(user): Observable<any> {
    const options = (user.moderator) ? this.createOptions() : {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    const endpoint = (user.moderator) ? '/v1/moderator/register' : '/v1/register';

    return this.http.post(this.url + endpoint, user, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data));
      })
    );
  }

  isLoggedIn(): boolean {
    return this.token !== '' && this.isTokenExpired();
  }

  getToken(): string {
    return this.token;
  }

  isTokenExpired(): boolean {
    if (this.token !== '') {
      return ((jwtDecode(this.token) as TokenData).exp * 1000) > Date.now();
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

  enabled(): boolean {
    return !this.hasRole('MODERATOR') ||
      (jwtDecode(this.token) as TokenData).last_password_change !== (jwtDecode(this.token) as TokenData).registered_on;
  }
}
