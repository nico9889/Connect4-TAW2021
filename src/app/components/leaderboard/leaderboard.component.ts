import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: User[] = [];
  constructor(private users: UserService) {
  }

  ngOnInit(): void {
    this.users.getLeaderboard().subscribe((users) => {
      this.leaderboard = users;
    });
  }

}
