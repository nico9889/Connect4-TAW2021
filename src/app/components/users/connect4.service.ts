import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {baseUrl} from '../../../costants';
import {GameInfo} from '../../models/game';
import {HttpClient} from '@angular/common/http';
import {Status} from '../../models/status';
import {Message} from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class Connect4Service {

  constructor(private http: HttpClient) {
  }

  getData(id: string): Observable<GameInfo> {
    return this.http.get<GameInfo>(baseUrl + '/v1/game/' + id);
  }

  sendData(id: number, pos: number): Observable<GameInfo> {
    return this.http.put<GameInfo>(baseUrl + '/v1/game/' + id, {x: pos});
  }

  spectate(id: string, spectate: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/spectate' + id + '/spectate', {follow: spectate});
  }

  sendMessage(id: string, message: string): Observable<Status> {
    return this.http.post<Status>(baseUrl + '/v1/game/' + id + '/messages', {message});
  }

  getMessage(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(baseUrl + '/v1/game/' + id + '/messages');
  }

  rankedSubscription(subscribe: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/ranked', {subscribe});
  }

  rankedSubscriptionStatus(): Observable<{ queued: boolean, inQueue: number }> {
    return this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/ranked');
  }

  scrimmageSubscription(subscribe: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/scrimmage', {subscribe});
  }

  scrimmageSubscriptionStatus(): Observable<{ queued: boolean, inQueue: number }> {
    return this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/scrimmage');
  }


}
