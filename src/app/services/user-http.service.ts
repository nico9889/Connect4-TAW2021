import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LeaderboardUser, User} from '../models/User';
import {Notification} from '../models/Notification';
import {Status} from '../models/Status';
import {Friend} from '../models/Friend';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  constructor(private http: HttpClient, private us: UserBasicAuthService) {
    console.log('User service instantiated');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }
    return throwError('Something bad happened; please try again later.');
  }

  // tslint:disable-next-line: typedef
  private createOptions(params = {}) {
    return {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.getToken(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({fromObject: params})
    };

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.us.url + '/v1/users', this.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.us.url + '/v1/users/' + id, this.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  // tslint:disable-next-line:max-line-length
  editUser(id: string, data: { username?: string, enabled?: boolean, avatar?: string, newPassword?: string, oldPassword?: string }): Observable<Status> {
    return this.http.put<Status>(this.us.url + '/v1/users/' + id, data, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getLeaderboard(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(this.us.url + '/v1/leaderboard', this.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendFriendRequest(username: string): Observable<Status> {
    return this.http.post<Status>(this.us.url + '/v1/friendship/', {username, request: true}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  respondFriendRequest(notification: Notification, accept: boolean): Observable<Status> {
    return this.http.put<Status>(this.us.url + '/v1/friendship/', {notification, accept}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendGameRequest(id: string): Observable<Status> {
    return this.http.post<Status>(this.us.url + '/v1/game/invite/', {id, request: true}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getFriends(): Observable<Friend[]> {
    return this.http.get<Friend[]>(this.us.url + '/v1/friendship/', this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getFriend(id: string): Observable<Friend> {
    return this.http.get<Friend>(this.us.url + '/v1/friendship/' + id, this.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }
}
