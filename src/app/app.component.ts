import {Component, OnInit} from '@angular/core';
import {Friend} from './models/Friend';
import {UserBasicAuthService} from './services/user-basic-auth.service';
import {NotificationService} from './services/notification.service';
import {Notification, Type} from './models/Notification';
import {UserHttpService} from './services/user-http.service';
import {SocketioService} from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: 'Connect 4';
  us: UserBasicAuthService;
  friends: Friend[] = [];
  notifications: Notification[] = [];
  alert: string;
  success: boolean;

  constructor(us: UserBasicAuthService,
              private users: UserHttpService,
              private ns: NotificationService,
              private socket: SocketioService) {
    this.us = us;
  }

  ngOnInit(): void {
    if (this.us.isLoggedIn()) {
      this.ns.getNotifications().subscribe((notifications) => {
        this.notifications = notifications;
      }, (err) => {
        console.error(err);
        this.notifications = [];
        this.notifications.push({type: Type.ERROR, senderId: '0', senderUsername: 'SYSTEM', expiry: new Date()});
      });
      this.getFriends();
    }
    console.log(this.us.isLoggedIn());
    if (this.us.isLoggedIn()) {
      this.socket.connect();
    }
  }

  private getFriends(): void {
    this.users.getFriends().subscribe((friends) => {
      this.friends = friends;
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

  acceptNotificaiton(notificaiton: Notification): void {
    this.removeNotification(notificaiton);
    if (notificaiton.type === Type.FRIEND_REQUEST) {
      this.respondFriendRequest(notificaiton, true);
    }
  }

  denyNotification(notification: Notification): void {
    this.removeNotification(notification);
    if (notification.type === Type.FRIEND_REQUEST) {
      this.respondFriendRequest(notification, false);
    }
  }

  sendFriendRequest(username: string): void {
    this.users.sendFriendRequest(username).subscribe((status) => {
      this.success = true;
      this.alert = 'Friend request sent successfully';
    }, (err) => {
      this.success = false;
      this.alert = 'Error while sending friend request';
    });
  }

  respondFriendRequest(notification: Notification, accept: boolean): void {
    this.users.respondFriendRequest(notification, accept).subscribe(
      (status) => {
        if (accept) {
          this.alert = 'Friend request accepted!';
        } else {
          this.alert = 'Friend request rejected!';
        }
        this.success = true;
      }, (err) => {
        this.alert = 'Error while responding to the friend request';
        this.success = false;
      });
  }
}
