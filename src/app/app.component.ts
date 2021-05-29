import {Component, OnInit} from '@angular/core';
import {Friend} from './models/Friend';
import {UserBasicAuthService} from './services/user-basic-auth.service';
import {NotificationService} from './services/notification.service';
import {Notification, Type} from './models/Notification';
import {UserHttpService} from './services/user-http.service';
import {SocketioService} from './services/socketio.service';
import {GameService} from './services/game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: 'Connect 4';
  private audio;
  us: UserBasicAuthService;
  friends: Friend[] = [];
  notifications: Notification[] = [];
  alert: string;
  success: boolean;
  queued: string;
  onlineFriends: number;

  constructor(us: UserBasicAuthService,
              private users: UserHttpService,
              private games: GameService,
              private ns: NotificationService,
              private socket: SocketioService,
              private router: Router
  ) {
    this.audio = new Audio('assets/sounds/notification.ogg');
    this.audio.load();
    this.us = us;
    this.us.logged.subscribe((logged) => {
      if (logged) {
        this.load();
      } else {
        this.socket.disconnect();
      }
    });
  }

  private load(): void {
    this.socket.connect();
    this.getFriends();
    this.refreshSubscription();
    this.socket.socket.on('friend update', () => {
      this.getFriends();
    });
    this.socket.socket.on('notification update', () => {
      this.getNotifications();
      this.audio.play();
    });
    this.socket.socket.on('game new', (m) => {
      if (m.id) {
        this.router.navigate(['/game/' + m.id]);
      }
    });
    this.socket.socket.on('queue update', (_) => {
      this.refreshSubscription();
    });
  }

  ngOnInit(): void {
    if (this.us.isLoggedIn()) {
      if (!this.us.enabled()) {
        this.router.navigate(['/users/' + this.us.getId()]);
      }
      this.load();
    } else {
      this.socket.disconnect();
    }
  }

  refreshSubscription(): void {
    this.queued = undefined;
    this.games.rankedSubscribed().subscribe((result) => {
      if (result.queued === true) {
        this.queued = 'In queue: Ranked';
      }
    });
    this.games.scrimmageSubscribed().subscribe((result) => {
      if (result.queued === true) {
        this.queued = 'In queue: Scrimmage';
      }
    });
  }

  private getNotifications(): void {
    this.ns.getNotifications().subscribe((notifications) => {
      this.notifications = notifications.concat(this.notifications);
    }, (err) => {
      console.error(err);
      this.notifications = [];
      this.notifications.push({uid: '0', type: Type.ERROR, sender: '0', senderUsername: 'SYSTEM', expiry: new Date()});
    });
  }

  private getFriends(): void {
    this.users.getFriends().subscribe((friends) => {
      this.friends = friends;
      this.onlineFriends = 0;
      this.friends.forEach((friend) => {
        if (friend.online) {
          this.onlineFriends++;
        }
      });
    });
  }

  logout(): void {
    this.us.logout();
  }

  removeNotification(notification: Notification): void {
    this.notifications = this.notifications.filter((notf) => {
      return notf !== notification;
    });
  }

  acceptNotification(notification: Notification): void {
    this.removeNotification(notification);
    switch (notification.type) {
      case Type.FRIEND_REQUEST:
        this.respondFriendRequest(notification, true);
        break;
      case Type.GAME_INVITE:
        this.games.respondGameRequest(notification, true).subscribe((game) => {
          this.router.navigate(['/game/', game._id]);
        });
        break;
      case Type.PRIVATE_MESSAGE:
        console.log(notification);
        this.router.navigate(['/chat/', notification.sender]);
        break;
    }
  }

  denyNotification(notification: Notification): void {
    this.removeNotification(notification);
    if (notification.type === Type.FRIEND_REQUEST) {
      this.respondFriendRequest(notification, false);
    }
  }

  sendFriendRequest(username: string): void {
    this.users.sendFriendRequest(username).subscribe((_) => {
      this.success = true;
      this.alert = 'Friend request sent successfully';
    }, (_) => {
      this.success = false;
      this.alert = 'Error while sending friend request';
    });
  }

  respondFriendRequest(notification: Notification, accept: boolean): void {
    this.users.respondFriendRequest(notification, accept).subscribe(
      (_) => {
        if (accept) {
          this.alert = 'Friend request accepted!';
        } else {
          this.alert = 'Friend request rejected!';
        }
        this.success = true;
      }, (_) => {
        this.alert = 'Error while responding to the friend request';
        this.success = false;
      });
  }

  sendGameRequest(id: string): void {
    this.users.sendGameRequest(id).subscribe((_) => {
      this.success = true;
      this.alert = 'Game request sent successfully';
    }, (_) => {
      this.success = false;
      this.alert = 'Error while sending game request';
    });
  }
}
