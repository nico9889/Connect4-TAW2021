import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LeaderboardUser, User} from '../models/User';
import {Notification} from '../models/Notification';
import {Status} from '../models/Status';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {
  avatars: Map<string, string> = new Map();

  constructor(private http: HttpClient, private us: UserBasicAuthService) {
    console.log('User service instantiated');
  }

  private static handleError(error: HttpErrorResponse): Observable<never> {
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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.us.url + '/v1/users', this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.us.url + '/v1/users/' + id, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  getAvatar(id: string, force?: boolean): void {
    if (!this.avatars.has(id) || force) {
      this.http.get<{ avatar: string }>(this.us.url + '/v1/users/' + id + '/avatar', this.us.createOptions()).pipe(
        tap((data) => {
          this.avatars.set(id, data.avatar);
        }),
        catchError((error) => {
          UserHttpService.handleError(error);
          return throwError(error);
        })
      ).subscribe();
    }
  }

  editUser(id: string, data: { username?: string, enabled?: boolean, newPassword?: string, oldPassword?: string }): Observable<Status> {
    return this.http.put<Status>(this.us.url + '/v1/users/' + id, data, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  getLeaderboard(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(this.us.url + '/v1/leaderboard', this.us.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  sendFriendRequest(username: string): Observable<Status> {
    return this.http.post<Status>(this.us.url + '/v1/friendship/', {
      username,
      request: true
    }, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  respondFriendRequest(notification: Notification, accept: boolean): Observable<Status> {
    return this.http.put<Status>(this.us.url + '/v1/friendship/', {
      notification,
      accept
    }, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  sendGameRequest(id: string): Observable<Status> {
    return this.http.post<Status>(this.us.url + '/v1/game/invite/', {
      id,
      request: true
    }, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(this.us.url + '/v1/friendship/', this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  getFriend(id: string): Observable<User> {
    return this.http.get<User>(this.us.url + '/v1/friendship/' + id, this.us.createOptions({})).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }

  updateAvatar(id: string, avatar: File): Observable<Status> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const headers = new HttpHeaders({
      authorization: 'Bearer ' + this.us.getToken()
    });

    return this.http.post<Status>(this.us.url + '/v1/users/' + id + '/avatar', formData, {headers}).pipe(
      catchError((error) => {
        UserHttpService.handleError(error);
        return throwError(error);
      })
    );
  }
}
