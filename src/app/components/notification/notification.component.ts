import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Notification, Type as NotificationType} from '../../models/notification';
import {ChatService} from '../../services/chat.service';
import {Type as ChatType} from '../chat/chat.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  message = '';
  success = true;

  constructor(private notification: NotificationService, private chat: ChatService) {
  }

  ngOnInit(): void {
  }

  acceptNotification(notification: Notification): void {
    switch (notification.type) {
      case NotificationType.FRIEND_REQUEST:
        break;
      case NotificationType.GAME_INVITE:
        break;
      case NotificationType.PRIVATE_MESSAGE:
        this.chat.openChat(notification.sender, ChatType.USER);
        break;
    }
  }


  denyNotification(notification: Notification): void {

  }

  getNotifications(): Notification[] {
    return this.notification.getNotifications();
  }
}
