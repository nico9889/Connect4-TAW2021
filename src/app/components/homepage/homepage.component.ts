import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserBasicAuthService} from '../../services/user-basic-auth.service';
import {User} from '../../models/User';
import {UserHttpService} from '../../services/user-http.service';
import {GameService} from '../../services/game.service';
import {SocketioService} from '../../services/socketio.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  rankedBadge: string;
  user: User = null;
  alert: string;
  success: boolean;
  scrimmageBadge: string;
  inQueue: boolean;
  private scrimmageQueue = false;
  private rankedQueue = false;

  constructor(public us: UserBasicAuthService, private users: UserHttpService, public game: GameService, public socket: SocketioService) {
    if (us.isLoggedIn()) {
      users.getUser(us.getId()).subscribe((user) => {
        this.user = user;
      });
    }
  }

  ngOnDestroy(): void {
    this.socket.socket.off('queue update');
  }

  ngOnInit(): void {
    this.refreshSubscription();
    this.socket.socket.on('queue update', (_) => {
      this.refreshSubscription();
    });
  }

  refreshSubscription(): void {
    this.rankedBadge = 'In queue:';
    this.scrimmageBadge = 'In queue:';
    this.game.rankedSubscribed().subscribe((result) => {
      this.rankedBadge = 'In queue: ' + result.inQueue;
      this.rankedQueue = result.queued;
      this.inQueue = this.rankedQueue || this.scrimmageQueue;
    });

    this.game.scrimmageSubscribed().subscribe((result) => {
      this.scrimmageBadge = 'In queue: ' + result.inQueue;
      this.scrimmageQueue = result.queued;
      this.inQueue = this.rankedQueue || this.scrimmageQueue;
    });
  }

  rankedSubscription(): void {
    this.game.rankedSubscription(!this.rankedQueue).subscribe((_) => {
      if (!this.rankedQueue) {
        this.alert = 'Queued for a new game!';
      } else {
        this.alert = 'Removed from queue!';
      }
      this.success = true;
    }, (err) => {
      console.error(err);
      this.alert = 'Error while queueing for a new game!';
      this.success = false;
    });
  }

  scrimmageSubscription(): void {
    this.game.scrimmageSubscription(!this.scrimmageQueue).subscribe((_) => {
      if (!this.scrimmageQueue) {
        this.alert = 'Queued for a new game!';
      } else {
        this.alert = 'Removed from queue!';
      }
      this.success = true;
    }, (err) => {
      console.error(err);
      this.alert = 'Error while queueing for a new game!';
      this.success = false;
    });
  }
}
