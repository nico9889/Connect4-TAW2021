import {Injectable} from '@angular/core';
import {Notification} from '../models/Notification';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {Game} from '../models/Game';
import {GameInfo} from '../models/GameInfo';
import {Status} from '../models/Status';
import {Message} from "../models/Message";
import {Spectator} from "../models/Spectator";

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

  respondGameRequest(notification: Notification, accept: boolean): Observable<Game> {
    return this.http.put<Game>(this.us.url + '/v1/game/invite', {notification, accept}, this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getGameInfo(id: string): Observable<GameInfo> {
    return this.http.get<GameInfo>(this.us.url + '/v1/game/' + id, this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendMove(id: number, pos: number): Observable<GameInfo> {
    return this.http.put<GameInfo>(this.us.url + '/v1/game/' + id, {x: pos}, this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendSpectate(id: string, spectate: boolean): Observable<Status> {
    console.log(spectate);
    return this.http.put<Status>(this.us.url + '/v1/game/' + id + '/spectate', {follow: spectate}, this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendMessage(id: string, message: string): Observable<Status>{
    return this.http.post<Status>(this.us.url + '/v1/game/' + id + '/messages', {message}, this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getMessage(id: string): Observable<Message[]>{
    return this.http.get<Message[]>(this.us.url + '/v1/game/' + id + '/messages', this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  getUsers(id: string): Observable<Spectator[]>{
    return this.http.get<Spectator[]>(this.us.url + '/v1/game/' + id + '/users', this.us.createOptions({})).pipe(
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }
}
