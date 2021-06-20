import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Notification, Type as NotificationType} from '../../models/notification';
import {ChatService} from '../../services/chat.service';
import {Type as ChatType} from '../chat/chat.component';
import {GameService} from '../../services/game.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  message = '';
  success = true;

  constructor(private notification: NotificationService,
              private chat: ChatService,
              private game: GameService,
              private users: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  acceptNotification(notification: Notification): void {
    switch (notification.type) {
      case NotificationType.FRIEND_REQUEST:
        this.users.handleFriendRequest(notification, true).subscribe((_) => {
          this.notification.delete(notification);
        });
        break;
      case NotificationType.GAME_INVITE:
        this.game.accept(notification, true).subscribe((game) => {
          if (game) {
            this.router.navigate(['/game/' + game._id]);
            this.notification.delete(notification);
          }
        });
        break;
      case NotificationType.PRIVATE_MESSAGE:
        this.chat.openChat(notification.sender, ChatType.USER);
        this.notification.delete(notification);
        break;
    }
  }


  denyNotification(notification: Notification): void {
    switch (notification.type) {
      case NotificationType.FRIEND_REQUEST:
        this.users.handleFriendRequest(notification, false).subscribe((_) => {
          this.notification.delete(notification);
        });
        break;
      case NotificationType.GAME_INVITE:
        this.game.accept(notification, false);
        this.notification.delete(notification);
        break;
      case NotificationType.PRIVATE_MESSAGE:
        this.notification.delete(notification);
        break;
    }
  }

  getNotifications(): Map<string, Notification> {
    return this.notification.getNotifications();
  }
}
