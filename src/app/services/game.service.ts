import {Injectable} from '@angular/core';
import {Notification} from '../models/Notification';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {Game} from '../models/Game';
import {GameInfo} from '../models/GameInfo';
import {Status} from '../models/Status';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private us: UserBasicAuthService, private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        'body was: ' + JSON.stringify(error.error));
    }
    return throwError('Something bad happened; please try again later.');
  }

  // tslint:disable-next-line:typedef
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

  respondGameRequest(notification: Notification, accept: boolean): Observable<Game> {
    return this.http.put<Game>(this.us.url + '/v1/game/invite', {notification, accept}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getGameInfo(id: string): Observable<GameInfo> {
    return this.http.get<GameInfo>(this.us.url + '/v1/game/' + id, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendMove(id: number, pos: number): Observable<GameInfo> {
    return this.http.put<GameInfo>(this.us.url + '/v1/game/' + id, {x: pos}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendSpectate(id: string, spectate: boolean): Observable<Status> {
    console.log(spectate);
    return this.http.put<Status>(this.us.url + '/v1/game/' + id + '/spectate', {follow: spectate}, this.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }
}
