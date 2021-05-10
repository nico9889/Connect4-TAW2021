import {Component, OnInit} from '@angular/core';
import {FRIENDS} from './mock-friends';
import {Friend} from './models/Friend';
import {UserBasicAuthService} from './services/user-basic-auth.service';
import {NotificationService} from './services/notification.service';
import {Notification, Type} from './models/Notification';
import {UserHttpService} from './services/user-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: 'Connect 4';
  us: UserBasicAuthService;
  friends: Friend[] = [];
  notifications: Notification[] = [];

  constructor(us: UserBasicAuthService, private users: UserHttpService, private ns: NotificationService) {
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
      this.users.getFriends().subscribe((friends) => {
        this.friends = friends;
      });
    }
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
      this.acceptFriendRequest(notificaiton);
    }
  }

  sendFriendRequest(username: string): void {
    this.users.sendFriendRequest(username).subscribe();
  }

  acceptFriendRequest(notification: Notification): void {
    this.users.acceptFriendRequest(notification).subscribe();
  }
}
