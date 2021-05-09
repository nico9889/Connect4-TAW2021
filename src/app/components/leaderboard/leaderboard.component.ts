import {Component, OnInit} from '@angular/core';
import {LeaderboardUser} from '../../models/User';
import {UserHttpService} from '../../services/user-http.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardUser[];

  constructor(private users: UserHttpService) {
    users.getLeaderboard().subscribe((leaderboard) => {
      this.leaderboard = leaderboard;
    });
  }

  ngOnInit(): void {
  }

}
