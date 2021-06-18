import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private rankedSub = false;
  private scrimmageSub = false;
  alert = '';
  success = true;
  auth: AuthService;
  game: GameService;

  constructor(auth: AuthService, private users: UserService, game: GameService) {
    this.auth = auth;
    this.game = game;
  }

  ngOnInit(): void {
  }

  rankedSubscription(): void {
    this.game.rankedSubscription(!this.rankedSub).subscribe((_) => {
      this.rankedSub = !this.rankedSub;
    });
  }

  scrimmageSubscription(): void {
    this.game.scrimmageSubscription(!this.scrimmageSub).subscribe((_) => {
      this.scrimmageSub = !this.scrimmageSub;
    });
  }

  getFriends(): Map<string, User> {
    return this.users.friends;
  }

  sendGameRequest(id: string): void {
    this.game.request(id).subscribe((_) => {
      this.alert = 'Game request sent successfully';
      this.success = true;
    }, (err) => {
      this.alert = 'Failed to send game request';
      this.success = false;
    });
  }
}
