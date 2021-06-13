import {Injectable} from '@angular/core';
import {SocketioService} from './socketio.service';
import {HttpClient} from '@angular/common/http';
import {baseUrl} from '../../costants';
import {AuthService} from './auth.service';
import {Notification} from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];

  constructor(private http: HttpClient, private auth: AuthService, socket: SocketioService) {
    this.updateNotifications();

    socket.io.on('notification update', () => {
      this.updateNotifications();
    });

    this.auth.logged.subscribe(() => {
      this.updateNotifications();
    });
  }

  updateNotifications(): void {
    if (this.auth.isLoggedIn()) {
      console.log('Querying notifications');
      this.http.get<Notification[]>(baseUrl + '/v1/notifications').subscribe((notifications) => {
        this.notifications = notifications;
      });
    }
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }
}
