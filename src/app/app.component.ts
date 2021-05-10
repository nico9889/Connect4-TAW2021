import {Component, OnInit} from '@angular/core';
import {FRIENDS} from './mock-friends';
import {Friend} from './models/Friend';
import {UserBasicAuthService} from './services/user-basic-auth.service';
import {NotificationService} from './services/notification.service';
import {Notification, Type} from './models/Notification';
import {not} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: 'Connect 4';
  us: UserBasicAuthService;
  friends: Friend[] = FRIENDS;
  notifications: Notification[] = [];

  constructor(us: UserBasicAuthService, private ns: NotificationService) {
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
  }
}
