import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SocketioService} from './services/socketio.service';
import {NotificationService} from './services/notification.service';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthService;

  constructor(auth: AuthService,
              public socket: SocketioService,
              private notification: NotificationService,
              private users: UserService
  ) {
    this.auth = auth;
  }

  logout(): void {
    this.auth.logout();
  }

  getNotificationNumber(): number {
    return this.notification.getNotifications().length;
  }

  getFriendsNumber(): number {
    let online = 0;
    this.users.friends.forEach((user, _) => {
      if (user.online) {
        online++;
      }
    });
    return online;
  }
}
