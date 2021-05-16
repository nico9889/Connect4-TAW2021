import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserBasicAuthService} from './user-basic-auth.service';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Message} from '../models/Message';
import {Status} from '../models/Status';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

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

  getUserChat(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(this.us.url + '/v1/messages/' + id, this.us.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  sendUserChat(content: string, receiver: string): Observable<Status> {
    return this.http.post<Status>(this.us.url + '/v1/messages/' + receiver, {message: {content}}, this.us.createOptions({})).pipe(
      tap((data) => console.log(JSON.stringify(data))),
      catchError((error) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }
}
