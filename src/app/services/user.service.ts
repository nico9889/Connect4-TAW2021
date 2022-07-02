import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../constants';
import {SocketioService} from './socketio.service';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Status} from '../models/status';
import {Notification} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users = new Map<string, User>();
  friends = new Map<string, User>();

  constructor(private http: HttpClient, private auth: AuthService, socket: SocketioService) {
    if (auth.isLoggedIn()) {
      this.updateFriends();
      this.getUser(auth.getId()).subscribe();
    }

    auth.logged.subscribe((logged) => {
      if (logged) {
        this.updateFriends();
        this.getUser(auth.getId()).subscribe();
      }
    });

    socket.io
      .on('friend update', () => {
        this.updateFriends();
      })
      .on('friend online', (friend: { id: string, game?: string }) => {
        const user = this.users.get(friend.id);
        if (user) {
          user.online = true;
          if (friend.game) {
            user.game = friend.game;
          }
        }
      })
      .on('friend offline', (friend: { id: string }) => {
        const user = this.users.get(friend.id);
        if (user) {
          user.online = false;
        }
      });
  }

  updateAvatar(id: string): void {
    if (this.auth.isLoggedIn()) {
      console.log('Querying avatar ' + id);
      this.http.get<{ avatar: string }>(baseUrl + '/v1/users/' + id + '/avatar').subscribe((avatar) => {
        const user = this.users.get(id);
        if (user) {
          user.avatar = avatar.avatar;
        }
      }, (err) => {
        console.error(err);
      });
    }
  }

  updateFriends(): void {
    if (this.auth.isLoggedIn()) {
      console.log('Querying friends');
      const params = new HttpParams({
        fromObject: {
          friends: true
        }
      });
      this.http.get<User[]>(baseUrl + '/v2/users', {params}).subscribe((users) => {
        for (const user of users) {
          if (!this.users.has(user._id)) {
            this.users.set(user._id, user);
          }
          if (!this.friends.has(user._id)) {
            this.friends.set(user._id, user);
          }
          if (!user.avatar) {
            this.updateAvatar(user._id);
          }
        }
      });
    }
  }

  updateUsers(): void {
    if (this.auth.isLoggedIn()) {
      this.http.get<User[]>(baseUrl + '/v2/users').subscribe(
        (users) => {
          for (const user of users) {
            if (!this.users.has(user._id)) {
              this.users.set(user._id, user);
              if (!user.avatar) {
                this.updateAvatar(user._id);
              }
            }
          }
        }, (err) => {
          console.error(err);
        });
    }
  }

  updateUser(id: string): void {
    if (this.auth.isLoggedIn()) {
      this.http.get<User>(baseUrl + '/v1/users/' + id).subscribe((user) => {
        this.users.set(user._id, user);
      });
    }
  }

  getUser(id: string, force?: boolean): Observable<User> {
    if (id) {
      const result = this.users.get(id);
      if (!result || force) {
        return this.http.get<User>(baseUrl + '/v1/users/' + id).pipe(
          tap((user) => {
            console.log(JSON.stringify(user));
            if (!this.users.has(user._id)) {
              this.users.set(user._id, user);
            } else {
              const u = this.users.get(user._id);
              if (u) {
                u.enabled = user.enabled;
                u.online = user.online;
                u.avatar = user.avatar;
                u.victories = user.victories;
                u.defeats = user.defeats;
                u.game = user.game;
                u.last_password_change = user.last_password_change;
                this.updateAvatar(u._id);
              }
            }
          })
        );
      } else {
        return of(result);
      }
    } else {
      return of({
        _id: '',
        username: 'User'
      });
    }
  }

  edit(id: string, data: { enabled?: boolean, newPassword?: string, oldPassword?: string }): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/users/' + id, data);
  }

  uploadAvatar(id: string, avatar: File): Observable<Status> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post<Status>(baseUrl + '/v1/users/' + id + '/avatar', formData);
  }

  delete(id: string): Observable<Status> {
    return this.http.delete<Status>(baseUrl + '/v1/users/' + id).pipe(
      tap((_) => {
        this.users.delete(id);
      })
    );
  }

  sendFriendRequest(username: string): Observable<Status> {
    return this.http.post<Status>(baseUrl + '/v1/friendship/', {username});
  }

  handleFriendRequest(notification: Notification, accept: boolean): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/friendship/', {notification, accept});
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl + '/v1/leaderboard');
  }
}
