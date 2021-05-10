import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {Observable, throwError} from 'rxjs';
import {Notification} from '../models/Notification';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient, private us: UserBasicAuthService) {
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
    console.log('TOKEN: ' + this.us.getToken());
    return {
      headers: new HttpHeaders({
        authorization: 'Bearer ' + this.us.getToken(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      }),
      params: new HttpParams({fromObject: params})
    };
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.us.url + '/v1/notifications', this.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }
}
