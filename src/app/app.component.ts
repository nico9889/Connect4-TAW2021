import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {SocketioService} from './services/socketio.service';
import {NotificationService} from './services/notification.service';
import {UserService} from './services/user.service';
import {GameService} from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth: AuthService;

  constructor(auth: AuthService,
              private notification: NotificationService,
              private users: UserService,
              private game: GameService
  ) {
    this.auth = auth;
  }

  logout(): void {
    this.auth.logout();
  }

  getQueue(): string {
    return this.game.queue;
  }

  getNotificationNumber(): number {
    return this.notification.getNotifications().size;
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
