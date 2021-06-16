import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Status} from '../models/status';
import {Notification} from '../models/notification';
import {baseUrl} from '../../costants';
import {Game, GameInfo} from '../models/game';
import {HttpClient} from '@angular/common/http';
import {SocketioService} from './socketio.service';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  queue = 'No';
  rankedQueue = 0;
  scrimmageQueue = 0;

  constructor(private auth: AuthService,
              private http: HttpClient,
              private socket: SocketioService,
              private router: Router) {
    socket.io.on('queue update', () => {
      if (this.auth.isLoggedIn()) {
        this.updateQueue();
      }
    });
    socket.io.on('game new', (data: { id: string }) => {
      if (data) {
        router.navigate(['/game/' + data.id]);
      }
    });
  }

  get(id: string): Observable<GameInfo> {
    return this.http.get<GameInfo>(baseUrl + '/v1/game/' + id);
  }

  spectate(id: string, follow: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/' + id + '/spectate', {follow});
  }

  sendMove(id: string, column: number): Observable<GameInfo> {
    return this.http.put<GameInfo>(baseUrl + '/v1/game/' + id, {column});
  }

  rankedSubscription(subscribe: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/ranked', {subscribe});
  }

  updateQueue(): void {
    this.queue = 'No';
    this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/ranked').subscribe((res) => {
      if (res.queued) {
        this.queue = 'Ranked';
      }
      this.rankedQueue = res.inQueue;
    });
    this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/scrimmage').subscribe((res) => {
      if (res.queued) {
        this.queue = 'Scrimmage';
      }
      this.scrimmageQueue = res.inQueue;
    });
  }

  rankedSubscribed(): Observable<{ queued: boolean, inQueue: number }> {
    return this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/ranked');
  }

  scrimmageSubscription(subscribe: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/game/scrimmage', {subscribe});
  }

  scrimmageSubscribed(): Observable<{ queued: boolean, inQueue: number }> {
    return this.http.get<{ queued: boolean, inQueue: number }>(baseUrl + '/v1/game/scrimmage');
  }

  accept(notification: Notification, accept: boolean): Observable<Game> {
    return this.http.put<Game>(baseUrl + '/v1/game/invite', {notification, accept});
  }

  request(id: string): Observable<Status> {
    return this.http.post<Status>(baseUrl + '/v1/game/invite/', {id, request: true});

  }
}
