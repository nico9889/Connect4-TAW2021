import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {HttpClient, HttpParams} from '@angular/common/http';
import {baseUrl} from '../../costants';
import {SocketioService} from './socketio.service';
import {AuthService} from './auth.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Status} from '../models/status';

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
      .on('friend online', (friend: { id: string }) => {
        const user = this.users.get(friend.id);
        if (user) {
          user.online = true;
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
      console.log('Querying user ' + id);
      this.http.get<User>(baseUrl + '/v1/users/' + id).subscribe((user) => {
        this.users.set(user._id, user);
      });
    }
  }

  getUser(id: string): Observable<User> {
    console.log('Getting user ' + JSON.stringify(id));
    const result = this.users.get(id);
    if (!result) {
      return this.http.get<User>(baseUrl + '/v1/users/' + id).pipe(
        tap((user) => {
          if (!this.users.has(user._id)) {
            this.users.set(user._id, user);
          }
        })
      );
    } else {
      return of(result);
    }
  }

  edit(id: string, data: { enabled?: boolean, avatar?: string, newPassword?: string, oldPassword?: string }): Observable<Status> {
    return this.http.put<Status>(baseUrl + '/v1/users/' + id, data);
  }
}
